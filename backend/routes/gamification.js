const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Get user dashboard stats
router.get('/stats', async (req, res) => {
  const userId = req.user.id

  // Get level & XP
  const { data: levelData } = await supabaseAdmin
    .from('user_levels')
    .select('*')
    .eq('user_id', userId)
    .single()

  // Get streak
  const { data: streakData } = await supabaseAdmin
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  // Get badges
  const { data: badgesData } = await supabaseAdmin
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })

  // Get enrolled courses count
  const { count: enrolledCount } = await supabaseAdmin
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get completed lessons count
  const { count: completedLessons } = await supabaseAdmin
    .from('lesson_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)

  // Get certificates count
  const { count: certCount } = await supabaseAdmin
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'unlocked')

  // Get recent activity
  const { data: recentActivity } = await supabaseAdmin
    .from('lesson_progress')
    .select('*, lesson:lessons(title, module:modules(title, course:courses(title)))')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false })
    .limit(5)

  // Get all enrolled courses with progress
  const { data: enrollments } = await supabaseAdmin
    .from('enrollments')
    .select('course:courses(id, title, cover_image, category)')
    .eq('user_id', userId)

  const coursesWithProgress = []
  if (enrollments) {
    for (const enrollment of enrollments) {
      const course = enrollment.course
      // Get total lessons
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
      coursesWithProgress.push({
        ...course,
        progress,
        completedLessons: completedCount,
        totalLessons
      })
    }
  }

  res.json({
    level: levelData || { level: 1, total_xp: 0 },
    streak: streakData || { current_streak: 0, longest_streak: 0 },
    badges: badgesData || [],
    enrolledCount: enrolledCount || 0,
    completedLessons: completedLessons || 0,
    certCount: certCount || 0,
    recentActivity: recentActivity || [],
    coursesWithProgress
  })
})

// Award XP
router.post('/xp', async (req, res) => {
  const userId = req.user.id
  const { amount, source, source_id } = req.body

  // Insert XP transaction
  await supabaseAdmin
    .from('xp_transactions')
    .insert({ user_id: userId, amount, source, source_id: source_id || null })

  // Update user level
  const { data: levelData } = await supabaseAdmin
    .from('user_levels')
    .select('*')
    .eq('user_id', userId)
    .single()

  const totalXp = (levelData?.total_xp || 0) + amount
  const newLevel = Math.floor(totalXp / 100) + 1

  await supabaseAdmin
    .from('user_levels')
    .upsert({
      user_id: userId,
      level: newLevel,
      total_xp: totalXp,
      updated_at: new Date().toISOString()
    })

  // Check for badges
  await checkAndAwardBadges(userId, totalXp)

  res.json({ xp_awarded: amount, total_xp: totalXp, level: newLevel })
})

// Update streak
router.post('/streak/update', async (req, res) => {
  const userId = req.user.id
  const today = new Date().toISOString().split('T')[0]

  const { data: streakData } = await supabaseAdmin
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!streakData) {
    // First activity ever
    await supabaseAdmin.from('streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today
    })
    return res.json({ current_streak: 1, longest_streak: 1 })
  }

  const lastDate = streakData.last_activity_date
  let newStreak = streakData.current_streak
  let longestStreak = streakData.longest_streak

  if (lastDate === today) {
    // Already active today
    return res.json({ current_streak: newStreak, longest_streak: longestStreak })
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (lastDate === yesterdayStr) {
    // Consecutive day
    newStreak += 1
    if (newStreak > longestStreak) longestStreak = newStreak
  } else {
    // Streak broken
    newStreak = 1
  }

  await supabaseAdmin
    .from('streaks')
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today
    })
    .eq('user_id', userId)

  // Check streak badges
  await checkStreakBadges(userId, newStreak)

  res.json({ current_streak: newStreak, longest_streak: longestStreak })
})

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('user_levels')
    .select('user_id, level, total_xp, user:profiles(full_name)')
    .order('total_xp', { ascending: false })
    .limit(20)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

async function checkAndAwardBadges(userId, totalXp) {
  // Milestone badges based on XP
  const badgeChecks = [
    { minXp: 10, badgeName: 'First Step' },
    { minXp: 100, badgeName: 'Knowledge Seeker' },
    { minXp: 500, badgeName: 'Halfway Hero' }
  ]

  for (const check of badgeChecks) {
    if (totalXp >= check.minXp) {
      await awardBadge(userId, check.badgeName)
    }
  }
}

async function checkStreakBadges(userId, streak) {
  if (streak >= 7) await awardBadge(userId, 'Week Warrior')
  if (streak >= 30) await awardBadge(userId, 'Consistent Learner')
}

async function awardBadge(userId, badgeName) {
  const { data: badge } = await supabaseAdmin
    .from('badges')
    .select('id')
    .eq('name', badgeName)
    .single()

  if (!badge) return

  // Check if already earned
  const { data: existing } = await supabaseAdmin
    .from('user_badges')
    .select('id')
    .eq('user_id', userId)
    .eq('badge_id', badge.id)
    .single()

  if (existing) return

  await supabaseAdmin
    .from('user_badges')
    .insert({ user_id: userId, badge_id: badge.id })
}

module.exports = router
