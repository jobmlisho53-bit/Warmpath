const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Get user enrollments — SIMPLE VERSION, no nested progress
router.get('/user/enrollments', async (req, res) => {
  const userId = req.user.id

  const { data, error } = await supabaseAdmin
    .from('enrollments')
    .select('*, course:courses(id, title, category, cover_image)')
    .eq('user_id', userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Get all published courses
router.get('/', async (req, res) => {
  const { data: courses, error } = await supabaseAdmin
    .from('courses')
    .select('*, modules(count)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(courses)
})

// Get single course with modules and lessons
router.get('/:id', async (req, res) => {
  const { data: course, error } = await supabaseAdmin
    .from('courses')
    .select('*, modules(id, title, order_index, lessons(id, title, youtube_id, thumbnail, duration, order_index))')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  if (!course) return res.status(404).json({ error: 'Course not found' })

  course.modules.sort((a, b) => a.order_index - b.order_index)
  course.modules.forEach(m => {
    m.lessons.sort((a, b) => a.order_index - b.order_index)
  })

  res.json(course)
})

// Enroll in a course
router.post('/:id/enroll', async (req, res) => {
  const userId = req.user.id
  const courseId = req.params.id

  const { data, error } = await supabaseAdmin
    .from('enrollments')
    .upsert({ user_id: userId, course_id: courseId })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
