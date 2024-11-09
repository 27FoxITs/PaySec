// third-party imports -------------------------------------------------------------------------- //
import dotenv from "dotenv"
import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import rateLimit from "express-rate-limit"

// local imports -------------------------------------------------------------------------------- //
import { employeesDB } from "../../db.mjs"

// regex patterns
const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
const nameRegEx = /^[A-Za-z' ]+$/

// create router
const employees = express.Router()

// declare route
const route = "/api/employees"

// enforce rate-limiting to prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
})

employees.use(limiter) // apply to all requests

// helper function for SSL enforcement
employees.use((req, res, next) => {
    if (req.secure || process.env.NODE_ENV !== "production") {
        next()
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`)
    }
})

// POST /login route
employees.post(`${route}/login`, async (req, res) => {
    // check if any data at all was provided
    if (!req.body) {
        res.send("No data provided").status(400)

        return
    }

    // check if the correct amount of keys were provided
    if (Object.keys(req.body).length < 2) {
        res.send("Not enough data. Expected 2 keys, got " + Object.keys(req.body).length).status(
            400
        )

        return
    } else if (Object.keys(req.body).length > 2) {
        res.send("Too much data. Expected 2 keys, got " + Object.keys(req.body).length).status(400)

        return
    }

    // extract data from body
    const email = req.body.email
    const password = req.body.password

    // check if all required keys were provided
    if (!email) {
        res.send("No email provided").status(400)

        return
    } else if (!password) {
        res.send("No password provided").status(400)

        return
    }

    // check if email is a valid email address
    if (!email.match(emailRegEx)) {
        res.send("Invalid email").status(400)

        return
    }

    // check if password is a valid password
    if (!password.match(passwordRegEx)) {
        res.send("Invalid password").status(400)

        return
    }

    // get database collection
    const collection = employeesDB.collection("users")

    // get user document
    const user = await collection.findOne({ email })

    // check if user exists
    if (!user) {
        res.send("User not found").status(404)

        return
    }

    // check if password is correct
    if (!(await bcrypt.compare(password, user.password))) {
        res.send("Invalid password").status(401)

        return
    }

    // generate token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    })

    res.send({ message: "Login successful", token }).status(200)
})

// POST /register route
employees.post(`${route}/register`, async (req, res) => {
    // check if any data at all was provided
    if (!req.body) {
        res.send("No data provided").status(400)

        return
    }

    // check if the correct amount of keys were provided
    if (Object.keys(req.body).length < 3) {
        res.send("Not enough data. Expected 3 keys, got " + Object.keys(req.body).length).status(
            400
        )

        return
    } else if (Object.keys(req.body).length > 3) {
        res.send("Too much data. Expected 3 keys, got " + Object.keys(req.body).length).status(400)

        return
    }

    // extract data from body
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    // check if all required keys were provided
    if (!email) {
        res.send("No email provided").status(400)

        return
    } else if (!password) {
        res.send("No password provided").status(400)

        return
    } else if (!name) {
        res.send("No name provided").status(400)

        return
    }

    // check if email is a valid email address
    if (!email.match(emailRegEx)) {
        res.send("Invalid email").status(400)

        return
    }

    // check if password is a valid password
    if (!password.match(passwordRegEx)) {
        res.send("Invalid password").status(400)

        return
    }

    // check if name is a valid name
    if (!name.match(nameRegEx)) {
        res.send("Invalid name").status(400)

        return
    }

    // get database collection
    const collection = employeesDB.collection("users")

    // check if email already exists
    if ((await collection.find({ email: email }).count()) > 0) {
        res.send("Email already in use").status(409)

        return
    }

    // hash password
    const hash = await bcrypt.hash(password, 12)

    // create document to enforce schema
    const document = {
        email: email,
        password: hash,
        name: name,
        created: new Date(Date.now()).toISOString(),
    }

    // insert document
    const result = await collection.insertOne(document)

    // check if document was inserted
    if (result.insertedId !== null) {
        res.send("User created").status(201)

        return
    } else {
        res.send("Unable to create user").status(500)

        return
    }
})

export default employees
