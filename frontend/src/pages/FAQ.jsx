import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  { q:'Is WarmPath really free?', a:'Yes. All courses are completely free. You only pay if you want a verified certificate (KES 999) or choose to buy resources from the shop.' },
  { q:'How do the certificates work?', a:'Complete 100% of a course, pay KES 999 via Paystack, and your certificate is unlocked immediately. Each certificate has a unique verification code that anyone can use to confirm its authenticity.' },
  { q:'Can employers verify my certificate?', a:'Yes. Every certificate has a public verification link. Share it on your CV or LinkedIn. Employers can verify it instantly at warmpath.app/verify/[code].' },
  { q:'Where do the courses come from?', a:'We curate the best YouTube tutorials from experienced teachers and organize them into structured learning paths. You get the quality of top creators with the structure of a real course.' },
  { q:'What courses are available?', a:'Fullstack Web Development, Python, UI/UX Design, Graphic Design, Digital Marketing, Cybersecurity, Data Science, Machine Learning, Mobile App Development, Cloud Computing, Software Engineering, Game Development, Business & Entrepreneurship, Stock Market Investing, Cryptocurrency, Video Editing, SQL & Databases, DevOps, Freelancing, and AI Tools.' },
  { q:'How long does a course take?', a:"Each course has 14 modules. At your own pace — some finish in 2 weeks, others take 2 months. There's no deadline." },
  { q:'What payment methods do you accept?', a:'Paystack processes our payments. You can pay with M-Pesa, bank card, or bank transfer.' },
  { q:'Can I download course videos?', a:'Videos are streamed from YouTube. You need an internet connection to watch. Offline downloads are planned for a future update.' },
  { q:'How do I earn badges and XP?', a:'Complete lessons to earn XP. Maintain daily streaks. Finish courses to unlock achievement badges. Climb the leaderboard as you learn.' },
  { q:'What if a video is broken or unavailable?', a:'Report it via email (jobmlisho63@gmail.com) or through the course discussion tab. Broken videos are fixed quickly.' },
  { q:'Can I suggest a new course?', a:'Absolutely. Email your suggestion to jobmlisho63@gmail.com. New courses are added regularly based on what learners need.' },
  { q:'How do I delete my account?', a:'Email jobmlisho63@gmail.com with your account email. All data will be permanently deleted within 48 hours.' },
  { q:'Is there a mobile app?', a:'Not yet. The platform works on mobile browsers. A dedicated app is on the roadmap.' },
  { q:'Who built WarmPath?', a:'Job William. One developer. Built entirely from a phone using Termux. Read the full story on the About page.' },
]

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-200 ${open ? 'border-[var(--border-mid)]' : 'hover:border-[var(--border-mid)]'}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-[var(--bg-raised)] hover:bg-[var(--bg-surface)] transition-colors">
        <span className="flex items-center gap-3">
          <span className="text-xs font-mono text-ember-400 font-medium flex-shrink-0 w-5">{String(index+1).padStart(2,'0')}</span>
          <span className="font-medium text-sm text-[var(--text-base)]">{q}</span>
        </span>
        <ChevronDown size={16} className={`text-ink-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180':''}`} />
      </button>
      {open && (
        <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg)]">
          <p className="text-sm text-ink-400 leading-relaxed pl-8">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-24">
        <section className="py-16 border-b border-[var(--border)] bg-[var(--bg-raised)]">
          <div className="page-container max-w-3xl animate-fade-up">
            <p className="text-ember-500 text-xs font-semibold tracking-widest uppercase mb-4">Help</p>
            <h1 className="font-display text-5xl font-700 text-[var(--text-base)] mb-3">Frequently Asked Questions</h1>
            <p className="text-ink-400 text-sm">
              Cannot find your answer?{' '}
              <Link to="/contact" className="text-ember-400 hover:text-ember-300 transition-colors">Contact us directly</Link>
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="page-container max-w-3xl">
            <div className="space-y-3">
              {FAQS.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} index={i} />)}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
