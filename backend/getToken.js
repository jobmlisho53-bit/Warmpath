require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getToken() {
  // Create a test user if doesn't exist
  const email = 'test@warmpath.com'
  const password = 'test123456'

  // Try to sign in
  let { data, error } = await supabase.auth.signInWithPassword({ email, password })

  // If user doesn't exist, create one
  if (error) {
    console.log('Creating test user...')
    const { data: signUpData } = await supabase.auth.signUp({ email, password })
    console.log('User created:', signUpData.user?.id)
    // Sign in again
    const { data: newLogin } = await supabase.auth.signInWithPassword({ email, password })
    data = newLogin
  }

  console.log('\n✅ Access Token:')
  console.log(data.session.access_token)
  console.log('\n✅ User ID:', data.user.id)
}

getToken()
