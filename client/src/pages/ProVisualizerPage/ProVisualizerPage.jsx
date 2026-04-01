import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../GraphFromInputPage/GraphFromInputPage.css"; // Reuse our sleek CSS

export default function ProVisualizerPage() {
  const navigate = useNavigate();
  const [userCode, setUserCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // --- ADD THIS LINE FOR THE MODAL ---
  const [showUnavailableModal, setShowUnavailableModal] = useState(true);

  return (
    <div className="dsa-page-root">
      <header className="dsa-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">← Dashboard</button>
        <h1>AI Code Visualizer <span style={{fontSize: "0.8rem", background: "var(--brand-primary)", padding: "4px 8px", borderRadius: "4px", color: "white", marginLeft: "12px"}}>PRO</span></h1>
      </header>

      <div className="dsa-layout">
        
        {/* LEFT PANEL: User Inputs */}
        <div className="dsa-sidebar" style={{ flex: "1", minWidth: "400px" }}>
          <h3 style={{ marginTop: 0 }}>Visualize your own logic</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Paste your code and provide a test input. Our AI engine will generate a step-by-step execution trace for you to debug.
          </p>
          
          <label style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", marginTop: "12px", display: "block" }}>Your Code (C++, Python, Java)</label>
          <textarea 
            className="dsa-textarea" 
            style={{ flex: 1, minHeight: "250px", fontFamily: "monospace" }}
            placeholder="Paste your full function or class here..."
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
          />

          <label style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", marginTop: "16px", display: "block" }}>Custom Test Input</label>
          <textarea 
            className="dsa-textarea" 
            style={{ height: "100px" }}
            placeholder="e.g., Array: [5, 2, 8, 4, 7, 1]&#10;Target: 8"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />

          <button 
            className="dsa-primary-btn" 
            disabled={isGenerating}
            style={{ opacity: isGenerating ? 0.7 : 1, marginTop: "16px" }}
          >
            {isGenerating ? "🤖 Generating Trace..." : "Generate Visualization"}
          </button>
        </div>

        {/* RIGHT PANEL: Visualization will appear here */}
        <div className="dsa-canvas-area" style={{ flex: "1.5", padding: "24px", overflowY: "auto" }}>
          <div className="dsa-placeholder" style={{ flexDirection: "column", gap: "16px" }}>
            <span style={{ fontSize: "3rem" }}>✨</span>
            <div>Your visualization will appear here</div>
          </div>
        </div>
        
        {/* --- PASTE THIS ENTIRE BLOCK for the Modal --- */}
        {showUnavailableModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Pro Visualizer Coming Soon!</h2>
              <p className="modal-text">
                This premium feature is under active development and will be released shortly. 
                Get ready to debug your own code like never before. Thank you for your support!
              </p>
              <button 
                className="dsa-primary-btn" 
                style={{ width: "100%", marginTop: "16px" }}
                onClick={() => navigate("/dashboard")}
              >
                OK
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}