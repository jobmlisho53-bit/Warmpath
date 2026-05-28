const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// No more role check — handled by adminAuthMiddleware

router.post('/courses', async (req, res) => {
  const { title, description, category, cover_image } = req.body
  const { data, error } = await supabaseAdmin
    .from('courses')
    .insert({ title, description, category, cover_image, status: 'published' })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/courses/:courseId/modules', async (req, res) => {
  const { title, order_index } = req.body
  const { data, error } = await supabaseAdmin
    .from('modules')
    .insert({ course_id: req.params.courseId, title, order_index })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/modules/:moduleId/lessons', async (req, res) => {
  const { title, youtube_url, youtube_id, thumbnail, duration, channel_name, order_index } = req.body
  const { data, error } = await supabaseAdmin
    .from('lessons')
    .insert({ module_id: req.params.moduleId, title, youtube_url, youtube_id, thumbnail, duration, channel_name, order_index })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.delete('/lessons/:lessonId', async (req, res) => {
  const { error } = await supabaseAdmin.from('lessons').delete().eq('id', req.params.lessonId)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

router.post('/seed-course', async (req, res) => {
  const { course, modules } = req.body
  const { data: courseData, error: courseError } = await supabaseAdmin
    .from('courses')
    .insert({ title: course.title, description: course.description || '', category: course.category || 'General', cover_image: course.cover_image || '', status: 'published' })
    .select()
    .single()
  if (courseError) return res.status(500).json({ error: courseError.message })

  for (let i = 0; i < modules.length; i++) {
    await supabaseAdmin.from('modules').insert({ course_id: courseData.id, title: modules[i].title, order_index: i })
  }
  res.json({ course: courseData })
})

module.exports = router
