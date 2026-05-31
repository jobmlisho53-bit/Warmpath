import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Shield, User, Lock, ArrowRight } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form,  setForm]  = useState({ username:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const r = await api.post('/admin/auth/login', form)
      localStorage.setItem('wp_admin_token', r.data.token)
      navigate('/admin')
    } catch (e) {
      setError(e.response?.data?.error || 'Invalid credentials')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ember-mesh pointer-events-none opacity-50" />
      <div className="w-full max-w-sm animate-scale-in relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terra-500 to-terra-700 flex items-center justify-center mx-auto mb-4 shadow-glow-ember">
            <Shield size={22} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-700 mb-1">Admin access</h1>
          <p className="text-sm text-ink-400">WarmPath control panel</p>
        </div>

        <div className="card p-8 border-[var(--border-mid)] shadow-lifted">
          <form onSubmit={submit} className="flex flex-col gap-4">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                <input name="username" value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value}))}
                  placeholder="admin" required className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                <input name="password" type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  placeholder="••••••••" required className="input-field pl-10" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-1">
              {loading ? 'Signing in…' : <>Sign in <ArrowRight size={15} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
