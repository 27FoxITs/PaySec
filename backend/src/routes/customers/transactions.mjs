// third-party imports -------------------------------------------------------------------------- //
import currencyapi from "@everapi/currencyapi-js"
import dotenv from "dotenv"
import express from "express"
import { ObjectId } from "mongodb"

// local imports -------------------------------------------------------------------------------- //
import currencies from "../../data/currencies.mjs"
import db from "../../db.mjs"
import providers from "../../data/providers.mjs"

dotenv.config()

const ROUTE = "/api/customers/transactions"

const transactions = express.Router()

transactions.get(ROUTE, async (req, res) => {
    const collection = await db.collection("transactions")
    const results = await collection.find({}).toArray()

    res.send(results).status(200)
})

transactions.post(ROUTE, async (req, res) => {
    if (!req.body) {
        res.send("No data provided").status(400)

        return
    }

    if (Object.keys(req.body).length < 5) {
        res.send("Not enough data. Expected 5 keys, got " + Object.keys(req.body).length).status(
            400
        )

        return
    } else if (Object.keys(req.body).length > 5) {
        res.send("Too much data. Expected 5 keys, got " + Object.keys(req.body).length).status(400)

        return
    }

    const sender = req.body.sender
    const receiver = req.body.receiver
    const amount = req.body.amount
    const currency = req.body.currency
    const provider = req.body.provider

    if (!sender) {
        res.send("No sender provided").status(400)

        return
    } else if (!receiver) {
        res.send("No receiver provided").status(400)

        return
    } else if (!amount) {
        res.send("No amount provided").status(400)

        return
    } else if (!currency) {
        res.send("No currency provided").status(400)

        return
    } else if (!provider) {
        res.send("No provider provided").status(400)

        return
    }

    if (!/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/.test(sender)) {
        res.send("Invalid sender").status(400)

        return
    }

    if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(receiver)) {
        res.send("Invalid receiver").status(400)

        return
    }

    if (isNaN(amount) || amount < 0) {
        res.send("Invalid amount").status(400)

        return
    }

    if (!currencies[currency]) {
        res.send("Invalid currency").status(400)

        return
    }

    if (!providers[provider]) {
        res.send("Invalid provider").status(400)

        return
    }

    const document = {
        timestamp: new Date(Date.now()).toISOString(),
        sender: sender,
        receiver: receiver,
        amount: amount,
        currency: currency,
        provider: provider,
    }

    const collection = await db.collection("transactions")
    const result = await collection.insertOne(document)

    res.send(result).status(200)
})

export default transactions
