import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const MODES = [
  {
    id: 'classic',
    title: 'Classic Portfolio',
    subtitle: 'SCROLL MODE',
    desc: 'The original neon experience. Sleek and responsive. Browse the portfolio for a clean tour.',
    icon: '📜',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.4)',
    tag: 'Recommended',
    keys: ['HTML', 'React', 'CSS'],
    bg: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)',
  },
  {
    id: 'maze',
    title: 'Cyber Maze',
    subtitle: 'GAME MODE',
    desc: 'The portfolio Reveal itself. Fight monsters, collect data. Can you escape?',
    icon: '🧩',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.4)',
    tag: 'Action',
    keys: ['WASD', 'Space', 'Enter'],
    bg: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(236,72,153,0.02) 100%)',
  },
];

// Particle field
function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}

const LandingPortal = ({ onSelectMode }) => {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
    setTimeout(() => onSelectMode(id), 500);
  };

  return (
    <div className="portal-root">
      <StarField />

      {/* Ambient orbs */}
      <div className="p-orb p-orb-1" />
      <div className="p-orb p-orb-2" />
      <div className="p-orb p-orb-3" />
      <div className="p-scanlines" />

      <motion.div
        className="portal-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="portal-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.div
            className="portal-brand"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
          >
            <span className="brand-name">AGAM</span><span className="brand-dot">.dev</span>
          </motion.div>

          <div className="portal-tag-line">
            <span className="tag-bracket">[</span>
            <span className="tag-text">SELECT EXPERIENCE</span>
            <span className="tag-bracket">]</span>
          </div>

          <motion.p
            className="portal-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Choose how you'd like to explore this portfolio
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="portal-grid">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.id}
              className={`p-card ${selected === mode.id ? 'p-card-selected' : ''}`}
              style={{
                '--card-color': mode.color,
                '--card-glow': mode.glow,
                background: hovered === mode.id ? mode.bg : 'rgba(255,255,255,0.02)',
              }}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.12, type: 'spring', stiffness: 200, damping: 18 }}
              onHoverStart={() => setHovered(mode.id)}
              onHoverEnd={() => setHovered(null)}
              onClick={() => handleSelect(mode.id)}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Top badge */}
              <div className="p-card-badge" style={{ color: mode.color, borderColor: mode.color + '40', background: mode.color + '12' }}>
                {mode.tag}
              </div>

              {/* Icon */}
              <motion.div
                className="p-card-icon"
                style={{ background: mode.color + '18', boxShadow: hovered === mode.id ? `0 0 30px ${mode.glow}` : 'none' }}
                animate={hovered === mode.id ? { scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {mode.icon}
              </motion.div>

              <div className="p-card-subtitle" style={{ color: mode.color }}>{mode.subtitle}</div>
              <h2 className="p-card-title">{mode.title}</h2>
              <p className="p-card-desc">{mode.desc}</p>

              {mode.id === 'maze' && (
                <div className="game-recommendation">
                  💻 Recommended: PC or Laptop
                </div>
              )}

              {/* CTA */}
              <div className="p-card-cta" style={{ borderTopColor: mode.color + '25' }}>
                <span style={{ color: mode.color }}>LAUNCH</span>
                <motion.span
                  style={{ color: mode.color }}
                  animate={hovered === mode.id ? { x: [0, 5, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                ><FiArrowRight /></motion.span>
              </div>

              {/* Hover border glow */}
              <AnimatePresence>
                {hovered === mode.id && (
                  <motion.div
                    className="p-card-glow-border"
                    style={{ boxShadow: `0 0 0 1.5px ${mode.color}60, 0 0 30px ${mode.glow}` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </motion.div>

      <style>{`
        .portal-root {
          position: fixed; inset: 0; background: #02030d;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; z-index: 9999;
        }
        .p-scanlines {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 4px);
        }
        .p-orb {
          position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px);
        }
        .p-orb-1 {
          width: 500px; height: 500px; top: -150px; left: -150px;
          background: rgba(168,85,247,0.1);
          animation: orbDrift 12s ease-in-out infinite;
        }
        .p-orb-2 {
          width: 400px; height: 400px; bottom: -100px; right: -100px;
          background: rgba(34,211,238,0.08);
          animation: orbDrift 15s ease-in-out infinite reverse;
        }
        .p-orb-3 {
          width: 250px; height: 250px; top: 50%; left: 50%;
          background: rgba(236,72,153,0.06);
          animation: orbDrift 9s ease-in-out infinite 3s;
        }
        @keyframes orbDrift {
          0%, 100% { transform: translate(0,0); }
          33% { transform: translate(40px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }
        .global-features-btn {
          position: fixed; bottom: 4.5rem; left: 1.5rem; z-index: 9500;
 max-width: 1080px; width: 100%;
          padding: 1.5rem 2rem; text-align: center; display: flex;
          flex-direction: column; align-items: center; gap: 1.6rem;
          height: 100vh; justify-content: center; overflow: hidden;
        }
        .portal-header { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
        .portal-brand {
          font-size: clamp(2.8rem, 6vw, 4.2rem);
          font-weight: 900; letter-spacing: -0.05em; line-height: 1;
        }
        .brand-name {
          color: #fff;
          text-shadow: 0 0 30px rgba(255,255,255,0.2);
        }
        .brand-dot {
          color: #a78bfa;
          text-shadow: 0 0 20px rgba(167,139,250,0.9), 0 0 60px rgba(167,139,250,0.4);
        }
        .portal-tag-line {
          font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.35em;
          color: #475569; display: flex; gap: 0.5rem; align-items: center;
        }
        .tag-bracket { color: #22d3ee; }
        .tag-text { color: #64748b; }
        .portal-sub { font-size: 0.95rem; color: var(--text-secondary); margin: 0; }

        .portal-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem; width: 100%; max-width: 800px;
          padding-bottom: 2rem;
        }
        .p-card {
          border-radius: 20px; padding: 1.6rem 1.5rem;
          text-align: left; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column; gap: 0.4rem;
          transition: background 0.3s ease;
          position: relative; overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .p-card-selected { transform: scale(0.96); opacity: 0.7; pointer-events: none; }
        .p-card-glow-border {
          position: absolute; inset: 0; border-radius: 22px; pointer-events: none;
        }
        .p-card-badge {
          display: inline-block; padding: 0.15rem 0.6rem; border-radius: 999px;
          font-family: var(--font-mono); font-size: 0.6rem; font-weight: 800;
          letter-spacing: 0.12em; border: 1px solid; width: fit-content;
          margin-bottom: 0.5rem;
        }
        .p-card-icon {
          width: 64px; height: 64px; border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.1rem; margin-bottom: 0.4rem;
          transition: box-shadow 0.3s;
        }
        .p-card-subtitle {
          font-family: var(--font-mono); font-size: 0.62rem;
          font-weight: 800; letter-spacing: 0.2em; opacity: 0.8;
        }
        .p-card-title {
          font-size: 1.25rem; font-weight: 900; color: #fff;
          margin: 0; letter-spacing: -0.02em;
        }
        .p-card-desc {
          font-size: 0.82rem; color: var(--text-secondary);
          line-height: 1.55; margin: 0; flex: 1;
        }
        .p-card-keys {
          display: flex; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.25rem;
        }
        .p-key {
          font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
          padding: 0.15rem 0.5rem; border-radius: 5px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
        }
        .p-card-cta {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 0.65rem; border-top: 1px solid;
          font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800;
          letter-spacing: 0.1em; margin-top: 0.2rem;
        }

        .portal-footer {
          display: flex; align-items: center; gap: 0.75rem;
          font-family: var(--font-mono); font-size: 0.65rem; color: #334155;
        }
        .p-footer-dot { color: #1e293b; }
        .p-footer-pulse { display: flex; align-items: center; gap: 0.4rem; }
        .p-pulse-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: pulseDot 2s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @media (max-width: 900px) {
          .portal-grid { grid-template-columns: 1fr; max-width: 360px; gap: 0.8rem; }
          .portal-content { padding: 0.75rem; height: auto; min-height: 100vh; overflow-y: auto; justify-content: flex-start; pt: 3rem; }
          .portal-header { margin-top: 2.5rem; margin-bottom: 0.2rem; }
          .portal-brand { font-size: 1.8rem; }
          .p-card { padding: 1rem; border-radius: 12px; gap: 0.3rem; }
          .p-card-icon { width: 40px; height: 40px; font-size: 1.3rem; }
          .p-card-title { font-size: 1rem; }
          .p-card-desc { font-size: 0.7rem; line-height: 1.35; }
          .p-card-cta { font-size: 0.65rem; padding-top: 0.4rem; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .portal-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
          .p-card { padding: 1.5rem 1.2rem; }
        }
      `}</style>
    </div>
  );
};

export default LandingPortal;
