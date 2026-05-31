import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, Edit2, X, Check, Package, ShoppingBag, DollarSign } from 'lucide-react'

const AFFILIATE_TAG = 'skilltoincome-20'

function adminHeaders() {
  return { headers: { Authorization: `Bearer ${localStorage.getItem('wp_admin_token')}` } }
}

function appendAffiliateTag(url) {
  if (!url) return url
  try {
    const u = new URL(url)
    u.searchParams.set('tag', AFFILIATE_TAG)
    return u.toString()
  } catch {
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}tag=${AFFILIATE_TAG}`
  }
}

const DIGITAL_EMPTY = {
  name: '', description: '', price: '', category: '',
  product_type: 'digital', icon: '', file_url: '',
  gumroad_url: '', is_free: false, is_active: true,
}

const AMAZON_EMPTY = {
  name: '', description: '', affiliate_url: '', image_url: '',
  product_type: 'affiliate', is_active: true, price: '0', icon: '',
}

// ── Stat card ──────────────────────────────────────────────
function StatTab({ icon: Icon, label, count, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1.5 p-5 rounded-xl border transition-all duration-200 text-left
        ${active
          ? 'bg-ember-500/10 border-ember-500/30 text-ember-400'
          : 'bg-[var(--bg-raised)] border-[var(--border-mid)] text-ink-400 hover:border-[var(--border-hi)] hover:text-ink-200'
        }`}>
      <Icon size={18} className={active ? 'text-ember-400' : 'text-ink-500'} />
      <span className="font-display text-2xl font-700">{count}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

// ── Product row ────────────────────────────────────────────
function ProductRow({ product, onToggle, onEdit, onDelete, type }) {
  return (
    <div className={`flex items-center gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0 transition-opacity ${!product.is_active ? 'opacity-40' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm text-[var(--text-base)] truncate">{product.name}</span>
          {product.is_free && (
            <span className="badge bg-sage-500/10 border border-sage-500/20 text-sage-400 text-2xs">Free</span>
          )}
          {type === 'affiliate' && (
            <span className="badge bg-blue-500/10 border border-blue-500/20 text-blue-400 text-2xs">Amazon</span>
          )}
          {type === 'gumroad' && (
            <span className="badge bg-purple-500/10 border border-purple-500/20 text-purple-400 text-2xs">Gumroad</span>
          )}
          {!product.is_active && (
            <span className="badge bg-ink-700/40 border border-[var(--border-mid)] text-ink-500 text-2xs">Hidden</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-500">
          {product.category && <span>{product.category}</span>}
          {product.price > 0 && !product.is_free && (
            <><span>·</span><span className="text-ember-400 font-medium">KES {Number(product.price).toLocaleString()}</span></>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onToggle(product.id)}
          title={product.is_active ? 'Hide' : 'Show'}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-ink-100 hover:bg-[var(--bg-surface)] transition-all">
          {product.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        {onEdit && (
          <button onClick={() => onEdit(product)}
            title="Edit"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-ember-400 hover:bg-ember-500/10 transition-all">
            <Edit2 size={14} />
          </button>
        )}
        <button onClick={() => onDelete(product.id)}
          title="Delete"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────
export default function AdminShop() {
  const navigate = useNavigate()
  const [tab,        setTab]        = useState('amazon')
  const [products,   setProducts]   = useState([])
  const [orders,     setOrders]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [amazonForm, setAmazonForm] = useState(AMAZON_EMPTY)
  const [digitalForm,setDigitalForm]= useState(DIGITAL_EMPTY)
  const [editingId,  setEditingId]  = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [showForm,   setShowForm]   = useState(false)

  const load = async () => {
    try {
      const [p, o] = await Promise.all([
        api.get('/admin/shop/products', adminHeaders()),
        api.get('/admin/shop/orders',   adminHeaders()),
      ])
      setProducts(Array.isArray(p.data) ? p.data : p.data.products ?? [])
      setOrders(Array.isArray(o.data)   ? o.data : o.data.orders   ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('wp_admin_token')) { navigate('/admin/login'); return }
    load()
  }, [])

  const amazonProducts  = products.filter(p => p.product_type === 'affiliate')
  const digitalProducts = products.filter(p => p.product_type !== 'affiliate')

  // ── Save Amazon product ──
  const saveAmazon = async () => {
    if (!amazonForm.name.trim() || !amazonForm.affiliate_url.trim()) return
    setSaving(true)
    const payload = {
      ...amazonForm,
      affiliate_url: appendAffiliateTag(amazonForm.affiliate_url),
      icon: amazonForm.icon || '',
    }
    try {
      if (editingId) await api.put(`/admin/shop/products/${editingId}`, payload, adminHeaders())
      else           await api.post('/admin/shop/products', payload, adminHeaders())
      setAmazonForm(AMAZON_EMPTY)
      setEditingId(null)
      setShowForm(false)
      load()
    } finally { setSaving(false) }
  }

  // ── Save Digital product ──
  const saveDigital = async () => {
    if (!digitalForm.name.trim()) return
    setSaving(true)
    try {
      if (editingId) await api.put(`/admin/shop/products/${editingId}`, digitalForm, adminHeaders())
      else           await api.post('/admin/shop/products', digitalForm, adminHeaders())
      setDigitalForm(DIGITAL_EMPTY)
      setEditingId(null)
      setShowForm(false)
      load()
    } finally { setSaving(false) }
  }

  const toggleProduct = async (id) => {
    await api.put(`/admin/shop/products/${id}/toggle`, {}, adminHeaders())
    load()
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    await api.delete(`/admin/shop/products/${id}`, adminHeaders())
    load()
  }

  const editProduct = (p) => {
    if (p.product_type === 'affiliate') {
      setAmazonForm({ ...AMAZON_EMPTY, ...p })
      setTab('amazon')
    } else {
      setDigitalForm({ ...DIGITAL_EMPTY, ...p })
      setTab('digital')
    }
    setEditingId(p.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setShowForm(false)
    setAmazonForm(AMAZON_EMPTY)
    setDigitalForm(DIGITAL_EMPTY)
  }

  const orderStatusStyle = (status) => {
    if (status === 'completed') return 'bg-sage-500/10 border-sage-500/20 text-sage-400'
    if (status === 'pending')   return 'bg-sand-500/10 border-sand-500/20 text-sand-400'
    return 'bg-ink-700/30 border-[var(--border-mid)] text-ink-400'
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Admin nav */}
      <div className="glass-nav fixed top-0 inset-x-0 z-50 h-14 flex items-center">
        <div className="page-container flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors">
              <ArrowLeft size={15} className="text-ink-400" />
            </Link>
            <div className="w-px h-4 bg-[var(--border-mid)]" />
            <span className="font-display font-600 text-sm text-[var(--text-base)]">Shop Management</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setEditingId(null); setShowForm(f => !f) }}
              className="btn-primary text-xs py-1.5 px-3 gap-1.5">
              <Plus size={13} /> New product
            </button>
          </div>
        </div>
      </div>

      <div className="page-container pt-20 pb-16 max-w-5xl">

        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-700 text-[var(--text-base)] mb-1">Shop Management</h1>
          <p className="text-ink-400 text-sm">Manage products and view orders</p>
        </div>

        {/* Stat tabs */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-up animate-delay-100">
          <StatTab icon={Package}     label="Amazon"  count={loading ? '—' : amazonProducts.length}  active={tab === 'amazon'}  onClick={() => setTab('amazon')} />
          <StatTab icon={ShoppingBag} label="Digital" count={loading ? '—' : digitalProducts.length} active={tab === 'digital'} onClick={() => setTab('digital')} />
          <StatTab icon={DollarSign}  label="Orders"  count={loading ? '—' : orders.length}          active={tab === 'orders'}  onClick={() => setTab('orders')} />
        </div>

        {/* ── AMAZON TAB ── */}
        {tab === 'amazon' && (
          <div className="space-y-5 animate-fade-in">

            {/* Form */}
            {(showForm || editingId) && (
              <div className="card border-[var(--border-mid)] p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display font-600 text-base text-[var(--text-base)]">
                    {editingId ? 'Edit Amazon product' : 'Add Amazon product'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-500">Tag <span className="font-mono text-ember-400">{AFFILIATE_TAG}</span> added automatically</span>
                    <button onClick={cancelEdit} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors">
                      <X size={14} className="text-ink-400" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className="label">Product name</label>
                    <input value={amazonForm.name} onChange={e => setAmazonForm(f => ({...f, name: e.target.value}))}
                      placeholder="Best Laptop for Coding 2025" className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Short description</label>
                    <input value={amazonForm.description} onChange={e => setAmazonForm(f => ({...f, description: e.target.value}))}
                      placeholder="Our top pick for developers — fast and affordable" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Product image URL</label>
                    <input value={amazonForm.image_url} onChange={e => setAmazonForm(f => ({...f, image_url: e.target.value}))}
                      placeholder="https://m.media-amazon.com/images/..." className="input-field" />
                  </div>
                  <div>
                    <label className="label">Amazon product URL</label>
                    <input value={amazonForm.affiliate_url} onChange={e => setAmazonForm(f => ({...f, affiliate_url: e.target.value}))}
                      placeholder="https://www.amazon.com/dp/B0GTFH1DNL" className="input-field" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveAmazon} disabled={saving || !amazonForm.name.trim() || !amazonForm.affiliate_url.trim()}
                    className="btn-primary text-sm gap-2">
                    {saving
                      ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/></svg>
                      : <><Check size={14} /> {editingId ? 'Save changes' : 'Add Amazon product'}</>
                    }
                  </button>
                  <button onClick={cancelEdit} className="btn-ghost text-sm">Cancel</button>
                </div>
              </div>
            )}

            {/* Product list */}
            <div className="card overflow-hidden border-[var(--border-mid)]">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-medium text-sm text-[var(--text-base)]">Amazon products ({amazonProducts.length})</h3>
                {!showForm && (
                  <button onClick={() => { setEditingId(null); setAmazonForm(AMAZON_EMPTY); setShowForm(true) }}
                    className="btn-ghost text-xs gap-1.5 py-1.5">
                    <Plus size={13} /> Add product
                  </button>
                )}
              </div>
              {loading ? (
                <div className="p-5 space-y-3">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}
                </div>
              ) : amazonProducts.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Package size={28} className="text-ink-600 mx-auto mb-3" />
                  <p className="text-ink-400 text-sm">No Amazon products yet.</p>
                </div>
              ) : (
                amazonProducts.map(p => (
                  <ProductRow key={p.id} product={p} type="affiliate"
                    onToggle={toggleProduct} onEdit={editProduct} onDelete={deleteProduct} />
                ))
              )}
            </div>
          </div>
        )}

        {/* ── DIGITAL TAB ── */}
        {tab === 'digital' && (
          <div className="space-y-5 animate-fade-in">

            {/* Form */}
            {(showForm || editingId) && (
              <div className="card border-[var(--border-mid)] p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display font-600 text-base text-[var(--text-base)]">
                    {editingId ? 'Edit product' : 'Add digital product'}
                  </h2>
                  <button onClick={cancelEdit} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors">
                    <X size={14} className="text-ink-400" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className="label">Title</label>
                    <input value={digitalForm.name} onChange={e => setDigitalForm(f => ({...f, name: e.target.value}))}
                      placeholder="HTML & CSS Cheat Sheet" className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Description</label>
                    <textarea value={digitalForm.description} onChange={e => setDigitalForm(f => ({...f, description: e.target.value}))}
                      placeholder="Quick reference guide for all HTML tags and CSS properties..." rows={2}
                      className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="label">Price (KES)</label>
                    <input type="number" value={digitalForm.price} onChange={e => setDigitalForm(f => ({...f, price: e.target.value}))}
                      placeholder="199" className="input-field" disabled={digitalForm.is_free} />
                  </div>
                  <div>
                    <label className="label">Type</label>
                    <select value={digitalForm.product_type} onChange={e => setDigitalForm(f => ({...f, product_type: e.target.value}))}
                      className="input-field">
                      <option value="digital">Digital</option>
                      <option value="gumroad">Gumroad</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select value={digitalForm.category} onChange={e => setDigitalForm(f => ({...f, category: e.target.value}))}
                      className="input-field">
                      <option value="">Select category</option>
                      <option>Cheat Sheets</option>
                      <option>Templates</option>
                      <option>Tools</option>
                      <option>Courses</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Icon</label>
                    <input value={digitalForm.icon} onChange={e => setDigitalForm(f => ({...f, icon: e.target.value}))}
                      placeholder="Use text or leave blank" className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">File / Download URL</label>
                    <input value={digitalForm.file_url} onChange={e => setDigitalForm(f => ({...f, file_url: e.target.value}))}
                      placeholder="https://docs.google.com/document/d/..." className="input-field" />
                  </div>
                  {digitalForm.product_type === 'gumroad' && (
                    <div className="sm:col-span-2">
                      <label className="label">Gumroad URL</label>
                      <input value={digitalForm.gumroad_url} onChange={e => setDigitalForm(f => ({...f, gumroad_url: e.target.value}))}
                        placeholder="https://warmpath.gumroad.com/l/python-cheatsheet" className="input-field" />
                    </div>
                  )}
                  <div className="sm:col-span-2 flex items-center gap-6">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <div onClick={() => setDigitalForm(f => ({...f, is_free: !f.is_free, price: !f.is_free ? '0' : f.price}))}
                        className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 cursor-pointer
                          ${digitalForm.is_free ? 'bg-ember-500' : 'bg-[var(--bg-overlay)]'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${digitalForm.is_free ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                      <span className="text-sm text-ink-300">Free product</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <div onClick={() => setDigitalForm(f => ({...f, is_active: !f.is_active}))}
                        className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 cursor-pointer
                          ${digitalForm.is_active ? 'bg-ember-500' : 'bg-[var(--bg-overlay)]'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${digitalForm.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                      <span className="text-sm text-ink-300">Active (visible in shop)</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveDigital} disabled={saving || !digitalForm.name.trim()}
                    className="btn-primary text-sm gap-2">
                    {saving
                      ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/></svg>
                      : <><Check size={14} /> {editingId ? 'Save changes' : 'Create product'}</>
                    }
                  </button>
                  <button onClick={cancelEdit} className="btn-ghost text-sm">Cancel</button>
                </div>
              </div>
            )}

            {/* Product list */}
            <div className="card overflow-hidden border-[var(--border-mid)]">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-medium text-sm text-[var(--text-base)]">Digital products ({digitalProducts.length})</h3>
                {!showForm && !editingId && (
                  <button onClick={() => { setEditingId(null); setDigitalForm(DIGITAL_EMPTY); setShowForm(true) }}
                    className="btn-ghost text-xs gap-1.5 py-1.5">
                    <Plus size={13} /> Add product
                  </button>
                )}
              </div>
              {loading ? (
                <div className="p-5 space-y-3">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}
                </div>
              ) : digitalProducts.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <ShoppingBag size={28} className="text-ink-600 mx-auto mb-3" />
                  <p className="text-ink-400 text-sm">No digital products yet.</p>
                </div>
              ) : (
                digitalProducts.map(p => (
                  <ProductRow key={p.id} product={p} type={p.product_type}
                    onToggle={toggleProduct} onEdit={editProduct} onDelete={deleteProduct} />
                ))
              )}
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-600 text-lg text-[var(--text-base)]">
                All orders ({orders.length})
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="card p-16 text-center border-dashed">
                <DollarSign size={32} className="text-ink-600 mx-auto mb-3" />
                <p className="text-ink-400 text-sm">No orders yet.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="card border-[var(--border-mid)] overflow-hidden">
                  {/* Order header */}
                  <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[var(--border)]">
                    <div>
                      <p className="font-medium text-sm text-[var(--text-base)]">
                        {order.user?.full_name || order.user?.email || order.user_id}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-KE', { year:'numeric', month:'long', day:'numeric' })}
                      </p>
                    </div>
                    <span className={`badge border text-xs ${orderStatusStyle(order.status)}`}>
                      {order.status === 'completed' ? 'Completed' : order.status === 'pending' ? 'Pending' : order.status}
                    </span>
                  </div>

                  {/* Line items */}
                  <div className="px-5 py-3 space-y-2">
                    {(order.items || order.shop_order_items || []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-ink-300">
                          {item.product?.name || item.name || 'Product'}
                          <span className="text-ink-500 ml-1">× {item.quantity || 1}</span>
                        </span>
                        <span className="text-[var(--text-base)] font-medium">
                          KES {Number(item.price || item.unit_price || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-surface)]">
                    <span className="text-xs text-ink-500 font-medium uppercase tracking-wide">Total</span>
                    <span className="font-display font-700 text-ember-400">
                      KES {Number(order.total_amount || order.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
