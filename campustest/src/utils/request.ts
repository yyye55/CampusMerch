import axios from 'axios'

const request = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // 后端基础地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应拦截器（统一处理返回）
request.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err),
)

export default request
