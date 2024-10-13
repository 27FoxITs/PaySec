// third-party imports -------------------------------------------------------------------------- //
import currencyapi from "@everapi/currencyapi-js"
import dotenv from "dotenv"

// set up environment variables
dotenv.config()

// get all available currencies through currencyapi
let currencies
try {
    currencies = (await new currencyapi(process.env.CURRENCY_API_KEY).currencies())["data"]

    console.log("Connected to CurrencyAPI")
} catch (error) {
    console.error("Unable to connect to CurrencyAPI:")
    console.error(error)
}

export default currencies
