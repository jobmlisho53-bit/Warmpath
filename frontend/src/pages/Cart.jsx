import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, ShoppingBag } from 'lucide-react'

export default function Cart() {
  const navigate = useNavigate()
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [checking, setChecking] = useState(false)

  const load = () =>
    api.get('/shop/cart')
      .then(r => setItems(r.data?.items || r.data || []))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    await api.delete(`/shop/cart/${id}`)
    setItems(it => it.filter(i => i.id !== id))
  }

  const updateQty = async (id, qty) => {
    if (qty < 1) { remove(id); return }
    await api.put(`/shop/cart/${id}`, { quantity: qty })
    setItems(it => it.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const checkout = async () => {
    setChecking(true)
    try {
      const r = await api.post('/shop/checkout')
      window.location.href = r.data.authorization_url
    } catch {
      alert('Checkout failed. Please try again.')
      setChecking(false)
    }
  }

  const total = items.reduce((s, i) => s + (Number(i.product?.price || 0) * i.quantity), 0)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-4xl">
        <div className="flex items-center justify-between mb-10 animate-fade-up">
          <h1 className="font-display text-4xl font-700">
            Your <span className="text-gradient-ember">Cart</span>
          </h1>
          <Link to="/shop" className="btn-ghost text-sm">
            <ShoppingBag size={15} /> Continue shopping
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="card p-16 text-center border-dashed">
            <ShoppingCart size={40} className="text-ink-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-600 mb-2">Cart is empty</h3>
            <p className="text-ink-400 text-sm mb-6">Add some resources from the shop.</p>
            <Link to="/shop" className="btn-primary">Browse shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <div key={item.id} className="card-hover flex items-center gap-4 p-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ember-600/20 to-terra-600/20 border border-[var(--border-mid)] flex items-center justify-center text-2xl flex-shrink-0">
                    {item.product?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-[var(--text-base)] truncate">{item.product?.name}</h3>
                    <p className="text-xs text-ink-400 mt-0.5">{item.product?.category}</p>
                    <p className="text-ember-400 font-display font-600 text-sm mt-1">
                      KES {Number(item.product?.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-mid)] flex items-center justify-center hover:border-ember-500/30 transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-mid)] flex items-center justify-center hover:border-ember-500/30 transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => remove(item.id)}
                    className="p-2 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 flex-shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 border-[var(--border-mid)] sticky top-24">
                <h2 className="font-display font-600 text-lg mb-4">Order summary</h2>
                <div className="space-y-2 mb-4">
                  {items.map(i => (
                    <div key={i.id} className="flex items-center justify-between text-sm">
                      <span className="text-ink-400 truncate mr-2">{i.product?.name}</span>
                      <span className="text-[var(--text-base)] flex-shrink-0">
                        KES {(Number(i.product?.price) * i.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="divider mb-4" />
                <div className="flex items-center justify-between mb-6">
                  <span className="font-medium">Total</span>
                  <span className="font-display text-2xl font-700 text-ember-400">
                    KES {total.toLocaleString()}
                  </span>
                </div>
                <button onClick={checkout} disabled={checking} className="btn-primary w-full justify-center py-3">
                  {checking ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                      </svg>
                      Redirecting…
                    </span>
                  ) : <>Checkout <ArrowRight size={15} /></>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
