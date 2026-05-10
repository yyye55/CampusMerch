<template>
  <landingNav>
    <div class="auth-layout">
      <div class="auth-card">
        <button type="button" class="auth-close" aria-label="关闭" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>

        <h1 class="auth-title">注册</h1>
        <p class="auth-desc">创建账号，预订校园文创与活动物料</p>

        <el-form
          :model="registerForm"
          label-position="top"
          :rules="registerRules"
          ref="registerRef"
          :hide-required-asterisk="true"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" autocomplete="off">
              <template #prefix>
                <i class="fas fa-user"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="registerForm.phone" placeholder="请输入电话号码" autocomplete="off">
              <template #prefix>
                <i class="fas fa-id-card"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入邮箱" autocomplete="off">
              <template #prefix>
                <i class="fas fa-envelope"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
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

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              placeholder="请再次输入密码"
              type="password"
              show-password
              autocomplete="off"
            >
              <template #prefix>
                <i class="fas fa-lock"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item class="submit-form-item">
            <el-button type="primary" class="register-submit-btn" @click="handleRegister"
              >注册</el-button
            >
          </el-form-item>
        </el-form>

        <div class="auth-footer-text">
          已有账号？<router-link to="/login">立即登录</router-link>
        </div>
      </div>
    </div>
  </landingNav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormItemRule } from 'element-plus'
import landingNav from '@/components/landingNav.vue'
import { useUserStore } from '@/stores/user'
import { register } from '@/api/auth'

const userStore = useUserStore()

const router = useRouter()

const registerForm = ref({
  username: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const registerRules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '请输入8位以上密码', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: FormItemRule, value: string, callback: (error?: Error) => void) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

const registerRef = ref()

const handleRegister = async () => {
  if (!registerRef.value) return
  try {
    await registerRef.value.validate()
    console.log('注册验证通过', registerForm.value)

    // 调用注册接口
    const res = await register({
      name: registerForm.value.username,
      email: registerForm.value.email.trim().toLowerCase(),
      password: registerForm.value.password,
      password_confirmation: registerForm.value.confirmPassword,
      phone: registerForm.value.phone,
    })

    const token = res.data?.data?.token || ''
    const user = res.data?.data?.user || {}

    userStore.setSession({
      email: user.email || registerForm.value.email.trim().toLowerCase(),
      accessToken: token,
      rememberMe: false,
    })

    ElMessage({
      message: '注册成功！正在跳转到首页...',
      type: 'success',
      duration: 2000,
      showClose: true,
    })

    setTimeout(() => {
      router.push('/student')
    }, 2000)
  } catch (error: any) {
    console.log('注册验证失败', error)
    const errorMsg = error?.response?.data?.message || error?.message || '注册失败，请检查输入信息'
    ElMessage({
      message: errorMsg,
      type: 'error',
      duration: 3000,
      showClose: true,
    })
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
  color: var(--sp-text-title, #0f172a);
  margin-bottom: 0.375rem !important;
  padding: 0 !important;
}

:deep(.el-input__wrapper) {
  min-height: 2.75rem;
  padding: 0 0.875rem !important;
  border-radius: 14px !important;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important;
  border: 1px solid rgba(226, 232, 240, 0.95) !important;
  box-shadow: none !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(199, 210, 254, 0.95) !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--first-color) !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.14) !important;
}

.submit-form-item {
  text-align: center;
}

.register-submit-btn {
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

.register-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.38) !important;
}

.register-submit-btn:active {
  transform: scale(0.97);
}
</style>
