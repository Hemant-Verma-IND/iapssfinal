import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./DashboardPage.css";
import { getAuth, clearAuth } from "../utils/auth";

/**
 * DashboardPage (final)
 * - Improved dark mode (glassmorphic), better contrast for cards in dark
 * - Recommended cards single-column (span full width)
 * - Big feature buttons wide and balanced
 * - Styled logout button
 * - Reduced footer spacing and coloured footer bar
 * - Larger quote above footer
 */

const PlatformLogo = ({ platform }) => {
  const p = platform.toLowerCase();

  // CODEFORCES (The 3 Bar Graph)
  if (p.includes("codeforces")) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <rect x="2" y="12" width="5" height="12" rx="1" fill="#FFC107" />
        <rect x="9.5" y="2" width="5" height="22" rx="1" fill="#2196F3" />
        <rect x="17" y="7" width="5" height="17" rx="1" fill="#F44336" />
      </svg>
    );
  }

  // LEETCODE (The Orange Arc)
  if (p.includes("leetcode")) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" color="#FFA116">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"/>
      </svg>
    );
  }

  // ATCODER (The Black Logo)
  if (p.includes("atcoder")) {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" color="#000">
        <path d="M12 1.5L.6 22.5h22.8L12 1.5zm0 3.9l7.7 14.1H4.3L12 5.4z" fillRule="evenodd"/>
      </svg>
    );
  }

  // CODECHEF (The Brown Ladle/Chef Hat representation)
  if (p.includes("codechef")) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" color="#5B4638">
        <path d="M12 2a10 10 0 0 0-7.75 16.38l.83-1.14a8.6 8.6 0 1 1 13.84 0l.83 1.14A10 10 0 0 0 12 2zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-3.5 6a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
      </svg>
    );
  }

  // Fallback (First Letter) if unknown
  return <span style={{fontSize: "1.2rem", fontWeight: "bold"}}>{platform[0]}</span>;
};

const StatCard = ({ title, value, delta, icon, color = "var(--accent)" }) => (
  <motion.div
    className="dp-statcard"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28 }}
  >
    <div className="dp-stat-icon" style={{ background: color }}>{icon}</div>
    <div className="dp-stat-texts">
      <div className="dp-stat-value">{value}</div>
      <div className="dp-stat-title">{title}</div>
    </div>
    <div className={`dp-stat-delta ${delta != null ? (delta >= 0 ? "up" : "down") : ""}`}>
      {delta != null ? (delta >= 0 ? `+${delta}` : `${delta}`) : ""}
    </div>
  </motion.div>
);

const ProblemCard = ({ p }) => (
  <motion.div
    className="dp-problem-card"
    whileHover={{ y: -6, boxShadow: "0 22px 48px rgba(11,34,90,0.12)" }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="dp-prob-header">
      <div className="dp-prob-title">{p.title}</div>
      <div className={`dp-prob-badge dp-badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</div>
    </div>
    <div className="dp-prob-meta">
      <span>{p.platform}</span>
      <span className="dp-prob-dot">•</span>
      <span>{p.time}</span>
    </div>
    <div className="dp-prob-actions">
      <button className="dp-btn dp-btn-solid" onClick={() => window.open(p.url, "_blank")}>Open</button>
    </div>
  </motion.div>
);
// 1. Clickable Activity Card (Recent Activity)
const ActivityItem = ({ item }) => (
  <a 
    href={item.url} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="dp-activity-item clickable-card"
  >
    <div className="dp-activity-left">
      <div className="dp-activity-line"></div>
      <div className="dp-activity-dot"></div>
    </div>
    <div className="dp-activity-content">
      <span className="dp-activity-time">{item.when}</span>
      <div className="dp-activity-title">{item.title}</div>
      <div className="dp-activity-meta">{item.meta}</div>
    </div>
    <div className="dp-icon-action">↗</div>
  </a>
);

// 2. Clickable Contest Card (Next Contests)
const ContestCard = ({ c }) => (
  <a 
    href={c.url} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="dp-contest-row clickable-card"
  >
    <div className="dp-contest-icon logo-mode">
      <PlatformLogo platform={c.platform} />
    </div>
    <div className="dp-contest-info">
      <div className="dp-contest-name">{c.name}</div>
      <div className="dp-contest-meta">
        <span className="dp-c-platform">{c.platform}</span> • {c.time}
      </div>
    </div>
    <div className="dp-icon-action">➜</div>
  </a>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const [themeDark, setThemeDark] = useState(() => localStorage.getItem("iapss_theme") === "dark");
  const [user, setUser] = useState({ name: "Coder" });
  const [streak, setStreak] = useState(0);
  const [summary, setSummary] = useState({ accuracy: 72, solvedThisWeek: 9, practiceMinutes: 210 });
  const [recommended, setRecommended] = useState([]);
  const [recent, setRecent] = useState([]);
  const [nextContests, setNextContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    if (!auth?.token) {
      navigate("/login");
      return;
    }
    setUser({ name: auth.user?.name || auth.user?.email?.split("@")[0] });

      setTimeout(() => {
      setStreak(12); // Realistic streak
      setSummary({ 
        accuracy: 68, 
        solvedThisWeek: 14, 
        practiceMinutes: 345 
      });

      // ACTUAL DATA for Dec 2025
      setRecommended([
        { 
          title: "Find Building Where Alice and Bob Can Meet", 
          platform: "LeetCode", 
          difficulty: "Hard", 
          time: "45m",
          url: "https://leetcode.com/problems/find-building-where-alice-and-bob-can-meet/"
        },
        { 
          title: "Kevin and Numbers", 
          platform: "Codeforces", 
          difficulty: "Medium", 
          time: "30m",
          url: "https://codeforces.com/problemset/problem/2061/D" 
        },
        { 
          title: "Frog Jump with K Distance", 
          platform: "AtCoder", 
          difficulty: "Easy", 
          time: "15m",
          url: "https://atcoder.jp/contests/dp/tasks/dp_b"
        },
      ]);

      setRecent([
        { 
          when: "15 min ago", 
          title: "Number of Islands", 
          meta: "Graph (BFS/DFS) • Medium",
          url: "https://leetcode.com/problems/number-of-islands/" 
        },
        { 
          when: "45 min ago", 
          title: "Longest Increasing Subsequence", 
          meta: "DP / Binary Search • Medium",
          url: "https://leetcode.com/problems/longest-increasing-subsequence/" 
        },
        { 
          when: "3h ago", 
          title: "Group Anagrams", 
          meta: "Hash Map • String",
          url: "https://leetcode.com/problems/group-anagrams/" 
        },
        { 
          when: "5h ago", 
          title: "Lowest Common Ancestor", 
          meta: "Binary Tree • Recursion",
          url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" 
        },
        { 
          when: "Yesterday", 
          title: "Boredom", 
          meta: "DP • Codeforces (1500 rated)",
          url: "https://codeforces.com/problemset/problem/455/A" 
        },
        { 
          when: "Yesterday", 
          title: "Trapping Rain Water", 
          meta: "Two Pointers • Hard",
          url: "https://leetcode.com/problems/trapping-rain-water/" 
        },
        { 
          when: "2 days ago", 
          title: "Search in Rotated Sorted Array", 
          meta: "Binary Search • Medium",
          url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" 
        },
        { 
          when: "3 days ago", 
          title: "Frog 1 (Educational DP)", 
          meta: "AtCoder • DP Basics",
          url: "https://atcoder.jp/contests/dp/tasks/dp_a" 
        }
      ]);

      // --- UPCOMING CONTESTS (Accurate for Dec 26, 2025) ---
      setNextContests([
        { 
          platform: "AtCoder", 
          name: "Beginner Contest 435", 
          time: "Tomorrow, 17:30 IST", // Sat Dec 27
          url: "https://atcoder.jp/contests/"
        },
        { 
          platform: "LeetCode", 
          name: "Weekly Contest 482", 
          time: "Sunday, 08:00 IST", // Sun Dec 28
          url: "https://leetcode.com/contest/"
        },
        { 
          platform: "Codeforces", 
          name: "Good Bye 2025", 
          time: "Dec 30, 20:05 IST", // Tue Dec 30 (Historical Trend)
          url: "https://codeforces.com/contests"
        },
        { 
          platform: "CodeChef", 
          name: "Starters 220 (Rated)", 
          time: "Dec 31, 20:00 IST", // Wed Dec 31
          url: "https://www.codechef.com/contests"
        },
      ]);

      setLoading(false);
    }, 600); 
  }, [navigate]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dp-root--light", "dp-root--dark");
    const activeClass = themeDark ? "dp-root--dark" : "dp-root--light";
    root.classList.add(activeClass);
    root.setAttribute("data-theme", themeDark ? "dark" : "light");
    localStorage.setItem("iapss_theme", themeDark ? "dark" : "light");
  }, [themeDark]);

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  const QUOTES = [
  { text: "Practice, analyse, and own every problem — habit wins over time.", author: "— IAPSS tip" },
  { text: "Every bug you fix today becomes a skill you own forever.", author: "— Unknown" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "— Cory House" },
  { text: "It doesn't matter where you are, it matters how you run", author: "— Hemant Verma" }
];

  const recommendedList = useMemo(() => recommended, [recommended]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
  // Cycle quote every 5 seconds
  const interval = setInterval(() => {
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);

  return (
    <div className={`dp-root ${themeDark ? "dp-root--dark" : "dp-root--light"}`}>
      <header className="dp-header">
        <div className="dp-brand" onClick={() => navigate("/")}>
          <div className="dp-brand-logo">IA</div>
          <div className="dp-brand-text">
            <div className="dp-brand-title">IAPSS</div>
            <div className="dp-brand-sub">Personal workspace</div>
          </div>
        </div>

        <div className="dp-header-actions">
          <button
            className="dp-theme-toggle"
            onClick={() => setThemeDark((s) => !s)}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {themeDark ? "☀️" : "🌙"}
          </button>

          <div className="dp-user-block">
            <div className="dp-user-name">Hi, {user.name}</div>
            <button className="dp-logout-btn" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="dp-main">
        <section className="dp-hero">
          <motion.div className="dp-hero-left card"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }}>
            <div className="dp-hero-head">
              <h1 className="dp-welcome-title">Welcome, {user.name} 👋</h1>
              <p className="dp-welcome-sub">Focused practice, curated problems and tools that turn attempts into mastery.</p>
            </div>

            <div className="dp-hero-actions">
              <motion.button className="dp-big-btn"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} onClick={() => navigate("/problem-analyser")}>
                <div className="dp-big-btn-left">🧠</div>
                <div className="dp-big-btn-body">
                  <div className="dp-big-btn-title">Problem Analyser</div>
                  <div className="dp-big-btn-desc">Drop statements, screenshots & get guided hints</div>
                </div>
              </motion.button>

              <motion.button className="dp-big-btn dp-big-btn-ghost"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} onClick={() => navigate("/code-analyser")}>
                <div className="dp-big-btn-left">🧩</div>
                <div className="dp-big-btn-body">
                  <div className="dp-big-btn-title">Code Analyser</div>
                  <div className="dp-big-btn-desc">Edge-case detection, complexity hints and style notes</div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </section>

<section className="dp-bottomgrid">
          {/* --- RECENT ACTIVITY SECTION --- */}
          <div className="dp-card dp-activity">
            <div className="dp-card-head">
              <div className="dp-card-title">Recent activity</div>
              <div className="dp-card-sub">Latest runs, hints and saves</div>
            </div>

            {/* Switched from <ul> to <div> to support the <a> tags inside ActivityItem */}
            <div className="dp-activity-list">
              {recent.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -6 }} 
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ActivityItem item={item} />
                </motion.div>
              ))}
              {recent.length === 0 && (
                 <div className="dp-empty-state">No recent activity</div>
              )}
            </div>
          </div>

          <aside className="dp-side-column">
            {/* --- NEXT CONTESTS SECTION --- */}
            <motion.div 
              className="dp-next-contests card small"
              initial={{ opacity: 0, x: 8 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.34 }}
            >
              <div className="dp-card-head-inline">
                <div className="dp-card-title">Next contests</div>
              </div>
              
              <div className="dp-contest-list">
                {nextContests.map((c, i) => (
                  <ContestCard key={i} c={c} />
                ))}
                {!nextContests.length && (
                  <div className="dp-empty-state">No upcoming contests</div>
                )}
              </div>
            </motion.div>

            {/* --- RECOMMENDED SECTION --- */}
            <motion.div 
              className="dp-card dp-recommended"
              initial={{ opacity: 0, x: 8 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.36 }}
            >
              <div className="dp-card-head">
                <div className="dp-card-title">Recommended for you</div>
                <div className="dp-card-sub">Based on recent attempts</div>
              </div>

              <div className="dp-problems-grid">
                <AnimatePresence>
                  {recommendedList.map((p, idx) => (
                    <motion.div 
                      key={p.title} 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: idx * 0.06 }}
                    >
                      <ProblemCard p={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </aside>
        </section>

        <div className="dp-card dp-quote-large">
    <AnimatePresence mode='wait'>
      <motion.blockquote 
        key={quoteIndex} // Key is vital for framer-motion to detect change
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        style={{ minHeight: '80px' }} // Prevents layout jump if text lengths differ
      >
        <p className="dp-quote-text-large">
          “{QUOTES[quoteIndex].text}”
        </p>
        <footer className="dp-quote-author">
          {QUOTES[quoteIndex].author}
        </footer>
      </motion.blockquote>
    </AnimatePresence>
  </div>
      </main>

      <footer className="dp-footer compact">
        <div className="dp-footer-left">© {new Date().getFullYear()} Hemant Verma | IAPSS. Built for competitive programming journeys.
</div>
        <div className="dp-footer-right">
          <button className="dp-link-btn" onClick={() => navigate("/")}>Home</button>
          <button className="dp-link-btn" onClick={() => navigate("/docs")}>About</button>
        </div>
      </footer>
    </div>
  );
}
