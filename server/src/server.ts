import express from "express"
import dotenv from "dotenv"
import spellRouter from "./spellRoutes"

dotenv.config()

const app = express()
const port = process.env.PORT

app.use("/api/spells", spellRouter)

app.listen(port, () => console.log("Running on port", port))