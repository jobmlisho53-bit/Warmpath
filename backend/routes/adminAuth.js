const express = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Simple token store (in production, use Redis or DB)
const adminTokens = {}

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }

  // Find admin user
  const { data: admin, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()

  if (error || !admin) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, admin.password_hash)
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  // Generate token
  const token = crypto.randomBytes(32).toString('hex')
  adminTokens[token] = {
    id: admin.id,
    username: admin.username,
    full_name: admin.full_name,
    expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }

  res.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      full_name: admin.full_name
    }
  })
})

// Verify token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token || !adminTokens[token]) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (adminTokens[token].expires < Date.now()) {
    delete adminTokens[token]
    return res.status(401).json({ error: 'Token expired' })
  }

  res.json({ admin: adminTokens[token] })
})

// Logout
router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) delete adminTokens[token]
  res.json({ success: true })
})

// Middleware to protect admin routes
function adminAuthMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token || !adminTokens[token]) {
    return res.status(401).json({ error: 'Admin authentication required' })
  }

  if (adminTokens[token].expires < Date.now()) {
    delete adminTokens[token]
    return res.status(401).json({ error: 'Token expired' })
  }

  req.admin = adminTokens[token]
  next()
}

module.exports = { router, adminAuthMiddleware }
