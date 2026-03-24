import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Hero from '../Hero';
import Skills from '../Skills';
import Projects from '../Projects';
import Achievements from '../Achievements';
import GamesHub from '../GamesHub';
import Contact from '../Contact';
import Timeline from '../Timeline';

// --- Static Map Data (Outside Component) ---
const WORLD_W = 4000;
const WORLD_H = 3000;
const PLAYER_SPEED = 7;
const PLAYER_SIZE = 96;

// ─── Massive Pac-Man Arcade Grid (4000x3000) ───
// W = Wall (Solid Dark Blue with Neon Cyan Border)
// . = Empty space (Auto-filled with Pac-Dots)
//   = Empty space (No dots, tunnels/spawn areas)
// N = Ghost Box (No dots inside)

const CX = 2000, CY = 1500;

const PACMAN_GRID = [
  // 01234567890123456789
  "WWWWWWWWWWWWWWWWWWWW", // 00
  "W........WW........W", // 01 (Hero 1,1; Arcade 18,1)
  "W.WW.WWW.WW.WWW.WW.W", // 02
  "W..................W", // 03
  "W.WW.WW.WWWW.WW.WW.W", // 04
  "W....WW..WW..WW....W", // 05
  "WWWW.WWW WW WWW.WWWW", // 06
  "   W.W        W.W   ", // 07 (Tunnel row, Spawn at 10,7)
  "WWWW.W WNNNNW W.WWWW", // 08
  "W........WW........W", // 09
  "W.WW.WWW.WW.WWW.WW.W", // 10
  "W..W............W..W", // 11 (Achievements 9,11)
  "WW.W.WW.WWWW.WW.W.WW", // 12
  "W....WW..WW..WW....W", // 13 (Skills 1,13; Projects 18,13)
  "WWWWWWWWWWWWWWWWWWWW"  // 14
];

const MAZE_WALLS = [
  // World bounds (invisible collision)
  { id: 't-wall', type: 'wall', x: 0, y: -50, w: WORLD_W, h: 50 },
  { id: 'b-wall', type: 'wall', x: 0, y: WORLD_H, w: WORLD_W, h: 50 },
  { id: 'l-wall', type: 'wall', x: -50, y: 0, w: 50, h: WORLD_H },
  { id: 'r-wall', type: 'wall', x: WORLD_W, y: 0, w: 50, h: WORLD_H }
];

const INITIAL_DOTS = [];
const EMPTY_CELLS = [];

// Grid Compiler
for (let y = 0; y < PACMAN_GRID.length; y++) {
  let startX = -1;
  let inWall = false;

  for (let x = 0; x <= PACMAN_GRID[y].length; x++) {
    const c = (x < PACMAN_GRID[y].length) ? PACMAN_GRID[y][x] : ' ';

    if (c === '.') {
      const px = x * 200 + 100;
      const py = y * 200 + 100;
      INITIAL_DOTS.push({
        id: `dot-${x}-${y}`,
        x: px, // center of 200x200 cell
        y: py,
        alive: true,
        el: null
      });
      EMPTY_CELLS.push({ x: px, y: py });
    }

    if (c === 'W') {
      if (!inWall) {
        startX = x;
        inWall = true;
      }
    } else {
      if (inWall) {
        MAZE_WALLS.push({
          id: `w-${startX}-${y}`,
          type: 'wall',
          x: startX * 200,
          y: y * 200,
          w: (x - startX) * 200,
          h: 200,
          color: '#000000', // overwritten in rendering logic by isPacmanWall
          isPacmanWall: true
        });
        inWall = false;
      }
    }
  }
}

// Randomize the empty cells deterministically or once on file load
const shuffledCells = [...EMPTY_CELLS].sort(() => Math.random() - 0.5);

const getRandomPos = (index) => {
  if (index >= shuffledCells.length) return { x: CX, y: CY };
  const cell = shuffledCells[index];
  return { x: cell.x - 50, y: cell.y - 50 };
};

const ZONES = [
  ...MAZE_WALLS,
  { id: 'spawn', type: 'decor', x: CX - 50, y: CY - 50, w: 100, h: 100, label: 'ORIGIN POINT', color: '#1d4ed8' },

  { id: 'hero', type: 'interact', ...getRandomPos(0), w: 100, h: 100, label: 'Profile Core', prompt: 'Hack Mainframe', modal: 'hero', color: '#3b82f6', icon: '👤' },
  { id: 'skills', type: 'interact', ...getRandomPos(1), w: 100, h: 100, label: 'Data Library', prompt: 'Extract Skills', modal: 'skills', color: '#8b5cf6', icon: '📚' },
  { id: 'projects', type: 'interact', ...getRandomPos(2), w: 100, h: 100, label: 'Quest Array', prompt: 'Decrypt Repos', modal: 'projects', color: '#f59e0b', icon: '💻' },
  { id: 'achievements', type: 'interact', ...getRandomPos(3), w: 100, h: 100, label: 'Trophy Room', prompt: 'Claim Rewards', modal: 'achievements', color: '#ec4899', icon: '🏆' },
  { id: 'origin', type: 'interact', ...getRandomPos(4), w: 100, h: 100, label: 'Origin Story', prompt: 'Decrypt Lore', modal: 'origin', color: '#a855f7', icon: '🌌' },
  { id: 'arcade', type: 'interact', ...getRandomPos(5), w: 100, h: 100, label: 'Neon Arcade', prompt: 'Play Minigames', modal: 'arcade', color: '#14b8a6', icon: '🕹️' },
  { id: 'contact', type: 'interact', ...getRandomPos(6), w: 100, h: 100, label: 'Comms Relay', prompt: 'Establish Link', modal: 'contact', color: '#ef4444', icon: '📬' },
];


const checkCollision = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.y + rect1.h > rect2.y
  );
};
// --- End Static Data ---

const GameWorld = ({ onBackToMenu, variant = 'maze' }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [nearbyInteract, setNearbyInteract] = useState(null);
  const [showMonsters, setShowMonsters] = useState(false);
  const [kills, setKills] = useState(0);
  const [score, setScore] = useState(0);

  const dotsRef = useRef(INITIAL_DOTS.map(d => ({ ...d })));
  const dotsLayerRef = useRef(null);

  const visitedRef = useRef({});
  const trackerListRef = useRef(null);

  const playerPos = useRef({ x: 1975, y: 1475 });
  const keys = useRef({ w: false, a: false, s: false, d: false, enter: false, space: false });
  const worldRef = useRef(null);
  const playerRef = useRef(null);
  const minimapDotRef = useRef(null);
  const reqRef = useRef(null);

  // Combat properties
  const monstersRef = useRef([]);
  const monstersLayerRef = useRef(null);
  const isAttackingRef = useRef(false);
  const attackElRef = useRef(null);

  // Bullets & Minimap
  const bulletsRef = useRef([]);
  const bulletsLayerRef = useRef(null);
  const minimapMonstersLayerRef = useRef(null);
  const minimapFogRef = useRef(null);
  const facingDirRef = useRef('RIGHT');

  // Init Pac-Dots DOM
  useEffect(() => {
    if (dotsLayerRef.current) {
      dotsLayerRef.current.innerHTML = '';
      dotsRef.current.forEach(dot => {
        const div = document.createElement('div');
        div.className = 'pac-dot';
        div.style.left = `${dot.x}px`;
        div.style.top = `${dot.y}px`;
        dotsLayerRef.current.appendChild(div);
        dot.el = div;
      });
    }
  }, []);

  // Init/Teardown Monsters
  useEffect(() => {
    if (showMonsters) {
      const rgb = ['#ef4444', '#10b981', '#3b82f6'];
      const newMonsters = Array.from({ length: 3 }).map((_, i) => {
        const cell = shuffledCells[(i + 20) % shuffledCells.length];
        return {
          id: `rgb-${i}`,
          x: cell.x - 72,
          y: cell.y - 72,
          dx: (Math.random() < 0.5 ? -1 : 1) * 3,
          dy: (Math.random() < 0.5 ? -1 : 1) * 3,
          alive: true,
          hp: 2,
          color: rgb[i],
          el: null,
          mmEl: null
        };
      });
      monstersRef.current = newMonsters;

      if (monstersLayerRef.current) {
        monstersLayerRef.current.innerHTML = '';
        newMonsters.forEach(m => {
          const div = document.createElement('div');
          div.className = 'rgb-monster';
          div.innerHTML = '👻';
          div.style.color = m.color;
          div.style.textShadow = `0 0 30px ${m.color}`;
          monstersLayerRef.current.appendChild(div);
          m.el = div;
        });
      }

      if (minimapMonstersLayerRef.current) {
        minimapMonstersLayerRef.current.innerHTML = '';
        newMonsters.forEach(m => {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.width = '5px';
          div.style.height = '5px';
          div.style.background = '#ef4444';
          div.style.borderRadius = '50%';
          div.style.transform = 'translate(-50%, -50%)';
          div.style.boxShadow = `0 0 8px #ef4444`;
          div.style.zIndex = '30';
          minimapMonstersLayerRef.current.appendChild(div);
          m.mmEl = div;
        });
      }
    } else {
      monstersRef.current = [];
      if (monstersLayerRef.current) monstersLayerRef.current.innerHTML = '';
      if (minimapMonstersLayerRef.current) minimapMonstersLayerRef.current.innerHTML = '';
    }
  }, [showMonsters]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright', 'enter', ' '].includes(k)) {
        if (k === 'w' || k === 'arrowup') { keys.current.w = true; facingDirRef.current = 'UP'; }
        if (k === 'a' || k === 'arrowleft') { keys.current.a = true; facingDirRef.current = 'LEFT'; }
        if (k === 's' || k === 'arrowdown') { keys.current.s = true; facingDirRef.current = 'DOWN'; }
        if (k === 'd' || k === 'arrowright') { keys.current.d = true; facingDirRef.current = 'RIGHT'; }
        if (k === 'enter') keys.current.enter = true;

        // Shoot Bullet (Pac-Man Style Projectile)
        if (k === ' ' && !isAttackingRef.current) {
          isAttackingRef.current = true;

          let bx = 0, by = 0;
          const speed = 15;
          if (facingDirRef.current === 'UP') by = -speed;
          else if (facingDirRef.current === 'DOWN') by = speed;
          else if (facingDirRef.current === 'LEFT') bx = -speed;
          else bx = speed;

          const newBullet = {
            id: Date.now() + Math.random(),
            x: playerPos.current.x + PLAYER_SIZE / 2 - 6,
            y: playerPos.current.y + PLAYER_SIZE / 2 - 6,
            dx: bx, dy: by,
            w: 12, h: 12,
            alive: true,
            el: null
          };

          if (bulletsLayerRef.current) {
            const div = document.createElement('div');
            div.className = 'player-bullet';
            div.innerHTML = '⚡';
            div.style.transform = `translate(${newBullet.x}px, ${newBullet.y}px)`;
            bulletsLayerRef.current.appendChild(div);
            newBullet.el = div;
          }

          bulletsRef.current.push(newBullet);
          setTimeout(() => { isAttackingRef.current = false; }, 300); // cooldown
        }
      }

      if ((k === 'escape' || k === 'e') && activeModal) {
        setActiveModal(null); // simple close
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.current.w = false;
      if (k === 'a' || k === 'arrowleft') keys.current.a = false;
      if (k === 's' || k === 'arrowdown') keys.current.s = false;
      if (k === 'd' || k === 'arrowright') keys.current.d = false;
      if (k === 'enter') keys.current.enter = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeModal]);

  // Main game loop
  const update = () => {
    // If a modal is open, freeze player
    if (activeModal) {
      reqRef.current = requestAnimationFrame(update);
      return;
    }

    let dx = 0; let dy = 0;
    if (keys.current.w) dy -= PLAYER_SPEED;
    if (keys.current.s) dy += PLAYER_SPEED;
    if (keys.current.a) dx -= PLAYER_SPEED;
    if (keys.current.d) dx += PLAYER_SPEED;

    // Normalize diagonal movement speed
    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx = (dx / length) * PLAYER_SPEED;
      dy = (dy / length) * PLAYER_SPEED;
    }

    // Attempt Move
    let newX = playerPos.current.x + dx;
    let newY = playerPos.current.y + dy;

    // Collision Detection (Check against walls and interactables)
    let canMoveX = true;
    let canMoveY = true;
    let closestInteract = null;

    const playerRectX = { x: newX, y: playerPos.current.y, w: PLAYER_SIZE, h: PLAYER_SIZE };
    const playerRectY = { x: playerPos.current.x, y: newY, w: PLAYER_SIZE, h: PLAYER_SIZE };

    // Interaction proximity bounding box (larger than player)
    const interactionRect = {
      x: playerPos.current.x - 20, y: playerPos.current.y - 20,
      w: PLAYER_SIZE + 40, h: PLAYER_SIZE + 40
    };

    ZONES.forEach(z => {
      if (z.type === 'wall' || z.type === 'interact') {
        if (checkCollision(playerRectX, z)) canMoveX = false;
        if (checkCollision(playerRectY, z)) canMoveY = false;
      }

      // Check if near an interactable zone
      if (z.type === 'interact' && checkCollision(interactionRect, z)) {
        closestInteract = z;
      }
    });

    if (canMoveX) playerPos.current.x = newX;
    if (canMoveY) playerPos.current.y = newY;

    if (closestInteract) {
      if (nearbyInteract?.id !== closestInteract.id) setNearbyInteract(closestInteract);
      if (keys.current.enter && !activeModal) {
        setActiveModal(closestInteract.modal);
        visitedRef.current[closestInteract.id] = true;
        keys.current.enter = false;
      }
    } else {
      if (nearbyInteract) setNearbyInteract(null);
    }

    // V4 Tracker: Persist items as DONE instead of removing them
    try {
      if (Math.random() < 0.1 && !activeModal && trackerListRef.current) {
        let trackerHTML = '';
        const interactZones = ZONES.filter(z => z.type === 'interact');

        interactZones.forEach(z => {
          if (visitedRef.current[z.id]) {
            trackerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem; opacity: 0.5;">
              <span style="color:#10b981; font-weight:800; text-decoration: line-through;">■ ${z.label}</span>
              <span style="font-family: monospace; letter-spacing: 0.05em; color: #10b981;">[DONE]</span>
            </div>`;
          } else {
            const dx = z.x - playerPos.current.x;
            const dy = z.y - playerPos.current.y;

            let dirY = '', dirX = '';
            if (dy < -300) dirY = 'UP';
            else if (dy > 300) dirY = 'DOWN';
            if (dx < -300) dirX = 'LEFT';
            else if (dx > 300) dirX = 'RIGHT';

            let dirStr = [dirY, dirX].filter(Boolean).join('-');
            if (dirStr === '') dirStr = 'HERE';

            trackerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem;">
              <span style="color:${z.color}; font-weight:800; text-shadow:0 0 5px ${z.color}80;">■ ${z.label}</span>
              <span style="font-family: monospace; letter-spacing: 0.05em; color: #a855f7;">[${dirStr}]</span>
            </div>`;
          }
        });

        if (trackerListRef.current.innerHTML !== trackerHTML) {
          trackerListRef.current.innerHTML = trackerHTML;
        }
      }
    } catch (e) {
      console.warn("Quest Log skipped this frame.");
    }

    // ─── DOT COLLECTION ───
    const eatRadius = PLAYER_SIZE / 2;
    let dotsEatenThisFrame = 0;
    const px = playerPos.current.x + PLAYER_SIZE / 2;
    const py = playerPos.current.y + PLAYER_SIZE / 2;

    dotsRef.current.forEach(dot => {
      if (dot.alive) {
        const dxDist = dot.x - px;
        const dyDist = dot.y - py;
        if (dxDist * dxDist + dyDist * dyDist < (eatRadius + 15) * (eatRadius + 15)) {
          dot.alive = false;
          if (dot.el) dot.el.style.display = 'none';
          dotsEatenThisFrame++;
        }
      }
    });

    if (dotsEatenThisFrame > 0) {
      setScore(s => s + (dotsEatenThisFrame * 10));
    }

    // ─── MONSTER AI & BULLETS ───
    if (bulletsRef.current.length > 0) {
      bulletsRef.current.forEach(b => {
        if (!b.alive) return;
        b.x += b.dx;
        b.y += b.dy;

        if (b.x < 0 || b.x > WORLD_W || b.y < 0 || b.y > WORLD_H) {
          b.alive = false;
          if (b.el) b.el.style.display = 'none';
          return;
        }

        const bRect = { x: b.x, y: b.y, w: b.w, h: b.h };

        // Wall collision
        for (let i = 0; i < MAZE_WALLS.length; i++) {
          if (checkCollision(bRect, MAZE_WALLS[i])) {
            b.alive = false;
            if (b.el) b.el.style.display = 'none';
            break;
          }
        }

        if (b.el) {
          b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
        }
      });

      if (Math.random() < 0.05) {
        bulletsRef.current = bulletsRef.current.filter(b => b.alive);
      }
    }

    if (showMonsters && monstersRef.current.length > 0) {
      const M_SIZE = 144;
      const pRect = { x: playerPos.current.x, y: playerPos.current.y, w: PLAYER_SIZE, h: PLAYER_SIZE };

      monstersRef.current.forEach(m => {
        if (!m.alive) return;

        let nextX = m.x + m.dx;
        let nextY = m.y + m.dy;

        if (nextX <= 0 || nextX >= WORLD_W - M_SIZE) { m.dx *= -1; nextX = m.x; }
        else {
          for (let i = 0; i < MAZE_WALLS.length; i++) {
            if (checkCollision({ x: nextX, y: m.y, w: M_SIZE, h: M_SIZE }, MAZE_WALLS[i])) {
              m.dx *= -1; nextX = m.x; break;
            }
          }
        }

        if (nextY <= 0 || nextY >= WORLD_H - M_SIZE) { m.dy *= -1; nextY = m.y; }
        else {
          for (let i = 0; i < MAZE_WALLS.length; i++) {
            if (checkCollision({ x: m.x, y: nextY, w: M_SIZE, h: M_SIZE }, MAZE_WALLS[i])) {
              m.dy *= -1; nextY = m.y; break;
            }
          }
        }

        m.x = nextX;
        m.y = nextY;
        const currentMRect = { x: m.x, y: m.y, w: M_SIZE, h: M_SIZE };

        // Catch player (Death mechanic)
        if (checkCollision(currentMRect, pRect)) {
          playerPos.current = { x: CX, y: CY }; // respawn
          setScore(s => Math.max(0, s - 500)); // penalty
        }

        // Bullet hit monster
        bulletsRef.current.forEach(b => {
          if (b.alive && checkCollision({ x: b.x, y: b.y, w: b.w, h: b.h }, currentMRect)) {
            b.alive = false;
            if (b.el) b.el.style.display = 'none';

            m.hp -= 1;
            if (m.hp > 0) {
              if (m.el) {
                m.el.style.filter = "brightness(3) contrast(2) drop-shadow(0 0 40px #fff)";
                setTimeout(() => { if (m.el) m.el.style.filter = "none"; }, 150);
              }
              if (monstersLayerRef.current) {
                const skull = document.createElement('div');
                skull.innerHTML = '💀';
                skull.style.position = 'absolute';
                skull.style.fontSize = '80px';
                skull.style.transform = `translate(${m.x + 32}px, ${m.y + 32}px)`;
                skull.style.transition = 'opacity 2s ease-out, transform 2s ease-out';
                skull.style.zIndex = '45';
                skull.style.filter = 'drop-shadow(0 0 10px #ef4444)';
                monstersLayerRef.current.appendChild(skull);

                void skull.offsetWidth;

                skull.style.opacity = '0';
                skull.style.transform = `translate(${m.x + 32}px, ${m.y - 100}px)`;
                setTimeout(() => { if (skull.parentNode) skull.parentNode.removeChild(skull); }, 2000);
              }

              setKills(k => k + 1);
              const spawnCell = shuffledCells[Math.floor(Math.random() * shuffledCells.length)];
              m.x = spawnCell.x - 72;
              m.y = spawnCell.y - 72;
              m.hp = 2;

              if (m.el) {
                m.el.style.filter = "none";
                m.el.style.opacity = '1';
                m.el.style.transition = 'transform 0.3s ease-out';
                m.el.style.transform = `translate(${m.x}px, ${m.y}px) scale(1.2)`;
              }
              setScore(s => s + 500);
            }
          }
        });

        if (m.alive && m.el) {
          m.el.style.transform = `translate(${m.x}px, ${m.y}px) ${m.dx < 0 ? 'scaleX(-1)' : 'scaleX(1)'}`;
          if (m.mmEl) {
            m.mmEl.style.left = `${(m.x / WORLD_W) * 100}%`;
            m.mmEl.style.top = `${(m.y / WORLD_H) * 100}%`;
          }
        }
      });
    }

    // Render Camera & Player via direct DOM manipulation
    if (worldRef.current && playerRef.current) {
      const ww = window.innerWidth;
      const wh = window.innerHeight;

      let camX = playerPos.current.x + (PLAYER_SIZE / 2) - (ww / 2);
      let camY = playerPos.current.y + (PLAYER_SIZE / 2) - (wh / 2);

      // Keep camera rigid to bounds (no void)
      camX = Math.max(0, Math.min(camX, WORLD_W - ww));
      camY = Math.max(0, Math.min(camY, WORLD_H - wh));

      worldRef.current.style.transform = `translate(${-camX}px, ${-camY}px)`;
      playerRef.current.style.transform = `translate(${playerPos.current.x}px, ${playerPos.current.y}px)`;

      if (minimapDotRef.current) {
        minimapDotRef.current.style.left = `${(playerPos.current.x / WORLD_W) * 100}%`;
        minimapDotRef.current.style.top = `${(playerPos.current.y / WORLD_H) * 100}%`;
      }

      if (minimapFogRef.current) {
        const px = (playerPos.current.x / WORLD_W) * 100;
        const py = (playerPos.current.y / WORLD_H) * 100;
        minimapFogRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, transparent 0%, transparent 18%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.95) 50%)`;
      }

      // simple rotation based on movement
      if (dx > 0) playerRef.current.firstChild.style.transform = 'scaleX(1)';
      if (dx < 0) playerRef.current.firstChild.style.transform = 'scaleX(-1)';
    }

    reqRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    reqRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(reqRef.current);
  }, [activeModal, nearbyInteract]);


  // D-Pad Mobile Controls
  const handleTouchStart = (dir) => { keys.current[dir] = true; };
  const handleTouchEnd = (dir) => { keys.current[dir] = false; };

  return (
    <div className="game-container">
      {/* ─── HUD OVERLAY ─── */}
      <div className="game-hud">
        <div className="hud-topline">
          <div className="hud-left-panel">
            <div className="hud-logo">Kriti<span>.dev</span> <span className="rpg-tag">CYBER MAZE</span></div>
            <button className="btn-exit" onClick={onBackToMenu}>← EXIT TO PORTAL</button>
          </div>
          <div className="hud-hint">WASD Move · SPACE Shoot · ENTER Interact</div>

          <div className="hud-right-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem', pointerEvents: 'none' }}>
            <div className="hud-tracker" style={{ margin: 0 }}>
              <div className="tracker-title">MULTICAST SENSORS</div>
              <div className="tracker-list" ref={trackerListRef}>
                <div style={{ color: '#8b5cf6' }}>Initializing Sweep...</div>
              </div>
            </div>

            <div className="hud-score-inline">SCORE <span>{score.toString().padStart(5, '0')}</span></div>

            {/* On/Off Toggle Switch */}
            <div className="monster-toggle-row" style={{ pointerEvents: 'auto' }} onClick={(e) => { e.currentTarget.blur(); setShowMonsters(!showMonsters); }}>
              <span className="monster-toggle-label">{showMonsters ? '😈 GHOSTS ON' : '👻 GHOSTS OFF'}</span>
              <div className={`toggle-switch ${showMonsters ? 'on' : ''}`}>
                <div className="toggle-pill" />
              </div>
            </div>
            {showMonsters && (
              <div className="hud-score-inline" style={{ color: '#ef4444', textShadow: '0 0 8px #ef444480' }}>
                💀 SLAIN <span style={{ color: '#fff' }}>{kills}</span>
              </div>
            )}
          </div>
        </div>

        {/* MINIMAP */}
        <div className="minimap-container">
          <div className="minimap-bounds" style={{ maskImage: 'none', WebkitMaskImage: 'none' }}>
            {ZONES.map(z => {
              if (z.type === 'wall' && !z.color && !z.isPacmanWall) return null;

              if (z.type === 'wall') {
                return <div key={'mm' + z.id} style={{
                  position: 'absolute',
                  left: `${(z.x / WORLD_W) * 100}%`, top: `${(z.y / WORLD_H) * 100}%`,
                  width: `${(z.w / WORLD_W) * 100}%`, height: `${(z.h / WORLD_H) * 100}%`,
                  background: 'transparent',
                  border: `1px solid ${z.isPacmanWall ? 'rgba(34,211,238,0.5)' : (z.color || 'rgba(255,255,255,0.3)')}`,
                  boxShadow: `0 0 5px ${z.isPacmanWall ? 'rgba(34,211,238,0.2)' : (z.color + '40')}`,
                  borderRadius: '1px'
                }} />
              }

              if (z.type === 'interact') {
                return (
                  <div key={'mmi' + z.id} style={{
                    position: 'absolute',
                    left: `${(z.x / WORLD_W) * 100}%`, top: `${(z.y / WORLD_H) * 100}%`,
                    fontSize: '12px',
                    transform: 'translate(-50%, -50%)',
                    filter: `drop-shadow(0 0 5px ${z.color})`,
                    zIndex: 20
                  }}>{z.icon}</div>
                )
              }
              return null;
            })}
            {/* Fog overlay: dims all but player area */}
            <div ref={minimapFogRef} style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10, pointerEvents: 'none', borderRadius: '14px'
            }} />

            {/* Icons always on top of fog */}
            {ZONES.filter(z => z.type === 'interact').map(z => (
              <div key={'mmi' + z.id} style={{
                position: 'absolute',
                left: `${(z.x / WORLD_W) * 100}%`, top: `${(z.y / WORLD_H) * 100}%`,
                fontSize: '11px',
                transform: 'translate(-50%, -50%)',
                filter: `drop-shadow(0 0 6px ${z.color})`,
                zIndex: 25, pointerEvents: 'none'
              }}>{z.icon}</div>
            ))}
            <div className="minimap-dot" ref={minimapDotRef} style={{ zIndex: 30 }} />
            <div className="minimap-monsters-layer" ref={minimapMonstersLayerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 28 }} />
          </div>
        </div>

        {nearbyInteract && !activeModal && (
          <motion.div
            className="interact-prompt"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={nearbyInteract.id}
          >
            <div className="prompt-icon">{nearbyInteract.icon}</div>
            <div className="prompt-text">
              <span className="prompt-label">{nearbyInteract.label}</span>
              <span className="prompt-action">Press [ENTER/SPACE] to {nearbyInteract.prompt}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── WORLD RENDERER ─── */}
      <div className="world-camera">
        <div className="world-map" ref={worldRef} style={{ width: WORLD_W, height: WORLD_H }}>

          {/* Render Map Grid/Background */}
          <div className="world-bg-grid" />

          {/* Dots Layer */}
          <div className="dots-layer" ref={dotsLayerRef} />

          {/* Bullets Layer */}
          <div className="bullets-layer" ref={bulletsLayerRef} />

          {/* Monsters Layer (Rendered via traditional DOM loop for 60fps) */}
          <div className="monsters-layer" ref={monstersLayerRef} />

          {/* Render Zones */}
          {ZONES.map(z => {
            if (z.type === 'wall' && !z.color) return null; // invisible bounds
            return (
              <div
                key={z.id}
                className={`zone-obj type-${z.type}`}
                style={{
                  left: z.x, top: z.y, width: z.w, height: z.h,
                  background: z.isPacmanWall ? '#000000' : (z.color || 'transparent'),
                  borderColor: z.isPacmanWall ? '#1d4ed8' : (z.color ? `${z.color}80` : 'var(--border)'),
                  boxShadow: z.isPacmanWall ? '0 0 10px #22d3ee, inset 0 0 15px #1d4ed8' : 'inset 0 0 20px rgba(0,0,0,0.5)',
                  borderWidth: z.isPacmanWall ? '4px' : '2px',
                }}
              >
                {z.icon && <div className="zone-icon">{z.icon}</div>}
                {z.label && z.type === 'interact' && <div className="zone-label" style={{ color: z.color }}>{z.label}</div>}
              </div>
            );
          })}

          {/* Render Player */}
          <div className="player-sprite" ref={playerRef} style={{ width: PLAYER_SIZE, height: PLAYER_SIZE }}>
            <div className="player-body">
              <div className="player-glow" />
            </div>
            <div className="player-shadow" />
          </div>

        </div>
      </div>

      {/* ─── MOBILE CONTROLS ─── */}
      <div className="mobile-dpad">
        <div className="dpad-row">
          <button onTouchStart={() => handleTouchStart('w')} onTouchEnd={() => handleTouchEnd('w')} onMouseDown={() => handleTouchStart('w')} onMouseUp={() => handleTouchEnd('w')}>↑</button>
        </div>
        <div className="dpad-row">
          <button onTouchStart={() => handleTouchStart('a')} onTouchEnd={() => handleTouchEnd('a')} onMouseDown={() => handleTouchStart('a')} onMouseUp={() => handleTouchEnd('a')}>←</button>
          <button className="dpad-action" onTouchStart={() => handleTouchStart('enter')} onTouchEnd={() => handleTouchEnd('enter')} onMouseDown={() => handleTouchStart('enter')} onMouseUp={() => handleTouchEnd('enter')}>A</button>
          <button onTouchStart={() => handleTouchStart('d')} onTouchEnd={() => handleTouchEnd('d')} onMouseDown={() => handleTouchStart('d')} onMouseUp={() => handleTouchEnd('d')}>→</button>
        </div>
        <div className="dpad-row">
          <button onTouchStart={() => handleTouchStart('s')} onTouchEnd={() => handleTouchEnd('s')} onMouseDown={() => handleTouchStart('s')} onMouseUp={() => handleTouchEnd('s')}>↓</button>
        </div>
      </div>

      {/* ─── MODAL OVERLAYS ─── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="game-modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="game-modal-content custom-scrollbar">
              <button className="game-modal-close" onClick={() => setActiveModal(null)}>CLOSE [ESC]</button>

              {/* Render specific component based on activeModal string */}
              <div className="game-modal-inner">
                {activeModal === 'origin' && <Timeline />}
                {activeModal === 'hero' && <Hero />}
                {activeModal === 'skills' && <Skills />}
                {activeModal === 'projects' && <Projects />}
                {activeModal === 'achievements' && <Achievements />}
                {activeModal === 'arcade' && <GamesHub onClose={() => setActiveModal(null)} />}
                {activeModal === 'contact' && <Contact />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── STYLES ─── */}
      <style>{`
        .game-container {
          position: fixed; inset: 0; background: #000000;
          overflow: hidden; touch-action: none;
        }
        .world-camera {
          position: absolute; inset: 0; pointer-events: none;
          transform: scale(0.75); transform-origin: 0 0;
          width: 133.33%; height: 133.33%;
        }
        .world-map {
          position: absolute; left: 0; top: 0;
          will-change: transform; pointer-events: auto;
          background-color: #000000;
        }
        
        .zone-obj {
          position: absolute; border: 2px solid; border-radius: 12px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03); backdrop-filter: blur(4px);
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }
        .type-interact {
          border: none !important;
          background: transparent !important;
          backdrop-filter: none !important;
          box-shadow: none !important;
          animation: core-float 3.5s ease-in-out infinite;
        }
        .type-interact:hover { filter: brightness(1.5); }
        
        .zone-icon { font-size: 5rem; margin-bottom: 0.5rem; filter: drop-shadow(0 0 20px currentcolor); }
        .zone-label { font-family: var(--font-mono); font-weight: 900; font-size: 1.4rem; letter-spacing: 0.1em; text-transform: uppercase; text-shadow: 0 0 15px currentcolor; white-space: nowrap; }
        
        @keyframes core-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        
        /* Player Sprite */
        .player-sprite {
          position: absolute; left: 0; top: 0; z-index: 100;
          will-change: transform; pointer-events: none;
          display: flex; align-items: flex-end; justify-content: center;
        }
        
        /* Monsters & Combat UI */
        .hud-score-inline {
          font-family: var(--font-mono); font-size: 1.5rem; color: #fde047;
          font-weight: 900; letter-spacing: 0.15em; pointer-events: none;
          text-shadow: 0 0 10px #f59e0b; text-align: right;
        }
        .hud-score-inline span { color: #fff; margin-left: 0.4rem; }
        .hud-center-score { display: none; }
        .hud-score { display: none; }

        /* Monster Toggle Switch */
        .monster-toggle-row {
          display: flex; align-items: center; gap: 0.8rem;
          cursor: pointer; pointer-events: auto;
          user-select: none;
        }
        .monster-toggle-label {
          font-family: var(--font-mono); font-size: 1.5rem; font-weight: 900;
          letter-spacing: 0.05em; color: #94a3b8;
          transition: color 0.3s; line-height: 1;
        }
        .monster-toggle-row:has(.toggle-switch.on) .monster-toggle-label { color: #ef4444; }
        .ghost-kill-count {
          font-family: var(--font-mono); font-size: 1.5rem; font-weight: 900;
          color: #ef4444; letter-spacing: 0.05em; line-height: 1;
          text-shadow: 0 0 8px #ef444480;
        }
        .toggle-switch {
          width: 44px; height: 24px; border-radius: 12px;
          background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.2);
          position: relative; transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
        }
        .toggle-switch.on {
          background: rgba(239,68,68,0.25); border-color: #ef4444;
          box-shadow: 0 0 12px rgba(239,68,68,0.5), inset 0 2px 4px rgba(0,0,0,0.4);
        }
        .toggle-pill {
          position: absolute; top: 3px; left: 3px;
          width: 16px; height: 16px; border-radius: 50%;
          background: rgba(255,255,255,0.4);
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .toggle-switch.on .toggle-pill {
          transform: translateX(20px);
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
        }

        /* Hint at bottom-left */
        .hud-hint {
          position: fixed; bottom: 2rem; left: 2rem; z-index: 300;
          display: inline-block;
          background: rgba(0,0,0,0.6); border: 1px solid var(--border);
          padding: 0.4rem 0.8rem; border-radius: 8px; font-family: var(--font-mono);
          font-size: 0.7rem; color: var(--text-secondary); backdrop-filter: blur(4px);
          pointer-events: none;
        }
        .dots-layer {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
        }
        .pac-dot {
          position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px;
          background: #fde047; border-radius: 50%;
          box-shadow: 0 0 10px #f59e0b; transition: opacity 0.1s;
        }
        .bullets-layer { position: absolute; inset: 0; z-index: 60; pointer-events: none; }
        .player-bullet { 
          position: absolute; font-size: 40px; transition: none; 
          will-change: transform; filter: drop-shadow(0 0 15px #fde047) drop-shadow(0 0 5px #f59e0b); 
        }
        .btn-toggle-monsters {
          background: rgba(168,85,247,0.1); color: #a855f7;
          border: 1px solid #a855f7; padding: 0.5rem 1rem;
          border-radius: 4px; font-family: var(--font-mono); font-weight: bold;
          cursor: pointer; transition: 0.2s; margin-left: 1rem;
          box-shadow: 0 0 10px rgba(168,85,247,0.2);
        }
        .btn-toggle-monsters:hover { background: #a855f7; color: #000; box-shadow: 0 0 20px #a855f7; }
        .hud-kills {
          display: inline-block; margin-left: 1rem; color: #ef4444; font-size: 1.2rem;
          font-family: var(--font-mono); font-weight: 900; padding: 0.4rem 1rem;
          background: rgba(239,68,68,0.1); border: 1px inset #ef4444; border-radius: 4px;
          text-shadow: 0 0 10px #ef4444;
        }
        .monsters-layer {
          position: absolute; inset: 0; z-index: 50; pointer-events: none;
        }
        .monster-entity {
          position: absolute; left: 0; top: 0; width: 40px; height: 40px;
          font-size: 36px; display: flex; align-items: center; justify-content: center;
          transition: opacity 0.3s ease-out; will-change: transform;
          filter: drop-shadow(0 0 10px rgba(255,0,0,0.8));
        }
        .player-attack-slash {
          position: absolute; top: 50%; left: 50%;
          width: 140px; height: 140px;
          background: radial-gradient(circle, transparent 40%, rgba(255,255,255,0.9) 50%, rgba(34,211,238,0.9) 60%, transparent 70%);
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 0; border-radius: 50%;
          box-shadow: 0 0 30px #22d3ee;
          transition: opacity 0.1s, transform 0.2s cubic-bezier(0.1, 2, 0.5, 1);
        }
        .player-body {
          width: 64px; height: 80px; background: var(--neon-cyan);
          border-radius: 32px 32px 16px 16px; position: relative; z-index: 2;
          box-shadow: 0 0 30px var(--neon-cyan);
          border: 3px solid #fff;
        }
        /* character eye */
        .player-body::after {
          content: ''; position: absolute; right: 12px; top: 20px;
          width: 16px; height: 16px; background: #fff; border-radius: 50%;
          box-shadow: 0 0 12px #fff;
        }
        .player-glow {
          position: absolute; inset: -20px; background: var(--neon-cyan);
          border-radius: 50%; filter: blur(20px); opacity: 0.4; z-index: -1;
        }
        .player-shadow {
          position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%);
          width: 48px; height: 16px; background: rgba(0,0,0,0.6);
          filter: blur(4px); border-radius: 50%; z-index: 1;
        }

        /* Boss Button */
        .btn-boss-summon {
          background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px);
          border: 2px solid #ef4444; border-radius: 12px;
          padding: 0.8rem 1.2rem; display: flex; align-items: center; gap: 0.8rem;
          color: #ef4444; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.3), inset 0 0 10px rgba(239, 68, 68, 0.2);
          pointer-events: auto; outline: none;
        }
        .btn-boss-summon:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 5px 25px rgba(239, 68, 68, 0.5), inset 0 0 15px rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.1);
        }
        .btn-boss-summon.active {
          border-color: #10b981; color: #10b981;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.3), inset 0 0 10px rgba(16, 185, 129, 0.2);
        }
        .btn-boss-summon.active:hover {
          box-shadow: 0 5px 25px rgba(16, 185, 129, 0.5), inset 0 0 15px rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.1);
        }
        .btn-boss-summon .icon { font-size: 1.4rem; }
        .btn-boss-summon .text { 
           font-family: var(--font-mono); font-weight: 800; font-size: 0.8rem; letter-spacing: 0.1em;
        }

        /* HUD */
        .game-hud {
          position: absolute; inset: 0; z-index: 200; pointer-events: none;
          display: flex; flex-direction: column; justify-content: space-between; padding: 2rem;
        }
        .hud-topline { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; pointer-events: auto; }
        .hud-logo { font-size: 1.5rem; font-weight: 900; color: #fff; letter-spacing: -0.05em; }
        .hud-logo span { color: var(--neon-purple); }
        .rpg-tag { 
          font-size: 0.6rem; vertical-align: top; margin-left: 0.2rem;
          background: var(--neon-cyan); color: #000; padding: 0.1rem 0.4rem; border-radius: 4px; 
          letter-spacing: 0.1em; font-family: var(--font-mono); font-weight: 800;
        }
        .hud-hint {
          display: inline-block; margin-top: 0.5rem;
          background: rgba(0,0,0,0.6); border: 1px solid var(--border);
          padding: 0.4rem 0.8rem; border-radius: 8px; font-family: var(--font-mono);
          font-size: 0.75rem; color: var(--text-secondary); backdrop-filter: blur(4px);
        }
        .btn-exit {
          display: block; margin-top: 0.8rem;
          background: rgba(244,114,182,0.1); border: 1px solid rgba(244,114,182,0.4);
          color: #f472b6; padding: 0.4rem 0.8rem; border-radius: 6px;
          font-family: var(--font-mono); font-weight: 700; font-size: 0.7rem;
          cursor: pointer; transition: 0.2s;
        }
        .btn-exit:hover { background: #f472b6; color: #000; }

        /* Quest Tracker */
        .hud-tracker {
          background: rgba(4, 9, 20, 0.85); border: 1px solid var(--neon-cyan);
          padding: 1rem 1.2rem; border-radius: 12px; backdrop-filter: blur(12px);
          width: 300px; max-width: 90vw; flex-shrink: 0; box-shadow: 0 0 20px rgba(34,211,238,0.15);
        }
        .tracker-title { 
          font-size: 0.75rem; color: var(--neon-cyan); font-family: var(--font-mono); 
          font-weight: 800; letter-spacing: 0.15em; margin-bottom: 0.8rem;
          text-align: center; border-bottom: 1px solid rgba(34,211,238,0.3); padding-bottom: 0.5rem;
        }
        .tracker-list { font-size: 0.85rem; font-weight: 600; }

        /* Minimap Radar Design */
        .minimap-container {
          position: fixed !important; right: 2rem !important; bottom: 2rem !important;
          width: 280px !important; height: 210px !important;
          z-index: 8000 !important;
          background-color: #020611;
          background-image: 
            radial-gradient(circle at center, rgba(34, 211, 238, 0.15) 0%, transparent 60%),
            repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(34, 211, 238, 0.08) 20px),
            repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(34, 211, 238, 0.08) 20px);
          background-size: 100% 100%, 20px 20px, 20px 20px;
          border: 2px solid var(--neon-cyan); border-radius: 16px; overflow: hidden;
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 20px rgba(0,0,0,0.8); 
          pointer-events: auto;
        }
        .minimap-bounds { position: relative; width: 100%; height: 100%; }
        .minimap-dot {
          position: absolute; width: 6px; height: 6px; background: #fff;
          border-radius: 50%; box-shadow: 0 0 5px #fff;
          transform: translate(-3px, -3px); transition: left 0.1s linear, top 0.1s linear; z-index: 100;
        }

        /* Interact Prompt Card */
        .interact-prompt {
          align-self: center; margin-bottom: 2rem; pointer-events: auto;
          background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.4);
          padding: 1rem 1.5rem; border-radius: 16px; backdrop-filter: blur(8px);
          display: flex; align-items: center; gap: 1rem;
          box-shadow: 0 0 30px rgba(168,85,247,0.2); cursor: pointer;
        }
        .interact-prompt:hover { background: rgba(168,85,247,0.25); }
        .prompt-icon { font-size: 2rem; }
        .prompt-text { display: flex; flex-direction: column; }
        .prompt-label { font-size: 1.2rem; font-weight: 800; color: #fff; }
        .prompt-action { font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-cyan); margin-top: 0.2rem; }

        /* Modals */
        .game-modal-backdrop {
          position: absolute; inset: 0; z-index: 1000; pointer-events: auto;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center; padding: 2rem;
        }
        .game-modal-content {
          background: #0b0f19; border: 1px solid var(--neon-purple); border-radius: 20px;
          width: 100%; max-width: 1200px; max-height: 90vh; overflow-y: auto;
          position: relative; box-shadow: 0 0 50px rgba(168,85,247,0.2);
        }
        .game-modal-close {
          position: sticky; top: 1rem; float: right; margin-right: 1rem; z-index: 50;
          background: rgba(244,114,182,0.1); border: 1px solid rgba(244,114,182,0.4);
          color: #f472b6; padding: 0.5rem 1rem; border-radius: 8px;
          font-family: var(--font-mono); font-weight: 700; font-size: 0.8rem;
          cursor: pointer; transition: 0.2s;
        }
        .game-modal-close:hover { background: #f472b6; color: #000; }
        
        .game-modal-inner { padding: 3rem 1rem 1rem 1rem; }
        
        /* Reset conflicting component margins for modal viewing */
        .game-modal-inner > section { min-height: auto; padding: 2rem 0; }

        /* RGB Giant Monsters */
        .rgb-monster {
          position: absolute; width: 144px; height: 144px; font-size: 130px;
          display: flex; align-items: center; justify-content: center;
          will-change: transform; transition: opacity 0.5s, filter 0.2s;
          pointer-events: none; z-index: 50; line-height: 144px;
        }

        /* Mobile Controls */
        .mobile-dpad {
          position: absolute; bottom: 2rem; right: 2rem; z-index: 500;
          display: none; flex-direction: column; gap: 0.5rem; align-items: center; pointer-events: auto;
        }
        .dpad-row { display: flex; gap: 0.5rem; }
        .mobile-dpad button {
          width: 50px; height: 50px; border-radius: 12px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          color: #fff; font-size: 1.2rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px); touch-action: manipulation; -webkit-tap-highlight-color: transparent;
        }
        .mobile-dpad button:active { background: rgba(255,255,255,0.3); transform: scale(0.95); }
        .dpad-action { background: rgba(34,211,238,0.15) !important; border-color: rgba(34,211,238,0.4) !important; color: var(--neon-cyan) !important; margin: 0 0.5rem; }

        @media (max-width: 768px) {
          .mobile-dpad { display: flex; bottom: 2rem; right: 1.5rem; transform: scale(0.9); z-index: 1000; }
          .hud-hint { display: none; }
          .hud-logo { display: none; }
          .game-modal-backdrop { padding: 0.5rem; }
          .game-modal-content { border-radius: 12px; }
          
          .hud-topline { flex-direction: row; align-items: flex-start; padding: 0.5rem; }
          .hud-left-panel { flex: 1; display: flex; align-items: flex-start; }
          .btn-exit { margin-top: 0; background: rgba(244,114,182,0.15); font-size: 0.65rem; }
          
          .hud-right-panel { flex: 1; display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem !important; transform: scale(0.9); transform-origin: top right; }
          .hud-tracker { display: none; }
          
          .hud-score-inline { font-size: 0.9rem !important; background: rgba(0,0,0,0.4); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(253,224,71,0.2); }
          .monster-toggle-row { font-size: 0.8rem !important; background: rgba(0,0,0,0.4); padding: 4px 10px; border-radius: 6px; }

          .minimap-container {
            top: auto; right: auto; 
            bottom: 1.5rem; left: 50%;
            transform: translateX(-50%);
            width: 80vw; height: auto; aspect-ratio: 4/3;
            max-width: 500px;
            border-width: 2px; border-radius: 20px;
            z-index: 500;
          }
        }
      `}</style>
    </div>
  );
};

export default GameWorld;
