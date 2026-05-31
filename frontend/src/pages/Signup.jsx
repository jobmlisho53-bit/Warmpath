import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Flame, User, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle, MailCheck } from 'lucide-react'

const PERKS = ['20+ free courses','XP & streaks system','Verified certificates','Community discussions']

export default function Signup() {
  const { signup }  = useAuth()
  const navigate    = useNavigate()
  const [form,      setForm]      = useState({ name:'', email:'', password:'' })
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [show,      setShow]      = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const res = await signup(form.name, form.email, form.password)
    setLoading(false)
    if (!res.ok) { setError(res.error); return }
    if (res.confirm) { setConfirmed(true); return }
    navigate('/dashboard')
  }

  // Email confirmation screen
  if (confirmed) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />
      <div className="w-full max-w-md animate-scale-in relative text-center">
        <div className="card p-10 border-[var(--border-mid)] shadow-lifted">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ember-500 to-terra-600 flex items-center justify-center mx-auto mb-5 shadow-glow-ember">
            <MailCheck size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-700 mb-3">Check your inbox</h1>
          <p className="text-ink-400 text-sm leading-relaxed mb-6">
            We sent a confirmation link to <span className="text-[var(--text-base)] font-medium">{form.email}</span>.
            Click it to activate your account, then come back and sign in.
          </p>
          <Link to="/login" className="btn-primary w-full justify-center py-3">
            Go to sign in <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-terra-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Left panel */}
        <div className="hidden lg:flex flex-col gap-8 animate-fade-in">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 group mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-terra-600 flex items-center justify-center shadow-glow-ember">
                <Flame size={18} className="text-white" />
              </div>
              <span className="font-display font-700 text-xl text-gradient-ember">WarmPath</span>
            </Link>
            <h2 className="font-display text-4xl font-700 text-[var(--text-base)] leading-tight mb-4">
              Start your<br />
              <span className="text-gradient-ember">learning path</span><br />
              today.
            </h2>
            <p className="text-ink-400 leading-relaxed">
              Join thousands of African learners building real tech skills — completely free.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {PERKS.map(p => (
              <div key={p} className="flex items-center gap-3 text-sm text-ink-300">
                <CheckCircle size={16} className="text-sage-400 flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>
          <div className="card p-5 border-ember-500/20 bg-ember-500/5">
            <p className="text-sm text-ink-300 italic leading-relaxed">
              "WarmPath gave me the skills and certificate that landed me my first dev job."
            </p>
            <p className="text-xs text-ember-400 font-medium mt-2">— Amara K., Nairobi</p>
          </div>
        </div>

        {/* Right — form */}
        <div className="animate-scale-in">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ember-500 to-terra-600 flex items-center justify-center">
                <Flame size={16} className="text-white" />
              </div>
              <span className="font-display font-700 text-lg text-gradient-ember">WarmPath</span>
            </Link>
          </div>

          <div className="card p-8 shadow-lifted border-[var(--border-mid)]">
            <h1 className="font-display text-2xl font-700 mb-1">Create account</h1>
            <p className="text-sm text-ink-400 mb-6">Free forever. No credit card needed.</p>

            <form onSubmit={submit} className="flex flex-col gap-4">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                  {error}
                </div>
              )}
              <div>
                <label className="label">Full name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input name="name" value={form.name} onChange={handle}
                    placeholder="Your name" required autoComplete="name"
                    className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input name="email" type="email" value={form.email} onChange={handle}
                    placeholder="you@example.com" required autoComplete="email"
                    className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle}
                    placeholder="Min 6 characters" required autoComplete="new-password"
                    className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShow(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-ink-300 transition-colors">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 mt-2 text-base">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                    </svg>
                    Creating account…
                  </span>
                ) : <>Create free account <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-ink-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-ember-400 hover:text-ember-300 font-medium transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
