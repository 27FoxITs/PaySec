// src/components/TransactionTable.js
import React from "react";
import "./dashboard.css";

const TransactionTable = ({ transactions }) => {
  return (
    <div className="transaction-table">
      <h3>Recent Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Customer ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <tr key={txn.transactionId}>
                <td>{txn.transactionId}</td>
                <td>{txn.customerId}</td>
                <td>${txn.amount.toFixed(2)}</td>
                <td>{new Date(txn.transactionDate).toLocaleDateString()}</td>
                <td>{txn.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No recent transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
