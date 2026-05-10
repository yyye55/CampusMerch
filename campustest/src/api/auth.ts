import request from '@/utils/request'

export function login(data: { email: string; password: string }) {
  return request.post('/login', data)
}

export function register(data: {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone: string
}) {
  return request.post('/register', data)
}

export function logout() {
  return request.post('/logout')
}

export function getCurrentUser() {
  return request.get('/user')
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
