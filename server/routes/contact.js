const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// In-memory fallback
const inbox = [];

// Build transporter (lazy — only if creds are set)
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASS;
  if (!user) {
    console.warn('⚠️  EMAIL_USER is not defined in env.');
    return null;
  }
  if (!pass || pass === 'your_gmail_app_password_here') {
    console.warn('⚠️  EMAIL_APP_PASS is not defined or is default placeholder.');
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

const sendEmailNotification = async ({ name, email, message }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('📧 Email not configured properly — skipping notification. Check your Render Environment Variables!');
    return;
  }
  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;
  console.log(`📤 Attempting to send email from ${process.env.EMAIL_USER} to ${to}...`);

  // Beautiful HTML email
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #080b14; color: #f0f6fc; margin: 0; padding: 0; }
        .wrapper { max-width: 580px; margin: 40px auto; }
        .header {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          padding: 32px; border-radius: 16px 16px 0 0; text-align: center;
        }
        .header h1 { margin: 0; font-size: 24px; color: white; }
        .header p { margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.8); }
        .body {
          background: #111827; padding: 32px;
          border: 1px solid rgba(168,85,247,0.2); border-top: none;
          border-radius: 0 0 16px 16px;
        }
        .field { margin-bottom: 20px; }
        .label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #a855f7; text-transform: uppercase; margin-bottom: 6px; }
        .value {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.2);
          border-radius: 10px; padding: 12px 16px; font-size: 15px; line-height: 1.6;
          color: #f0f6fc;
        }
        .tag {
          display: inline-block; background: rgba(168,85,247,0.15);
          border: 1px solid rgba(168,85,247,0.4); border-radius: 999px;
          font-size: 12px; padding: 3px 12px; color: #d8b4fe;
        }
        .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #4a5568; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>🎮 New Message Incoming!</h1>
          <p>Someone reached out via your portfolio</p>
        </div>
        <div class="body">
          <div class="field">
            <div class="label">From</div>
            <div class="value">${name} &nbsp;<span class="tag">sender</span></div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${email}" style="color:#22d3ee;">${email}</a></div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${message.replace(/\n/g, '<br/>')}</div>
          </div>
        </div>
        <div class="footer">
          Sent via agam.dev portfolio • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"agam Portfolio 🎮" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `📬 New message from ${name} — agam.dev`,
    html,
  });
  console.log(`✅ Email notification sent to ${to}`);
};

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (message.length < 5) {
    return res.status(400).json({ error: 'Message is too short.' });
  }

  const entry = { name, email, message, createdAt: new Date() };

  // Save to MongoDB if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const Contact = require('../models/Contact');
      await new Contact(entry).save();
      console.log(`💾 Saved to DB: message from ${name}`);
    } catch (err) {
      console.warn('⚠️  DB save failed, falling back to memory.');
      inbox.push(entry);
    }
  } else {
    inbox.push(entry);
    console.log('📬 Stored in memory (no DB):', { name, email });
  }

  // Send email notification (Wait for it to finish for debugging)
  try {
    await sendEmailNotification({ name, email, message });
    return res.status(200).json({
      success: true,
      message: `Thanks ${name}! Your message is on its way 🚀`,
    });
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    // Even if email fails, we return success so the user feels good, 
    // but the SERVER logs will now definitely show the error.
    return res.status(200).json({
      success: true,
      message: `Thanks ${name}! Your message (saved) is being processed. 🚀`,
    });
  }
});

// GET /api/contact/config-check (Hidden debug route)
router.get('/config-check', (req, res) => {
  res.json({
    emailUserSet: !!process.env.EMAIL_USER,
    emailPassSet: !!process.env.EMAIL_APP_PASS,
    emailToSet: !!process.env.EMAIL_TO,
    nodeEnv: process.env.NODE_ENV,
    mongoReady: mongoose.connection.readyState,
    currentTime: new Date().toISOString()
  });
});

// GET /api/contact (dev utility)
router.get('/', (req, res) => res.json({ count: inbox.length, messages: inbox }));

module.exports = router;
