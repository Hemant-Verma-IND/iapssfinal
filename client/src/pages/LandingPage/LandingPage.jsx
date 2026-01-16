import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
// Ensure this path matches where you saved the TextType component
import TextType from "../../components/ui/TextType";
import { getAuth, clearAuth } from "../../utils/auth";


const newsItems = [
  {
    title: "ICPC Asia regional registrations open",
    source: "ICPC",
    meta: "This month",
  },
  {
    title: "New Div.2 round announced on Codeforces",
    source: "Codeforces",
    meta: "Online • Upcoming",
  },
  {
    title: "LeetCode adds new daily challenge series",
    source: "LeetCode",
    meta: "Ongoing",
  },
];

const contestItems = [
  {
    title: "Codeforces Round #XXXX (Div. 2)",
    source: "Codeforces",
    meta: "Upcoming",
  },
  {
    title: "Cook-Off – Rated for All",
    source: "CodeChef",
    meta: "Upcoming",
  },
  {
    title: "AtCoder Beginner Contest",
    source: "AtCoder",
    meta: "Upcoming",
  },
];

const podcastItems = [
  {
    title: "CP Weekly – Competitive Programming Podcast",
    source: "Spotify",
  },
  {
    title: "Algorithms Live!",
    source: "YouTube",
  },
  {
    title: "Software Engineering Daily – algorithms specials",
    source: "Podcast",
  },
];

export default function LandingPage() {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const [isDark, setIsDark] = useState(() => {
  const saved = localStorage.getItem("iapss_theme");
  return saved ? saved === "dark" : prefersDark;
});

useEffect(() => {
  document.documentElement.classList.toggle("iapss-dark", isDark);
  localStorage.setItem("iapss_theme", isDark ? "dark" : "light");
}, [isDark]);

  useEffect(() => {
  const data = getAuth();
  if (data?.token) {
    setAuth(data);
  }
}, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
  <div className={`lp-root ${isDark ? "lp-root--dark" : ""}`}>
    {/* Sticky header */}
    <header className="lp-header">
      <div className="lp-header-left" onClick={() => scrollTo("lp-overview")}>
        <div className="lp-logo-circle">IA</div>
        <div className="lp-logo-text">
          <div className="lp-logo-title">IAPSS</div>
          <div className="lp-logo-sub">
            INTELLIGENT ACADEMIC PROBLEM-SOLVING SYSTEM
          </div>
        </div>
      </div>

      <nav className="lp-nav">
        <button
          type="button"
          className="lp-nav-link"
          onClick={() => scrollTo("lp-overview")}
        >
          Overview
        </button>
        <button
          type="button"
          className="lp-nav-link"
          onClick={() => scrollTo("lp-features")}
        >
          Features
        </button>
        <button
          type="button"
          className="lp-nav-link"
          onClick={() => scrollTo("lp-how")}
        >
          How it works
        </button>
        <button
          type="button"
          className="lp-nav-link"
          onClick={() => scrollTo("lp-security")}
        >
          Security
        </button>
      </nav>

        <div className="lp-header-actions">
        {/* Animated Theme Toggle */}
        <button
            type="button"
            className="lp-theme-toggle"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label="Toggle theme"
        >
            <span className="toggle-icon sun">☀️</span>
            <span className="toggle-icon moon">🌙</span>
        </button>

        {auth ? (
  <>
    <button
      type="button"
      className="lp-btn lp-btn-outline"
      onClick={() => navigate("/dashboard")}
    >
      Dashboard
    </button>

    <button
      type="button"
      className="lp-btn lp-btn-solid"
      onClick={() => {
        clearAuth();
        setAuth(null);
        navigate("/");
      }}
    >
      Logout
    </button>
  </>
) : (
  <>
    <button
      type="button"
      className="lp-btn lp-btn-outline"
      onClick={() => navigate("/login")}
    >
      Log in
    </button>

    <button
      type="button"
      className="lp-btn lp-btn-solid"
      onClick={() => navigate("/register")}
    >
      Sign up
    </button>
  </>
)}

        </div>
    </header>

      <main className="lp-main">
        {/* HERO */}
        <section id="lp-overview" className="lp-hero">
          <div className="lp-hero-text">
            <p className="lp-tagline">FOR COMPETITIVE CODERS</p>
            
            {/* UPDATED: TextType Component for Animation */}
            <TextType
              as="h1"
              className="lp-hero-title"
              text={[
                "Practice, Analyse,\nand Own Every Problem.",
                "Don't just solve.\nEvolve.",
                "Turn your <span style='color: #ef4444; font-weight: bold;'>TLE</span>\ninto <span style='color: #10b981; font-weight: bold;'>AC</span>.",
                "Your personal coach\nfor every contest."
              ]}
              typingSpeed={40}
              deletingSpeed={20}
              pauseDuration={4000}
              loop={true}
              showCursor={true}
              cursorCharacter="|"
            />
            
            <p className="lp-hero-body">
              IAPSS combines your problems, code, AI hints and history into one
              intelligent workspace. Track contests, news and practice in a
              single place.
            </p>
            <div className="lp-hero-actions">
              <button
  type="button"
  className="lp-btn lp-btn-solid"
  onClick={() => navigate(auth ? "/dashboard" : "/register")}
>
  {auth ? "Go to Dashboard" : "Start solving"}
</button>

              <button
                type="button"
                className="lp-btn lp-btn-ghost"
                onClick={() => scrollTo("lp-features")}
              >
                View features
              </button>
            </div>
            <p className="lp-hero-footnote">
              Live contests, community news and podcasts curated for
              programmers.
            </p>
          </div>
        </section>

        {/* NEWS / CONTESTS / PODCASTS */}
        <section id="lp-updates" className="lp-updates">
          <div className="lp-updates-grid">
            <div className="lp-column-card">
              <h2 className="lp-column-title">News</h2>
              <p className="lp-column-sub">
                ICPC, platform announcements and coding headlines.
              </p>
              <div className="lp-item-list">
                {newsItems.map((n) => (
                  <div key={n.title} className="lp-item-card">
                    <div className="lp-item-title">{n.title}</div>
                    <div className="lp-item-meta">
                      {n.source} • {n.meta}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-column-card">
              <h2 className="lp-column-title">Contests</h2>
              <p className="lp-column-sub">
                Upcoming rounds from Codeforces, CodeChef, AtCoder and more.
              </p>
              <div className="lp-item-list">
                {contestItems.map((c) => (
                  <div key={c.title} className="lp-item-card">
                    <div className="lp-item-title">{c.title}</div>
                    <div className="lp-item-meta">
                      {c.source} • {c.meta}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-column-card">
              <h2 className="lp-column-title">Podcasts</h2>
              <p className="lp-column-sub">
                Long-form tech and competitive programming talks.
              </p>
              <div className="lp-item-list">
                {podcastItems.map((p) => (
                  <div key={p.title} className="lp-item-card">
                    <div className="lp-item-title">{p.title}</div>
                    <div className="lp-item-meta">{p.source}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="lp-how" className="lp-how">
          <div className="lp-how-text">
            <p className="lp-section-kicker">HOW IT WORKS</p>
            <h2 className="lp-section-title">Analyse like an on-site coach.</h2>
            <p className="lp-section-body">
              Drop a full problem – text plus screenshots – then walk through a
              guided analysis: constraints, patterns, edge cases and three
              levels of hints. Next, send your C++, Python, Go or Java code to
              the Code Analyser for bug checks and style improvements.
            </p>
            <p className="lp-section-body">
              Every run is saved in your history so you can revisit key mistakes
              before contests or interviews.
            </p>

            <ul className="lp-bullet-list">
              <li>Attach multi-page screenshots and keep them tied to one problem.</li>
              <li>Get topic and difficulty estimation similar to online judges.</li>
              <li>Use 3-step hints to move from nudges to near-solution reasoning.</li>
              <li>Switch between Problem and Code Analyser without losing context.</li>
            </ul>
          </div>

          <div className="lp-how-illustration">
            <div className="lp-window">
              <div className="lp-window-tabs">
                <span className="lp-window-tab lp-window-tab--active">
                  problem.cpp
                </span>
                <span className="lp-window-tab">analysis.md</span>
                <span className="lp-window-tab">code.cpp</span>
              </div>
              <div className="lp-window-body">
                <div className="lp-window-left">
                  <div className="lp-code-line lp-code-line--wide" />
                  <div className="lp-code-line" />
                  <div className="lp-code-line" />
                  <div className="lp-code-line lp-code-line--short" />
                  <div className="lp-tag-row">
                    <span className="lp-chip">dp</span>
                    <span className="lp-chip">binary search</span>
                    <span className="lp-chip">medium-hard</span>
                  </div>
                </div>
                <div className="lp-window-right">
                  <div className="lp-hint-title">Hint level 2</div>
                  <p className="lp-hint-text">
                    Think about prefix maxima and keeping the best transition
                    for each value of <code>k</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RICH FEATURES GRID */}
        <section id="lp-features" className="lp-features">
          <p className="lp-section-kicker">CODE WITH RICH FEATURES</p>
          <h2 className="lp-section-title">
            Everything you expect from a serious coding companion.
          </h2>
          <p className="lp-section-body lp-section-body--center">
            Not just a chat box – IAPSS keeps your problems, attempts, hints and
            history structured like a personal online judge.
          </p>

          <div className="lp-feature-grid">
            <div className="lp-feature-card">
              <div className="lp-feature-icon">📎</div>
              <h3 className="lp-feature-title">Multi-page problems</h3>
              <p className="lp-feature-body">
                Attach screenshots or PDFs when the statement spans several
                pages and keep them tied to one entry.
              </p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">🧠</div>
              <h3 className="lp-feature-title">Topic &amp; difficulty guess</h3>
              <p className="lp-feature-body">
                Rough topic tags and difficulty estimation so you can filter
                practice like an online judge.
              </p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">🪜</div>
              <h3 className="lp-feature-title">3-step hint ladder</h3>
              <p className="lp-feature-body">
                From gentle nudges to near-solution reasoning without spoiling
                the full editorial at once.
              </p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">🔍</div>
              <h3 className="lp-feature-title">Code smell detector</h3>
              <p className="lp-feature-body">
                Highlight edge-case bugs, complexity issues and unsafe patterns
                in C++, Python, Go or Java.
              </p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">📊</div>
              <h3 className="lp-feature-title">History &amp; mistakes</h3>
              <p className="lp-feature-body">
                See which tags, platforms and patterns you most often miss – and
                revisit them quickly.
              </p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">🧭</div>
              <h3 className="lp-feature-title">One focused workspace</h3>
              <p className="lp-feature-body">
                Move between Problem and Code Analyser without cluttering tabs
                or losing context.
              </p>
            </div>
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section id="lp-security" className="lp-security">
          <p className="lp-section-kicker">SECURITY &amp; PRIVACY</p>
          <h2 className="lp-section-title">Built for serious practice, not data mining.</h2>
          <div className="lp-security-grid">
            <div className="lp-security-card">
              <h3 className="lp-security-title">Your code stays yours</h3>
              <p className="lp-security-body">
                All submissions are stored in your own database. We do not sell,
                share or use your problems or code for model training.
              </p>
            </div>
            <div className="lp-security-card">
              <h3 className="lp-security-title">API keys kept on server</h3>
              <p className="lp-security-body">
                Gemini / AI credentials live only on the backend. The browser
                never sees your API keys.
              </p>
            </div>
            <div className="lp-security-card">
              <h3 className="lp-security-title">Fine-grained history control</h3>
              <p className="lp-security-body">
                Delete individual runs or entire sessions before a contest. Export
                your history when you want to move.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="lp-bottom-cta">
          <h2 className="lp-section-title lp-section-title--center">
            Ready to make every problem count?
          </h2>
          <p className="lp-section-body lp-section-body--center">
            Create a free workspace, connect your favourite platforms and start
            analysing your contests like a pro.
          </p>
          <div className="lp-bottom-cta-actions">
  {auth ? (
    <button
      type="button"
      className="lp-btn lp-btn-solid"
      onClick={() => navigate("/dashboard")}
    >
      Go to Dashboard
    </button>
  ) : (
    <>
      <button
        type="button"
        className="lp-btn lp-btn-solid"
        onClick={() => navigate("/register")}
      >
        Sign up for IAPSS
      </button>
      <button
        type="button"
        className="lp-btn lp-btn-outline"
        onClick={() => navigate("/login")}
      >
        Log in
      </button>
    </>
  )}
</div>

        </section>
      </main>

      <footer className="lp-footer">
        <span>© {new Date().getFullYear()} Hemant Verma | IAPSS. Built for competitive programming journeys.</span>
        <span className="lp-footer-links">
          <a href="#lp-overview">Home</a>
          <span>•</span>
          <a href="/docs">About</a>
        </span>
      </footer>
    </div>
  );
}