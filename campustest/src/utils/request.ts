import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campus_token')
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
  (res) => res.data,
  (err) => {
    const status = err.response?.status
    const message = err.response?.data?.message || '请求失败'

    if (status === 401) {
      localStorage.removeItem('campus_token')
      localStorage.removeItem('campus_login_email')
      ElMessage.error('登录已过期，请重新登录')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    } else if (status === 403) {
      ElMessage.error('您没有权限访问此资源')
    } else if (status === 500) {
      ElMessage.error('服务器内部错误，请稍后重试')
    } else {
      ElMessage.error(message)
    }
    return Promise.reject(err)
  },
)

export default request
