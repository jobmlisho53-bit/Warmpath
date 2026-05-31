require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  // Get your user
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email')

  console.log('Users:')
  profiles.forEach(p => console.log(`  ${p.full_name} — ${p.id}`))

  // Get all enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, course:courses(title)')

  console.log('\nAll enrollments:')
  if (!enrollments || enrollments.length === 0) {
    console.log('  (none — no one is enrolled in anything)')
  } else {
    enrollments.forEach(e => console.log(`  User: ${e.user_id} → ${e.course?.title}`))
  }
}

check()
