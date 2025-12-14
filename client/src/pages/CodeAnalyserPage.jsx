import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CodeAnalyserPage.css";
import { apiRequest } from "../services/api";
import { demoCodeAnalysis } from "../services/demoCodeAnalysis";
// import { getAuth } from "../utils/auth"; 

const Icon = ({ name, size = 18 }) => {
  const icons = {
    back: <path d="M19 12H5M12 19l-7-7 7-7" />,
    sparkles: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    bug: <path d="M19 8l-3 3m0-6l3 3M5 8l3 3m0-6L5 8M12 20v-6M6 14H4m16 0h-2M8 20h8M9 6h6" />,
    speed: <path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M19.07 4.93l-2.83 2.83M22 12h-4" />,
    save: <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />,
    history: <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
    check: <path d="M20 6L9 17l-5-5" />,
    copy: <path d="M8 2H1v13h2V4h11V2H8zm4 4H5v13h13V6H12z" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
    upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  };

  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

export default function CodeAnalyserPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- STATE ---
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // History State
  const [historyOpen, setHistoryOpen] = useState(false);
  
  // Mock History (now includes code snapshot)
  const [history, setHistory] = useState([
    {
      id: 1, 
      title: "Binary Search Implementation", 
      date: "2 hrs ago", 
      language: "cpp",
      code: "int binarySearch(int arr[], int l, int r, int x) {\n  while (l <= r) {\n    int m = l + (r - l) / 2;\n    if (arr[m] == x) return m;\n    if (arr[m] < x) l = m + 1;\n    else r = m - 1;\n  }\n  return -1;\n}",
      data: {
        complexity: "O(log N)", 
        space: "O(1)",
        issues: [{ type: "Safe", text: "Standard iterative implementation." }],
        score: 95,
        refactor: "// Already optimal.\n// Consider handling overflow if L+R > INT_MAX using l + (r-l)/2"
      }
    }
  ]);

  // Dark Mode Sync
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("iapss-dark");
    else root.classList.remove("iapss-dark");
  }, [isDark]);

  // --- FILE HANDLING ---

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Detect language from extension
    const name = file.name.toLowerCase();
    if (name.endsWith(".py")) setLanguage("python");
    else if (name.endsWith(".java")) setLanguage("java");
    else if (name.endsWith(".go")) setLanguage("go");
    else if (name.endsWith(".js")) setLanguage("javascript");
    else if (name.endsWith(".cpp") || name.endsWith(".c")) setLanguage("cpp");

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCode(ev.target.result);
    };
    reader.readAsText(file);
  };

  // --- ANALYSIS ---

  const runAnalysis = async () => {
  if (!code.trim()) {
    alert("Please paste your code or upload a file first.");
    return;
  }

  setLoading(true);
  setAnalysis(null);

  try {
    const result = await apiRequest("/code/analyse", {
      method: "POST",
      body: JSON.stringify({
        code,
        language,
      }),
    });

    // 🔒 HARD VALIDATION — DO NOT TRUST AI OUTPUT
    if (
      !result ||
      typeof result.summary !== "string" ||
      typeof result.complexity !== "string" ||
      !Array.isArray(result.issues) ||
      !Array.isArray(result.tests)
    ) {
      throw new Error("Invalid code analysis format from backend");
    }

    // ✅ Backend response accepted
    setAnalysis(result);

    setHistory(prev => [
      {
        id: Date.now(),
        title: `${language.toUpperCase()} Analysis`,
        date: "Just now",
        code,
        language,
        data: result,
      },
      ...prev,
    ]);

  } catch (err) {
    // 🚨 ABSOLUTE FALLBACK GUARANTEE
    console.error("Code analysis failed. Switching to demo mode.", err);

    alert(
      "Code analysis service is currently unavailable.\nShowing demo analysis instead."
    );

    const demoResult = demoCodeAnalysis();

    setAnalysis(demoResult);

    setHistory(prev => [
      {
        id: Date.now(),
        title: "Demo Code Analysis",
        date: "Offline / Fallback",
        code,
        language,
        data: demoResult,
      },
      ...prev,
    ]);
  } finally {
    setLoading(false);
  }
};


  // Restores Logic + Results
  const loadFromHistory = (item) => {
    setCode(item.code);       // Restore input code
    setLanguage(item.language); // Restore input lang
    setAnalysis(item.data);   // Restore output data
    setHistoryOpen(false);
  };

  return (
    <div className="ca-page">
      {/* ---------- NAV ---------- */}
      <nav className="ca-nav">
        <button className="ca-nav-btn" onClick={() => navigate("/dashboard")}>
          <Icon name="back" /> Dashboard
        </button>

        <div className="ca-nav-center">
          <span className="ca-brand" onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}>IAPSS</span>
          <span className="ca-sep">/</span>
          <span className="ca-title">Code Analyser</span>
          <button className="ca-theme-toggle" onClick={() => setIsDark(!isDark)}>
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
        <div className="ca-nav-right">


          <div className="ca-history-wrapper">
            <button 
              className={`ca-nav-btn ${historyOpen ? 'active' : ''}`} 
              onClick={() => setHistoryOpen(!historyOpen)}
            >
              <Icon name="history" /> History
            </button>
            
            {historyOpen && (
              <div className="ca-history-dropdown">
                <div className="hist-head">Previous Scans</div>
                <div className="hist-list">
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
        </div>
      </nav>

      {/* ---------- GRID LAYOUT ---------- */}
      <div className="ca-grid">
        
        {/* === LEFT: EDITOR === */}
        <div className="ca-left">
          <div className="ca-card">
            
            {/* Header: Lang + Upload */}
            <div className="ca-header-row">
              <span className="ca-badge">INPUT</span>
              <div className="ca-actions-row">
                {/* Upload Button */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: "none" }} 
                  accept=".cpp,.c,.java,.py,.go,.txt,.js"
                  onChange={handleFileUpload} 
                />
                <button 
                  className="icon-only-btn" 
                  title="Upload File"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Icon name="folder" /> <span className="btn-lbl">Open File</span>
                </button>

                <div className="vertical-sep"></div>

                <div className="lang-selector">
                  <select value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="go">Go</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
              </div>
            </div>

            <textarea
              className="ca-code-input"
              placeholder="// Paste your code here or upload a file..."
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck="false"
            />

            <button
              className={`ca-run-btn ${loading ? "loading" : ""}`}
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <><Icon name="sparkles" /> Analyze Code</>
              )}
            </button>
          </div>
        </div>

        {/* === RIGHT: OUTPUT === */}
        <div className="ca-right">
          
          {/* EMPTY STATE */}
          {!analysis && !loading && (
            <div className="ca-empty">
              <div className="empty-icon-circle"><Icon name="code" size={32}/></div>
              <h3>Waiting for Code</h3>
              <p>Paste code or upload a file (.cpp, .java, .go, .py) to check complexity & logic.</p>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="ca-loading">
              <div className="loading-bar"><div className="bar-fill"></div></div>
              <p>Checking edge cases & complexity...</p>
            </div>
          )}

          {/* RESULTS STATE */}
          {analysis && !loading && (
            <div className="ca-results fade-in">
              
              <div className="metrics-row">
                <div className="metric-card">
                  <div className="m-icon purple"><Icon name="speed"/></div>
                  <div>
                    <span className="m-val">{analysis.complexity}</span>
                    <span className="m-lbl">Time Complexity</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="m-icon blue"><Icon name="shield"/></div>
                  <div>
                    <span className="m-val">{analysis.score}/100</span>
                    <span className="m-lbl">Quality Score</span>
                  </div>
                </div>
              </div>

              <div className="analysis-box">
                <div className="box-title"><Icon name="bug" /> Detected Issues</div>
                <div className="issues-list">
                  {analysis.issues.map((iss, i) => (
                    <div key={i} className="issue-item">
                      <span className={`issue-tag ${iss.type.toLowerCase()}`}>{iss.type}</span>
                      <p>{iss.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analysis-box dark-mode-box">
                <div className="box-title title-light"><Icon name="sparkles" /> Recommended Fix</div>
                <pre className="code-output">{analysis.refactor}</pre>
                <div className="copy-action">
                  <button className="copy-btn" onClick={() => alert("Copied!")}><Icon name="copy"/> Copy</button>
                </div>
              </div>

              <div className="res-footer">
                <button className="save-btn" onClick={() => alert("Saved!")}>
                  <Icon name="save" /> Save Report
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}