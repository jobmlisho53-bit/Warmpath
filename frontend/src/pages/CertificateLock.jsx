import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { Award, Lock, CheckCircle, Flame, ArrowRight, ShieldCheck } from 'lucide-react'

export default function CertificateLock() {
  const { name } = useParams()
  const { isAuth } = useAuth()
  const navigate = useNavigate()
  const [course,    setCourse]    = useState(null)
  const [progress,  setProgress]  = useState(null)
  const [cert,      setCert]      = useState(null)
  const [paying,    setPaying]    = useState(false)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (!isAuth) { navigate('/login'); return }
    api.get(`/courses/${name}`).then(async r => {
      const c = r.data?.course || r.data
      setCourse(c)
      const [prog, certRes] = await Promise.allSettled([
        api.get(`/progress/courses/${c.id}`),
        api.get(`/certificates/course/${c.id}`),
      ])
      if (prog.status === 'fulfilled') setProgress(prog.value.data)
      if (certRes.status === 'fulfilled') setCert(certRes.value.data?.certificate)
    }).finally(() => setLoading(false))
  }, [name, isAuth])

  const pay = async () => {
    setPaying(true)
    try {
      const r = await api.post('/payments/initialize', {
        courseId: course.id,
        amount: 99900,
        email: 'user@example.com',
      })
      window.location.href = r.data.authorization_url
    } catch (e) {
      alert('Payment init failed. Please try again.')
      setPaying(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
    </div>
  )

  if (cert) {
    navigate(`/courses/${name}/certificate/view`)
    return null
  }

  const pct = progress?.percentage || 0
  const complete = pct >= 100

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />
      <div className="w-full max-w-lg relative animate-scale-in">

        {/* Blurred cert preview */}
        <div className="relative mb-6">
          <div className="card p-8 text-center border-sand-500/20 bg-gradient-to-br from-sand-900/40 to-terra-900/40 overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-sm" />
            <div className="relative opacity-20 pointer-events-none select-none">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sand-400 to-sand-600 mx-auto mb-4 flex items-center justify-center">
                <Award size={28} className="text-white" />
              </div>
              <p className="font-display text-2xl font-700 text-[var(--text-base)] mb-1">Certificate of Completion</p>
              <p className="text-ink-400 mb-3">This certifies that</p>
              <p className="font-display text-3xl font-700 text-[var(--text-base)]">Your Name Here</p>
              <p className="text-ink-400 mt-2">has successfully completed</p>
              <p className="font-display text-xl font-600 text-ember-400 mt-1">{course?.title}</p>
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[var(--bg-raised)]/90 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center gap-2 border border-[var(--border-mid)]">
                <Lock size={24} className="text-ember-400" />
                <p className="text-sm font-medium text-[var(--text-base)]">Certificate locked</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8 border-[var(--border-mid)] shadow-lifted">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ember-500 to-terra-600 flex items-center justify-center mx-auto mb-4 shadow-glow-ember">
              <Award size={24} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-700 mb-2">Unlock your certificate</h1>
            <p className="text-sm text-ink-400">Earn a verified certificate for <span className="text-[var(--text-base)] font-medium">{course?.title}</span></p>
          </div>

          {/* Progress check */}
          <div className={`rounded-xl p-4 mb-6 border ${complete ? 'bg-sage-500/10 border-sage-500/20' : 'bg-[var(--bg-surface)] border-[var(--border-mid)]'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {complete
                  ? <CheckCircle size={16} className="text-sage-400" />
                  : <div className="w-4 h-4 rounded-full border-2 border-ink-500" />
                }
                <span className={`text-sm font-medium ${complete ? 'text-sage-400' : 'text-ink-300'}`}>
                  Course completion
                </span>
              </div>
              <span className={`text-sm font-medium ${complete ? 'text-sage-400' : 'text-ember-400'}`}>{pct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            {!complete && (
              <p className="text-xs text-ink-500 mt-2">
                Complete all lessons to unlock your certificate
              </p>
            )}
          </div>

          {/* Perks */}
          <div className="space-y-2.5 mb-6">
            {[
              'Unique verification code — shareable anywhere',
              'Printable PDF quality certificate',
              'Permanently on your WarmPath profile',
              'One-time payment — yours forever',
            ].map(p => (
              <div key={p} className="flex items-start gap-2.5 text-sm text-ink-300">
                <ShieldCheck size={15} className="text-ember-400 flex-shrink-0 mt-0.5" />
                {p}
              </div>
            ))}
          </div>

          <div className="divider mb-6" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-ink-400">Certificate fee</span>
            <span className="font-display text-2xl font-700 text-[var(--text-base)]">KES 999</span>
          </div>

          <button onClick={pay} disabled={paying || !complete}
            className="btn-primary w-full justify-center py-3.5 text-base">
            {paying ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                </svg>
                Redirecting to Paystack…
              </span>
            ) : !complete ? (
              <><Lock size={16} /> Complete course to unlock</>
            ) : (
              <>Pay KES 999 <ArrowRight size={16} /></>
            )}
          </button>

          {!complete && (
            <Link to={`/courses/${name}`}
              className="btn-ghost w-full justify-center mt-3 text-sm">
              <Flame size={14} /> Continue learning
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
