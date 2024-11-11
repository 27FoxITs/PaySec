// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./components/emp_dashboard";
import CustomerTransaction from "./components/customerTransaction";
import CustomerRegister from "./components/register";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction" element={<CustomerTransaction />} />
        <Route path="/register" element={<CustomerRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
