import React, { useState, useEffect } from "react";
import StatsOverview from "./statsOverview";
import PendingTransactionsTable from "./transactionTable";
import axios from "axios";

import "./dashboard.css";

const loadTransactions = async () => {
  const eToken = sessionStorage.getItem("token");

  try {
    // Use axios to make the GET request
    const response = await axios.get(`http://localhost:3000/api/customers/transactions`, {
      headers: {
        Authorization: eToken,
      },
    });

    if (response.message) {
      console.log("Error: ", response.message);
      return []; // Return empty array or handle the error properly
    } else {
      return response.data;
    }
  } catch (error) {
    if (error.status === 403) {
      sessionStorage.setItem("tempError", "Your session has expired. Please login again.");
      window.location.href = "/login";
    }
    console.error("Error: ", error);
    return []; // Return empty array in case of error
  }
};

const Dashboard = () => {
  // Initialize state for stats and transactions
  const [stats, setStats] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);

  const fetchTransactions = async () => {
    const tData = await loadTransactions();

    // Map the fetched data to the required structure
    const mappedData = tData.map((item) => ({
      id: item._id, // Use the actual _id from the data
      name: item.sender.split("@")[0].replace(/[^\w\s]/gi, "").toUpperCase(),
      email: item.sender,
      receiver: item.receiver,
      provider: item.provider,
      amount: item.amount,
      status: item.verified === true ? "Verified" : item.verified === false ? "Rejected" : "Unverified",
    }));

    // Counts the amount of unique customers by emails
    const uniqueCustomerCount = new Set(mappedData.map(item => item.email)).size;
    const totalTransactions = mappedData.length;
    const pendingTransactionsCount = mappedData.filter(txn => txn.status === "Unverified").length;

    const tStats = {
      totalCustomers: uniqueCustomerCount,
      totalTransactions: totalTransactions,
      pendingTransactions: pendingTransactionsCount,
    };

    //console.log(mappedData);
    setPendingTransactions(mappedData); // Update the state with the mapped data
    setStats(tStats);
  };

  useEffect(() => {
    fetchTransactions(); // Fetch transactions when the component mounts
  }, []);

  const handleVerify = async (id) => {
    try {

      // Make PATCH request to API
      const response = await axios.patch("http://localhost:3000/api/customers/transactions", {
        oid: id, // Object ID of the transaction
        verified: true, // Set verified to true for verification
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"), // Include token if required
        }
      });

      if (response.data.message === "Update successful") {
        // Handle success if needed
        fetchTransactions();
        //console.log("Transaction verified successfully");
      } else {
        // Handle failure (you may want to reset the status in the UI)
        console.log("Transaction verification failed");
      }
    } catch (error) {
      // Handle errors (e.g., network issues, server errors)
      console.log("An error occurred while verifying the transaction");
    }
  };

  const handleReject = async (id) => {
    try {
      // Make PATCH request to API
      const response = await axios.patch("http://localhost:3000/api/customers/transactions", {
        oid: id, // Object ID of the transaction
        verified: false, // Set verified to false for rejection
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"), // Include token if required
        }
      });

      if (response.data.message === "Update successful") {
        // Handle success if needed
        fetchTransactions();
        //console.log("Transaction rejected successfully");
      } else {
        // Handle failure (you may want to reset the status in the UI)
        console.log("Transaction rejection failed");
      }
    } catch (error) {
      // Handle errors (e.g., network issues, server errors)
      console.log("An error occurred while rejecting the transaction");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard_header_container">
        <div className="transaction_nav">
          <img className="logo_header" src="\Paysec-lock-logo.png" alt="logo" />
          <h1 className="logo_name">Paysec</h1>
        </div>
        <div className="header_links">
          <nav>
            <a href="\dashboard">Dashboard</a>
          </nav>
        </div>
        <div className="header_main">
          <h1>Welcome, User</h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main_stats_container">
        <div className="stats">
          <StatsOverview stats={stats} />
        </div>
      </div>

      <div className="main_transact_container">
        <div className="table">
          <PendingTransactionsTable
            transactions={pendingTransactions}
            onVerify={handleVerify}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
