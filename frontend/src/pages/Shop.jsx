import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { ShoppingBag, ShoppingCart, ExternalLink, Package, CheckCircle } from 'lucide-react'
import { CourseCardSkeleton } from '../components/Skeleton'

const CATS = ['All','Cheat Sheets','Templates','Courses','Tools']

export default function Shop() {
  const { isAuth } = useAuth()
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [cat,      setCat]      = useState('All')
  const [adding,   setAdding]   = useState(null)
  const [toast,    setToast]    = useState('')

  useEffect(() => {
    // GET /api/shop/products → { products: [...] } or [...]
    // Optional ?category= filter supported by backend
    api.get('/shop/products')
      .then(r => {
        const data = r.data
        setProducts(Array.isArray(data) ? data : data.products ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const addCart = async (productId) => {
    if (!isAuth) { window.location.href = '/login'; return }
    setAdding(productId)
    try {
      // POST /api/shop/cart  { product_id, quantity }
      await api.post('/shop/cart', { product_id: productId, quantity: 1 })
      setToast('Added to cart!')
      setTimeout(() => setToast(''), 2500)
    } catch (e) {
      setToast('Failed to add to cart')
      setTimeout(() => setToast(''), 2500)
    } finally {
      setAdding(null)
    }
  }

  const filtered = cat === 'All'
    ? products
    : products.filter(p => (p.category || '').toLowerCase().includes(cat.toLowerCase()))

  return (
    <div className="min-h-screen pt-24 pb-16">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-sage-500 text-white text-sm font-medium shadow-lifted animate-fade-up flex items-center gap-2">
          <CheckCircle size={15} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-[var(--bg-raised)] border-b border-[var(--border)] mb-8">
        <div className="page-container py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl lg:text-5xl font-700 mb-2 animate-fade-up">
                Resource <span className="text-gradient-ember">Shop</span>
              </h1>
              <p className="text-ink-400 text-sm animate-fade-up animate-delay-100">
                Cheat sheets, templates and tools to level up faster
              </p>
            </div>
            {isAuth && (
              <Link to="/shop/cart" className="btn-secondary gap-2 flex-shrink-0">
                <ShoppingCart size={15} /> Cart
              </Link>
            )}
          </div>

          <div className="flex gap-2 flex-wrap mt-6 animate-fade-up animate-delay-200">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
                  ${cat === c
                    ? 'bg-ember-500 text-white shadow-glow-ember'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-mid)] text-ink-300 hover:border-[var(--border-hi)] hover:text-ink-100'
                  }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array(8).fill(0).map((_,i) => <CourseCardSkeleton key={i} />)
            : filtered.length === 0
              ? (
                <div className="col-span-full text-center py-20">
                  <Package size={40} className="text-ink-600 mx-auto mb-3" />
                  <p className="text-ink-400">No products in this category yet.</p>
                </div>
              )
              : filtered.map((p, i) => (
                <div key={p.id}
                  className="card-hover overflow-hidden flex flex-col group"
                  style={{ animationDelay: `${(i % 8) * 50}ms` }}>
                  {/* Cover */}
                  <div className="h-44 bg-gradient-to-br from-terra-600/15 via-ember-600/15 to-sand-600/15 flex items-center justify-center border-b border-[var(--border)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-grain opacity-30 bg-grain" />
                    <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                      {p.icon || p.cover_image || '📦'}
                    </span>
                    <div className="absolute top-3 right-3">
                      <span className={`badge border text-2xs ${
                        p.product_type === 'affiliate'
                          ? 'bg-sand-500/10 border-sand-500/20 text-sand-400'
                          : 'bg-ember-500/10 border-ember-500/20 text-ember-400'
                      }`}>
                        {p.product_type || 'digital'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 gap-3">
                    {p.category && (
                      <span className="badge bg-ink-800/60 border border-[var(--border-mid)] text-ink-400 text-2xs self-start">
                        {p.category}
                      </span>
                    )}
                    <div>
                      <h3 className="font-display font-600 text-[var(--text-base)] group-hover:text-ember-400 transition-colors line-clamp-2 mb-1">
                        {p.name}
                      </h3>
                      {p.description && (
                        <p className="text-xs text-ink-400 line-clamp-2 leading-relaxed">{p.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
                      <span className="font-display text-xl font-700 text-ember-400">
                        KES {Number(p.price).toLocaleString()}
                      </span>
                      {p.product_type === 'affiliate' ? (
                        <a href={p.affiliate_url} target="_blank" rel="noopener noreferrer"
                          className="btn-secondary text-xs py-2 px-3">
                          <ExternalLink size={12} /> View
                        </a>
                      ) : (
                        <button onClick={() => addCart(p.id)} disabled={adding === p.id}
                          className="btn-primary text-xs py-2 px-3">
                          {adding === p.id
                            ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/></svg>
                            : <><ShoppingCart size={12} /> Add</>
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}
