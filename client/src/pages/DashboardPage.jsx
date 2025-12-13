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
      <div className={`dp-prob-badge dp-badge-${p.difficulty}`}>{p.difficulty}</div>
    </div>
    <div className="dp-prob-meta">
      <span>{p.platform}</span>
      <span className="dp-prob-dot">•</span>
      <span>{p.time}</span>
    </div>
    <div className="dp-prob-actions">
      <button className="dp-btn dp-btn-solid" onClick={() => alert("Open " + p.title)}>Open</button>
    </div>
  </motion.div>
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

    // Fake API load (replace with real calls)
    setTimeout(() => {
      setStreak(4);
      setSummary({ accuracy: 78, solvedThisWeek: 12, practiceMinutes: 275 });
      setRecommended([
        { title: "Maximize array segments", platform: "Codeforces", difficulty: "Medium", time: "20m" },
        { title: "Tree DP classic", platform: "AtCoder", difficulty: "Hard", time: "40m" },
        { title: "Binary search on answers", platform: "LeetCode", difficulty: "Easy", time: "25m" },
      ]);
      setRecent([
        { when: "2h", title: "Solved — Two Pointers", meta: "LeetCode • +10 XP" },
        { when: "1d", title: "Analyzed — Range Query", meta: "Saved hints • 3 used" },
      ]);
      setNextContests([
        { platform: "Codeforces", name: "Div.2 Round 1234", time: "tomorrow 10:00 IST" },
        { platform: "CodeChef", name: "Cook-Off", time: "in 3 days" },
      ]);
      setLoading(false);
    }, 420);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dp-dark", themeDark);
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
          <div className="dp-card dp-activity">
            <div className="dp-card-head">
              <div className="dp-card-title">Recent activity</div>
              <div className="dp-card-sub">Latest runs, hints and saves</div>
            </div>

            <ul className="dp-activity-list">
              {recent.map((a) => (
                <motion.li key={a.title + a.when} className="dp-activity-item"
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="dp-activity-time">{a.when}</div>
                  <div>
                    <div className="dp-activity-title">{a.title}</div>
                    <div className="dp-activity-meta">{a.meta}</div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <aside className="dp-side-column">
            <motion.div className="dp-next-contests card small"
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.34 }}>
              <div className="dp-card-head-inline">
                <div className="dp-card-title">Next contests</div>
              </div>
              <ul className="dp-contest-list">
                {nextContests.map((c, i) => (
                  <li key={i}>
                    <div className="contest-name">{c.name}</div>
                    <div className="contest-meta">{c.platform} • {c.time}</div>
                  </li>
                ))}
                {!nextContests.length && <li className="empty">No upcoming contests</li>}
              </ul>
            </motion.div>

            <motion.div className="dp-card dp-recommended"
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.36 }}>
              <div className="dp-card-head">
                <div className="dp-card-title">Recommended for you</div>
                <div className="dp-card-sub">Based on recent attempts</div>
              </div>

              <div className="dp-problems-grid">
                <AnimatePresence>
                  {recommendedList.map((p, idx) => (
                    <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
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
        <div className="dp-footer-left">© {new Date().getFullYear()} IAPSS</div>
        <div className="dp-footer-right">
          <button className="dp-link-btn" onClick={() => alert("Help")}>Help</button>
          <button className="dp-link-btn" onClick={() => alert("Settings")}>Settings</button>
        </div>
      </footer>
    </div>
  );
}
