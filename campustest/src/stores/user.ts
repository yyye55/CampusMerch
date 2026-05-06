import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/** 与登录态相关的 localStorage 键（退出时清除，不包含收藏等业务键） */
const AUTH_STORAGE_KEYS = [
  'campus_login_email',
  'campus_token',
  'campus_refresh_token',
  'bangbang_display_name',
] as const

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(typeof localStorage !== 'undefined' ? localStorage.getItem('campus_token') ?? '' : '')
  const email = ref<string>(typeof localStorage !== 'undefined' ? localStorage.getItem('campus_login_email') ?? '' : '')

  const displayName = computed(() => {
    const e = email.value?.trim()
    if (!e) return ''
    return e.split('@')[0] ?? e
  })

  const isLoggedIn = computed(() => Boolean(token.value || email.value))

  /** 从 localStorage 同步（进入用户端、登录成功后调用） */
  function hydrateFromStorage() {
    token.value = localStorage.getItem('campus_token') ?? ''
    email.value = localStorage.getItem('campus_login_email') ?? ''
  }

  /** 登录成功后写入（可与登录页联动） */
  function setSession(payload: { email?: string; accessToken?: string }) {
    if (payload.email != null) {
      email.value = payload.email
      localStorage.setItem('campus_login_email', payload.email)
    }
    if (payload.accessToken != null) {
      token.value = payload.accessToken
      localStorage.setItem('campus_token', payload.accessToken)
    }
  }

  /**
   * 退出登录：清空 token / 用户信息相关存储，清空 sessionStorage；
   * 不删除收藏等业务数据（如 bangbang_favorite_ids）。
   */
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

  return {
    token,
    email,
    displayName,
    isLoggedIn,
    hydrateFromStorage,
    setSession,
    logout,
  }
})
