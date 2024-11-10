// src/components/TransactionTable.js
import React, { useState } from "react";
import "./dashboard.css";
import upArrow from "../assets/up_arrow.svg";
import downArrow from "../assets/down_arrow.svg";


const PendingTransactionsTable = ({ transactions, onVerify, onReject }) => {
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filterText, setFilterText] = useState("");

  // Filter transactions based on input text
  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterText(value);
    const filtered = transactions.filter(
      (txn) =>
        txn.name.toLowerCase().includes(value) ||
        txn.email.toLowerCase().includes(value) ||
        txn.receiver.toLowerCase().includes(value) ||
        txn.provider.toLowerCase().includes(value) ||
        txn.status.toLowerCase().includes(value)
    );
    setFilteredTransactions(filtered);
  };

  // Sort transactions based on column key
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredTransactions].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setFilteredTransactions(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? upArrow : downArrow;
    }
    return null;
  };

  return (
    <div className="transaction-table">
      <h1>Recent Transactions</h1>
      <input
        type="text"
        placeholder="Filter transactions..."
        value={filterText}
        onChange={handleFilterChange}
        className="filter-input"
      />
      <div className="table_borders">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              Name <img className="sort_image" src={getSortIcon("name")} alt="" />
            </th>
            <th onClick={() => handleSort("email")}>
              Email <img className="sort_image" src={getSortIcon("email")} alt="" />
            </th>
            <th onClick={() => handleSort("receiver")}>
              Receiver <img className="sort_image" src={getSortIcon("receiver")} alt="" />
            </th>
            <th onClick={() => handleSort("provider")}>
              Provider <img className="sort_image" src={getSortIcon("provider")} alt="" />
            </th>
            <th onClick={() => handleSort("amount")}>
              Amount <img className="sort_image" src={getSortIcon("amount")} alt="" />
            </th>
            <th onClick={() => handleSort("status")}>
              Status <img className="sort_image" src={getSortIcon("status")} alt="" />
            </th>
            <th>Verify</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.name}</td>
                <td>{txn.email}</td>
                <td>{txn.receiver}</td>
                <td>{txn.provider}</td>
                <td>${txn.amount.toFixed(2)}</td>
                <td>{txn.status}</td>
                <td>
                  <button
                    className="verify-button"
                    onClick={() => onVerify(txn.id)}
                    disabled={txn.status !== "Not Verified"}
                  >
                    Verify
                  </button>
                </td>
                <td>
                  <button
                    className="reject-button"
                    onClick={() => onReject(txn.id)}
                    disabled={txn.status !== "Not Verified"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No pending transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default PendingTransactionsTable;
