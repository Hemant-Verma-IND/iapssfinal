import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../GraphFromInputPage/GraphFromInputPage.css"; // Reuse our sleek CSS

// Hardcoded sample Segment Tree code for the textarea placeholder
const sampleSegmentTreeCode = `// C++ Segment Tree for Range Sum Query
struct SegTree {
    vector<int> t;
    int n;
    SegTree(int n) : n(n), t(4 * n, 0) {}

    void build(const vector<int>& a, int v, int tl, int tr) {
        if (tl == tr) {
            t[v] = a[tl];
        } else {
            int tm = (tl + tr) / 2;
            build(a, 2*v, tl, tm);
            build(a, 2*v+1, tm+1, tr);
            t[v] = t[2*v] + t[2*v+1];
        }
    }
    // ... more methods
};
`;

export default function ReverseEngineerPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  // --- ADD THIS LINE FOR THE MODAL ---
  const [showUnavailableModal, setShowUnavailableModal] = useState(true);

  const handleGenerate = () => {
    if (!code) return alert("Please paste your data structure code.");
    
    setIsGenerating(true);
    setResult(null);

    // SIMULATING AI BACKEND DELAY
    setTimeout(() => {
      setIsGenerating(false);
      setResult({
        analysis: "This is a Segment Tree optimized for Range Sum Queries. It builds a balanced binary tree over an array, allowing sum queries on any range in O(log n) time. The space complexity is O(n). It's commonly used in competitive programming for problems involving frequent updates and queries on array segments.",
        visualType: "tree"
      });
    }, 2500);
  };

  return (
    <div className="dsa-page-root">
      <header className="dsa-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">← Dashboard</button>
        <h1>AI Code Reverse-Engineer <span style={{fontSize: "0.8rem", background: "var(--brand-primary)", padding: "4px 8px", borderRadius: "4px", color: "white", marginLeft: "12px"}}>PRO</span></h1>
      </header>

      <div className="dsa-layout">
        
        {/* LEFT PANEL: INPUTS */}
        <div className="dsa-sidebar" style={{ flex: "1", minWidth: "400px" }}>
          <h3 style={{ marginTop: 0 }}>Visualize your structure</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Paste your custom Data Structure code. Gemini will analyze its logic, complexity, and generate an interactive visualization.
          </p>

          <label style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", marginTop: "16px", display: "block" }}>Your Data Structure Code (Segment Tree, Trie, etc.)</label>
          <textarea 
            className="dsa-textarea" 
            style={{ flex: 1, minHeight: "350px", fontFamily: "monospace" }}
            placeholder={sampleSegmentTreeCode}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button 
            className="dsa-primary-btn" 
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ opacity: isGenerating ? 0.7 : 1, marginTop: "16px" }}
          >
            {isGenerating ? "🤖 Analyzing Structure..." : "Reverse-Engineer"}
          </button>
        </div>

        {/* RIGHT PANEL: AI OUTPUT & VISUALIZATION */}
        <div className="dsa-canvas-area" style={{ flex: "1.5", padding: "24px", overflowY: "auto" }}>
          
          {!isGenerating && !result && (
            <div className="dsa-placeholder" style={{ flexDirection: "column", gap: "16px" }}>
              <span style={{ fontSize: "3rem" }}>🏗️</span>
              <div>Waiting for your custom code...</div>
            </div>
          )}

          {isGenerating && (
            <div className="dsa-placeholder" style={{ flexDirection: "column", gap: "24px" }}>
              <div style={{ width: "50px", height: "50px", border: "4px solid var(--border-light)", borderTopColor: "var(--brand-primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <div style={{ color: "var(--brand-primary)", fontWeight: "bold", animation: "pulse 1.5s infinite" }}>
                Parsing your logic...
              </div>
            </div>
          )}

          {result && (
            <div style={{ animation: "fadeIn 0.5s ease-out" }}>
              <h2 style={{ marginTop: 0, color: "#10b981", display: "flex", alignItems: "center", gap: "8px" }}>
                ✅ Structure Identified!
              </h2>
              
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "var(--text-secondary)" }}>AI Analysis: Segment Tree</h4>
                <p style={{ margin: 0, lineHeight: 1.6, color: "var(--text-primary)" }}>{result.analysis}</p>
              </div>

              <h4 style={{ margin: "0 0 12px 0", color: "var(--text-secondary)" }}>Visual Structure (Based on an array like [1, 5, 2, 8])</h4>
              <div style={{ background: "var(--bg-page)", border: "1px solid var(--border-light)", minHeight: "300px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* A simplified, hardcoded visualization of a Segment Tree */}
                <p style={{color: 'var(--text-tertiary)'}}>[Segment Tree Visualization Canvas Here]</p>
              </div>

            </div>
          )}
        </div>
        
        --- PASTE THIS ENTIRE BLOCK for the Modal ---
        {showUnavailableModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Service Temporarily Unavailable</h2>
              <p className="modal-text">
                Elevate your workflow with our upcoming premium AI tools. Our team is hard at work perfecting these features to ensure a seamless launch on IAPSS.
                <br />Thank you for your continued support with us.
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