import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { Download, Package, ShoppingBag, ExternalLink } from 'lucide-react'

export default function Downloads() {
  const [downloads, setDownloads] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [fetching,  setFetching]  = useState(null)

  useEffect(() => {
    // GET /api/shop/downloads
    // Returns: { downloads: [{ id, product: { id, name, icon, description }, downloaded_at, download_count }] }
    api.get('/shop/downloads')
      .then(r => {
        const data = r.data
        setDownloads(Array.isArray(data) ? data : data.downloads ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const download = async (productId, name) => {
    setFetching(productId)
    try {
      // GET /api/shop/download/:productId  → { url: '...' }
      const r = await api.get(`/shop/download/${productId}`)
      const url = r.data?.url ?? r.data?.download_url
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
        // Refresh to update download count
        const res = await api.get('/shop/downloads')
        const data = res.data
        setDownloads(Array.isArray(data) ? data : data.downloads ?? [])
      }
    } catch (e) {
      console.error('Download failed:', e)
    } finally {
      setFetching(null)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-3xl">

        <div className="mb-10 animate-fade-up">
          <h1 className="font-display text-4xl font-700 mb-2">
            My <span className="text-gradient-ember">Downloads</span>
          </h1>
          <p className="text-ink-400 text-sm">Your purchased digital products</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : downloads.length === 0 ? (
          <div className="card p-16 text-center border-dashed">
            <Package size={36} className="text-ink-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-600 mb-2 text-[var(--text-base)]">No downloads yet</h3>
            <p className="text-ink-400 text-sm mb-6 max-w-xs mx-auto">
              Purchase digital products from the shop and they'll appear here.
            </p>
            <Link to="/shop" className="btn-primary gap-2">
              <ShoppingBag size={15} /> Browse shop
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {downloads.map((item, i) => {
              const product = item.product ?? item
              const pid     = product.id ?? item.product_id
              return (
                <div key={item.id ?? i}
                  className="card-hover flex items-center gap-5 p-5 animate-fade-up"
                  style={{ animationDelay: `${i * 50}ms` }}>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl border border-[var(--border-mid)] flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(240,122,26,0.08), rgba(200,85,40,0.08))' }}>
                    <Package size={22} className="text-ember-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-[var(--text-base)] truncate mb-1">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-ink-400 line-clamp-1 mb-2">{product.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-ink-500">
                      {item.downloaded_at && (
                        <span>Last downloaded {new Date(item.downloaded_at).toLocaleDateString()}</span>
                      )}
                      {item.download_count > 0 && (
                        <>
                          <span>·</span>
                          <span>{item.download_count} {item.download_count === 1 ? 'download' : 'downloads'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Download button */}
                  <button
                    onClick={() => download(pid, product.name)}
                    disabled={fetching === pid}
                    className="btn-primary text-sm py-2.5 px-4 flex-shrink-0 gap-2">
                    {fetching === pid ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                      </svg>
                    ) : (
                      <><Download size={14} /> Download</>
                    )}
                  </button>
                </div>
              )
            })}

            <div className="pt-4 text-center">
              <Link to="/shop" className="btn-ghost text-sm gap-2">
                <ShoppingBag size={14} /> Browse more products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
