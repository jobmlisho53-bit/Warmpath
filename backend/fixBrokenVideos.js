require('dotenv').config()
const axios = require('axios')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

// All broken videos with search queries for replacement
const BROKEN_LIST = [
  // Fullstack Web Development
  { course: 'Fullstack Web Development', module: 'State Management', search: 'react state management redux tutorial 2024' },
  { course: 'Fullstack Web Development', module: 'Real-World Fullstack Project', search: 'fullstack web development project mern stack tutorial' },
  
  // Python Programming
  { course: 'Python Programming', module: 'Databases with Python', search: 'python databases sqlite postgresql tutorial' },
  
  // UI/UX Design
  { course: 'UI/UX Design', module: 'Design Principles', search: 'ui ux design principles fundamentals tutorial' },
  { course: 'UI/UX Design', module: 'Typography', search: 'typography design ui ux fundamentals tutorial' },
  { course: 'UI/UX Design', module: 'Mobile Design', search: 'mobile app ui design figma tutorial' },
  { course: 'UI/UX Design', module: 'Web App Design', search: 'web application ui design figma tutorial' },
  { course: 'UI/UX Design', module: 'Usability Testing', search: 'usability testing user testing ui ux tutorial' },
  { course: 'UI/UX Design', module: 'Portfolio Creation', search: 'ui ux design portfolio creation tips' },
  
  // Graphic Design
  { course: 'Graphic Design', module: 'Logo Design', search: 'logo design tutorial illustrator photoshop' },
  { course: 'Graphic Design', module: 'Social Media Design', search: 'social media graphic design tutorial' },
  { course: 'Graphic Design', module: 'Poster Design', search: 'poster design tutorial graphic design' },
  { course: 'Graphic Design', module: 'Print Design', search: 'print design fundamentals tutorial' },
  { course: 'Graphic Design', module: 'Color Psychology', search: 'color psychology graphic design theory' },
  { course: 'Graphic Design', module: 'Packaging Design', search: 'packaging design tutorial product design' },
  { course: 'Graphic Design', module: 'Freelancing for Designers', search: 'freelance graphic design tips clients' },
  { course: 'Graphic Design', module: 'Client Communication', search: 'client communication freelance designer tips' },
  { course: 'Graphic Design', module: 'Final Branding Project', search: 'branding project full process tutorial' },
  
  // Digital Marketing
  { course: 'Digital Marketing', module: 'Social Media Marketing', search: 'social media marketing strategy tutorial 2024' },
  { course: 'Digital Marketing', module: 'Content Marketing', search: 'content marketing strategy tutorial fundamentals' },
  { course: 'Digital Marketing', module: 'Google Ads', search: 'google ads tutorial beginners 2024' },
  { course: 'Digital Marketing', module: 'Facebook & Instagram Ads', search: 'facebook instagram ads tutorial meta ads' },
  { course: 'Digital Marketing', module: 'Email Marketing', search: 'email marketing tutorial beginners complete' },
  { course: 'Digital Marketing', module: 'Copywriting', search: 'copywriting tutorial marketing fundamentals' },
  { course: 'Digital Marketing', module: 'Analytics & Tracking', search: 'google analytics marketing tracking tutorial' },
  { course: 'Digital Marketing', module: 'Funnel Building', search: 'sales funnel marketing funnel tutorial' },
  { course: 'Digital Marketing', module: 'Affiliate Marketing', search: 'affiliate marketing tutorial beginners 2024' },
  { course: 'Digital Marketing', module: 'E-commerce Marketing', search: 'ecommerce marketing strategy tutorial' },
  { course: 'Digital Marketing', module: 'Marketing Campaign Project', search: 'marketing campaign full project tutorial' },
  
  // Cybersecurity Fundamentals
  { course: 'Cybersecurity Fundamentals', module: 'Cybersecurity Basics', search: 'cybersecurity basics fundamentals tutorial 2024' },
  { course: 'Cybersecurity Fundamentals', module: 'Operating Systems Security', search: 'operating system security fundamentals tutorial' },
  { course: 'Cybersecurity Fundamentals', module: 'Authentication Systems', search: 'authentication systems security tutorial' },
  { course: 'Cybersecurity Fundamentals', module: 'Vulnerability Assessment', search: 'vulnerability assessment cybersecurity tutorial' },
  { course: 'Cybersecurity Fundamentals', module: 'Malware Analysis', search: 'malware analysis tutorial cybersecurity' },
  { course: 'Cybersecurity Fundamentals', module: 'Security Tools', search: 'cybersecurity tools tutorial ethical hacking' },
  { course: 'Cybersecurity Fundamentals', module: 'Incident Response', search: 'incident response cybersecurity tutorial' },
  { course: 'Cybersecurity Fundamentals', module: 'Cloud Security', search: 'cloud security fundamentals tutorial' },
  { course: 'Cybersecurity Fundamentals', module: 'Security Best Practices', search: 'cybersecurity best practices tutorial 2024' },
  { course: 'Cybersecurity Fundamentals', module: 'Capstone Security Audit', search: 'security audit tutorial cybersecurity project' },
  
  // Data Science
  { course: 'Data Science', module: 'Data Cleaning', search: 'data cleaning python pandas tutorial' },
  { course: 'Data Science', module: 'Regression Models', search: 'regression models data science tutorial' },
  { course: 'Data Science', module: 'Model Evaluation', search: 'machine learning model evaluation metrics tutorial' },
  { course: 'Data Science', module: 'Real-World Datasets', search: 'data science real world project tutorial' },
  { course: 'Data Science', module: 'Final Data Project', search: 'data science full project tutorial end to end' },
  
  // Machine Learning
  { course: 'Machine Learning', module: 'Data Preprocessing', search: 'data preprocessing machine learning tutorial' },
  { course: 'Machine Learning', module: 'Supervised Learning', search: 'supervised learning machine learning tutorial' },
  { course: 'Machine Learning', module: 'Unsupervised Learning', search: 'unsupervised learning machine clustering tutorial' },
  { course: 'Machine Learning', module: 'Regression', search: 'regression analysis machine learning tutorial' },
  { course: 'Machine Learning', module: 'Clustering', search: 'clustering algorithms machine learning tutorial kmeans' },
  { course: 'Machine Learning', module: 'Model Optimization', search: 'machine learning model optimization hyperparameter tuning' },
  { course: 'Machine Learning', module: 'AI Ethics', search: 'ai ethics machine learning bias fairness tutorial' },
  { course: 'Machine Learning', module: 'Final AI Project', search: 'machine learning project end to end tutorial' },
  
  // Mobile App Development
  { course: 'Mobile App Development', module: 'State Management', search: 'react native state management redux context tutorial' },
  { course: 'Mobile App Development', module: 'APIs & Networking', search: 'react native api networking fetch axios tutorial' },
  { course: 'Mobile App Development', module: 'Local Storage', search: 'react native local storage async storage tutorial' },
  { course: 'Mobile App Development', module: 'Firebase Integration', search: 'react native firebase integration tutorial' },
  { course: 'Mobile App Development', module: 'Push Notifications', search: 'react native push notifications tutorial expo' },
  { course: 'Mobile App Development', module: 'Performance Optimization', search: 'react native performance optimization tutorial' },
  { course: 'Mobile App Development', module: 'Monetization Strategies', search: 'mobile app monetization strategies tutorial' },
  { course: 'Mobile App Development', module: 'Final Mobile App', search: 'react native full app project tutorial build' },
  
  // Cloud Computing
  { course: 'Cloud Computing', module: 'Virtual Machines', search: 'virtual machines cloud computing tutorial aws ec2' },
  { course: 'Cloud Computing', module: 'Storage Systems', search: 'cloud storage systems tutorial aws s3' },
  { course: 'Cloud Computing', module: 'Serverless Computing', search: 'serverless computing tutorial aws lambda' },
  { course: 'Cloud Computing', module: 'Monitoring & Logging', search: 'cloud monitoring logging tutorial aws cloudwatch' },
  { course: 'Cloud Computing', module: 'Cloud Security', search: 'cloud security fundamentals tutorial aws' },
  { course: 'Cloud Computing', module: 'Scalability Concepts', search: 'cloud scalability concepts tutorial auto scaling' },
  { course: 'Cloud Computing', module: 'Cost Optimization', search: 'cloud cost optimization tutorial aws' },
  { course: 'Cloud Computing', module: 'Cloud Deployment Project', search: 'cloud deployment full project tutorial aws' },
  
  // Software Engineering
  { course: 'Software Engineering', module: 'System Design', search: 'system design interview tutorial fundamentals' },
  { course: 'Software Engineering', module: 'Clean Code Principles', search: 'clean code principles tutorial software engineering' },
  { course: 'Software Engineering', module: 'Security Principles', search: 'software security principles tutorial fundamentals' },
  { course: 'Software Engineering', module: 'Scalability Concepts', search: 'software scalability concepts tutorial system design' },
  { course: 'Software Engineering', module: 'Team Collaboration', search: 'software team collaboration agile tutorial' },
  { course: 'Software Engineering', module: 'Enterprise Software Project', search: 'enterprise software project full tutorial' },
  
  // Game Development
  { course: 'Game Development', module: 'Game Physics', search: 'unity game physics tutorial rigidbody' },
  { course: 'Game Development', module: 'Game UI', search: 'unity ui tutorial game user interface' },
  { course: 'Game Development', module: 'AI for Games', search: 'unity ai game development tutorial navmesh' },
  { course: 'Game Development', module: 'Multiplayer Basics', search: 'unity multiplayer tutorial networking basics' },
  { course: 'Game Development', module: 'Mobile Optimization', search: 'unity mobile game optimization tutorial' },
  { course: 'Game Development', module: 'Monetization', search: 'game monetization strategies unity mobile ads' },
  { course: 'Game Development', module: 'Final Game Project', search: 'unity game full project tutorial build complete' },
  
  // Business & Entrepreneurship
  { course: 'Business & Entrepreneurship', module: 'Entrepreneurial Mindset', search: 'entrepreneurial mindset tips success habits' },
  { course: 'Business & Entrepreneurship', module: 'Financial Basics', search: 'business finance basics fundamentals tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Sales Fundamentals', search: 'sales fundamentals tutorial techniques beginners' },
  { course: 'Business & Entrepreneurship', module: 'Digital Business', search: 'digital business online business tutorial 2024' },
  { course: 'Business & Entrepreneurship', module: 'Customer Acquisition', search: 'customer acquisition strategies tutorial marketing' },
  { course: 'Business & Entrepreneurship', module: 'Operations Management', search: 'operations management business tutorial fundamentals' },
  { course: 'Business & Entrepreneurship', module: 'Leadership Skills', search: 'leadership skills tutorial management fundamentals' },
  { course: 'Business & Entrepreneurship', module: 'Pitching Investors', search: 'pitching investors startup fundraising tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Scaling Strategies', search: 'business scaling strategies growth tutorial' },
  { course: 'Business & Entrepreneurship', module: 'Startup Business Plan', search: 'business plan tutorial startup how to write' },
  
  // Stock Market Investing
  { course: 'Stock Market Investing', module: 'Fundamental Analysis', search: 'fundamental analysis stock market tutorial' },
  { course: 'Stock Market Investing', module: 'Risk Management', search: 'risk management investing stock market tutorial' },
  { course: 'Stock Market Investing', module: 'Portfolio Building', search: 'investment portfolio building tutorial diversification' },
  { course: 'Stock Market Investing', module: 'Value Investing', search: 'value investing tutorial warren buffett strategy' },
  { course: 'Stock Market Investing', module: 'Trading Psychology', search: 'trading psychology mindset investing tutorial' },
  { course: 'Stock Market Investing', module: 'Financial Statements', search: 'financial statements analysis investing tutorial' },
  { course: 'Stock Market Investing', module: 'Economic Indicators', search: 'economic indicators investing tutorial fundamentals' },
  { course: 'Stock Market Investing', module: 'Investment Portfolio Project', search: 'investment portfolio project tutorial build' },
  
  // Cryptocurrency & Blockchain
  { course: 'Cryptocurrency & Blockchain', module: 'Bitcoin Basics', search: 'bitcoin basics tutorial cryptocurrency explained' },
  { course: 'Cryptocurrency & Blockchain', module: 'Ethereum Ecosystem', search: 'ethereum ecosystem tutorial dapps explained' },
  { course: 'Cryptocurrency & Blockchain', module: 'Wallets & Security', search: 'crypto wallets security tutorial best practices' },
  { course: 'Cryptocurrency & Blockchain', module: 'On-Chain Analysis', search: 'on chain analysis blockchain cryptocurrency tutorial' },
  { course: 'Cryptocurrency & Blockchain', module: 'Crypto Risk Management', search: 'cryptocurrency risk management trading tutorial' },
  { course: 'Cryptocurrency & Blockchain', module: 'Web3 Applications', search: 'web3 applications tutorial decentralized dapps' },
  { course: 'Cryptocurrency & Blockchain', module: 'Blockchain Careers', search: 'blockchain careers jobs web3 tutorial' },
  { course: 'Cryptocurrency & Blockchain', module: 'Final Blockchain Project', search: 'blockchain project tutorial build dapp' },
  
  // Video Editing & Content Creation
  { course: 'Video Editing & Content Creation', module: 'Content Creation Fundamentals', search: 'content creation fundamentals tutorial tips 2024' },
  { course: 'Video Editing & Content Creation', module: 'Storytelling', search: 'storytelling video content creation tutorial' },
  { course: 'Video Editing & Content Creation', module: 'Camera Basics', search: 'camera basics video tutorial content creation' },
  { course: 'Video Editing & Content Creation', module: 'Lighting Techniques', search: 'video lighting techniques tutorial content creation' },
  { course: 'Video Editing & Content Creation', module: 'Short-Form Content', search: 'short form content tutorial tiktok reels creation' },
  { course: 'Video Editing & Content Creation', module: 'YouTube Growth', search: 'youtube channel growth strategy tutorial 2024' },
  { course: 'Video Editing & Content Creation', module: 'TikTok & Reels Strategy', search: 'tiktok reels content strategy tutorial growth' },
  { course: 'Video Editing & Content Creation', module: 'Thumbnail Design', search: 'youtube thumbnail design tutorial photoshop' },
  { course: 'Video Editing & Content Creation', module: 'Monetization Strategies', search: 'content creator monetization strategies tutorial' },
  { course: 'Video Editing & Content Creation', module: 'Final Content Project', search: 'video content creation full project tutorial' },
  
  // SQL & Database Management
  { course: 'SQL & Database Management', module: 'Database Security', search: 'database security sql tutorial best practices' },
  { course: 'SQL & Database Management', module: 'Performance Optimization', search: 'sql database performance optimization tutorial' },
  { course: 'SQL & Database Management', module: 'Final Database Project', search: 'database project full tutorial sql design' },
  
  // DevOps Engineering
  { course: 'DevOps Engineering', module: 'Linux Fundamentals', search: 'linux fundamentals tutorial beginners command line' },
  { course: 'DevOps Engineering', module: 'Monitoring Systems', search: 'devops monitoring systems tutorial prometheus grafana' },
  { course: 'DevOps Engineering', module: 'Logging Systems', search: 'devops logging systems tutorial elk stack' },
  { course: 'DevOps Engineering', module: 'Security Automation', search: 'devops security automation tutorial devsecops' },
  { course: 'DevOps Engineering', module: 'Scaling Infrastructure', search: 'scaling infrastructure devops tutorial kubernetes' },
  { course: 'DevOps Engineering', module: 'DevOps Pipeline Project', search: 'devops ci cd pipeline full project tutorial' },
  
  // Freelancing & Remote Work
  { course: 'Freelancing & Remote Work', module: 'Freelancing Fundamentals', search: 'freelancing fundamentals tutorial beginners 2024' },
  { course: 'Freelancing & Remote Work', module: 'Finding Clients', search: 'finding freelance clients tips strategies tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Portfolio Building', search: 'freelance portfolio building tutorial tips' },
  { course: 'Freelancing & Remote Work', module: 'Proposal Writing', search: 'freelance proposal writing tutorial win clients' },
  { course: 'Freelancing & Remote Work', module: 'Communication Skills', search: 'communication skills freelancer client management' },
  { course: 'Freelancing & Remote Work', module: 'Time Management', search: 'time management tips freelancers productivity' },
  { course: 'Freelancing & Remote Work', module: 'Contracts & Payments', search: 'freelance contracts payments tutorial invoicing' },
  { course: 'Freelancing & Remote Work', module: 'LinkedIn Optimization', search: 'linkedin optimization freelancers profile tips' },
  { course: 'Freelancing & Remote Work', module: 'Remote Productivity', search: 'remote work productivity tips freelancers tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Scaling Freelance Income', search: 'scaling freelance business income growth tutorial' },
  { course: 'Freelancing & Remote Work', module: 'Building an Agency', search: 'building freelance agency tutorial scaling' },
  { course: 'Freelancing & Remote Work', module: 'Freelance Business Project', search: 'freelance business full project tutorial build' },
  
  // AI Tools & Prompt Engineering
  { course: 'AI Tools & Prompt Engineering', module: 'AI for Content Creation', search: 'ai content creation tutorial chatgpt writing' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI for Design', search: 'ai design tools tutorial midjourney dalle' },
  { course: 'AI Tools & Prompt Engineering', module: 'Building AI Agents', search: 'building ai agents tutorial autogpt langchain' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI Ethics & Risks', search: 'ai ethics risks bias tutorial responsible ai' },
  { course: 'AI Tools & Prompt Engineering', module: 'Monetizing AI Skills', search: 'monetizing ai skills tutorial make money ai' },
  { course: 'AI Tools & Prompt Engineering', module: 'Final AI Automation Project', search: 'ai automation full project tutorial workflow' }
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
        maxResults: 3,
        videoEmbeddable: 'true',
        videoDuration: 'medium',
        relevanceLanguage: 'en',
        key: YOUTUBE_API_KEY
      }
    })

    if (response.data.items.length === 0) return null

    // Return the first result
    const video = response.data.items[0]
    return {
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
      channelName: video.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`
    }
  } catch (err) {
    return null
  }
}

async function verifyVideo(videoId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'status',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    })
    const item = response.data.items?.[0]
    return item && item.status.embeddable !== false
  } catch {
    return false
  }
}

async function fixAll() {
  console.log('🔧 Starting auto-fix for 144 broken videos...\n')

  let fixed = 0
  let failed = 0
  let total = BROKEN_LIST.length

  for (let i = 0; i < BROKEN_LIST.length; i++) {
    const item = BROKEN_LIST[i]
    process.stdout.write(`[${i + 1}/${total}] Searching: ${item.course} — ${item.module}... `)

    // Search for replacement
    const result = await searchYoutube(item.search)

    if (!result) {
      process.stdout.write('❌ No results found\n')
      failed++
      continue
    }

    // Verify it's embeddable
    const valid = await verifyVideo(result.videoId)
    if (!valid) {
      process.stdout.write('❌ Found but not embeddable\n')
      failed++
      continue
    }

    // Find the lesson in database
    const { data: courseData } = await supabase
      .from('courses')
      .select('id')
      .eq('title', item.course)
      .single()

    if (!courseData) {
      process.stdout.write('❌ Course not found in DB\n')
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
      process.stdout.write('❌ Module not found in DB\n')
      failed++
      continue
    }

    // Update the lesson
    const { error } = await supabase
      .from('lessons')
      .update({
        title: result.title,
        youtube_url: result.url,
        youtube_id: result.videoId,
        thumbnail: result.thumbnail,
        channel_name: result.channelName
      })
      .eq('module_id', moduleData.id)

    if (error) {
      process.stdout.write('❌ DB update failed\n')
      failed++
    } else {
      process.stdout.write(`✅ Fixed → ${result.title.substring(0, 50)}...\n`)
      fixed++
    }

    // Delay to respect API quota
    await new Promise(r => setTimeout(r, 200))
  }

  console.log('\n========================================')
  console.log('📊 FIX SUMMARY')
  console.log('========================================')
  console.log(`Total broken: ${total}`)
  console.log(`✅ Fixed: ${fixed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Fix rate: ${Math.round((fixed / total) * 100)}%\n`)

  if (failed > 0) {
    console.log('Some videos could not be auto-fixed. Use the admin panel to manually add URLs for those.\n')
  }
}

fixAll()
