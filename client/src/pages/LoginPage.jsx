import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth/AuthPage.css";
import { saveAuth, getAuth } from "../utils/auth";
import DotGrid from "../components/ui/DotGrid";




const LoginPage = () => {
  const navigate = useNavigate();
  // State for dark mode
  
  const [isDark, setIsDark] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
  const auth = getAuth();
  if (auth?.token) navigate("/dashboard");
}, []);

  async function handleLogin(e) {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("https://iapss-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    saveAuth(data.token, data.user);
    navigate("/dashboard"); // IMPORTANT
  } catch (err) {
    alert("Login error: " + err.message);
  } finally {
    setLoading(false);
  }
}


  const handleGoogleLogin = () => {
    window.location.href = "https://iapss-backend.onrender.com/api/auth/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "https://iapss-backend.onrender.com/api/auth/github";
  };

  return (
    <div className={`auth-root ${isDark ? "auth-root--dark" : ""}`}>
      {/* Background Animation - colors change based on mode */}
      <div className="auth-background">
        <DotGrid 
          baseColor={isDark ? "#1e293b" : "#cbd5e1"} 
          activeColor={isDark ? "#60a5fa" : "#3b82f6"} 
          gap={32} 
          dotSize={14}
        />
      </div>

      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-card-header">
            {/* Centered Brand */}
            <div className="auth-brand">
              <span className="brand-logo">IA</span>
              <div className="brand-text-col">
                <span className="brand-name">IAPSS</span>
                <span className="brand-tagline">
                  INTELLIGENT ACADEMIC PROBLEM-SOLVING SYSTEM
                </span>
              </div>
            </div>
          </div>

          <h2 className="auth-heading">Welcome back</h2>
          <p className="auth-subtext">
            Log in to continue practising, analysing and tracking your problems.
          </p>

          <form onSubmit={handleLogin} className="auth-form">
            <label className="auth-label">
              Email address
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="auth-forgot">
                        <Link to="/forgot-password" className="auth-link">
                          Forgot password?
                        </Link>
                      </div>
            </label>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="auth-social">
            <div className="auth-social-label">Or continue with</div>
            <div className="auth-social-row">
              <button
                type="button"
                className="auth-social-btn"
                onClick={handleGoogleLogin}
              >
                <svg className="social-svg" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="auth-social-btn"
                onClick={handleGithubLogin}
              >
                <svg className="social-svg social-svg-github" viewBox="0 0 24 24" width="20" height="20" fill="#181717">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>

          <div className="auth-footer">
            New here?{" "}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;