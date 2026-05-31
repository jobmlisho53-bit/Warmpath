import axios from 'axios'
import { supabase } from './supabase'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(async (cfg) => {
  // Retry up to 3 times waiting for session to initialize
  let session = null
  for (let i = 0; i < 3; i++) {
    const { data } = await supabase.auth.getSession()
    if (data.session?.access_token) { session = data.session; break }
    await new Promise(r => setTimeout(r, 300))
  }
  if (session?.access_token) {
    cfg.headers.Authorization = `Bearer ${session.access_token}`
  }
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      // Don't redirect on enrollment check — just reject
      const url = err.config?.url || ''
      if (!url.includes('enrollments') && !url.includes('progress')) {
        supabase.auth.signOut()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
