// third-party imports -------------------------------------------------------------------------- //
import dotenv from "dotenv"
import { MongoClient } from "mongodb"

// set up environment variables
dotenv.config()

// create mongodb client
const client = new MongoClient(process.env.ATLAS_URI)

// connect to MongoDB
let conn
try {
    conn = await client.connect()

    console.log("Connected to MongoDB")
} catch (error) {
    console.error("Unable to connect to MongoDB:")
    console.error(error)
}

// connect to database
let customersDB = conn.db("customers")
let employeesDB = conn.db("employees")

// export databases
export { customersDB, employeesDB }
