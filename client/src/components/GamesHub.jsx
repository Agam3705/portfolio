import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MiniGame from './MiniGame';
import MemoryGame from './MemoryGame';
import TicTacToe from './TicTacToe';
import PongGame from './PongGame';
import SnakeGame from './SnakeGame';
import CarGame from './CarGame';

const GAMES = [
  {
    id: 'typing',
    title: 'Typing Blitz',
    icon: '⌨️',
    desc: 'Race against the clock — type tech words as fast as you can. Build streaks for XP multipliers.',
    difficulty: 'Medium',
    diffColor: '#fb923c',
    badge: 'Speed',
    badgeColor: '#fb923c',
  },
  {
    id: 'memory',
    title: 'Tech Memory Match',
    icon: '🧠',
    desc: 'Flip and match pairs of tech stack cards. Fewer moves = higher rank. Test your memory!',
    difficulty: 'Easy',
    diffColor: '#4ade80',
    badge: 'Memory',
    badgeColor: '#4ade80',
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    icon: '⭕',
    desc: 'Classic Tic Tac Toe vs a sneaky AI. Can you outwit it? Beat the bot to win bragging rights.',
    difficulty: 'Easy',
    diffColor: '#22d3ee',
    badge: 'Classic',
    badgeColor: '#22d3ee',
  },
  {
    id: 'pong',
    title: 'Pong',
    icon: '🏓',
    desc: 'Retro Pong with neon glow and particle effects. Move your mouse to control the paddle.',
    difficulty: 'Medium',
    diffColor: '#a78bfa',
    badge: 'Arcade',
    badgeColor: '#a78bfa',
  },
  {
    id: 'snake',
    title: 'Snake',
    icon: '🐍',
    desc: 'Classic snake with rainbow colors and particle bursts. Use WASD or swipe on mobile.',
    difficulty: 'Hard',
    diffColor: '#f472b6',
    badge: 'Reflex',
    badgeColor: '#f472b6',
  },
  {
    id: 'car',
    title: 'Car Racing',
    icon: '🚗',
    desc: 'Dodge oncoming cars in a 3-lane road. Speed increases over time. Crash = game over!',
    difficulty: 'Hard',
    diffColor: '#ef4444',
    badge: 'Racing',
    badgeColor: '#ef4444',
  },
];

const GamesHub = ({ onClose }) => {
  const [active, setActive] = useState(null);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const activeGame = GAMES.find(g => g.id === active);

  return (
    <motion.div
      className="hub-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        className="hub-modal"
        initial={{ scale: 0.85, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 40 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button className="hub-close" onClick={onClose}>✕</button>

        <AnimatePresence mode="wait">
          {/* ─── GAME HUB SELECTOR ─── */}
          {!active && (
            <motion.div key="hub"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="hub-header">
                <span className="hub-badge">🕹️ ARCADE</span>
                <h2>Agam's Game Arcade</h2>
                <p>Pick a game and have fun!</p>
              </div>
              <div className="hub-grid">
                {GAMES.map((g, i) => (
                  <motion.button
                    key={g.id}
                    className="hub-card"
                    onClick={() => setActive(g.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -4, borderColor: g.badgeColor }}
                  >
                    <div className="hub-icon" style={{ background: g.badgeColor + '22', color: g.badgeColor }}>
                      {g.icon}
                    </div>
                    <div className="hub-card-body">
                      <div className="hub-card-top">
                        <div className="hub-title">{g.title}</div>
                        <span className="hub-diff" style={{ borderColor: g.diffColor + '88', color: g.diffColor, background: g.diffColor + '18' }}>
                          {g.difficulty}
                        </span>
                      </div>
                      <p className="hub-desc">{g.desc}</p>
                      <div className="hub-play-btn" style={{ color: g.badgeColor }}>
                        ▶ Play →
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── ACTIVE GAME ─── */}
          {active && (
            <motion.div key={active}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="game-nav">
                <button className="hub-back" onClick={() => setActive(null)}>
                  ← Arcade
                </button>
                <span className="game-nav-title">
                  {activeGame?.icon} {activeGame?.title}
                </span>
              </div>

              {active === 'typing'    && <MiniGame embedded onClose={() => setActive(null)} />}
              {active === 'memory'   && <MemoryGame onBack={() => setActive(null)} />}
              {active === 'tictactoe'&& <TicTacToe onBack={() => setActive(null)} />}
              {active === 'pong'     && <PongGame />}
              {active === 'snake'    && <SnakeGame />}
              {active === 'car'      && <CarGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .hub-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,.82); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .hub-modal {
          background: var(--bg-card);
          border: 1px solid rgba(168,85,247,.25); border-radius: 24px;
          padding: 2rem; width: min(680px, 100%);
          max-height: 90vh; overflow-y: auto;
          position: relative;
          box-shadow: 0 0 60px rgba(168,85,247,.12);
        }
        .hub-modal::-webkit-scrollbar { width: 4px; }
        .hub-modal::-webkit-scrollbar-thumb { background: var(--neon-purple); border-radius: 2px; }
        .hub-close {
          position: absolute; top: 1rem; right: 1rem;
          background: rgba(255,255,255,.06); border: 1px solid var(--border);
          color: var(--text-secondary); width: 32px; height: 32px;
          border-radius: 8px; font-size: 0.85rem; transition: var(--transition);
          cursor: pointer;
        }
        .hub-close:hover { color: var(--text-primary); border-color: var(--border-hover); }
        .hub-header { text-align: center; margin-bottom: 1.5rem; }
        .hub-badge {
          display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px;
          background: rgba(168,85,247,.15); border: 1px solid rgba(168,85,247,.3);
          font-size: 0.72rem; font-weight: 800; letter-spacing: 0.1em;
          color: var(--neon-purple); margin-bottom: 0.6rem;
        }
        .hub-header h2 { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.3rem; }
        .hub-header p { font-size: 0.85rem; color: var(--text-secondary); }
        .hub-grid { display: flex; flex-direction: column; gap: 0.6rem; }
        .hub-card {
          display: flex; align-items: flex-start; gap: 1rem; text-align: left;
          padding: 1rem; border-radius: 14px;
          background: rgba(255,255,255,.02);
          border: 1px solid var(--border); transition: all 0.3s ease;
          cursor: pointer; width: 100%;
        }
        .hub-icon {
          font-size: 1.6rem; width: 50px; height: 50px;
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .hub-card-body { flex: 1; }
        .hub-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
        .hub-title { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }
        .hub-diff {
          font-size: 0.65rem; font-weight: 700; font-family: var(--font-mono);
          padding: 0.15rem 0.5rem; border-radius: 999px; border: 1px solid;
        }
        .hub-desc { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 0.4rem; }
        .hub-play-btn { font-size: 0.78rem; font-weight: 700; font-family: var(--font-mono); }
        .game-nav {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);
        }
        .hub-back {
          padding: 0.35rem 0.8rem; border-radius: 8px;
          background: transparent; border: 1px solid var(--border);
          color: var(--text-secondary); font-size: 0.8rem;
          transition: var(--transition); cursor: pointer;
        }
        .hub-back:hover { border-color: var(--neon-purple); color: var(--neon-purple); }
        .game-nav-title { font-size: 0.95rem; font-weight: 700; }
      `}</style>
    </motion.div>
  );
};

export default GamesHub;
