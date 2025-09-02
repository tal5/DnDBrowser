import Database from "better-sqlite3";
import { Request, Response, Router } from "express";
import {
    Kysely,
    SqliteDialect,
    KyselyPlugin,
    PluginTransformQueryArgs,
    RootOperationNode,
    PluginTransformResultArgs, QueryResult, UnknownRow
} from "kysely";
import SpellData, {SpellDataKey, isValidSpellDataKey} from "../../common/types/SpellData";

const router = Router();

interface SpellsDatabase {
    spells: SpellData
}

class SpellParsingPlugin implements KyselyPlugin {

    private static readonly JSON_COLUMNS: SpellDataKey[] = ["components", "spell_lists"]

    transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
        // no-op
        return args.node
    }

    async transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>> {
        const result = args.result
        if (!result.rows) {
            return result
        }
        const transformedRows = result.rows.map(row => {
            const newRow = { ...row }
            for (const column of SpellParsingPlugin.JSON_COLUMNS) {
                const value = newRow[column]
                if (value && typeof value === "string") {
                    try {
                        newRow[column] = JSON.parse(value)
                    }
                    catch (error) {
                        console.warn(`Failed to parse JSON for column '${column}':`, error)
                    }
                }
            }
            return newRow
        })
        return { ...result, rows: transformedRows }
    }
}

const dialect = new SqliteDialect({ database: new Database("spells.db") })
const db = new Kysely<SpellsDatabase>({ dialect, plugins: [new SpellParsingPlugin()] })
const exactSpellListFilters: SpellDataKey[] = ["school", "level", "duration", "range"]
const partialSpellFilters: SpellDataKey[] = ["name"]
const partialSpellListFilters: SpellDataKey[] = ["casting_time", "spell_lists", "components", "source"]

function getQueryParam(param: string, req: Request, res: Response): string | undefined {
    const value = req.query[param]
    if (value == undefined) {
        return undefined
    }
    if (typeof value !== 'string') {
        res.status(422).send(`Query param '${param}' has invalid data: must be a string`)
    }
    return value as string
}

router.get("/", (req, res) => {
    let query = db.selectFrom("spells")
    for (const param of partialSpellFilters) {
        const value = getQueryParam(param, req, res)
        if (value != undefined) {
            query = query.where(param, "like", `%${value}%`)
        }
    }
    for (const param of exactSpellListFilters) {
        const value = getQueryParam(param, req, res)
        if (value != undefined) {
            const values: string[] = JSON.parse(value)
            if (values.length > 0) {
                query = query.where(param, "in", values)
            }
        }
    }
    for (const param of partialSpellListFilters) {
        const value = getQueryParam(param, req, res)
        if (value != undefined) {
            const values: string[] = JSON.parse(value)
            if (values.length > 0) {
                query = query.where(eb => eb.or(values.map(filter => eb(param, "like", `%${filter}%`))))
            }
        }
    }
    query.selectAll().execute().then(spells => {
        res.json(spells)
    })
})

router.get("/types/:type", (req: Request, res: Response) => {
    const type = req.params.type
    if (!isValidSpellDataKey(type)) {
        return res.status(404).send("Invalid type.")
    }
    db.selectFrom("spells").select(type).distinct().execute().then(types => {
        const filtered = types.map(value => value[type]).filter(value => typeof value === "number" || value.length > 0)
        res.json(filtered.some(Array.isArray) ? [...new Set(filtered.flat())] : filtered)
    })
})

router.get("/:spell", (req: Request, res: Response) => {
    db.selectFrom("spells").where("name", "=", req.params.spell).selectAll().executeTakeFirstOrThrow().then(
        spells => res.json(spells),
        _ => res.status(404).send("Invalid spell name.")
    )
})

export default router
