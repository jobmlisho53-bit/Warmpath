import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowRight, Zap } from 'lucide-react'

export default function GuestPrompt({ courseSlug, watchCount, onDismiss }) {
  const navigate  = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Slight delay so it slides in smoothly after the lesson change
    const t = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(t)
  }, [watchCount])

  const dismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  const signup = () => {
    const redirect = courseSlug ? `/courses/${courseSlug}` : '/courses'
    navigate(`/signup?redirect=${encodeURIComponent(redirect)}`)
  }

  return (
    <div
      className={`fixed bottom-6 right-4 left-4 sm:left-auto sm:w-80 z-50 transition-all duration-500 ease-spring
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
      <div className="card border-ember-500/30 shadow-lifted overflow-hidden"
        style={{ background:'linear-gradient(135deg,#231F1B,#2C2218)' }}>

        {/* Top accent */}
        <div className="h-0.5 w-full" style={{ background:'linear-gradient(90deg,#F07A1A,#C85528)' }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ember-500/15 border border-ember-500/25 flex items-center justify-center flex-shrink-0">
                <Zap size={15} className="text-ember-400" />
              </div>
              <p className="font-display font-600 text-sm text-[var(--text-base)]">
                You've watched {watchCount} lessons!
              </p>
            </div>
            <button onClick={dismiss}
              className="w-6 h-6 rounded-md flex items-center justify-center text-ink-500 hover:text-ink-200 hover:bg-[var(--bg-overlay)] transition-all flex-shrink-0 mt-0.5">
              <X size={13} />
            </button>
          </div>

          <p className="text-xs text-ink-400 leading-relaxed mb-4">
            Create a free account to track your progress, earn XP, and unlock a verified certificate when you finish.
          </p>

          <button onClick={signup}
            className="btn-primary w-full justify-center text-sm py-2.5 mb-2">
            Create free account <ArrowRight size={14} />
          </button>

          <button onClick={dismiss}
            className="w-full text-center text-xs text-ink-500 hover:text-ink-300 transition-colors py-1.5">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
