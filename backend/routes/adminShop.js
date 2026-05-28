const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// No role check — handled by adminAuthMiddleware

router.get('/products', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('shop_products').select('*').order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/products', async (req, res) => {
  const { title, description, price, type, file_url, affiliate_url, gumroad_url, image_url, category, is_free, is_active } = req.body
  const { data, error } = await supabaseAdmin.from('shop_products').insert({
    title, description, price: price || 0, type: type || 'digital',
    file_url, affiliate_url, gumroad_url, image_url: image_url || '📦',
    category: category || 'General', is_free: is_free || false,
    is_active: is_active !== undefined ? is_active : true
  }).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.put('/products/:id', async (req, res) => {
  const updates = req.body
  const { data, error } = await supabaseAdmin.from('shop_products').update(updates).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.delete('/products/:id', async (req, res) => {
  await supabaseAdmin.from('shop_products').delete().eq('id', req.params.id)
  res.json({ success: true })
})

router.put('/products/:id/toggle', async (req, res) => {
  const { data: product } = await supabaseAdmin.from('shop_products').select('is_active').eq('id', req.params.id).single()
  const { data, error } = await supabaseAdmin.from('shop_products').update({ is_active: !product.is_active }).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.get('/orders', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('shop_orders').select('*, user:profiles(full_name, email), items:shop_order_items(*, product:shop_products(title))').order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
