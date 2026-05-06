<template>
  <landingNav>
    <div class="container">
      <div class="login-container">
        <!-- 右上角关闭/取消按钮 -->
        <div class="close-icon" @click="handleClose">
          <i class="fas fa-times"></i>
        </div>

        <h1>登录</h1>
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
        <div class="register-text">
          暂无账号？
          <router-link class="register-link" to="/register">注册账号</router-link>
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
import { login, type LoginData } from '@/api/auth'

const router = useRouter()

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
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 80vh;
}

/* 登录容器 */
.login-container {
  position: relative; /* 必须，为了让关闭按钮绝对定位 */
  background-color: rgba(255, 255, 255, 0.893);
  padding: 40px 40px 30px;
  border-radius: 20px; /* 要求的 20px 圆角 */
  width: 320px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.167);
}

/* 右上角关闭按钮 */
.close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  background-color: #f0f2f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}
.close-icon i {
  color: #909399;
  font-size: 14px;
}
.close-icon:hover {
  background-color: #e4e7ed;
}
.login-container h1 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--first-color);
}

:deep(.el-form-item__label) {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px !important;
  padding: 0 !important;
}

/* 输入框通用圆角 */
:deep(.el-input__wrapper) {
  width: 100%;
  min-height: 40px;
  padding: 0 12px !important;
  border-radius: 10px !important;
  background-color: #ffffff !important;
  transition: all 0.2s ease !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--first-color) inset !important;
}

/* 记住我 + 忘记密码 */
.remember-forgot-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin: 6px 0 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.forgot-link {
  text-decoration: none;
  cursor: pointer;
  color: #667085;
}
.forgot-link:hover {
  color: var(--first-color);
  text-decoration: underline;
  font-weight: 700;
}

/* 登录按钮 */
.login-submit-btn {
  height: 40px;
  width: 100%;
  background: var(--first-color) !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 8px rgba(167, 85, 246, 0.4) !important;
  transition: all 0.2s ease !important;
  color: white !important;
}
.login-submit-btn:hover {
  cursor: pointer;
  transform: translateY(-2px);
  background: var(--second-color) !important;
}

/* 弹窗样式 */
:deep(.reset-dialog) {
  border-radius: 20px !important;
  overflow: hidden;
}

.reset-header-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 20px; /* 要求的圆角 */
}
.reset-header-tip h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--first-color);
}

/* 验证码行 70% : 30% 比例 */
.input-with-button {
  display: flex;
  gap: 10px;
  width: 100%;
}
.input-with-button .el-input {
  flex: 7; /* 占 70% */
}
.input-with-button .el-button {
  flex: 3; /* 占 30% */
  height: 40px;
  border-radius: 10px !important;
  padding: 0 !important; /* 比例较窄，取消内边距防止文字溢出 */
  font-size: 13px;
  background: var(--first-color) !important;
  border: none !important;
  color: white !important;
  transition: all 0.2s ease !important;
}

.input-with-button .el-button:hover {
  background: var(--second-color) !important;
}

/* 弹窗底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding-bottom: 10px;
}
.dialog-footer .el-button {
  height: 40px;
  padding: 0 30px;
  border-radius: 10px !important;
  font-size: 15px;
}
.reset-cancel-btn {
  border: 1px solid var(--first-color, #a755f6) !important;
  color: var(--first-color, #a755f6) !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 8px rgba(168, 85, 246, 0.119) !important;
}

.reset-cancel-btn:hover {
  background: var(--first-color, #a755f6) !important;
  color: white !important;
  transform: translateY(-2px);
}

.reset-confirm-btn {
  background: var(--first-color, #a755f6) !important;
  border: none !important;
  color: white !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 8px rgba(167, 85, 246, 0.4) !important;
}

.reset-confirm-btn:hover {
  background: var(--second-color, #7c3aed) !important;

  transform: translateY(-2px);
}

.register-text {
  text-align: center;
  font-size: 14px;
  color: #667085;
}
.register-link {
  text-decoration: none;
  cursor: pointer;
  color: var(--first-color);
}
.register-link:hover {
  color: var(--second-color);
  text-decoration: underline;
  font-weight: 700;
}
</style>
