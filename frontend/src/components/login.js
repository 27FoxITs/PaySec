// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // RegEx for input validation
  const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!usernameRegex.test(username)) {
      setError("Invalid username format.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters, including one uppercase letter, one lowercase letter, and one digit.");
      return;
    }

    try {
      // Make API request to login endpoint
      const response = await axios.post("https://localhost:3000/api/customers/login", {
        email: username,
        password: password,
      });

      // Handle successful login
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setError("");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      // Handle errors
      if (err.response && err.response.status === 400) {
        setError("Invalid username or password.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Employee Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
