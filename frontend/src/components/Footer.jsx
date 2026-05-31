import { Link } from 'react-router-dom'

const LINKS = {
  Learn:   [{ to:'/courses', label:'Courses' },{ to:'/leaderboard', label:'Leaderboard' },{ to:'/certificates', label:'Certificates' }],
  Shop:    [{ to:'/shop', label:'Resource Shop' },{ to:'/shop/cart', label:'Cart' },{ to:'/shop/downloads', label:'Downloads' }],
  Company: [{ to:'/about', label:'About' },{ to:'/blog', label:'Blog' },{ to:'/contact', label:'Contact' }],
  Support: [{ to:'/faq', label:'FAQ' },{ to:'/privacy', label:'Privacy Policy' }],
}

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-raised)] mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)' }}>
                <span className="text-white text-xs font-display font-700">W</span>
              </div>
              <span className="font-display font-700 text-gradient-ember">WarmPath</span>
            </Link>
            <p className="text-xs text-ink-500 leading-relaxed max-w-xs mb-4">
              Free tech education for Africa. Learn, earn certificates, build your future.
            </p>
            <div className="flex flex-col gap-1.5">
              <a href="mailto:jobmlisho63@gmail.com" className="text-xs text-ink-500 hover:text-ember-400 transition-colors">jobmlisho63@gmail.com</a>
              <a href="tel:0713957173"              className="text-xs text-ink-500 hover:text-ember-400 transition-colors">0713 957 173</a>
            </div>
          </div>
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">{group}</p>
              <div className="flex flex-col gap-2">
                {links.map(({ to, label }) => (
                  <Link key={to} to={to} className="text-sm text-ink-500 hover:text-ink-200 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-600">© {new Date().getFullYear()} WarmPath. Built by Job William. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about"   className="text-xs text-ink-500 hover:text-ink-200 transition-colors">About</Link>
            <Link to="/privacy" className="text-xs text-ink-500 hover:text-ink-200 transition-colors">Privacy</Link>
            <Link to="/faq"     className="text-xs text-ink-500 hover:text-ink-200 transition-colors">FAQ</Link>
            <Link to="/contact" className="text-xs text-ink-500 hover:text-ink-200 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
