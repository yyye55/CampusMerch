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
  baseURL: '/',
  timeout: 15000,
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
  (err) => {
    ElMessage.error('请求发送失败')
    return Promise.reject(err)
  },
)

request.interceptors.response.use(
  (response) => {
    const data = response.data
    
    if (response.config.responseType === 'blob') {
      return data
    }
    
    if (data && typeof data === 'object') {
      if (data.code !== undefined) {
        if (data.code === 0 || data.code === 200) {
          return data.data
        } else {
          ElMessage.error(data.message || '请求失败')
          return Promise.reject(data)
        }
      }
    }
    return data
  },
  (error) => {
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    } else if (error.response?.status === 403) {
      ElMessage.error('没有权限访问')
    } else if (error.response?.status === 404) {
      ElMessage.error('接口不存在')
    } else if (error.response?.status >= 500) {
      ElMessage.error('服务器错误，请稍后重试')
    } else {
      ElMessage.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  },
)

export default request