// system imports ------------------------------------------------------------------------------- //
import fs from "fs"
import https from "https"

// third-party imports -------------------------------------------------------------------------- //
import cors from "cors"
import express from "express"

// local imports -------------------------------------------------------------------------------- //
import customers from "./routes/customers/customers.mjs"
import employees from "./routes/employees/employees.mjs"
import transactions from "./routes/customers/transactions.mjs"

// create app
const app = express()

// add key and certificate options for ssl
const options = {
    key: fs.readFileSync("auth/server.key"),
    cert: fs.readFileSync("auth/server.cert"),
}

// add json middleware to parse json bodies
app.use(express.json())

// add cors middleware to allow cross-origin requests
app.use(cors())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    res.setHeader("Access-Control-Allow-Methods", "*")

    next()
})

// add routes
app.use(customers)
app.use(employees)
app.use(transactions)

// create https server
let server = https.createServer(options, app)
server.listen(process.env.PORT)
