// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import StatsOverview from "./statsOverview";
import PendingTransactionsTable  from "./transactionTable";

import "./dashboard.css";

// Dummy data defined outside the component
const dummyStats = {
  totalCustomers: 150,
  totalTransactions: 500,
  pendingTransactions: 8,
};

const dummyPendingTransactions = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    receiver: "BIC4321DEF",
    provider: "SWIFT",
    amount: 1200.5,
    status: "Not Verified",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    receiver: "BIC5678ABC",
    provider: "SWIFT",
    amount: 800.0,
    status: "Not Verified",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    receiver: "BIC9876XYZ",
    provider: "SWIFT",
    amount: 600.0,
    status: "Not Verified",
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    receiver: "BIC1234XYZ",
    provider: "SWIFT",
    amount: 950.25,
    status: "Verified",
  },
];

const Dashboard = () => {
  // Dummy data for statistics and transactions
  

  const [stats, setStats] = useState(dummyStats);
  const [pendingTransactions, setPendingTransactions] = useState(dummyPendingTransactions);

  useEffect(() => {
    setStats(dummyStats);
    setPendingTransactions(dummyPendingTransactions);
  }, []);

  // Handle Verify action
  const handleVerify = (id) => {
    const updatedTransactions = pendingTransactions.map((txn) =>
      txn.id === id ? { ...txn, status: "Verified" } : txn
    );
    setPendingTransactions(updatedTransactions);
  };

  // Handle Reject action
  const handleReject = (id) => {
    const updatedTransactions = pendingTransactions.map((txn) =>
      txn.id === id ? { ...txn, status: "Rejected" } : txn
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
          <img className="logo_header" src="\Paysec-lock-logo.png" alt="logo"></img>
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
