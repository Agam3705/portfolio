import { useState } from 'react';
import { motion } from 'framer-motion';
import { skills } from '../utils/data';

const categories = ['All', 'Languages', 'Frameworks', 'Tools', 'Core CS'];

const getLevelName = (level) => {
  if (level >= 90) return { name: 'MASTER', color: '#FFD700' };
  if (level >= 80) return { name: 'EXPERT', color: '#C084FC' };
  if (level >= 70) return { name: 'ADVANCED', color: '#38BDF8' };
  if (level >= 60) return { name: 'INTERMEDIATE', color: '#4ADE80' };
  return { name: 'APPRENTICE', color: '#FB923C' };
};

const Skills = () => {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? skills : skills.filter(s => s.category === active);

  return (
    <section id="skills">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">⚡ Character Stats</h2>
          <p className="section-subtitle">// skill_tree.json — all unlocked abilities</p>
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          className="skill-tabs"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              className={`skill-tab ${active === cat ? 'active' : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <div className="skills-grid">
          {filtered.map((skill, i) => {
            const lvl = getLevelName(skill.level);
            return (
              <motion.div
                key={skill.name}
                className="skill-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4, borderColor: skill.color }}
              >
                <div className="skill-header">
                  <div className="skill-name" style={{ color: skill.color }}>{skill.name}</div>
                  <div className="skill-badge" style={{ borderColor: lvl.color, color: lvl.color, background: `${lvl.color}18` }}>
                    {lvl.name}
                  </div>
                </div>
                <div className="skill-bar-wrap">
                  <div className="skill-bar">
                    <motion.div
                      className="skill-fill"
                      style={{ background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.05 + 0.3, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="skill-percent">{skill.level}%</span>
                </div>
                <div className="skill-meta">
                  <span className="skill-cat">{skill.category}</span>
                  <span className="skill-xp" style={{ color: skill.color }}>+{skill.level * 10} XP</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Soft skills */}
        <motion.div
          className="soft-skills"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="soft-title">Soft Skills <span className="neon-text-purple">// passive_abilities</span></h3>
          <div className="soft-tags">
            {['Public Speaking', 'Leadership', 'Adaptability', 'Analytical Thinking'].map(s => (
              <span key={s} className="soft-tag">{s}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .skill-tabs {
          display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;
          margin-bottom: 2.5rem;
        }
        .skill-tab {
          padding: 0.4rem 1rem; border-radius: 8px;
          font-size: 0.85rem; font-weight: 500;
          border: 1px solid var(--border);
          color: var(--text-secondary); background: transparent;
          transition: var(--transition);
        }
        .skill-tab:hover, .skill-tab.active {
          border-color: var(--neon-purple);
          color: var(--neon-purple);
          background: rgba(168,85,247,.1);
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem; margin-bottom: 3rem;
        }
        .skill-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 1.2rem;
          transition: all 0.3s ease;
        }
        .skill-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.75rem;
        }
        .skill-name { font-weight: 700; font-size: 0.95rem; }
        .skill-badge {
          font-size: 0.6rem; font-weight: 700; font-family: var(--font-mono);
          padding: 0.15rem 0.5rem; border-radius: 999px; border: 1px solid;
          letter-spacing: 0.08em;
        }
        .skill-bar-wrap {
          display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;
        }
        .skill-bar {
          flex: 1; height: 6px;
          background: rgba(255,255,255,.06); border-radius: 3px; overflow: hidden;
        }
        .skill-fill { height: 100%; border-radius: 3px; }
        .skill-percent {
          font-family: var(--font-mono); font-size: 0.72rem;
          color: var(--text-muted); min-width: 32px; text-align: right;
        }
        .skill-meta { display: flex; justify-content: space-between; }
        .skill-cat { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); }
        .skill-xp { font-size: 0.72rem; font-weight: 600; font-family: var(--font-mono); }
        .soft-skills {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 16px; padding: 1.5rem 2rem;
        }
        .soft-title {
          font-size: 1rem; font-weight: 700; margin-bottom: 1rem;
          color: var(--text-primary);
        }
        .soft-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .soft-tag {
          padding: 0.35rem 0.9rem;
          background: rgba(168,85,247,.1);
          border: 1px solid rgba(168,85,247,.2); border-radius: 8px;
          font-size: 0.85rem; font-weight: 500; color: var(--neon-purple);
          transition: var(--transition);
        }
        .soft-tag:hover { background: rgba(168,85,247,.2); border-color: var(--neon-purple); }
      `}</style>
    </section>
  );
};

export default Skills;
