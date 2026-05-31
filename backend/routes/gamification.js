const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Fast dashboard stats — no nested loops
router.get('/stats', async (req, res) => {
  const userId = req.user.id

  // Parallel simple queries
  const [
    { data: levelData },
    { data: streakData },
    { data: badgesData },
    { count: enrolledCount },
    { count: completedLessons },
    { count: certCount },
  ] = await Promise.all([
    supabaseAdmin.from('user_levels').select('*').eq('user_id', userId).single(),
    supabaseAdmin.from('streaks').select('*').eq('user_id', userId).single(),
    supabaseAdmin.from('user_badges').select('*, badge:badges(*)').eq('user_id', userId).order('earned_at', { ascending: false }),
    supabaseAdmin.from('enrollments').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseAdmin.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('completed', true),
    supabaseAdmin.from('certificates').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'unlocked'),
  ])

  res.json({
    level: levelData || { level: 1, total_xp: 0 },
    streak: streakData || { current_streak: 0, longest_streak: 0 },
    badges: badgesData || [],
    enrolledCount: enrolledCount || 0,
    completedLessons: completedLessons || 0,
    certCount: certCount || 0,
    recentActivity: [],
    coursesWithProgress: []
  })
})

router.post('/streak/update', async (req, res) => {
  const userId = req.user.id
  const today = new Date().toISOString().split('T')[0]

  const { data: streakData } = await supabaseAdmin
    .from('streaks').select('*').eq('user_id', userId).single()

  if (!streakData) {
    await supabaseAdmin.from('streaks').insert({
      user_id: userId, current_streak: 1, longest_streak: 1, last_activity_date: today
    })
    return res.json({ current_streak: 1, longest_streak: 1 })
  }

  if (streakData.last_activity_date === today) {
    return res.json({ current_streak: streakData.current_streak, longest_streak: streakData.longest_streak })
  }

  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak = streakData.current_streak
  let longest = streakData.longest_streak

  if (streakData.last_activity_date === yesterdayStr) {
    newStreak += 1
    if (newStreak > longest) longest = newStreak
  } else {
    newStreak = 1
  }

  await supabaseAdmin.from('streaks').update({
    current_streak: newStreak, longest_streak: longest, last_activity_date: today
  }).eq('user_id', userId)

  res.json({ current_streak: newStreak, longest_streak: longest })
})

module.exports = router
