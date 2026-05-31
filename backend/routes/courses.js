const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Get user enrollments — NO JOINS, two fast queries
router.get('/user/enrollments', async (req, res) => {
  const userId = req.user.id

  try {
    // Query 1: Get enrollment IDs and course_ids (fast, no join)
    const { data: enrollments, error: enrError } = await supabaseAdmin
      .from('enrollments')
      .select('id, user_id, course_id, enrolled_at')
      .eq('user_id', userId)

    if (enrError) return res.status(500).json({ error: enrError.message })
    if (!enrollments || enrollments.length === 0) return res.json([])

    // Query 2: Get all course details in one batch (fast, single query)
    const courseIds = enrollments.map(e => e.course_id)
    const { data: courses, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, title, category, cover_image')
      .in('id', courseIds)

    if (courseError) return res.status(500).json({ error: courseError.message })

    // Combine them
    const courseMap = {}
    courses.forEach(c => { courseMap[c.id] = c })

    const result = enrollments.map(enr => ({
      ...enr,
      course: courseMap[enr.course_id] || null
    }))

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Get all published courses
router.get('/', async (req, res) => {
  const { data: courses, error } = await supabaseAdmin
    .from('courses')
    .select('*, modules(count)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(courses || [])
})

// Get single course
router.get('/:id', async (req, res) => {
  const { data: course, error } = await supabaseAdmin
    .from('courses')
    .select('*, modules(id, title, order_index, lessons(id, title, youtube_id, thumbnail, duration, order_index))')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  if (!course) return res.status(404).json({ error: 'Course not found' })

  course.modules.sort((a, b) => a.order_index - b.order_index)
  course.modules.forEach(m => m.lessons.sort((a, b) => a.order_index - b.order_index))

  res.json(course)
})

// Enroll
router.post('/:id/enroll', async (req, res) => {
  const userId = req.user.id
  const { data, error } = await supabaseAdmin
    .from('enrollments')
    .upsert({ user_id: userId, course_id: req.params.id })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
