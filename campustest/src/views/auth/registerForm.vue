<template>
  <landingNav>
    <div class="container">
      <div class="login-container">
        <div class="close-icon" @click="handleClose">
          <i class="fas fa-times"></i>
        </div>

        <h1>注册</h1>
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

          <el-form-item>
            <el-button type="primary" class="register-submit-btn" @click="handleRegister"
              >注册</el-button
            >
          </el-form-item>
          <div class="login-link">已有账号？<router-link to="/login">立即登录</router-link></div>
        </el-form>
      </div>
    </div>
  </landingNav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import landingNav from '@/components/landingNav.vue'

const router = useRouter()

const registerForm = ref({
  username: '',
  account: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const registerRules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入有效的邮箱格式', trigger: 'blur' }],
  password: [{ min: 6, message: '请输入6位以上密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value: string, callback: (error?: Error) => void) => {
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
    // 这里可以添加注册API调用
  } catch (error) {
    console.log('注册验证失败', error)
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
  phone: '',
  password: '',
  password_confirmation: '',
})
const resetRules = ref({
  email: [{ type: 'email', message: '请输入有效的邮箱格式', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
  password: [{ min: 6, message: '请输入至少6位新密码', trigger: 'blur' }],
  password_confirmation: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== resetForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
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
    showResetDialog.value = false
    resetForm.value = { email: '', captcha: '', password: '', password_confirmation: '' }
  } catch (error) {
    console.log('重置密码验证失败', error)
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

.login-container {
  position: relative; /* 必须，为了让关闭按钮绝对定位 */
  background-color: rgba(255, 255, 255, 0.874);
  padding: 40px 40px 30px;
  border-radius: 20px; /* 要求的 20px 圆角 */
  width: 320px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.251);
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
  color: var(--first-color, #a755f6);
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
  box-shadow: 0 0 0 1px var(--first-color, #a755f6) inset !important;
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
  color: black;
}
.forgot-link:hover {
  color: var(--first-color);
  text-decoration: underline;
}

/* 注册按钮 */
.register-submit-btn {
  height: 40px;
  width: 100%;
  background: var(--first-color, #a755f6) !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 8px rgba(167, 85, 246, 0.4) !important;
  transition: all 0.2s ease !important;
  color: white !important;
}
.register-submit-btn:hover {
  cursor: pointer;
  transform: translateY(-2px);
  background: var(--second-color, #7c3aed) !important;
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
  border: 1px solid var(--first-color) !important;
  color: var(--first-color) !important;
}
.reset-confirm-btn {
  background: var(--first-color) !important;
  border: none !important;
  color: white !important;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #667085;
}
.login-link a {
  color: var(--first-color);
  text-decoration: none;

}
.login-link a:hover {
  text-decoration: underline;
  color: var(--second-color);
  font-weight: 700;
}
</style>
