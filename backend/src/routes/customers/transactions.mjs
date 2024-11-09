// third-party imports -------------------------------------------------------------------------- //
import dotenv from "dotenv"
import express from "express"
import { ObjectId } from "mongodb"

// local imports -------------------------------------------------------------------------------- //
import { customers } from "../../db.mjs"
import currenciesData from "../../data/currencies.json" with { type: "json" }
import providersData from "../../data/providers.json" with { type: "json" }

// set up environment variables
dotenv.config()

// extract data from data files
const currencies = currenciesData["data"]
const providers = providersData["data"]

// regex patterns
const senderRegEx = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/
const receiverRegEx = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/

// create router
const transactions = express.Router()

// declare route
const route = "/api/customers/transactions"

// GET route
transactions.get(route, async (req, res) => {
    // check if any data at all was provided
    if (!req.body) {
        res.send("No data provided").status(400)

        return
    }

    // check if the correct amount of keys were provided
    if (Object.keys(req.body).length == 0) {
        res.send("Not enough data. Expected 1 key, got " + Object.keys(req.body).length).status(400)

        return
    } else if (Object.keys(req.body).length > 1) {
        res.send("Too much data. Expected 1 keys, got " + Object.keys(req.body).length).status(400)

        return
    }

    // extract data from body
    const key = req.body.key

    // check if required key was provided
    if (!key) {
        res.send("No key provided").status(400)

        return
    }

    // check if key is a valid key
    if (key !== process.env.KEY) {
        res.send("Unauthorized").status(401)

        return
    }

    // get database collection
    const collection = await customers.collection("transactions")

    // get all documents from database
    const results = await collection.find({}).toArray()

    res.send(results).status(200)
})

// POST route
transactions.post(route, async (req, res) => {
    // check if any data at all was provided
    if (!req.body) {
        res.send("No data provided").status(400)

        return
    }

    // check if the correct amount of keys were provided
    if (Object.keys(req.body).length < 5) {
        res.send("Not enough data. Expected 5 keys, got " + Object.keys(req.body).length).status(
            400
        )

        return
    } else if (Object.keys(req.body).length > 5) {
        res.send("Too much data. Expected 5 keys, got " + Object.keys(req.body).length).status(400)

        return
    }

    // extract data from body
    const sender = req.body.sender
    const receiver = req.body.receiver
    const amount = req.body.amount
    const currency = req.body.currency
    const provider = req.body.provider

    // check if all required keys were provided
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

    // check if sender is a valid email address
    if (!sender.match(senderRegEx)) {
        res.send("Invalid sender").status(400)

        return
    }

    // check if receiver is a valid BIC
    if (!receiver.match(receiverRegEx)) {
        res.send("Invalid receiver").status(400)

        return
    }

    // check if amount is a valid number above 0
    if (isNaN(amount) || amount < 0) {
        res.send("Invalid amount").status(400)

        return
    }

    // check if currency is a valid currency
    if (!currencies[currency]) {
        res.send("Invalid currency").status(400)

        return
    }

    // check if provider is a valid provider
    if (!providers.includes(provider)) {
        res.send("Invalid provider").status(400)

        return
    }

    // create document to enforce schema
    const document = {
        timestamp: new Date(Date.now()).toISOString(),
        sender: sender,
        receiver: receiver,
        amount: amount,
        currency: currency,
        provider: provider,
    }

    // get database collection
    const collection = await customers.collection("transactions")

    // insert document into database
    const result = await collection.insertOne(document)

    // check if document was inserted
    if (result.insertedId !== null) {
        res.send("Transaction successful").status(201)

        return
    } else {
        res.send("Transaction failed").status(500)

        return
    }
})

export default transactions
