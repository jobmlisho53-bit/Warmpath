import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import {
  Flame, Zap, Trophy, Award, BookOpen,
  Star, ArrowRight, TrendingUp, Clock
} from 'lucide-react'
import { StatCardSkeleton } from '../components/Skeleton'

function num(val) {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'object') {
    return val.current ?? val.value ?? val.count ?? val.xp ??
           val.total_xp ?? val.level ?? val.streak ?? 0
  }
  return Number(val) || 0
}

function ProgressRing({ pct, size = 48 }) {
  const r   = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="var(--bg-overlay)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke="#F07A1A"
        strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition:'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  )
}

export default function Dashboard() {
  const { user, isAuth, loading: authLoading } = useAuth()
  const [stats,       setStats]       = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [allCourses,  setAllCourses]  = useState({})
  const [loading,     setLoading]     = useState(true)
  const [ready,       setReady]       = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!isAuth || !user) return
    setReady(true)
  }, [authLoading, isAuth, user])

  useEffect(() => {
    if (!ready) return
    async function load() {
      setLoading(true)
      try {
        const [statsRes, coursesRes, enrRes] = await Promise.allSettled([
          api.get('/gamification/stats'),
          api.get('/courses'),
          api.get('/courses/user/enrollments'),
        ])

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)

        if (coursesRes.status === 'fulfilled') {
          const all  = coursesRes.value.data
          const list = Array.isArray(all) ? all : all.courses ?? []
          const map  = {}
          list.forEach(c => { map[c.id] = c })
          setAllCourses(map)
        }

        if (enrRes.status === 'fulfilled') {
          const raw = enrRes.value.data
          let list = []
          if (Array.isArray(raw))                  list = raw
          else if (Array.isArray(raw.enrollments)) list = raw.enrollments
          else if (Array.isArray(raw.data))        list = raw.data
          setEnrollments(list)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [ready])

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'Learner'
  const firstName = displayName.split(' ')[0]

  const xp        = num(stats?.xp ?? stats?.total_xp ?? 0)
  const streak    = num(stats?.streak ?? stats?.current_streak ?? 0)
  const level     = num(stats?.level ?? stats?.user_levels ?? 1)
  const certs     = num(stats?.certificates ?? stats?.certificate_count ?? 0)
  const badgeList = Array.isArray(stats?.badges) ? stats.badges : []

  // XP to next level — rough formula matching backend
  const xpForLevel = (lvl) => lvl * 1000
  const xpProgress = xp % 1000
  const xpNeeded   = 1000
  const xpPct      = Math.min(100, Math.round((xpProgress / xpNeeded) * 100))

  const statCards = [
    {
      icon: Zap,
      label: 'Total XP',
      value: xp.toLocaleString(),
      sub: `${xpProgress} to next level`,
      color: 'text-ember-400',
      bg: 'bg-ember-500/10 border-ember-500/20',
    },
    {
      icon: Flame,
      label: 'Day Streak',
      value: streak,
      sub: streak === 1 ? '1 day' : streak === 0 ? 'Start today' : `${streak} days`,
      color: 'text-terra-400',
      bg: 'bg-terra-500/10 border-terra-500/20',
    },
    {
      icon: Trophy,
      label: 'Level',
      value: level,
      sub: `${xpPct}% to Lvl ${level + 1}`,
      color: 'text-sand-400',
      bg: 'bg-sand-500/10 border-sand-500/20',
    },
    {
      icon: Award,
      label: 'Certificates',
      value: certs,
      sub: certs === 1 ? '1 earned' : certs === 0 ? 'None yet' : `${certs} earned`,
      color: 'text-sage-400',
      bg: 'bg-sage-500/10 border-sage-500/20',
    },
    {
      icon: BookOpen,
      label: 'Enrolled',
      value: enrollments.length,
      sub: enrollments.length === 1 ? '1 course' : `${enrollments.length} courses`,
      color: 'text-ember-400',
      bg: 'bg-ember-500/10 border-ember-500/20',
    },
    {
      icon: Star,
      label: 'Badges',
      value: badgeList.length,
      sub: badgeList.length === 1 ? '1 badge' : badgeList.length === 0 ? 'None yet' : `${badgeList.length} earned`,
      color: 'text-terra-400',
      bg: 'bg-terra-500/10 border-terra-500/20',
    },
  ]

  if (authLoading || !ready) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
        <p className="text-ink-400 text-sm">Loading your dashboard…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background:'var(--bg)' }}>
      <div className="page-container">

        {/* ── Hero greeting ── */}
        <div className="relative rounded-2xl overflow-hidden mb-8 p-7 animate-fade-up"
          style={{ background:'linear-gradient(135deg,rgba(240,122,26,0.08),rgba(200,85,40,0.06),rgba(28,24,21,0))' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 90% 50%,rgba(240,122,26,0.06),transparent 70%)' }} />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display text-xl font-700 flex-shrink-0"
                style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)', boxShadow:'0 0 0 1px rgba(240,122,26,0.3),0 8px 24px -4px rgba(240,122,26,0.4)' }}>
                {firstName[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-ember-400 font-medium uppercase tracking-widest mb-1">Your Dashboard</p>
                <h1 className="font-display text-2xl font-700 text-[var(--text-base)]">
                  Welcome back, {firstName}
                </h1>
                <p className="text-sm text-ink-400 mt-0.5">
                  {streak > 0
                    ? `${streak}-day streak — keep it going`
                    : 'Complete a lesson today to start your streak'}
                </p>
              </div>
            </div>
            {/* XP level ring */}
            <div className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0">
              <div className="relative">
                <ProgressRing pct={xpPct} size={52} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-display font-700 text-ember-400">{level}</span>
                </div>
              </div>
              <span className="text-2xs text-ink-500 font-medium">Level {level}</span>
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {loading
            ? Array(6).fill(0).map((_,i) => <StatCardSkeleton key={i} />)
            : statCards.map(({ icon:Icon, label, value, sub, color, bg }, i) => (
              <div key={label}
                className={`card border ${bg} p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition-all duration-200 animate-fade-up opacity-0-init`}
                style={{ animationDelay:`${i * 60}ms` }}>
                <div className={`w-7 h-7 rounded-lg ${bg} border flex items-center justify-center`}>
                  <Icon size={14} className={color} />
                </div>
                <div>
                  <span className={`font-display text-2xl font-700 ${color} leading-none block`}>{value}</span>
                  <span className="text-2xs text-ink-500 uppercase tracking-wide font-medium block mt-1">{label}</span>
                </div>
                <span className="text-2xs text-ink-500 leading-snug">{sub}</span>
              </div>
            ))
          }
        </div>

        {/* ── XP progress bar ── */}
        {!loading && (
          <div className="card border-[var(--border-mid)] p-5 mb-8 animate-fade-up animate-delay-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-ember-400" />
                <span className="text-sm font-medium text-[var(--text-base)]">
                  Level {level} progress
                </span>
              </div>
              <span className="text-xs text-ink-400">
                <span className="text-ember-400 font-medium">{xpProgress.toLocaleString()}</span>
                {' '}/ {xpNeeded.toLocaleString()} XP
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width:`${xpPct}%` }} />
            </div>
            <p className="text-xs text-ink-500 mt-2">
              {(xpNeeded - xpProgress).toLocaleString()} XP to Level {level + 1}
            </p>
          </div>
        )}

        {/* ── Enrolled courses ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl font-700">Your courses</h2>
              {!loading && enrollments.length > 0 && (
                <p className="text-xs text-ink-400 mt-0.5">
                  {enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled
                </p>
              )}
            </div>
            <Link to="/courses" className="btn-ghost text-sm gap-1.5">
              Browse more <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="card p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="skeleton w-11 h-11 rounded-xl" />
                    <div className="flex-1">
                      <div className="skeleton h-3.5 w-3/4 rounded mb-2" />
                      <div className="skeleton h-2.5 w-1/2 rounded" />
                    </div>
                  </div>
                  <div className="skeleton h-1.5 w-full rounded-full mt-1" />
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="card p-12 text-center border-dashed">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-mid)] flex items-center justify-center mx-auto mb-4">
                <BookOpen size={22} className="text-ink-500" />
              </div>
              <h3 className="font-display font-600 text-base text-[var(--text-base)] mb-2">
                No courses yet
              </h3>
              <p className="text-ink-400 text-sm mb-5 max-w-xs mx-auto">
                Browse our 20+ free courses and start learning today.
              </p>
              <Link to="/courses" className="btn-primary text-sm">
                <BookOpen size={14} /> Browse courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enr, i) => {
                const courseId = enr.course_id ?? enr.course?.id ?? enr.id
                const course   = enr.course ?? allCourses[courseId] ?? enr
                const pct      = num(enr.progress ?? enr.percentage ?? 0)
                const slug     = course.slug || course.id || courseId
                const done     = pct >= 100
                return (
                  <Link key={enr.id ?? i}
                    to={`/courses/${slug}`}
                    className="card-hover p-5 group flex flex-col gap-4"
                    style={{ animationDelay:`${i * 60}ms` }}>
                    {/* Course header */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl border border-[var(--border-mid)] flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background:'linear-gradient(135deg,rgba(240,122,26,0.1),rgba(200,85,40,0.08))' }}>
                        {course.cover_image || course.icon || ''}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm text-[var(--text-base)] truncate group-hover:text-ember-400 transition-colors leading-snug">
                          {course.title || 'Course'}
                        </h3>
                        <p className="text-xs text-ink-400 mt-0.5">{course.category || ''}</p>
                      </div>
                      {/* Mini ring */}
                      <div className="flex-shrink-0 relative">
                        <ProgressRing pct={pct} size={36} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xs font-700" style={{ color:'#F07A1A' }}>
                            {pct}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-ink-400">Progress</span>
                        <span className={`font-medium ${done ? 'text-sage-400' : 'text-ember-400'}`}>
                          {done ? 'Complete' : `${pct}%`}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill"
                          style={{ width:`${pct}%`, background: done ? 'linear-gradient(90deg,#5A8F48,#7FB069)' : undefined }} />
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
                      <span className="text-xs text-ink-500 flex items-center gap-1">
                        <Clock size={10} /> Continue learning
                      </span>
                      <span className="text-xs text-ember-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Open <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Badges ── */}
        {!loading && badgeList.length > 0 && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-700">Badges earned</h2>
              <span className="badge bg-ember-500/10 border border-ember-500/20 text-ember-400 text-xs">
                {badgeList.length} badge{badgeList.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {badgeList.map((b, i) => (
                <div key={b.id ?? i}
                  className="card p-4 flex items-center gap-3 border-[var(--border-mid)] hover:border-ember-500/20 hover:-translate-y-0.5 transition-all duration-200"
                  style={{ animationDelay:`${i * 40}ms` }}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500/10 to-terra-500/10 border border-ember-500/20 flex items-center justify-center flex-shrink-0">
                    <Star size={16} className="text-ember-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-base)] truncate">{b.name || 'Badge'}</p>
                    {b.description && (
                      <p className="text-xs text-ink-400 leading-snug truncate">{b.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick links (empty state helper) ── */}
        {!loading && enrollments.length === 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up">
            {[
              { to:'/courses',     icon: BookOpen, label:'Browse courses',    sub:'20+ free courses' },
              { to:'/leaderboard', icon: Trophy,   label:'Leaderboard',       sub:'See top learners' },
              { to:'/shop',        icon: Star,     label:'Resource shop',     sub:'Cheat sheets & more' },
            ].map(({ to, icon:Icon, label, sub }) => (
              <Link key={to} to={to}
                className="card-hover p-5 flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-mid)] flex items-center justify-center flex-shrink-0 group-hover:border-ember-500/30 transition-colors">
                  <Icon size={17} className="text-ink-400 group-hover:text-ember-400 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-base)] group-hover:text-ember-400 transition-colors">{label}</p>
                  <p className="text-xs text-ink-500">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
