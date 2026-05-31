require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  // Sign up (will need email confirmation)
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: 'dashboardtest@warmpath.com',
    password: 'test123456'
  })
  
  if (signupError && !signupError.message.includes('already registered')) {
    console.log('Signup error:', signupError.message)
  }
  
  // Use admin API to confirm the user's email
  const { data: userData } = await supabase.auth.admin.listUsers()
  const user = userData?.users?.find(u => u.email === 'dashboardtest@warmpath.com')
  
  if (user && !user.email_confirmed_at) {
    await supabase.auth.admin.updateUserById(user.id, { email_confirm: true })
    console.log('Email confirmed for:', user.email)
  }
  
  // Now sign in
  const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'dashboardtest@warmpath.com',
    password: 'test123456'
  })
  
  if (loginError) {
    console.log('Login error:', loginError.message)
    return
  }
  
  console.log('TOKEN=' + session.session.access_token)
}

test()
