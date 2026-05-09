<template>
  <landingNav>
    <div class="auth-layout">
      <div class="auth-card">
        <button type="button" class="auth-close" aria-label="关闭" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>
        <h1 class="auth-title">登录</h1>
        <p class="auth-desc">使用邮箱登录，进入校园文创预订</p>

        <el-form
          :model="loginForm"
          label-position="top"
          :rules="rules"
          ref="loginRef"
          :hide-required-asterisk="true"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="loginForm.email" placeholder="请输入邮箱" autocomplete="off">
              <template #prefix>
                <i class="fas fa-envelope"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              type="password"
              show-password
              autocomplete="off"
            >
              <template #prefix>
                <i class="fas fa-lock"></i>
              </template>
            </el-input>
          </el-form-item>

          <div class="remember-row">
            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
          </div>

          <el-form-item>
            <el-button
              type="primary"
              class="login-submit-btn"
              @click="handleLogin"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-footer-text">
          暂无账号？
          <router-link to="/register">注册账号</router-link>
        </div>
      </div>
    </div>
  </landingNav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import landingNav from '@/components/landingNav.vue'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const loginRef = ref()
const loading = ref(false)

const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false,
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不少于6位', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  if (!loginRef.value) return
  try {
    await loginRef.value.validate()
    loading.value = true

    const res = await login({
      email: loginForm.value.email.trim(),
      password: loginForm.value.password,
    })

    userStore.setSession({
      email: loginForm.value.email.trim(),
      accessToken: res.data?.token || 'token_' + Date.now(),
      rememberMe: loginForm.value.rememberMe,
    })

    const emailPrefix = (loginForm.value.email || '').trim().split('@')[0].toLowerCase()
    if (emailPrefix === 'admin') {
      router.push('/admin')
    } else {
      router.push('/student')
    }

    ElMessage.success('登录成功！')
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  router.push('/')
}
</script>

<style scoped>
@import '@/styles/authPage.css';

:deep(.el-form-item) {
  margin-bottom: 1.125rem;
}

:deep(.el-form-item__label) {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px !important;
  padding: 0 !important;
  line-height: 1.5;
}

:deep(.el-input__wrapper) {
  min-height: 2.75rem;
  border-radius: 12px !important;
  background: #f8fafc !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #6366f1 !important;
  background: #fff !important;
}

.remember-row {
  margin-bottom: 1.25rem;
}

.login-submit-btn {
  width: 100%;
  height: 2.875rem;
  border-radius: 14px !important;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #8b5cf6 100%) !important;
  border: none !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
  color: #fff !important;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.32) !important;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease !important;
}

.login-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.38) !important;
}

.login-submit-btn:active {
  transform: scale(0.97);
}
</style>
