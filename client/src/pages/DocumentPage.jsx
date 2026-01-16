import React from "react";
import { useNavigate } from "react-router-dom";
import "./DocumentPage.css";

export default function DocumentPage() {
  const navigate = useNavigate();

  return (
    <div className="doc-page">
      {/* Header */}
      <header className="doc-header">
        <div className="doc-brand" onClick={() => navigate("/")}>
          <div className="doc-logo">IA</div>
          <div>
            <div className="doc-title">IAPSS</div>
            <div className="doc-sub">Project Documentation</div>
          </div>
        </div>

        <button className="doc-back" onClick={() => navigate("/")}>
          Back to IAPSS
        </button>
      </header>

      {/* PDF Viewer */}
      <main className="doc-content">
        <iframe
          src="/docs/IAPSS_Project_Document.pdf"
          title="IAPSS Documentation"
          className="doc-pdf"
        />
      </main>
    </div>
  );
}
