// src/components/CustomerRegister.js
import React, { useState } from "react";
import "./register.css";
import Checkbox from "./checkbox";
import axios from "axios";

const CustomerRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm())  return;

    // Simulate registration submission
    const customerData = {
      name: fullName,
      email: email,
      idNumber: idNumber,
      accountNumber: accountNumber,
      password: password,
    };

    try {
      // Send data to the server
      const response = await axios.post("http://localhost:3000/api/customers/register", customerData);
      alert(response.data.message);
      // Handle successful response
      if (response.data.message === "Registration successful") {
        setSuccessMessage("Registration successful");
        sessionStorage.setItem("cEmail", email);
        sessionStorage.setItem("token", response.data.token);
        window.location.href = "/transaction";
      } else {
        setError(response.data.message); //Handle any other message when registration is not successful
      }
      // Redirect to another page after successful registration
    } catch (err) {
      // Handle errors
      if (err.response) {
        // Server error response
        setError(err.response.data.message);
      } else {
        // Network or other errors
        setError("An error occurred. Please try again.");
      }
    }
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
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
            required
          />
          <label htmlFor="email">email address:</label>

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
