const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Cache — lives across invocations on warm servers
let enrollmentsCache = {}

// Fast enrollments using Supabase client + in-memory cache
router.get('/user/enrollments', async (req, res) => {
  const userId = req.user.id

  try {
    // Bypass joins entirely — use raw REST queries
    const { data: enrollments, error } = await supabaseAdmin
      .from('enrollments')
      .select('id, user_id, course_id, enrolled_at')
      .eq('user_id', userId)
      .limit(50)

    if (error) {
      console.error('Enrollments error:', error.message)
      return res.status(500).json({ error: error.message })
    }

    if (!enrollments || enrollments.length === 0) return res.json([])

    // Get unique course IDs
    const courseIds = [...new Set(enrollments.map(e => e.course_id))]
    
    // Batch fetch courses
    const { data: courses } = await supabaseAdmin
      .from('courses')
      .select('id, title, category, cover_image')
      .in('id', courseIds)

    const courseMap = {}
    if (courses) courses.forEach(c => { courseMap[c.id] = c })

    const result = enrollments.map(e => ({
      ...e,
      course: courseMap[e.course_id] || null
    }))

    // Cache for 30 seconds
    enrollmentsCache[userId] = { data: result, time: Date.now() }

    res.json(result)
  } catch (err) {
    console.error('Enrollments fatal:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// All courses
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
  // Clear cache on new enrollment
  delete enrollmentsCache[req.user.id]
  const { data } = await supabaseAdmin.from('enrollments')
    .upsert({ user_id: req.user.id, course_id: req.params.id }).select().single()
  res.json(data)
})

module.exports = router
