import { useEffect, useRef, useState, useCallback } from 'react';

const COLS = 20, ROWS = 18, CELL = 22;
const W = COLS * CELL, H = ROWS * CELL;
const DIR = { ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0],
               w:[0,-1], s:[0,1], a:[-1,0], d:[1,0] };

function rand(max) { return Math.floor(Math.random() * max); }
function placeFood(snake) {
  let pos;
  do { pos = { x: rand(COLS), y: rand(ROWS) }; }
  while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | playing | dead

  const initState = () => {
    const snake = [{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }];
    return {
      snake,
      dir: [1, 0],
      nextDir: [1, 0],
      food: placeFood(snake),
      score: 0,
      tickRate: 120,
      lastTick: 0,
      colors: ['#22d3ee', '#a78bfa', '#f472b6'],
      colorIdx: 0,
      particles: [],
    };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x*CELL, 0); ctx.lineTo(x*CELL, H); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y*CELL); ctx.lineTo(W, y*CELL); ctx.stroke();
    }

    // Food (pulsing)
    const t = Date.now() / 500;
    const glow = 10 + Math.sin(t) * 6;
    ctx.shadowColor = '#fde047'; ctx.shadowBlur = glow;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    const fx = s.food.x * CELL + CELL/2, fy = s.food.y * CELL + CELL/2;
    ctx.arc(fx, fy, CELL/2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    s.snake.forEach((seg, i) => {
      const ratio = 1 - i / s.snake.length;
      const color = s.colors[s.colorIdx % s.colors.length];
      ctx.shadowColor = color; ctx.shadowBlur = ratio > 0.9 ? 18 : 6;
      ctx.fillStyle = i === 0 ? color : `${color}${Math.round(ratio * 200).toString(16).padStart(2,'0')}`;
      ctx.beginPath();
      ctx.roundRect(seg.x*CELL+1, seg.y*CELL+1, CELL-2, CELL-2, i===0 ? 6 : 3);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Particles
    s.particles = s.particles.filter(p => p.life > 0);
    s.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#fde047'; ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x + p.vx * (1-p.life)*20, p.y + p.vy * (1-p.life)*20, 3 * p.life, 0, Math.PI*2);
      ctx.fill();
      p.life -= 0.04;
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback((ts) => {
    const s = stateRef.current;
    if (!s) return;
    draw();
    if (ts - s.lastTick >= s.tickRate) {
      s.lastTick = ts;
      s.dir = s.nextDir;
      const head = s.snake[0];
      const next = { x: head.x + s.dir[0], y: head.y + s.dir[1] };

      // Wall or self collision
      if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS ||
          s.snake.some(seg => seg.x === next.x && seg.y === next.y)) {
        setStatus('dead');
        setBest(b => Math.max(b, s.score));
        return;
      }

      const ate = next.x === s.food.x && next.y === s.food.y;
      s.snake = [next, ...s.snake];
      if (!ate) s.snake.pop();
      else {
        s.score++;
        s.tickRate = Math.max(60, s.tickRate - 2);
        s.colorIdx++;
        s.food = placeFood(s.snake);
        // Spawn particles at food location
        for (let i = 0; i < 10; i++) {
          const angle = Math.random() * Math.PI * 2;
          s.particles.push({ x: next.x*CELL+CELL/2, y: next.y*CELL+CELL/2, vx: Math.cos(angle), vy: Math.sin(angle), life: 1 });
        }
        setScore(s.score);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const start = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    stateRef.current = initState();
    setScore(0);
    setStatus('playing');
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!stateRef.current) return;
      const d = DIR[e.key];
      if (!d) return;
      e.preventDefault();
      const cur = stateRef.current.dir;
      // Prevent reverse
      if (d[0] === -cur[0] && d[1] === -cur[1]) return;
      stateRef.current.nextDir = d;
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const swipeRef = useRef(null);
  const handleTouchStart = (e) => { swipeRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const handleTouchEnd = (e) => {
    if (!swipeRef.current || !stateRef.current) return;
    const dx = e.changedTouches[0].clientX - swipeRef.current.x;
    const dy = e.changedTouches[0].clientY - swipeRef.current.y;
    const cur = stateRef.current.dir;
    let d;
    if (Math.abs(dx) > Math.abs(dy)) d = dx > 0 ? [1,0] : [-1,0];
    else d = dy > 0 ? [0,1] : [0,-1];
    if (d[0] === -cur[0] && d[1] === -cur[1]) return;
    stateRef.current.nextDir = d;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
        <span style={{ color: '#22d3ee' }}>SCORE: <strong style={{ fontSize: '1.1rem' }}>{score}</strong></span>
        <span style={{ color: '#94a3b8' }}>BEST: <strong>{best}</strong></span>
      </div>

      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(168,85,247,0.3)', boxShadow: '0 0 30px rgba(168,85,247,0.1)' }}>
        <canvas
          ref={canvasRef}
          width={W} height={H}
          style={{ display: 'block', background: '#020611' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        {status !== 'playing' && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(2,6,17,0.9)', flexDirection: 'column', gap: '0.8rem'
          }}>
            <div style={{ fontSize: '2.5rem' }}>{status === 'dead' ? '💀' : '🐍'}</div>
            <div style={{ fontFamily: 'var(--font-mono)', color: '#a78bfa', fontWeight: 800, fontSize: '1.1rem' }}>
              {status === 'dead' ? `GAME OVER — Score: ${score}` : 'SNAKE'}
            </div>
            <button onClick={start} style={{
              padding: '0.4rem 1.4rem', borderRadius: '8px', fontFamily: 'var(--font-mono)',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem',
              background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.5)', color: '#a78bfa',
            }}>
              {status === 'dead' ? '↺ RETRY' : '▶ START'}
            </button>
            <div style={{ fontSize: '0.65rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>WASD or Arrow keys · Swipe on mobile</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
