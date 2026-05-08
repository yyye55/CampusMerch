import axios from 'axios'
import { ElMessage } from 'element-plus'
const request = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // 后端基础地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：自动携带 Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campus_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => Promise.reject(err),
)


// 响应拦截器：统一处理返回
request.interceptors.response.use(
  //拿到后端返回的数据
  (res) => res.data,
  (err) => {
    // 401 未授权：Token 过期
    if (err.response?.status === 401) {
      localStorage.removeItem('campus_token')
      localStorage.removeItem('campus_login_email')
      ElMessage.error('登录已过期，请重新登录')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)
export default request
