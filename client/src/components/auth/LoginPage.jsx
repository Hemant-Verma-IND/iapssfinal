import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { saveAuth } from "../../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Login failed");

      saveAuth(data.token, data.user);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  function google() {
    window.location.href = "http://localhost:4000/api/auth/google";
  }

  function github() {
    window.location.href = "http://localhost:4000/api/auth/github";
  }

  return (
    <AuthLayout>
      <h2 className="auth-heading">Welcome back</h2>
      <p className="auth-subtext">Log in to continue your session.</p>

      <form onSubmit={handleLogin} className="auth-form">

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

        <label className="auth-label">
          Password
          <div className="auth-input-wrapper">
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        <div className="auth-forgot">
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div className="auth-social">
        <div className="auth-social-label">Or continue with</div>
        <div className="auth-social-row">
          <button className="auth-social-btn" onClick={google}>Google</button>
          <button className="auth-social-btn" onClick={github}>GitHub</button>
        </div>
      </div>

      <div className="auth-footer">
        New here? <Link to="/register" className="auth-link">Create account</Link>
      </div>
    </AuthLayout>
  );
}
