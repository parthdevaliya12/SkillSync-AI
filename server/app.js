const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security middleware with relaxed crossOriginResourcePolicy for cross-origin API calls from Vercel
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Robust CORS config supporting local development & live Vercel deployments
const allowedOrigins = [
  'https://skills-sync-ai.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
    : [])
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, Postman, server-to-server health checks)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');
    const isAllowed =
      allowedOrigins.some((allowed) => allowed.replace(/\/$/, '') === cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/', limiter);

// AI routes get stricter rate limiting
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many AI requests. Please slow down.' }
});
app.use('/api/ai/', aiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root health & server status for Render
app.get('/', (req, res) => {
  res.json({
    name: 'SkillSync AI - Backend API Engine',
    status: 'online',
    version: '1.0.0',
    liveFrontend: 'https://skills-sync-ai.vercel.app',
    liveBackend: 'https://skillsync-ai-yp0s.onrender.com',
    healthCheck: '/api/health',
    endpoints: '/api'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillSync AI API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Root summary
app.get('/api', (req, res) => {
  res.json({
    message: 'SkillSync AI REST API operational',
    endpoints: [
      '/api/auth',
      '/api/skills',
      '/api/jobs',
      '/api/skill-gap',
      '/api/roadmaps',
      '/api/ai',
      '/api/dashboard',
      '/api/health'
    ]
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found.' });
  }
  next();
});

// Error handler
app.use(errorHandler);

module.exports = app;
