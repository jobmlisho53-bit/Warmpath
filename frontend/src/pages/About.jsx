import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { BookOpen } from 'lucide-react'

const VALUES = [
  'Education should be free',
  'Skills should be provable',
  'Certificates should be affordable',
  'Learning should be structured, not random',
  'Anyone with internet should be able to start a tech career',
]
const STATS = [
  { value:'20+',     label:'Structured courses' },
  { value:'280+',    label:'Video lessons' },
  { value:'14',      label:'Modules per course' },
  { value:'KES 999', label:'Per certificate' },
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-24">
        <section className="relative py-20 border-b border-[var(--border)] overflow-hidden">
          <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />
          <div className="page-container relative max-w-3xl animate-fade-up">
            <p className="text-ember-500 text-xs font-semibold tracking-widest uppercase mb-4">Our story</p>
            <h1 className="font-display text-5xl lg:text-6xl font-700 text-[var(--text-base)] mb-6 leading-tight">
              About <span className="text-gradient-ember">WarmPath</span>
            </h1>
            <p className="text-lg text-ink-300 leading-relaxed">
              A free learning platform born from a simple observation — that the best education should not require either a laptop or a large budget.
            </p>
          </div>
        </section>

        <section className="py-20 border-b border-[var(--border)]">
          <div className="page-container max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <div className="animate-fade-up">
                <div className="w-10 h-10 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center justify-center mb-5">
                  <span className="text-red-400 font-display font-700 text-sm">!</span>
                </div>
                <h2 className="font-display text-2xl font-700 text-[var(--text-base)] mb-4">The problem</h2>
                <p className="text-ink-400 leading-relaxed text-sm">
                  People wanted to learn tech skills online but YouTube was a mess — random videos, no structure, no way to prove what they learned. Free courses had no certificates. Paid platforms cost too much. There was nothing in between.
                </p>
              </div>
              <div className="animate-fade-up animate-delay-100">
                <div className="w-10 h-10 rounded-xl border border-sage-500/20 bg-sage-500/10 flex items-center justify-center mb-5">
                  <span className="text-sage-400 font-display font-700 text-sm">+</span>
                </div>
                <h2 className="font-display text-2xl font-700 text-[var(--text-base)] mb-4">The solution</h2>
                <p className="text-ink-400 leading-relaxed text-sm">
                  WarmPath takes the best YouTube tutorials, organizes them into structured courses, and lets you earn verified certificates when you complete them. Learn free. Pay only when you want recognition.
                </p>
              </div>
            </div>
            <div className="card border-[var(--border-mid)] p-8 mb-16 animate-fade-up animate-delay-200"
              style={{ background:'linear-gradient(135deg,rgba(240,122,26,0.03),rgba(200,85,40,0.03))' }}>
              <p className="text-xs font-semibold text-ember-400 uppercase tracking-widest mb-4">How it started</p>
              <p className="text-[var(--text-base)] leading-relaxed text-base font-display font-400 italic">
                "Built entirely from a phone using Termux. No laptop. No office. Just a problem to solve and the determination to fix it."
              </p>
              <div className="mt-5 pt-5 border-t border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--text-base)]">Job William</p>
                <p className="text-xs text-ink-500">Founder, WarmPath</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 border-b border-[var(--border)] bg-[var(--bg-raised)]">
          <div className="page-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden max-w-3xl mx-auto">
              {STATS.map(({ value, label }) => (
                <div key={label} className="bg-[var(--bg-raised)] px-6 py-8 text-center">
                  <p className="font-display text-3xl font-700 text-gradient-ember mb-1">{value}</p>
                  <p className="text-xs text-ink-400 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-[var(--border)]">
          <div className="page-container max-w-3xl">
            <p className="text-ember-500 text-xs font-semibold tracking-widest uppercase mb-4 animate-fade-up">Our principles</p>
            <h2 className="font-display text-3xl font-700 text-[var(--text-base)] mb-10 animate-fade-up animate-delay-100">What we believe</h2>
            <div className="space-y-3 animate-fade-up animate-delay-200">
              {VALUES.map((v, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--border-mid)] transition-colors">
                  <div className="w-6 h-6 rounded-full bg-ember-500/10 border border-ember-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-ember-400 font-display font-700 text-xs">{i+1}</span>
                  </div>
                  <p className="text-sm text-ink-300 leading-relaxed">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="page-container max-w-2xl text-center">
            <h2 className="font-display text-4xl font-700 text-[var(--text-base)] mb-4 animate-fade-up">One person. One vision.</h2>
            <p className="text-ink-400 mb-8 animate-fade-up animate-delay-100">A platform for learners everywhere. Built from a phone. Free forever.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delay-200">
              <Link to="/courses" className="btn-primary text-base px-7 py-3.5 gap-2"><BookOpen size={16} /> Start learning free</Link>
              <Link to="/contact" className="btn-secondary text-base px-7 py-3.5">Get in touch</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
