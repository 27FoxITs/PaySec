// src/components/StatsOverview.js
import React from "react";
import "./dashboard.css";

const StatsOverview = ({ stats }) => {
  return (
    <div className="stats-overview">
      <div className="stat-item">
        <div className="header_item">
          <h3>Total Customers</h3>
          <p>Total active customers</p>
        </div>
        <div className="st_item">
          <h2>{stats.totalCustomers}</h2>
        </div>
          
        
        
      </div>
      <div className="stat-item">
        <div className="header_item">
          <h3>Total Transactions</h3>
          <p>Total transaction by all users</p>
        </div>
        <div className="st_item">
          <h2>{stats.totalTransactions}</h2>
        </div>

      </div>
      <div className="stat-item">
        <div className="header_item">
          <h3>Pending Transactions</h3>
          <p>Current Pending transactions</p>
          </div>
          <div className="st_item">
            <h2>{stats.pendingTransactions}</h2>
          </div>
          
        
        
      </div>
    </div>
  );
};

export default StatsOverview;
