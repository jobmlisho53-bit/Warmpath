import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Download, LayoutDashboard, Award, Loader2 } from 'lucide-react'
import api from '../lib/api'

export default function PaymentVerify() {
  const [searchParams] = useSearchParams()

  // Paystack params
  const paystackRef = searchParams.get('reference') || searchParams.get('trxref')
  // M-Pesa params
  const mpesaId     = searchParams.get('id') || searchParams.get('checkout_request_id')

  const reference = paystackRef || mpesaId

  const [status,  setStatus]  = useState('loading')
  const [data,    setData]    = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!reference) {
      setStatus('error')
      setMessage('No payment reference found in the URL.')
      return
    }

    // Determine which endpoint to call
    const endpoint = mpesaId
      ? `/mpesa/status/${mpesaId}`
      : `/payments/verify/${paystackRef}`

    api.get(endpoint)
      .then(res => {
        const d = res.data
        const paid = d.status === 'success'
                  || d.status === 'completed'
                  || d.paid   === true
                  || d.ResultCode === 0
                  || d.ResultCode === '0'
                  || d.verified === true

        if (paid) {
          setStatus('success')
          setData(d)
          setMessage(d.message || 'Your payment has been confirmed.')
        } else {
          setStatus('error')
          setMessage(d.message || d.ResultDesc || 'Payment verification pending. Try again shortly.')
        }
      })
      .catch(err => {
        setStatus('error')
        setMessage(
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to verify payment. Please contact support.'
        )
      })
  }, [reference])

  const isCertificate = data?.type === 'certificate' || data?.certificate_id
  const isShop        = data?.type === 'shop' || data?.order_id

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />

      <div className="w-full max-w-md animate-scale-in relative">

        {/* Loading */}
        {status === 'loading' && (
          <div className="card p-10 text-center border-[var(--border-mid)] shadow-lifted">
            <div className="w-16 h-16 rounded-2xl bg-ember-500/10 border border-ember-500/20 flex items-center justify-center mx-auto mb-6">
              <Loader2 size={28} className="text-ember-400 animate-spin" />
            </div>
            <h2 className="font-display text-2xl font-700 text-[var(--text-base)] mb-2">Verifying payment</h2>
            <p className="text-ink-400 text-sm leading-relaxed">
              {mpesaId ? 'Checking M-Pesa payment status…' : 'Confirming payment with Paystack…'}
            </p>
            {reference && (
              <p className="text-xs font-mono text-ink-600 mt-4 px-3 py-2 rounded-lg bg-[var(--bg-surface)] break-all">
                Ref: {reference}
              </p>
            )}
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="card border-sage-500/30 shadow-lifted overflow-hidden">
            <div className="h-1.5 w-full" style={{ background:'linear-gradient(90deg,#5A8F48,#7FB069,#5A8F48)' }} />
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-sage-500/10 border border-sage-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={30} className="text-sage-400" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-500/10 border border-sage-500/20 text-sage-400 text-xs font-medium mb-4">
                Payment confirmed
              </div>
              <h2 className="font-display text-2xl font-700 text-[var(--text-base)] mb-2">Payment successful!</h2>
              <p className="text-ink-400 text-sm leading-relaxed mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                {isCertificate && (
                  <Link to="/certificates" className="btn-primary w-full justify-center py-3 gap-2">
                    <Award size={15} /> View my certificates
                  </Link>
                )}
                {(isShop || !isCertificate) && (
                  <Link to="/shop/downloads" className="btn-primary w-full justify-center py-3 gap-2">
                    <Download size={15} /> View my downloads
                  </Link>
                )}
                <Link to="/dashboard" className="btn-ghost w-full justify-center py-2.5 gap-2 text-sm">
                  <LayoutDashboard size={14} /> Go to dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="card border-red-500/20 shadow-lifted overflow-hidden">
            <div className="h-1.5 w-full" style={{ background:'linear-gradient(90deg,#A32D2D,#E24B4A,#A32D2D)' }} />
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                <AlertCircle size={30} className="text-red-400" />
              </div>
              <h2 className="font-display text-2xl font-700 text-[var(--text-base)] mb-2">Verification failed</h2>
              <p className="text-ink-400 text-sm leading-relaxed mb-5">{message}</p>
              {reference && (
                <div className="px-4 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-mid)] mb-5 text-left">
                  <p className="text-xs text-ink-400 mb-1">Reference</p>
                  <p className="text-xs font-mono text-[var(--text-base)] break-all">{reference}</p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Link to="/dashboard" className="btn-secondary w-full justify-center py-2.5 gap-2 text-sm">
                  <LayoutDashboard size={14} /> Go to dashboard
                </Link>
                
                  href={`mailto:jobmlisho63@gmail.com?subject=M-Pesa Payment Issue&body=Reference: ${reference}`}
                  className="text-xs text-ink-500 hover:text-ember-400 transition-colors text-center py-1">
                  Contact support
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
