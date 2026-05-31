import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { ArrowRight } from 'lucide-react'

export const POSTS = [
  { slug:'why-i-built-warmpath',   title:'Why I Built WarmPath — A Free Learning Platform from Just a Phone', excerpt:"The story of how a frustration with YouTube chaos became a structured learning platform, built entirely on a 6-inch screen using Termux.", date:'May 29, 2026', readTime:'4 min read', category:'Founder Story' },
  { slug:'how-to-learn-tech-skills', title:'How to Learn Tech Skills Online Without Getting Lost', excerpt:"The internet has everything you need to learn to code — and everything you don't need. Here's a proven framework for staying on track.", date:'May 29, 2026', readTime:'5 min read', category:'Learning Guide' },
  { slug:'skills-to-get-hired-2026', title:'What Skills Will Get You Hired in 2026', excerpt:"The tech job market moves fast. Here are the seven skills with the highest demand right now — and how to learn every single one for free.", date:'May 29, 2026', readTime:'6 min read', category:'Career Advice' },
]

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-24">
        <section className="py-16 border-b border-[var(--border)] bg-[var(--bg-raised)]">
          <div className="page-container max-w-4xl animate-fade-up">
            <p className="text-ember-500 text-xs font-semibold tracking-widest uppercase mb-4">Insights</p>
            <h1 className="font-display text-5xl font-700 text-[var(--text-base)] mb-3">Blog</h1>
            <p className="text-ink-400">Learning guides, career advice, and the story behind WarmPath.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="page-container max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {POSTS.map((post, i) => (
                <Link key={post.slug} to={`/blog/${post.slug}`}
                  className="card-hover flex flex-col group"
                  style={{ animationDelay:`${i*80}ms` }}>
                  <div className="h-1 w-full rounded-t-xl" style={{ background:'linear-gradient(90deg,#F07A1A,#C85528)' }} />
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="badge bg-ember-500/10 border border-ember-500/20 text-ember-400 text-2xs">{post.category}</span>
                      <span className="text-2xs text-ink-500">{post.readTime}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display font-600 text-[var(--text-base)] leading-snug mb-3 group-hover:text-ember-400 transition-colors">{post.title}</h2>
                      <p className="text-xs text-ink-400 leading-relaxed line-clamp-3">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                      <span className="text-2xs text-ink-500">{post.date}</span>
                      <span className="text-xs text-ember-400 flex items-center gap-1 group-hover:gap-2 transition-all">Read <ArrowRight size={11} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
