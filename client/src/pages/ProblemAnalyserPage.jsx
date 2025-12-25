import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProblemAnalyserPage.css";
import Tesseract from "tesseract.js";
// import { getAuth } from "../utils/auth"; // Uncomment for real auth
import { apiRequest } from "../services/api";
import { demoProblemAnalysis } from "../services/demoProblemAnalysis";


const Icon = ({ name, size=18 }) => {
  const icons = {
    back: <path d="M19 12H5M12 19l-7-7 7-7" />,
    image: <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21" />,
    close: <path d="M18 6L6 18M6 6l12 12" />,
    sparkles: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    save: <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />,
    bulb: <path d="M9 21h6v-1.5H9V21zM12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />,
    history: <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
    upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

export default function ProblemAnalyserPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // --- STATE ---
  const [problemText, setProblemText] = useState("");
  const [images, setImages] = useState([]); 
  const [isDragOver, setIsDragOver] = useState(false);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeHint, setActiveHint] = useState(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  
  // MOCK HISTORY DATA (Contains full analysis payloads so clicking works)
  const [history, setHistory] = useState([
    { 
      id: 101, 
      title: "Longest Path in DAG", 
      date: "2 hrs ago",
      // Stored result data
      data: {
        topic: ["Graph Theory", "DP"], difficulty: "Medium", difficultyScore: 50,
        summary: "Find longest path in a Directed Acyclic Graph.",
        hints: ["Use Topological Sort.", "DP state: dist[v] = max(dist[u] + weight(u,v))."],
        approach: "1. Topo Sort.\n2. Relax edges in topo order."
      }
    },
    { 
      id: 102, 
      title: "Knapsack Variation", 
      date: "Yesterday",
      data: {
        topic: ["DP"], difficulty: "Hard", difficultyScore: 85,
        summary: "0/1 Knapsack with constraint N <= 100, W <= 10^9.",
        hints: ["W is too large for standard DP table.", "Flip the DP state: min weight for value V."],
        approach: "dp[v] = min weight to get value v.\nIterate values up to max possible."
      }
    }
  ]);

  // --- HANDLERS: Image Uploads ---
  const handleFiles = (files) => {
    const imgFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imgFiles.length === 0) return;
    const newImages = imgFiles.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) files.push(items[i].getAsFile());
    }
    if (files.length > 0) {
      e.preventDefault();
      handleFiles(files);
    }
  };
  const removeImage = (id) => setImages(prev => prev.filter(img => img.id !== id));

  // --- THEME STATE (sync with dashboard) ---
const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("iapss_theme") === "dark";
});

// Apply theme on mount + change
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("iapss-dark");
  } else {
    document.documentElement.classList.remove("iapss-dark");
  }
  localStorage.setItem("iapss_theme", darkMode ? "dark" : "light");
}, [darkMode]);


// --- ANALYSIS HANDLERS ---


const runAnalysis = async () => {
    if (!problemText && images.length === 0) {
      alert("Please describe the problem or paste a screenshot.");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setActiveHint(null);

    try {
      let combinedText = problemText;

      // --- START CHANGE: OCR PROCESS ---
      // If there are images, convert them to text using Tesseract.js
      if (images.length > 0) {
        console.log("Processing images with OCR...");
        
        // Map all images to Tesseract promises
        const ocrPromises = images.map((img) => 
          Tesseract.recognize(
            img.url,
            'eng', // Language code
            { 
              logger: m => console.log(m) // Optional: logs progress to console
            }
          )
        );

        // Wait for all images to be converted
        const results = await Promise.all(ocrPromises);
        
        // Extract the text strings and join them
        const extractedText = results.map(result => result.data.text).join("\n\n");
        
        // Append extracted text to the main problem text
        combinedText += `\n\n[Extracted from Images]:\n${extractedText}`;
        console.log(combinedText);
      }
      // --- END CHANGE: OCR PROCESS ---

      const result = await apiRequest("/problems/analyse", {
        method: "POST",
        body: JSON.stringify({
          text: combinedText, // We send the combined text (Typed + OCR Result)
          images: [], // We clear images since we converted them to text
        }),
      });

      // 🔒 HARD VALIDATION — do not trust backend blindly
      if (
        !result ||
        !Array.isArray(result.topic) ||
        !Array.isArray(result.hints) ||
        result.hints.length !== 3 ||
        typeof result.summary !== "string" ||
        typeof result.approach !== "string"
      ) {
        throw new Error("Invalid analysis format from backend");
      }

      // ✅ Backend response accepted
      setAnalysis(result);

      setHistory((prev) => [
        {
          id: Date.now(),
          title: combinedText.substring(0, 20) || "Problem Analysis",
          date: "Just now",
          data: result,
        },
        ...prev,
      ]);
    } catch (err) {
      // 🚨 NEVER SILENTLY FAIL
      console.error("Problem analysis failed. Switching to demo mode.", err);
      alert(
        "AI analysis service is currently unavailable.\nShowing demo analysis instead."
      );

      const demoResult = demoProblemAnalysis();

      setAnalysis(demoResult);

      setHistory((prev) => [
        {
          id: Date.now(),
          title: "Demo Analysis",
          date: "Offline / Fallback",
          data: demoResult,
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };


  // --- Load from History Function ---
  const loadFromHistory = (item) => {
    setAnalysis(item.data); // Restore the analysis data
    setActiveHint(null);    // Reset UI state
    setHistoryOpen(false);  // Close dropdown
  };

  const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/problem/upload-image", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  setImages(prev => [
    ...prev,
    { url: data.file.url } // ✅ only URL stored
  ]);
};


  return (
    <div className="pa-page">
      {/* --- HEADER --- */}
      <nav className="pa-nav">
        <button className="pa-nav-btn" onClick={() => navigate("/dashboard")}>
          <Icon name="back" /> Back
        </button>
        
        {/* CENTER BRANDING */}
        <div className="pa-nav-center">
          <span className="pa-brand-text" onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}>IAPSS</span>
          <span className="pa-sep">/</span>
          <span className="pa-page-title">Problem Analyser</span>
          <button className="pa-theme-toggle" 
        onClick={() => setDarkMode(prev => !prev)}
        title="Toggle Theme"
>
        {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
        

        <div className="pa-history-wrapper">
          <button 
            className={`pa-nav-btn ${historyOpen ? 'active' : ''}`} 
            onClick={() => setHistoryOpen(!historyOpen)}
          >
            <Icon name="history" /> History
          </button>
          
          {historyOpen && (
            <div className="pa-history-dropdown">
              <div className="hist-head">Recent Analysis</div>
              <div className="hist-list">
                {history.length === 0 && <div className="hist-item">No history yet</div>}
                
                {history.map(h => (
                  <div key={h.id} className="hist-item" onClick={() => loadFromHistory(h)}>
                    <span className="hist-title">{h.title}</span>
                    <span className="hist-date">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* --- MAIN GRID --- */}
      <div className="pa-grid">
        
        {/* --- LEFT: INPUT ZONE --- */}
        <div className="pa-column pa-left">
          <div className="pa-card">
            <div className="pa-card-header">
              <span className="pa-label">Problem Statement</span>
              <span className="pa-sublabel">Text or Screenshots</span>
            </div>

            <textarea 
              className="pa-textarea" 
              placeholder="Paste problem text here (or CTRL+V to paste images)..." 
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              onPaste={handlePaste} 
            />

            {images.length > 0 && (
              <div className="pa-image-strip">
                {images.map(img => (
                  <div key={img.id} className="pa-img-chip">
                    <img src={img.url} alt="Snippet" />
                    <button className="img-remove" onClick={() => removeImage(img.id)}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div 
              className={`pa-dropzone ${isDragOver ? "drag-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
            >
              <div className="drop-content">
                <div className="drop-icon"><Icon name="image" size={24}/></div>
                <div><span className="link-text">Click to upload</span> or drag and drop</div>
                <div className="drop-hint">PNG, JPG, Screenshots</div>
              </div>
              <input type="file" multiple accept="image/*" hidden ref={inputRef} onChange={(e) => handleFiles(e.target.files)}/>
            </div>

            <button 
              className={`pa-action-btn ${loading ? 'loading' : ''}`}
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading ? "Analysing..." : <><Icon name="sparkles" /> Run AI Analysis</>}
            </button>
          </div>
        </div>

        {/* --- RIGHT: OUTPUT ZONE --- */}
        <div className="pa-column pa-right">
          {!analysis && !loading && (
            <div className="pa-empty-state">
              <div className="empty-icon"><Icon name="sparkles" size={32} /></div>
              <h3>Ready to Analyse</h3>
              <p>I will break down logic, detect difficulty, and generate hints.</p>
            </div>
          )}

          {loading && (
            <div className="pa-loading-state">
              <div className="loader"></div>
              <p>Analyzing problem logic...</p>
            </div>
          )}

          {analysis && (
            <div className="pa-results fade-in">
              {/* Meta */}
              <div className="res-meta-row">
                <div className="res-card topic-card">
                  <span className="pa-label">Topics</span>
                  <div className="tag-row">
                    {analysis.topic.map(t => <span key={t} className="res-tag">{t}</span>)}
                  </div>
                </div>
                <div className="res-card diff-card">
                  <span className="pa-label">Difficulty</span>
                  <div className="diff-bar-container">
                    <div className="diff-name" style={{color: analysis.difficultyScore > 60 ? '#f59e0b' : '#10b981'}}>{analysis.difficulty}</div>
                    <div className="diff-bar">
                      <div className="diff-fill" style={{width: `${analysis.difficultyScore}%`, background: analysis.difficultyScore > 60 ? '#f59e0b' : '#10b981'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hints */}
              <div className="pa-hint-section">
                <div className="sec-head"><Icon name="bulb" /> Progressive Hints</div>
                <div className="hint-list">
                  {analysis.hints.map((hint, idx) => (
                    <div 
                      key={idx} 
                      className={`hint-card ${activeHint === idx ? 'revealed' : 'blur'}`}
                      onClick={() => setActiveHint(activeHint === idx ? null : idx)}
                    >
                      <div className="hint-top">
                        <span className="hint-n">Hint {idx + 1}</span>
                        <span className="hint-action">{activeHint === idx ? "Hide" : "Click to Reveal"}</span>
                      </div>
                      <p>{hint}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approach */}
              <div className="res-card strategy-card">
                <div className="sec-head">Recommended Approach</div>
                <p className="summary-text">{analysis.summary}</p>
                <div className="code-block">
                  <pre>{analysis.approach}</pre>
                </div>
              </div>

              <div className="res-footer">
                <button className="footer-btn"><Icon name="save" /> Analysis Saved</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}