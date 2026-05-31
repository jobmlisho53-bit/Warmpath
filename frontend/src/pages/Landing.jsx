import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Trophy, Award, ShoppingBag, Flame, Star, Zap, CheckCircle, Play } from 'lucide-react'

const STATS = [
  { value:'20+',  label:'Expert Courses' },
  { value:'280+', label:'Video Lessons' },
  { value:'100%', label:'Free to Learn' },
  { value:'KES',  label:'Verified Certs' },
]

const FEATURES = [
  { icon: BookOpen,    title:'Curated Curriculum',   desc:'20+ courses across tech, design, business and more — built for African learners.' },
  { icon: Play,        title:'280+ Video Lessons',    desc:'HD YouTube-powered lessons you can watch at your own pace, anywhere.' },
  { icon: Zap,         title:'XP & Streaks',          desc:'Earn experience points, maintain daily streaks, level up as you learn.' },
  { icon: Trophy,      title:'Live Leaderboard',      desc:'Compete with thousands of learners. Climb the ranks. Get recognised.' },
  { icon: Award,       title:'Verified Certificates', desc:'Earn shareable certificates with unique verification codes. KES 999 only.' },
  { icon: ShoppingBag, title:'Resource Shop',         desc:'Cheat sheets, templates and tools to accelerate your learning journey.' },
]

const CATEGORIES = [
  'Web Development','Data Science','UI/UX Design','Python',
  'Cybersecurity','Cloud Computing','Mobile Dev','Machine Learning',
]

const FOOTER_LINKS = {
  Learn:   [{ to:'/courses', label:'All Courses' },{ to:'/leaderboard', label:'Leaderboard' },{ to:'/certificates', label:'Certificates' }],
  Shop:    [{ to:'/shop', label:'Resource Shop' },{ to:'/shop/cart', label:'Cart' },{ to:'/shop/downloads', label:'Downloads' }],
  Company: [{ to:'/about', label:'About' },{ to:'/blog', label:'Blog' },{ to:'/contact', label:'Contact' }],
  Support: [{ to:'/faq', label:'FAQ' },{ to:'/privacy', label:'Privacy Policy' },{ to:'/verify/demo', label:'Verify Certificate' }],
}

export default function Landing() {
  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-ember-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-terra-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="page-container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ember-500/10 border border-ember-500/20 text-ember-400 text-sm font-medium mb-8 animate-fade-up opacity-0-init">
              <Flame size={14} className="animate-pulse-slow" />
              Free tech education for All
              <ArrowRight size={13} />
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-tight mb-6 animate-fade-up opacity-0-init animate-delay-100">
              Learn tech skills.<br />
              <span className="text-gradient-ember ember-glow">Earn your path.</span>
            </h1>
            <p className="text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up opacity-0-init animate-delay-200">
              20+ curated courses. 280+ video lessons. XP streaks, leaderboards, and verified certificates. Everything free. Forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up opacity-0-init animate-delay-300">
              <Link to="/signup" className="btn-primary text-base px-7 py-3.5 gap-2">
                <Star size={16} /> Start learning free <ArrowRight size={16} />
              </Link>
              <Link to="/courses" className="btn-secondary text-base px-7 py-3.5 gap-2">
                <BookOpen size={16} /> Browse courses
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden animate-fade-up opacity-0-init animate-delay-400">
              {STATS.map(({ value, label }) => (
                <div key={label} className="bg-[var(--bg-raised)] px-6 py-5 flex flex-col items-center gap-1">
                  <span className="font-display text-3xl font-700 text-gradient-ember">{value}</span>
                  <span className="text-xs text-ink-400 font-medium tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-8 border-y border-[var(--border)] overflow-hidden">
        <div className="flex gap-3 flex-wrap justify-center px-6">
          {CATEGORIES.map(label => (
            <Link key={label} to="/courses"
              className="badge border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card cursor-pointer bg-ember-500/10 border-ember-500/20 text-ember-400">
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <p className="text-ember-500 text-sm font-semibold tracking-widest uppercase mb-3">Everything you need</p>
            <h2 className="font-display text-4xl lg:text-5xl font-700 text-[var(--text-base)]">Built for serious learners</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="card-hover p-6 group" style={{ animationDelay:`${i*80}ms` }}>
                <div className="w-11 h-11 rounded-xl bg-ember-500/10 border border-ember-500/20 flex items-center justify-center mb-4 group-hover:bg-ember-500/15 transition-all duration-200">
                  <Icon size={20} className="text-ember-400" />
                </div>
                <h3 className="font-display text-lg font-600 text-[var(--text-base)] mb-2">{title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-[var(--bg-raised)] border-y border-[var(--border)]">
        <div className="page-container">
          <div className="text-center mb-16">
            <p className="text-ember-500 text-sm font-semibold tracking-widest uppercase mb-3">Simple process</p>
            <h2 className="font-display text-4xl lg:text-5xl font-700">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-ember-500/30 to-transparent" />
            {[
              { n:'01', title:'Sign up free',     desc:'Create your account in seconds. No credit card required.' },
              { n:'02', title:'Pick a course',    desc:'Browse 20+ courses. Enrol with one click.' },
              { n:'03', title:'Learn & level up', desc:'Watch lessons, earn XP, maintain streaks.' },
              { n:'04', title:'Get certified',    desc:'Complete a course and earn a verified certificate.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display text-xl font-700 relative z-10"
                  style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)', boxShadow:'0 0 0 1px rgba(240,122,26,0.2),0 8px 24px -4px rgba(240,122,26,0.3)' }}>
                  {n}
                </div>
                <h3 className="font-display text-lg font-600">{title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24">
        <div className="page-container">
          <div className="relative rounded-3xl overflow-hidden p-12 lg:p-16 text-center"
            style={{ background:'linear-gradient(135deg,#D4600A,#C85528,#883318)' }}>
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-60" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-white/5 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-4xl lg:text-5xl font-700 text-white mb-4">Your path starts today.</h2>
              <p className="text-ember-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of African learners already building their future with WarmPath.
              </p>
              <Link to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-terra-700 font-semibold text-base hover:bg-ember-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-lifted">
                <Flame size={18} /> Get started — it's free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-raised)]">
        <div className="page-container py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)' }}>
                  <span className="text-white text-xs font-display font-700">W</span>
                </div>
                <span className="font-display font-700 text-gradient-ember">WarmPath</span>
              </Link>
              <p className="text-xs text-ink-500 leading-relaxed max-w-xs mb-5">
                Free tech education for Africa. Learn, earn certificates, build your future.
              </p>
              <div className="flex flex-col gap-1.5">
                <a href="mailto:jobmlisho63@gmail.com" className="text-xs text-ink-500 hover:text-ember-400 transition-colors">jobmlisho63@gmail.com</a>
                <a href="tel:0713957173"              className="text-xs text-ink-500 hover:text-ember-400 transition-colors">0713 957 173</a>
              </div>
            </div>

            {/* Link groups */}
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">{group}</p>
                <div className="flex flex-col gap-2.5">
                  {links.map(({ to, label }) => (
                    <Link key={to} to={to} className="text-sm text-ink-500 hover:text-ink-200 transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="divider mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ink-600">
              © {new Date().getFullYear()} WarmPath. Built by Job William. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link to="/about"   className="text-xs text-ink-500 hover:text-ink-200 transition-colors">About</Link>
              <Link to="/privacy" className="text-xs text-ink-500 hover:text-ink-200 transition-colors">Privacy</Link>
              <Link to="/faq"     className="text-xs text-ink-500 hover:text-ink-200 transition-colors">FAQ</Link>
              <Link to="/contact" className="text-xs text-ink-500 hover:text-ink-200 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
