const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:3000', 
    'https://agamjindal.vercel.app',
    /\.vercel\.app$/ // Matches all Vercel preview/production links
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Run without DB for local dev
  }
};
connectDB();

// Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/stats', require('./routes/stats'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎮 agam Portfolio API is live!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
