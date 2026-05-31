import axios from 'axios'
import { supabase } from './supabase'

const API_URL = 'https://warmpath-seven.vercel.app/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(async (config) => {
  // Try admin token first
  const adminToken = localStorage.getItem('wp_admin_token')
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
    return config
  }

  // Try Supabase student session
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

export default api
