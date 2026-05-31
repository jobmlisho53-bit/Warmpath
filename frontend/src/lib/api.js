import axios from 'axios'
import { supabase } from './supabase'

// Hardcoded for now — works everywhere
const BASE_URL = 'https://warmpath-seven.vercel.app/api'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use(async (cfg) => {
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

export default api
