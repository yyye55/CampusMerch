import request from '@/utils/request'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}

export interface LoginResponse {
  code: number
  message: string
  data: {
    token: string
    token_type: string
    user: {
      id: number
      name: string
      email: string
      role: 'admin' | 'user'
      phone?: string
    }
  }
}

export interface RegisterResponse {
  code: number
  message: string
  data: {
    token: string
    token_type: string
    user: {
      id: number
      name: string
      email: string
      role: 'admin' | 'user'
      phone?: string
    }
  }
}

export function login(data: LoginRequest) {
  return request.post<LoginResponse>('/api/login', data)
}

export function register(data: RegisterRequest) {
  return request.post<RegisterResponse>('/api/register', data)
}

export function logout() {
  return request.post('/api/logout')
}

export function getCurrentUser() {
  return request.get('/api/me')
}

export interface UserInfo {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  phone?: string
}

export const sendCaptcha = (email: string) => {
  return request.post('/api/captcha', { email })
}

export const resetPassword = (data: {
  email: string
  captcha: string
  password: string
  password_confirmation: string
}) => {
  return request.post('/api/reset-password', data)
}
