import axios from 'axios'
import { supabase } from './supabase'

const BASE_URL = 'https://warmpath-seven.vercel.app/api'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use(async (cfg) => {
  const { data } = await supabase.auth.getSession()
  if (data.session?.access_token) {
    cfg.headers.Authorization = `Bearer ${data.session.access_token}`
  }
  return cfg
})

export default api
