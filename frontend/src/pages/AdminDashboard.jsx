import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { BookOpen, Plus, Layers, Play, Trash2, ChevronDown, Shield, LogOut, ShoppingBag } from 'lucide-react'

function adminApi() {
  const token = localStorage.getItem('wp_admin_token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [courses,    setCourses]    = useState([])
  const [expanded,   setExpanded]   = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [newCourse,  setNewCourse]  = useState({ title:'', category:'', description:'', icon:'📚' })
  const [newModule,  setNewModule]  = useState({})
  const [newLesson,  setNewLesson]  = useState({})
  const [adding,     setAdding]     = useState({ course:false })
  const [showForm,   setShowForm]   = useState(false)

  const load = () =>
    api.get('/courses', adminApi())
      .then(r => setCourses(r.data?.courses || r.data || []))
      .finally(() => setLoading(false))

  useEffect(() => {
    const token = localStorage.getItem('wp_admin_token')
    if (!token) { navigate('/admin/login'); return }
    load()
  }, [])

  const addCourse = async () => {
    if (!newCourse.title.trim()) return
    setAdding(a => ({...a, course: true}))
    await api.post('/admin/courses', newCourse, adminApi())
    setNewCourse({ title:'', category:'', description:'', icon:'📚' })
    setShowForm(false)
    load()
    setAdding(a => ({...a, course: false}))
  }

  const addModule = async (courseId) => {
    const title = newModule[courseId]?.trim()
    if (!title) return
    await api.post(`/admin/courses/${courseId}/modules`, { title }, adminApi())
    setNewModule(m => ({...m, [courseId]: ''}))
    load()
  }

  const addLesson = async (moduleId) => {
    const d = newLesson[moduleId] || {}
    if (!d.title?.trim() || !d.video_url?.trim()) return
    await api.post(`/admin/modules/${moduleId}/lessons`, d, adminApi())
    setNewLesson(l => ({...l, [moduleId]: {}}))
    load()
  }

  const deleteLesson = async (id) => {
    if (!confirm('Delete this lesson?')) return
    await api.delete(`/admin/lessons/${id}`, adminApi())
    load()
  }

  const logout = () => { localStorage.removeItem('wp_admin_token'); navigate('/admin/login') }

  return (
    <div className="min-h-screen pt-16">
      {/* Admin nav */}
      <div className="glass-nav fixed top-0 inset-x-0 z-50 h-16 flex items-center">
        <div className="page-container flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-terra-500 to-terra-700 flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-display font-700 text-sm text-[var(--text-base)]">WarmPath Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/shop" className="btn-ghost text-xs gap-1.5">
              <ShoppingBag size={14} /> Shop
            </Link>
            <button onClick={logout} className="btn-ghost text-xs gap-1.5 hover:text-red-400">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <h1 className="font-display text-3xl font-700 mb-1">Course Management</h1>
            <p className="text-ink-400 text-sm">{courses.length} courses total</p>
          </div>
          <button onClick={() => setShowForm(f => !f)} className="btn-primary">
            <Plus size={16} /> New course
          </button>
        </div>

        {/* Add course form */}
        {showForm && (
          <div className="card p-6 mb-6 border-ember-500/20 animate-fade-up">
            <h3 className="font-display font-600 mb-4">Create new course</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Title</label>
                <input value={newCourse.title} onChange={e => setNewCourse(c => ({...c, title: e.target.value}))}
                  placeholder="Course title" className="input-field" />
              </div>
              <div>
                <label className="label">Category</label>
                <input value={newCourse.category} onChange={e => setNewCourse(c => ({...c, category: e.target.value}))}
                  placeholder="e.g. Web Development" className="input-field" />
              </div>
              <div>
                <label className="label">Icon (emoji)</label>
                <input value={newCourse.icon} onChange={e => setNewCourse(c => ({...c, icon: e.target.value}))}
                  placeholder="📚" className="input-field" />
              </div>
              <div>
                <label className="label">Description</label>
                <input value={newCourse.description} onChange={e => setNewCourse(c => ({...c, description: e.target.value}))}
                  placeholder="Short description" className="input-field" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={addCourse} disabled={adding.course} className="btn-primary">
                {adding.course ? 'Creating…' : <><Plus size={15} /> Create course</>}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        )}

        {/* Courses list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map(course => (
              <div key={course.id} className="card border-[var(--border-mid)] overflow-hidden animate-fade-up">
                <button
                  onClick={() => setExpanded(expanded === course.id ? null : course.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-[var(--bg-surface)] transition-colors">
                  <span className="text-2xl">{course.icon || '📚'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--text-base)]">{course.title}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{course.category} · {course.modules?.length || 0} modules</p>
                  </div>
                  <ChevronDown size={16} className={`text-ink-400 transition-transform duration-200 ${expanded === course.id ? 'rotate-180' : ''}`} />
                </button>

                {expanded === course.id && (
                  <div className="border-t border-[var(--border)] p-5 bg-[var(--bg)]">
                    {/* Add module */}
                    <div className="flex gap-2 mb-5">
                      <input
                        value={newModule[course.id] || ''}
                        onChange={e => setNewModule(m => ({...m, [course.id]: e.target.value}))}
                        placeholder="New module title…"
                        className="input-field text-sm flex-1" />
                      <button onClick={() => addModule(course.id)} className="btn-secondary text-sm flex-shrink-0">
                        <Layers size={14} /> Add module
                      </button>
                    </div>

                    {/* Modules */}
                    <div className="space-y-4">
                      {course.modules?.map((mod, mi) => (
                        <div key={mod.id} className="card p-4 border-[var(--border-mid)]">
                          <p className="text-xs text-ink-500 uppercase tracking-wide mb-1">Module {mi + 1}</p>
                          <p className="font-medium text-sm text-[var(--text-base)] mb-3">{mod.title}</p>

                          {/* Lessons */}
                          <div className="space-y-1.5 mb-3">
                            {mod.lessons?.map((lesson, li) => (
                              <div key={lesson.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-surface)] group">
                                <span className="text-xs font-mono text-ink-500 w-5">{li + 1}</span>
                                <Play size={11} className="text-ember-400 flex-shrink-0" />
                                <span className="text-xs text-ink-300 flex-1 truncate">{lesson.title}</span>
                                <button onClick={() => deleteLesson(lesson.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-ink-500 hover:text-red-400 transition-all">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add lesson */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              value={newLesson[mod.id]?.title || ''}
                              onChange={e => setNewLesson(l => ({...l, [mod.id]: {...(l[mod.id]||{}), title: e.target.value}}))}
                              placeholder="Lesson title…"
                              className="input-field text-xs flex-1" />
                            <input
                              value={newLesson[mod.id]?.video_url || ''}
                              onChange={e => setNewLesson(l => ({...l, [mod.id]: {...(l[mod.id]||{}), video_url: e.target.value}}))}
                              placeholder="YouTube URL…"
                              className="input-field text-xs flex-1" />
                            <button onClick={() => addLesson(mod.id)} className="btn-primary text-xs flex-shrink-0">
                              <Plus size={13} /> Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
