import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

/** 退出登录时，要删除的四个东西，as const表示只读，不能改删加 */
const AUTH_STORAGE_KEYS = [
  'campus_login_email',
  'campus_token',
  'campus_refresh_token',
  'bangbang_display_name',
] as const

const ADMIN = {
  email: 'admin@example.com',    // 管理员账号
  password: 'Admin123456'         // 管理员密码
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(typeof localStorage !== 'undefined' ? localStorage.getItem('campus_token') ?? '' : '')
  //浏览器有没有本地存储？有就去拿token；拿到token就用token；没拿到给空字符串；浏览器不支持也给空字符串。同下
  const email = ref<string>(typeof localStorage !== 'undefined' ? localStorage.getItem('campus_login_email') ?? '' : '')

  const displayName = computed(() => {
    const e = email.value?.trim()
    if (!e) return ''

    return e.split('@')[0] ?? e
  })

  const isLoggedIn = computed(() => Boolean(token.value || email.value))

  /** 从 localStorage 同步（进入用户端、登录成功后调用） */
  function updateFromStorage() {
    token.value = localStorage.getItem('campus_token') ?? ''
    email.value = localStorage.getItem('campus_login_email') ?? ''
  }

  /** 登录成功后写入（可与登录页联动） */
  function setSession(payload: { email?: string; accessToken?: string }) {
    if (payload.email != null) {
      email.value = payload.email
      localStorage.setItem('campus_login_email', payload.email)
    }
    //campus_login_email给存的数据起个名字,payload.email是要存的内容,同下

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

function adminLogin(email: string, password: string) {
  // 这里是你写死的管理员账号密码
  const ADMIN_EMAIL = 'admin@test.com'
  const ADMIN_PWD = '123456'

  // 判断账号密码对不对
  if (email === ADMIN_EMAIL && password === ADMIN_PWD) {
    // 登录成功，写入假token
    setSession({
      email: email,
      accessToken: 'FAKE_ADMIN_TOKEN',
    })

    // ✅ 直接跳转到管理员页面
    router.push('/admin')
    return true
  }

  // 账号密码错误
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
