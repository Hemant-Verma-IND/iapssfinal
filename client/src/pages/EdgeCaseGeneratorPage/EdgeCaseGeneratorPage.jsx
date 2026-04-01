import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../GraphFromInputPage/GraphFromInputPage.css"; // Reuse our sleek CSS

export default function EdgeCaseGeneratorPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState("");
  const[isGenerating, setIsGenerating] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(true);
  const [result, setResult] = useState(null);

  const handleGenerate = () => {
    if (!code || !problem) return alert("Please provide both code and problem description.");
    
    setIsGenerating(true);
    setResult(null);

    // SIMULATING AI BACKEND DELAY (In reality, you call your Gemini API here)
    setTimeout(() => {
      setIsGenerating(false);
      setResult({
        explanation: "Your logic fails when the graph is a straight line (Degenerate Tree) and the target node is at the very end. Your DFS exceeds the recursion depth or times out due to missing memoization.",
        testCaseRaw: "5 4\n1 2\n2 3\n3 4\n4 5",
        // We can pass this trace/structure into our visualizer later
        visualType: "graph", 
        nodes: [1, 2, 3, 4, 5],
        edges: [[1,2], [2,3], [3,4], [4,5]]
      });
    }, 3000);
  };

  return (
    <div className="dsa-page-root">
      <header className="dsa-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">← Dashboard</button>
        <h1>AI Edge-Case Generator <span style={{fontSize: "0.8rem", background: "var(--brand-primary)", padding: "4px 8px", borderRadius: "4px", color: "white", marginLeft: "12px"}}>PRO</span></h1>
      </header>

      <div className="dsa-layout">
        
        {/* LEFT PANEL: INPUTS */}
        <div className="dsa-sidebar" style={{ flex: "1", minWidth: "400px" }}>
          <h3 style={{ marginTop: 0 }}>Find the hidden bug</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Getting TLE or WA? Paste your code and the problem constraints. Gemini will find the exact counter-example.
          </p>
          
          <label style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", marginTop: "12px", display: "block" }}>Problem Statement / Constraints</label>
          <textarea 
            className="dsa-textarea" 
            style={{ height: "120px", marginBottom: "0" }}
            placeholder="e.g. N <= 10^5, Graph is connected, Unweighted..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />

          <label style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", marginTop: "16px", display: "block" }}>Your Failing Code (C++, Python, Java)</label>
          <textarea 
            className="dsa-textarea" 
            style={{ flex: 1, minHeight: "250px", fontFamily: "monospace" }}
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button 
            className="dsa-primary-btn" 
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ opacity: isGenerating ? 0.7 : 1, marginTop: "16px" }}
          >
            {isGenerating ? "🧠 AI Analyzing Logic..." : "Generate Edge Case"}
          </button>
        </div>

        {/* RIGHT PANEL: AI OUTPUT & VISUALIZATION */}
        <div className="dsa-canvas-area" style={{ flex: "1.5", padding: "24px", overflowY: "auto" }}>
          
          {!isGenerating && !result && (
            <div className="dsa-placeholder" style={{ flexDirection: "column", gap: "16px" }}>
              <span style={{ fontSize: "3rem" }}>🕵️‍♂️</span>
              <div>Waiting for your code...</div>
            </div>
          )}

          {isGenerating && (
            <div className="dsa-placeholder" style={{ flexDirection: "column", gap: "24px" }}>
              <div style={{ 
                width: "50px", height: "50px", border: "4px solid var(--border-light)", 
                borderTopColor: "var(--brand-primary)", borderRadius: "50%", animation: "spin 1s linear infinite" 
              }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <div style={{ color: "var(--brand-primary)", fontWeight: "bold", animation: "pulse 1.5s infinite" }}>
                Simulating edge cases...
              </div>
              <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
            </div>
          )}

          {result && (
            <div style={{ animation: "fadeIn 0.5s ease-out" }}>
              <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              
              <h2 style={{ marginTop: 0, color: "#ef4444", display: "flex", alignItems: "center", gap: "8px" }}>
                ⚠️ Edge Case Found!
              </h2>
              
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "var(--text-secondary)" }}>AI Diagnosis</h4>
                <p style={{ margin: 0, lineHeight: 1.6, color: "var(--text-primary)" }}>{result.explanation}</p>
              </div>

              <div style={{ display: "flex", gap: "24px" }}>
                <div style={{ flex: "1" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--text-secondary)" }}>Raw Test Case (Copy/Paste)</h4>
                  <pre style={{ background: "#0f172a", color: "#60a5fa", padding: "16px", borderRadius: "8px", overflowX: "auto" }}>
                    {result.testCaseRaw}
                  </pre>
                </div>

                <div style={{ flex: "1.5" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--text-secondary)" }}>Visual Structure</h4>
                  <div style={{ background: "var(--bg-page)", border: "1px solid var(--border-light)", height: "200px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    
                    {/* Render a hardcoded visual for the demo (Degenerate Tree) */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {[1,2,3,4,5].map((node, i) => (
                        <React.Fragment key={node}>
                          <div style={{ width: "40px", height: "40px", background: i===4 ? "#ef4444" : "var(--brand-primary)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", zIndex: 2 }}>
                            {node}
                          </div>
                          {i < 4 && <div style={{ width: "30px", height: "4px", background: "var(--border-light)", zIndex: 1 }} />}
                        </React.Fragment>
                      ))}
                    </div>
                    
                  </div>
                </div>
              </div>

              <button className="dsa-primary-btn" style={{ marginTop: "32px", width: "100%" }} onClick={() => navigate("/algo-details")}>
                Send to Interactive Visualizer ➔
              </button>

            </div>
          )}

        </div>
      </div>
            {showUnavailableModal && (
        <div className="modal-overlay">
            <div className="modal-content">
            <h2 className="modal-title">Service Temporarily Unavailable</h2>
            <p className="modal-text">
               This premium AI suite is currently in development to ensure an unparalleled experience for our community.

                <br /> Thank you for being a valued part of the IAPSS journey.
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
  );
}