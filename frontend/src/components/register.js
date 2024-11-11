// src/components/CustomerRegister.js
import React, { useState } from "react";
import "./register.css";
import Checkbox from "./checkbox";

const CustomerRegister = () => {
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Input validation
  const validateForm = () => {
    if (!fullName || !idNumber || !accountNumber || !password) {
      setError("All fields are required.");
      return false;
    }
    if (idNumber.length !== 13) {
      setError("ID Number must be 13 digits long.");
      return false;
    }
    if (accountNumber.length < 6) {
      setError("Account Number must be at least 6 digits long.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm())  return;

    // Simulate registration submission
    const customerData = {
      fullName,
      idNumber,
      accountNumber,
      password,
    };

    console.log("Customer Registration Data:", customerData);
    setSuccessMessage("Registration successful!");

    // Reset form fields
    setFullName("");
    setIdNumber("");
    setAccountNumber("");
    setPassword("");

    window.location.href = "/transaction";
  };

  return (
    <div className="register-container">
        <div className="main_container">
        <div className="image_container">
        
        <img src="\register-image.svg" alt="register_image"></img>

        </div>
      <div className="register_form">
      <form onSubmit={handleSubmit}>

        <div className="form_header">
        <h3>Create an account</h3>
        <p>Already have an account? <a href="\login">Login</a></p>
        </div>
      
        <div className="register-group">
            <div className="container">
            
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            
            required
          />
          <label htmlFor="fullName">Full Name:</label>

            </div>
          
        </div>

        <div className="register-group">
        <div className="container">
        
          <input
            type="text"
            id="idNumber"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            
            required
          />
          <label htmlFor="idNumber">ID Number:</label>

            </div>
          
        </div>

        <div className="register-group">
        <div className="container">
        <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            
            required
          />
          <label htmlFor="accountNumber">Account Number:</label>
            </div>
          
          
        </div>

        <div className="register-password">
        <div className="container">
        
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
            required
          />
          <label htmlFor="password">Password:</label>
          </div>
          <div className="pass-button">
          <Checkbox className="check-box" onChange={() => setShowPassword(!showPassword)} />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" className="pay-button">
          Register
        </button>
      </form>

      </div>

        </div>
        
      
    </div>
  );
};

export default CustomerRegister;
