import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { ArrowRight, Clock } from 'lucide-react'

export const POSTS = [
  {
    slug:     'why-i-built-warmpath',
    title:    'Why I Built WarmPath — A Free Learning Platform from Just a Phone',
    excerpt:  'No laptop. No office. One phone, one problem, and the stubbornness to fix it. The origin story of WarmPath.',
    date:     'May 29, 2026',
    readTime: '4 min read',
    category: 'Founder Story',
    keywords: 'free online learning Kenya, learn coding Africa, WarmPath story',
  },
  {
    slug:     'how-to-learn-tech-skills',
    title:    'How to Learn Tech Skills Online Without Getting Lost',
    excerpt:  'The internet has everything you need — and everything you do not. Here is the exact framework that works.',
    date:     'May 29, 2026',
    readTime: '5 min read',
    category: 'Learning Guide',
    keywords: 'learn tech skills online, free coding courses, structured learning',
  },
  {
    slug:     'skills-to-get-hired-2026',
    title:    'What Skills Will Get You Hired in Tech in 2026',
    excerpt:  'Seven skills with the highest demand right now — and how to learn every single one for free on WarmPath.',
    date:     'May 29, 2026',
    readTime: '6 min read',
    category: 'Career Advice',
    keywords: 'tech skills 2026, get hired in tech, in-demand tech skills Africa',
  },
  {
    slug:     'free-coding-certificate-kenya',
    title:    'How to Get a Verified Coding Certificate in Kenya for KES 999',
    excerpt:  'Certificates from foreign platforms cost thousands. WarmPath issues verified, shareable certificates for KES 999 after you complete a free course.',
    date:     'June 1, 2026',
    readTime: '4 min read',
    category: 'Certificates',
    keywords: 'coding certificate Kenya, affordable tech certificate, verified certificate online',
  },
  {
    slug:     'fullstack-web-dev-roadmap-2026',
    title:    'The Complete Fullstack Web Development Roadmap for 2026',
    excerpt:  'HTML to React to Node.js to deployment. The exact path, the right order, and every resource you need — all free.',
    date:     'June 1, 2026',
    readTime: '8 min read',
    category: 'Roadmap',
    keywords: 'fullstack web development roadmap 2026, learn web dev free, frontend backend roadmap',
  },
  {
    slug:     'python-beginner-guide-africa',
    title:    'Python for Beginners in Africa — Start Here, Go Far',
    excerpt:  'Python is the most employable language on the continent right now. Here is how to start from zero and reach job-ready in 90 days.',
    date:     'June 1, 2026',
    readTime: '6 min read',
    category: 'Python',
    keywords: 'learn Python Africa, Python beginner guide Kenya, free Python course',
  },
  {
    slug:     'remote-tech-jobs-africa-2026',
    title:    'How to Land a Remote Tech Job from Africa in 2026',
    excerpt:  'Remote work is real, the demand is high, and African developers are getting hired. Here is the playbook.',
    date:     'June 2, 2026',
    readTime: '7 min read',
    category: 'Career Advice',
    keywords: 'remote tech jobs Africa, work from home developer Kenya, remote job 2026',
  },
  {
    slug:     'ui-ux-design-free-course',
    title:    'Learn UI/UX Design for Free and Start Getting Clients',
    excerpt:  'Design pays well and the barrier to entry is lower than coding. Here is how to build a portfolio from scratch without spending a cent.',
    date:     'June 2, 2026',
    readTime: '5 min read',
    category: 'Design',
    keywords: 'free UI UX design course, learn design online Africa, UI UX certificate',
  },
  {
    slug:     'cybersecurity-career-africa',
    title:    'Cybersecurity is the Fastest Growing Tech Career in Africa — Here is Why',
    excerpt:  'Every bank, hospital, and government agency needs security. The talent gap is enormous. Here is how to fill it.',
    date:     'June 3, 2026',
    readTime: '6 min read',
    category: 'Cybersecurity',
    keywords: 'cybersecurity career Africa, learn cybersecurity free, ethical hacking Kenya',
  },
  {
    slug:     'data-science-vs-web-dev',
    title:    'Data Science vs Web Development — Which Path Should You Choose?',
    excerpt:  'Two paths, both paying well, both in demand. Here is an honest comparison to help you decide which one fits your strengths.',
    date:     'June 3, 2026',
    readTime: '6 min read',
    category: 'Career Advice',
    keywords: 'data science vs web development, which tech career Africa, data science Kenya',
  },
  {
    slug:     'build-portfolio-no-experience',
    title:    'How to Build a Tech Portfolio When You Have Zero Experience',
    excerpt:  'No job, no clients, no experience — no problem. Here is exactly how to build a portfolio that gets you hired from scratch.',
    date:     'June 4, 2026',
    readTime: '5 min read',
    category: 'Career Advice',
    keywords: 'build tech portfolio no experience, junior developer portfolio, first tech job Africa',
  },
  {
    slug:     'ai-tools-for-learning-2026',
    title:    'The AI Tools Every African Learner Should Be Using in 2026',
    excerpt:  'AI is not replacing you. Learners who use AI tools are replacing those who do not. Here is your toolkit.',
    date:     'June 4, 2026',
    readTime: '5 min read',
    category: 'AI Tools',
    keywords: 'AI tools for learning 2026, ChatGPT for students Africa, learn faster with AI',
  },
  {
    slug:     'freelancing-tech-skills-kenya',
    title:    'How to Start Freelancing with Tech Skills in Kenya',
    excerpt:  'Upwork, Fiverr, and direct clients. How to price yourself, find work, and get paid — step by step for Kenyan developers.',
    date:     'June 5, 2026',
    readTime: '7 min read',
    category: 'Freelancing',
    keywords: 'freelancing Kenya, tech freelancer Africa, Upwork Kenya developer',
  },
  {
    slug:     'cloud-computing-aws-beginners',
    title:    'Cloud Computing for Beginners — Why AWS is the Most Valuable Skill You Can Learn',
    excerpt:  'Every company is moving to the cloud. The developers who understand it are earning three times the average salary. Start here.',
    date:     'June 5, 2026',
    readTime: '6 min read',
    category: 'Cloud',
    keywords: 'learn AWS free, cloud computing beginners Africa, AWS certification Kenya',
  },
  {
    slug:     'consistency-beats-talent-learning',
    title:    'Consistency Beats Talent — How Daily Streaks Will Change Your Learning',
    excerpt:  'The developers who make it are not the smartest ones. They are the ones who show up every day. Here is the science and the system.',
    date:     'June 6, 2026',
    readTime: '4 min read',
    category: 'Mindset',
    keywords: 'learning consistency, daily coding habit, how to stay consistent learning tech',
  },
]

export default function Blog() {
  const featured = POSTS[0]
  const rest     = POSTS.slice(1)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-24">

        {/* Header */}
        <section className="py-16 border-b border-[var(--border)] bg-[var(--bg-raised)]">
          <div className="page-container max-w-5xl animate-fade-up">
            <p className="text-ember-500 text-xs font-semibold tracking-widest uppercase mb-4">Insights</p>
            <h1 className="font-display text-5xl font-700 text-[var(--text-base)] mb-3">Blog</h1>
            <p className="text-ink-400 max-w-xl">
              Learning guides, career roadmaps, and the story behind WarmPath.
              Free tech education for Africa — written by someone who built a platform from a phone.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="page-container max-w-5xl">

            {/* Featured post */}
            <Link to={`/blog/${featured.slug}`}
              className="card-hover flex flex-col sm:flex-row gap-0 mb-10 overflow-hidden group">
              <div className="sm:w-2 flex-shrink-0"
                style={{ background:'linear-gradient(180deg,#F07A1A,#C85528)' }} />
              <div className="p-7 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="badge bg-ember-500/10 border border-ember-500/20 text-ember-400 text-xs">
                    {featured.category}
                  </span>
                  <span className="text-xs text-ink-500 flex items-center gap-1">
                    <Clock size={11} /> {featured.readTime}
                  </span>
                  <span className="badge bg-sand-500/10 border border-sand-500/20 text-sand-400 text-xs">
                    Featured
                  </span>
                </div>
                <h2 className="font-display text-2xl font-700 text-[var(--text-base)] group-hover:text-ember-400 transition-colors leading-snug">
                  {featured.title}
                </h2>
                <p className="text-sm text-ink-400 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                  <span className="text-xs text-ink-500">{featured.date}</span>
                  <span className="text-xs text-ember-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post, i) => (
                <Link key={post.slug} to={`/blog/${post.slug}`}
                  className="card-hover flex flex-col group"
                  style={{ animationDelay:`${i * 40}ms` }}>
                  <div className="h-0.5 w-full rounded-t-xl"
                    style={{ background:'linear-gradient(90deg,#F07A1A,#C85528)' }} />
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="badge bg-ember-500/10 border border-ember-500/20 text-ember-400 text-2xs">
                        {post.category}
                      </span>
                      <span className="text-2xs text-ink-500 flex items-center gap-1">
                        <Clock size={10} /> {post.readTime}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display font-600 text-[var(--text-base)] leading-snug mb-2 group-hover:text-ember-400 transition-colors text-sm">
                        {post.title}
                      </h2>
                      <p className="text-xs text-ink-400 leading-relaxed line-clamp-3">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                      <span className="text-2xs text-ink-500">{post.date}</span>
                      <span className="text-xs text-ember-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight size={11} />
                      </span>
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
