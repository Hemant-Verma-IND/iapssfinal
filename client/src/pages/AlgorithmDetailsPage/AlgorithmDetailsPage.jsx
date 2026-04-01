import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../GraphFromInputPage/GraphFromInputPage.css";

// --- STEP 1: DATA STRUCTURE ---
const ALGORITHM_DATA = {
  Searching: {
    "Linear Search": {
      code: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
      trace: [
        {
          line: 1,
          vars: { target: 7, i: "N/A" },
          arrays: { arr: [2, 4, 7, 9] },
          log: "Searching for 7 in the array.",
        },
        {
          line: 2,
          vars: { target: 7, i: 0 },
          arrays: { arr: [2, 4, 7, 9] },
          log: "i = 0. Checking arr[0] (2)",
        },
        {
          line: 3,
          vars: { target: 7, i: 0 },
          arrays: { arr: [2, 4, 7, 9] },
          log: "2 != 7. Moving to next index.",
        },
        {
          line: 2,
          vars: { target: 7, i: 1 },
          arrays: { arr: [2, 4, 7, 9] },
          log: "i = 1. Checking arr[1] (4)",
        },
        {
          line: 3,
          vars: { target: 7, i: 1 },
          arrays: { arr: [2, 4, 7, 9] },
          log: "4 != 7. Moving to next index.",
        },
        {
          line: 2,
          vars: { target: 7, i: 2 },
          arrays: { arr: [2, 4, 7, 9] },
          log: "i = 2. Checking arr[2] (7)",
        },
        {
          line: 4,
          vars: { target: 7, i: 2 },
          arrays: { arr: [2, 4, 7, 9] },
          log: "Match found! Returning index 2.",
        },
      ],
    },
    "Binary Search": {
      code: `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      trace: [
        {
          line: 2,
          vars: { target: 15, low: 0, high: 5, mid: "N/A" },
          arrays: { arr: [2, 5, 8, 12, 15, 20] },
          log: "Initial bounds: [0, 5]",
        },
        {
          line: 4,
          vars: { target: 15, low: 0, high: 5, mid: 2 },
          arrays: { arr: [2, 5, 8, 12, 15, 20] },
          log: "mid = 2. arr[2] (8) < 15.",
        },
        {
          line: 6,
          vars: { target: 15, low: 3, high: 5, mid: 2 },
          arrays: { arr: [2, 5, 8, 12, 15, 20] },
          log: "Updating low to mid + 1 (3).",
        },
        {
          line: 4,
          vars: { target: 15, low: 3, high: 5, mid: 4 },
          arrays: { arr: [2, 5, 8, 12, 15, 20] },
          log: "New mid = 4. arr[4] (15) == 15.",
        },
        {
          line: 5,
          vars: { target: 15, low: 3, high: 5, mid: 4 },
          arrays: { arr: [2, 5, 8, 12, 15, 20] },
          log: "Target found at index 4!",
        },
      ],
    },
  },
  Sorting: {
    "Bubble Sort": {
      code: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
        }
    }
}`,
      trace: [
        {
          line: 1,
          vars: { i: "N/A", j: "N/A" },
          arrays: { arr: [5, 1, 4, 2] },
          log: "Starting Bubble Sort on [5, 1, 4, 2]",
        },
        {
          line: 2,
          vars: { i: 0, j: "N/A" },
          arrays: { arr: [5, 1, 4, 2] },
          log: "Outer Loop: Pass 1",
        },
        {
          line: 3,
          vars: { i: 0, j: 0 },
          arrays: { arr: [5, 1, 4, 2] },
          log: "Comparing arr and arr",
        },
        {
          line: 5,
          vars: { i: 0, j: 0 },
          arrays: { arr: [1, 5, 4, 2] },
          log: "5 > 1: Swapping elements.",
        },
        {
          line: 3,
          vars: { i: 0, j: 1 },
          arrays: { arr: [1, 5, 4, 2] },
          log: "Comparing arr and arr",
        },
        {
          line: 5,
          vars: { i: 0, j: 1 },
          arrays: { arr: [1, 4, 5, 2] },
          log: "5 > 4: Swapping elements.",
        },
        {
          line: 3,
          vars: { i: 0, j: 2 },
          arrays: { arr: [1, 4, 5, 2] },
          log: "Comparing arr and arr",
        },
        {
          line: 5,
          vars: { i: 0, j: 2 },
          arrays: { arr: [1, 4, 2, 5] },
          log: "5 > 2: Swapping elements. Pass 1 done.",
        },
      ],
    },
    "Selection Sort": {
      code: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}`,
      trace: [
        {
          line: 1,
          vars: { i: "N/A", min_idx: "N/A" },
          arrays: { arr: [64, 25, 12, 22] },
          log: "Starting Selection Sort.",
        },
        {
          line: 2,
          vars: { i: 0, min_idx: 0 },
          arrays: { arr: [64, 25, 12, 22] },
          log: "Assume 64 is min_idx.",
        },
        {
          line: 4,
          vars: { i: 0, min_idx: 1, j: 1 },
          arrays: { arr: [64, 25, 12, 22] },
          log: "25 < 64: New min_idx is 1.",
        },
        {
          line: 4,
          vars: { i: 0, min_idx: 2, j: 2 },
          arrays: { arr: [64, 25, 12, 22] },
          log: "12 < 25: New min_idx is 2.",
        },
        {
          line: 7,
          vars: { i: 0, min_idx: 2 },
          arrays: { arr: [12, 25, 64, 22] },
          log: "Swapping 12 with 64 at start.",
        },
      ],
    },
  },
};

// --- ICONS ---
function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function StepIcon({ flip = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: flip ? "rotate(180deg)" : "none" }}
    >
      <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  );
}

export default function AlgorithmDetailsPage() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("Searching");
  const [algorithm, setAlgorithm] = useState("Linear Search");
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [panelWidth, setPanelWidth] = useState(45);
  const [isResizing, setIsResizing] = useState(false);

  const categoryData = ALGORITHM_DATA[category] || {};
  const algorithmKeys = Object.keys(categoryData);

  const activeAlgo = useMemo(() => {
    return (
      categoryData[algorithm] ||
      (algorithmKeys.length > 0 ? categoryData[algorithmKeys[0]] : null) || {
        code: "",
        trace: [],
      }
    );
  }, [categoryData, algorithm, algorithmKeys.length]);

  const activeTrace = activeAlgo.trace || [];
  const activeCode = activeAlgo.code || "";

  const safeStepIdx = Math.min(
    currentStepIdx,
    Math.max(activeTrace.length - 1, 0)
  );

  const currentState =
    activeTrace[safeStepIdx] || activeTrace[0] || {
      line: 0,
      vars: {},
      arrays: {},
      log: "",
    };

  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [category, algorithm]);

  useEffect(() => {
    let timer;

    if (isPlaying) {
      if (safeStepIdx < activeTrace.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIdx((prev) => prev + 1);
        }, 1200);
      } else {
        setIsPlaying(false);
      }
    }

    return () => clearTimeout(timer);
  }, [isPlaying, safeStepIdx, activeTrace.length]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth >= 20 && newWidth <= 80) {
        setPanelWidth(newWidth);
      }
    };

    const stopResizing = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isResizing]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const firstAlgorithm = Object.keys(ALGORITHM_DATA[newCategory] || {})[0] || "";

    setCategory(newCategory);
    setAlgorithm(firstAlgorithm);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const goPrevious = () => {
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
    setIsPlaying(false);
  };

  const goNext = () => {
    setCurrentStepIdx((prev) =>
      Math.min(activeTrace.length - 1, prev + 1)
    );
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (activeTrace.length === 0) return;
    setIsPlaying((prev) => !prev);
  };

  const isFirstStep = safeStepIdx === 0;
  const isLastStep = safeStepIdx === activeTrace.length - 1;
  const hasTrace = activeTrace.length > 0;

  const btnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px"
};

  return (
    <div className="dsa-page-root" style={{ position: "relative", paddingBottom: "120px" }}>
      <header className="dsa-header">
        <button onClick={() => navigate(-1)} className="back-btn" type="button">
          ← Back
        </button>

        <h1 className="dsa-title-text">Code Visualizer</h1>

        <div className="header-slider-group">
          <label>CODE SPACE</label>
          <input
            type="range"
            min="20"
            max="80"
            value={panelWidth}
            onChange={(e) => setPanelWidth(Number(e.target.value))}
            className="width-slider"
          />
        </div>

        <div className="dsa-nav-controls">
          <div className="dsa-dropdown-group">
            <label>CATEGORY</label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="dsa-select"
            >
              {Object.keys(ALGORITHM_DATA).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="dsa-dropdown-group">
            <label>ALGORITHM</label>
            <select
              value={algorithm}
              onChange={handleAlgorithmChange}
              className="dsa-select"
            >
              {algorithmKeys.map((algo) => (
                <option key={algo} value={algo}>
                  {algo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="dsa-layout">
        <div
          className="dsa-sidebar"
          style={{ width: `${panelWidth}%`, flex: "none" }}
        >
          <div className="dsa-panel-header">
            <h3>Execution Trace</h3>
            <span className="step-counter">
              Step {safeStepIdx + 1} / {Math.max(activeTrace.length, 1)}
            </span>
          </div>

          <div className="dsa-code-container">
            {activeCode.split("\n").map((line, idx) => (
              <div
                key={idx}
                className={`dsa-code-line ${
                  currentState.line === idx + 1 ? "active" : ""
                }`}
              >
                <span className="line-number">{idx + 1}</span>
                <pre>{line}</pre>
              </div>
            ))}
          </div>

          <div className="dsa-log-box">
            <p>⚡ {currentState.log}</p>
          </div>

                    <div
            className="dsa-playback-bar"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "16px",
                marginTop: "12px"
            }}
            >
            <button
              className="ctrl-btn"
              type="button"
              onClick={goPrevious}
              disabled={!hasTrace || isFirstStep}
            >
              <StepIcon flip />
            </button>

            <button 
            
            className="play-btn"
            type="button"
            onClick={togglePlay}
            disabled={!hasTrace}
            style={btnStyle}
            >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button
              className="ctrl-btn"
              type="button"
              onClick={goNext}
              disabled={!hasTrace || isLastStep}
            >
              <StepIcon />
            </button>
          </div>
        </div>

        <div
          className={`dsa-resizer ${isResizing ? "is-resizing" : ""}`}
          onMouseDown={startResizing}
        />

        <div className="dsa-canvas-area">
          <div className="canvas-content">
            <h2>Memory State</h2>

            <div className="vis-section">
              <h4>Variables</h4>
              <div className="var-grid">
                {Object.entries(currentState.vars || {}).map(([name, val]) => (
                  <div key={name} className="var-card">
                    <span className="var-name">{name}</span>
                    <span className="var-val">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="vis-section">
              <h4>Data Structures</h4>
              {Object.entries(currentState.arrays || {}).map(([name, arr]) => (
                <div key={name} className="array-wrapper">
                  <span className="label">{name}</span>
                  <div className="array-row">
                    {arr.map((item, i) => {
                      const highlighted =
                        currentState.vars?.i === i ||
                        currentState.vars?.j === i ||
                        currentState.vars?.mid === i ||
                        currentState.vars?.min_idx === i;

                      return (
                        <div
                          key={i}
                          className={`array-cell ${highlighted ? "highlight" : ""}`}
                        >
                          {item}
                          <span className="idx">{i}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{
  position: "absolute",
  bottom: "1px",
  left: "24px",
  right: "24px",
  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))",
  backdropFilter: "blur(10px)",
  border: "1px solid var(--brand-glow)",
  borderRadius: "16px",
  padding: "20px 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 -10px 40px rgba(59, 130, 246, 0.2)",
  zIndex: 100
}}>
  <div>
    <h3 style={{ margin: "0 0 8px 0", color: "white", fontSize: "1.3rem" }}>
      Want to visualize your own code?
    </h3>
    <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.95rem" }}>
      Log in to paste your own C++, Python, or Java code. Our AI engine automatically generates execution traces for DP, Trees, and Graphs.
    </p>
  </div>

  <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
    <button
      className="back-btn"
      style={{ color: "white", borderColor: "rgba(255,255,255,0.2)" }}
      onClick={() => navigate("/login")}
    >
      Log In
    </button>

    <button
      className="dsa-primary-btn"
      onClick={() => navigate("/register")}
    >
      Sign Up for Free
    </button>
  </div>
</div>
    </div>
  );
}