require('dotenv').config()
const axios = require('axios')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

// Only the 52 that failed — with completely different search strategies
const REMAINING = [
  // Stock Market Investing (8)
  { course: 'Stock Market Investing', module: 'Fundamental Analysis', search: 'how to analyze stocks fundamental analysis beginners' },
  { course: 'Stock Market Investing', module: 'Risk Management', search: 'risk management in stock market explained' },
  { course: 'Stock Market Investing', module: 'Portfolio Building', search: 'how to build investment portfolio beginners' },
  { course: 'Stock Market Investing', module: 'Value Investing', search: 'value investing explained warren buffett strategy' },
  { course: 'Stock Market Investing', module: 'Trading Psychology', search: 'trading psychology tips for beginners' },
  { course: 'Stock Market Investing', module: 'Financial Statements', search: 'how to read financial statements investing' },
  { course: 'Stock Market Investing', module: 'Economic Indicators', search: 'economic indicators explained for beginners' },
  { course: 'Stock Market Investing', module: 'Investment Portfolio Project', search: 'build investment portfolio step by step' },
  
  // Cryptocurrency (7)
  { course: 'Cryptocurrency & Blockchain', module: 'Ethereum Ecosystem', search: 'what is ethereum explained beginner guide' },
  { course: 'Cryptocurrency & Blockchain', module: 'Wallets & Security', search: 'crypto wallet security tips best practices' },
  { course: 'Cryptocurrency & Blockchain', module: 'On-Chain Analysis', search: 'blockchain on chain data analysis explained' },
  { course: 'Cryptocurrency & Blockchain', module: 'Crypto Risk Management', search: 'how to manage risk in cryptocurrency trading' },
  { course: 'Cryptocurrency & Blockchain', module: 'Web3 Applications', search: 'what are web3 dapps explained examples' },
  { course: 'Cryptocurrency & Blockchain', module: 'Blockchain Careers', search: 'blockchain web3 career jobs how to start' },
  { course: 'Cryptocurrency & Blockchain', module: 'Final Blockchain Project', search: 'build your first dapp blockchain project' },
  
  // Video Editing (10)
  { course: 'Video Editing & Content Creation', module: 'Content Creation Fundamentals', search: 'content creation for beginners complete guide' },
  { course: 'Video Editing & Content Creation', module: 'Storytelling', search: 'storytelling in video how to tell stories' },
  { course: 'Video Editing & Content Creation', module: 'Camera Basics', search: 'camera basics for video beginners settings' },
  { course: 'Video Editing & Content Creation', module: 'Lighting Techniques', search: 'lighting for video beginners setup tips' },
  { course: 'Video Editing & Content Creation', module: 'Short-Form Content', search: 'how to make short videos tiktok reels guide' },
  { course: 'Video Editing & Content Creation', module: 'YouTube Growth', search: 'how to grow on youtube 2024 tips strategy' },
  { course: 'Video Editing & Content Creation', module: 'TikTok & Reels Strategy', search: 'tiktok strategy growth tips for beginners' },
  { course: 'Video Editing & Content Creation', module: 'Thumbnail Design', search: 'how to make youtube thumbnails photoshop canva' },
  { course: 'Video Editing & Content Creation', module: 'Monetization Strategies', search: 'how to make money as content creator youtube' },
  { course: 'Video Editing & Content Creation', module: 'Final Content Project', search: 'video editing full project walkthrough' },
  
  // SQL (3)
  { course: 'SQL & Database Management', module: 'Database Security', search: 'database security sql injection prevention explained' },
  { course: 'SQL & Database Management', module: 'Performance Optimization', search: 'sql query optimization tips faster queries' },
  { course: 'SQL & Database Management', module: 'Final Database Project', search: 'build database project from scratch sql' },
  
  // DevOps (6)
  { course: 'DevOps Engineering', module: 'Linux Fundamentals', search: 'linux for beginners complete tutorial 2024' },
  { course: 'DevOps Engineering', module: 'Monitoring Systems', search: 'prometheus grafana monitoring explained beginners' },
  { course: 'DevOps Engineering', module: 'Logging Systems', search: 'elk stack logging explained elasticsearch tutorial' },
  { course: 'DevOps Engineering', module: 'Security Automation', search: 'what is devsecops security automation explained' },
  { course: 'DevOps Engineering', module: 'Scaling Infrastructure', search: 'how to scale infrastructure kubernetes explained' },
  { course: 'DevOps Engineering', module: 'DevOps Pipeline Project', search: 'build ci cd pipeline project jenkins gitlab' },
  
  // Freelancing (12)
  { course: 'Freelancing & Remote Work', module: 'Freelancing Fundamentals', search: 'how to start freelancing beginner guide 2024' },
  { course: 'Freelancing & Remote Work', module: 'Finding Clients', search: 'how to find freelance clients fast tips' },
  { course: 'Freelancing & Remote Work', module: 'Portfolio Building', search: 'how to build freelance portfolio examples' },
  { course: 'Freelancing & Remote Work', module: 'Proposal Writing', search: 'how to write winning freelance proposals' },
  { course: 'Freelancing & Remote Work', module: 'Communication Skills', search: 'freelancer client communication tips skills' },
  { course: 'Freelancing & Remote Work', module: 'Time Management', search: 'time management tips for freelancers productivity' },
  { course: 'Freelancing & Remote Work', module: 'Contracts & Payments', search: 'freelance contracts payment terms what to include' },
  { course: 'Freelancing & Remote Work', module: 'LinkedIn Optimization', search: 'how to optimize linkedin profile freelancer' },
  { course: 'Freelancing & Remote Work', module: 'Remote Productivity', search: 'remote work productivity tips stay focused' },
  { course: 'Freelancing & Remote Work', module: 'Scaling Freelance Income', search: 'how to scale freelance business earn more' },
  { course: 'Freelancing & Remote Work', module: 'Building an Agency', search: 'how to build freelance agency from scratch' },
  { course: 'Freelancing & Remote Work', module: 'Freelance Business Project', search: 'freelance business blueprint start to finish' },
  
  // AI Tools (6)
  { course: 'AI Tools & Prompt Engineering', module: 'AI for Content Creation', search: 'chatgpt for content creation write blog posts' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI for Design', search: 'ai design tools midjourney canva tutorial 2024' },
  { course: 'AI Tools & Prompt Engineering', module: 'Building AI Agents', search: 'how to build ai agent automation tutorial' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI Ethics & Risks', search: 'ethics of artificial intelligence explained risks' },
  { course: 'AI Tools & Prompt Engineering', module: 'Monetizing AI Skills', search: 'how to make money with ai skills 2024' },
  { course: 'AI Tools & Prompt Engineering', module: 'Final AI Automation Project', search: 'build ai automation workflow project tutorial' },
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
        part: 'snippet', q: query, type: 'video', maxResults: 10,
        videoEmbeddable: 'true', relevanceLanguage: 'en', key: YOUTUBE_API_KEY
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
      params: { part: 'status,snippet', id: videoId, key: YOUTUBE_API_KEY }
    })
    const item = response.data.items?.[0]
    if (!item || item.status.embeddable === false) return null
    return {
      videoId: item.id, title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channelName: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id}`
    }
  } catch { return null }
}

async function fixAll() {
  console.log('🔧 Fixing remaining 52 broken videos...\n')
  let fixed = 0, failed = 0

  for (let i = 0; i < REMAINING.length; i++) {
    const item = REMAINING[i]
    process.stdout.write(`[${i + 1}/52] ${item.course.substring(0, 28)} — ${item.module.substring(0, 28)}... `)

    const results = await searchYoutube(item.search)
    let found = null

    for (const result of results) {
      const verified = await verifyVideo(result.id.videoId)
      if (verified) { found = verified; break }
      await new Promise(r => setTimeout(r, 100))
    }

    if (!found) {
      process.stdout.write('❌\n')
      failed++
      continue
    }

    const { data: courseData } = await supabase.from('courses').select('id').eq('title', item.course).single()
    if (!courseData) { process.stdout.write('❌ course\n'); failed++; continue }

    const { data: moduleData } = await supabase.from('modules').select('id').eq('course_id', courseData.id).eq('title', item.module).single()
    if (!moduleData) { process.stdout.write('❌ module\n'); failed++; continue }

    await supabase.from('lessons').update({
      title: found.title, youtube_url: found.url, youtube_id: found.videoId,
      thumbnail: found.thumbnail, channel_name: found.channelName
    }).eq('module_id', moduleData.id)

    process.stdout.write(`✅ ${found.title.substring(0, 40)}...\n`)
    fixed++
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n✅ Fixed: ${fixed}  ❌ Failed: ${failed}`)
}

fixAll()
