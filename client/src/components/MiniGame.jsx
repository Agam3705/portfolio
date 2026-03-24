import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = [
  'javascript', 'react', 'nodejs', 'mongodb', 'express', 'fullstack',
  'developer', 'algorithm', 'database', 'frontend', 'backend', 'portfolio',
  'component', 'function', 'variable', 'interface', 'framework', 'repository',
  'typescript', 'tailwind', 'deployment', 'debugging', 'programming', 'java',
];

const GAME_DURATION = 30;

const MiniGame = ({ onClose, embedded = false }) => {
  const [phase, setPhase] = useState('intro'); // intro | playing | result
  const [currentWord, setCurrentWord] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState('');
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const pickWord = useCallback(() => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(w);
    setInput('');
  }, []);

  const startGame = () => {
    setScore(0); setStreak(0); setTimeLeft(GAME_DURATION); setFlash('');
    setPhase('playing');
    pickWord();
  };

  useEffect(() => {
    if (phase === 'playing') {
      inputRef.current?.focus();
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); setPhase('result'); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val === currentWord) {
      setScore(s => s + 1 + streak);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setFlash('correct');
      setTimeout(() => setFlash(''), 300);
      pickWord();
    } else if (currentWord.startsWith(val)) {
      // still typing
    } else if (val.length >= currentWord.length || !currentWord.startsWith(val)) {
      setStreak(0);
      setShake(true);
      setFlash('wrong');
      setTimeout(() => { setShake(false); setFlash(''); }, 400);
    }
  };

  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timerPct > 50 ? '#4ade80' : timerPct > 25 ? '#fb923c' : '#f472b6';

  const content = (
    <>
      <motion.div
        className={`minigame-modal ${embedded ? 'embedded' : ''}`}
        initial={embedded ? {} : { scale: 0.8, y: 40 }}
        animate={embedded ? {} : { scale: 1, y: 0 }}
        exit={embedded ? {} : { scale: 0.8, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        {!embedded && <button className="minigame-close" onClick={onClose}>✕</button>}

        <div className="minigame-header">
          <span className="game-badge">🎮 MINI GAME</span>
          <h2>Typing Speed Challenge</h2>
          <p>Type the word before time runs out! Streaks multiply your XP!</p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" className="game-phase"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="game-rules">
                <div className="rule">⌨️ Type each word exactly as shown</div>
                <div className="rule">🔥 Build streaks for bonus XP</div>
                <div className="rule">⏱️ You have {GAME_DURATION} seconds</div>
              </div>
              <button className="btn-primary start-btn" onClick={startGame}>
                ▶ Start Game
              </button>
            </motion.div>
          )}

          {phase === 'playing' && (
            <motion.div key="playing" className="game-phase"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Stats row */}
              <div className="game-stats">
                <div className="game-stat"><span>Score</span><strong>{score}</strong></div>
                <div className="game-stat"><span>Streak</span><strong className="neon-text-purple">🔥 {streak}x</strong></div>
                <div className="game-stat"><span>Best</span><strong className="neon-text-cyan">{bestStreak}x</strong></div>
              </div>

              {/* Timer bar */}
              <div className="timer-wrap">
                <div className="timer-bar">
                  <motion.div
                    className="timer-fill"
                    style={{ background: timerColor, boxShadow: `0 0 10px ${timerColor}80` }}
                    animate={{ width: `${timerPct}%` }}
                    transition={{ duration: 0.9 }}
                  />
                </div>
                <span className="timer-num" style={{ color: timerColor }}>{timeLeft}s</span>
              </div>

              {/* Word display */}
              <motion.div
                className={`word-display ${flash}`}
                animate={shake ? { x: [-6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                {currentWord.split('').map((ch, i) => {
                  let color = 'var(--text-secondary)';
                  if (i < input.length) {
                    color = input[i] === ch ? '#4ade80' : '#f472b6';
                  }
                  return <span key={i} style={{ color, transition: 'color 0.1s' }}>{ch}</span>;
                })}
              </motion.div>

              {/* Input */}
              <input
                ref={inputRef}
                value={input}
                onChange={handleInput}
                className="game-input"
                placeholder="Start typing..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div key="result" className="game-phase"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="result-score">
                <div className="result-icon">🏆</div>
                <div className="result-label">Final Score</div>
                <div className="result-num neon-text-cyan">{score}</div>
              </div>
              <div className="result-stats">
                <div className="res-stat"><span>Best Streak</span><strong className="neon-text-purple">🔥 {bestStreak}x</strong></div>
                <div className="res-stat">
                  <span>Rank</span>
                  <strong>{score >= 30 ? '🌟 Legendary' : score >= 20 ? '💜 Epic' : score >= 10 ? '💙 Rare' : '🟢 Common'}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button className="btn-primary" onClick={startGame}>▶ Play Again</button>
                <button className="btn-secondary" onClick={onClose}>Close</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .minigame-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,.8); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .minigame-modal {
          background: var(--bg-card);
          border: 1px solid var(--border); border-radius: 24px;
          padding: 2rem; max-width: 480px; width: 100%;
          position: relative; overflow: hidden;
        }
        .minigame-modal.embedded {
          border: none; padding: 0.5rem; max-width: 100%; position: static; background: transparent;
        }
        .minigame-modal::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at top, rgba(168,85,247,.08), transparent 70%);
          pointer-events: none;
        }
        .minigame-close {
          position: absolute; top: 1rem; right: 1rem;
          background: rgba(255,255,255,.06); border: 1px solid var(--border);
          color: var(--text-secondary); width: 32px; height: 32px;
          border-radius: 8px; font-size: 0.85rem; transition: var(--transition);
        }
        .minigame-close:hover { color: var(--text-primary); border-color: var(--border-hover); }
        .minigame-header { text-align: center; margin-bottom: 1.75rem; }
        .game-badge {
          display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px;
          background: rgba(168,85,247,.15); border: 1px solid rgba(168,85,247,.3);
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em;
          color: var(--neon-purple); margin-bottom: 0.75rem;
        }
        .minigame-header h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 0.4rem; }
        .minigame-header p { font-size: 0.85rem; color: var(--text-secondary); }
        .game-phase { display: flex; flex-direction: column; gap: 1.25rem; align-items: center; }
        .game-rules { display: flex; flex-direction: column; gap: 0.6rem; width: 100%; }
        .rule {
          padding: 0.6rem 1rem; border-radius: 10px;
          background: rgba(255,255,255,.03); border: 1px solid var(--border);
          font-size: 0.87rem; color: var(--text-secondary);
        }
        .start-btn { padding: 0.7rem 2.5rem; }
        .game-stats {
          display: flex; gap: 1rem; width: 100%; justify-content: center;
        }
        .game-stat {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          padding: 0.5rem 1rem; border-radius: 10px;
          background: rgba(255,255,255,.03); border: 1px solid var(--border);
          min-width: 72px;
        }
        .game-stat span { font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono); }
        .game-stat strong { font-size: 1rem; font-weight: 700; }
        .timer-wrap { display: flex; align-items: center; gap: 0.75rem; width: 100%; }
        .timer-bar {
          flex: 1; height: 8px; background: rgba(255,255,255,.06);
          border-radius: 4px; overflow: hidden;
        }
        .timer-fill { height: 100%; border-radius: 4px; }
        .timer-num { font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; min-width: 28px; }
        .word-display {
          font-family: var(--font-mono); font-size: 2.2rem; font-weight: 700;
          letter-spacing: 0.08em; min-height: 3rem; display: flex; gap: 0.02em; flex-wrap: wrap; justify-content: center;
          padding: 1rem; border-radius: 14px;
          background: rgba(255,255,255,.02); border: 1px solid var(--border);
          width: 100%;
        }
        .word-display.correct { border-color: rgba(74,222,128,.4); background: rgba(74,222,128,.04); }
        .word-display.wrong { border-color: rgba(244,114,182,.4); background: rgba(244,114,182,.04); }
        .game-input {
          width: 100%; padding: 0.75rem 1rem; border-radius: 12px;
          background: rgba(255,255,255,.04); border: 1px solid var(--border);
          color: var(--text-primary); font-size: 1rem; font-family: var(--font-mono);
          text-align: center; outline: none; transition: var(--transition);
        }
        .game-input:focus { border-color: var(--neon-purple); box-shadow: 0 0 0 3px rgba(168,85,247,.1); }
        .result-score { text-align: center; }
        .result-icon { font-size: 3rem; }
        .result-label { font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); margin: 0.25rem 0; }
        .result-num { font-size: 3rem; font-weight: 900; }
        .result-stats { display: flex; gap: 1rem; justify-content: center; }
        .res-stat {
          display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
          padding: 0.6rem 1.2rem; border-radius: 10px;
          background: rgba(255,255,255,.03); border: 1px solid var(--border);
        }
        .res-stat span { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono); }
        .res-stat strong { font-size: 0.95rem; font-weight: 700; }
      `}</style>
    </>
  );

  if (embedded) return content;

  return (
    <motion.div
      className="minigame-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {content}
    </motion.div>
  );
};

export default MiniGame;
