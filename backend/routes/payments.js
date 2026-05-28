const express = require('express')
const axios = require('axios')
const crypto = require('crypto')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY

// Initialize payment
router.post('/initialize', async (req, res) => {
  const userId = req.user.id
  const { courseId, amount, email } = req.body

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: email || req.user.email,
        amount: amount * 100,
        currency: 'KES',
        metadata: {
          user_id: userId,
          course_id: courseId,
          item_type: 'certificate'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    )

    // Save payment record with user_id and course_id
    await supabaseAdmin.from('payments').insert({
      user_id: userId,
      amount: amount,
      currency: 'KES',
      payment_reference: response.data.data.reference,
      item_type: 'certificate',
      item_id: courseId,
      status: 'pending'
    })

    res.json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference
    })
  } catch (error) {
    console.error('Paystack error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Payment initialization failed' })
  }
})

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  const { reference } = req.params
  const userId = req.user.id

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`
        }
      }
    )

    const { status } = response.data.data

    if (status === 'success') {
      // Find the original payment record to get course_id
      const { data: payment } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('payment_reference', reference)
        .single()

      const courseId = payment?.item_id

      if (!courseId) {
        return res.status(400).json({ error: 'Course not found for this payment' })
      }

      // Update payment record
      await supabaseAdmin
        .from('payments')
        .update({
          status: 'completed',
          paystack_reference: reference
        })
        .eq('payment_reference', reference)

      // Generate verification code
      const verificationCode = 'WP-' + crypto.randomBytes(16).toString('hex').toUpperCase()

      // Unlock certificate — upsert in case it already exists
      const { data: cert, error } = await supabaseAdmin
        .from('certificates')
        .upsert({
          user_id: userId,
          course_id: courseId,
          verification_code: verificationCode,
          status: 'unlocked',
          issued_at: new Date().toISOString()
        }, { onConflict: 'user_id,course_id' })
        .select()
        .single()

      console.log('Certificate created:', cert, error)

      res.json({
        status: 'success',
        verification_code: verificationCode,
        certificate: cert,
        message: 'Certificate unlocked!'
      })
    } else {
      res.json({ status: 'pending', message: 'Payment not confirmed yet' })
    }
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Payment verification failed' })
  }
})

// Get user's certificates
router.get('/my-certificates', async (req, res) => {
  const userId = req.user.id

  const { data, error } = await supabaseAdmin
    .from('certificates')
    .select('*, course:courses(title, category)')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
