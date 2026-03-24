import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiSend, FiMail, FiGithub, FiLinkedin, FiPhone } from 'react-icons/fi';
import { personalInfo } from '../utils/data';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/contact';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post(API_URL, form, { timeout: 6000 });
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      // If server is down or no DB, still give user a way to reach out
      setStatus('error');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  const contactLinks = [
    { icon: <FiMail />, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}`, external: false },
    { icon: <FiGithub />, label: 'GitHub', value: 'kritisingh7488', href: personalInfo.github, external: true },
    { icon: <FiLinkedin />, label: 'LinkedIn', value: 'kritisingh7488', href: personalInfo.linkedin, external: true },
    { icon: <FiPhone />, label: 'Phone', value: personalInfo.phone, href: `tel:${personalInfo.phone}`, external: false },
  ];

  return (
    <section id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">📬 Send a Message</h2>
          <p className="section-subtitle">// initiate_contact.sh — drop a message, I respond fast!</p>
        </motion.div>

        <div className="contact-grid">
          {/* Left: Info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="contact-header-card card">
              <div className="contact-status">
                <span className="status-dot" />
                <span>Open to Opportunities</span>
              </div>
              <h3>Let's Build Something Together</h3>
              <p>Whether it's a collaboration, internship, or just a hello — feel free to reach out. I'm always excited to connect with fellow devs and recruiters!</p>
            </div>

            <div className="contact-links">
              {contactLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="contact-link card"
                >
                  <div className="contact-link-icon">{link.icon}</div>
                  <div>
                    <div className="contact-link-label">{link.label}</div>
                    <div className="contact-link-value">{link.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form className="contact-form card" onSubmit={handleSubmit}>
              <div className="form-header">
                <span className="neon-text-purple">$</span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  &nbsp;new Message()
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name..."
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="form-input form-textarea"
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn-primary submit-btn ${status === 'loading' ? 'loading' : ''}`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <><span className="spinner" /> Sending...</>
                ) : status === 'success' ? (
                  <>✅ Message Sent! I'll be in touch soon 🚀</>
                ) : status === 'error' ? (
                  <>❌ Server offline — email me directly!</>
                ) : (
                  <><FiSend /> Send Message</>
                )}
              </button>
              {status === 'error' && (
                <a
                  href={`mailto:${personalInfo.email}?subject=Hello Kriti!`}
                  className="btn-secondary submit-btn"
                  style={{ textAlign: 'center', justifyContent: 'center', marginTop: '0.25rem' }}
                >
                  <FiMail /> Email Me Directly
                </a>
              )}
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="footer-note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="glow-divider" />
          <p>Built with ❤️ using <span className="neon-text-purple">MongoDB</span> · <span className="neon-text-cyan">Express</span> · <span className="neon-text-green">React</span> · <span className="neon-text-purple">Node.js</span> — by Kumari Kriti Singh © 2025</p>
        </motion.div>
      </div>

      <style>{`
        .contact-grid {
          display: grid; grid-template-columns: 1fr 1.3fr;
          gap: 2rem; margin-bottom: 3rem;
        }
        .contact-header-card {
          margin-bottom: 1.25rem;
        }
        .contact-status {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; color: var(--neon-green);
          margin-bottom: 0.75rem;
          padding: 0.25rem 0.6rem;
          background: rgba(74, 222, 128, 0.08);
          border: 1px solid rgba(74, 222, 128, 0.25);
          border-radius: 999px; width: fit-content;
        }
        .contact-header-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.6rem; }
        .contact-header-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }
        .contact-links { display: flex; flex-direction: column; gap: 0.75rem; }
        .contact-link {
          display: flex; align-items: center; gap: 0.9rem;
          transition: var(--transition); color: var(--text-primary);
        }
        .contact-link:hover { border-color: var(--neon-purple); }
        .contact-link-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(168,85,247,.1); display: flex;
          align-items: center; justify-content: center;
          font-size: 1.1rem; color: var(--neon-purple);
          flex-shrink: 0;
        }
        .contact-link-label { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); }
        .contact-link-value { font-size: 0.85rem; font-weight: 500; }
        .contact-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-header {
          font-family: var(--font-mono); font-size: 0.9rem;
          padding-bottom: 0.75rem; border-bottom: 1px solid var(--border);
        }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-label {
          font-size: 0.78rem; font-weight: 600; font-family: var(--font-mono);
          color: var(--text-secondary); letter-spacing: 0.06em;
        }
        .form-input {
          background: rgba(255,255,255,.03);
          border: 1px solid var(--border); border-radius: 10px;
          padding: 0.7rem 0.9rem;
          color: var(--text-primary); font-size: 0.9rem;
          transition: var(--transition); outline: none; resize: none;
        }
        .form-input:focus { border-color: var(--neon-purple); box-shadow: 0 0 0 3px rgba(168,85,247,.1); }
        .form-input::placeholder { color: var(--text-muted); }
        .submit-btn { width: 100%; justify-content: center; gap: 0.5rem; }
        .submit-btn.loading { opacity: 0.7; }
        .spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: white;
          animation: spin 0.6s linear infinite; display: inline-block;
        }
        .footer-note { text-align: center; color: var(--text-muted); font-size: 0.85rem; padding-bottom: 2rem; }
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
};

export default Contact;
