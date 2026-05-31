require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function runTest() {
  console.log('🔍 Starting Backend API Test...');
  
  // 1. Login as the student
  console.log('1️⃣ Logging in as test@warmpath.com...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@warmpath.com',
    password: 'test123456'
  });

  if (error) {
    console.error('❌ Login Failed:', error.message);
    console.log('   Fix: Check if your .env has the correct SUPABASE_ANON_KEY');
    return;
  }

  const token = data.session.access_token;
  console.log('✅ Logged in. Token starts with:', token.substring(0, 15) + '...');

  // 2. Call the Courses API
  console.log('\n2️⃣ Fetching /api/courses...');
  try {
    const response = await fetch('http://localhost:3001/api/courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('🎉 SUCCESS!');
      console.log(`   Found ${result.length} courses.`);
      if (result.length > 0) console.log(`   First course: ${result[0].title}`);
      console.log('\n👉 Your Backend and Database are working perfectly!');
    } else {
      console.error('❌ API Returned Error:', result);
      console.log('   Fix: Check backend/middleware/auth.js');
    }
  } catch (err) {
    console.error('❌ Network Error:', err.message);
  }
}

runTest();
