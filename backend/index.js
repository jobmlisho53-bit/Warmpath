const express = require('express');
const cors = require('cors');
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
// PUBLIC ROUTES — No auth required
// ============================================

// YouTube metadata
app.use('/api/youtube', youtubeRouter);

// Certificate verification
app.use('/api/certificates/verify', certificatesRouter);

// Public profiles & leaderboard
app.use('/api/profiles/public', profilesRouter);

// Admin auth
app.use('/api/admin/auth', adminAuthRouter);

// Courses — public for guest browsing
app.use('/api/courses', coursesRouter);

// Shop products — public
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

app.get('/api/shop/products/:id', (req, res) => {
  const supabaseAdmin = require('./supabaseAdmin');
  supabaseAdmin.from('shop_products').select('*').eq('id', req.params.id).single()
    .then(({ data, error }) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    });
});

// Community discussions — public read-only
app.get('/api/community/courses/:courseId/discussions', (req, res) => {
  const supabaseAdmin = require('./supabaseAdmin');
  supabaseAdmin
    .from('discussions')
    .select('*')
    .eq('course_id', req.params.courseId)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    });
});

app.get('/api/community/discussions/:id', (req, res) => {
  const supabaseAdmin = require('./supabaseAdmin');
  supabaseAdmin
    .from('discussions')
    .select('*')
    .eq('id', req.params.id)
    .single()
    .then(async ({ data: discussion, error }) => {
      if (error) return res.status(500).json({ error: error.message });
      const { data: replies } = await supabaseAdmin
        .from('replies')
        .select('*')
        .eq('discussion_id', req.params.id)
        .order('created_at', { ascending: true });
      res.json({ ...discussion, replies: replies || [] });
    });
});

// ============================================
// PROTECTED ROUTES — Auth required
// ============================================

// Progress tracking
app.use('/api/progress', authMiddleware, progressRouter);

// Payments
app.use('/api/payments', authMiddleware, paymentsRouter);

// Certificates (user's own)
app.use('/api/certificates', authMiddleware, certificatesRouter);

// Gamification
app.use('/api/gamification', authMiddleware, gamificationRouter);

// Community write actions
app.post('/api/community/courses/:courseId/discussions', authMiddleware, (req, res, next) => {
  req.url = `/courses/${req.params.courseId}/discussions`;
  communityRouter(req, res, next);
});

app.post('/api/community/discussions/:id/replies', authMiddleware, (req, res, next) => {
  req.url = `/discussions/${req.params.id}/replies`;
  communityRouter(req, res, next);
});

// Shop cart, checkout, downloads
app.use('/api/shop', authMiddleware, shopRouter);

// Admin routes
app.use('/api/admin', adminAuthMiddleware, adminRouter);
app.use('/api/admin/shop', adminAuthMiddleware, adminShopRouter);

app.get('/', (req, res) => {
  res.json({ message: 'WarmPath API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
