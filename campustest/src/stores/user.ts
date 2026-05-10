import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

const AUTH_STORAGE_KEYS = [
  'campus_login_email',
  'campus_token',
  'campus_refresh_token',
  'bangbang_display_name',
] as const

const ADMIN = {
  email: 'admin@example.com',
  password: 'Admin123456',
}

const SESSION_TOKEN_KEY = 'campus_session_token'
const SESSION_EMAIL_KEY = 'campus_session_email'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(
    typeof sessionStorage !== 'undefined'
      ? (sessionStorage.getItem(SESSION_TOKEN_KEY) ?? localStorage.getItem('campus_token') ?? '')
      : (localStorage.getItem('campus_token') ?? ''),
  )
  const email = ref<string>(
    typeof sessionStorage !== 'undefined'
      ? (sessionStorage.getItem(SESSION_EMAIL_KEY) ??
          localStorage.getItem('campus_login_email') ??
          '')
      : (localStorage.getItem('campus_login_email') ?? ''),
  )

  const displayName = computed(() => {
    const e = email.value?.trim()
    if (!e) return ''
    return e.split('@')[0] ?? e
  })

  const isLoggedIn = computed(() => Boolean(token.value || email.value))

  function updateFromStorage() {
    token.value =
      sessionStorage.getItem(SESSION_TOKEN_KEY) ?? localStorage.getItem('campus_token') ?? ''
    email.value =
      sessionStorage.getItem(SESSION_EMAIL_KEY) ?? localStorage.getItem('campus_login_email') ?? ''
  }

  function setSession(payload: { email?: string; accessToken?: string; rememberMe?: boolean }) {
    const { rememberMe = false } = payload

    if (payload.email != null) {
      email.value = payload.email
      if (rememberMe) {
        localStorage.setItem('campus_login_email', payload.email)
        sessionStorage.removeItem(SESSION_EMAIL_KEY)
      } else {
        sessionStorage.setItem(SESSION_EMAIL_KEY, payload.email)
        localStorage.removeItem('campus_login_email')
      }
    }

    if (payload.accessToken != null) {
      token.value = payload.accessToken
      if (rememberMe) {
        const expireTime = Date.now() + 24 * 60 * 60 * 1000
        localStorage.setItem('campus_token', payload.accessToken)
        localStorage.setItem('campus_token_expire', String(expireTime))
        sessionStorage.removeItem(SESSION_TOKEN_KEY)
      } else {
        sessionStorage.setItem(SESSION_TOKEN_KEY, payload.accessToken)
        localStorage.removeItem('campus_token')
        localStorage.removeItem('campus_token_expire')
      }
    }
  }

  function logout() {
    AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
    try {
      sessionStorage.clear()
    } catch {
      /* ignore */
    }
    token.value = ''
    email.value = ''
  }

  function adminLogin(email: string, password: string) {
    const ADMIN_EMAIL = 'admin@test.com'
    const ADMIN_PWD = '123456'

    if (email === ADMIN_EMAIL && password === ADMIN_PWD) {
      setSession({
        email: email,
        accessToken: 'FAKE_ADMIN_TOKEN',
      })
      router.push('/admin')
      return true
    }
    return false
  }

  return {
    token,
    email,
    displayName,
    isLoggedIn,
    ADMIN,
    updateFromStorage,
    setSession,
    logout,
    adminLogin,
  }
})
