// third-party imports -------------------------------------------------------------------------- //
import express from "express"
import { ObjectId } from "mongodb"

// local imports -------------------------------------------------------------------------------- //
import db from "../../db.mjs"

const ROUTE = "/api/customers/transactions"

const transactions = express.Router()

transactions.get(ROUTE, async (req, res) => {
    let collection = await db.collection("transactions")
    let results = await collection.find({}).toArray()

    res.send(results).status(200)
})

transactions.post(ROUTE, async (req, res) => {
    let collection = await db.collection("transactions")
    let result = await collection.insertOne(req.body)

    res.send(result).status(200)
})

export default transactions
