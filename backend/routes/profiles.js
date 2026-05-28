const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Get public profile by user ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name, avatar_url, created_at')
    .eq('id', userId)
    .single()

  if (!profile) return res.status(404).json({ error: 'Profile not found' })

  const { data: level } = await supabaseAdmin
    .from('user_levels')
    .select('level, total_xp')
    .eq('user_id', userId)
    .single()

  const { data: badges } = await supabaseAdmin
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })

  const { data: certificates } = await supabaseAdmin
    .from('certificates')
    .select('*, course:courses(title, category, cover_image)')
    .eq('user_id', userId)
    .eq('status', 'unlocked')
    .order('issued_at', { ascending: false })

  const { data: enrollments } = await supabaseAdmin
    .from('enrollments')
    .select('course:courses(id, title, cover_image, category)')
    .eq('user_id', userId)

  const coursesWithProgress = []
  if (enrollments) {
    for (const enrollment of enrollments) {
      const course = enrollment.course
      const { data: modules } = await supabaseAdmin
        .from('modules')
        .select('id')
        .eq('course_id', course.id)

      let totalLessons = 0
      let completedCount = 0

      for (const mod of modules) {
        const { count: lessonCount } = await supabaseAdmin
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('module_id', mod.id)
        totalLessons += lessonCount

        const { data: lessons } = await supabaseAdmin
          .from('lessons')
          .select('id')
          .eq('module_id', mod.id)

        const lessonIds = lessons.map(l => l.id)
        const { count: done } = await supabaseAdmin
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('completed', true)
          .in('lesson_id', lessonIds)
        completedCount += done
      }

      const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
      coursesWithProgress.push({ ...course, progress, completedLessons: completedCount, totalLessons })
    }
  }

  const { data: streak } = await supabaseAdmin
    .from('streaks')
    .select('current_streak, longest_streak')
    .eq('user_id', userId)
    .single()

  const { count: totalCompleted } = await supabaseAdmin
    .from('lesson_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)

  res.json({
    profile,
    level: level || { level: 1, total_xp: 0 },
    badges: badges || [],
    certificates: certificates || [],
    coursesWithProgress,
    streak: streak || { current_streak: 0, longest_streak: 0 },
    totalCompleted: totalCompleted || 0
  })
})

// Get leaderboard
router.get('/leaderboard/data', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('user_levels')
    .select('user_id, level, total_xp, user:profiles(full_name)')
    .order('total_xp', { ascending: false })
    .limit(20)

  if (error) return res.status(500).json({ error: error.message })

  const leaderboard = []
  for (const entry of data) {
    const { data: streakData } = await supabaseAdmin
      .from('streaks')
      .select('current_streak')
      .eq('user_id', entry.user_id)
      .single()

    leaderboard.push({
      ...entry,
      current_streak: streakData?.current_streak || 0
    })
  }

  res.json(leaderboard)
})

module.exports = router
