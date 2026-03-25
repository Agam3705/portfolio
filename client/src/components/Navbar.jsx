import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';
import { personalInfo } from '../utils/data';

const navLinks = [
  { to: 'hero', label: 'Home' },
  { to: 'skills', label: 'Skills' },
  { to: 'projects', label: 'Quests' },
  { to: 'achievements', label: 'Badges' },
  { to: 'timeline', label: 'Timeline' },
  { to: 'contact', label: 'Contact' },
];

const Navbar = ({ xp, onPlayClick, onBackToMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const xpPercent = Math.min((xp / personalInfo.maxXp) * 100, 100);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <span className="logo-badge">LVL {personalInfo.level}</span>
          <span className="logo-name">Agam<span className="neon-text-cyan">.dev</span></span>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                spy smooth duration={600}
                offset={-70}
                activeClass="active"
                className="nav-link"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* XP Bar + Play Button */}
        <div className="nav-right">
          <div className="xp-section">
            <span className="xp-label">XP</span>
            <div className="xp-bar">
              <motion.div
                className="xp-fill"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="xp-value">{xp.toLocaleString()}</span>
          </div>
          {onBackToMenu && (
            <button className="btn-play" style={{ background: 'transparent', border: '1px solid #f472b6', color: '#f472b6', boxShadow: 'none' }} onClick={onBackToMenu}>
              ← PORTAL
            </button>
          )}
          <button className="btn-play" onClick={onPlayClick}>
            🎮 PLAY
          </button>
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                spy smooth duration={600}
                offset={-70}
                className="mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {onBackToMenu && (
                <button className="btn-play mobile-play" style={{ background: 'transparent', border: '1px solid #f472b6', color: '#f472b6' }} onClick={() => { onBackToMenu(); setMobileOpen(false); }}>
                  ← PORTAL
                </button>
              )}
              <button className="btn-play mobile-play" onClick={() => { onPlayClick(); setMobileOpen(false); }}>
                🎮 PLAY
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 1rem 0;
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(8, 11, 20, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(168, 85, 247, 0.2);
          padding: 0.6rem 0;
          box-shadow: 0 4px 30px rgba(0,0,0,0.4);
        }
        .nav-container {
          max-width: 1200px; margin: 0 auto;
          padding: 0 2rem;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        }
        .nav-logo { display: flex; align-items: center; gap: 0.5rem; }
        .logo-badge {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          padding: 0.2rem 0.5rem; border-radius: 6px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
          font-family: var(--font-mono);
        }
        .logo-name { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em; }
        .nav-links {
          display: flex; list-style: none; gap: 0.25rem;
        }
        .nav-link {
          padding: 0.4rem 0.8rem; border-radius: 8px;
          font-weight: 500; font-size: 0.9rem;
          color: var(--text-secondary);
          transition: var(--transition); cursor: none;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
          background: rgba(168, 85, 247, 0.1);
        }
        .nav-link.active { color: var(--neon-cyan); }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; }
        .xp-section {
          display: flex; align-items: center; gap: 0.4rem;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 10px; padding: 0.35rem 0.75rem;
        }
        .xp-label {
          font-family: var(--font-mono); font-size: 0.65rem;
          color: var(--neon-purple); font-weight: 700;
        }
        .xp-bar {
          width: 80px; height: 6px;
          background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;
        }
        .xp-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--neon-purple), var(--neon-cyan));
          border-radius: 3px;
          box-shadow: 0 0 6px rgba(168, 85, 247, 0.7);
        }
        .xp-value {
          font-family: var(--font-mono); font-size: 0.65rem;
          color: var(--text-secondary);
        }
        .btn-play {
          padding: 0.4rem 0.9rem;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white; border-radius: 8px;
          font-size: 0.82rem; font-weight: 700;
          letter-spacing: 0.05em;
          transition: var(--transition);
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
          white-space: nowrap;
        }
        .btn-play:hover { box-shadow: var(--glow-purple); transform: translateY(-2px); }
        .mobile-toggle {
          display: none; background: transparent; padding: 0.3rem;
          flex-direction: column; gap: 5px; cursor: none;
        }
        .hamburger, .hamburger::before, .hamburger::after {
          display: block; width: 22px; height: 2px;
          background: var(--text-primary); border-radius: 2px;
          transition: all 0.3s;
          position: relative;
        }
        .hamburger::before, .hamburger::after { content: ''; position: absolute; }
        .hamburger::before { top: -7px; }
        .hamburger::after { top: 7px; }
        .hamburger.open { background: transparent; }
        .hamburger.open::before { transform: rotate(45deg); top: 0; }
        .hamburger.open::after { transform: rotate(-45deg); top: 0; }
        .mobile-menu {
          display: flex; flex-direction: column; gap: 0.25rem;
          padding: 0.75rem 2rem 1rem;
          background: rgba(8, 11, 20, 0.98);
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .mobile-link {
          padding: 0.6rem 0.75rem; border-radius: 8px;
          font-weight: 500; color: var(--text-secondary);
          transition: var(--transition); cursor: none;
        }
        .mobile-link:hover { color: var(--neon-cyan); background: rgba(34, 211, 238, 0.05); }
        .mobile-play { width: fit-content; margin-top: 0.5rem; }
        @media (max-width: 768px) {
          .nav-links, .xp-section { display: none; }
          .mobile-toggle { display: flex; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
