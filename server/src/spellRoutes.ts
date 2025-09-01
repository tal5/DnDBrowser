import Database from "better-sqlite3";
import { Request, Response, Router } from "express";
import { Kysely, SqliteDialect } from "kysely";

const router = Router();

interface SpellsDatabase {
    spells: any
}
const dialect = new SqliteDialect({ database: new Database("spells.db") })
const db = new Kysely<SpellsDatabase>({ dialect })
const exactSpellListFilters = ["school", "level", "duration", "range"]
const partialSpellFilters = ["name"]
const partialSpellListFilters = ["casting_time", "spell_lists", "components", "source"]

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
    db.selectFrom("spells").select(type).distinct().execute().then(types => {
        res.json(types.map(value => value[type]).filter(value => value.length ?? 1 > 0))
    }, _ => {
        res.status(404).send("Invalid type.")
    })
})

router.get("/:spell", (req: Request, res: Response) => {
    db.selectFrom("spells").where("name", "=", req.params.spell).selectAll().executeTakeFirstOrThrow().then(
        spells => res.json(spells),
        _ => res.status(404).send("Invalid spell name.")
    )
})

export default router
