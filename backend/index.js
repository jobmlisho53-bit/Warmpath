const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const coursesRouter = require('./routes/courses');
const progressRouter = require('./routes/progress');
const youtubeRouter = require('./routes/youtube');
const adminRouter = require('./routes/admin');
const paymentsRouter = require('./routes/payments');
const certificatesRouter = require('./routes/certificates');
const gamificationRouter = require('./routes/gamification');
const profilesRouter = require('./routes/profiles');
const communityRouter = require('./routes/community');
const shopRouter = require('./routes/shop');
const adminShopRouter = require('./routes/adminShop');
const { router: adminAuthRouter, adminAuthMiddleware } = require('./routes/adminAuth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://warmpath.vercel.app',
    'https://warmpath-three.vercel.app',
    'https://warmpath-seven.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ============================================
// RATE LIMITING
// ============================================

// General API limiter — 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter — 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin login limiter — 5 attempts per 15 minutes
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many admin login attempts.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general limiter to all API routes
app.use('/api', generalLimiter);

// Stricter limits for auth routes
app.use('/api/admin/auth/login', adminLimiter);

// ============================================
// PUBLIC ROUTES
// ============================================

app.use('/api/youtube', youtubeRouter);
app.use('/api/certificates/verify', certificatesRouter);
app.use('/api/profiles/public', profilesRouter);
app.use('/api/admin/auth', adminAuthRouter);

// Shop public
app.get('/api/shop/products', (req, res) => {
  const supabaseAdmin = require('./supabaseAdmin');
  const { category } = req.query;
  let query = supabaseAdmin.from('shop_products').select('*').eq('is_active', true).order('created_at', { ascending: false });
  if (category) query = query.eq('category', category);
  query.then(({ data, error }) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });
});

// Courses
app.get('/api/courses/user/enrollments', authMiddleware, (req, res, next) => {
  req.url = '/user/enrollments';
  coursesRouter(req, res, next);
});
app.use('/api/courses', coursesRouter);

// Community public read
app.get('/api/community/courses/:courseId/discussions', (req, res) => {
  const supabaseAdmin = require('./supabaseAdmin');
  supabaseAdmin.from('discussions').select('*').eq('course_id', req.params.courseId)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    });
});

// ============================================
// PROTECTED ROUTES
// ============================================

app.use('/api/progress', authMiddleware, progressRouter);
app.use('/api/payments', authMiddleware, paymentsRouter);
app.use('/api/certificates', authMiddleware, certificatesRouter);
app.use('/api/gamification', authMiddleware, gamificationRouter);
app.post('/api/community/courses/:courseId/discussions', authMiddleware, communityRouter);
app.post('/api/community/discussions/:id/replies', authMiddleware, communityRouter);
app.use('/api/shop', authMiddleware, shopRouter);

// ============================================
// ADMIN ROUTES
// ============================================

app.use('/api/admin', adminAuthMiddleware, adminRouter);
app.use('/api/admin/shop', adminAuthMiddleware, adminShopRouter);

// ============================================
// ROOT
// ============================================

app.get('/', (req, res) => {
  res.json({ message: 'WarmPath API is running' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'WarmPath API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
