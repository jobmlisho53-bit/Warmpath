require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const USERS = [
  { name: 'Amara K.',     email: 'amara@learner.com',     xp: 2840, streak: 42, level: 28, badges: ['Course Champion','Week Warrior','Consistent Learner','Knowledge Seeker'] },
  { name: 'Brian O.',     email: 'brian@learner.com',     xp: 2150, streak: 31, level: 21, badges: ['Course Champion','Week Warrior','Halfway Hero'] },
  { name: 'Cynthia W.',   email: 'cynthia@learner.com',   xp: 1890, streak: 18, level: 18, badges: ['Course Champion','First Step','Knowledge Seeker'] },
  { name: 'David M.',     email: 'david@learner.com',     xp: 1560, streak: 25, level: 15, badges: ['Halfway Hero','Week Warrior'] },
  { name: 'Esther K.',    email: 'esther@learner.com',    xp: 1420, streak: 12, level: 14, badges: ['Course Champion','First Step'] },
  { name: 'Felix N.',     email: 'felix@learner.com',     xp: 1280, streak: 9,  level: 12, badges: ['Knowledge Seeker','First Step'] },
  { name: 'Grace A.',     email: 'grace@learner.com',     xp: 1150, streak: 14, level: 11, badges: ['Halfway Hero'] },
  { name: 'Hassan J.',    email: 'hassan@learner.com',    xp: 980,  streak: 7,  level: 9,  badges: ['Week Warrior','First Step'] },
  { name: 'Irene P.',     email: 'irene@learner.com',     xp: 820,  streak: 21, level: 8,  badges: ['Week Warrior','First Step'] },
  { name: 'James L.',     email: 'james@learner.com',     xp: 650,  streak: 5,  level: 6,  badges: ['First Step'] },
  { name: 'Kevin S.',     email: 'kevin@learner.com',     xp: 480,  streak: 3,  level: 4,  badges: ['First Step'] },
  { name: 'Linda T.',     email: 'linda@learner.com',     xp: 320,  streak: 2,  level: 3,  badges: ['First Step'] },
  { name: 'Mike R.',      email: 'mike@learner.com',      xp: 180,  streak: 1,  level: 1,  badges: [] },
  { name: 'Nancy B.',     email: 'nancy@learner.com',     xp: 90,   streak: 1,  level: 1,  badges: [] },
  { name: 'Oscar V.',     email: 'oscar@learner.com',     xp: 50,   streak: 0,  level: 1,  badges: [] },
]

async function seed() {
  const password = 'learner123' // Same password for all seed users
  
  for (const user of USERS) {
    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: user.name }
    })

    if (authError) {
      console.log(`❌ ${user.name}: ${authError.message}`)
      continue
    }

    const userId = authUser.user.id

    // Set XP and level
    await supabase.from('user_levels').upsert({
      user_id: userId,
      level: user.level,
      total_xp: user.xp
    })

    // Set streak
    await supabase.from('streaks').upsert({
      user_id: userId,
      current_streak: user.streak,
      longest_streak: user.streak,
      last_activity_date: new Date().toISOString().split('T')[0]
    })

    // Add some XP transactions
    await supabase.from('xp_transactions').insert({
      user_id: userId,
      amount: user.xp,
      source: 'lesson_completed'
    })

    // Award badges
    for (const badgeName of user.badges) {
      const { data: badge } = await supabase.from('badges').select('id').eq('name', badgeName).single()
      if (badge) {
        await supabase.from('user_badges').upsert({
          user_id: userId,
          badge_id: badge.id,
          earned_at: new Date().toISOString()
        })
      }
    }

    // Enroll in 2-3 random courses
    const { data: courses } = await supabase.from('courses').select('id').limit(14)
    const shuffled = courses.sort(() => 0.5 - Math.random())
    const enrolled = shuffled.slice(0, 2 + Math.floor(Math.random() * 2))
    
    for (const course of enrolled) {
      await supabase.from('enrollments').upsert({
        user_id: userId,
        course_id: course.id
      })

      // Complete some lessons
      const { data: modules } = await supabase.from('modules').select('id').eq('course_id', course.id)
      for (const mod of modules) {
        const { data: lessons } = await supabase.from('lessons').select('id').eq('module_id', mod.id).limit(1)
        if (lessons.length > 0 && Math.random() > 0.3) {
          await supabase.from('lesson_progress').upsert({
            user_id: userId,
            lesson_id: lessons[0].id,
            completed: true,
            completed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      }
    }

    console.log(`✅ ${user.name} — Level ${user.level}, ${user.xp} XP, ${user.streak} day streak`)
  }

  console.log(`\n🎉 ${USERS.length} users seeded to leaderboard!`)
}

seed()
