const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Get user's certificate for a specific course
router.get('/course/:courseId', async (req, res) => {
  const userId = req.user.id
  const courseId = req.params.courseId

  // Get certificate
  const { data: cert, error } = await supabaseAdmin
    .from('certificates')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('status', 'unlocked')
    .single()

  if (error || !cert) {
    return res.status(404).json({ error: 'Certificate not found' })
  }

  // Get course details separately
  const { data: course } = await supabaseAdmin
    .from('courses')
    .select('title, category, cover_image')
    .eq('id', courseId)
    .single()

  // Get user profile separately
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single()

  res.json({
    ...cert,
    course: course || null,
    user: profile || null
  })
})

// Public verification — no auth required
router.get('/verify/:code', async (req, res) => {
  const { code } = req.params

  const { data: cert, error } = await supabaseAdmin
    .from('certificates')
    .select('*')
    .eq('verification_code', code)
    .eq('status', 'unlocked')
    .single()

  if (error || !cert) {
    return res.status(404).json({ error: 'Certificate not found or invalid' })
  }

  const { data: course } = await supabaseAdmin
    .from('courses')
    .select('title, category, cover_image')
    .eq('id', cert.course_id)
    .single()

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', cert.user_id)
    .single()

  res.json({
    verified: true,
    student_name: profile?.full_name || 'Learner',
    course_title: course?.title,
    course_category: course?.category,
    course_icon: course?.cover_image,
    issued_date: cert.issued_at,
    verification_code: cert.verification_code
  })
})

module.exports = router
