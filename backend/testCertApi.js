require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  const userId = 'bc226aef-5196-47fa-bb9b-3671e2edb60e'
  const courseId = 'b79e576b-16d0-49b5-9f91-06845c1430ca'

  // Test the exact query the API uses
  const { data, error } = await supabase
    .from('certificates')
    .select('*, course:courses(title, category, cover_image), user:profiles(full_name)')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('status', 'unlocked')
    .single()

  console.log('Query result:')
  console.log('Error:', error)
  console.log('Data:', JSON.stringify(data, null, 2))
}

test()
