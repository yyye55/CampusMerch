import request from '@/utils/request'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  phone: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    phone: string
    role: string
  }
}

// 登录
export const login = (data: LoginData) => {
  return request.post<AuthResponse>('/auth/login', data)
}

// 注册
export const register = (data: RegisterData) => {
  return request.post<AuthResponse>('/auth/register', data)
}

// 登出
export const logout = () => {
  return request.post('/auth/logout')
}

// 发送验证码
export const sendCaptcha = (email: string) => {
  return request.post('/auth/captcha', { email })
}

// 重置密码
export const resetPassword = (data: {
  email: string
  captcha: string
  password: string
  password_confirmation: string
}) => {
  return request.post('/auth/reset-password', data)
}
