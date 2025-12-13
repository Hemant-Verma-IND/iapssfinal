import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("https://iapss-backend.onrender.com/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);
    setSent(true);
  }

  return (
    <AuthLayout>
      <h2 className="auth-heading">Reset password</h2>

      {sent ? (
        <p className="auth-subtext">
          If this email exists, a reset link has been sent.
        </p>
      ) : (
        <>
          <p className="auth-subtext">
            Enter your email and we’ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              Email address
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <button className="auth-btn" type="submit">
              Send reset link
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
