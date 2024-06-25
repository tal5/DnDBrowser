import express, { Express, Request, Response } from "express"
import dotenv from 'dotenv'
import Database from 'better-sqlite3'
import { Kysely, SqliteDialect } from "kysely"
import { json } from "stream/consumers"
import e from "express"

dotenv.config()

const app = express()
const port = process.env.PORT

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

app.get("/api/spells", (req: Request, res: Response) => {
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

app.get("/api/spell/:spell", (req: Request, res: Response) => {
    db.selectFrom("spells").where("name", "=", req.params.spell).selectAll().executeTakeFirstOrThrow().then(
        spells => res.json(spells),
        _ => res.status(404).send("Invalid spell name.")
    )
})

app.get("/api/types/:type", (req: Request, res: Response) => {
    const type = req.params.type
    db.selectFrom("spells").select(type).distinct().execute().then(types => {
        res.json(types.map(value => value[type]).filter(value => value.length ?? 1 > 0))
    }, _ => {
        res.status(404).send("Invalid type.")
    })
})

app.get("/meta.zip", (req: Request, res: Response) => {
    res.sendFile("Denizen-Core-Fork.zip", { root: __dirname })
})


app.listen(port, () => console.log("Running on port", port))