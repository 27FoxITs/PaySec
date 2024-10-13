import dotenv from "dotenv"
import { MongoClient } from "mongodb"

dotenv.config()

const ATLAS_URI = process.env.ATLAS_URI

const client = new MongoClient(ATLAS_URI)

let conn

try {
    conn = await client.connect()

    console.log("Connected to MongoDB")
} catch (error) {
    console.error(error)
}

let db = conn.db("customers")

export default db
