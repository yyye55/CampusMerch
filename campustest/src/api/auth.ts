import request from '@/utils/request'

// 登录接口
export function login(data: { email: string; password: string }) {
  return request.post('/login', data)
}

// 注册接口
export function register(data: {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone: string
}) {
  return request.post('/register', data)
}

// 登出接口
export function logout() {
  return request.post('/logout')
}

// 获取当前用户信息
export function getCurrentUser() {
  return request.get('/me')
}
