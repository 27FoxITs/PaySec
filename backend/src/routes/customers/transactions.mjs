// third-party imports -------------------------------------------------------------------------- //
import { ObjectId } from "mongodb"
import dotenv from "dotenv"
import express from "express"

// local imports -------------------------------------------------------------------------------- //
import currenciesData from "../../data/currencies.json" with { type: "json" }
import providersData from "../../data/providers.json" with { type: "json" }
import jwtMiddleware from "../middleware/jwtMiddleware.mjs";
import { customersDB } from "../../db.mjs"

// set up environment variables
dotenv.config()

// extract data from data files
const currencies = currenciesData["data"]
const providers = providersData["data"]

// regex patterns
const senderRegEx = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/
const receiverRegEx = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/
const filterTimestampRegex =
    /^(>|<)?\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z(:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)?$/

// create router
const transactions = express.Router()

// declare route
const route = "/api/customers/transactions"

// GET route
transactions.get(route, jwtMiddleware, async (req, res) => {
    // check if any data at all was provided

    if (!req.query) {
        res.send({ message: "No data provided" }).status(400)

        return
    }

    // check if the correct amount of keys were provided
    if (Object.keys(req.body).length > 1) {
        res.send({
            message: "Too much data. Expected at most 1 keys, got " + Object.keys(req.body).length,
        }).status(400)

        return
    }

    // extract data from body
    const filter = req.body.filter
    let timestamp
    let sender
    let receiver
    let verified

    // check if filter is provided
    if (filter) {
        if (Object.keys(filter).length < 1) {
            res.send({
                message:
                    "Not enough data. Filter expected at least 1 key, got " +
                    Object.keys(filter).length,
            }).status(400)

            return
        } else if (Object.keys(filter).length > 4) {
            res.send({
                message:
                    "Too much data. Filter expected at most 4 keys, got " +
                    Object.keys(filter).length,
            }).status(400)

            return
        }

        // extract data from filter
        timestamp = filter.timestamp
        sender = filter.sender
        receiver = filter.receiver
        verified = filter.verified

        // check if keys are valid
        if (timestamp) {
            if (!timestamp.match(filterTimestampRegex)) {
                res.send({ message: "Invalid timestamp" }).status(400)

                return
            }
        }
        if (sender) {
            if (!sender.match(senderRegEx)) {
                res.send({ message: "Invalid sender" }).status(400)

                return
            }
        }
        if (receiver) {
            if (!receiver.match(receiverRegEx)) {
                res.send({ message: "Invalid receiver" }).status(400)

                return
            }
        }
        if (verified) {
            if (typeof verified !== "boolean") {
                res.send({ message: "Invalid verified" }).status(400)

                return
            }
        }
    }

    // get database collection
    const collection = await customersDB.collection("transactions")

    // get all documents from database
    let results = await collection.find({}).toArray()

    // filter documents based on timestamp
    if (timestamp) {
        if (timestamp.startsWith(">")) {
            timestamp = timestamp.slice(1)

            results = results.filter((result) => new Date(result.timestamp) > new Date(timestamp))
        } else if (timestamp.startsWith("<")) {
            timestamp = timestamp.slice(1)

            results = results.filter((result) => new Date(result.timestamp) < new Date(timestamp))
        } else if (timestamp.includes(":")) {
            const timestamps = timestamp.split(":")

            results = results.filter(
                (result) =>
                    new Date(result.timestamp) > new Date(timestamps[0]) &&
                    new Date(result.timestamp) < new Date(timestamps[1])
            )
        }
    }

    // filter documents based on sender
    if (sender) {
        results = results.filter((result) => result.sender === sender)
    }

    // filter documents based on receiver
    if (receiver) {
        results = results.filter((result) => result.receiver === receiver)
    }

    // filter documents based on verified
    if (verified !== undefined) {
        results = results.filter((result) => result.verified === verified)
    }

    res.send(results).status(200)
})

// PATCH route
transactions.patch(route, jwtMiddleware, async (req, res) => {
    // check if any data at all was provided
    if (!req.body) {
        res.send({ message: "No data provided" }).status(400)

        return
    }

    // check if the correct amount of keys were provided
    if (Object.keys(req.body).length < 2) {
        res.send({
            message: "Not enough data. Expected 2 keys, got " + Object.keys(req.body).length,
        }).status(400)

        return
    } else if (Object.keys(req.body).length > 2) {
        res.send({
            message: "Too much data. Expected 2 keys, got " + Object.keys(req.body).length,
        }).status(400)

        return
    }

    // extract data from body
    const oid = req.body.oid
    const verified = req.body.verified

    // check if all required keys were provided
    if (!oid) {
        res.send({ message: "No oid provided" }).status(400)

        return
    } else if (verified === undefined) {
        res.send({ message: "No verified provided" }).status(400)

        return
    }

    // check if keys are valid
    if (!ObjectId.isValid(oid)) {
        res.send({ message: "Invalid oid" }).status(400)

        return
    } else if (typeof verified !== "boolean") {
        res.send({ message: "Invalid verified" }).status(400)

        return
    }

    // get database collection
    const collection = await customersDB.collection("transactions")

    // update document in database
    await collection.updateOne({ _id: new ObjectId(oid) }, { $set: { verified: verified } })

    res.send({ message: "Update successful" }).status(200)
})

// POST route
transactions.post(route, jwtMiddleware, async (req, res) => {
    // check if any data at all was provided
    if (!req.body) {
        res.send({ message: "No data provided" }).status(400)

        return
    }

    // check if the correct amount of keys were provided
    if (Object.keys(req.body).length < 6) {
        res.send({
            message: "Not enough data. Expected 5 keys, got " + Object.keys(req.body).length,
        }).status(400)

        return
    } else if (Object.keys(req.body).length > 6) {
        res.send({
            message: "Too much data. Expected 5 keys, got " + Object.keys(req.body).length,
        }).status(400)

        return
    }

    // extract data from body
    const sender = req.body.sender
    const receiver = req.body.receiver
    const amount = req.body.amount
    const currency = req.body.currency
    const provider = req.body.provider
    const accountInfo = req.body.accountInfo

    // check if all required keys were provided
    if (!sender) {
        res.send({ message: "No sender provided" }).status(400)

        return
    } else if (!receiver) {
        res.send({ message: "No receiver provided" }).status(400)

        return
    } else if (!amount) {
        res.send({ message: "No amount provided" }).status(400)

        return
    } else if (!currency) {
        res.send({ message: "No currency provided" }).status(400)

        return
    } else if (!provider) {
        res.send({ message: "No provider provided" }).status(400)

        return
    } else if (!accountInfo) {
        res.send({ message: "No accountInfo provided" }).status(400)
    }

    // check if sender is a valid email address
    if (!sender.match(senderRegEx)) {
        res.send({ message: "Invalid sender" }).status(400)

        return
    }

    // check if receiver is a valid BIC
    if (!receiver.match(receiverRegEx)) {
        res.send({ message: "Invalid receiver" }).status(400)

        return
    }

    // check if amount is a valid number above 0
    if (isNaN(amount) || amount < 0) {
        res.send({ message: "Invalid amount" }).status(400)

        return
    }

    // check if currency is a valid currency
    if (!currencies[currency]) {
        res.send({ message: "Invalid currency" }).status(400)

        return
    }

    // check if provider is a valid provider
    if (!providers.includes(provider)) {
        res.send({ message: "Invalid provider" }).status(400)

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
        accountInfo: accountInfo,
    }

    // get database collection
    const collection = await customersDB.collection("transactions")

    // insert document into database
    const result = await collection.insertOne(document)

    // check if document was inserted
    if (result.insertedId !== null) {
        res.send({ message: "Transaction successful" }).status(201)

        return
    } else {
        res.send({ message: "Transaction failed" }).status(500)

        return
    }
})

export default transactions
