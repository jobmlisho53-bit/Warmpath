import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import { Award, Zap, BookOpen, Trophy, Star, ExternalLink, ShieldCheck } from 'lucide-react'

export default function Profile() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/profiles/public/${userId}`)
      .then(r => setProfile(r.data?.profile || r.data))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen pt-24 text-center">
      <p className="text-ink-400">Profile not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-4xl">

        {/* Profile header */}
        <div className="card p-8 mb-6 border-[var(--border-mid)] animate-fade-up relative overflow-hidden">
          <div className="absolute inset-0 bg-ember-mesh opacity-60 pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ember-500 to-terra-600 flex items-center justify-center text-white font-display text-3xl font-700 shadow-glow-ember flex-shrink-0">
              {profile.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-700 text-[var(--text-base)] mb-1">{profile.name || 'Learner'}</h1>
              <p className="text-ink-400 text-sm mb-3">Level {profile.level || 1} · {profile.total_xp?.toLocaleString() || 0} XP total</p>
              <div className="flex flex-wrap gap-2">
                <div className="xp-orb"><Zap size={12} /> {profile.total_xp?.toLocaleString() || 0} XP</div>
                <div className="badge bg-terra-500/10 border border-terra-500/20 text-terra-400">
                  <Trophy size={11} /> Lvl {profile.level || 1}
                </div>
                <div className="badge bg-sage-500/10 border border-sage-500/20 text-sage-400">
                  <Award size={11} /> {profile.certificates?.length || 0} certs
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Certificates */}
            {profile.certificates?.length > 0 && (
              <div className="animate-fade-up animate-delay-100">
                <h2 className="font-display text-xl font-600 mb-4 flex items-center gap-2">
                  <Award size={18} className="text-ember-400" /> Certificates
                </h2>
                <div className="space-y-3">
                  {profile.certificates.map(cert => (
                    <div key={cert.id} className="card-hover flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sand-400/20 to-sand-600/20 border border-sand-400/20 flex items-center justify-center">
                          <Award size={16} className="text-sand-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-base)]">{cert.course?.title}</p>
                          <div className="flex items-center gap-1 text-xs text-ink-500 mt-0.5">
                            <ShieldCheck size={11} className="text-sage-400" />
                            <span className="font-mono">{cert.verification_code}</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/verify/${cert.verification_code}`}
                        className="btn-ghost p-2 text-xs">
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enrolled courses */}
            {profile.courses?.length > 0 && (
              <div className="animate-fade-up animate-delay-200">
                <h2 className="font-display text-xl font-600 mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-ember-400" /> Courses
                </h2>
                <div className="space-y-3">
                  {profile.courses.map(c => (
                    <div key={c.id} className="card-hover p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{c.icon || '📚'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-base)] truncate">{c.title}</p>
                          <p className="text-xs text-ink-400">{c.category}</p>
                        </div>
                        <span className="text-xs text-ember-400 font-medium flex-shrink-0">{c.progress || 0}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${c.progress || 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — badges */}
          <div className="lg:col-span-1 animate-fade-up animate-delay-300">
            <h2 className="font-display text-xl font-600 mb-4 flex items-center gap-2">
              <Star size={18} className="text-ember-400" /> Badges
            </h2>
            {profile.badges?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {profile.badges.map(b => (
                  <div key={b.id} className="card p-4 text-center border-[var(--border-mid)] hover:border-ember-500/20 transition-colors">
                    <span className="text-3xl block mb-2">{b.icon || '🏅'}</span>
                    <p className="text-xs font-medium text-[var(--text-base)] leading-tight">{b.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center border-dashed">
                <p className="text-ink-500 text-sm">No badges yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
