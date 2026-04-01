import React from "react";
import { useNavigate } from "react-router-dom";
import "../GraphFromInputPage/GraphFromInputPage.css"; // Reusing the same CSS for consistency

export default function DrawGraphPage() {
  const navigate = useNavigate();

  return (
    <div className="dsa-page-root">
      <header className="dsa-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h1>Interactive Canvas</h1>
      </header>

      <div className="dsa-layout">
        <div className="dsa-canvas-area">
          <div className="dsa-toolbar">
            <button className="dsa-tool-btn">Add Node</button>
            <button className="dsa-tool-btn">Add Edge</button>
            <button className="dsa-tool-btn">Clear</button>
          </div>
          <div className="dsa-placeholder">
            Interactive Drawing Canvas Here
          </div>
        </div>

        <div className="dsa-sidebar">
          <h3>Generated Output</h3>
          <p>Adjacency List:</p>
          <pre className="dsa-code-box">
            {`vector<int> adj[N];\n// code will auto-generate`}
          </pre>
          <button className="dsa-primary-btn">Copy Code</button>
        </div>
      </div>
    </div>
  );
}