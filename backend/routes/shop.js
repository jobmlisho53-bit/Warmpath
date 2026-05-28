const express = require('express')
const axios = require('axios')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY

// PUBLIC ROUTES — no auth needed

// Get all active products
router.get('/products', async (req, res) => {
  const { category } = req.query
  let query = supabaseAdmin.from('shop_products').select('*').eq('is_active', true).order('created_at', { ascending: false })
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Get single product
router.get('/products/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('shop_products').select('*').eq('id', req.params.id).single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// PROTECTED ROUTES — auth required
router.use((req, res, next) => {
  // This middleware only applies to routes defined after it
  next()
})

// Get user's cart
router.get('/cart', async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Auth required' })
  const { data, error } = await supabaseAdmin
    .from('shop_cart_items')
    .select('*, product:shop_products(*)')
    .eq('user_id', userId)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Add to cart
router.post('/cart', async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Auth required' })
  const { product_id, quantity } = req.body

  const { data, error } = await supabaseAdmin
    .from('shop_cart_items')
    .upsert({ user_id: userId, product_id, quantity: quantity || 1 }, { onConflict: 'user_id,product_id' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Update cart quantity
router.put('/cart/:id', async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Auth required' })
  const { quantity } = req.body

  if (quantity < 1) {
    await supabaseAdmin.from('shop_cart_items').delete().eq('id', req.params.id).eq('user_id', userId)
    return res.json({ removed: true })
  }

  const { data, error } = await supabaseAdmin
    .from('shop_cart_items')
    .update({ quantity })
    .eq('id', req.params.id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Remove from cart
router.delete('/cart/:id', async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Auth required' })
  await supabaseAdmin.from('shop_cart_items').delete().eq('id', req.params.id).eq('user_id', userId)
  res.json({ success: true })
})

// Checkout
router.post('/checkout', async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Auth required' })

  const { data: cartItems } = await supabaseAdmin
    .from('shop_cart_items')
    .select('*, product:shop_products(*)')
    .eq('user_id', userId)

  if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' })

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const { data: profile } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single()

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: profile?.email || req.user.email,
        amount: Math.round(total * 100),
        currency: 'KES',
        metadata: { user_id: userId }
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}`, 'Content-Type': 'application/json' } }
    )

    const { data: order } = await supabaseAdmin.from('shop_orders').insert({
      user_id: userId, total_amount: total, status: 'pending', payment_reference: response.data.data.reference
    }).select().single()

    for (const item of cartItems) {
      await supabaseAdmin.from('shop_order_items').insert({
        order_id: order.id, product_id: item.product_id, price: item.product.price, quantity: item.quantity
      })
    }

    res.json({ authorization_url: response.data.data.authorization_url, reference: response.data.data.reference, total, order_id: order.id })
  } catch (error) {
    res.status(500).json({ error: 'Payment initialization failed' })
  }
})

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Auth required' })
  const { reference } = req.params

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
    })

    if (response.data.data.status === 'success') {
      const { data: order } = await supabaseAdmin
        .from('shop_orders')
        .update({ status: 'completed', paystack_reference: reference })
        .eq('payment_reference', reference)
        .select()
        .single()

      const { data: orderItems } = await supabaseAdmin.from('shop_order_items').select('*').eq('order_id', order.id)

      for (const item of orderItems) {
        await supabaseAdmin.from('shop_downloads').upsert(
          { user_id: userId, product_id: item.product_id, order_id: order.id },
          { onConflict: 'user_id,product_id,order_id' }
        )
      }

      await supabaseAdmin.from('shop_cart_items').delete().eq('user_id', userId)
      res.json({ status: 'success', order_id: order.id })
    } else {
      res.json({ status: 'pending' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' })
  }
})

// Get downloads
router.get('/downloads', async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Auth required' })
  const { data, error } = await supabaseAdmin
    .from('shop_downloads')
    .select('*, product:shop_products(title, image_url, category)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Get download URL
router.get('/download/:productId', async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Auth required' })
  const productId = req.params.productId

  const { data: product } = await supabaseAdmin.from('shop_products').select('*').eq('id', productId).single()

  if (product?.is_free) {
    return res.json({ download_url: product.file_url, title: product.title })
  }

  const { data: download } = await supabaseAdmin
    .from('shop_downloads')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (!download) return res.status(403).json({ error: 'You have not purchased this product' })

  await supabaseAdmin
    .from('shop_downloads')
    .update({ download_count: download.download_count + 1, last_downloaded: new Date().toISOString() })
    .eq('id', download.id)

  res.json({ download_url: product?.file_url, title: product?.title })
})

// Get orders
router.get('/orders', async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Auth required' })
  const { data, error } = await supabaseAdmin
    .from('shop_orders')
    .select('*, items:shop_order_items(*, product:shop_products(title, image_url))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
