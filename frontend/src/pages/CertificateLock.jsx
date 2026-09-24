import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import {
  Award, Lock, CheckCircle, Flame, ArrowRight,
  ShieldCheck, Phone, Loader2, AlertCircle, RefreshCw
} from 'lucide-react'

const POLL_INTERVAL = 3000    // 3 seconds
const POLL_TIMEOUT  = 120000  // 2 minutes max

export default function CertificateLock() {
  const { name }  = useParams()
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const [course,   setCourse]   = useState(null)
  const [progress, setProgress] = useState(null)
  const [cert,     setCert]     = useState(null)
  const [loading,  setLoading]  = useState(true)

  // M-Pesa flow
  const [phone,    setPhone]    = useState('')
  const [phoneErr, setPhoneErr] = useState('')
  const [step,     setStep]     = useState('idle')
  const [stkId,    setStkId]    = useState(null)
  const [receipt,  setReceipt]  = useState(null)
  const [pollMsg,  setPollMsg]  = useState('')
  const [attempts, setAttempts] = useState(0)

  const pollRef    = useRef(null)
  const timeoutRef = useRef(null)

  // Load course + progress + existing cert
  useEffect(() => {
    api.get(`/courses/${name}`)
      .then(async r => {
        const c = r.data?.course ?? r.data
        setCourse(c)
        const [prog, certRes] = await Promise.allSettled([
          api.get(`/progress/courses/${c.id}`),
          api.get(`/certificates/course/${c.id}`),
        ])
        if (prog.status    === 'fulfilled') setProgress(prog.value.data)
        if (certRes.status === 'fulfilled' && certRes.value.data?.certificate) {
          setCert(certRes.value.data.certificate)
        }
      })
      .finally(() => setLoading(false))
  }, [name])

  // Already has cert — redirect straight to view
  useEffect(() => {
    if (cert) navigate(`/courses/${name}/certificate/view`)
  }, [cert])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(pollRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  // ── Phone helpers ──
  const formatPhone = (raw) => {
    let digits = raw.replace(/\D/g, '')
    if (digits.startsWith('254')) digits = digits.slice(3)
    if (digits.startsWith('0'))   digits = digits.slice(1)
    return digits  // 9 digits, e.g. "712345678"
  }

  const validatePhone = (raw) => {
    const d = formatPhone(raw)
    if (!d)          return 'Phone number is required'
    if (d.length !== 9) return 'Enter a valid 10-digit Safaricom number'
    if (!['7','1'].includes(d[0])) return 'Must be a Safaricom number (07XX or 01XX)'
    return ''
  }

  // ── Initiate STK push ──
  const sendMpesa = async () => {
    const err = validatePhone(phone)
    if (err) { setPhoneErr(err); return }
    setPhoneErr('')
    setStep('sending')
    setPollMsg('')

    try {
      const internationalPhone = '254' + formatPhone(phone)

      // POST /api/mpesa/stkpush
      const res = await api.post('/mpesa/stkpush', {
        phone:    internationalPhone,
        amount:   999,
        courseId: course.id,
      })

      // ← exact field name from backend: checkoutRequestId (camelCase)
      const id = res.data?.checkoutRequestId

      if (!id) throw new Error('No checkoutRequestId in response')

      setStkId(id)
      setStep('waiting')
      setPollMsg('M-Pesa prompt sent. Enter your PIN on your phone.')
      setAttempts(0)
      startPolling(id)

    } catch (e) {
      const msg = e.response?.data?.error
               || e.response?.data?.details
               || e.message
               || 'Failed to send M-Pesa request. Check your number and try again.'
      setPollMsg(msg)
      setStep('failed')
    }
  }

  // ── Polling ──
  const startPolling = (id) => {
    // Hard stop after 2 minutes
    timeoutRef.current = setTimeout(() => {
      clearInterval(pollRef.current)
      setStep('timeout')
      setPollMsg('No response from M-Pesa after 2 minutes. Please try again.')
    }, POLL_TIMEOUT)

    pollRef.current = setInterval(async () => {
      try {
        setAttempts(a => a + 1)

        // GET /api/mpesa/status/:checkoutRequestId
        const res    = await api.get(`/mpesa/status/${id}`)
        const status = res.data?.status  // exactly: "pending" | "completed" | "failed"

        if (status === 'completed') {
          clearInterval(pollRef.current)
          clearTimeout(timeoutRef.current)
          setReceipt(res.data?.receipt || null)
          setStep('success')
          setPollMsg('Payment confirmed! Unlocking your certificate…')
          // Redirect to certificate view after 2 seconds
          setTimeout(() => navigate(`/courses/${name}/certificate/view`), 2000)

        } else if (status === 'failed') {
          clearInterval(pollRef.current)
          clearTimeout(timeoutRef.current)
          setStep('failed')
          setPollMsg('Payment was cancelled or failed. Please try again.')

        }
        // status === 'pending' — do nothing, keep polling

      } catch (e) {
        // 404 "Not found" or network error — keep polling, don't crash
        if (e.response?.status === 404) {
          // Transaction not yet in DB — normal during first few seconds
        }
      }
    }, POLL_INTERVAL)
  }

  const retry = () => {
    clearInterval(pollRef.current)
    clearTimeout(timeoutRef.current)
    setStep('idle')
    setStkId(null)
    setReceipt(null)
    setPollMsg('')
    setAttempts(0)
  }

  const pct      = progress?.percentage || 0
  const complete = pct >= 100

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />

      <div className="w-full max-w-lg relative animate-scale-in">

        {/* Blurred certificate preview */}
        <div className="relative mb-6">
          <div className="card p-8 text-center border-sand-500/20 overflow-hidden"
            style={{ background:'linear-gradient(135deg,rgba(28,24,21,0.9),rgba(44,33,20,0.9))' }}>
            <div className="absolute inset-0 backdrop-blur-sm" />
            <div className="relative opacity-20 pointer-events-none select-none">
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ background:'linear-gradient(135deg,#C49552,#A87A3C)' }}>
                <Award size={24} className="text-white" />
              </div>
              <p className="font-display text-lg font-700 text-[var(--text-base)]">Certificate of Completion</p>
              <p className="text-ink-400 text-sm my-2">This certifies that</p>
              <p className="font-display text-2xl font-700">
                {user?.user_metadata?.full_name || 'Your Name'}
              </p>
              <p className="text-ink-400 text-sm mt-2">has successfully completed</p>
              <p className="font-display text-base font-600 text-ember-400 mt-1">{course?.title}</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-2xl p-4 flex flex-col items-center gap-2 border border-[var(--border-mid)]"
                style={{ background:'rgba(28,24,21,0.85)', backdropFilter:'blur(8px)' }}>
                <Lock size={20} className="text-ember-400" />
                <p className="text-sm font-medium text-[var(--text-base)]">Certificate locked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="card p-8 border-[var(--border-mid)] shadow-lifted">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-ember"
              style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)' }}>
              <Award size={24} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-700 mb-1">Unlock your certificate</h1>
            <p className="text-sm text-ink-400">
              Pay <span className="text-ember-400 font-medium">KES 999</span> via M-Pesa to unlock
              your verified certificate for{' '}
              <span className="text-[var(--text-base)] font-medium">{course?.title}</span>
            </p>
          </div>

          {/* Progress check */}
          <div className={`rounded-xl p-4 mb-6 border ${
            complete
              ? 'bg-sage-500/10 border-sage-500/20'
              : 'bg-[var(--bg-surface)] border-[var(--border-mid)]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {complete
                  ? <CheckCircle size={15} className="text-sage-400" />
                  : <div className="w-4 h-4 rounded-full border-2 border-ink-500" />
                }
                <span className={`text-sm font-medium ${complete ? 'text-sage-400' : 'text-ink-300'}`}>
                  Course completion
                </span>
              </div>
              <span className={`text-sm font-medium ${complete ? 'text-sage-400' : 'text-ember-400'}`}>
                {pct}%
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width:`${pct}%` }} />
            </div>
            {!complete && (
              <p className="text-xs text-ink-500 mt-2">Complete all lessons to unlock your certificate</p>
            )}
          </div>

          {/* Perks */}
          <div className="space-y-2.5 mb-6">
            {[
              'Unique verification code — shareable anywhere',
              'Printable certificate with your name',
              'Permanently on your WarmPath profile',
              'One-time payment — yours forever',
            ].map(p => (
              <div key={p} className="flex items-start gap-2.5 text-sm text-ink-300">
                <ShieldCheck size={14} className="text-ember-400 flex-shrink-0 mt-0.5" />
                {p}
              </div>
            ))}
          </div>

          <div className="divider mb-6" />

          {/* ── IDLE / FAILED / TIMEOUT — phone input ── */}
          {['idle','failed','timeout'].includes(step) && (
            <>
              {/* Error message */}
              {['failed','timeout'].includes(step) && pollMsg && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-5 animate-fade-in">
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{pollMsg}</p>
                </div>
              )}

              <div className="mb-5">
                <label className="label">Safaricom M-Pesa number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setPhoneErr('') }}
                    placeholder="07XX XXX XXX"
                    maxLength={13}
                    className="input-field pl-10"
                  />
                </div>
                {phoneErr && <p className="text-xs text-red-400 mt-1.5">{phoneErr}</p>}
                <p className="text-xs text-ink-500 mt-1.5">
                  You will receive an M-Pesa PIN prompt on this number
                </p>
              </div>

              <div className="flex items-center justify-between mb-5">
                <span className="text-sm text-ink-400">Amount</span>
                <span className="font-display text-2xl font-700 text-[var(--text-base)]">KES 999</span>
              </div>

              <button
                onClick={sendMpesa}
                disabled={!complete}
                className="btn-primary w-full justify-center py-3.5 text-base gap-2">
                {!complete
                  ? <><Lock size={16} /> Complete course to unlock</>
                  : <><Phone size={16} /> Send M-Pesa request</>
                }
              </button>

              {!complete && (
                <Link to={`/courses/${name}`}
                  className="btn-ghost w-full justify-center mt-3 text-sm gap-1.5">
                  <Flame size={14} /> Continue learning
                </Link>
              )}
            </>
          )}

          {/* ── SENDING ── */}
          {step === 'sending' && (
            <div className="text-center py-6 animate-fade-in">
              <Loader2 size={32} className="text-ember-400 mx-auto mb-4 animate-spin" />
              <p className="font-medium text-[var(--text-base)] mb-1">Sending M-Pesa request…</p>
              <p className="text-sm text-ink-400">Connecting to Safaricom</p>
            </div>
          )}

          {/* ── WAITING — active polling ── */}
          {step === 'waiting' && (
            <div className="animate-fade-in">
              <div className="text-center py-4 mb-5">
                <div className="relative inline-flex mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-ember-500/10 border border-ember-500/20 flex items-center justify-center">
                    <Phone size={26} className="text-ember-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ember-500 flex items-center justify-center animate-pulse-slow">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <p className="font-display font-600 text-[var(--text-base)] mb-1">Check your phone</p>
                <p className="text-sm text-ink-400 leading-relaxed">{pollMsg}</p>
              </div>

              <div className="space-y-2.5 mb-5">
                {[
                  'M-Pesa PIN prompt sent to your phone',
                  'Enter your M-Pesa PIN to approve',
                  'Wait for the confirmation SMS',
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-ink-300">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-700"
                      style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)' }}>
                      {i + 1}
                    </div>
                    {s}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-ink-500 mb-5">
                <RefreshCw size={11} className="animate-spin" />
                Checking payment status… (check {attempts})
              </div>

              <button onClick={retry} className="btn-ghost w-full justify-center text-sm">
                Cancel and try again
              </button>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === 'success' && (
            <div className="text-center py-6 animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-sage-500/10 border border-sage-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={30} className="text-sage-400" />
              </div>
              <p className="font-display text-xl font-700 text-[var(--text-base)] mb-2">
                Payment confirmed!
              </p>
              {receipt && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sage-500/10 border border-sage-500/20 mb-3">
                  <CheckCircle size={13} className="text-sage-400" />
                  <span className="text-xs font-mono text-sage-400">M-Pesa receipt: {receipt}</span>
                </div>
              )}
              <p className="text-sm text-ink-400 mb-2">{pollMsg}</p>
              <p className="text-xs text-ink-500 flex items-center justify-center gap-1">
                <Loader2 size={11} className="animate-spin" /> Redirecting to your certificate…
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-ink-500 mt-5">
          Having trouble?{' '}
          <a href="mailto:jobmlisho63@gmail.com"
            className="text-ember-400 hover:text-ember-300 transition-colors">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}
