// system imports ------------------------------------------------------------------------------- //
import fs from "fs"
import http from "http"
import https from "https"

// third-party imports -------------------------------------------------------------------------- //
import cors from "cors"
import express from "express"

// local imports -------------------------------------------------------------------------------- //
import transactions from "./routes/customers/transactions.mjs"

const app = express()

const options = {
    key: fs.readFileSync("auth/server.key"),
    cert: fs.readFileSync("auth/server.cert"),
}

app.use(express.json())

app.use(cors())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    res.setHeader("Access-Control-Allow-Methods", "*")

    next()
})

app.use(transactions)

let server = https.createServer(options, app)

console.log("Running on port: " + process.env.PORT)

server.listen(process.env.PORT)
