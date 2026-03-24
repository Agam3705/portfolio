import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-scroll';
import { FiGithub, FiLinkedin, FiMail, FiX } from 'react-icons/fi';
import { personalInfo, skills, projects, achievements, timeline } from '../utils/data';
import { PROJECT_LINKS, CERTIFICATE_LINKS } from '../utils/links';

const Hero = () => {
  const canvasRef = useRef(null);
  const [showCV, setShowCV] = useState(false);

  // Animated grid canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.06)';
      ctx.lineWidth = 1;
      const spacing = 40;
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  // ESC key to close CV
  useEffect(() => {
    if (!showCV) return;
    const onKey = (e) => { if (e.key === 'Escape') setShowCV(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showCV]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section id="hero" className="hero-section">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="container hero-content">
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status badge */}
          <motion.div className="hero-status" variants={itemVariants}>
            <span className="status-dot" />
            <span>Available for Opportunities</span>
          </motion.div>

          {/* Player class */}
          <motion.p className="hero-class" variants={itemVariants}>
            <span className="mono-bracket">[ </span>
            <span className="neon-text-purple">{personalInfo.playerClass}</span>
            <span className="mono-bracket"> ]</span>
          </motion.p>

          {/* Name */}
          <motion.h1 className="hero-name" variants={itemVariants}>
            {personalInfo.name.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'neon-text-cyan' : ''}>{word} </span>
            ))}
          </motion.h1>

          {/* Typing animation */}
          <motion.div className="hero-typing" variants={itemVariants}>
            <span className="mono-bracket">&gt; </span>
            <TypeAnimation
              sequence={[
                'Building Full Stack Apps 🚀', 2000,
                'Crafting Clean UIs ✨', 2000,
                'Solving DSA Problems 🧩', 2000,
                'Learning Every Day 📚', 2000,
                'Open to Work! 💼', 2000,
              ]}
              repeat={Infinity}
              className="typing-text"
            />
          </motion.div>

          {/* Bio */}
          <motion.p className="hero-bio" variants={itemVariants}>
            {personalInfo.bio}
          </motion.p>

          {/* Stats row */}
          <motion.div className="hero-stats" variants={itemVariants}>
            {[
              { label: 'Level', value: personalInfo.level, icon: '⚡' },
              { label: 'Projects', value: 3, icon: '🛡️' },
              { label: 'CGPA', value: personalInfo.cgpa, icon: '🎓' },
              { label: 'Certs', value: achievements.length, icon: '📜' },
            ].map(stat => (
              <div className="stat-chip" key={stat.label}>
                <span className="stat-icon">{stat.icon}</span>
                <div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div className="hero-btns" variants={itemVariants}>
            <Link to="projects" smooth duration={600} offset={-70}>
              <button className="btn-primary">
                ⚔️ View Quests
              </button>
            </Link>
            <Link to="contact" smooth duration={600} offset={-70}>
              <button className="btn-secondary">
                📬 Hire Me
              </button>
            </Link>
          </motion.div>

          {/* Social links */}
          <motion.div className="hero-socials" variants={itemVariants}>
            {[
              { icon: <FiGithub />, href: personalInfo.github, label: 'GitHub' },
              { icon: <FiLinkedin />, href: personalInfo.linkedin, label: 'LinkedIn' },
              { icon: <FiMail />, href: `mailto:${personalInfo.email}`, label: 'Email' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                title={s.label}
              >
                {s.icon}
                <span>{s.label}</span>
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero visual — profile card */}
        <motion.div
          className="hero-card-wrap"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        >
          <div className="profile-card">
            {/* Scanner effect */}
            <div className="scanner-line" />

            <div className="profile-img-wrap">
              <img
                src="/kriti.jpg"
                alt="Kumari Kriti Singh"
                className="profile-img"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=Kumari+Kriti+Singh&background=7c3aed&color=fff&size=200&bold=true`;
                }}
              />
              <div className="profile-ring" />
            </div>

            <div className="profile-info">
              <h3>{personalInfo.name}</h3>
              <p className="neon-text-cyan">{personalInfo.playerClass}</p>
              <div className="profile-xp">
                <div className="profile-xp-row">
                  <span>XP</span>
                  <span>{personalInfo.xp.toLocaleString()} / {personalInfo.maxXp.toLocaleString()}</span>
                </div>
                <div className="profile-xp-bar">
                  <div
                    className="profile-xp-fill"
                    style={{ width: `${(personalInfo.xp / personalInfo.maxXp) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="profile-badges">
              {['🏆', '⭐', '🌐', '☁️'].map((b, i) => (
                <div key={i} className="profile-badge">{b}</div>
              ))}
            </div>

            <div className="profile-cv-row">
              <button
                className="cv-btn cv-view"
                onClick={() => setShowCV(true)}
              >
                👁️ View CV
              </button>
              <a
                href="/CV.docx"
                download="Kriti_Singh_CV.docx"
                className="cv-btn cv-download"
              >
                ⬇️ Download CV
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── CV MODAL (Portal → renders at body level, escapes game-modal stacking) ─── */}
      {showCV && createPortal(
          <motion.div
            className="cv-overlay"
            style={{ pointerEvents: 'all' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowCV(false); }}
          >
            <motion.div
              className="cv-modal"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="cv-header">
                <div>
                  <h2 className="cv-name">{personalInfo.name}</h2>
                  <div className="cv-contacts">
                    <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">🔗 linkedin/kritisingh7488</a>
                    <a href={personalInfo.github} target="_blank" rel="noreferrer">🐱 github.com/kritisingh7488</a>
                    <a href={`mailto:${personalInfo.email}`}>📧 {personalInfo.email}</a>
                    <span>📞 {personalInfo.phone}</span>
                  </div>
                </div>
                <button className="cv-close" onClick={() => setShowCV(false)}><FiX /></button>
              </div>

              <div className="cv-body">

                {/* Skills */}
                <section className="cv-section">
                  <h3 className="cv-section-title">⚡ Skills</h3>
                  {[
                    { cat: 'Languages', val: 'C/C++, JavaScript, PHP, Java' },
                    { cat: 'Frameworks', val: 'HTML and CSS, Tailwind CSS, NodeJS, ReactJS' },
                    { cat: 'Tools/Platforms', val: 'MySQL, Git, GitHub' },
                    { cat: 'Core CS Fundamentals', val: 'DSA, OOPs, OS' },
                    { cat: 'Soft Skills', val: 'Problem-Solving, Team Work, Leadership, Adaptability' },
                  ].map(({ cat, val }) => (
                    <div key={cat} className="cv-skill-group">
                      <span className="cv-skill-cat">{cat}:</span>{val}
                    </div>
                  ))}
                </section>

                {/* Projects */}
                <section className="cv-section">
                  <h3 className="cv-section-title">💻 Projects</h3>

                  <div className="cv-entry">
                    <div className="cv-entry-header">
                      <strong>🎨 Paint Application &nbsp;<a href={PROJECT_LINKS[1]} target="_blank" rel="noreferrer" className="cv-link">GitHub ↗</a></strong>
                      <span className="cv-date">Jun'25 – Jul'25</span>
                    </div>
                    <ul className="cv-bullets">
                      <li>Developed a desktop-based paint tool using Java and Swing with smooth and responsive drawing capabilities.</li>
                      <li>Added essential features like pencil, shapes, color picker, fill, and eraser to support flexible digital drawing.</li>
                      <li>Designed a user-friendly interface that allows easy creation, editing, and clearing of artwork.</li>
                      <li>Included adjustable brush-size controls and simplified user interactions to improve overall usability.</li>
                    </ul>
                    <div className="cv-tech">Tech stack: Java, Swing, GUI Development, Desktop Application</div>
                  </div>

                  <div className="cv-entry">
                    <div className="cv-entry-header">
                      <strong>📚 Knowledge Management Portal &nbsp;<a href={PROJECT_LINKS[2]} target="_blank" rel="noreferrer" className="cv-link">GitHub ↗</a></strong>
                      <span className="cv-date">Jan'25 – Apr'25</span>
                    </div>
                    <ul className="cv-bullets">
                      <li>Built a structured knowledge portal with a clean and organized interface using HTML and Tailwind CSS.</li>
                      <li>Implemented backend functionality using PHP and Node.js to handle requests and process data efficiently.</li>
                      <li>Used MySQL for reliable data storage to ensure smooth management of information.</li>
                      <li>Integrated JavaScript and jQuery to deliver dynamic interactions and improved content navigation.</li>
                    </ul>
                    <div className="cv-tech">Tech stack: HTML, Tailwind CSS, PHP, Node.js, jQuery, MySQL</div>
                  </div>

                  <div className="cv-entry">
                    <div className="cv-entry-header">
                      <strong>⚡ Energy Efficient CPU Scheduling Algorithm &nbsp;<a href={PROJECT_LINKS[3]} target="_blank" rel="noreferrer" className="cv-link">GitHub ↗</a></strong>
                      <span className="cv-date">Jan'25 – Mar'25</span>
                    </div>
                    <ul className="cv-bullets">
                      <li>Created a web tool to simulate CPU scheduling algorithms with an energy-efficient approach.</li>
                      <li>Enabled users to test multiple algorithms and observe their performance in real time.</li>
                      <li>Added clear visual elements like Gantt charts to simplify understanding of scheduling behavior.</li>
                      <li>Crafted the scheduling engine and UI using JavaScript and PHP for accurate simulations.</li>
                    </ul>
                    <div className="cv-tech">Tech stack: HTML, Tailwind CSS, JavaScript, PHP, Web Application Simulation</div>
                  </div>
                </section>



                {/* Certificates */}
                <section className="cv-section">
                  <h3 className="cv-section-title">🏅 Certificates</h3>
                  {[
                    { id: 3, name: 'Cloud Computing', org: 'NPTEL', date: "Apr'25" },
                    { id: 4, name: 'Computer Communications', org: 'Coursera', date: "Nov'24" },
                    { id: 5, name: 'Social Entrepreneurship', org: 'Sanjivani Shakti Sewa Samiti', date: "Jul'24" },
                    { id: 6, name: 'Data Structures Training', org: 'LPU Training', date: "Jul'25" },
                  ].map((c, i) => (
                    <div key={i} className="cv-entry cv-entry-compact">
                      <span>📜 <strong>{c.name}</strong> · <a href={CERTIFICATE_LINKS[c.id]?.url || '#'} target="_blank" rel="noreferrer" className="cv-link">{c.org} ↗</a></span>
                      <span className="cv-date">{c.date}</span>
                    </div>
                  ))}
                </section>

                {/* Achievements */}
                <section className="cv-section">
                  <h3 className="cv-section-title">🏆 Achievements</h3>
                  <div className="cv-entry cv-entry-compact">
                    <span>⭐ Earned a <strong>5-star C++ rating</strong> on <a href={CERTIFICATE_LINKS[1]?.url || "https://hackerrank.com"} target="_blank" rel="noreferrer" className="cv-link">HackerRank ↗</a> for strong problem-solving performance.</span>
                    <span className="cv-date">Oct'25</span>
                  </div>
                  <div className="cv-entry cv-entry-compact">
                    <span>🏆 Secured <strong>2nd position</strong> among 100+ participants in the <a href={CERTIFICATE_LINKS[2]?.url || "#"} target="_blank" rel="noreferrer" className="cv-link">Achievers Hunt ↗</a> competition at LPU.</span>
                    <span className="cv-date">May'24</span>
                  </div>
                </section>

                {/* Education */}
                <section className="cv-section">
                  <h3 className="cv-section-title">🎓 Education</h3>
                  {[
                    { inst: 'Lovely Professional University', loc: 'Phagwara, Punjab', degree: 'B.Tech – Computer Science and Engineering; CGPA: 7.68', period: "Aug'23 – Present" },
                    { inst: 'Saraswati Shishu Vidya Mandir', loc: 'Dhurwa, Ranchi', degree: 'Intermediate; Percentage: 89%', period: "Apr'21 – Jun'22" },
                    { inst: 'Saraswati Shishu Vidya Mandir', loc: 'Dhurwa, Ranchi', degree: 'Matriculation; Percentage: 85%', period: "Apr'19 – Jun'20" },
                  ].map((e, i) => (
                    <div key={i} className="cv-entry">
                      <div className="cv-entry-header">
                        <strong>{e.inst}</strong>
                        <span className="cv-date">{e.loc}</span>
                      </div>
                      <div className="cv-entry-header" style={{ marginTop: '0.1rem' }}>
                        <span className="cv-entry-sub" style={{ margin: 0 }}>{e.degree}</span>
                        <span className="cv-date">{e.period}</span>
                      </div>
                    </div>
                  ))}
                </section>

              </div>

              <div className="cv-footer">
                <a href="/CV.docx" download="Kriti_Singh_CV.docx" className="cv-btn cv-download">
                  ⬇️ Download CV
                </a>
              </div>
            </motion.div>
          </motion.div>
      , document.body)}
      {/* ─────────────────────────────────────────────────────── */}

      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex; align-items: center;
          padding-top: 5rem; padding-bottom: 2rem;
          position: relative; overflow: hidden;
        }
        .hero-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none;
        }
        .hero-content {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 4rem; align-items: center;
          position: relative; z-index: 1;
        }
        .hero-status {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.4rem 0.9rem;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);
          border-radius: 999px;
          font-size: 0.82rem; font-weight: 500;
          color: var(--neon-green);
          margin-bottom: 1rem;
          width: fit-content;
        }
        .status-dot {
          width: 8px; height: 8px;
          background: var(--neon-green); border-radius: 50%;
          animation: pulse-glow 2s infinite;
          box-shadow: 0 0 6px var(--neon-green);
        }
        .hero-class {
          font-family: var(--font-mono);
          font-size: 0.9rem; margin-bottom: 0.75rem;
          color: var(--text-secondary); letter-spacing: 0.05em;
        }
        .mono-bracket { color: var(--text-muted); }
        .hero-name {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900; line-height: 1.1;
          margin-bottom: 1rem; letter-spacing: -0.03em;
        }
        .hero-typing {
          font-family: var(--font-mono); font-size: 1.05rem;
          color: var(--text-secondary); margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 0.25rem;
        }
        .typing-text { color: var(--neon-cyan); }
        .hero-bio {
          color: var(--text-secondary); font-size: 1rem;
          line-height: 1.7; max-width: 480px; margin-bottom: 1.75rem;
        }
        .hero-stats {
          display: flex; flex-wrap: wrap; gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .stat-chip {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border); border-radius: 12px;
          padding: 0.5rem 0.9rem;
          transition: var(--transition);
        }
        .stat-chip:hover { border-color: var(--neon-purple); }
        .stat-icon { font-size: 1.1rem; }
        .stat-value { font-weight: 700; font-size: 1rem; line-height: 1.2; }
        .stat-label { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono); }
        .hero-btns { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.75rem; }
        .hero-socials { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .social-btn {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.4rem 0.9rem; border-radius: 8px;
          font-size: 0.85rem; color: var(--text-secondary);
          border: 1px solid var(--border);
          transition: var(--transition);
        }
        .social-btn:hover { color: var(--neon-cyan); border-color: var(--neon-cyan); background: rgba(34,211,238,.05); }
        .hero-card-wrap { display: flex; justify-content: center; align-items: center; }
        .profile-card {
          background: var(--bg-card);
          border: 1px solid var(--border); border-radius: 24px;
          padding: 2.5rem 2rem; text-align: center;
          max-width: 320px; width: 100%;
          position: relative; overflow: hidden;
          animation: float 6s ease-in-out infinite;
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.1);
        }
        .scanner-line {
          position: absolute; left: 0; width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
          opacity: 0.5;
          animation: scanner 3s linear infinite;
        }
        .profile-img-wrap { position: relative; display: inline-block; margin-bottom: 1rem; }
        .profile-img {
          width: 180px; height: 180px; border-radius: 50%;
          object-fit: cover; object-position: top;
          border: 3px solid var(--neon-purple);
          box-shadow: var(--glow-purple);
          position: relative; z-index: 1;
        }
        .profile-ring {
          position: absolute; inset: -10px; border-radius: 50%;
          border: 2px dashed rgba(168, 85, 247, 0.4);
          animation: spin 8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .profile-cv-row {
          display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem;
        }
        .cv-btn {
          display: flex; align-items: center; gap: 0.3rem;
          padding: 0.45rem 0.85rem; border-radius: 8px;
          font-size: 0.78rem; font-weight: 700; text-decoration: none;
          font-family: var(--font-mono); letter-spacing: 0.03em;
          transition: all 0.2s ease;
        }
        .cv-view {
          background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.4);
          color: var(--neon-purple);
        }
        .cv-view:hover { background: var(--neon-purple); color: #fff; box-shadow: 0 0 15px rgb(168,85,247,0.5); }
        .cv-download {
          background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.4);
          color: var(--neon-cyan);
        }
        .cv-download:hover { background: var(--neon-cyan); color: #000; box-shadow: 0 0 15px rgba(34,211,238,0.5); }
        .profile-info h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; }
        .profile-info p { font-size: 0.8rem; margin-bottom: 1rem; }
        .profile-xp { margin-bottom: 1rem; }
        .profile-xp-row {
          display: flex; justify-content: space-between;
          font-size: 0.7rem; font-family: var(--font-mono);
          color: var(--text-muted); margin-bottom: 0.3rem;
        }
        .profile-xp-bar {
          height: 6px; background: rgba(255,255,255,.08); border-radius: 3px; overflow: hidden;
        }
        .profile-xp-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--neon-purple), var(--neon-cyan));
          border-radius: 3px; box-shadow: 0 0 6px rgba(168,85,247,.7);
        }
        .profile-badges { display: flex; justify-content: center; gap: 0.5rem; }
        .profile-badge {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(168,85,247,.1); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; transition: var(--transition);
        }
        .profile-badge:hover { border-color: var(--neon-purple); transform: scale(1.1); }
        @media (max-width: 768px) {
          .hero-content { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
          .hero-status, .hero-btns, .hero-socials, .hero-stats { justify-content: center; }
          .hero-bio { margin: 0 auto 1.75rem; }
          .hero-card-wrap { order: -1; }
        }
        .cv-btn { cursor: pointer; }
        /* CV Overlay */
        .cv-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem; cursor: default;
        }
        .cv-modal {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 20px; width: 100%; max-width: 780px;
          max-height: 85vh; display: flex; flex-direction: column;
          box-shadow: 0 0 60px rgba(168,85,247,0.2);
          overflow: hidden;
        }
        .cv-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
          background: rgba(168,85,247,0.05);
          flex-shrink: 0;
        }
        .cv-name { font-size: 1.6rem; font-weight: 900; margin-bottom: 0.2rem; }
        .cv-tagline { color: var(--neon-cyan); font-size: 0.9rem; margin-bottom: 0.6rem; }
        .cv-contacts {
          display: flex; flex-wrap: wrap; gap: 0.4rem 1.2rem;
          font-size: 0.75rem; color: var(--text-secondary);
        }
        .cv-contacts a { color: var(--neon-purple); text-decoration: none; }
        .cv-contacts a:hover { text-decoration: underline; }
        .cv-close {
          background: rgba(255,255,255,0.05); border: 1px solid var(--border);
          color: var(--text-secondary); border-radius: 8px;
          padding: 0.4rem; cursor: pointer !important; font-size: 1.2rem;
          display: flex; align-items: center; transition: all 0.2s;
          flex-shrink: 0; pointer-events: auto;
        }
        .cv-close:hover { background: rgba(239,68,68,0.15); border-color: #ef4444; color: #ef4444; }
        .cv-body { overflow-y: auto; padding: 1rem 2rem; flex: 1; }
        /* Override GameWorld .game-modal-inner > section padding */
        .cv-section {
          margin-bottom: 0.8rem !important;
          padding: 0 !important;
          min-height: unset !important;
        }
        .cv-section-title {
          font-size: 0.8rem; font-weight: 800; letter-spacing: 0.1em;
          color: var(--neon-purple); text-transform: uppercase;
          border-bottom: 1px solid rgba(168,85,247,0.2);
          padding-bottom: 0.4rem; margin-bottom: 0.8rem;
        }
        .cv-entry { margin-bottom: 0.9rem; }
        .cv-entry-compact {
          display: flex; justify-content: space-between; align-items: baseline;
          flex-wrap: wrap; gap: 0.2rem; font-size: 0.82rem;
        }
        .cv-entry-header {
          display: flex; justify-content: space-between; align-items: baseline;
          flex-wrap: wrap; gap: 0.2rem;
        }
        .cv-entry-header strong { font-size: 0.9rem; color: #fff; }
        .cv-entry-sub { font-size: 0.78rem; color: var(--neon-cyan); margin: 0.15rem 0; }
        .cv-entry-desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }
        .cv-date { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); white-space: nowrap; }
        .cv-skill-group { font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.3rem; }
        .cv-skill-cat { color: var(--neon-purple); font-weight: 700; margin-right: 0.4rem; }
        .cv-bullets {
          margin: 0.4rem 0 0.4rem 1rem; padding: 0;
          list-style: disc; color: var(--text-secondary); font-size: 0.8rem; line-height: 1.6;
        }
        .cv-bullets li { margin-bottom: 0.2rem; }
        .cv-tech {
          font-size: 0.72rem; font-family: var(--font-mono);
          color: var(--neon-cyan); margin-top: 0.3rem;
        }
        .cv-link {
          color: var(--neon-cyan); text-decoration: none; font-size: 0.78rem;
        }
        .cv-link:hover { text-decoration: underline; }
        .cv-footer {
          padding: 1rem 2rem; border-top: 1px solid var(--border);
          display: flex; justify-content: flex-end;
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
};

export default Hero;
