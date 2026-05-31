const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

router.get('/user/enrollments', async (req, res) => {
  const userId = req.user.id

  // Two fast queries — no Supabase joins
  const { data: enrollments } = await supabaseAdmin
    .from('enrollments')
    .select('id, user_id, course_id, enrolled_at')
    .eq('user_id', userId)

  if (!enrollments || enrollments.length === 0) return res.json([])

  const courseIds = enrollments.map(e => e.course_id)
  const { data: courses } = await supabaseAdmin
    .from('courses')
    .select('id, title, category, cover_image')
    .in('id', courseIds)

  const map = {}
  if (courses) courses.forEach(c => { map[c.id] = c })

  res.json(enrollments.map(e => ({ ...e, course: map[e.course_id] || null })))
})

router.get('/', async (req, res) => {
  const { data } = await supabaseAdmin.from('courses').select('*, modules(count)').eq('status', 'published')
  res.json(data || [])
})

router.get('/:id', async (req, res) => {
  const { data: course } = await supabaseAdmin.from('courses')
    .select('*, modules(id, title, order_index, lessons(id, title, youtube_id, thumbnail, duration, order_index))')
    .eq('id', req.params.id).single()
  if (!course) return res.status(404).json({ error: 'Not found' })
  course.modules.sort((a, b) => a.order_index - b.order_index)
  course.modules.forEach(m => m.lessons.sort((a, b) => a.order_index - b.order_index))
  res.json(course)
})

router.post('/:id/enroll', async (req, res) => {
  const { data } = await supabaseAdmin.from('enrollments')
    .upsert({ user_id: req.user.id, course_id: req.params.id }).select().single()
  res.json(data)
})

module.exports = router
