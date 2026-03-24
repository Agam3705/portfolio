import { useEffect, useRef, useState, useCallback } from 'react';

const W = 480, H = 300;
const ROAD_LEFT = 140, ROAD_RIGHT = 340; // road bounds
const ROAD_W = ROAD_RIGHT - ROAD_LEFT;
const LANE_W = ROAD_W / 3;
const CAR_W = 36, CAR_H = 60;
const OBS_W = 38, OBS_H = 58;

function randLane() { return Math.floor(Math.random() * 3); } // 0,1,2

const CarGame = () => {
  const canvasRef = useRef(null);
  const state = useRef(null);
  const rafRef = useRef(null);
  const keysRef = useRef({});
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState('idle');

  const laneX = (lane) => ROAD_LEFT + lane * LANE_W + LANE_W/2 - CAR_W/2;

  const initState = () => ({
    player: { lane: 1, x: laneX(1), y: H - 80, targetX: laneX(1) },
    obstacles: [],
    roadOffset: 0,
    speed: 3,
    score: 0,
    frame: 0,
    particles: [],
    crashed: false,
  });

  const spawnObs = (s) => {
    const lane = randLane();
    // Avoid spawning same lane twice in a row
    const lastLane = s.obstacles.length ? s.obstacles[s.obstacles.length-1].lane : -1;
    const useLane = lane === lastLane ? (lane+1)%3 : lane;
    s.obstacles.push({ lane: useLane, x: laneX(useLane), y: -OBS_H - 10,
      color: ['#ef4444','#f97316','#eab308'][Math.floor(Math.random()*3)] });
  };

  const loop = useCallback(() => {
    const s = state.current;
    const canvas = canvasRef.current;
    if (!canvas || !s || s.crashed) return;
    const ctx = canvas.getContext('2d');

    s.frame++;
    s.score += 0.05;
    s.speed = 3 + s.score * 0.012;

    // Player input
    if (keysRef.current['ArrowLeft'] && s.player.lane > 0) {
      s.player.lane--;
      s.player.targetX = laneX(s.player.lane);
      keysRef.current['ArrowLeft'] = false;
    }
    if (keysRef.current['ArrowRight'] && s.player.lane < 2) {
      s.player.lane++;
      s.player.targetX = laneX(s.player.lane);
      keysRef.current['ArrowRight'] = false;
    }

    // Smooth player movement
    s.player.x += (s.player.targetX - s.player.x) * 0.22;

    // Road scroll
    s.roadOffset = (s.roadOffset + s.speed) % 40;

    // Spawn obstacles
    const spawnInterval = Math.max(40, 90 - s.score * 0.8);
    if (s.frame % Math.floor(spawnInterval) === 0) spawnObs(s);

    // Move obstacles
    s.obstacles.forEach(ob => { ob.y += s.speed; ob.x += (laneX(ob.lane) - ob.x) * 0.3; });
    s.obstacles = s.obstacles.filter(ob => ob.y < H + OBS_H + 10);

    // Collision detection
    const px = s.player.x, py = s.player.y;
    for (const ob of s.obstacles) {
      if (px < ob.x + OBS_W && px + CAR_W > ob.x &&
          py < ob.y + OBS_H && py + CAR_H > ob.y) {
        // Crash!
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 2 + Math.random() * 5;
          s.particles.push({ x: px + CAR_W/2, y: py + CAR_H/2,
            vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, life: 1,
            color: ['#ef4444','#fde047','#f97316'][Math.floor(Math.random()*3)] });
        }
        s.crashed = true;
        const finalScore = Math.floor(s.score);
        setBest(b => Math.max(b, finalScore));
        setScore(finalScore);
        setStatus('crashed');

        // Draw one last crash frame then stop
        drawFrame(ctx, s);
        return;
      }
    }

    setScore(Math.floor(s.score));
    drawFrame(ctx, s);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const drawFrame = (ctx, s) => {
    ctx.clearRect(0, 0, W, H);

    // Sky/background
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0, '#0a0a1a');
    bg.addColorStop(1, '#060610');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grass
    ctx.fillStyle = '#0d2010';
    ctx.fillRect(0, 0, ROAD_LEFT, H);
    ctx.fillRect(ROAD_RIGHT, 0, W - ROAD_RIGHT, H);

    // Road
    const rd = ctx.createLinearGradient(ROAD_LEFT, 0, ROAD_RIGHT, 0);
    rd.addColorStop(0, '#1e1e2e');
    rd.addColorStop(0.5, '#252535');
    rd.addColorStop(1, '#1e1e2e');
    ctx.fillStyle = rd;
    ctx.fillRect(ROAD_LEFT, 0, ROAD_W, H);

    // Road edges
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(ROAD_LEFT, 0); ctx.lineTo(ROAD_LEFT, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ROAD_RIGHT, 0); ctx.lineTo(ROAD_RIGHT, H); ctx.stroke();
    ctx.shadowBlur = 0;

    // Lane dividers (dashed, scrolling)
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -s.roadOffset;
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    for (let l = 1; l < 3; l++) {
      const lx = ROAD_LEFT + l * LANE_W;
      ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    // Obstacles
    s.obstacles.forEach(ob => {
      // Car body
      ctx.shadowColor = ob.color; ctx.shadowBlur = 15;
      ctx.fillStyle = ob.color;
      ctx.beginPath(); ctx.roundRect(ob.x, ob.y, OBS_W, OBS_H, 6); ctx.fill();
      // Windshield
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.roundRect(ob.x+4, ob.y+6, OBS_W-8, 14, 3); ctx.fill();
      // Wheels
      ctx.fillStyle = '#1e1e2e';
      [[ob.x,ob.y+8],[ob.x+OBS_W-6,ob.y+8],[ob.x,ob.y+OBS_H-14],[ob.x+OBS_W-6,ob.y+OBS_H-14]].forEach(([wx,wy]) => {
        ctx.fillRect(wx, wy, 6, 10);
      });
      ctx.shadowBlur = 0;
    });

    // Player car
    if (!s.crashed) {
      const px = s.player.x, py = s.player.y;
      ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 20;
      // Body
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath(); ctx.roundRect(px, py, CAR_W, CAR_H, 6); ctx.fill();
      // Windshield
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath(); ctx.roundRect(px+4, py+8, CAR_W-8, 14, 3); ctx.fill();
      // Headlights
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 20; ctx.shadowColor = '#fff';
      ctx.fillRect(px+3, py+CAR_H-10, 8, 6);
      ctx.fillRect(px+CAR_W-11, py+CAR_H-10, 8, 6);
      // Wheels
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#1e1e2e';
      [[px, py+10],[px+CAR_W-6,py+10],[px,py+CAR_H-18],[px+CAR_W-6,py+CAR_H-18]].forEach(([wx,wy]) => {
        ctx.fillRect(wx, wy, 6, 10);
      });
      ctx.shadowBlur = 0;
    }

    // Particles
    s.particles = s.particles.filter(p => p.life > 0);
    s.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(p.x += p.vx, p.y += p.vy, 4 * p.life, 0, Math.PI*2); ctx.fill();
      p.life -= 0.03; p.vx *= 0.95; p.vy *= 0.95;
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  };

  const start = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    state.current = initState();
    setScore(0);
    setStatus('playing');
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const onDown = (e) => {
      if (['ArrowLeft','ArrowRight'].includes(e.key)) {
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

  // Touch swipe
  const swipeRef = useRef(null);
  const onTouchStart = (e) => { swipeRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (!swipeRef.current || !state.current) return;
    const dx = e.changedTouches[0].clientX - swipeRef.current;
    if (Math.abs(dx) < 20) return;
    const s = state.current;
    if (dx < 0 && s.player.lane > 0) { s.player.lane--; s.player.targetX = laneX(s.player.lane); }
    if (dx > 0 && s.player.lane < 2) { s.player.lane++; s.player.targetX = laneX(s.player.lane); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
        <span style={{ color: '#22d3ee' }}>SCORE: <strong style={{ fontSize: '1.1rem' }}>{score}</strong></span>
        <span style={{ color: '#94a3b8' }}>BEST: <strong>{best}</strong></span>
      </div>

      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(34,211,238,0.25)', boxShadow: '0 0 30px rgba(34,211,238,0.08)' }}>
        <canvas ref={canvasRef} width={W} height={H}
          style={{ display: 'block', width: '100%', maxWidth: W }}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />

        {status !== 'playing' && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(2,6,17,0.9)', flexDirection: 'column', gap: '0.8rem'
          }}>
            <div style={{ fontSize: '2.5rem' }}>{status === 'crashed' ? '💥' : '🚗'}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem',
              color: status === 'crashed' ? '#ef4444' : '#22d3ee' }}>
              {status === 'crashed' ? `CRASH! Score: ${score}` : 'CAR RACING'}
            </div>
            <button onClick={start} style={{
              padding: '0.4rem 1.4rem', borderRadius: '8px', fontFamily: 'var(--font-mono)',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem',
              background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.5)', color: '#22d3ee',
            }}>{status === 'crashed' ? '↺ RETRY' : '▶ START'}</button>
            <div style={{ fontSize: '0.65rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
              ← → Arrow keys to change lanes · Swipe on mobile
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarGame;
