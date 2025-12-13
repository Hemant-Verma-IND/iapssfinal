// src/pages/LoadingPage.jsx

import BlurText from '../components/ui/BlurText';
import LoadingDots from '../components/ui/LoadingDots';
import FullscreenCenter from '../components/layout/FullscreenCenter';
import Orb from '../components/ui/Orb';
import './LoadingPage.css';

const LoadingPage = () => {
  return (
    <FullscreenCenter>
      <div className="loading-shell">
        {/* Animated background */}
        <Orb hue={260} hoverIntensity={0.25} />

        {/* Foreground content */}
        <div className="loading-card">
          <header className="loading-header">
            <div>
              <h1 className="logo-text">IAPSS</h1>
              <p className="logo-subtitle">
                Intelligent Academic Problem-Solving System
              </p>
            </div>
          </header>

          <main className="loading-main">
            <div className="loading-message">
              <span className="loading-text-row">
                <BlurText
                  text="Now available for you"
                  animateBy="words"
                  delay={80}
                  direction="top"
                />
                <LoadingDots />
              </span>
              <p className="loading-caption">
                Initialising your personalised coding workspace…
              </p>
            </div>
          </main>

          <footer className="loading-footer">
            <p className="loading-label">❤️ Hemant Verma</p>
          </footer>
        </div>
      </div>
    </FullscreenCenter>
  );
};

export default LoadingPage;
