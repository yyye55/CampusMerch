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

// 退出登录接口
export function logout() {
  return request.post('/logout')
}

// 获取当前用户信息
export function getCurrentUser() {
  return request.get('/me')
}

// 用户信息类型
export interface UserInfo {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  phone: string
}

// 发送验证码
export const sendCaptcha = (email: string) => {
  return request.post('/captcha', { email })
}

// 重置密码
export const resetPassword = (data: {
  email: string
  captcha: string
  password: string
  password_confirmation: string
}) => {
  return request.post('/reset-password', data)
}
