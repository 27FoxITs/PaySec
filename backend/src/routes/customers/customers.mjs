// third-party imports -------------------------------------------------------------------------- //
import dotenv from "dotenv"
import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import rateLimit from "express-rate-limit"

// local imports -------------------------------------------------------------------------------- //
import { customersDB } from "../../db.mjs"

// set up environment variables
dotenv.config()

// regex patterns
const nameRegEx = /^[A-Za-z' ]+$/
const idNumberRegEx = /^\d{13}$/
const accountNumberRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/
const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

// create router
const customers = express.Router()

// declare route
const route = "/api/customers"

// enforce rate-limiting to prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
})

customers.use(limiter)

// helper function for SSL enforcement
customers.use((req, res, next) => {
    if (req.secure || process.env.NODE_ENV !== "production") {
        next()
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`)
    }
})

// POST /login route
customers.post(`${route}/login`, async (req, res) => {
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
    const email = req.body.email
    const password = req.body.password

    // check if all required keys were provided
    if (!email) {
        res.send({ message: "No email provided" }).status(400)

        return
    } else if (!password) {
        res.send({ message: "No password provided" }).status(400)

        return
    }

    // check if email is a valid email address
    if (!email.match(emailRegEx)) {
        res.send({ message: "Invalid email format" }).status(400)

        return
    }

    // check if password is a valid password
    if (!password.match(passwordRegEx)) {
        res.send({
            message:
                "Password must be at least 8 characters long, contain at least one uppercase " +
                "letter, one lowercase letter, and one digit",
        }).status(400)

        return
    }

    // get database collection
    const collection = await customersDB.collection("users")

    // get user document
    const user = await collection.findOne({ email })

    // check if user exists
    if (!user) {
        res.send({ message: "User not found" }).status(400)

        return
    }

    // check if password is correct
    if (!(await bcrypt.compare(password, user.password))) {
        res.send({ message: "Invalid password" }).status(401)

        return
    }

    // generate token
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.send({ message: "Login successful", token }).status(200)
})

// POST /register route
customers.post(`${route}/register`, async (req, res) => {
    // check if any data at all was provided
    if (!req.body) {
        res.send({ message: "No data provided" }).status(400)

        return
    }

    // check if the correct amount of keys were provided
    if (Object.keys(req.body).length < 5) {
        res.send({
            message: "Not enough data. Expected 5 keys, got " + Object.keys(req.body).length,
        }).status(400)

        return
    } else if (Object.keys(req.body).length > 5) {
        res.send({
            message: "Too much data. Expected 5 keys, got " + Object.keys(req.body).length,
        }).status(400)

        return
    }

    // extract data from body
    const name = req.body.name
    const idNumber = req.body.idNumber
    const accountNumber = req.body.accountNumber
    const email = req.body.email
    const password = req.body.password

    // check if all required keys were provided
    if (!name) {
        res.send({ message: "No name provided" }).status(400)

        return
    } else if (!idNumber) {
        res.send({ message: "No idNumber provided" }).status(400)

        return
    } else if (!accountNumber) {
        res.send({ message: "No accountNumber provided" }).status(400)

        return
    } else if (!email) {
        res.send({ message: "No email provided" }).status(400)

        return
    } else if (!password) {
        res.send({ message: "No password provided" }).status(400)

        return
    }

    // check if keys are valid
    if (!name.match(nameRegEx)) {
        res.send({ message: "Invalid name" }).status(400)

        return
    } else if (!idNumber.match(idNumberRegEx)) {
        res.send({ message: "Invalid ID number" }).status(400)

        return
    } else if (!accountNumber.match(accountNumberRegex)) {
        res.send({ message: "Invalid account number" }).status(400)

        return
    } else if (!email.match(emailRegEx)) {
        res.send({ message: "Invalid email format" }).status(400)

        return
    } else if (!password.match(passwordRegEx)) {
        res.send({
            message:
                "Password must be at least 8 characters long, contain at least one uppercase " +
                "letter, one lowercase letter, and one digit",
        }).status(400)

        return
    }

    // get database collection
    const collection = await customersDB.collection("users")

    // check if email already exists
    if ((await collection.find({ email: email }).count()) > 0) {
        res.send({ message: "User already exists" }).status(400)

        return
    }

    // hash password
    const hash = await bcrypt.hash(password, 12)

    // create document to enforce schema
    const document = {
        name: name,
        idNumber: idNumber,
        accountNumber: accountNumber,
        email: email,
        password: hash,
        created: new Date(Date.now()).toISOString(),
    }

    // insert document
    const result = await collection.insertOne(document)

    // check if document was inserted
    if (result.insertedId !== null) {
        // On succesful registration, generates jwt token
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.send({ message: "Registration successful" }).status(201)

        return
    } else {
        res.send({ message: "Registration failed" }).status(500)

        return
    }
})

export default customers
