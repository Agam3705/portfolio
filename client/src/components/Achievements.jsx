import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { achievements } from '../utils/data';
import { CERTIFICATE_LINKS } from '../utils/links';

const Achievements = () => {
  const [unlocked, setUnlocked] = useState(new Set());
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            achievements.forEach((a, i) => {
              setTimeout(() => {
                setUnlocked(prev => {
                  if (!prev.has(a.id)) {
                    if (i === 0) {
                      confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 }, colors: ['#a855f7', '#22d3ee', '#4ade80'] });
                    }
                  }
                  return new Set([...prev, a.id]);
                });
              }, i * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="achievements" ref={sectionRef}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">🏆 Achievement Wall</h2>
          <p className="section-subtitle">// badges_unlocked.json — click to view certificates</p>
        </motion.div>

        <div className="achievements-grid">
          {achievements.map((ach, i) => {
            const certData = CERTIFICATE_LINKS[ach.id];

            return (
              <a 
                key={ach.id} 
                href={unlocked.has(ach.id) && certData ? certData.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`ach-card-wrapper ${unlocked.has(ach.id) ? 'unlocked' : 'locked'} ${!certData ? 'no-link' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  className="ach-card-static"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="ach-card-content">
                    {unlocked.has(ach.id) && (
                      <div className="ach-glow" style={{ background: `radial-gradient(circle, ${ach.color}30, transparent 70%)` }} />
                    )}
                    <div className="ach-icon" style={{ 
                      borderColor: unlocked.has(ach.id) ? ach.color : 'var(--text-muted)', 
                      boxShadow: unlocked.has(ach.id) ? `0 0 15px ${ach.color}60` : 'none',
                      color: unlocked.has(ach.id) ? ach.color : 'inherit'
                    }}>
                      {unlocked.has(ach.id) ? ach.icon : '🔒'}
                    </div>
                    <div className={`tag ach-rarity rarity-${ach.rarity.toLowerCase()}`}>
                      {ach.rarity}
                    </div>
                    <h3 className="ach-title" style={{ color: unlocked.has(ach.id) ? ach.color : 'var(--text-muted)' }}>
                      {ach.title}
                    </h3>
                    <p className="ach-desc">{unlocked.has(ach.id) ? ach.description : 'Decrypting data...'}</p>
                    <div className="ach-date">{ach.date}</div>
                    {unlocked.has(ach.id) && certData && (
                      <div className="view-link-hint">External Link ↗</div>
                    )}
                  </div>
                </motion.div>
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .ach-card-wrapper {
          display: block;
          min-height: 340px;
        }
        .ach-card-static {
          position: relative;
          width: 100%;
          height: 100%;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--bg-card);
          overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .ach-card-wrapper.unlocked:hover .ach-card-static {
          border-color: var(--neon-purple);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .ach-card-content {
          padding: 2.5rem 1.5rem 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .ach-card-wrapper.locked { opacity: 0.6; filter: grayscale(0.8); cursor: not-allowed; }
        .ach-card-wrapper.no-link { cursor: default; }

        .ach-glow { position: absolute; inset: 0; pointer-events: none; }
        
        .ach-icon {
          font-size: 2.5rem; margin-bottom: 1.25rem;
          width: 80px; height: 80px; border-radius: 50%;
          border: 2px solid; display: flex;
          align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03);
          position: relative; z-index: 1;
        }
        .ach-rarity { margin-bottom: 1rem; }
        .ach-title { font-size: 1.2rem; font-weight: 800; margin-bottom: 0.5rem; z-index: 1; }
        .ach-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem; flex: 1; }
        .ach-date { font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); }
        .view-link-hint { 
          font-size: 0.7rem; color: var(--neon-cyan); margin-top: 1rem; 
          font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; 
        }

        @media (max-width: 600px) {
          .ach-card-wrapper { min-height: 300px; height: auto; }
          .ach-icon { width: 70px; height: 70px; font-size: 2.2rem; }
          .ach-title { font-size: 1.1rem; }
        }
      `}</style>
    </section>
  );
};

export default Achievements;
