import axios from 'axios'
import { ElMessage } from 'element-plus'

function getToken(): string | null {
  const sessionToken = sessionStorage.getItem('campus_session_token')
  if (sessionToken) return sessionToken

  const localToken = localStorage.getItem('campus_token')
  if (!localToken) return null

  const expireTime = localStorage.getItem('campus_token_expire')
  if (expireTime && Date.now() > Number(expireTime)) {
    localStorage.removeItem('campus_token')
    localStorage.removeItem('campus_token_expire')
    localStorage.removeItem('campus_login_email')
    return null
  }

  return localToken
}

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => Promise.reject(err),
)

request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('campus_token')
      localStorage.removeItem('campus_token_expire')
      localStorage.removeItem('campus_login_email')
      sessionStorage.clear()
      ElMessage.error('登录已过期，请重新登录')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export default request
