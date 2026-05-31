import { useParams, Link, Navigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { POSTS } from './Blog'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'

const CONTENT = {
  'why-i-built-warmpath': [
    { type:'lead',    text:"I had a problem. I wanted to learn to code. YouTube had everything — but it was chaos. Thousands of videos. No order. No structure. No way to prove I actually learned anything." },
    { type:'text',    text:"Paid platforms were too expensive. Free platforms had no certificates. There was nothing in between. So I built WarmPath." },
    { type:'quote',   text:"Not from a laptop. From a phone." },
    { type:'text',    text:"Using Termux — a terminal emulator for Android — I wrote every line of code on a 6-inch screen. No fancy setup. No office. Just a phone, an internet connection, and a problem to solve." },
    { type:'heading', text:"What WarmPath does" },
    { type:'list',    items:['Takes the best YouTube tutorials and organizes them into 20 structured courses','Tracks your progress through every lesson','Awards XP, badges, and streaks to keep you motivated','Issues verified certificates when you complete a course','Provides a public profile you can share with employers'] },
    { type:'heading', text:"Why free?" },
    { type:'text',    text:"Because education shouldn't have a paywall. You pay only when you want a certificate (KES 999). Everything else is free. Forever." },
    { type:'heading', text:"What I learned building this" },
    { type:'text',    text:"Building something real doesn't require perfect conditions. It requires starting. The phone wasn't a limitation — it was a reminder that tools don't build products. People do." },
    { type:'heading', text:"What's next" },
    { type:'text',    text:"More courses. A mobile app. AI-powered learning features. But the mission stays the same: free education, structured learning, provable skills." },
  ],
  'how-to-learn-tech-skills': [
    { type:'lead',    text:"The internet has everything you need to learn to code. But it also has everything you don't need. The hardest part isn't learning — it's knowing what to learn next." },
    { type:'heading', text:"1. Follow a structure" },
    { type:'text',    text:"Don't jump between random YouTube videos. Pick a structured path. WarmPath organizes 14 modules per course in the exact order you should learn them." },
    { type:'heading', text:"2. Track your progress" },
    { type:'text',    text:"You can't improve what you don't measure. WarmPath tracks every lesson you complete, shows your progress percentage, and awards XP as you go." },
    { type:'heading', text:"3. Stay consistent" },
    { type:'text',    text:"A 7-day streak beats a 12-hour cram session. The platform tracks your daily streaks and rewards consistency with badges and XP." },
    { type:'heading', text:"4. Build proof" },
    { type:'text',    text:"Learning is invisible. Certificates make it visible. When you complete a course, unlock a verified certificate that employers can check at any time." },
    { type:'heading', text:"5. Join a community" },
    { type:'text',    text:"Learning alone is hard. The course discussion tab lets you ask questions, share resources, and learn alongside others on the same path." },
    { type:'heading', text:"6. Build projects" },
    { type:'text',    text:"Courses give you the foundation. Projects give you the proof. Every WarmPath course ends with a final project module." },
    { type:'quote',   text:"Structure beats randomness. Consistency beats intensity. Proof beats claims." },
  ],
  'skills-to-get-hired-2026': [
    { type:'lead',    text:"The tech job market changes fast. Here are the skills that matter most right now — and every one of them has a free course on WarmPath." },
    { type:'heading', text:"1. Fullstack Web Development" },
    { type:'text',    text:"Companies need developers who can build complete applications. HTML, CSS, JavaScript, React, Node.js — learn the full stack and you're employable anywhere." },
    { type:'heading', text:"2. Python" },
    { type:'text',    text:"Still the most versatile language. Data science, automation, web development, AI — Python does it all. High demand, beginner-friendly, great salary ceiling." },
    { type:'heading', text:"3. AI & Machine Learning" },
    { type:'text',    text:"AI isn't replacing developers. Developers who understand AI are replacing those who don't. Learn prompt engineering, ML basics, and AI tools." },
    { type:'heading', text:"4. Cybersecurity" },
    { type:'text',    text:"Every company needs security. The demand for cybersecurity professionals keeps growing year on year, outpacing supply significantly." },
    { type:'heading', text:"5. Cloud Computing" },
    { type:'text',    text:"AWS, Docker, Kubernetes — companies are moving to the cloud and need people who understand it. Cloud certifications pay well and are in high demand." },
    { type:'heading', text:"6. Data Science" },
    { type:'text',    text:"Data is the new oil. Companies pay well for people who can collect, clean, analyze, and present data in ways that drive decisions." },
    { type:'heading', text:"7. DevOps" },
    { type:'text',    text:"The bridge between development and operations. CI/CD pipelines, infrastructure as code — high demand, high pay, and a clear career path." },
    { type:'quote',   text:"All these skills are available as free courses on WarmPath. Start one today. Finish it. Get certified. Get hired." },
  ],
}

export default function BlogPost() {
  const { slug }   = useParams()
  const post       = POSTS.find(p => p.slug === slug)
  const content    = CONTENT[slug]
  if (!post || !content) return <Navigate to="/blog" replace />

  const idx  = POSTS.findIndex(p => p.slug === slug)
  const prev = POSTS[idx - 1]
  const next = POSTS[idx + 1]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-24">
        <section className="py-16 border-b border-[var(--border)] bg-[var(--bg-raised)]">
          <div className="page-container max-w-3xl animate-fade-up">
            <Link to="/blog" className="btn-ghost text-xs gap-2 mb-6 -ml-1 inline-flex"><ArrowLeft size={14} /> All posts</Link>
            <div className="flex items-center gap-3 mb-5">
              <span className="badge bg-ember-500/10 border border-ember-500/20 text-ember-400 text-xs">{post.category}</span>
              <span className="text-xs text-ink-500 flex items-center gap-1.5"><Clock size={11} /> {post.readTime}</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-700 text-[var(--text-base)] leading-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-xs text-ink-500">
              <span>Job William</span><span>·</span><span>{post.date}</span>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="page-container max-w-2xl">
            <div className="space-y-6">
              {content.map((block, i) => {
                if (block.type === 'lead')    return <p key={i} className="text-xl text-ink-200 leading-relaxed font-display font-400">{block.text}</p>
                if (block.type === 'text')    return <p key={i} className="text-base text-ink-400 leading-relaxed">{block.text}</p>
                if (block.type === 'heading') return <h2 key={i} className="font-display text-2xl font-700 text-[var(--text-base)] pt-4">{block.text}</h2>
                if (block.type === 'quote')   return (
                  <blockquote key={i} className="border-l-2 border-ember-500 pl-6 py-2 my-6">
                    <p className="font-display text-xl font-400 italic text-ink-200 leading-relaxed">{block.text}</p>
                  </blockquote>
                )
                if (block.type === 'list') return (
                  <ul key={i} className="space-y-3">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-ink-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-ember-500 flex-shrink-0 mt-2.5" />{item}
                      </li>
                    ))}
                  </ul>
                )
                return null
              })}
            </div>

            <div className="mt-14 pt-8 border-t border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-700 flex-shrink-0"
                  style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)' }}>J</div>
                <div>
                  <p className="font-medium text-sm text-[var(--text-base)]">Job William</p>
                  <p className="text-xs text-ink-500">Founder, WarmPath · <a href="mailto:jobmlisho63@gmail.com" className="text-ember-400 hover:text-ember-300 transition-colors">jobmlisho63@gmail.com</a></p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {prev ? (
                <Link to={`/blog/${prev.slug}`} className="card-hover p-4 text-left">
                  <p className="text-2xs text-ink-500 uppercase tracking-wide mb-1 flex items-center gap-1"><ArrowLeft size={10} /> Previous</p>
                  <p className="text-sm font-medium text-[var(--text-base)] line-clamp-2">{prev.title}</p>
                </Link>
              ) : <div />}
              {next ? (
                <Link to={`/blog/${next.slug}`} className="card-hover p-4 text-right">
                  <p className="text-2xs text-ink-500 uppercase tracking-wide mb-1 flex items-center gap-1 justify-end">Next <ArrowRight size={10} /></p>
                  <p className="text-sm font-medium text-[var(--text-base)] line-clamp-2">{next.title}</p>
                </Link>
              ) : <div />}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
