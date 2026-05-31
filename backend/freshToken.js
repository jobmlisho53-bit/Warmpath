require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getToken() {
  // Ensure user exists and is confirmed
  const { data: users } = await supabase.auth.admin.listUsers()
  let user = users?.users?.find(u => u.email === 'test@warmpath.com')
  
  if (user && !user.email_confirmed_at) {
    await supabase.auth.admin.updateUserById(user.id, { email_confirm: true })
  }

  // Sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@warmpath.com',
    password: 'test123456'
  })

  if (error) {
    console.log('Error:', error.message)
    return
  }

  console.log(data.session.access_token)
}

getToken()
