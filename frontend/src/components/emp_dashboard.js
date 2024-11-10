// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import StatsOverview from "./statsOverview";
import TransactionTable from "./transactionTable";
import "./dashboard.css";

const Dashboard = () => {
  // Dummy data for statistics and transactions
  const dummyStats = {
    totalCustomers: 120,
    totalTransactions: 450,
    pendingTransactions: 10,
  };

  const dummyTransactions = [
    {
      transactionId: "TXN001",
      customerId: "CUST001",
      amount: 1500.75,
      transactionDate: "2024-11-10",
      status: "Completed",
    },
    {
      transactionId: "TXN002",
      customerId: "CUST002",
      amount: 750.5,
      transactionDate: "2024-11-09",
      status: "Pending",
    },
    {
      transactionId: "TXN003",
      customerId: "CUST003",
      amount: 300.0,
      transactionDate: "2024-11-08",
      status: "Completed",
    },
  ];

  const [stats, setStats] = useState({});
  const [transactions, setTransactions] = useState([]);

  // Simulate data fetching
  useEffect(() => {
    setStats(dummyStats);
    setTransactions(dummyTransactions);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard_header_container">
        <div className="transaction_nav">
          <img className="logo_header" src="\Paysec-lock-logo.png" alt="logo"></img>
          <h1 className="logo_name">Paysec</h1>
        </div>
        <div className="header_links">
        <p>Dashboard</p>
        <p>Users</p>
        </div>
        <div className="header_main">
          <h1>Welcome, User</h1>

        </div>
        
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      </div>
      <div className="main_transaction_container">
        <div className="stats">
          <StatsOverview stats={stats} />
        </div>
        <div className="table">
          <TransactionTable transactions={transactions} />

        </div>
      </div>
      
      
    </div>
  );
};

export default Dashboard;
