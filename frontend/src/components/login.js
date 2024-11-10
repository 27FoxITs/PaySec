// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // RegEx for input validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters, including one uppercase letter, one lowercase letter, and one digit.");
      return;
    }
  
    try {
     // Make API request to login endpoint
     const response = await axios.post("http://localhost:3000/api/customers/login", {
      email: email,
      password: password,
    });
    // Handle successful login
    if (response.status === 200) {
      console.log(response);
      if (response.data.message === "Login successful") {
        localStorage.setItem("token", response.data.token); // Save the token in local storage
        setError("");
        window.location.href = "/dashboard"; // Redirect to the dashboard
      } else {
        setError("Invalid email or password");
      }
    }
    } catch (err) {
      // Handle errors
      if (err.response && err.response.status === 400) {
        setError("Invalid email or password.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };  

  return (
   
    <div className="login-container">
      <form onSubmit={handleLogin} className="form">
        <img className="login-logo" src="\Paysec-logo.png" alt="logo"></img>
        <div className="title"><h2>Welcome to PaySec<br /><span>Login</span></h2></div>
          <input
          className="input"
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <input
          className="input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="button-confirm">Login</button>
      </form>
    </div>
  );
};

export default Login;
