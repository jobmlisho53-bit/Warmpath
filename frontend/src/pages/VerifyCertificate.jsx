import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import { ShieldCheck, ShieldX, Award, ArrowLeft, ExternalLink } from 'lucide-react'

export default function VerifyCertificate() {
  const { code } = useParams()
  const [result,  setResult]  = useState(null)   // null=loading, false=invalid, object=valid
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // GET /api/certificates/verify/:code  — public, no auth required
    // Returns: { valid: true, certificate: { student_name, course_title, issued_at, verification_code } }
    api.get(`/certificates/verify/${code}`)
      .then(r => {
        const data = r.data
        if (data?.valid === false || !data) setResult(false)
        else setResult(data?.certificate ?? data)
      })
      .catch(() => setResult(false))
      .finally(() => setLoading(false))
  }, [code])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-ember-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />

      <div className="w-full max-w-lg relative animate-scale-in">

        {/* WarmPath brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F07A1A, #C85528)' }}>
              <Award size={16} className="text-white" />
            </div>
            <span className="font-display font-700 text-lg" style={{
              background: 'linear-gradient(135deg, #F07A1A, #C85528)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>WarmPath</span>
          </Link>
        </div>

        {result === false ? (
          /* Invalid certificate */
          <div className="card p-10 text-center border-red-500/20 bg-red-500/5">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <ShieldX size={36} className="text-red-400" />
            </div>
            <h1 className="font-display text-2xl font-700 text-[var(--text-base)] mb-3">
              Certificate not valid
            </h1>
            <p className="text-ink-400 text-sm leading-relaxed mb-6">
              The verification code <span className="font-mono text-red-400">{code}</span> does not match any certificate in our records.
              It may have been entered incorrectly or the certificate does not exist.
            </p>
            <div className="px-4 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-mid)] font-mono text-sm text-ink-400 mb-6 break-all">
              {code}
            </div>
            <Link to="/" className="btn-secondary text-sm gap-2">
              <ArrowLeft size={14} /> Return to WarmPath
            </Link>
          </div>
        ) : (
          /* Valid certificate */
          <div className="card border-sage-500/30 overflow-hidden shadow-lifted">

            {/* Green top bar */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #5A8F48, #7FB069, #5A8F48)' }} />

            <div className="p-8">
              {/* Verified badge */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-16 h-16 rounded-full bg-sage-500/10 border-2 border-sage-500/30 flex items-center justify-center">
                  <ShieldCheck size={28} className="text-sage-400" />
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-500/10 border border-sage-500/20 text-sage-400 text-sm font-medium mb-6">
                  <ShieldCheck size={14} /> Certificate Verified
                </div>
                <h1 className="font-display text-3xl font-700 text-[var(--text-base)] mb-1">
                  {result.student_name || result.name || 'Learner'}
                </h1>
                <p className="text-ink-400 text-sm">has successfully completed</p>
              </div>

              {/* Course info */}
              <div className="rounded-xl border border-[var(--border-mid)] bg-[var(--bg-surface)] p-6 mb-6">
                <h2 className="font-display text-xl font-700 text-ember-400 mb-1 text-center">
                  {result.course_title || result.course?.title || '—'}
                </h2>
                {(result.course_category || result.course?.category) && (
                  <p className="text-center text-sm text-ink-400 mb-4">
                    {result.course_category || result.course?.category}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
                  <div>
                    <p className="text-xs text-ink-500 uppercase tracking-wide mb-1">Issue Date</p>
                    <p className="text-sm text-[var(--text-base)] font-medium">
                      {result.issued_at || result.created_at
                        ? new Date(result.issued_at || result.created_at).toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' })
                        : '—'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-500 uppercase tracking-wide mb-1">Verification Code</p>
                    <p className="text-sm font-mono text-[var(--text-base)] break-all">{result.verification_code || code}</p>
                  </div>
                </div>
              </div>

              {/* Issued by */}
              <div className="flex items-center justify-between text-xs text-ink-500 pt-2">
                <span>Issued by WarmPath — Free Tech Education</span>
                <Link to="/" className="text-ember-400 hover:text-ember-300 transition-colors flex items-center gap-1">
                  warmpath.app <ExternalLink size={10} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
