import React, { useState } from "react";
import { register, login } from "../api";

interface RegisterProps {
  onRegister: (user: any) => void;
  onSwitchToLogin: () => void;
}

export default function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const user = await register(username, email, password);
      // After registration, automatically log in
      try {
        const loginResult = await login(username, password);
        onRegister(loginResult.user);
      } catch (loginErr: any) {
        // Registration succeeded but login failed - still show success
        onRegister(user);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "50px auto",
      padding: 30,
      border: "1px solid #ddd",
      borderRadius: 8,
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>Register</h2>
      
      {error && (
        <div style={{
          padding: 10,
          marginBottom: 20,
          backgroundColor: "#fee",
          color: "#c33",
          borderRadius: 4,
          border: "1px solid #fcc"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 8,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 8,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: "100%",
              padding: 8,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: "100%",
              padding: 8,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            backgroundColor: loading ? "#ccc" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <span style={{ color: "#666" }}>Already have an account? </span>
        <button
          onClick={onSwitchToLogin}
          style={{
            background: "none",
            border: "none",
            color: "#2196F3",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: 14
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

