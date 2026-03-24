import { useState, useEffect } from 'react';
import CursorGlow from './components/CursorGlow';
import LandingPortal from './components/LandingPortal';
import ClassicPortfolio from './components/ClassicPortfolio';
import GameWorld from './components/rpg/GameWorld';
import FeaturesShowcase from './components/FeaturesShowcase';
import { FiInfo } from 'react-icons/fi';
import './index.css';

const BOOT_LOGS = [
  'Initializing KritiOS v2.4.1...',
  'Loading neural interface modules...',
  'Mounting portfolio filesystem...',
  'Detecting experience modules... [3 found]',
  'Calibrating neon subsystems...',
  'Syncing skill tree data...',
  'Warming up game engine...',
  'Boot sequence complete. Welcome.',
];

function BootScreen() {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    // Progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 8 + 2;
      });
    }, 80);

    // Log lines
    BOOT_LOGS.forEach((log, i) => {
      setTimeout(() => setLogs(l => [...l, log]), 200 + i * 220);
    });

    // Glitch flash
    const glitchTimes = [600, 1100, 1600];
    glitchTimes.forEach(t => {
      setTimeout(() => { setGlitch(true); setTimeout(() => setGlitch(false), 80); }, t);
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="boot-root">
      <div className="boot-scanlines" />
      <div className="boot-vignette" />

      {/* Animated grid */}
      <div className="boot-grid" />

      {/* Floating orbs */}
      <div className="boot-orb boot-orb-1" />
      <div className="boot-orb boot-orb-2" />
      <div className="boot-orb boot-orb-3" />

      <div className="boot-center">
        {/* Logo */}
        <div className={`boot-logo ${glitch ? 'boot-glitch' : ''}`}>
          KRITI<span>.dev</span>
        </div>
        <div className="boot-subtitle">PORTFOLIO OPERATING SYSTEM</div>

        {/* Terminal logs */}
        <div className="boot-terminal">
          {logs.map((log, i) => (
            <div key={i} className="boot-log">
              <span className="boot-prompt">{'>'}</span>
              <span className="boot-log-text">{log}</span>
              {i === logs.length - 1 && progress < 100 && <span className="boot-cursor">_</span>}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="boot-bar-wrap">
          <div className="boot-bar-track">
            <div
              className="boot-bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            <div className="boot-bar-glow" style={{ left: `${Math.min(progress, 100)}%` }} />
          </div>
          <div className="boot-bar-label">{Math.min(Math.floor(progress), 100)}%</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        .boot-root {
          position: fixed; inset: 0; background: #02030d;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; font-family: 'Share Tech Mono', monospace;
          z-index: 9999;
        }
        .boot-scanlines {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          background: repeating-linear-gradient(
            to bottom, transparent 0px, transparent 3px, rgba(0,255,255,0.015) 3px, rgba(0,255,cyan,0.015) 4px
          );
        }
        .boot-vignette {
          position: absolute; inset: 0; pointer-events: none; z-index: 3;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%);
        }
        .boot-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 20s linear infinite;
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .boot-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .boot-orb-1 {
          width: 400px; height: 400px; top: -100px; left: -100px;
          background: rgba(168,85,247,0.12);
          animation: orbFloat 8s ease-in-out infinite;
        }
        .boot-orb-2 {
          width: 300px; height: 300px; bottom: -80px; right: -80px;
          background: rgba(34,211,238,0.1);
          animation: orbFloat 10s ease-in-out infinite reverse;
        }
        .boot-orb-3 {
          width: 200px; height: 200px; top: 40%; left: 60%;
          background: rgba(244,114,182,0.08);
          animation: orbFloat 6s ease-in-out infinite;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.05); }
        }
        .boot-center {
          position: relative; z-index: 10; text-align: center; width: 100%; max-width: 560px; padding: 2rem;
        }
        .boot-logo {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900; letter-spacing: -0.04em;
          color: #fff; margin-bottom: 0.3rem;
          text-shadow:
            0 0 20px rgba(168,85,247,0.8),
            0 0 60px rgba(168,85,247,0.3);
          animation: logoPulse 3s ease-in-out infinite;
          font-family: inherit;
        }
        .boot-logo span {
          color: #a78bfa;
          text-shadow: 0 0 20px rgba(167,139,250,0.9);
        }
        @keyframes logoPulse {
          0%, 100% { text-shadow: 0 0 20px rgba(168,85,247,0.8), 0 0 60px rgba(168,85,247,0.3); }
          50% { text-shadow: 0 0 30px rgba(168,85,247,1), 0 0 80px rgba(168,85,247,0.5); }
        }
        .boot-glitch {
          animation: glitch 0.08s steps(2) forwards !important;
        }
        @keyframes glitch {
          0% { transform: translate(3px, 0) skewX(2deg); filter: hue-rotate(90deg); }
          50% { transform: translate(-3px, 1px) skewX(-2deg); clip-path: inset(30% 0 40% 0); filter: hue-rotate(180deg); }
          100% { transform: translate(0,0) skewX(0); filter: none; }
        }
        .boot-subtitle {
          font-size: 0.7rem; letter-spacing: 0.35em; color: #475569;
          margin-bottom: 2rem; text-transform: uppercase;
        }
        .boot-terminal {
          background: rgba(0,0,0,0.5); border: 1px solid rgba(34,211,238,0.15);
          border-radius: 10px; padding: 1rem 1.2rem; margin-bottom: 1.5rem;
          text-align: left; min-height: 120px; max-height: 180px; overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .boot-log {
          font-size: 0.72rem; color: #64748b; line-height: 1.8;
          animation: fadeIn 0.3s ease-out;
        }
        .boot-log:last-child { color: #22d3ee; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; } }
        .boot-prompt { color: #a78bfa; margin-right: 0.5rem; }
        .boot-cursor {
          animation: blink 0.7s step-end infinite;
          color: #22d3ee;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .boot-bar-wrap {
          display: flex; align-items: center; gap: 1rem;
        }
        .boot-bar-track {
          flex: 1; height: 4px; background: rgba(255,255,255,0.06);
          border-radius: 2px; overflow: visible; position: relative;
        }
        .boot-bar-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, #7c3aed, #22d3ee);
          box-shadow: 0 0 12px rgba(34,211,238,0.6);
          transition: width 0.1s linear;
        }
        .boot-bar-glow {
          position: absolute; top: 50%; transform: translate(-50%, -50%);
          width: 8px; height: 8px; border-radius: 50%;
          background: #22d3ee; box-shadow: 0 0 12px 4px rgba(34,211,238,0.8);
          transition: left 0.1s linear;
        }
        .boot-bar-label {
          font-size: 0.72rem; color: #22d3ee; width: 2.5rem; text-align: right;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(null);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2600);
  }, []);

  if (loading) return <BootScreen />;

  let content = <LandingPortal onSelectMode={setMode} />;
  if (mode === 'classic')   content = <ClassicPortfolio onBackToMenu={() => setMode(null)} />;
  if (mode === 'maze')      content = <GameWorld        onBackToMenu={() => setMode(null)} variant="maze" />;

  return (
    <>
      <CursorGlow />
      {content}

      {/* Global Features Button */}
      {!loading && (
        <button 
          className="global-features-btn"
          onClick={() => setShowFeatures(true)}
          title="Portfolio Features"
        >
          <FiInfo />
          <span>FEATURES</span>
        </button>
      )}

      <FeaturesShowcase 
        isOpen={showFeatures} 
        onClose={() => setShowFeatures(false)} 
      />

      <style>{`
        .global-features-btn {
          position: fixed; bottom: 4rem; left: 1.5rem; z-index: 9500;
          display: flex; align-items: center; gap: 0.6rem;
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.4);
          color: #a855f7; padding: 0.6rem 1rem; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
          font-weight: 800; letter-spacing: 0.1em;
          cursor: pointer; backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .global-features-btn:hover {
          background: #a855f7; color: #fff;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
        }
        .global-features-btn svg { font-size: 1rem; }

        @media (max-width: 768px) {
          .global-features-btn {
            bottom: 1rem; left: 1rem; top: auto; transform: none;
            width: 2.8rem; height: 2.8rem;
            border-radius: 50%; padding: 0;
            display: flex; align-items: center; justify-content: center;
            background: rgba(15, 12, 41, 0.85);
            border: 1.5px solid rgba(168, 85, 247, 0.5);
            box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
            backdrop-filter: blur(10px);
          }
          .global-features-btn span { display: none; }
          .global-features-btn svg { font-size: 1.3rem; color: #a855f7; }
        }
      `}</style>
    </>
  );
}

export default App;
