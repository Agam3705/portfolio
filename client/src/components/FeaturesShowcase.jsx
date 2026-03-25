import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiLayout, FiMonitor, FiMail, FiStar, FiZap, FiActivity } from 'react-icons/fi';

const FeaturesShowcase = ({ isOpen, onClose }) => {
  const features = [
    {
      icon: <FiLayout />,
      title: 'Hybrid Multiverse Engine',
      desc: 'Seamless architectural transition between a high-end Classic Portfolio and a React-driven 60fps Game Engine.',
      color: '#3b82f6',
    },
    {
      icon: <FiMonitor />,
      title: 'Procedural Grid Compiler',
      desc: 'Dynamic Pac-Man style maze generation using a string-to-coordinate world builder with AABB collision detection.',
      color: '#ec4899',
    },
    {
      icon: <FiStar />,
      title: '3D Achievement Labyrinth',
      desc: 'Interactive certificate wall with 3D hover effects, synchronized link mapping, and verified credential tracking.',
      color: '#fb923c',
    },
    {
      icon: <FiLayout />,
      title: 'Multiverse Selection Portal',
      desc: 'Futuristic entry system with scanning effects, system logs, and immersive spatial navigation between modes.',
      color: '#8b5cf6',
    },
    {
      icon: <FiMonitor />,
      title: 'Interactive CV System',
      desc: 'Custom-styled high-fidelity professional modal with direct PDF and Docx download integration.',
      color: '#06b6d4',
    },
    {
      icon: <FiCpu />,
      title: 'Full Stack Node.js API',
      desc: 'Robust Express backend with MongoDB persistence, JWT security, and real-time SMTP comms via Nodemailer.',
      color: '#a855f7',
    },
    {
      icon: <FiZap />,
      title: 'State-Syncing XP System',
      desc: 'Context-driven progression tracking that rewards exploration with XP multipliers and rank upgrades.',
      color: '#4ade80',
    },
    {
      icon: <FiActivity />,
      title: 'Cross-Platform Ergonomics',
      desc: 'Fully adaptive UI from 4K monitors to smartphones, featuring custom virtual D-Pads and touch-sensitive HUDs.',
      color: '#f472b6',
    },
    {
      icon: <FiMail />,
      title: 'Smart Contact Relay',
      desc: 'Intelligent form validation with immediate feedback and background email processing for recruiters.',
      color: '#22d3ee',
    },
    {
      icon: <FiZap />,
      title: 'SEO & Performance Mastery',
      desc: 'Optimized Lighthouse scores with semantic HTML5, zero-lag animations, and rapid asset delivery.',
      color: '#fbbf24',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="features-showcase-root">
          <motion.div
            className="showcase-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="showcase-modal"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="showcase-header">
              <span className="showcase-badge">SYSTEM OVERVIEW</span>
              <h2>Portfolio Capabilities</h2>
              <button className="showcase-close" onClick={onClose}>✕</button>
            </div>

            <div className="showcase-grid">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="feature-icon" style={{ background: f.color + '15', color: f.color }}>
                    {f.icon}
                  </div>
                  <div className="feature-body">
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="showcase-tech-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3>🔧 System Architecture</h3>
              <div className="tech-specs-grid">
                <div className="spec"><span>Performance</span><strong>60 FPS Lock</strong></div>
                <div className="spec"><span>Physics</span><strong>AABB Collision</strong></div>
                <div className="spec"><span>Security</span><strong>JWT + 2FA App Pass</strong></div>
                <div className="spec"><span>Assets</span><strong>SVG + CSS Shapes</strong></div>
              </div>
            </motion.div>

            <div className="showcase-footer">
              <p>Designed and Built by <strong>Agam Jindal</strong></p>
              <div className="tech-dots">
                <span className="dot" title="React" style={{ background: '#61DAFB' }} />
                <span className="dot" title="Node.js" style={{ background: '#339933' }} />
                <span className="dot" title="MongoDB" style={{ background: '#47A248' }} />
                <span className="dot" title="Framer Motion" style={{ background: '#f472b6' }} />
              </div>
            </div>
          </motion.div>

          <style>{`
            .features-showcase-root {
              position: fixed; inset: 0; z-index: 11000;
              display: flex; align-items: center; justify-content: center;
              padding: 1rem;
            }
            .showcase-backdrop {
              position: absolute; inset: 0;
              background: rgba(2, 3, 13, 0.9);
              backdrop-filter: blur(12px);
            }
            .showcase-modal {
              position: relative; z-index: 10;
              background: #0d1117;
              border: 1px solid rgba(168, 85, 247, 0.3);
              border-radius: 24px;
              width: 100%; max-width: 840px;
              max-height: 85vh; overflow-y: auto;
              padding: 2.5rem;
              box-shadow: 0 0 80px rgba(168, 85, 247, 0.2);
              scrollbar-width: thin;
              scrollbar-color: var(--neon-purple) transparent;
            }
            .showcase-modal::-webkit-scrollbar { width: 4px; }
            .showcase-modal::-webkit-scrollbar-thumb { background: var(--neon-purple); border-radius: 2px; }

            .showcase-header {
              text-align: center; margin-bottom: 2.5rem; position: relative;
            }
            .showcase-badge {
              font-family: var(--font-mono); font-size: 0.7rem; font-weight: 800;
              color: var(--neon-purple); letter-spacing: 0.2em;
              border: 1px solid rgba(168, 85, 247, 0.4);
              padding: 0.25rem 0.75rem; border-radius: 999px;
              margin-bottom: 1rem; display: inline-block;
            }
            .showcase-header h2 { font-size: 2.2rem; font-weight: 900; color: #fff; margin: 0; letter-spacing: -0.02em; }
            .showcase-close {
              position: absolute; top: -1rem; right: -1rem;
              background: rgba(255,255,255,0.05); border: 1px solid var(--border);
              color: #fff; width: 36px; height: 36px; border-radius: 10px;
              cursor: pointer; transition: 0.2s; z-index: 20;
            }
            .showcase-close:hover { background: var(--border); transform: rotate(90deg); }

            .showcase-grid {
              display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
              gap: 1.25rem; margin-bottom: 3rem;
            }
            .feature-card {
              display: flex; gap: 1.25rem; align-items: flex-start;
              padding: 1.25rem; border-radius: 18px;
              background: rgba(255,255,255,0.02);
              border: 1px solid rgba(255,255,255,0.05);
              transition: all 0.3s ease;
            }
            .feature-card:hover {
              background: rgba(255,255,255,0.04);
              border-color: rgba(168, 85, 247, 0.3);
              transform: translateY(-2px);
            }
            .feature-icon {
              width: 54px; height: 54px; border-radius: 14px;
              display: flex; align-items: center; justify-content: center;
              font-size: 1.4rem; flex-shrink: 0;
              box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
            }
            .feature-body h3 { font-size: 1.05rem; font-weight: 800; color: #fff; margin-bottom: 0.4rem; }
            .feature-body p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

            .showcase-tech-details {
              padding: 1.5rem; border-radius: 16px;
              background: linear-gradient(135deg, rgba(34,211,238,0.03), rgba(168,85,247,0.03));
              border: 1px solid rgba(255,255,255,0.05);
              margin-bottom: 2.5rem;
            }
            .showcase-tech-details h3 { font-size: 0.85rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
            .tech-specs-grid {
              display: grid; grid-template-columns: repeat(2, 1fr);
              gap: 1.5rem;
            }
            .spec { display: flex; flex-direction: column; gap: 0.2rem; }
            .spec span { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); }
            .spec strong { font-size: 0.95rem; color: #fff; font-weight: 700; }

            .showcase-footer {
              border-top: 1px solid var(--border);
              padding-top: 1.5rem; display: flex;
              justify-content: space-between; align-items: center;
              color: var(--text-muted); font-size: 0.85rem;
            }
            .tech-dots { display: flex; gap: 0.5rem; }
            .dot { width: 8px; height: 8px; border-radius: 50%; opacity: 0.6; }

            @media (max-width: 600px) {
              .showcase-modal { padding: 1.5rem; width: 95%; max-height: 90vh; }
              .showcase-header h2 { font-size: 1.6rem; }
              .showcase-grid { grid-template-columns: 1fr; }
              .tech-specs-grid { grid-template-columns: 1fr; gap: 1rem; }
              .feature-card { padding: 1rem; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeaturesShowcase;
