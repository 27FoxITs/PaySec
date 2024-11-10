// src/components/CustomerTransaction.js
import React, { useState } from "react";
import "./customerTransaction.css";
import Card from "./card";

const CustomerTransaction = () => {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [provider, setProvider] = useState("SWIFT");
    const [accountInfo, setAccountInfo] = useState("");
    const [swiftCode, setSwiftCode] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // List of currencies
    const currencies = ["USD", "EUR", "GBP", "ZAR", "JPY"];
    const providers = ["SWIFT", "PayPal", "Bank Transfer"];

    const handleSubmit = (e) => {
        e.preventDefault();

        // Input validation
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        if (!accountInfo || !swiftCode) {
            setError("Please enter account information and SWIFT code.");
            return;
        }

        // Reset error message
        setError("");

        // Simulate transaction submission
        const transactionData = {
            amount,
            currency,
            provider,
            accountInfo,
            swiftCode,
        };

        console.log("Transaction Data:", transactionData);
        setSuccessMessage("Transaction submitted successfully!");

        // Reset form
        setAmount("");
        setCurrency("USD");
        setProvider("SWIFT");
        setAccountInfo("");
        setSwiftCode("");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };


    return (
        <div className="transaction-container">
            <div className="transact_header">
                <div className="transaction_nav">
                    <img className="logo_header" src="\Paysec-lock-logo.png" alt="logo"></img>
                    <h1 className="logo_name">Paysec</h1>
                </div>
                <div className="header_links">
                    <nav>
                        <a href="\transaction">Payment</a>
                    </nav>
                </div>
                <div className="header_main">
                    <h1>Welcome, Customer</h1>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <h1>Payment</h1>

            <div class="main_payment">
                <div className="card">
                <h2>Make a Payment</h2>
                    <Card></Card>
                </div>



                <div className="form_payment">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            
                        </div>
                        <div className="input-group">
                            <div className="container">
                                <input
                                    type="text"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}

                                    required
                                />
                                <label htmlFor="amount">Enter amount</label>
                            </div>

                        </div>

                        <div className="input-group">

                            <div className="container">
                                <select
                                    id="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    {currencies.map((cur) => (
                                        <option key={cur} value={cur}>
                                            {cur}
                                        </option>
                                    ))}
                                </select>


                            </div>

                        </div>

                        <div className="input-group">

                            <div className="container">
                                <select
                                    id="provider"
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                >
                                    {providers.map((prov) => (
                                        <option key={prov} value={prov}>
                                            {prov}
                                        </option>
                                    ))}
                                </select>


                            </div>

                        </div>

                        <div className="input-group">

                            <div className="container">
                                <input
                                    type="text"
                                    id="accountInfo"
                                    value={accountInfo}
                                    onChange={(e) => setAccountInfo(e.target.value)}

                                    required
                                />
                                <label htmlFor="accountInfo">Enter account info</label>

                            </div>

                        </div>

                        <div className="input-group">
                            <div className="container">
                                <input
                                    type="text"
                                    id="swiftCode"
                                    value={swiftCode}
                                    onChange={(e) => setSwiftCode(e.target.value)}

                                    required
                                />
                                <label htmlFor="swiftCode">Enter SWIFT code</label>
                            </div>

                        </div>

                        {error && <p className="error-message">{error}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}

                        <div className="button_container">
                            <button type="submit" className="pay-button">
                                Pay Now
                            </button>
                        </div>



                    </form>

                </div>
            </div>
        </div>
    );
};

export default CustomerTransaction;
