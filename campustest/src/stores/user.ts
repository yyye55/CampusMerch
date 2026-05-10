import { defineStore } from 'pinia'
import { logout } from '@/api/auth'

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
    async logout() {
      try {
        await logout()
      } catch {
        // ignore API error
      }
      this.clearSession()
    },
    updateFromStorage() {
      const sessionToken = sessionStorage.getItem('campus_session_token')
      if (sessionToken) {
        this.accessToken = sessionToken
        this.rememberMe = false
        return
      }

      const localToken = localStorage.getItem('campus_token')
      const expireTime = localStorage.getItem('campus_token_expire')
      const email = localStorage.getItem('campus_login_email')

      if (localToken && expireTime && Date.now() < Number(expireTime)) {
        this.accessToken = localToken
        this.email = email || ''
        this.rememberMe = true
      }
    },
  },
})
