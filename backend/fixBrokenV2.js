require('dotenv').config()
const axios = require('axios')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

// Each broken entry now has PRIMARY search + FALLBACK keywords
const BROKEN_WITH_FALLBACKS = [
  // Fullstack Web Development
  { course: 'Fullstack Web Development', module: 'State Management', search: 'react state management redux tutorial', fallback: 'react redux context api state tutorial' },
  { course: 'Fullstack Web Development', module: 'Real-World Fullstack Project', search: 'fullstack web development project build', fallback: 'mern stack project tutorial build deploy' },
  
  // Python Programming
  { course: 'Python Programming', module: 'Databases with Python', search: 'python database tutorial sqlite postgresql', fallback: 'python sql tutorial crud' },
  
  // UI/UX Design
  { course: 'UI/UX Design', module: 'Design Principles', search: 'ui ux design principles fundamentals', fallback: 'design principles for beginners' },
  { course: 'UI/UX Design', module: 'Typography', search: 'typography design fundamentals tutorial', fallback: 'typography basics graphic design' },
  { course: 'UI/UX Design', module: 'Mobile Design', search: 'mobile app ui design tutorial figma', fallback: 'mobile design principles app' },
  { course: 'UI/UX Design', module: 'Web App Design', search: 'web application design tutorial figma', fallback: 'web design tutorial ui ux' },
  { course: 'UI/UX Design', module: 'Usability Testing', search: 'usability testing tutorial user testing', fallback: 'user testing methods ui ux' },
  { course: 'UI/UX Design', module: 'Portfolio Creation', search: 'ui ux design portfolio tips build', fallback: 'design portfolio creation tutorial' },
  
  // Graphic Design
  { course: 'Graphic Design', module: 'Logo Design', search: 'logo design tutorial illustrator', fallback: 'logo design process tutorial' },
  { course: 'Graphic Design', module: 'Social Media Design', search: 'social media graphic design tutorial', fallback: 'social media post design photoshop' },
  { course: 'Graphic Design', module: 'Poster Design', search: 'poster design tutorial photoshop', fallback: 'graphic design poster tutorial' },
  { course: 'Graphic Design', module: 'Print Design', search: 'print design tutorial fundamentals', fallback: 'graphic design print basics' },
  { course: 'Graphic Design', module: 'Color Psychology', search: 'color psychology graphic design theory', fallback: 'color theory psychology design' },
  { course: 'Graphic Design', module: 'Packaging Design', search: 'packaging design tutorial illustrator', fallback: 'product packaging design tutorial' },
  { course: 'Graphic Design', module: 'Freelancing for Designers', search: 'freelance graphic design tips beginner', fallback: 'how to freelance designer clients' },
  { course: 'Graphic Design', module: 'Client Communication', search: 'client communication designer freelance', fallback: 'freelance client management tips' },
  { course: 'Graphic Design', module: 'Final Branding Project', search: 'branding project full process tutorial', fallback: 'brand identity design full project' },
  
  // Digital Marketing
  { course: 'Digital Marketing', module: 'Social Media Marketing', search: 'social media marketing strategy 2024', fallback: 'social media marketing tutorial beginner' },
  { course: 'Digital Marketing', module: 'Content Marketing', search: 'content marketing strategy tutorial', fallback: 'content marketing fundamentals beginner' },
  { course: 'Digital Marketing', module: 'Google Ads', search: 'google ads tutorial beginner 2024', fallback: 'google ads complete course' },
  { course: 'Digital Marketing', module: 'Facebook & Instagram Ads', search: 'facebook instagram ads tutorial meta', fallback: 'meta ads tutorial facebook ads' },
  { course: 'Digital Marketing', module: 'Email Marketing', search: 'email marketing tutorial complete', fallback: 'email marketing beginner tutorial' },
  { course: 'Digital Marketing', module: 'Copywriting', search: 'copywriting tutorial marketing beginner', fallback: 'copywriting basics tutorial' },
  { course: 'Digital Marketing', module: 'Analytics & Tracking', search: 'google analytics tutorial marketing', fallback: 'marketing analytics tracking tutorial' },
  { course: 'Digital Marketing', module: 'Funnel Building', search: 'sales funnel tutorial marketing', fallback: 'marketing funnel build tutorial' },
  { course: 'Digital Marketing', module: 'Affiliate Marketing', search: 'affiliate marketing tutorial beginner 2024', fallback: 'how to start affiliate marketing' },
  { course: 'Digital Marketing', module: 'E-commerce Marketing', search: 'ecommerce marketing strategy tutorial', fallback: 'ecommerce marketing tips 2024' },
  { course: 'Digital Marketing', module: 'Marketing Campaign Project', search: 'marketing campaign full tutorial', fallback: 'marketing campaign build project' },
  
  // Cybersecurity Fundamentals
  { course: 'Cybersecurity Fundamentals', module: 'Cybersecurity Basics', search: 'cybersecurity fundamentals tutorial 2024', fallback: 'cybersecurity for beginners course' },
  { course: 'Cybersecurity Fundamentals', module: 'Operating Systems Security', search: 'operating system security tutorial', fallback: 'os security fundamentals cybersecurity' },
  { course: 'Cybersecurity Fundamentals', module: 'Authentication Systems', search: 'authentication systems security tutorial', fallback: 'authentication authorization cybersecurity' },
  { course: 'Cybersecurity Fundamentals', module: 'Vulnerability Assessment', search: 'vulnerability assessment tutorial beginner', fallback: 'how to do vulnerability assessment' },
  { course: 'Cybersecurity Fundamentals', module: 'Malware Analysis', search: 'malware analysis tutorial beginner', fallback: 'malware analysis fundamentals' },
  { course: 'Cybersecurity Fundamentals', module: 'Security Tools', search: 'cybersecurity tools tutorial kali linux', fallback: 'ethical hacking tools tutorial' },
  { course: 'Cybersecurity Fundamentals', module: 'Incident Response', search: 'incident response cybersecurity tutorial', fallback: 'incident response plan tutorial' },
  { course: 'Cybersecurity Fundamentals', module: 'Cloud Security', search: 'cloud security fundamentals tutorial', fallback: 'cloud security basics aws' },
  { course: 'Cybersecurity Fundamentals', module: 'Security Best Practices', search: 'cybersecurity best practices 2024', fallback: 'cybersecurity tips best practices' },
  { course: 'Cybersecurity Fundamentals', module: 'Capstone Security Audit', search: 'security audit tutorial project', fallback: 'cybersecurity capstone project audit' },
  
  // Data Science
  { course: 'Data Science', module: 'Data Cleaning', search: 'data cleaning python pandas tutorial', fallback: 'data cleaning preprocessing tutorial' },
  { course: 'Data Science', module: 'Regression Models', search: 'regression analysis tutorial data science', fallback: 'linear regression tutorial python' },
  { course: 'Data Science', module: 'Model Evaluation', search: 'machine learning model evaluation metrics', fallback: 'ml model evaluation tutorial' },
  { course: 'Data Science', module: 'Real-World Datasets', search: 'data science real world project tutorial', fallback: 'data science project walkthrough' },
  { course: 'Data Science', module: 'Final Data Project', search: 'data science full project end to end', fallback: 'data science portfolio project tutorial' },
  
  // Machine Learning
  { course: 'Machine Learning', module: 'Data Preprocessing', search: 'data preprocessing machine learning', fallback: 'ml data preparation tutorial' },
  { course: 'Machine Learning', module: 'Supervised Learning', search: 'supervised learning tutorial machine learning', fallback: 'supervised learning explained tutorial' },
  { course: 'Machine Learning', module: 'Unsupervised Learning', search: 'unsupervised learning clustering tutorial', fallback: 'unsupervised machine learning tutorial' },
  { course: 'Machine Learning', module: 'Regression', search: 'regression machine learning tutorial python', fallback: 'regression analysis ml tutorial' },
  { course: 'Machine Learning', module: 'Clustering', search: 'clustering algorithms tutorial kmeans', fallback: 'clustering machine learning tutorial' },
  { course: 'Machine Learning', module: 'Model Optimization', search: 'model optimization hyperparameter tuning', fallback: 'hyperparameter tuning tutorial ml' },
  { course: 'Machine Learning', module: 'AI Ethics', search: 'ai ethics machine learning bias fairness', fallback: 'ethical ai tutorial responsible ai' },
  { course: 'Machine Learning', module: 'Final AI Project', search: 'machine learning project end to end', fallback: 'ml full project tutorial build' },
  
  // Mobile App Development
  { course: 'Mobile App Development', module: 'State Management', search: 'react native state management redux', fallback: 'react native context api state tutorial' },
  { course: 'Mobile App Development', module: 'APIs & Networking', search: 'react native api fetch axios tutorial', fallback: 'react native networking api tutorial' },
  { course: 'Mobile App Development', module: 'Local Storage', search: 'react native async storage tutorial', fallback: 'react native local storage tutorial' },
  { course: 'Mobile App Development', module: 'Firebase Integration', search: 'react native firebase tutorial setup', fallback: 'firebase react native integration tutorial' },
  { course: 'Mobile App Development', module: 'Push Notifications', search: 'react native push notifications expo', fallback: 'push notifications react native tutorial' },
  { course: 'Mobile App Development', module: 'Performance Optimization', search: 'react native performance optimization', fallback: 'react native app optimization tutorial' },
  { course: 'Mobile App Development', module: 'Monetization Strategies', search: 'mobile app monetization strategies', fallback: 'app monetization tutorial ads in app' },
  { course: 'Mobile App Development', module: 'Final Mobile App', search: 'react native full app project build', fallback: 'react native complete app tutorial' },
  
  // Cloud Computing
  { course: 'Cloud Computing', module: 'Virtual Machines', search: 'virtual machines tutorial aws ec2 cloud', fallback: 'virtual machines explained cloud computing' },
  { course: 'Cloud Computing', module: 'Storage Systems', search: 'cloud storage tutorial aws s3 explained', fallback: 'cloud storage systems tutorial' },
  { course: 'Cloud Computing', module: 'Serverless Computing', search: 'serverless computing tutorial aws lambda', fallback: 'serverless architecture tutorial' },
  { course: 'Cloud Computing', module: 'Monitoring & Logging', search: 'cloud monitoring logging tutorial aws', fallback: 'aws cloudwatch monitoring tutorial' },
  { course: 'Cloud Computing', module: 'Cloud Security', search: 'cloud security fundamentals aws tutorial', fallback: 'cloud security best practices tutorial' },
  { course: 'Cloud Computing', module: 'Scalability Concepts', search: 'cloud scalability auto scaling tutorial', fallback: 'scalability cloud computing explained' },
  { course: 'Cloud Computing', module: 'Cost Optimization', search: 'cloud cost optimization tutorial aws', fallback: 'reduce cloud costs tutorial tips' },
  { course: 'Cloud Computing', module: 'Cloud Deployment Project', search: 'cloud deployment full project tutorial', fallback: 'deploy app to cloud full tutorial' },
  
  // Software Engineering
  { course: 'Software Engineering', module: 'System Design', search: 'system design interview tutorial', fallback: 'system design fundamentals tutorial' },
  { course: 'Software Engineering', module: 'Clean Code Principles', search: 'clean code principles tutorial', fallback: 'clean code best practices tutorial' },
  { course: 'Software Engineering', module: 'Security Principles', search: 'software security principles fundamentals', fallback: 'secure coding practices tutorial' },
  { course: 'Software Engineering', module: 'Scalability Concepts', search: 'software scalability tutorial system design', fallback: 'scalable software architecture tutorial' },
  { course: 'Software Engineering', module: 'Team Collaboration', search: 'software team collaboration agile tutorial', fallback: 'software development teamwork tutorial' },
  { course: 'Software Engineering', module: 'Enterprise Software Project', search: 'enterprise software development tutorial', fallback: 'enterprise application tutorial build' },
  
  // Game Development
  { course: 'Game Development', module: 'Game Physics', search: 'unity physics tutorial rigidbody game', fallback: 'game physics tutorial unity beginner' },
  { course: 'Game Development', module: 'Game UI', search: 'unity ui tutorial canvas game', fallback: 'game user interface tutorial unity' },
  { course: 'Game Development', module: 'AI for Games', search: 'unity ai navmesh tutorial game', fallback: 'game ai tutorial unity beginner' },
  { course: 'Game Development', module: 'Multiplayer Basics', search: 'unity multiplayer tutorial networking', fallback: 'multiplayer game tutorial unity photon' },
  { course: 'Game Development', module: 'Mobile Optimization', search: 'unity mobile optimization tutorial', fallback: 'optimize unity game mobile tutorial' },
  { course: 'Game Development', module: 'Monetization', search: 'game monetization strategies unity ads', fallback: 'monetize game tutorial ads in app' },
  { course: 'Game Development', module: 'Final Game Project', search: 'unity full game project tutorial build', fallback: 'complete unity game tutorial project' },
  
  // Business & Entrepreneurship
  { course: 'Business & Entrepreneurship', module: 'Entrepreneurial Mindset', search: 'entrepreneurial mindset success habits', fallback: 'how to think like entrepreneur tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Financial Basics', search: 'business finance basics tutorial beginner', fallback: 'financial literacy business tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Sales Fundamentals', search: 'sales fundamentals tutorial techniques', fallback: 'sales training beginner tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Digital Business', search: 'digital business online business tutorial', fallback: 'start online business tutorial 2024' },
  { course: 'Business & Entrepreneurship', module: 'Customer Acquisition', search: 'customer acquisition strategies tutorial', fallback: 'how to get customers business tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Operations Management', search: 'operations management tutorial business', fallback: 'business operations fundamentals tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Leadership Skills', search: 'leadership skills tutorial management', fallback: 'leadership development training tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Pitching Investors', search: 'pitching investors startup fundraising', fallback: 'how to pitch investors tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Scaling Strategies', search: 'business scaling strategies growth tutorial', fallback: 'how to scale business tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Startup Business Plan', search: 'business plan tutorial how to write', fallback: 'startup business plan template tutorial' },
  
  // Stock Market Investing
  { course: 'Stock Market Investing', module: 'Fundamental Analysis', search: 'fundamental analysis stocks tutorial', fallback: 'how to analyze stocks fundamental' },
  { course: 'Stock Market Investing', module: 'Risk Management', search: 'risk management investing tutorial stocks', fallback: 'investment risk management tutorial' },
  { course: 'Stock Market Investing', module: 'Portfolio Building', search: 'investment portfolio building tutorial', fallback: 'how to build stock portfolio tutorial' },
  { course: 'Stock Market Investing', module: 'Value Investing', search: 'value investing tutorial warren buffett', fallback: 'value investing explained tutorial' },
  { course: 'Stock Market Investing', module: 'Trading Psychology', search: 'trading psychology mindset tutorial', fallback: 'trader psychology discipline tutorial' },
  { course: 'Stock Market Investing', module: 'Financial Statements', search: 'financial statements analysis tutorial', fallback: 'how to read financial statements tutorial' },
  { course: 'Stock Market Investing', module: 'Economic Indicators', search: 'economic indicators explained tutorial', fallback: 'economic indicators investing basics' },
  { course: 'Stock Market Investing', module: 'Investment Portfolio Project', search: 'investment portfolio project build tutorial', fallback: 'build stock portfolio full tutorial' },
  
  // Cryptocurrency & Blockchain
  { course: 'Cryptocurrency & Blockchain', module: 'Bitcoin Basics', search: 'bitcoin explained tutorial beginner 2024', fallback: 'bitcoin cryptocurrency tutorial basics' },
  { course: 'Cryptocurrency & Blockchain', module: 'Ethereum Ecosystem', search: 'ethereum explained tutorial dapps', fallback: 'ethereum smart contracts tutorial' },
  { course: 'Cryptocurrency & Blockchain', module: 'Wallets & Security', search: 'crypto wallet security tutorial', fallback: 'cryptocurrency wallet tutorial setup' },
  { course: 'Cryptocurrency & Blockchain', module: 'On-Chain Analysis', search: 'on chain analysis crypto tutorial', fallback: 'blockchain analytics tutorial crypto' },
  { course: 'Cryptocurrency & Blockchain', module: 'Crypto Risk Management', search: 'crypto risk management trading tutorial', fallback: 'cryptocurrency risk management tips' },
  { course: 'Cryptocurrency & Blockchain', module: 'Web3 Applications', search: 'web3 tutorial decentralized applications', fallback: 'web3 development tutorial dapps' },
  { course: 'Cryptocurrency & Blockchain', module: 'Blockchain Careers', search: 'blockchain careers jobs web3 tutorial', fallback: 'how to start blockchain career tutorial' },
  { course: 'Cryptocurrency & Blockchain', module: 'Final Blockchain Project', search: 'blockchain project tutorial build dapp', fallback: 'build blockchain project full tutorial' },
  
  // Video Editing & Content Creation
  { course: 'Video Editing & Content Creation', module: 'Content Creation Fundamentals', search: 'content creation tutorial beginner 2024', fallback: 'how to start content creation tutorial' },
  { course: 'Video Editing & Content Creation', module: 'Storytelling', search: 'storytelling video content creation tutorial', fallback: 'visual storytelling tutorial video' },
  { course: 'Video Editing & Content Creation', module: 'Camera Basics', search: 'camera basics tutorial video content', fallback: 'camera settings video tutorial beginner' },
  { course: 'Video Editing & Content Creation', module: 'Lighting Techniques', search: 'video lighting tutorial content creation', fallback: 'lighting setup tutorial video shoot' },
  { course: 'Video Editing & Content Creation', module: 'Short-Form Content', search: 'short form content tutorial reels tiktok', fallback: 'tiktok reels content creation tutorial' },
  { course: 'Video Editing & Content Creation', module: 'YouTube Growth', search: 'youtube channel growth tutorial 2024', fallback: 'how to grow youtube channel tutorial' },
  { course: 'Video Editing & Content Creation', module: 'TikTok & Reels Strategy', search: 'tiktok reels growth strategy tutorial', fallback: 'short form video strategy tutorial' },
  { course: 'Video Editing & Content Creation', module: 'Thumbnail Design', search: 'youtube thumbnail design tutorial', fallback: 'how to make thumbnails tutorial photoshop' },
  { course: 'Video Editing & Content Creation', module: 'Monetization Strategies', search: 'content creator monetization tutorial', fallback: 'how to monetize content tutorial' },
  { course: 'Video Editing & Content Creation', module: 'Final Content Project', search: 'video content creation full project', fallback: 'complete video project tutorial' },
  
  // SQL & Database Management
  { course: 'SQL & Database Management', module: 'Database Security', search: 'database security tutorial sql best practices', fallback: 'sql injection prevention tutorial security' },
  { course: 'SQL & Database Management', module: 'Performance Optimization', search: 'sql performance optimization tutorial', fallback: 'database query optimization tutorial' },
  { course: 'SQL & Database Management', module: 'Final Database Project', search: 'database design project full tutorial', fallback: 'sql database project build tutorial' },
  
  // DevOps Engineering
  { course: 'DevOps Engineering', module: 'Linux Fundamentals', search: 'linux tutorial beginner command line', fallback: 'linux basics tutorial for beginners' },
  { course: 'DevOps Engineering', module: 'Monitoring Systems', search: 'prometheus grafana monitoring tutorial', fallback: 'devops monitoring tools tutorial' },
  { course: 'DevOps Engineering', module: 'Logging Systems', search: 'elk stack logging tutorial devops', fallback: 'centralized logging tutorial devops' },
  { course: 'DevOps Engineering', module: 'Security Automation', search: 'devsecops security automation tutorial', fallback: 'devops security pipeline tutorial' },
  { course: 'DevOps Engineering', module: 'Scaling Infrastructure', search: 'kubernetes scaling tutorial infrastructure', fallback: 'infrastructure scaling devops tutorial' },
  { course: 'DevOps Engineering', module: 'DevOps Pipeline Project', search: 'devops ci cd pipeline project tutorial', fallback: 'build devops pipeline full tutorial' },
  
  // Freelancing & Remote Work
  { course: 'Freelancing & Remote Work', module: 'Freelancing Fundamentals', search: 'freelancing beginner tutorial 2024', fallback: 'how to start freelancing tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Finding Clients', search: 'find freelance clients tutorial tips', fallback: 'how to get freelance clients tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Portfolio Building', search: 'freelance portfolio build tutorial', fallback: 'create freelance portfolio tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Proposal Writing', search: 'freelance proposal writing win clients', fallback: 'how to write freelance proposal tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Communication Skills', search: 'communication skills freelancer tutorial', fallback: 'client communication freelance tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Time Management', search: 'time management freelancer productivity', fallback: 'productivity tips freelancers tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Contracts & Payments', search: 'freelance contracts payment tutorial', fallback: 'freelance invoicing payment tutorial' },
  { course: 'Freelancing & Remote Work', module: 'LinkedIn Optimization', search: 'linkedin profile optimization freelancer', fallback: 'linkedin tips freelancers tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Remote Productivity', search: 'remote work productivity tips tutorial', fallback: 'work from home productivity tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Scaling Freelance Income', search: 'scale freelance business income tutorial', fallback: 'grow freelance income tips tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Building an Agency', search: 'build freelance agency tutorial scaling', fallback: 'start agency from freelance tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Freelance Business Project', search: 'freelance business full project build', fallback: 'freelance success blueprint tutorial' },
  
  // AI Tools & Prompt Engineering
  { course: 'AI Tools & Prompt Engineering', module: 'AI for Content Creation', search: 'chatgpt content creation tutorial ai', fallback: 'ai writing content tutorial tools' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI for Design', search: 'ai design tools tutorial midjourney 2024', fallback: 'ai image generation design tutorial' },
  { course: 'AI Tools & Prompt Engineering', module: 'Building AI Agents', search: 'build ai agents tutorial langchain', fallback: 'ai agent tutorial autogpt crewai' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI Ethics & Risks', search: 'ai ethics risks tutorial responsible', fallback: 'ethical ai explained tutorial' },
  { course: 'AI Tools & Prompt Engineering', module: 'Monetizing AI Skills', search: 'monetize ai skills tutorial make money', fallback: 'make money with ai tutorial 2024' },
  { course: 'AI Tools & Prompt Engineering', module: 'Final AI Automation Project', search: 'ai automation workflow full project', fallback: 'build ai automation tutorial project' }
]

function extractYoutubeId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function searchYoutube(query) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 5,
        videoEmbeddable: 'true',
        relevanceLanguage: 'en',
        key: YOUTUBE_API_KEY
      }
    })
    return response.data.items || []
  } catch (err) {
    return []
  }
}

async function verifyVideo(videoId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'status,snippet',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    })
    const item = response.data.items?.[0]
    if (!item || item.status.embeddable === false) return null
    return {
      videoId: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channelName: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id}`
    }
  } catch {
    return null
  }
}

async function findBestVideo(item) {
  // Try primary search first
  const results = await searchYoutube(item.search)
  
  // Check each result until we find a verified embeddable one
  for (const result of results) {
    const verified = await verifyVideo(result.id.videoId)
    if (verified) return verified
    await new Promise(r => setTimeout(r, 30))
  }
  
  // If nothing worked, try fallback search
  if (item.fallback) {
    const fallbackResults = await searchYoutube(item.fallback)
    for (const result of fallbackResults) {
      const verified = await verifyVideo(result.id.videoId)
      if (verified) return verified
      await new Promise(r => setTimeout(r, 30))
    }
  }
  
  return null
}

async function fixAll() {
  console.log('🔧 Smart Fix V2 — Primary + Fallback keywords\n')

  let fixed = 0
  let failed = 0
  const total = BROKEN_WITH_FALLBACKS.length

  for (let i = 0; i < BROKEN_WITH_FALLBACKS.length; i++) {
    const item = BROKEN_WITH_FALLBACKS[i]
    process.stdout.write(`[${i + 1}/${total}] ${item.course.substring(0, 25)} — ${item.module.substring(0, 25)}... `)

    const video = await findBestVideo(item)

    if (!video) {
      process.stdout.write('❌ No embeddable video found\n')
      failed++
      continue
    }

    // Find course in DB
    const { data: courseData } = await supabase
      .from('courses')
      .select('id')
      .eq('title', item.course)
      .single()

    if (!courseData) {
      process.stdout.write('❌ Course not in DB\n')
      failed++
      continue
    }

    const { data: moduleData } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseData.id)
      .eq('title', item.module)
      .single()

    if (!moduleData) {
      process.stdout.write('❌ Module not in DB\n')
      failed++
      continue
    }

    const { error } = await supabase
      .from('lessons')
      .update({
        title: video.title,
        youtube_url: video.url,
        youtube_id: video.videoId,
        thumbnail: video.thumbnail,
        channel_name: video.channelName
      })
      .eq('module_id', moduleData.id)

    if (error) {
      process.stdout.write('❌ DB error\n')
      failed++
    } else {
      process.stdout.write(`✅ ${video.title.substring(0, 40)}...\n`)
      fixed++
    }

    await new Promise(r => setTimeout(r, 250))
  }

  console.log('\n========================================')
  console.log('📊 FINAL RESULTS')
  console.log('========================================')
  console.log(`Total: ${total}`)
  console.log(`✅ Fixed: ${fixed}`)
  console.log(`❌ Still broken: ${failed}`)
  console.log(`📈 Fix rate: ${Math.round((fixed / total) * 100)}%\n`)
}

fixAll()
