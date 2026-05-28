const express = require('express')
const axios = require('axios')
const router = express.Router()

function extractYoutubeId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

router.post('/fetch-video', async (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'YouTube URL is required' })
  }

  const videoId = extractYoutubeId(url)

  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' })
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY
      }
    })

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' })
    }

    const video = response.data.items[0]

    res.json({
      youtube_id: videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url,
      duration: video.contentDetails.duration,
      channel_name: video.snippet.channelTitle,
      url: url
    })
  } catch (error) {
    console.error('YouTube API error:', error.message)
    res.status(500).json({ error: 'Failed to fetch video data' })
  }
})

module.exports = router
