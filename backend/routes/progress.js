const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

router.post('/lessons/:lessonId/toggle', async (req, res) => {
  const userId = req.user.id
  const lessonId = req.params.lessonId

  const { data: existing } = await supabaseAdmin
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('lesson_progress')
      .update({
        completed: !existing.completed,
        completed_at: !existing.completed ? new Date().toISOString() : null
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })

    // Award XP if newly completed
    if (!existing.completed) {
      await awardXp(userId, 10, 'lesson_completed', lessonId)
      await updateStreak(userId)
    }

    return res.json(data)
  } else {
    const { data, error } = await supabaseAdmin
      .from('lesson_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })

    await awardXp(userId, 10, 'lesson_completed', lessonId)
    await updateStreak(userId)

    return res.json(data)
  }
})

router.get('/courses/:courseId', async (req, res) => {
  const userId = req.user.id
  const courseId = req.params.courseId

  const { data: course } = await supabaseAdmin
    .from('courses')
    .select('id, modules(lessons(id))')
    .eq('id', courseId)
    .single()

  if (!course) return res.status(404).json({ error: 'Course not found' })

  const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id))
  if (allLessonIds.length === 0) {
    return res.json({ total: 0, completed: 0, percentage: 0, completedIds: [] })
  }

  const { data: progress } = await supabaseAdmin
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('completed', true)
    .in('lesson_id', allLessonIds)

  const completedIds = progress.map(p => p.lesson_id)
  const total = allLessonIds.length
  const completed = completedIds.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  // Check if course just hit 100% — award badge
  if (percentage === 100) {
    await awardBadgeIfNotExists(userId, 'Course Champion')
  } else if (percentage >= 50) {
    await awardBadgeIfNotExists(userId, 'Halfway Hero')
  }

  res.json({ total, completed, percentage, completedIds })
})

async function awardXp(userId, amount, source, sourceId) {
  await supabaseAdmin.from('xp_transactions').insert({
    user_id: userId, amount, source, source_id: sourceId
  })

  const { data: levelData } = await supabaseAdmin
    .from('user_levels')
    .select('*')
    .eq('user_id', userId)
    .single()

  const totalXp = (levelData?.total_xp || 0) + amount
  const newLevel = Math.floor(totalXp / 100) + 1

  await supabaseAdmin.from('user_levels').upsert({
    user_id: userId, level: newLevel, total_xp: totalXp, updated_at: new Date().toISOString()
  })
}

async function updateStreak(userId) {
  const today = new Date().toISOString().split('T')[0]
  const { data: streakData } = await supabaseAdmin
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!streakData) {
    await supabaseAdmin.from('streaks').insert({
      user_id: userId, current_streak: 1, longest_streak: 1, last_activity_date: today
    })
    return
  }

  if (streakData.last_activity_date === today) return

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak = streakData.current_streak
  let longestStreak = streakData.longest_streak

  if (streakData.last_activity_date === yesterdayStr) {
    newStreak += 1
    if (newStreak > longestStreak) longestStreak = newStreak
  } else {
    newStreak = 1
  }

  await supabaseAdmin.from('streaks').update({
    current_streak: newStreak, longest_streak: longestStreak, last_activity_date: today
  }).eq('user_id', userId)
}

async function awardBadgeIfNotExists(userId, badgeName) {
  const { data: badge } = await supabaseAdmin.from('badges').select('id').eq('name', badgeName).single()
  if (!badge) return

  const { data: existing } = await supabaseAdmin.from('user_badges')
    .select('id').eq('user_id', userId).eq('badge_id', badge.id).single()
  if (existing) return

  await supabaseAdmin.from('user_badges').insert({ user_id: userId, badge_id: badge.id })
}

module.exports = router
