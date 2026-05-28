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

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Public routes
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

app.get('/api/shop/products/:id', (req, res) => {
  const supabaseAdmin = require('./supabaseAdmin');
  supabaseAdmin.from('shop_products').select('*').eq('id', req.params.id).single()
    .then(({ data, error }) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    });
});

// Protected routes (student auth)
app.use('/api/courses', authMiddleware, coursesRouter);
app.use('/api/progress', authMiddleware, progressRouter);
app.use('/api/payments', authMiddleware, paymentsRouter);
app.use('/api/certificates', authMiddleware, certificatesRouter);
app.use('/api/gamification', authMiddleware, gamificationRouter);
app.use('/api/community', authMiddleware, communityRouter);
app.use('/api/shop', authMiddleware, shopRouter);

// Admin protected routes (admin auth)
app.use('/api/admin', adminAuthMiddleware, adminRouter);
app.use('/api/admin/shop', adminAuthMiddleware, adminShopRouter);

app.get('/', (req, res) => {
  res.json({ message: 'WarmPath API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
