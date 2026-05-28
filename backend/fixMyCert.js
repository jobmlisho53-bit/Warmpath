require('dotenv').config()
const crypto = require('crypto')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fix() {
  // Find your user
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .limit(5)

  console.log('Users:', JSON.stringify(profiles, null, 2))

  // Find completed payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')

  console.log('\nPayments:', JSON.stringify(payments, null, 2))

  // Find any certificates
  const { data: certs } = await supabase
    .from('certificates')
    .select('*')

  console.log('\nCertificates:', JSON.stringify(certs, null, 2))

  // If you have a payment but no certificate, let's fix that
  if (payments && payments.length > 0 && (!certs || certs.length === 0)) {
    const payment = payments.find(p => p.status === 'completed' || p.item_type === 'certificate')
    if (payment) {
      const verificationCode = 'WP-' + crypto.randomBytes(16).toString('hex').toUpperCase()
      
      const { data: cert, error } = await supabase
        .from('certificates')
        .upsert({
          user_id: payment.user_id,
          course_id: payment.item_id,
          verification_code: verificationCode,
          status: 'unlocked',
          issued_at: new Date().toISOString()
        }, { onConflict: 'user_id,course_id' })
        .select()
        .single()

      if (error) {
        console.log('\nFix error:', error)
      } else {
        console.log('\n✅ Certificate fixed!')
        console.log('Certificate:', cert)
      }
    }
  }
}

fix()
