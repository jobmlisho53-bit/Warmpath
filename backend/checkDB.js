require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title')
    .eq('status', 'published')

  let working = 0
  let broken = 0

  for (const course of courses) {
    const { data: modules } = await supabase
      .from('modules')
      .select('id, title')
      .eq('course_id', course.id)

    for (const mod of modules) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, youtube_url, youtube_id')
        .eq('module_id', mod.id)

      for (const lesson of lessons) {
        if (!lesson.youtube_id || lesson.youtube_id.length !== 11) {
          broken++
        } else {
          working++
        }
      }
    }
  }

  console.log(`Working YouTube IDs: ${working}`)
  console.log(`Broken/Missing IDs: ${broken}`)
}

check()
