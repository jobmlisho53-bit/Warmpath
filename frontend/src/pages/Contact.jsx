import Footer from '../components/Footer'
import { Mail, Phone, Clock, MessageSquare, BookOpen, Award, ShieldCheck, Users, HelpCircle } from 'lucide-react'

const TOPICS = [
  { icon: HelpCircle,    label: 'Technical issues with the platform' },
  { icon: BookOpen,      label: 'Course suggestions' },
  { icon: Award,         label: 'Certificate verification problems' },
  { icon: Users,         label: 'Partnership inquiries' },
  { icon: ShieldCheck,   label: 'Account help' },
  { icon: MessageSquare, label: "Anything else — I'm here to help" },
]

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-24">
        <section className="relative py-20 border-b border-[var(--border)] overflow-hidden">
          <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />
          <div className="page-container relative max-w-3xl animate-fade-up">
            <p className="text-ember-500 text-xs font-semibold tracking-widest uppercase mb-4">Reach out</p>
            <h1 className="font-display text-5xl font-700 text-[var(--text-base)] mb-4 leading-tight">
              Contact <span className="text-gradient-ember">Us</span>
            </h1>
            <p className="text-ink-400 leading-relaxed">Have questions, suggestions, or need help? I respond personally to every message.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="page-container max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-2 space-y-4 animate-fade-up">
                {[
                  { icon: Mail,  color:'ember', title:'Email',  value:'jobmlisho63@gmail.com', href:'mailto:jobmlisho63@gmail.com', note:'Response within 24 hours' },
                  { icon: Phone, color:'terra',  title:'Phone',  value:'0713 957 173',           href:'tel:0713957173',              note:'Mon–Fri, 9 AM–6 PM EAT' },
                  { icon: Clock, color:'sand',   title:'Response times', value:null, note:null },
                ].map(({ icon: Icon, color, title, value, href, note }) => (
                  <div key={title} className="card p-6 border-[var(--border-mid)]">
                    <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-4`}>
                      <Icon size={18} className={`text-${color}-400`} />
                    </div>
                    <h3 className="font-display font-600 text-[var(--text-base)] mb-2">{title}</h3>
                    {value && href && (
                      <a href={href} className={`text-${color}-400 hover:text-${color}-300 transition-colors text-sm font-medium`}>{value}</a>
                    )}
                    {note && <p className="text-xs text-ink-500 mt-2">{note}</p>}
                    {title === 'Response times' && (
                      <div className="space-y-1.5 mt-1">
                        {[['Email','Within 24 hours'],['Phone','Business hours'],['Urgent','Call directly']].map(([k,v]) => (
                          <div key={k} className="flex items-center justify-between text-xs">
                            <span className="text-ink-400">{k}</span>
                            <span className={k === 'Urgent' ? 'text-ember-400 font-medium' : 'text-[var(--text-base)] font-medium'}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="lg:col-span-3 animate-fade-up animate-delay-100">
                <h2 className="font-display text-2xl font-700 text-[var(--text-base)] mb-6">What you can contact me about</h2>
                <div className="space-y-3">
                  {TOPICS.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--border-mid)] hover:bg-[var(--bg-raised)] transition-all duration-150">
                      <div className="w-9 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-mid)] flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-ink-400" />
                      </div>
                      <p className="text-sm text-ink-300">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-5 rounded-xl border border-ember-500/20 bg-ember-500/5">
                  <p className="text-sm text-ink-300 leading-relaxed">
                    <span className="text-ember-400 font-medium">Direct email is best.</span>{' '}
                    I read and respond to every message personally. No bots, no automated responses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
