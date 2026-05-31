import axios from 'axios'
import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use(async (cfg) => {
  // Wait up to 2s for session — Vercel cold starts need the extra patience
  let token = null
  for (let i = 0; i < 6; i++) {
    const { data } = await supabase.auth.getSession()
    if (data.session?.access_token) { token = data.session.access_token; break }
    await new Promise(r => setTimeout(r, 350))
  }
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Endpoints that are allowed to fail silently (no redirect to login)
const SILENT_FAIL = [
  'enrollments', 'gamification', 'progress',
  'certificates', 'community', 'profiles'
]

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      const url = err.config?.url || ''
      const isSilent = SILENT_FAIL.some(e => url.includes(e))
      if (!isSilent) {
        supabase.auth.signOut()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
