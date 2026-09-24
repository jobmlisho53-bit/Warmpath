const express = require('express')
const axios = require('axios')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Environment config
const IS_PRODUCTION = process.env.MPESA_ENVIRONMENT === 'production'
const BASE_URL = IS_PRODUCTION 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke'

// Get OAuth token (cached for 50 minutes)
let cachedToken = null
let tokenExpiry = 0

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const res = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  )

  cachedToken = res.data.access_token
  tokenExpiry = Date.now() + (res.data.expires_in - 100) * 1000
  return cachedToken
}

// Generate timestamp: YYYYMMDDHHmmss
function getTimestamp() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

// Generate password for STK push
function getPassword(timestamp) {
  return Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64')
}

// Format phone: 0712345678 → 254712345678
function formatPhone(phone) {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) cleaned = '254' + cleaned.slice(1)
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) cleaned = '254' + cleaned
  return cleaned
}

// Initiate STK Push
router.post('/stkpush', async (req, res) => {
  const userId = req.user.id
  const { phone, amount, courseId, purpose } = req.body

  if (!phone || !amount) {
    return res.status(400).json({ error: 'Phone and amount required' })
  }

  const formattedPhone = formatPhone(phone)
  const timestamp = getTimestamp()
  const password = getPassword(timestamp)

  try {
    const token = await getAccessToken()

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: purpose || 'WarmPath',
      TransactionDesc: purpose === 'certificate' ? 'Certificate Unlock' : 'Shop Purchase'
    }

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // Save pending payment
    await supabaseAdmin.from('payments').insert({
      user_id: userId,
      amount: amount,
      currency: 'KES',
      payment_method: 'mpesa',
      payment_reference: response.data.CheckoutRequestID,
      checkout_request_id: response.data.CheckoutRequestID,
      merchant_request_id: response.data.MerchantRequestID,
      phone_number: formattedPhone,
      item_type: purpose || 'certificate',
      item_id: courseId,
      status: 'pending'
    })

    res.json({
      success: true,
      checkoutRequestId: response.data.CheckoutRequestID,
      message: 'STK push sent. Check your phone for the M-Pesa prompt.',
      customerMessage: response.data.CustomerMessage
    })
  } catch (err) {
    console.error('STK Push error:', err.response?.data || err.message)
    res.status(500).json({ 
      error: 'Failed to initiate M-Pesa payment',
      details: err.response?.data?.errorMessage || err.message
    })
  }
})

// M-Pesa Callback — Safaricom calls this
router.post('/callback', async (req, res) => {
  console.log('M-Pesa callback:', JSON.stringify(req.body, null, 2))

  const { Body } = req.body
  if (!Body || !Body.stkCallback) {
    return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }

  const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback

  if (ResultCode === 0) {
    // Payment successful
    const metadata = {}
    CallbackMetadata?.Item?.forEach(item => {
      metadata[item.Name] = item.Value
    })

    const mpesaReceipt = metadata.MpesaReceiptNumber
    const amount = metadata.Amount
    const phone = metadata.PhoneNumber

    // Update payment record
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'completed',
        mpesa_receipt: mpesaReceipt,
        payment_reference: mpesaReceipt
      })
      .eq('checkout_request_id', CheckoutRequestID)
      .select()
      .single()

    // Handle certificate unlock
    if (payment && payment.item_type === 'certificate' && payment.item_id) {
      const crypto = require('crypto')
      const verificationCode = 'WP-' + crypto.randomBytes(16).toString('hex').toUpperCase()

      await supabaseAdmin.from('certificates').upsert({
        user_id: payment.user_id,
        course_id: payment.item_id,
        verification_code: verificationCode,
        status: 'unlocked',
        issued_at: new Date().toISOString()
      }, { onConflict: 'user_id,course_id' })
    }

    console.log(`✅ Payment confirmed: ${mpesaReceipt} for ${amount} KES`)
  } else {
    // Payment failed or cancelled
    await supabaseAdmin
      .from('payments')
      .update({ status: 'failed' })
      .eq('checkout_request_id', CheckoutRequestID)

    console.log(`❌ Payment failed: ${ResultDesc}`)
  }

  res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
})

// Check payment status
router.get('/status/:checkoutRequestId', async (req, res) => {
  const { data: payment } = await supabaseAdmin
    .from('payments')
    .select('*')
    .eq('checkout_request_id', req.params.checkoutRequestId)
    .single()

  if (!payment) return res.status(404).json({ error: 'Not found' })

  res.json({
    status: payment.status,
    receipt: payment.mpesa_receipt,
    amount: payment.amount
  })
})

// Query M-Pesa directly (for stuck payments)
router.post('/query', async (req, res) => {
  const { checkoutRequestId } = req.body
  if (!checkoutRequestId) return res.status(400).json({ error: 'checkoutRequestId required' })

  try {
    const token = await getAccessToken()
    const timestamp = getTimestamp()
    const password = getPassword(timestamp)

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    res.json(response.data)
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.errorMessage || err.message })
  }
})

module.exports = router
