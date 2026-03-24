import { motion } from 'framer-motion';
import { timeline } from '../utils/data';

const Timeline = () => {
  return (
    <section id="timeline">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">📜 Origin Story</h2>
          <p className="section-subtitle">// player_history.log — the journey so far</p>
        </motion.div>

        <div className="timeline-wrap">
          <div className="timeline-line" />
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              className={`tl-item ${i % 2 === 0 ? 'tl-left' : 'tl-right'}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="tl-dot">
                <span>{item.icon}</span>
              </div>
              <div className="tl-card card">
                <div className="tl-header">
                  <span className={`tl-type tag ${item.type === 'education' ? 'tl-edu' : 'tl-train'}`}>
                    {item.type === 'education' ? '🎓 Education' : '🛠️ Training'}
                  </span>
                  <span className="tl-year">{item.year}</span>
                </div>
                <h3 className="tl-title">{item.title}</h3>
                <p className="tl-subtitle neon-text-cyan">{item.subtitle}</p>
                <p className="tl-desc">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .timeline-wrap {
          position: relative; max-width: 900px; margin: 0 auto;
          padding: 1rem 0;
        }
        .timeline-line {
          position: absolute; left: 50%; top: 0; bottom: 0;
          width: 2px; transform: translateX(-50%);
          background: linear-gradient(180deg, var(--neon-purple), var(--neon-cyan), transparent);
          opacity: 0.4;
        }
        .tl-item {
          display: flex; align-items: flex-start;
          margin-bottom: 2.5rem; position: relative;
          gap: 2rem;
        }
        .tl-left { flex-direction: row-reverse; }
        .tl-right { flex-direction: row; }
        .tl-dot {
          position: absolute; left: 50%; top: 0;
          transform: translateX(-50%);
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--bg-card);
          border: 2px solid var(--neon-purple);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; z-index: 1;
          box-shadow: var(--glow-purple);
          flex-shrink: 0;
        }
        .tl-card {
          width: calc(50% - 2.5rem);
        }
        .tl-header {
          display: flex; flex-wrap: wrap; justify-content: space-between;
          align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
        }
        .tl-type { font-size: 0.72rem; }
        .tl-edu { border-color: rgba(168,85,247,.4); color: var(--neon-purple); background: rgba(168,85,247,.1); }
        .tl-train { border-color: rgba(34,211,238,.4); color: var(--neon-cyan); background: rgba(34,211,238,.1); }
        .tl-year { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); }
        .tl-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.2rem; }
        .tl-subtitle { font-size: 0.8rem; margin-bottom: 0.5rem; }
        .tl-desc { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; }

        @media (max-width: 640px) {
          .timeline-line { left: 22px; }
          .tl-item { flex-direction: row !important; padding-left: 3.5rem; gap: 1rem; }
          .tl-dot { left: 22px; }
          .tl-card { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
