import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth/AuthPage.css"; // We reuse the base styles
import "./ForgotPasswordPage.css"; // Specific styles for this page
import DotGrid from "../components/ui/DotGrid";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  
  // Theme State
  const [isDark, setIsDark] = useState(false);
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      // In real app: await fetch('/api/auth/forgot-password', ...)
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  }

  return (
    <div className={`auth-root ${isDark ? "auth-root--dark" : ""}`}>
      {/* Background Animation */}
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
            
            {/* Optional: Dark Toggle to maintain state if user refreshed here */}
            {/* You can keep this hidden if you want, but it helps debugging styles */}
            {/* <button className="auth-theme-toggle" onClick={() => setIsDark(!isDark)}>
                {isDark ? "☀️" : "🌙"} 
            </button> */}
          </div>

          {!isSubmitted ? (
            /* --- FORM STATE --- */
            <>
              <div className="fp-icon-container">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>

              <h2 className="auth-heading">Forgot password?</h2>
              <p className="auth-subtext">
                No worries, we'll send you reset instructions.
              </p>

              <form onSubmit={handleReset} className="auth-form">
                <label className="auth-label">
                  Email address
                  <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </label>

                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? "Sending link..." : "Reset password"}
                </button>
              </form>

              <div className="auth-footer">
                <Link to="/login" className="auth-link-back">
                  ← Back to log in
                </Link>
              </div>
            </>
          ) : (
            /* --- SUCCESS STATE --- */
            <div className="fp-success-state">
              <div className="fp-icon-container success-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="auth-heading">Check your email</h2>
              <p className="auth-subtext">
                We sent a password reset link to <br/>
                <span className="fp-highlight-email">{email}</span>
              </p>
              
              <div className="fp-actions">
                <button 
                  className="auth-btn" 
                  onClick={() => window.open("https://gmail.com", "_blank")}
                >
                  Open email app
                </button>
                
                <button 
                  className="fp-secondary-btn" 
                  onClick={() => setIsSubmitted(false)}
                >
                  Skip, I'll confirm later
                </button>
              </div>

              <div className="auth-footer">
                Did not receive the email? <br/>
                <button className="fp-resend-link" onClick={() => setIsSubmitted(false)}>
                  Click to resend
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;