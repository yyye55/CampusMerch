import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    accessToken: '',
    rememberMe: false,
  }),
  actions: {
    setSession(data: { email: string; accessToken: string; rememberMe: boolean }) {
      this.email = data.email
      this.accessToken = data.accessToken
      this.rememberMe = data.rememberMe

      if (data.rememberMe) {
        localStorage.setItem('campus_token', data.accessToken)
        localStorage.setItem('campus_login_email', data.email)
        localStorage.setItem('campus_token_expire', String(Date.now() + 30 * 24 * 60 * 60 * 1000))
      } else {
        sessionStorage.setItem('campus_session_token', data.accessToken)
      }
    },
    clearSession() {
      this.email = ''
      this.accessToken = ''
      this.rememberMe = false

      localStorage.removeItem('campus_token')
      localStorage.removeItem('campus_login_email')
      localStorage.removeItem('campus_token_expire')
      sessionStorage.removeItem('campus_session_token')
    },
  },
})
