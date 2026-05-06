<template>
  <landingNav>
    <div class="auth-layout">
      <div class="auth-card">
        <button type="button" class="auth-close" aria-label="关闭" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>

        <p class="auth-eyebrow">CampusMerch</p>
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

          <div class="remember-forgot-row">
            <el-checkbox class="remember-check">记住我</el-checkbox>
            <a class="forgot-link" @click="openResetDialog">忘记密码?</a>
          </div>

          <!-- 忘记密码弹窗 -->
          <el-dialog
            v-model="showResetDialog"
            width="440px"
            align-center
            class="reset-dialog"
            :close-on-click-modal="false"
          >
            <!-- 头部引导文案 -->
            <div class="reset-header-tip">
              <h2>重置密码</h2>
            </div>

            <div class="reset-content">
              <el-form
                :model="resetForm"
                label-position="top"
                :rules="resetRules"
                ref="resetRef"
                :hide-required-asterisk="true"
              >
                <el-form-item label="邮箱" prop="email">
                  <div class="input-with-button">
                    <el-input
                      v-model="resetForm.email"
                      placeholder="请输入注册时的邮箱"
                      autocomplete="off"
                      class="email-input"
                    >
                      <template #prefix>
                        <i class="fas fa-envelope"></i>
                      </template>
                    </el-input>
                    <el-button
                      class="reset-captcha-btn"
                      type="primary"
                      @click="sendResetCaptcha"
                      :disabled="sendingCaptcha || captchaCountdown > 0 || !resetForm.email"
                    >
                      {{
                        captchaCountdown > 0
                          ? `${captchaCountdown}s`
                          : sendingCaptcha
                            ? '...'
                            : '发送验证码'
                      }}
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item label="验证码" prop="captcha">
                  <el-input
                    v-model="resetForm.captcha"
                    placeholder="请输入邮箱收到的验证码"
                    autocomplete="off"
                  >
                    <template #prefix>
                      <i class="fas fa-key"></i>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="password">
                  <el-input
                    v-model="resetForm.password"
                    placeholder="请输入至少6位新密码"
                    type="password"
                    show-password
                    autocomplete="off"
                  >
                    <template #prefix>
                      <i class="fas fa-lock"></i>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item label="确认新密码" prop="password_confirmation">
                  <el-input
                    v-model="resetForm.password_confirmation"
                    placeholder="请再次确认新密码"
                    type="password"
                    show-password
                    autocomplete="off"
                  >
                    <template #prefix>
                      <i class="fas fa-lock"></i>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>

            <template #footer>
              <div class="dialog-footer">
                <el-button @click="showResetDialog = false" class="reset-cancel-btn"
                  >取消</el-button
                >
                <el-button type="primary" @click="handleReset" class="reset-confirm-btn"
                  >确认重置</el-button
                >
              </div>
            </template>
          </el-dialog>

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
<<<<<<< HEAD
import { useUserStore } from '@/stores/user'
=======
import { login, type LoginData } from '@/api/auth'
>>>>>>> d1a52d1b38fcccf95101b8e451f71b4ac1d5d2a1

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref<LoginData>({
  email: '',
  password: '',
})
const rules = ref({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '请输入6位以上密码', trigger: 'blur' },
  ],
})

const loginRef = ref()
const loading = ref(false)

const handleLogin = async () => {
  if (!loginRef.value) return
  try {
    await loginRef.value.validate()
    console.log('登录验证通过', loginForm.value)
<<<<<<< HEAD
    const emailTrim = loginForm.value.email.trim()
    const accessToken = `campus_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
    userStore.setSession({ email: emailTrim, accessToken })
    // 登录成功，跳转到学生端界面
    router.push('/student')
  } catch (error) {
    console.log('登录验证失败', error)
=======

    loading.value = true

    // 尝试调用登录API，失败则使用模拟数据
    let response
    try {
      response = await login(loginForm.value)
    } catch (apiError) {
      console.log('API调用失败，使用模拟数据登录', apiError)
      // 模拟登录成功的响应数据
      response = {
        token: 'mock-token-' + Date.now(),
        user: {
          id: 1,
          username: '测试用户',
          email: loginForm.value.email,
          phone: '13800138000',
          role: 'student',
        },
      }
    }

    // 保存token到本地存储
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))

    // 显示登录成功提示
    ElMessage({
      message: '登录成功！',
      type: 'success',
      duration: 2000,
      showClose: true,
    })

    // 跳转到学生端界面
    setTimeout(() => {
      router.push('/student')
    }, 1000)
  } catch (error: any) {
    console.log('登录失败', error)

    // 显示登录失败提示
    ElMessage({
      message: error.response?.data?.message || '登录失败，请检查输入信息',
      type: 'error',
      duration: 3000,
      showClose: true,
    })
  } finally {
    loading.value = false
>>>>>>> d1a52d1b38fcccf95101b8e451f71b4ac1d5d2a1
  }
}
// 处理右上角关闭按钮
const handleClose = () => {
  // 关闭弹窗
  showResetDialog.value = false
  // 跳转到 introPage 界面
  router.push('/')
}

// 忘记密码相关
const showResetDialog = ref(false)
const resetForm = ref({
  email: '',
  captcha: '',
  password: '',
  password_confirmation: '',
})

// 验证密码一致性
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== resetForm.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const resetRules = ref({
  email: [{ type: 'email', message: '请输入有效的邮箱格式', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [
    { min: 6, message: '请输入至少6位新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (resetForm.value.password_confirmation) {
          resetRef.value?.validateField('password_confirmation')
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  password_confirmation: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
})

const resetRef = ref()
const sendingCaptcha = ref(false)
const captchaCountdown = ref(0)

const openResetDialog = () => {
  showResetDialog.value = true
}

const sendResetCaptcha = async () => {
  if (!resetForm.value.email) return
  try {
    await resetRef.value.validateField('email')
    sendingCaptcha.value = true
    console.log('发送验证码到:', resetForm.value.email)
    captchaCountdown.value = 60
    const timer = setInterval(() => {
      captchaCountdown.value--
      if (captchaCountdown.value <= 0) {
        clearInterval(timer)
        sendingCaptcha.value = false
      }
    }, 1000)
  } catch (error) {
    console.log('邮箱格式错误', error)
  }
}

const handleReset = async () => {
  if (!resetRef.value) return
  try {
    await resetRef.value.validate()
    console.log('重置密码验证通过', resetForm.value)

    // 显示重置密码成功提示
    ElMessage({
      message: '密码重置成功！请使用新密码登录',
      type: 'success',
      duration: 3000,
      showClose: true,
    })

    showResetDialog.value = false
    resetForm.value = { email: '', captcha: '', password: '', password_confirmation: '' }
  } catch (error) {
    console.log('重置密码验证失败', error)

    // 显示重置密码失败提示
    ElMessage({
      message: '重置密码失败，请检查输入信息',
      type: 'error',
      duration: 3000,
      showClose: true,
    })
  }
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

:deep(.el-input__prefix) {
  color: var(--sp-text-muted);
}

.remember-forgot-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  margin: 0.25rem 0 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

:deep(.remember-check.el-checkbox) {
  --el-checkbox-text-color: var(--sp-text-muted);
  font-weight: 500;
}

.forgot-link {
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
  color: var(--first-color);
}
.forgot-link:hover {
  color: var(--second-color);
  text-decoration: underline;
}

.login-submit-btn {
  height: 2.875rem;
  width: 100%;
  border: none !important;
  border-radius: 14px !important;
  font-size: 0.9375rem !important;
  font-weight: 700 !important;
  color: #fff !important;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #8b5cf6 100%) !important;
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

/* 重置密码弹窗 */
:deep(.reset-dialog.el-dialog) {
  border-radius: 16px !important;
  overflow: hidden;
  border: 1px solid rgba(99, 102, 241, 0.12);
  box-shadow: 0 24px 60px -12px rgba(79, 70, 229, 0.22) !important;
}

.reset-header-tip {
  text-align: center;
  margin-bottom: 1rem;
}
.reset-header-tip h2 {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 45%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: stretch;
}
.input-with-button .el-input {
  flex: 7;
}
.input-with-button .el-button {
  flex: 3;
  min-height: 2.75rem;
  border-radius: 14px !important;
  padding: 0 0.25rem !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  border: none !important;
  color: #fff !important;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%) !important;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.28) !important;
  transition: transform 0.2s ease !important;
}
.input-with-button .el-button:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}
.input-with-button .el-button:active {
  transform: scale(0.97);
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
}
.dialog-footer .el-button {
  min-height: 2.75rem;
  padding: 0 1.5rem;
  border-radius: 14px !important;
  font-size: 0.9375rem;
  font-weight: 700;
}

.reset-cancel-btn {
  border: 2px solid rgba(199, 210, 254, 0.95) !important;
  color: var(--first-color) !important;
  background: #fff !important;
}
.reset-cancel-btn:hover {
  background: var(--sp-primary-soft, #eef2ff) !important;
  transform: translateY(-1px);
}
.reset-cancel-btn:active {
  transform: scale(0.97);
}

.reset-confirm-btn {
  border: none !important;
  color: #fff !important;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #8b5cf6 100%) !important;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.28) !important;
}
.reset-confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(99, 102, 241, 0.35) !important;
}
.reset-confirm-btn:active {
  transform: scale(0.97);
}
</style>
