import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { projects } from '../utils/data';
import { PROJECT_LINKS } from '../utils/links';

const difficultyColor = { Easy: '#4ADE80', Medium: '#FB923C', Hard: '#F472B6' };

const Projects = () => {
  const [flipped, setFlipped] = useState({});
  const [filter, setFilter] = useState('All');

  const types = ['All', 'Web', 'Desktop'];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.type === filter);

  const toggleFlip = (id) => setFlipped(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <section id="projects">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">⚔️ Quest Log</h2>
          <p className="section-subtitle">// completed_missions.json — click to view tech stack</p>
        </motion.div>

        <motion.div className="proj-filters"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {types.map(t => (
            <button
              key={t}
              className={`skill-tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >{t}</button>
          ))}
        </motion.div>

        <div className="projects-grid">
          {filtered.length > 0 ? (
            filtered.map((project, i) => {
              const projectLink = PROJECT_LINKS[project.id];
              return (
                <motion.div
                  key={project.id}
                  className="project-flip-wrap"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div
                    className={`project-flipper ${flipped[project.id] ? 'is-flipped' : ''}`}
                    onClick={() => toggleFlip(project.id)}
                  >
                    {/* FRONT */}
                    <div className="project-front project-face">
                      <div className="proj-header">
                        <div className="proj-icon" style={{ background: `${project.color}28`, color: project.color }}>
                          {project.icon}
                        </div>
                        <div className="proj-difficulty">
                          <span
                            className="tag"
                            style={{
                              borderColor: difficultyColor[project.difficulty] + '88',
                              color: difficultyColor[project.difficulty],
                              background: difficultyColor[project.difficulty] + '18'
                            }}
                          >
                            {project.difficulty}
                          </span>
                        </div>
                      </div>
                      <h3 className="proj-title">{project.title}</h3>
                      <p className="proj-subtitle neon-text-cyan">{project.subtitle}</p>
                      <p className="proj-desc">{project.description}</p>
                      <div className="proj-footer">
                        <span className="proj-period">{project.period}</span>
                        <span className="proj-xp" style={{ color: project.color }}>+{project.xpReward} XP</span>
                      </div>
                      <div className="flip-hint">Details & Tech Stack →</div>
                    </div>

                    {/* BACK */}
                    <div className="project-back project-face">
                      <h3 className="proj-title">{project.title}</h3>
                      <p className="proj-subtitle" style={{ color: project.color }}>CORE_ARCHITECTURE</p>
                      <div className="tech-tags">
                        {project.techStack.map(tech => (
                          <span
                            key={tech}
                            className="tag"
                            style={{ borderColor: project.color + '88', color: project.color, background: project.color + '15' }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="proj-links" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                        <a href={projectLink || project.github} target="_blank" rel="noreferrer" className="proj-link">
                          <FiGithub /> SOURCE_CODE
                        </a>
                        {project.live && (
                          <a href={project.live} target="_blank" rel="noreferrer" className="proj-link" style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)' }}>
                            <FiExternalLink /> LIVE_DEMO
                          </a>
                        )}
                      </div>
                      <div className="flip-hint">← BACK_TO_INTEL</div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              className="empty-projects-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed var(--border)' }}
            >
              <h3 style={{ color: 'var(--neon-purple)', marginBottom: '0.5rem' }}>"Exploring the local machine realm..."</h3>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Transition from web to {filter} in progress! 🚀</p>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        .proj-filters { 
          display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 2.5rem; flex-wrap: wrap; 
        }
        .skill-tab {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(168, 85, 247, 0.3);
          color: var(--text-secondary);
          padding: 0.6rem 1.4rem;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
          text-transform: uppercase;
        }
        .skill-tab:hover {
          border-color: var(--neon-purple);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
        }
        .skill-tab.active {
          background: var(--neon-purple);
          border-color: var(--neon-purple);
          color: #fff;
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.5);
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .project-flip-wrap { perspective: 1000px; height: 380px; }
        .project-flipper {
          position: relative; width: 100%; height: 100%;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d; cursor: none;
        }
        .project-flipper.is-flipped { transform: rotateY(180deg); }
        .project-face {
          position: absolute; inset: 0;
          background: var(--bg-card);
          border: 1px solid var(--border); border-radius: 18px;
          padding: 1.5rem;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: flex; flex-direction: column;
          transition: border-color 0.3s;
        }
        .project-face:hover { border-color: var(--border-hover); }
        .project-back { transform: rotateY(180deg); }
        .proj-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .proj-icon {
          font-size: 1.8rem; width: 52px; height: 52px;
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
        }
        .proj-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; }
        .proj-subtitle { font-size: 0.82rem; margin-bottom: 0.75rem; }
        .proj-desc { font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary); flex: 1; }
        .proj-footer {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 0.75rem; padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .proj-period { font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); }
        .proj-xp { font-size: 0.75rem; font-weight: 700; font-family: var(--font-mono); }
        .flip-hint {
          font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);
          text-align: center; margin-top: 0.5rem;
        }
        .tech-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; flex: 1; align-content: flex-start; }
        .proj-links { margin-top: auto; }
        .proj-link {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.5rem 1rem; border-radius: 8px;
          font-size: 0.85rem; font-weight: 600;
          border: 1px solid var(--border); color: var(--text-secondary);
          transition: var(--transition);
        }
        .proj-link:hover { color: var(--neon-cyan); border-color: var(--neon-cyan); background: rgba(34,211,238,.05); }
      `}</style>
    </section>
  );
};

export default Projects;
