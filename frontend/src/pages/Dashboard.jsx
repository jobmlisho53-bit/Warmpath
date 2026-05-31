import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { Flame, Zap, Trophy, Award, BookOpen, Star, ArrowRight } from 'lucide-react'
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

export default function Dashboard() {
  const { user, isAuth, loading: authLoading } = useAuth()
  const [stats,       setStats]       = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [courses,     setCourses]     = useState({})
  const [loading,     setLoading]     = useState(true)
  const [ready,       setReady]       = useState(false)

  // Wait until auth is confirmed before loading anything
  useEffect(() => {
    if (authLoading) return        // still checking session
    if (!isAuth || !user) return   // not logged in
    setReady(true)
  }, [authLoading, isAuth, user])

  useEffect(() => {
    if (!ready) return

    async function load() {
      setLoading(true)
      try {
        const [statsRes, enrRes, coursesRes] = await Promise.allSettled([
          api.get('/gamification/stats'),
          api.get('/courses/user/enrollments'),
          api.get('/courses'),
        ])

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data)
        }

        if (coursesRes.status === 'fulfilled') {
          const all  = coursesRes.value.data
          const list = Array.isArray(all) ? all : all.courses ?? []
          const map  = {}
          list.forEach(c => { map[c.id] = c })
          setCourses(map)
        }

        if (enrRes.status === 'fulfilled') {
          const raw = enrRes.value.data
          let list = []
          if (Array.isArray(raw))                  list = raw
          else if (Array.isArray(raw.enrollments)) list = raw.enrollments
          else if (Array.isArray(raw.data))        list = raw.data
          else if (raw.enrollment)                 list = [raw.enrollment]
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

  const xp        = num(stats?.xp ?? stats?.total_xp ?? 0)
  const streak    = num(stats?.streak ?? stats?.current_streak ?? 0)
  const level     = num(stats?.level ?? stats?.user_levels ?? 1)
  const certs     = num(stats?.certificates ?? stats?.certificate_count ?? 0)
  const badgeList = Array.isArray(stats?.badges) ? stats.badges : []

  const statCards = [
    { icon: Zap,      label: 'Total XP',      value: xp.toLocaleString(),                        color: 'text-ember-400', bg: 'bg-ember-500/10 border-ember-500/20' },
    { icon: Flame,    label: 'Day Streak',     value: `${streak} day${streak !== 1 ? 's' : ''}`,  color: 'text-terra-400', bg: 'bg-terra-500/10 border-terra-500/20' },
    { icon: Trophy,   label: 'Level',          value: `Level ${level}`,                           color: 'text-sand-400',  bg: 'bg-sand-500/10 border-sand-500/20'   },
    { icon: Award,    label: 'Certificates',   value: certs,                                      color: 'text-sage-400',  bg: 'bg-sage-500/10 border-sage-500/20'   },
    { icon: BookOpen, label: 'Courses Joined', value: enrollments.length,                         color: 'text-ember-400', bg: 'bg-ember-500/10 border-ember-500/20' },
    { icon: Star,     label: 'Badges',         value: badgeList.length,                           color: 'text-terra-400', bg: 'bg-terra-500/10 border-terra-500/20' },
  ]

  // Auth still initialising
  if (authLoading || !ready) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
        <p className="text-ink-400 text-sm">Loading your dashboard…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">

        {/* Greeting */}
        <div className="mb-10 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display text-xl font-700 flex-shrink-0"
              style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)', boxShadow:'0 0 0 1px rgba(240,122,26,0.2),0 8px 24px -4px rgba(240,122,26,0.3)' }}>
              {displayName[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-700 text-[var(--text-base)]">
                Welcome back, {displayName.split(' ')[0]}
              </h1>
              <p className="text-sm text-ink-400 mt-0.5">
                {streak > 0
                  ? `${streak}-day streak — keep it going`
                  : 'Complete a lesson today to start your streak'}
              </p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {loading
            ? Array(6).fill(0).map((_,i) => <StatCardSkeleton key={i} />)
            : statCards.map(({ icon:Icon, label, value, color, bg }, i) => (
              <div key={label}
                className={`stat-card border ${bg} animate-fade-up opacity-0-init`}
                style={{ animationDelay:`${i*60}ms` }}>
                <div className={`w-8 h-8 rounded-lg ${bg} border flex items-center justify-center mb-2`}>
                  <Icon size={15} className={color} />
                </div>
                <span className="text-xs text-ink-400 font-medium tracking-wide uppercase">{label}</span>
                <span className={`font-display text-2xl font-700 ${color} leading-tight mt-0.5`}>{value}</span>
              </div>
            ))
          }
        </div>

        {/* Enrolled courses */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-700">Your courses</h2>
            <Link to="/courses" className="btn-ghost text-sm gap-1.5">
              Browse more <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="card p-5 flex flex-col gap-3">
                  <div className="skeleton h-4 w-2/3 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                  <div className="skeleton h-2 w-full rounded-full mt-2" />
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="card p-10 text-center border-dashed max-w-md">
              <BookOpen size={28} className="text-ink-500 mx-auto mb-3" />
              <p className="text-ink-400 text-sm mb-4">No courses yet. Start learning today!</p>
              <Link to="/courses" className="btn-primary text-sm">Browse courses</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enr, i) => {
                const courseId = enr.course_id ?? enr.course?.id ?? enr.id
                const course   = enr.course ?? courses[courseId] ?? enr
                const pct      = num(enr.progress ?? enr.percentage ?? 0)
                const slug     = course.slug || course.id || courseId
                return (
                  <Link key={enr.id ?? i}
                    to={`/courses/${slug}`}
                    className="card-hover p-5 group"
                    style={{ animationDelay:`${i*60}ms` }}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl border border-[var(--border-mid)] flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background:'linear-gradient(135deg,rgba(240,122,26,0.1),rgba(200,85,40,0.1))' }}>
                        {course.cover_image || course.icon || ''}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm text-[var(--text-base)] truncate group-hover:text-ember-400 transition-colors">
                          {course.title || 'Course'}
                        </h3>
                        <p className="text-xs text-ink-400 mt-0.5">{course.category || ''}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs text-ink-400 mb-1.5">
                        <span>Progress</span>
                        <span className="text-ember-400 font-medium">{pct}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width:`${pct}%` }} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Badges */}
        {badgeList.length > 0 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-xl font-700 mb-5">Badges earned</h2>
            <div className="flex flex-wrap gap-3">
              {badgeList.map((b, i) => (
                <div key={b.id ?? i} className="card px-4 py-3 flex items-center gap-3 border-[var(--border-mid)] hover:border-ember-500/20 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-ember-500/10 border border-ember-500/20 flex items-center justify-center flex-shrink-0">
                    <Star size={16} className="text-ember-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-base)]">{b.name || 'Badge'}</p>
                    {b.description && <p className="text-xs text-ink-400">{b.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
