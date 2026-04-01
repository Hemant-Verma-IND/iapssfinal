import React from "react";
import { useNavigate } from "react-router-dom";
import "./GraphFromInputPage.css"; // We will reuse your global variables here!

export default function GraphFromInputPage() {
  const navigate = useNavigate();

  return (
    <div className="dsa-page-root">
      <header className="dsa-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h1>Graph from Inputs</h1>
      </header>

      <div className="dsa-layout">
        <div className="dsa-sidebar">
          <h3>Input Text</h3>
          <p>Paste your Adjacency List, Matrix, or LeetCode Array here:</p>
          <textarea 
            className="dsa-textarea" 
            placeholder="e.g. \n5 4\n1 2\n2 3\n..."
          ></textarea>
          <button className="dsa-primary-btn">Generate Graph</button>
        </div>

        <div className="dsa-canvas-area">
          <div className="dsa-placeholder">
            {/* Later, you will mount vis.js or react-flow here */}
            Graph Canvas will appear here
          </div>
        </div>
      </div>
    </div>
  );
}