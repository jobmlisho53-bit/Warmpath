import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import {
  Play, CheckCircle, Circle, ChevronDown,
  Award, MessageSquare, Send, Flame,
  BookOpen, ArrowLeft, ChevronLeft, ChevronRight,
  Lock, CornerDownRight
} from 'lucide-react'

export default function CourseDetail() {
  const { name }   = useParams()
  const { isAuth } = useAuth()
  const navigate   = useNavigate()

  const [course,       setCourse]       = useState(null)
  const [progress,     setProgress]     = useState({})
  const [allLessons,   setAllLessons]   = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [openModules,  setOpenModules]  = useState({})
  const [enrolled,     setEnrolled]     = useState(false)
  const [enrolling,    setEnrolling]    = useState(false)
  const [discussions,  setDiscussions]  = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [replies,      setReplies]      = useState([])
  const [tab,          setTab]          = useState('lessons')
  const [newPost,      setNewPost]      = useState({ title:'', content:'' })
  const [newReply,     setNewReply]     = useState('')
  const [posting,      setPosting]      = useState(false)
  const [replyPosting, setReplyPosting] = useState(false)
  const [loading,      setLoading]      = useState(true)

  // Step 1 — load course
  useEffect(() => {
    api.get(`/courses/${name}`)
      .then(r => {
        const c = r.data?.course ?? r.data
        setCourse(c)
        const flat = []
        ;(c?.modules || []).forEach(mod => {
          ;(mod.lessons || []).forEach(l => flat.push({ ...l, moduleTitle: mod.title }))
        })
        setAllLessons(flat)
        if (c?.modules?.length) {
          setOpenModules({ [c.modules[0].id]: true })
          if (c.modules[0].lessons?.length) setActiveLesson(c.modules[0].lessons[0])
        }
      })
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false))
  }, [name])

  // Step 2 — once course is loaded AND user is auth, auto-enroll + load progress
  useEffect(() => {
    if (!isAuth || !course?.id) return

    async function enrollAndLoadProgress() {
      try {
        // Auto-enroll on every visit — backend uses upsert so duplicate calls are safe
        await api.post(`/courses/${course.id}/enroll`)
        setEnrolled(true)
      } catch (e) {
        console.warn('Auto-enroll failed:', e.response?.data)
      }

      // Load progress regardless of enroll success
      try {
        const r = await api.get(`/progress/courses/${course.id}`)
        const ids = r.data?.completed_lessons ?? []
        const map = {}
        ids.forEach(id => { map[id] = true })
        setProgress(map)
        setEnrolled(true)
      } catch (e) {
        console.warn('Progress load failed:', e.response?.data)
      }
    }

    enrollAndLoadProgress()
  }, [course?.id, isAuth])

  // Load discussions when discuss tab opens
  useEffect(() => {
    if (!course?.id || tab !== 'discuss') return
    api.get(`/community/courses/${course.id}/discussions`)
      .then(r => setDiscussions(r.data?.discussions ?? r.data ?? []))
  }, [course?.id, tab])

  const openThread = async (discussion) => {
    setActiveThread(discussion)
    setReplies([])
    try {
      const r = await api.get(`/community/discussions/${discussion.id}`)
      const data = r.data?.discussion ?? r.data
      setReplies(data?.replies ?? [])
    } catch (e) {
      console.warn('Failed to load replies:', e)
    }
  }

  const toggleLesson = async (lesson) => {
    if (!isAuth || !enrolled) return
    const was = progress[lesson.id]
    setProgress(p => ({ ...p, [lesson.id]: !was }))
    await api.post(`/progress/lessons/${lesson.id}/toggle`)
      .catch(() => setProgress(p => ({ ...p, [lesson.id]: was })))
  }

  const postDiscussion = async () => {
    if (!newPost.title.trim()) return
    setPosting(true)
    try {
      const r = await api.post(`/community/courses/${course.id}/discussions`, newPost)
      setDiscussions(d => [r.data, ...d])
      setNewPost({ title:'', content:'' })
    } finally { setPosting(false) }
  }

  const postReply = async () => {
    if (!newReply.trim() || !activeThread) return
    setReplyPosting(true)
    try {
      const r = await api.post(`/community/discussions/${activeThread.id}/replies`, { content: newReply })
      setReplies(prev => [...prev, r.data])
      setNewReply('')
    } finally { setReplyPosting(false) }
  }

  const activeIdx  = allLessons.findIndex(l => l.id === activeLesson?.id)
  const prevLesson = activeIdx > 0 ? allLessons[activeIdx - 1] : null
  const nextLesson = activeIdx < allLessons.length - 1 ? allLessons[activeIdx + 1] : null

  const goToLesson = (lesson) => {
    setActiveLesson(lesson)
    const mod = course?.modules?.find(m => m.lessons?.some(l => l.id === lesson.id))
    if (mod) setOpenModules(o => ({ ...o, [mod.id]: true }))
  }

  const totalLessons   = allLessons.length
  const completedCount = Object.values(progress).filter(Boolean).length
  const pct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0
  const embedUrl = activeLesson?.youtube_id
    ? `https://www.youtube.com/embed/${activeLesson.youtube_id}?rel=0&modestbranding=1`
    : null

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
    </div>
  )
  if (!course) return null

  return (
    <div className="min-h-screen pt-16">

      {/* Top bar */}
      <div className="glass-nav sticky top-16 z-40 py-3">
        <div className="page-container flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/courses" className="btn-ghost p-2 flex-shrink-0"><ArrowLeft size={16} /></Link>
            <div className="min-w-0">
              <h1 className="font-display font-600 text-sm text-[var(--text-base)] truncate">{course.title}</h1>
              <p className="text-xs text-ink-400">{course.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {enrolled && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="progress-bar w-24">
                  <div className="progress-fill" style={{ width:`${pct}%` }} />
                </div>
                <span className="text-xs text-ember-400 font-medium">{pct}%</span>
              </div>
            )}
            <Link to={`/courses/${name}/certificate`} className="btn-primary text-xs py-2">
              <Award size={13} /> Certificate
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row" style={{ minHeight:'calc(100vh - 8rem)' }}>

        {/* LEFT: Player + tabs */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Video */}
          <div className="bg-black w-full" style={{ aspectRatio:'16/9' }}>
            {embedUrl
              ? <iframe key={activeLesson.id} src={embedUrl} title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen className="w-full h-full" />
              : <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-ember-500/10 border border-ember-500/20 flex items-center justify-center">
                    <Play size={32} className="text-ember-400 ml-1" />
                  </div>
                  <p className="text-ink-400 text-sm">Select a lesson to begin</p>
                </div>
            }
          </div>

          {/* Lesson info + mark done + prev/next */}
          {activeLesson && (
            <div className="p-4 bg-[var(--bg-raised)] border-b border-[var(--border)]">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <h2 className="font-display font-600 text-base text-[var(--text-base)] truncate">{activeLesson.title}</h2>
                  <p className="text-xs text-ink-400 mt-0.5">{activeLesson.moduleTitle}</p>
                </div>
                {enrolled && (
                  <button onClick={() => toggleLesson(activeLesson)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex-shrink-0
                      ${progress[activeLesson.id]
                        ? 'bg-sage-500/10 border border-sage-500/20 text-sage-400'
                        : 'bg-[var(--bg-surface)] border border-[var(--border-mid)] text-ink-300 hover:border-ember-500/30 hover:text-ember-400'
                      }`}>
                    {progress[activeLesson.id] ? <><CheckCircle size={13} /> Done</> : <><Circle size={13} /> Mark done</>}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => prevLesson && goToLesson(prevLesson)} disabled={!prevLesson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-mid)] text-ink-300 hover:border-[var(--border-hi)] hover:text-ink-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft size={13} /> Previous
                </button>
                <div className="flex-1 text-center text-xs text-ink-500 font-mono">{activeIdx + 1} / {totalLessons}</div>
                <button onClick={() => nextLesson && goToLesson(nextLesson)} disabled={!nextLesson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-mid)] text-ink-300 hover:border-[var(--border-hi)] hover:text-ink-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] bg-[var(--bg-raised)]">
            {[{ key:'lessons', label:'Lessons', Icon:BookOpen },{ key:'discuss', label:'Community', Icon:MessageSquare }].map(({ key, label, Icon }) => (
              <button key={key} onClick={() => { setTab(key); setActiveThread(null) }}
                className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium transition-all duration-150 border-b-2
                  ${tab === key ? 'border-ember-500 text-ember-400' : 'border-transparent text-ink-400 hover:text-ink-200'}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Mobile lesson list */}
          {tab === 'lessons' && (
            <div className="lg:hidden p-4 space-y-3 overflow-y-auto">
              {course.modules?.map(mod => (
                <div key={mod.id} className="card overflow-hidden">
                  <button onClick={() => setOpenModules(o => ({ ...o, [mod.id]: !o[mod.id] }))}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-surface)] transition-colors">
                    <span className="font-medium text-sm truncate">{mod.title}</span>
                    <ChevronDown size={15} className={`text-ink-400 flex-shrink-0 transition-transform duration-200 ${openModules[mod.id] ? 'rotate-180':''}`} />
                  </button>
                  {openModules[mod.id] && (
                    <div className="border-t border-[var(--border)]">
                      {mod.lessons?.map(lesson => (
                        <button key={lesson.id} onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs transition-all
                            ${activeLesson?.id === lesson.id ? 'bg-ember-500/10 text-ember-400' : 'text-ink-300 hover:bg-[var(--bg-surface)]'}`}>
                          {lesson.thumbnail
                            ? <img src={lesson.thumbnail} alt="" className="w-12 h-8 rounded object-cover flex-shrink-0 opacity-70" />
                            : <div className="w-12 h-8 rounded bg-[var(--bg-overlay)] flex items-center justify-center flex-shrink-0"><Play size={10} className="text-ink-500 ml-0.5" /></div>
                          }
                          <span className="truncate flex-1">{lesson.title}</span>
                          {progress[lesson.id] && <CheckCircle size={12} className="text-sage-400 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Discussions */}
          {tab === 'discuss' && (
            <div className="flex-1 overflow-y-auto p-5 max-w-2xl">
              {activeThread ? (
                <div>
                  <button onClick={() => setActiveThread(null)} className="btn-ghost text-xs gap-1.5 mb-5 -ml-1">
                    <ArrowLeft size={13} /> All discussions
                  </button>
                  <div className="card p-5 border-[var(--border-mid)] mb-5">
                    <h3 className="font-display font-600 text-base text-[var(--text-base)] mb-2">{activeThread.title}</h3>
                    <p className="text-sm text-ink-400 leading-relaxed mb-3">{activeThread.content}</p>
                    <p className="text-xs text-ink-500">{new Date(activeThread.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-3 mb-5">
                    {replies.length === 0
                      ? <p className="text-xs text-ink-500 py-4">No replies yet. Be the first!</p>
                      : replies.map((reply, i) => (
                          <div key={reply.id ?? i} className="flex gap-3">
                            <CornerDownRight size={14} className="text-ink-600 flex-shrink-0 mt-4" />
                            <div className="card p-4 flex-1 border-[var(--border-mid)]">
                              <p className="text-sm text-ink-300 leading-relaxed">{reply.content}</p>
                              <p className="text-xs text-ink-500 mt-2">{new Date(reply.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))
                    }
                  </div>
                  <div className="card p-4 border-[var(--border-mid)]">
                    <textarea value={newReply} onChange={e => setNewReply(e.target.value)}
                      placeholder="Write a reply…" rows={3} className="input-field text-sm resize-none mb-3" />
                    <button onClick={postReply} disabled={replyPosting || !newReply.trim()} className="btn-primary text-sm">
                      {replyPosting ? 'Posting…' : <><Send size={13} /> Reply</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="card p-5 border-[var(--border-mid)] mb-5">
                    <h3 className="font-display font-600 text-sm mb-3">Start a discussion</h3>
                    <input value={newPost.title} onChange={e => setNewPost(p => ({...p, title:e.target.value}))}
                      placeholder="Discussion title…" className="input-field mb-3 text-sm" />
                    <textarea value={newPost.content} onChange={e => setNewPost(p => ({...p, content:e.target.value}))}
                      placeholder="Share thoughts, questions, or resources…"
                      rows={3} className="input-field mb-3 text-sm resize-none" />
                    <button onClick={postDiscussion} disabled={posting || !newPost.title.trim()} className="btn-primary text-sm">
                      {posting ? 'Posting…' : <><Send size={13} /> Post</>}
                    </button>
                  </div>
                  {discussions.length === 0
                    ? <div className="text-center py-10"><MessageSquare size={28} className="text-ink-600 mx-auto mb-3" /><p className="text-ink-400 text-sm">No discussions yet.</p></div>
                    : discussions.map(d => (
                        <button key={d.id} onClick={() => openThread(d)} className="w-full text-left card-hover p-5 mb-3">
                          <h4 className="font-medium text-sm text-[var(--text-base)] mb-1 hover:text-ember-400 transition-colors">{d.title}</h4>
                          <p className="text-xs text-ink-400 leading-relaxed mb-3 line-clamp-2">{d.content}</p>
                          <div className="flex items-center gap-3 text-xs text-ink-500">
                            <span className="flex items-center gap-1"><MessageSquare size={10} /> {d.reply_count || 0} replies</span>
                            <span>·</span>
                            <span>{new Date(d.created_at).toLocaleDateString()}</span>
                          </div>
                        </button>
                      ))
                  }
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Desktop sidebar */}
        <div className="hidden lg:flex flex-col w-80 xl:w-96 border-l border-[var(--border)] bg-[var(--bg-raised)] overflow-y-auto flex-shrink-0">
          <div className="p-5 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-raised)] z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-600 text-sm">Course content</h3>
              <span className="text-xs text-ink-400">{completedCount}/{totalLessons}</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width:`${pct}%` }} /></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {course.modules?.map((mod, mi) => (
              <div key={mod.id} className="border-b border-[var(--border)]">
                <button onClick={() => setOpenModules(o => ({ ...o, [mod.id]: !o[mod.id] }))}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--bg-surface)] transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-2xs text-ink-500 uppercase tracking-wide mb-0.5">Module {mi + 1}</p>
                    <p className="font-medium text-sm text-[var(--text-base)] truncate">{mod.title}</p>
                    <p className="text-2xs text-ink-500 mt-0.5">{mod.lessons?.length || 0} lessons</p>
                  </div>
                  <ChevronDown size={15} className={`text-ink-400 flex-shrink-0 ml-2 transition-transform duration-200 ${openModules[mod.id] ? 'rotate-180':''}`} />
                </button>
                {openModules[mod.id] && (
                  <div className="bg-[var(--bg)] border-t border-[var(--border)]">
                    {mod.lessons?.map((lesson, li) => {
                      const isActive = activeLesson?.id === lesson.id
                      const isDone   = progress[lesson.id]
                      return (
                        <button key={lesson.id} onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-150 border-r-2
                            ${isActive ? 'bg-ember-500/10 border-ember-500' : 'hover:bg-[var(--bg-surface)] border-transparent'}`}>
                          <div className="w-14 h-9 rounded overflow-hidden flex-shrink-0 mt-0.5 bg-[var(--bg-overlay)]">
                            {lesson.thumbnail
                              ? <img src={lesson.thumbnail} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><Play size={10} className="text-ink-500 ml-0.5" /></div>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-relaxed line-clamp-2 ${isActive ? 'text-ember-400 font-medium' : 'text-ink-300'}`}>{lesson.title}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-2xs text-ink-600">{li + 1}</span>
                              {isDone && <CheckCircle size={10} className="text-sage-400" />}
                              {isActive && <Play size={9} className="text-ember-400" />}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
