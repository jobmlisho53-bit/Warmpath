import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Trophy, ShoppingBag, LayoutDashboard, LogOut, Menu, X, Award, Download } from 'lucide-react'

const NAV_LINKS = [
  { to: '/courses',     label: 'Courses',     icon: BookOpen },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/shop',        label: 'Shop',        icon: ShoppingBag },
]

const AUTH_LINKS = [
  { to: '/dashboard',       label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/certificates',    label: 'Certificates', icon: Award },
  { to: '/shop/downloads',  label: 'Downloads',    icon: Download },
]

export default function Navbar() {
  const { isAuth, user, logout } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const handleLogout = async () => { await logout(); navigate('/') }

  const isActive = (to) => location.pathname.startsWith(to)

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || ''

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-lifted' : 'bg-transparent'}`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
              style={{ background: 'linear-gradient(135deg, #F07A1A, #C85528)' }}>
              <span className="text-white text-xs font-display font-700">W</span>
            </div>
            <span className="font-display font-700 text-lg text-gradient-ember tracking-tight">WarmPath</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive(to)
                    ? 'bg-ember-500/10 text-ember-400'
                    : 'text-ink-300 hover:text-ink-100 hover:bg-[var(--bg-surface)]'
                  }`}>
                <Icon size={15} strokeWidth={1.8} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2">
            {isAuth ? (
              <>
                {AUTH_LINKS.map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150
                      ${isActive(to)
                        ? 'text-ember-400 bg-ember-500/10'
                        : 'text-ink-400 hover:text-ink-100 hover:bg-[var(--bg-surface)]'
                      }`}>
                    <Icon size={14} strokeWidth={1.8} />
                    {label}
                  </Link>
                ))}
                <div className="w-px h-5 bg-[var(--border-mid)] mx-1" />
                <div className="flex items-center gap-2">
                  {displayName && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #F07A1A, #C85528)' }}>
                      {displayName[0].toUpperCase()}
                    </div>
                  )}
                  <button onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150">
                    <LogOut size={13} /> Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"  className="btn-ghost text-sm">Sign in</Link>
                <Link to="/signup" className="btn-primary text-sm px-4 py-2">Get started free</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(o => !o)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-ink-300 hover:bg-[var(--bg-surface)] transition-colors">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] animate-fade-in" style={{ background: 'rgba(28,24,21,0.97)', backdropFilter: 'blur(20px)' }}>
          <div className="page-container py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive(to) ? 'bg-ember-500/10 text-ember-400' : 'text-ink-300 hover:text-ink-100 hover:bg-[var(--bg-surface)]'}`}>
                <Icon size={16} strokeWidth={1.8} /> {label}
              </Link>
            ))}
            {isAuth && (
              <>
                <div className="divider my-1" />
                {AUTH_LINKS.map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-150
                      ${isActive(to) ? 'bg-ember-500/10 text-ember-400' : 'text-ink-300 hover:text-ink-100 hover:bg-[var(--bg-surface)]'}`}>
                    <Icon size={16} strokeWidth={1.8} /> {label}
                  </Link>
                ))}
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={16} /> Sign out
                </button>
              </>
            )}
            {!isAuth && (
              <>
                <div className="divider my-1" />
                <div className="flex gap-3 pt-1 pb-2">
                  <Link to="/login"  className="btn-secondary flex-1 justify-center text-sm">Sign in</Link>
                  <Link to="/signup" className="btn-primary  flex-1 justify-center text-sm">Get started</Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
