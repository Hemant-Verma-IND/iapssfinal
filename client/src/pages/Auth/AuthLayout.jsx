import React from "react";
import DotGrid from "../ui/DotGrid";
import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-root">
      <div className="auth-background">
        <DotGrid baseColor="#cbd5e1" activeColor="#3b82f6" gap={32} dotSize={14} />
      </div>

      <div className="auth-wrapper">
        <div className="auth-card auth-animate">
          <div className="auth-card-header">
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

          {children}
        </div>
      </div>
    </div>
  );
}
