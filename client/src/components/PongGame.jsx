import { useEffect, useRef, useState } from 'react';

const W = 480, H = 280;
const PAD_W = 10, PAD_H = 60, BALL_R = 7, BASE_SPEED = 4, WIN = 5;
const PAD_SPEED = 5;

const PongGame = () => {
  const canvasRef = useRef(null);
  const state = useRef(null);
  const rafRef = useRef(null);
  const keysRef = useRef({});
  const [score, setScore] = useState({ p: 0, ai: 0 });
  const [status, setStatus] = useState('idle'); // idle | playing | won | lost

  const initState = () => ({
    ball: { x: W/2, y: H/2, vx: BASE_SPEED, vy: BASE_SPEED * 0.7 },
    player: { y: H/2 - PAD_H/2 },
    ai: { y: H/2 - PAD_H/2 },
    score: { p: 0, ai: 0 },
    particles: [],
  });

  const spawnParticles = (x, y, color) => {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 4;
      state.current.particles.push({
        x, y, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, life: 1, color
      });
    }
  };

  const loop = () => {
    const s = state.current;
    const canvas = canvasRef.current;
    if (!canvas || !s) return;
    const ctx = canvas.getContext('2d');

    // Player movement via keyboard
    if (keysRef.current['ArrowUp'])   s.player.y = Math.max(0, s.player.y - PAD_SPEED);
    if (keysRef.current['ArrowDown']) s.player.y = Math.min(H - PAD_H, s.player.y + PAD_SPEED);

    // AI tracks ball
    const ballCenter = s.ball.y - PAD_H/2;
    s.ai.y += (ballCenter - s.ai.y) * 0.07;
    s.ai.y = Math.max(0, Math.min(H - PAD_H, s.ai.y));

    // Ball movement
    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;

    // Top/bottom bounce
    if (s.ball.y - BALL_R < 0) { s.ball.y = BALL_R; s.ball.vy *= -1; }
    if (s.ball.y + BALL_R > H) { s.ball.y = H - BALL_R; s.ball.vy *= -1; }

    // Player paddle collision
    if (s.ball.vx < 0 && s.ball.x - BALL_R < PAD_W + 8 && s.ball.x > 8 &&
        s.ball.y > s.player.y && s.ball.y < s.player.y + PAD_H) {
      s.ball.vx = Math.abs(s.ball.vx) * 1.05;
      const rel = (s.ball.y - s.player.y) / PAD_H - 0.5;
      s.ball.vy = rel * 9;
      s.ball.x = PAD_W + 8 + BALL_R;
      spawnParticles(s.ball.x, s.ball.y, '#22d3ee');
    }

    // AI paddle collision
    if (s.ball.vx > 0 && s.ball.x + BALL_R > W - PAD_W - 8 && s.ball.x < W - 8 &&
        s.ball.y > s.ai.y && s.ball.y < s.ai.y + PAD_H) {
      s.ball.vx = -Math.abs(s.ball.vx) * 1.05;
      const rel = (s.ball.y - s.ai.y) / PAD_H - 0.5;
      s.ball.vy = rel * 9;
      s.ball.x = W - PAD_W - 8 - BALL_R;
      spawnParticles(s.ball.x, s.ball.y, '#f472b6');
    }

    // Cap speed
    const spd = Math.sqrt(s.ball.vx**2 + s.ball.vy**2);
    if (spd > 15) { s.ball.vx *= 14/spd; s.ball.vy *= 14/spd; }

    // Score points
    let scored = false;
    if (s.ball.x + BALL_R < 0) {
      s.score.ai++;
      spawnParticles(20, s.ball.y, '#f472b6');
      scored = true;
    } else if (s.ball.x - BALL_R > W) {
      s.score.p++;
      spawnParticles(W - 20, s.ball.y, '#22d3ee');
      scored = true;
    }

    if (scored) {
      const cur = { ...s.score };
      setScore(cur);
      if (cur.p >= WIN) { setStatus('won'); return; }
      if (cur.ai >= WIN) { setStatus('lost'); return; }
      // Reset ball
      Object.assign(s.ball, { x: W/2, y: H/2, vx: (Math.random()>0.5?1:-1)*BASE_SPEED, vy: (Math.random()-0.5)*6 });
    }

    // Particles
    s.particles = s.particles.filter(p => p.life > 0);
    s.particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.life-=0.06; p.vx*=0.92; p.vy*=0.92; });

    // ─── DRAW ───
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#020611';
    ctx.fillRect(0, 0, W, H);

    // Center dashes
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
    ctx.setLineDash([]);

    // Win indicator pips
    for (let i = 0; i < WIN; i++) {
      ctx.fillStyle = i < s.score.p ? '#22d3ee' : 'rgba(34,211,238,0.15)';
      ctx.beginPath(); ctx.arc(W/4 + i * 14 - 28, 14, 4, 0, Math.PI*2); ctx.fill();
    }
    for (let i = 0; i < WIN; i++) {
      ctx.fillStyle = i < s.score.ai ? '#f472b6' : 'rgba(244,114,182,0.15)';
      ctx.beginPath(); ctx.arc(W*3/4 + i * 14 - 28, 14, 4, 0, Math.PI*2); ctx.fill();
    }

    // Paddles
    const drawPad = (x, y, color) => {
      ctx.shadowColor = color; ctx.shadowBlur = 18;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.roundRect(x, y, PAD_W, PAD_H, 4); ctx.fill();
      ctx.shadowBlur = 0;
    };
    drawPad(8, s.player.y, '#22d3ee');
    drawPad(W - PAD_W - 8, s.ai.y, '#f472b6');

    // Ball
    ctx.shadowColor = '#fde047'; ctx.shadowBlur = 22;
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Particles
    s.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    rafRef.current = requestAnimationFrame(loop);
  };

  const start = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    state.current = initState();
    setScore({ p: 0, ai: 0 });
    setStatus('playing');
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const onDown = (e) => {
      if (['ArrowUp','ArrowDown'].includes(e.key)) {
        e.preventDefault();
        keysRef.current[e.key] = true;
      }
    };
    const onUp = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const isOver = status === 'won' || status === 'lost';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '3rem', fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900 }}>
        <span style={{ color: '#22d3ee' }}>{score.p}</span>
        <span style={{ color: '#94a3b8', fontSize: '0.7rem', alignSelf: 'center' }}>FIRST TO {WIN}</span>
        <span style={{ color: '#f472b6' }}>{score.ai}</span>
      </div>
      <div style={{ display: 'flex', gap: '5rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#94a3b8', marginTop: '-0.4rem' }}>
        <span>YOU</span><span>AI</span>
      </div>

      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(34,211,238,0.25)', boxShadow: '0 0 30px rgba(34,211,238,0.08)' }}>
        <canvas ref={canvasRef} width={W} height={H}
          style={{ display: 'block', width: '100%', maxWidth: W }} />

        {(status === 'idle' || isOver) && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(2,6,17,0.88)', flexDirection: 'column', gap: '0.8rem'
          }}>
            <div style={{ fontSize: '2.2rem' }}>{status === 'won' ? '🏆' : status === 'lost' ? '💀' : '🏓'}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem',
              color: status === 'won' ? '#fde047' : status === 'lost' ? '#f472b6' : '#22d3ee' }}>
              {status === 'won' ? 'YOU WIN!' : status === 'lost' ? 'AI WINS!' : 'PONG'}
            </div>
            <button onClick={start} style={{
              padding: '0.4rem 1.4rem', borderRadius: '8px', fontFamily: 'var(--font-mono)',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem',
              background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.5)', color: '#22d3ee',
            }}>{isOver ? '↺ REMATCH' : '▶ START'}</button>
            <div style={{ fontSize: '0.65rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
              ↑↓ Arrow keys to move · First to {WIN} wins
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PongGame;
