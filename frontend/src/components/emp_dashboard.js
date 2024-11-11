import React, { useState, useEffect } from "react";
import StatsOverview from "./statsOverview";
import PendingTransactionsTable from "./transactionTable";
import axios from "axios";

import "./dashboard.css";

const loadTransactions = async () => {
  const eToken = localStorage.getItem("token");

  try {
    // Use axios to make the GET request
    const response = await axios.get(`http://localhost:3000/api/customers/transactions`, {
      headers: {
        Authorization: eToken,
      },
      params: {
        key: "auTjU5GWCqmtNJ9aP0ntnpm60nKVvS0nQuNTS915j8kLOUATZUk74ggjvo2fCBwxCQgDT8Bfs1MHUvCFm5qXPw0j32b1uC8U1UvtmxMgqwDQFfvK4pOmLTnbu9N8yYDS",
      },
    });

    if (response.message) {
      console.log("Error: ", response.message);
      return []; // Return empty array or handle the error properly
    } else {
      return response.data;
    }
  } catch (error) {
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
      status: item.verified ? "Verified" : "Unverified",
    }));

    // Counts the amount of unique customers by emails
    const uniqueCustomerCount = new Set(mappedData.map(item => item.email)).size;
    const totalTransactions = mappedData.length;
    const pendingTransactions = mappedData.filter(txn => txn.status === "Unverified").length;

    const tStats = {
      totalCustomers: uniqueCustomerCount,
      totalTransactions: totalTransactions,
      pendingTransactions: pendingTransactions,
    };

    console.log(mappedData);
    setPendingTransactions(mappedData); // Update the state with the mapped data
    setStats(tStats);
  };

  useEffect(() => {
    fetchTransactions(); // Fetch transactions when the component mounts
  }, []);

  const handleVerify = (id) => {
    const updatedTransactions = pendingTransactions.map((txn) =>
      txn._id === id ? { ...txn, status: "Verified" } : txn
    );
    setPendingTransactions(updatedTransactions);
  };

  const handleReject = (id) => {
    const updatedTransactions = pendingTransactions.map((txn) =>
      txn._id === id ? { ...txn, status: "Rejected" } : txn
    );
    setPendingTransactions(updatedTransactions);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
