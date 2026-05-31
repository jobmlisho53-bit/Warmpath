import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { Flame, Zap, Trophy, Award, BookOpen, Star, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        console.log('Dashboard: fetching data...')
        
        const statsRes = await api.get('/gamification/stats')
        console.log('Stats:', statsRes.data)
        setStats(statsRes.data)

        const enrRes = await api.get('/courses/user/enrollments')
        console.log('Enrollments:', enrRes.data)
        const raw = enrRes.data
        const list = Array.isArray(raw) ? raw : raw.enrollments || raw.data || []
        setEnrollments(list)

        const coursesRes = await api.get('/courses')
        const all = coursesRes.data
        const courseList = Array.isArray(all) ? all : all.courses || []
        const map = {}
        courseList.forEach(c => { map[c.id] = c })
        setCourses(map)
        
        console.log('Dashboard: done loading')
      } catch (err) {
        console.error('Dashboard error:', err)
        setError(err.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Learner'
  const xp = stats?.total_xp || stats?.xp || 0
  const streak = stats?.current_streak || stats?.streak || 0
  const level = stats?.level?.level || stats?.level || 1
  const certs = stats?.certCount || stats?.certificates || 0
  const badges = Array.isArray(stats?.badges) ? stats.badges : []

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
          <p className="text-ink-400 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary text-sm">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        <div className="mb-10">
          <h1 className="font-display text-2xl font-700">Welcome back, {firstName}</h1>
          <p className="text-ink-400 text-sm mt-1">
            {streak > 0 ? `${streak}-day streak — keep it going` : 'Complete a lesson today to start your streak'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total XP', value: xp },
            { label: 'Streak', value: `${streak} days` },
            { label: 'Level', value: level },
            { label: 'Certificates', value: certs },
            { label: 'Courses', value: enrollments.length },
            { label: 'Badges', value: badges.length },
          ].map(s => (
            <div key={s.label} className="card p-5 text-center">
              <p className="text-3xl font-bold text-ember-400">{s.value}</p>
              <p className="text-xs text-ink-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enr, i) => {
              const course = enr.course || courses[enr.course_id] || {}
              return (
                <Link key={i} to={`/courses/${course.id || enr.course_id}`} className="card-hover p-5">
                  <h3 className="font-medium">{course.title || 'Course'}</h3>
                  <p className="text-xs text-ink-400">{course.category}</p>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <p className="text-ink-400">No courses yet.</p>
            <Link to="/courses" className="btn-primary text-sm mt-4 inline-block">Browse Courses</Link>
          </div>
        )}
      </div>
    </div>
  )
}
