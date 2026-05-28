const supabaseAdmin = require('../supabaseAdmin')

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  const token = authHeader.split(' ')[1]

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    console.log('Auth failed:', error?.message)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = user
  next()
}

module.exports = authMiddleware
