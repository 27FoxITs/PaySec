// third-party imports -------------------------------------------------------------------------- //
import dotenv from "dotenv"
import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { body, validationResult } from "express-validator" // For input validation
import rateLimit from "express-rate-limit" // Rate limiting to prevent brute force attacks

// local imports -------------------------------------------------------------------------------- //
import db from "../../db.mjs"

dotenv.config()

const users = express.Router()
const route = "/api/customers"

// Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
})

users.use(limiter) // Apply to all requests

// Input validation regex patterns
const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

// Helper function for SSL enforcement (if necessary for your express app)
users.use((req, res, next) => {
    if (req.secure || process.env.NODE_ENV !== "production") {
        next()
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`)
    }
})

// POST route for registration with input validation and password hashing
users.post(
    `${route}/register`,
    // Validate input
    [
        body("email").matches(emailRegEx).withMessage("Invalid email format"),
        body("password")
            .matches(passwordRegEx)
            .withMessage(
                "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one digit"
            ),
        body("name").notEmpty().withMessage("Name is required"),
    ],
    async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password, name } = req.body

        try {
            // Check if the user already exists
            const collection = await db.collection("users")
            const userExists = await collection.findOne({ email })

            if (userExists) {
                return res.status(400).json({ error: "User already exists" })
            }

            // Hash the password with salting
            const hashedPassword = await bcrypt.hash(password, 12) // Stronger bcrypt with salt rounds

            // Create new user
            const newUser = {
                email,
                password: hashedPassword,
                name,
                createdAt: new Date(),
            }

            await collection.insertOne(newUser)

            res.status(201).json({ message: "User registered successfully" })
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

// POST route for login with password hashing and JWT
users.post(
    `${route}/login`,
    // Validate input
    [
        body("email").matches(emailRegEx).withMessage("Invalid email format"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        try {
            // Check if the user exists
            const collection = await db.collection("users")
            const user = await collection.findOne({ email })

            if (!user) {
                return res.status(400).json({ error: "User not found" })
            }

            // Compare the password with bcrypt
            const passwordMatch = await bcrypt.compare(password, user.password)

            if (!passwordMatch) {
                return res.status(400).json({ error: "Invalid password" })
            }

            // Generate JWT token with expiry and payload
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            })

            res.status(200).json({ message: "Login successful", token })
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
)

export default users
