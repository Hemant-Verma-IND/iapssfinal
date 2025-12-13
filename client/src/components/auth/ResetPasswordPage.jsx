import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    const res = await fetch("http://localhost:4000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    alert("Password reset successful");
    navigate("/login");
  }

  return (
    <AuthLayout>
      <h2 className="auth-heading">Set new password</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-label">
          New password
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="auth-label">
          Confirm password
          <input
            className="auth-input"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        <button className="auth-btn" type="submit">
          Reset password
        </button>
      </form>
    </AuthLayout>
  );
}
