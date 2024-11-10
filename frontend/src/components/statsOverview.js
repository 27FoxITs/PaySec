// src/components/StatsOverview.js
import React from "react";
import "./dashboard.css";

const StatsOverview = ({ stats }) => {
  return (
    <div className="stats-overview">
      <div className="stat-item">
        <div className="st_item">
          <h3>Total Customers</h3>
        </div>
          <p>{stats.totalCustomers}</p>
        
        
      </div>
      <div className="stat-item">
        <div className="header_item">
          <h3>Total Transactions</h3>
        </div>
          <p>{stats.totalTransactions}</p>
        
        
      </div>
      <div className="stat-item">
        <div className="st_item">
          <h3>Pending Transactions</h3>
          <p>{stats.pendingTransactions}</p>
        </div>
        
      </div>
    </div>
  );
};

export default StatsOverview;
