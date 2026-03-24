import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TECH_PAIRS = [
  { id: 'react', emoji: '⚛️', name: 'React' },
  { id: 'node', emoji: '🟢', name: 'Node.js' },
  { id: 'mongo', emoji: '🍃', name: 'MongoDB' },
  { id: 'js', emoji: '🟨', name: 'JavaScript' },
  { id: 'java', emoji: '☕', name: 'Java' },
  { id: 'git', emoji: '🐙', name: 'Git' },
  { id: 'html', emoji: '🔶', name: 'HTML' },
  { id: 'css', emoji: '🎨', name: 'CSS' },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const buildDeck = () =>
  shuffle(
    TECH_PAIRS.flatMap((t) => [
      { ...t, uid: t.id + '_a' },
      { ...t, uid: t.id + '_b' },
    ])
  );

const MemoryGame = ({ onBack }) => {
  const [cards, setCards] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (moves === 1) setStartTime(Date.now());
  }, [moves]);

  useEffect(() => {
    if (!startTime || won) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500);
    return () => clearInterval(t);
  }, [startTime, won]);

  const handleFlip = useCallback((uid) => {
    if (lock || flipped.includes(uid) || matched.has(uid)) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = next.map((u) => cards.find((c) => c.uid === u));
      if (a.id === b.id) {
        setTimeout(() => {
          setMatched((prev) => {
            const s = new Set([...prev, a.uid, b.uid]);
            if (s.size === cards.length) setWon(true);
            return s;
          });
          setFlipped([]);
          setLock(false);
        }, 400);
      } else {
        setTimeout(() => { setFlipped([]); setLock(false); }, 900);
      }
    }
  }, [lock, flipped, matched, cards]);

  const restart = () => {
    setCards(buildDeck());
    setFlipped([]); setMatched(new Set());
    setMoves(0); setLock(false); setWon(false);
    setStartTime(null); setElapsed(0);
  };

  const getRank = () => {
    if (moves <= 10) return { label: '🌟 Legendary', color: '#FFD700' };
    if (moves <= 14) return { label: '💜 Epic', color: '#C084FC' };
    if (moves <= 19) return { label: '💙 Rare', color: '#38BDF8' };
    return { label: '🟢 Common', color: '#4ADE80' };
  };

  return (
    <div className="sub-game">
      <div className="mem-stats">
        <div className="mem-stat"><span>Moves</span><strong>{moves}</strong></div>
        <div className="mem-stat"><span>Matched</span><strong className="neon-text-green">{matched.size / 2}/{TECH_PAIRS.length}</strong></div>
        <div className="mem-stat"><span>Time</span><strong className="neon-text-cyan">{elapsed}s</strong></div>
        <button className="mem-reset" onClick={restart}>↺ Reset</button>
      </div>

      <AnimatePresence>
        {won && (
          <motion.div className="win-banner"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div style={{ fontSize: '2.5rem' }}>🎉</div>
            <div>You matched all pairs in <strong>{moves} moves</strong> and <strong>{elapsed}s</strong>!</div>
            <div className="win-rank" style={{ color: getRank().color }}>{getRank().label}</div>
            <button className="btn-primary" onClick={restart} style={{ marginTop: '0.75rem' }}>Play Again</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mem-grid">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uid) || matched.has(card.uid);
          const isMatched = matched.has(card.uid);
          return (
            <motion.div
              key={card.uid}
              className={`mem-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => handleFlip(card.uid)}
              whileHover={!isFlipped ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              <div className="mem-card-inner">
                <div className="mem-card-back">?</div>
                <div className="mem-card-front">
                  <span className="mem-emoji">{card.emoji}</span>
                  <span className="mem-name">{card.name}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .mem-stats {
          display: flex; gap: 0.75rem; align-items: center;
          justify-content: center; flex-wrap: wrap; margin-bottom: 1.25rem;
        }
        .mem-stat {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          padding: 0.4rem 0.9rem; border-radius: 10px;
          background: rgba(255,255,255,.04); border: 1px solid var(--border);
          min-width: 64px;
        }
        .mem-stat span { font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono); }
        .mem-stat strong { font-size: 0.95rem; font-weight: 700; }
        .mem-reset {
          padding: 0.4rem 0.9rem; border-radius: 8px;
          background: transparent; border: 1px solid var(--border);
          color: var(--text-secondary); font-size: 0.82rem;
          transition: var(--transition);
        }
        .mem-reset:hover { border-color: var(--neon-purple); color: var(--neon-purple); }
        .win-banner {
          text-align: center; padding: 1.25rem;
          background: rgba(168,85,247,.08); border: 1px solid rgba(168,85,247,.3);
          border-radius: 14px; margin-bottom: 1rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
          font-size: 0.9rem;
        }
        .win-rank { font-size: 1.1rem; font-weight: 800; }
        .mem-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem;
        }
        .mem-card {
          aspect-ratio: 1; cursor: none;
          perspective: 600px;
        }
        .mem-card-inner {
          width: 100%; height: 100%;
          position: relative; transition: transform 0.45s ease;
          transform-style: preserve-3d;
        }
        .mem-card.flipped .mem-card-inner { transform: rotateY(180deg); }
        .mem-card-back, .mem-card-front {
          position: absolute; inset: 0;
          border-radius: 10px; backface-visibility: hidden;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          border: 1px solid var(--border);
        }
        .mem-card-back {
          background: var(--bg-card);
          font-size: 1.4rem; color: var(--text-muted);
          font-weight: 700; font-family: var(--font-mono);
        }
        .mem-card.matched .mem-card-back { background: rgba(74,222,128,.06); border-color: rgba(74,222,128,.3); }
        .mem-card-front {
          background: linear-gradient(135deg, rgba(168,85,247,.12), rgba(34,211,238,.08));
          border-color: rgba(168,85,247,.3);
          transform: rotateY(180deg);
          gap: 0.2rem;
        }
        .mem-card.matched .mem-card-front { border-color: rgba(74,222,128,.5); }
        .mem-emoji { font-size: 1.5rem; }
        .mem-name { font-size: 0.55rem; font-weight: 600; font-family: var(--font-mono); color: var(--text-secondary); }
        @media (max-width: 420px) { .mem-grid { grid-template-columns: repeat(4, 1fr); gap: 0.4rem; } }
      `}</style>
    </div>
  );
};

export default MemoryGame;
