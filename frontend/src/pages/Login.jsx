import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Flame, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ email:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [show,    setShow]    = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await login(form.email, form.password)
    setLoading(false)
    if (res.ok) navigate('/dashboard')
    else setError(res.error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-ember-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-terra-600 flex items-center justify-center shadow-glow-ember">
              <Flame size={18} className="text-white" />
            </div>
            <span className="font-display font-700 text-xl text-gradient-ember">WarmPath</span>
          </Link>
          <h1 className="font-display text-3xl font-700 text-[var(--text-base)] mb-2">Welcome back</h1>
          <p className="text-sm text-ink-400">Sign in to continue your learning journey</p>
        </div>

        <div className="card p-8 shadow-lifted border-[var(--border-mid)]">
          <form onSubmit={submit} className="flex flex-col gap-5">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

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
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                <input name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle}
                  placeholder="••••••••" required autoComplete="current-password"
                  className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-ink-300 transition-colors">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-1 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                  </svg>
                  Signing in…
                </span>
              ) : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-400 mt-6">
          No account?{' '}
          <Link to="/signup" className="text-ember-400 hover:text-ember-300 font-medium transition-colors">
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  )
}
