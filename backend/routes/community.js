const express = require('express')
const router = express.Router()
const supabaseAdmin = require('../supabaseAdmin')

// Get discussions for a course
router.get('/courses/:courseId/discussions', async (req, res) => {
  const { courseId } = req.params

  const { data, error } = await supabaseAdmin
    .from('discussions')
    .select('*, replies:replies(count)')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  // Fetch user names separately
  const enriched = await Promise.all(data.map(async (disc) => {
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(disc.user_id)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', disc.user_id)
      .single()
    return {
      ...disc,
      user_name: profile?.full_name || userData?.user?.email || 'Anonymous'
    }
  }))

  res.json(enriched)
})

// Get single discussion with replies
router.get('/discussions/:id', async (req, res) => {
  const { id } = req.params

  const { data: discussion, error } = await supabaseAdmin
    .from('discussions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', discussion.user_id)
    .single()

  const { data: replies } = await supabaseAdmin
    .from('replies')
    .select('*')
    .eq('discussion_id', id)
    .order('created_at', { ascending: true })

  // Enrich replies with user names
  const enrichedReplies = await Promise.all(replies.map(async (reply) => {
    const { data: replyProfile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', reply.user_id)
      .single()
    return {
      ...reply,
      user_name: replyProfile?.full_name || 'Anonymous'
    }
  }))

  res.json({
    ...discussion,
    user_name: profile?.full_name || 'Anonymous',
    replies: enrichedReplies
  })
})

// Create discussion
router.post('/courses/:courseId/discussions', async (req, res) => {
  const { courseId } = req.params
  const userId = req.user.id
  const { title, content } = req.body

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' })
  }

  const { data, error } = await supabaseAdmin
    .from('discussions')
    .insert({ course_id: courseId, user_id: userId, title, content })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Create reply
router.post('/discussions/:id/replies', async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const { content } = req.body

  if (!content) {
    return res.status(400).json({ error: 'Content required' })
  }

  const { data, error } = await supabaseAdmin
    .from('replies')
    .insert({ discussion_id: id, user_id: userId, content })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
