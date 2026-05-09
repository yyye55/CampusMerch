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

export const sendCaptcha = (email: string) => {
  return request.post('/captcha', { email })
}

export const resetPassword = (data: {
  email: string
  captcha: string
  password: string
  password_confirmation: string
}) => {
  return request.post('/reset-password', data)
}
