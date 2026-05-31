import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { ShieldCheck, Mail } from 'lucide-react'

const updated = new Date().toLocaleDateString('en-KE', {
  year: 'numeric', month: 'long', day: 'numeric'
})

const SECTIONS = [
  {
    id: '1',
    title: 'Who we are',
    content: `WarmPath is a free online learning platform operated by Job William, based in Kenya. We provide structured tech education courses, gamification features, verified certificates, and a resource shop. This policy applies to all users of the WarmPath website and platform at all times.`,
  },
  {
    id: '2',
    title: 'What information we collect',
    subsections: [
      {
        label: 'Information you give us',
        items: [
          'Full name — used to personalise your experience and appear on your certificate',
          'Email address — used for account creation, login, and certificate records',
          'Password — stored securely and encrypted by Supabase; we never see it in plain text',
        ],
      },
      {
        label: 'Information we collect automatically',
        items: [
          'Course enrolments and lesson completion records',
          'XP earned, streak activity, badge awards, and leaderboard position',
          'Certificate records including issue date and verification codes',
          'Shop purchase history and download records',
          'Session tokens for authentication (stored in your browser)',
        ],
      },
      {
        label: 'Information we do not collect',
        items: [
          'Payment details — all payments are handled entirely by Paystack; we never see your card number, M-Pesa PIN, or bank details',
          'Location data — we do not track or store your physical location',
          'Browsing behaviour — we do not use analytics, tracking pixels, or third-party trackers',
          'Device identifiers or IP addresses beyond what your browser sends automatically',
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'How we use your information',
    items: [
      'To create and manage your account securely',
      'To track your learning progress across courses and lessons',
      'To calculate and display your XP, streaks, level, and badges',
      'To issue and verify certificates when you complete a course',
      'To process shop purchases and grant access to purchased downloads',
      'To display your public profile and leaderboard ranking to other users',
      'To respond to support requests, course suggestions, or account queries you send us',
    ],
    note: 'We use your data only to run the platform. We do not use it for advertising, profiling, or any purpose beyond what is listed above.',
  },
  {
    id: '4',
    title: 'What information is public',
    content: `The following information is visible to other users of WarmPath:`,
    items: [
      'Your display name on the leaderboard and public profile',
      'Your level, XP total, and earned badges on your public profile',
      'Your certificate — specifically your name and course title — when someone uses your verification code or link',
      'Discussions and replies you post inside course community tabs',
    ],
    note: 'Your email address is never shown publicly under any circumstances.',
  },
  {
    id: '5',
    title: 'Who we share your data with',
    subsections: [
      {
        label: 'Supabase',
        text: 'Our database and authentication provider. Your account data, progress, and certificates are stored securely on Supabase infrastructure. Supabase is SOC 2 Type 2 compliant. See their privacy policy at supabase.com/privacy.',
      },
      {
        label: 'Paystack',
        text: 'Our payment processor. When you pay for a certificate or shop product, you are transacting directly with Paystack. We receive only a confirmation that payment was successful — never your payment details. See their privacy policy at paystack.com/privacy.',
      },
      {
        label: 'YouTube',
        text: 'Course videos are embedded from YouTube. When you watch a lesson, YouTube\'s own privacy policy applies to that interaction. We do not share your data with YouTube.',
      },
    ],
    note: 'We do not sell your data. We do not share your data with advertisers, data brokers, or any party not listed above.',
  },
  {
    id: '6',
    title: 'Cookies and local storage',
    items: [
      'Authentication session — a secure token stored in your browser to keep you logged in. This is essential for the platform to work.',
      'Admin session token — stored only if you log in as an admin, cleared on logout.',
    ],
    note: 'We do not use advertising cookies, analytics cookies, or any tracking cookies. We do not use third-party cookie services.',
  },
  {
    id: '7',
    title: 'How long we keep your data',
    items: [
      'Account data — kept for as long as your account exists',
      'Course progress and certificates — kept permanently so your achievements are never lost',
      'Purchase records — kept for accounting and download access purposes',
      'Community posts — kept unless you request removal',
    ],
    note: 'If you delete your account, all of the above is permanently deleted within 48 hours.',
  },
  {
    id: '8',
    title: 'Your rights',
    content: 'You have the right to:',
    items: [
      'Access — request a copy of all data we hold about you',
      'Correction — ask us to correct inaccurate data',
      'Deletion — request that all your data be permanently deleted',
      'Portability — request your data in a readable format',
      'Objection — object to any use of your data that you did not consent to',
    ],
    note: 'To exercise any of these rights, email jobmlisho63@gmail.com. We respond within 48 hours.',
  },
  {
    id: '9',
    title: 'Children and minors',
    content: 'WarmPath is intended for users aged 13 and above. We do not knowingly collect data from children under 13. If you believe a child has created an account, contact us at jobmlisho63@gmail.com and we will delete the account immediately.',
  },
  {
    id: '10',
    title: 'Security',
    content: 'All data is transmitted over HTTPS. Passwords are hashed and never stored in plain text. Authentication tokens are short-lived and verified on every request. We follow industry-standard security practices and rely on Supabase\'s infrastructure, which is independently audited. Despite these measures, no system is 100% secure. If you suspect a security issue, contact us immediately.',
  },
  {
    id: '11',
    title: 'Changes to this policy',
    content: 'If we make significant changes to this policy, we will update the "Last updated" date at the top. Continued use of the platform after changes constitutes acceptance. We will never reduce your rights under this policy without direct notice.',
  },
  {
    id: '12',
    title: 'Contact',
    content: 'For any privacy questions, data requests, or concerns:',
    contact: true,
  },
]

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-24">

        {/* Header */}
        <section className="py-16 border-b border-[var(--border)] bg-[var(--bg-raised)]">
          <div className="page-container max-w-3xl animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-ember-500/10 border border-ember-500/20 flex items-center justify-center">
                <ShieldCheck size={18} className="text-ember-400" />
              </div>
              <p className="text-ember-500 text-xs font-semibold tracking-widest uppercase">Legal</p>
            </div>
            <h1 className="font-display text-5xl font-700 text-[var(--text-base)] mb-4">Privacy Policy</h1>
            <p className="text-ink-400 text-sm leading-relaxed mb-4 max-w-xl">
              This policy explains what data WarmPath collects, why we collect it, how we use it, and what rights you have over it. It is written in plain language — no legal jargon.
            </p>
            <p className="text-xs text-ink-500">Last updated: {updated}</p>
          </div>
        </section>

        {/* Quick summary banner */}
        <section className="border-b border-[var(--border)]">
          <div className="page-container max-w-3xl py-8">
            <div className="card border-sage-500/20 bg-sage-500/5 p-6">
              <p className="text-xs font-semibold text-sage-400 uppercase tracking-widest mb-4">The short version</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title:'We never sell your data', desc:'Your information is never sold or shared with advertisers or data brokers.' },
                  { title:'Payments are not ours', desc:'Paystack handles all payments. We never see your card or M-Pesa details.' },
                  { title:'You can delete everything', desc:'Email us and all your data is permanently deleted within 48 hours.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-[var(--text-base)]">{title}</p>
                    <p className="text-xs text-ink-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Table of contents */}
        <section className="border-b border-[var(--border)] bg-[var(--bg-raised)]">
          <div className="page-container max-w-3xl py-8">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">Contents</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SECTIONS.map(s => (
                <a key={s.id} href={`#section-${s.id}`}
                  className="flex items-center gap-2 text-sm text-ink-400 hover:text-ember-400 transition-colors py-1">
                  <span className="text-xs font-mono text-ember-500/60 w-5">{s.id}.</span>
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Full content */}
        <section className="py-16">
          <div className="page-container max-w-3xl">
            <div className="space-y-12">
              {SECTIONS.map(s => (
                <div key={s.id} id={`section-${s.id}`} className="scroll-mt-24">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-xs font-mono text-ember-500/60 flex-shrink-0">{s.id}.</span>
                    <h2 className="font-display text-xl font-700 text-[var(--text-base)]">{s.title}</h2>
                  </div>

                  {/* Contact section */}
                  {s.contact && (
                    <div className="ml-6">
                      <p className="text-sm text-ink-400 leading-relaxed mb-5">{s.content}</p>
                      <div className="card border-[var(--border-mid)] p-6 flex flex-col sm:flex-row gap-5">
                        <div className="flex items-start gap-3 flex-1">
                          <Mail size={16} className="text-ember-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-[var(--text-base)] mb-0.5">Email</p>
                            <a href="mailto:jobmlisho63@gmail.com" className="text-sm text-ember-400 hover:text-ember-300 transition-colors">
                              jobmlisho63@gmail.com
                            </a>
                            <p className="text-xs text-ink-500 mt-1">Response within 48 hours</p>
                          </div>
                        </div>
                        <div className="sm:border-l border-[var(--border)] sm:pl-5">
                          <p className="text-xs text-ink-500 leading-relaxed">
                            For urgent matters or if you believe your data has been compromised, please contact us immediately and we will prioritise your request.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standard text section */}
                  {!s.contact && (
                    <div className="ml-6 space-y-4">
                      {s.content && (
                        <p className="text-sm text-ink-400 leading-relaxed">{s.content}</p>
                      )}

                      {/* Subsections */}
                      {s.subsections && s.subsections.map(sub => (
                        <div key={sub.label} className="mt-4">
                          <p className="text-sm font-medium text-[var(--text-base)] mb-2">{sub.label}</p>
                          {sub.text && (
                            <p className="text-sm text-ink-400 leading-relaxed">{sub.text}</p>
                          )}
                          {sub.items && (
                            <ul className="space-y-2 mt-2">
                              {sub.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-3 text-sm text-ink-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-ember-500/60 flex-shrink-0 mt-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                      {/* Direct items list */}
                      {s.items && !s.subsections && (
                        <ul className="space-y-2">
                          {s.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-ink-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-ember-500/60 flex-shrink-0 mt-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Note / highlight */}
                      {s.note && (
                        <div className="mt-4 px-4 py-3 rounded-lg border border-[var(--border-mid)] bg-[var(--bg-raised)]">
                          <p className="text-xs text-ink-300 leading-relaxed">{s.note}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-10 divider" />
                </div>
              ))}
            </div>

            {/* Bottom nav */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-ink-500">WarmPath · Built by Job William · Kenya</p>
              <div className="flex gap-5">
                <Link to="/faq"     className="text-xs text-ink-500 hover:text-ember-400 transition-colors">FAQ</Link>
                <Link to="/contact" className="text-xs text-ink-500 hover:text-ember-400 transition-colors">Contact</Link>
                <Link to="/"        className="text-xs text-ink-500 hover:text-ember-400 transition-colors">Home</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
