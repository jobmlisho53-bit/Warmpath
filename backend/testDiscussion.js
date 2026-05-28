require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  // First check if the discussions table exists
  const { data: tables, error: tableError } = await supabase
    .from('discussions')
    .select('*')
    .limit(1)

  console.log('Table check:', tableError ? 'ERROR: ' + tableError.message : 'OK')
  console.log('Data:', tables)

  // Try inserting directly
  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('title', 'Python Programming')
    .single()

  console.log('\nCourse:', course?.id)

  const { data: user } = await supabase
    .from('profiles')
    .select('id')
    .single()

  console.log('User:', user?.id)

  if (course && user) {
    const { data: disc, error } = await supabase
      .from('discussions')
      .insert({
        course_id: course.id,
        user_id: user.id,
        title: 'Test Discussion',
        content: 'Testing direct insert'
      })
      .select()
      .single()

    console.log('\nInsert result:', disc, error)
  }
}

test()
