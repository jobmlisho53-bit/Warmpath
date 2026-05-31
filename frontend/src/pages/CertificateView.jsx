import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { Printer, Share2, ArrowLeft, ShieldCheck, Award, CheckCircle } from 'lucide-react'

export default function CertificateView() {
  const { name }   = useParams()
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const printRef   = useRef()

  const [cert,    setCert]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied,  setCopied]  = useState(false)

  useEffect(() => {
    // GET /api/courses/:id first to get course ID, then
    // GET /api/certificates/course/:courseId
    api.get(`/courses/${name}`)
      .then(async r => {
        const course = r.data?.course ?? r.data
        const res = await api.get(`/certificates/course/${course.id}`)
        setCert({ ...(res.data?.certificate ?? res.data), course })
      })
      .catch(() => navigate(`/courses/${name}/certificate`))
      .finally(() => setLoading(false))
  }, [name])

  const print = () => window.print()

  const copyLink = () => {
    const url = `${window.location.origin}/verify/${cert?.verification_code}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'Learner'

  const issueDate = cert?.created_at
    ? new Date(cert.created_at).toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' })
    : new Date().toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' })

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #cert-print, #cert-print * { visibility: visible; }
          #cert-print { position: fixed; inset: 0; width: 100vw; height: 100vh; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="page-container max-w-4xl">

          {/* Controls */}
          <div className="no-print flex items-center justify-between mb-8 animate-fade-up">
            <Link to="/certificates" className="btn-ghost gap-2">
              <ArrowLeft size={16} /> My Certificates
            </Link>
            <div className="flex gap-3">
              <button onClick={copyLink} className="btn-secondary gap-2 text-sm">
                <Share2 size={15} />
                {copied ? 'Link copied!' : 'Copy share link'}
              </button>
              <button onClick={print} className="btn-primary gap-2 text-sm">
                <Printer size={15} /> Print certificate
              </button>
            </div>
          </div>

          {/* The certificate */}
          <div id="cert-print" ref={printRef}
            className="relative rounded-2xl overflow-hidden border border-sand-500/30 shadow-lifted animate-scale-in"
            style={{ background: 'linear-gradient(135deg, #1C1815 0%, #231F1B 40%, #2C1F14 100%)' }}>

            {/* Top border stripe */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #F07A1A, #C85528, #C49552, #C85528, #F07A1A)' }} />

            {/* Corner ornaments */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-sand-500/30 rounded-tl-lg" />
            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-sand-500/30 rounded-tr-lg" />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-sand-500/30 rounded-bl-lg" />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-sand-500/30 rounded-br-lg" />

            {/* Background watermark pattern */}
            <div className="absolute inset-0 opacity-3 pointer-events-none" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(240,122,26,0.03) 40px, rgba(240,122,26,0.03) 41px)'
            }} />

            <div className="relative px-12 py-16 text-center">

              {/* Organisation */}
              <div className="flex items-center justify-center gap-3 mb-10">
                <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,149,82,0.4))' }} />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F07A1A, #C85528)' }}>
                    <Award size={14} className="text-white" />
                  </div>
                  <span className="text-sand-400 font-display font-600 text-sm tracking-widest uppercase">WarmPath</span>
                </div>
                <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(90deg, rgba(196,149,82,0.4), transparent)' }} />
              </div>

              {/* Title */}
              <p className="text-ink-400 text-xs tracking-widest uppercase mb-3 font-medium">
                Certificate of Completion
              </p>
              <h1 className="font-display text-5xl font-700 mb-3" style={{
                background: 'linear-gradient(135deg, #FFB870 0%, #F07A1A 50%, #C85528 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
                This certifies that
              </h1>

              {/* Recipient name */}
              <div className="my-8">
                <div className="inline-block px-10 py-4 border-b-2 border-sand-500/50">
                  <h2 className="font-display text-4xl font-700 text-[var(--text-base)]">{displayName}</h2>
                </div>
              </div>

              {/* Body text */}
              <p className="text-ink-400 text-base mb-2">has successfully completed the course</p>
              <h3 className="font-display text-2xl font-700 mb-1" style={{ color: '#FF9A3C' }}>
                {cert?.course?.title || 'Course'}
              </h3>
              <p className="text-ink-500 text-sm mb-12">{cert?.course?.category || ''}</p>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,149,82,0.3))' }} />
                <div className="w-10 h-10 rounded-full border border-sand-500/40 flex items-center justify-center">
                  <CheckCircle size={18} className="text-sand-400" />
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(196,149,82,0.3), transparent)' }} />
              </div>

              {/* Footer row */}
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-sand-400 font-display font-600 text-sm mb-1">Issue Date</p>
                  <p className="text-ink-300 text-xs">{issueDate}</p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F07A1A, #C85528)' }}>
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <p className="text-xs text-ink-500">Verified</p>
                </div>
                <div>
                  <p className="text-sand-400 font-display font-600 text-sm mb-1">Verification Code</p>
                  <p className="text-ink-300 text-xs font-mono break-all">{cert?.verification_code || '—'}</p>
                </div>
              </div>

            </div>

            {/* Bottom border stripe */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #F07A1A, #C85528, #C49552, #C85528, #F07A1A)' }} />
          </div>

          {/* Verify link */}
          <div className="no-print mt-6 text-center animate-fade-up animate-delay-200">
            <p className="text-ink-500 text-sm">
              Verify this certificate at{' '}
              <Link to={`/verify/${cert?.verification_code}`}
                className="text-ember-400 hover:text-ember-300 transition-colors font-mono text-xs">
                warmpath.app/verify/{cert?.verification_code}
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
