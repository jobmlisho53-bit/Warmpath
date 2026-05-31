import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { Award, ExternalLink, ShieldCheck, Download } from 'lucide-react'

export default function MyCertificates() {
  const [certs,   setCerts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/payments/my-certificates')
      .then(r => setCerts(r.data?.certificates || r.data || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        <div className="mb-10 animate-fade-up">
          <h1 className="font-display text-4xl font-700 mb-2">
            My <span className="text-gradient-ember">Certificates</span>
          </h1>
          <p className="text-ink-400">Your verified certificates of completion</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="skeleton h-52 rounded-xl" />)}
          </div>
        ) : certs.length === 0 ? (
          <div className="card p-16 text-center border-dashed max-w-md mx-auto">
            <Award size={40} className="text-ink-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-600 mb-2">No certificates yet</h3>
            <p className="text-ink-400 text-sm mb-6">Complete a course and pay KES 999 to earn your first certificate.</p>
            <Link to="/courses" className="btn-primary">Browse courses</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certs.map((cert, i) => (
              <div key={cert.id}
                className="card-hover overflow-hidden group"
                style={{ animationDelay: `${i * 60}ms` }}>
                {/* Card top */}
                <div className="h-36 bg-gradient-to-br from-sand-800/60 via-terra-800/40 to-ember-800/40 flex items-center justify-center relative overflow-hidden border-b border-[var(--border)]">
                  <div className="absolute inset-0 bg-grain opacity-40" />
                  <div className="relative z-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sand-400 to-sand-600 flex items-center justify-center mx-auto mb-2 shadow-glow-ember">
                      <Award size={24} className="text-white" />
                    </div>
                  </div>
                  {/* Watermark */}
                  <div className="absolute bottom-2 right-3 text-xs text-sand-400/40 font-mono uppercase tracking-widest">
                    Verified
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-ember-400 font-medium uppercase tracking-wide mb-1">Certificate of Completion</p>
                  <h3 className="font-display font-600 text-[var(--text-base)] mb-3 line-clamp-2">
                    {cert.course?.title || 'Course Certificate'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-ink-400 mb-4">
                    <ShieldCheck size={12} className="text-sage-400" />
                    <span className="font-mono truncate">{cert.verification_code}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/courses/${cert.course?.slug || cert.course_id}/certificate/view`}
                      className="btn-primary flex-1 justify-center text-xs py-2">
                      <Award size={12} /> View
                    </Link>
                    <Link to={`/verify/${cert.verification_code}`}
                      className="btn-secondary text-xs py-2 px-3">
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
