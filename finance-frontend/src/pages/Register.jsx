import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // 👈 Import navigation

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // if using Sanctum: await axios.get("/sanctum/csrf-cookie");

      const response = await axios.post("/api/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.status === 201 || response.status === 200) {
        // 👇 Redirect to login page
        navigate("/login");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Registration failed!");
      } else {
        setError("Registration failed! Please check backend connection.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Register</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Confirm Password"
            className="form-control"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
