require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function find() {
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', 'b79e576b-16d0-49b5-9f91-06845c1430ca')
    .single()

  console.log('Your certificate is for course:')
  console.log(JSON.stringify(course, null, 2))
}

find()
