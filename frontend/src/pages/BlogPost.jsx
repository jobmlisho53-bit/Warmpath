import { useParams, Link, Navigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { POSTS } from './Blog'
import { ArrowLeft, ArrowRight, Clock, User } from 'lucide-react'

const CONTENT = {
  'why-i-built-warmpath': [
    { type:'lead', text:"I had a problem. I wanted to learn to code. YouTube had everything — but it was chaos. Thousands of videos. No order. No structure. No way to prove I actually learned anything." },
    { type:'text', text:"Paid platforms were too expensive. Free platforms had no certificates. There was nothing in between. So I built WarmPath." },
    { type:'quote', text:"Not from a laptop. From a phone." },
    { type:'text', text:"Using Termux — a terminal emulator for Android — I wrote every line of code on a 6-inch screen. No fancy setup. No office. Just a phone, an internet connection, and a problem to solve." },
    { type:'heading', text:"What WarmPath does" },
    { type:'list', items:['Takes the best YouTube tutorials and organizes them into 20 structured courses','Tracks your progress through every lesson','Awards XP, badges, and streaks to keep you motivated','Issues verified certificates when you complete a course','Provides a public profile you can share with employers'] },
    { type:'heading', text:"Why free?" },
    { type:'text', text:"Because education should not have a paywall. You pay only when you want a certificate (KES 999). Everything else is free. Forever." },
    { type:'heading', text:"What I learned building this" },
    { type:'text', text:"Building something real does not require perfect conditions. It requires starting. The phone was not a limitation — it was a reminder that tools do not build products. People do." },
  ],
  'how-to-learn-tech-skills': [
    { type:'lead', text:"The internet has everything you need to learn to code. But it also has everything you do not need. The hardest part is not learning — it is knowing what to learn next." },
    { type:'heading', text:"1. Follow a structure" },
    { type:'text', text:"Do not jump between random YouTube videos. Pick a structured path. WarmPath organizes 14 modules per course in the exact order you should learn them." },
    { type:'heading', text:"2. Track your progress" },
    { type:'text', text:"You cannot improve what you do not measure. WarmPath tracks every lesson you complete, shows your progress percentage, and awards XP as you go." },
    { type:'heading', text:"3. Stay consistent" },
    { type:'text', text:"A 7-day streak beats a 12-hour cram session. The platform tracks your daily streaks and rewards consistency with badges and XP." },
    { type:'heading', text:"4. Build proof" },
    { type:'text', text:"Learning is invisible. Certificates make it visible. When you complete a course, unlock a verified certificate that employers can check at any time." },
    { type:'quote', text:"Structure beats randomness. Consistency beats intensity. Proof beats claims." },
  ],
  'skills-to-get-hired-2026': [
    { type:'lead', text:"The tech job market changes fast. Here are the seven skills with the highest demand right now — every one has a free course on WarmPath." },
    { type:'heading', text:"1. Fullstack Web Development" },
    { type:'text', text:"Companies need developers who can build complete applications. HTML, CSS, JavaScript, React, Node.js — learn the full stack and you are employable anywhere." },
    { type:'heading', text:"2. Python" },
    { type:'text', text:"Still the most versatile language. Data science, automation, web development, AI — Python does it all." },
    { type:'heading', text:"3. AI and Machine Learning" },
    { type:'text', text:"AI is not replacing developers. Developers who understand AI are replacing those who do not. Learn prompt engineering, ML basics, and AI tools." },
    { type:'heading', text:"4. Cybersecurity" },
    { type:'text', text:"Every company needs security. The demand for cybersecurity professionals keeps growing year on year." },
    { type:'heading', text:"5. Cloud Computing" },
    { type:'text', text:"AWS, Docker, Kubernetes — companies are moving to the cloud and need people who understand it." },
    { type:'heading', text:"6. Data Science" },
    { type:'text', text:"Data is the new oil. Companies pay well for people who can collect, clean, analyze, and present data." },
    { type:'heading', text:"7. DevOps" },
    { type:'text', text:"The bridge between development and operations. CI/CD pipelines, infrastructure as code — high demand, high pay." },
    { type:'quote', text:"All these skills are available as free courses on WarmPath. Start one today. Finish it. Get certified. Get hired." },
  ],
  'free-coding-certificate-kenya': [
    { type:'lead', text:"A Coursera certificate costs $49 a month. A Udemy course costs KES 2,000 on sale. WarmPath issues a verified certificate for KES 999 — after you complete the course for free." },
    { type:'heading', text:"How it works" },
    { type:'list', items:['Enrol in any of 20+ free courses','Complete all lessons at your own pace','Pay KES 999 via M-Pesa or card through Paystack','Get your certificate instantly with a unique verification code'] },
    { type:'heading', text:"What makes it verified?" },
    { type:'text', text:"Every WarmPath certificate has a unique code. Employers can visit warmpath-three.vercel.app/verify/[your-code] and confirm the certificate is real. No fakes. No guessing." },
    { type:'heading', text:"What can you do with it?" },
    { type:'list', items:['Add it to your LinkedIn profile','Share the verification link on your CV','Use it as proof when applying for tech jobs','Display it on your public WarmPath profile'] },
    { type:'quote', text:"Skills are worth nothing if you cannot prove them. Certificates make skills visible." },
  ],
  'fullstack-web-dev-roadmap-2026': [
    { type:'lead', text:"Fullstack development is the most employable tech skill in 2026. Here is the exact path — in the exact order — to go from zero to job-ready." },
    { type:'heading', text:"Phase 1 — The Foundation (Weeks 1–4)" },
    { type:'list', items:['HTML — structure of every webpage','CSS — styling, layouts, responsive design','JavaScript basics — variables, functions, logic','How the internet works — HTTP, DNS, browsers'] },
    { type:'heading', text:"Phase 2 — Frontend (Weeks 5–10)" },
    { type:'list', items:['JavaScript advanced — async, fetch, ES6+','React — components, hooks, state management','CSS frameworks — Tailwind or Bootstrap','Build 3 real projects'] },
    { type:'heading', text:"Phase 3 — Backend (Weeks 11–16)" },
    { type:'list', items:['Node.js and Express — build APIs','Databases — SQL basics, PostgreSQL','Authentication — JWT, sessions','Deploy your first fullstack app'] },
    { type:'heading', text:"Phase 4 — Get hired (Weeks 17–20)" },
    { type:'list', items:['Build a portfolio with 3 projects','Write a developer CV','Apply on LinkedIn, Upwork, and local job boards','Get your WarmPath certificate'] },
    { type:'quote', text:"The path is clear. The only question is whether you start today or next year." },
  ],
  'python-beginner-guide-africa': [
    { type:'lead', text:"Python is the most employable language on the continent right now. It powers data science, automation, web backends, and AI. Here is how to start from zero." },
    { type:'heading', text:"Why Python first?" },
    { type:'list', items:['Reads like English — easier to learn than Java or C++','Used in the highest-paying fields — data science, AI, fintech','Huge job market in Kenya, Nigeria, South Africa, and remote roles','One language opens doors to five different careers'] },
    { type:'heading', text:"Month 1 — The basics" },
    { type:'list', items:['Variables, data types, operators','Functions and logic','Lists, dictionaries, loops','Reading and writing files'] },
    { type:'heading', text:"Month 2 — Real projects" },
    { type:'list', items:['Build a simple calculator','Automate a repetitive task','Scrape data from a website','Build a basic web API with Flask'] },
    { type:'heading', text:"Month 3 — Specialise" },
    { type:'text', text:"Pick one direction: data science with pandas, web development with Django, or automation scripting. All three paths are well-paid and in demand across Africa." },
    { type:'quote', text:"Python is not just a language. It is a key that opens the most doors in tech." },
  ],
  'remote-tech-jobs-africa-2026': [
    { type:'lead', text:"Remote work is not a future promise for Africa — it is happening right now. Developers from Kenya, Nigeria, Ghana, and South Africa are getting hired by European and American companies." },
    { type:'heading', text:"Where to find remote jobs" },
    { type:'list', items:['Upwork — freelance projects, build your rating over time','Toptal — harder to get in but pays 3x more','LinkedIn — direct applications to companies hiring remotely','RemoteOK and We Work Remotely — job boards built for remote roles','Andela — specifically recruits African developers for global companies'] },
    { type:'heading', text:"What they look for" },
    { type:'list', items:['A portfolio with real, working projects','Clear communication in English','Reliability — meeting deadlines and responding quickly','A verified certificate to prove your skills'] },
    { type:'heading', text:"How to prepare" },
    { type:'text', text:"Start with one skill. Get good at it. Build three projects. Get a certificate. Apply to 20 jobs. You will get one. That one changes everything." },
    { type:'quote', text:"The internet does not care where you are from. It cares what you can build." },
  ],
  'ui-ux-design-free-course': [
    { type:'lead', text:"Design is the highest-paid skill that the fewest people pursue in tech. Everyone wants to code. Almost nobody learns design. That gap is your opportunity." },
    { type:'heading', text:"What UI/UX actually means" },
    { type:'text', text:"UI is how a product looks. UX is how it feels to use. A good designer does both — making products that are beautiful and easy to use. Companies pay KES 80,000–200,000 a month for this skill in Nairobi alone." },
    { type:'heading', text:"What you will learn in the WarmPath UI/UX course" },
    { type:'list', items:['Design principles — colour, typography, spacing, hierarchy','Figma — the industry-standard design tool, free to use','User research — understanding what users actually need','Prototyping — building clickable mockups before writing a line of code','Building a design portfolio with real case studies'] },
    { type:'heading', text:"How to get clients" },
    { type:'list', items:['Redesign 3 existing apps and post the work on Behance','Offer one free redesign to a local business for a testimonial','Join Fiverr and Upwork with your portfolio','Post your work on LinkedIn — designers get hired from posts all the time'] },
    { type:'quote', text:"Every app you use was designed by someone. That someone could be you." },
  ],
  'cybersecurity-career-africa': [
    { type:'lead', text:"Banks are being hacked. Government systems are breached. Hospitals lose patient data. And there are not enough security professionals to stop it. In Africa, the talent gap is enormous." },
    { type:'heading', text:"Why cybersecurity in Africa right now?" },
    { type:'list', items:['Mobile money has created millions of new attack targets','African governments are digitising fast — and need protection','The average cybersecurity salary in Kenya is KES 150,000+','Remote cybersecurity jobs are easier to get than any other tech role'] },
    { type:'heading', text:"What you learn in the WarmPath Cybersecurity course" },
    { type:'list', items:['How attacks actually work — phishing, malware, SQL injection','Network security fundamentals','Ethical hacking basics — how to find vulnerabilities legally','Security tools — Wireshark, Metasploit, Nmap','How to get CompTIA Security+ certified'] },
    { type:'heading', text:"Career paths" },
    { type:'list', items:['Security analyst — monitor systems for threats','Penetration tester — get paid to hack companies legally','Security engineer — build systems that are hard to breach','CISO — lead an organisation\'s entire security strategy'] },
    { type:'quote', text:"Every company that uses the internet needs someone to protect it. That person could be you." },
  ],
  'data-science-vs-web-dev': [
    { type:'lead', text:"Two paths, both in demand, both paying well. The question is not which one is better. The question is which one fits you." },
    { type:'heading', text:"Web Development" },
    { type:'list', items:['You build things people can see and use immediately','Faster path to freelancing and first job','Strong local market — every business needs a website','Stack: HTML, CSS, JavaScript, React, Node.js'] },
    { type:'heading', text:"Data Science" },
    { type:'list', items:['You find patterns in data that help companies make decisions','Higher average salary ceiling','More mathematical — you need to be comfortable with numbers','Stack: Python, pandas, SQL, machine learning libraries'] },
    { type:'heading', text:"How to choose" },
    { type:'list', items:['Do you enjoy building visual things? Go web development','Do you enjoy analysis and problem-solving with numbers? Go data science','Do you want freelance income faster? Go web development','Do you want the highest long-term salary? Go data science'] },
    { type:'text', text:"The honest answer: both are good choices. Pick one. Start today. You can always learn the other later." },
    { type:'quote', text:"The worst career decision you can make is spending six months deciding instead of six months learning." },
  ],
  'build-portfolio-no-experience': [
    { type:'lead', text:"Every employer wants experience. Nobody gives you experience without a job. Here is how to break that loop." },
    { type:'heading', text:"The three projects rule" },
    { type:'text', text:"You do not need ten projects. You need three good ones. Each project should solve a real problem, be deployed and accessible online, and have clean, readable code on GitHub." },
    { type:'heading', text:"Project ideas that actually impress employers" },
    { type:'list', items:['A personal finance tracker — shows you understand forms, databases, user accounts','A weather app using a real API — shows you can work with external data','A job board or marketplace — shows you understand complex data relationships','A clone of a popular app — shows you can study and reproduce professional work'] },
    { type:'heading', text:"Where to deploy for free" },
    { type:'list', items:['Frontend: Vercel or Netlify','Backend: Render or Railway','Database: Supabase or PlanetScale','All of these are free for personal projects'] },
    { type:'heading', text:"What to write on your CV" },
    { type:'text', text:"List each project with: what it does, what technology you used, and a link to the live version. That is your experience. It is real. It is verifiable. And it works." },
    { type:'quote', text:"Your portfolio is proof that you can do the job. Build the proof." },
  ],
  'ai-tools-for-learning-2026': [
    { type:'lead', text:"AI will not take your job. A developer who uses AI will. Here are the tools every African learner should be using right now — most of them free." },
    { type:'heading', text:"For learning and understanding code" },
    { type:'list', items:['ChatGPT or Claude — explain any concept, debug any error, generate starter code','GitHub Copilot — writes code suggestions as you type (free for students)','Phind — a search engine built specifically for developers'] },
    { type:'heading', text:"For building faster" },
    { type:'list', items:['v0 by Vercel — generates UI components from a description','Cursor — an IDE with AI built in, understands your entire codebase','Tabnine — AI autocomplete that works offline'] },
    { type:'heading', text:"For staying current" },
    { type:'list', items:['Perplexity AI — ask questions about tech news and get sourced answers','NotebookLM by Google — upload your course materials and ask questions about them','YouTube + AI summary tools — watch less, learn more'] },
    { type:'quote', text:"The skill is not knowing how to use AI tools. The skill is knowing when to use which one." },
  ],
  'freelancing-tech-skills-kenya': [
    { type:'lead', text:"Kenyan developers are earning in dollars while living on shilling costs. Freelancing is the fastest path to financial freedom in tech — if you do it right." },
    { type:'heading', text:"Which skills pay best on freelance platforms" },
    { type:'list', items:['React and Node.js development — KES 5,000–15,000 per day','WordPress development — easier to start, lots of demand','UI/UX design — KES 3,000–10,000 per project','Data analysis — KES 4,000–12,000 per project','Video editing — fastest growing demand on Fiverr'] },
    { type:'heading', text:"How to get your first client" },
    { type:'list', items:['Start on Fiverr with a package priced at $5–$10 to build reviews','Apply to 20 Upwork jobs before expecting a response','Tell everyone you know that you do freelance tech work','Offer one local business a discounted project in exchange for a testimonial'] },
    { type:'heading', text:"How to get paid reliably" },
    { type:'list', items:['Always take 50% payment upfront','Use Paystack, Flutterwave, or Wise for receiving international payments','Never do work without a written scope — even just a WhatsApp message confirming the project'] },
    { type:'quote', text:"Your first freelance client is the hardest. Your second client usually comes from your first." },
  ],
  'cloud-computing-aws-beginners': [
    { type:'lead', text:"Every company you have ever heard of runs on cloud infrastructure. AWS alone powers Netflix, Airbnb, NASA, and thousands of African startups. The developers who understand it get paid accordingly." },
    { type:'heading', text:"What cloud computing actually means" },
    { type:'text', text:"Instead of buying a physical server, you rent computing power from Amazon, Google, or Microsoft. You pay only for what you use. Companies love it because it is cheaper and scales instantly." },
    { type:'heading', text:"Why AWS specifically?" },
    { type:'list', items:['Largest market share — more companies use AWS than any other cloud provider','Most job listings require AWS knowledge','AWS Free Tier lets you learn without spending money','AWS certifications are the highest-paying certs in tech'] },
    { type:'heading', text:"Where to start" },
    { type:'list', items:['Create a free AWS account — 12 months of free tier access','Learn S3 first — storing files is the simplest concept','Then EC2 — running a virtual server','Then Lambda — running code without managing servers','Then go for the AWS Cloud Practitioner certificate'] },
    { type:'quote', text:"Cloud skills are the closest thing to a guaranteed salary increase in tech right now." },
  ],
  'consistency-beats-talent-learning': [
    { type:'lead', text:"The developers who make it are not the smartest ones in the room. They are the ones who show up every single day." },
    { type:'heading', text:"Why streaks work" },
    { type:'text', text:"When you code every day — even for 20 minutes — your brain treats it as a habit. Habits do not require motivation. They just run. That is why streak-based learning works when willpower-based learning fails." },
    { type:'heading', text:"The WarmPath streak system" },
    { type:'list', items:['Complete at least one lesson every day to maintain your streak','Streaks earn bonus XP that pushes you up the leaderboard','Breaking a streak resets your counter but not your progress','Top learners on WarmPath have 30, 60, even 90-day streaks'] },
    { type:'heading', text:"How to build the habit" },
    { type:'list', items:['Pick a fixed time — morning works better than evening for most people','Start with 20 minutes — not 2 hours','Connect it to an existing habit — after breakfast, after gym, after work','Track it publicly — telling others makes you accountable'] },
    { type:'heading', text:"What 90 days of consistency gets you" },
    { type:'list', items:['A completed course with a verified certificate','A portfolio project you built along the way','A streak that proves to employers you are disciplined','An XP count that puts you in the top 10% of the leaderboard'] },
    { type:'quote', text:"Talent gets you started. Consistency gets you there." },
  ],
}

export default function BlogPost() {
  const { slug }  = useParams()
  const post      = POSTS.find(p => p.slug === slug)
  const content   = CONTENT[slug]
  if (!post || !content) return <Navigate to="/blog" replace />

  const idx  = POSTS.findIndex(p => p.slug === slug)
  const prev = POSTS[idx - 1]
  const next = POSTS[idx + 1]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-24">

        {/* Header */}
        <section className="py-14 border-b border-[var(--border)] bg-[var(--bg-raised)]">
          <div className="page-container max-w-3xl animate-fade-up">
            <Link to="/blog" className="btn-ghost text-xs gap-2 mb-6 -ml-1 inline-flex">
              <ArrowLeft size={14} /> All posts
            </Link>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="badge bg-ember-500/10 border border-ember-500/20 text-ember-400 text-xs">
                {post.category}
              </span>
              <span className="text-xs text-ink-500 flex items-center gap-1.5">
                <Clock size={11} /> {post.readTime}
              </span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-700 text-[var(--text-base)] leading-tight mb-5">
              {post.title}
            </h1>
            <p className="text-ink-300 text-base leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-display font-700 flex-shrink-0"
                style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)' }}>J</div>
              <div>
                <p className="text-sm font-medium text-[var(--text-base)]">Job William</p>
                <p className="text-xs text-ink-500">{post.date}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-14">
          <div className="page-container max-w-2xl">
            <div className="space-y-6">
              {content.map((block, i) => {
                if (block.type === 'lead') return (
                  <p key={i} className="text-xl text-ink-200 leading-relaxed font-display font-400">{block.text}</p>
                )
                if (block.type === 'text') return (
                  <p key={i} className="text-base text-ink-400 leading-relaxed">{block.text}</p>
                )
                if (block.type === 'heading') return (
                  <h2 key={i} className="font-display text-2xl font-700 text-[var(--text-base)] pt-4">{block.text}</h2>
                )
                if (block.type === 'quote') return (
                  <blockquote key={i} className="border-l-2 border-ember-500 pl-6 py-2 my-6">
                    <p className="font-display text-xl font-400 italic text-ink-200 leading-relaxed">{block.text}</p>
                  </blockquote>
                )
                if (block.type === 'list') return (
                  <ul key={i} className="space-y-3">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-ink-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-ember-500 flex-shrink-0 mt-2.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )
                return null
              })}
            </div>

            {/* CTA */}
            <div className="mt-14 p-6 rounded-2xl border border-ember-500/20 bg-ember-500/5 text-center">
              <h3 className="font-display text-xl font-700 text-[var(--text-base)] mb-2">
                Ready to start learning?
              </h3>
              <p className="text-ink-400 text-sm mb-4">
                20+ free courses. Verified certificates. XP and streaks to keep you going.
              </p>
              <Link to="/courses" className="btn-primary gap-2">
                Browse free courses <ArrowRight size={14} />
              </Link>
            </div>

            {/* Author */}
            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-700 flex-shrink-0"
                  style={{ background:'linear-gradient(135deg,#F07A1A,#C85528)' }}>J</div>
                <div>
                  <p className="font-medium text-sm text-[var(--text-base)]">Job William</p>
                  <p className="text-xs text-ink-500">
                    Founder, WarmPath ·{' '}
                    <a href="mailto:jobmlisho63@gmail.com" className="text-ember-400 hover:text-ember-300 transition-colors">
                      jobmlisho63@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Prev / Next */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {prev ? (
                <Link to={`/blog/${prev.slug}`} className="card-hover p-4 text-left">
                  <p className="text-2xs text-ink-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <ArrowLeft size={10} /> Previous
                  </p>
                  <p className="text-sm font-medium text-[var(--text-base)] line-clamp-2">{prev.title}</p>
                </Link>
              ) : <div />}
              {next ? (
                <Link to={`/blog/${next.slug}`} className="card-hover p-4 text-right">
                  <p className="text-2xs text-ink-500 uppercase tracking-wide mb-1 flex items-center gap-1 justify-end">
                    Next <ArrowRight size={10} />
                  </p>
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
