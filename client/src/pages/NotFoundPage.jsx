import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";
import FuzzyText from "../components/ui/FuzzyText";

// --- CUSTOM SVG SCENE: SAD ALIEN & BROKEN WIFI ---
// --- CUSTOM SVG SCENE: MARS CASTAWAY (STANDING) ---
const SadAlienScene = () => (
  <svg width="240" height="180" viewBox="0 0 240 180" className="alien-scene">
    <defs>
      {/* Mars Ground Gradient */}
      <linearGradient id="marsGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c2410c" />
        <stop offset="100%" stopColor="#7c2d12" />
      </linearGradient>

      {/* Sci-Fi Ship Gradient */}
      <linearGradient id="shipMetal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>

      {/* Cockpit Glow */}
      <radialGradient id="cockpitGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
      </radialGradient>
    </defs>

    {/* 1. Mars Surface (Craters included) */}
    <path
      d="M0 160 Q 120 145 240 160 L 240 180 L 0 180 Z"
      fill="url(#marsGradient)"
    />
    <g transform="translate(0, 5)" opacity="0.5">
      <ellipse cx="40" cy="165" rx="15" ry="3" fill="#431407" />
      <ellipse cx="180" cy="158" rx="8" ry="2" fill="#431407" />
      <ellipse cx="120" cy="170" rx="20" ry="4" fill="#431407" />
    </g>

    {/* 2. Sophisticated Spaceship (Landed Background) */}
    <g transform="translate(180, 130)">
      {/* Landing Struts */}
      <path d="M-20 20 L-25 35 H-15 Z" fill="#334155" />
      <path d="M20 20 L25 35 H15 Z" fill="#334155" />
      <path
        d="M-15 20 Q 0 25 15 20"
        stroke="#334155"
        strokeWidth="2"
        fill="none"
      />

      {/* Main Hull */}
      <path
        d="M-25 20 Q 0 -40 25 20 Z"
        fill="url(#shipMetal)"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Cockpit/Dome */}
      <ellipse cx="0" cy="12" rx="8" ry="12" fill="url(#cockpitGlow)" />

      {/* Engine Glow / Damage Smoke */}
      <g className="smoke-puffs">
        <circle cx="-10" cy="25" r="2" fill="#64748b" opacity="0.6" />
        <circle cx="12" cy="20" r="3" fill="#64748b" opacity="0.5" />
        <path
          d="M-5 10 L5 10"
          stroke="#ef4444"
          strokeWidth="1"
          className="ship-glitch"
        />
      </g>
    </g>

    {/* 3. The Alien (Standing) */}
    <g transform="translate(70, 100)">
      {/* Standing Legs */}
      <path
        d="M-6 40 L-8 65"
        stroke="#10b981"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M6 40 L8 65"
        stroke="#10b981"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Feet */}
      <ellipse cx="-10" cy="65" rx="5" ry="3" fill="#10b981" />
      <ellipse cx="10" cy="65" rx="5" ry="3" fill="#10b981" />

      {/* Body (Elongated for standing) */}
      <ellipse cx="0" cy="30" rx="14" ry="22" fill="#10b981" />

      {/* Head */}
      <g className="alien-head">
        <ellipse cx="0" cy="0" rx="18" ry="15" fill="#10b981" />
        {/* Sad Eyes (Looking Up) */}
        <ellipse cx="-7" cy="-2" rx="4" ry="6" fill="black" />
        <ellipse cx="7" cy="-2" rx="4" ry="6" fill="black" />
        <circle cx="-6" cy="-4" r="1.5" fill="white" opacity="0.8" />
        <circle cx="8" cy="-4" r="1.5" fill="white" opacity="0.8" />

        {/* Antenna */}
        <path
          d="M0 -14 L0 -24"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="0" cy="-24" r="3" fill="#10b981" />

        {/* Sad Mouth */}
        <path d="M-4 8 Q 0 6 4 8" stroke="black" strokeWidth="1" fill="none" />
      </g>

      {/* Animated Arms Group (Searching for signal) */}
      <g className="alien-arms-search">
        {/* Arms stretching UP */}
        <path
          d="M-12 25 Q -25 0 -8 -25"
          stroke="#10b981"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M12 25 Q 25 0 8 -25"
          stroke="#10b981"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Mobile Phone (Back View) */}
        <g transform="translate(0, -35)">
          {/* Phone Body (Back) */}
          <rect
            x="-9"
            y="0"
            width="18"
            height="28"
            rx="3"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1"
          />
          {/* Camera Module */}
          <rect x="-6" y="3" width="6" height="8" rx="1" fill="#0f172a" />
          <circle cx="-3" cy="5" r="1" fill="#3b82f6" />
          <circle cx="-3" cy="9" r="1" fill="#3b82f6" />

          {/* LOGO on phone */}
          <circle cx="0" cy="18" r="2" fill="#64748b" opacity="0.5" />

          {/* Wi-Fi Signal Animation */}
          <g transform="translate(0, -10)" className="wifi-signal">
            {/* Small Dot */}
            <circle cx="0" cy="0" r="1" className="sig-dot" />
            {/* Middle Arc */}
            <path
              d="M-3 -2 Q 0 -5 3 -2"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="sig-mid"
            />
            {/* Outer Arc */}
            <path
              d="M-6 -5 Q 0 -9 6 -5"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="sig-outer"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const NotFoundPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // UI State
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Game Physics State (Refs for high performance)
  const gameState = useRef({
    rocket: { x: 0, y: 0, angle: 0, state: "LANDED" },
    planets: [],
    cameraY: 0,
    targetPlanetIndex: 1,
    scoreCount: 0,
  });

  const animationFrameId = useRef(null);

  // --- GAME LOGIC ---
  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cw = canvas.width;
    const ch = canvas.height;

    // Reset State
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);

    // Initial Planets
    const p1 = {
      x: cw / 2,
      y: ch - 80,
      r: 50,
      color: "#3b82f6",
      rotSpeed: 0.02,
    };
    const p2 = {
      x: cw / 2,
      y: ch - 300,
      r: 40,
      color: "#10b981",
      rotSpeed: 0.025,
    };

    gameState.current = {
      rocket: {
        x: p1.x,
        y: p1.y - p1.r - 20,
        angle: -Math.PI / 2,
        state: "LANDED",
        orbitAngle: -Math.PI / 2,
      },
      planets: [p1, p2],
      cameraY: 0,
      targetPlanetIndex: 1,
      scoreCount: 0,
    };
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    setHighScore((prev) => Math.max(prev, gameState.current.scoreCount));
    if (animationFrameId.current)
      cancelAnimationFrame(animationFrameId.current);
  };

  const handleLaunch = () => {
    if (!isPlaying) return;
    if (gameState.current.rocket.state === "LANDED") {
      gameState.current.rocket.state = "FLYING";
    }
  };

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!isPlaying && !gameOver) startGame();
        else if (gameOver) startGame();
        else handleLaunch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const VIEWPORT_OFFSET = canvas.height - 200; 

    const render = () => {
      if (!isPlaying) return;

      const state = gameState.current;
      const target = state.planets[state.targetPlanetIndex];

      // 1. ONE-WAY CAMERA (Only moves UP)
      // We check if rocket is going higher (lower Y) than the offset.
      // If it goes lower (falling), camera doesn't follow. This enables falling death.
      const rocketY = state.rocket.y;
      const desiredCameraY = rocketY - VIEWPORT_OFFSET;
      
      // Only move camera if rocket goes UP (desired < current)
      if (desiredCameraY < state.cameraY) {
        // Smooth lerp upwards
        state.cameraY += (desiredCameraY - state.cameraY) * 0.1; 
      }

      // Clear Canvas
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(0, -state.cameraY); 

      // 2. LOGIC UPDATE
      const currentPlanet = state.planets[state.targetPlanetIndex - 1]; 

      // -- STATE: LANDED (ORBIT) --
      if (state.rocket.state === "LANDED") {
        state.rocket.orbitAngle += currentPlanet.rotSpeed;
        const dist = currentPlanet.r + 20; 
        state.rocket.x = currentPlanet.x + Math.cos(state.rocket.orbitAngle) * dist;
        state.rocket.y = currentPlanet.y + Math.sin(state.rocket.orbitAngle) * dist;
        state.rocket.angle = state.rocket.orbitAngle; 
      } 
      // -- STATE: FLYING --
      else if (state.rocket.state === "FLYING") {
        state.rocket.x += Math.cos(state.rocket.angle) * 12;
        state.rocket.y += Math.sin(state.rocket.angle) * 12;

        const dx = state.rocket.x - target.x;
        const dy = state.rocket.y - target.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        // Success Hit
        if (dist <= target.r + 20) {
          state.rocket.state = "LANDED";
          state.scoreCount++;
          setScore(state.scoreCount);
          state.targetPlanetIndex++;
          
          // Generate new planet
          const nextR = Math.max(25, 50 - state.scoreCount);
          const distGap = 200 + (state.scoreCount * 10);
          const nextY = target.y - distGap; 
          const margin = 60;
          const nextX = Math.random() * (canvas.width - margin*2) + margin;
          
          state.planets.push({
            x: nextX, y: nextY, r: nextR,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            rotSpeed: (0.02 + (state.scoreCount * 0.002)) * (Math.random() < 0.5 ? 1 : -1)
          });
          
          if (state.planets.length > 5) state.planets.shift(); 
          state.targetPlanetIndex = state.planets.length - 1; 
          state.rocket.orbitAngle = Math.atan2(dy, dx); 
        }

        // --- DEATH CONDITIONS (FIXED) ---
        // 1. Fallen off screen bottom (since camera doesn't follow down)
        const screenBottom = state.cameraY + canvas.height;
        if (state.rocket.y > screenBottom + 50) {
          endGame(); 
          ctx.restore(); return;
        }

        // 2. Missed target into deep space (Flew way past target)
        if (state.rocket.y < target.y - 500) {
          endGame(); 
          ctx.restore(); return;
        }

        // 3. Side bounds
        if (state.rocket.x < -50 || state.rocket.x > canvas.width + 50) {
          endGame(); 
          ctx.restore(); return;
        }
      }

      // 3. DRAW
      state.planets.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 30; ctx.shadowColor = p.color; ctx.fill(); ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 2; ctx.stroke();
      });

      // Draw Rocket
      ctx.save();
      ctx.translate(state.rocket.x, state.rocket.y);
      ctx.rotate(state.rocket.angle + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -20); ctx.lineTo(10, 10); ctx.lineTo(0, 5); ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fillStyle = "#ffffff"; ctx.fill();
      if (state.rocket.state === "FLYING") {
        ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(5, 25); ctx.lineTo(-5, 25);
        ctx.fillStyle = "#f59e0b"; ctx.fill();
      }
      ctx.restore();
      
      ctx.restore(); // Undo Camera
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();
    return () => { 
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); 
    };
  }, [isPlaying]);

  return (
    <div className="not-found-page">
      <div className="stars"></div>
      <div className="twinkling"></div>

      <nav className="nf-nav">
        <div
          className="nf-brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="nf-logo">IA</span> IAPSS
        </div>
      </nav>

      <div className="nf-container">
        {/* Left: Functional Text */}
        <div className="nf-content">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover={true}
            fontSize={140}
            fontWeight={900}
            fontFamily="'Inter', system-ui"
            color="#f8fafc"
          >
            404
          </FuzzyText>

          <h2 className="nf-subtitle">Page Not Found</h2>

          <div className="nf-functional-message">
            <p className="primary-text">
              The requested path <code>{location.pathname}</code> does not exist
              on our servers.
            </p>
            <p className="secondary-text">
              While we get our navigation systems back online, feel free to try
              the manual rocket override to the right.
            </p>
          </div>

          <div className="nf-buttons">
            {/* Primary Action is clearer */}
            <button className="nf-btn primary" onClick={() => navigate("/")}>
              Return Home
            </button>

            {/* Game is secondary option */}
            <button className="nf-btn ghost" onClick={startGame}>
              {isPlaying
                ? "Pilot Active..."
                : gameOver
                ? "Retry Connection"
                : "Manual Override"}
            </button>
          </div>
        </div>

        {/* Right: The Interactive Panel */}
        <div
          className={`nf-game-wrapper ${isPlaying ? "active" : ""}`}
          onMouseDown={handleLaunch}
          onTouchStart={handleLaunch}
        >
          {/* SCENE: Start Menu */}
          {!isPlaying && !gameOver && (
            <div className="game-overlay start-menu">
              {/* === THE NEW ALIEN SCENE === */}
              <div className="alien-wrapper">
                <SadAlienScene />
              </div>

              <h3>SIGNAL LOST</h3>
              <p>Establishing uplink...</p>
              <button className="play-btn" onClick={startGame}>
                LAUNCH ROCKET
              </button>
              <span className="instruction">[ Space ] or [ Click ]</span>
            </div>
          )}

          {/* SCENE: Game Over */}
          {gameOver && (
            <div className="game-overlay fail">
              <h3 className="blink">CONNECTION FAILED</h3>
              <p>Planets Reached: {score}</p>
              <p className="high-score">Best: {highScore}</p>
              <div className="overlay-actions">
                <button className="play-btn retry" onClick={startGame}>
                  Retry Signal
                </button>
                <button className="play-btn exit" onClick={() => navigate("/")}>
                  Abort
                </button>
              </div>
            </div>
          )}

          {isPlaying && <div className="live-score">DISTANCE: {score} AU</div>}
          <canvas
            ref={canvasRef}
            width="400"
            height="600"
            className="game-canvas"
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
