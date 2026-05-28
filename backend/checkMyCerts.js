require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const { data: certs, error } = await supabase
    .from('certificates')
    .select('*, course:courses(title), user:profiles(email)')

  console.log('All certificates in database:')
  console.log(JSON.stringify(certs, null, 2))
}

check()
