import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Search, BookOpen, ChevronRight, Layers } from 'lucide-react'
import { CourseCardSkeleton } from '../components/Skeleton'

const CATS = ['All','Development','Data Science','Design','Python','Cybersecurity','Cloud','Mobile','Machine Learning']

export default function Courses() {
  const { isAuth } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [cat,     setCat]     = useState('All')

  useEffect(() => {
    // GET /api/courses → { courses: [...] } or [...]
    api.get('/courses')
      .then(r => {
        const data = r.data
        setCourses(Array.isArray(data) ? data : data.courses ?? [])
      })
      .catch(err => console.error('Failed to load courses:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter(c => {
    const matchCat = cat === 'All' || (c.category || '').toLowerCase().includes(cat.toLowerCase())
    const matchQ   = !search || (c.title || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchQ
  })

  // Count total lessons across all modules
  const lessonCount = (course) =>
    (course.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0)

  return (
    <div className="min-h-screen pt-24 pb-16">

      {/* Header */}
      <div className="bg-[var(--bg-raised)] border-b border-[var(--border)] pb-8 mb-8">
        <div className="page-container pt-8">
          <h1 className="font-display text-4xl lg:text-5xl font-700 mb-2 animate-fade-up">
            All <span className="text-gradient-ember">Courses</span>
          </h1>
          <p className="text-ink-400 mb-8 text-sm animate-fade-up animate-delay-100">
            {loading ? '…' : `${courses.length} courses`} · Free to enrol · Certificates available
          </p>

          {/* Search */}
          <div className="relative max-w-xl animate-fade-up animate-delay-200">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses…"
              className="input-field pl-11 py-3.5 text-base"
            />
          </div>
        </div>
      </div>

      <div className="page-container">

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8 animate-fade-up animate-delay-300">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
                ${cat === c
                  ? 'bg-ember-500 text-white shadow-glow-ember'
                  : 'bg-[var(--bg-raised)] border border-[var(--border-mid)] text-ink-300 hover:border-[var(--border-hi)] hover:text-ink-100'
                }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array(8).fill(0).map((_, i) => <CourseCardSkeleton key={i} />)
            : filtered.length === 0
              ? (
                <div className="col-span-full text-center py-20">
                  <BookOpen size={40} className="text-ink-600 mx-auto mb-3" />
                  <p className="text-ink-400">No courses match your search.</p>
                </div>
              )
              : filtered.map((course, i) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.slug || course.id}`}
                  className="card-hover group overflow-hidden flex flex-col"
                  style={{ animationDelay: `${(i % 8) * 50}ms` }}
                >
                  {/* Cover — use thumbnail of first lesson if available, else emoji */}
                  <div className="h-44 relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br from-ember-600/20 via-terra-600/20 to-sand-600/20">
                    {course.modules?.[0]?.lessons?.[0]?.thumbnail ? (
                      <>
                        <img
                          src={course.modules[0].lessons[0].thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl animate-float">{course.cover_image || '📚'}</span>
                      </div>
                    )}

                    {/* Lesson count badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="badge bg-[var(--bg-raised)]/80 border border-[var(--border-mid)] text-ink-300 text-2xs backdrop-blur-sm gap-1">
                        <Layers size={10} />
                        {lessonCount(course)} lessons
                      </span>
                    </div>

                    {/* Module count */}
                    <div className="absolute top-3 right-3">
                      <span className="badge bg-[var(--bg-raised)]/80 border border-[var(--border-mid)] text-ink-400 text-2xs backdrop-blur-sm">
                        {course.modules?.length || 0} modules
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <div>
                      <span className="badge bg-ember-500/10 border border-ember-500/20 text-ember-400 text-2xs mb-2">
                        {course.category || 'General'}
                      </span>
                      <h3 className="font-display font-600 text-[var(--text-base)] leading-snug group-hover:text-ember-400 transition-colors duration-200 line-clamp-2">
                        {course.title}
                      </h3>
                    </div>

                    {course.description && (
                      <p className="text-xs text-ink-400 leading-relaxed line-clamp-2 flex-1">
                        {course.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] mt-auto">
                      <span className="text-xs font-medium text-sage-400">Free to enrol</span>
                      <span className="text-xs text-ember-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                        Start <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>
      </div>
    </div>
  )
}
