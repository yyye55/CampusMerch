<template>
  <landingNav>
    <div class="auth-layout">
      <div class="auth-card">
        <button type="button" class="auth-close" aria-label="关闭" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>
        <h1 class="auth-title">登录</h1>
        <p class="auth-desc">使用邮箱登录，进入校园文创预订</p>

        <!-- 登录表单 -->
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
            <!-- 点击直接触发弹窗 -->
            <a class="forgot-link" @click="openResetDialog">忘记密码?</a>
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

      <!-- 忘记密码弹窗 (优化无滚动条版本) -->
      <el-dialog
        v-model="showResetDialog"
        width="420px"
        align-center
        class="reset-dialog-no-scroll"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :show-close="false"
      >
        <div class="reset-header-tip">
          <h2 class="reset-title">重置密码</h2>
          <p>验证邮箱后即可设置新密码</p>
        </div>

        <div class="reset-content">
          <el-form
            :model="resetForm"
            label-position="top"
            :rules="resetRules"
            ref="resetRef"
            :hide-required-asterisk="true"
          >
            <el-form-item label="邮箱" prop="email" class="compact-form-item">
              <div class="input-with-button">
                <el-input v-model="resetForm.email" placeholder="注册邮箱" autocomplete="off">
                  <template #prefix>
                    <i class="fas fa-envelope"></i>
                  </template>
                </el-input>
                <el-button
                  class="reset-captcha-btn"
                  @click="sendResetCaptcha"
                  :disabled="sendingCaptcha || captchaCountdown > 0 || !resetForm.email"
                >
                  {{
                    captchaCountdown > 0 ? `${captchaCountdown}s` : sendingCaptcha ? '...' : '发送'
                  }}
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="验证码" prop="captcha" class="compact-form-item">
              <el-input v-model="resetForm.captcha" placeholder="请输入6位验证码">
                <template #prefix><i class="fas fa-key"></i></template>
              </el-input>
            </el-form-item>

            <el-form-item label="新密码" prop="password" class="compact-form-item">
              <el-input
                v-model="resetForm.password"
                placeholder="至少6位新密码"
                type="password"
                show-password
              >
                <template #prefix><i class="fas fa-lock"></i></template>
              </el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="password_confirmation" class="compact-form-item">
              <el-input
                v-model="resetForm.password_confirmation"
                placeholder="再次输入以确认"
                type="password"
                show-password
              >
                <template #prefix><i class="fas fa-lock"></i></template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showResetDialog = false" class="reset-cancel-btn">取消</el-button>
            <el-button type="primary" @click="handleReset" class="reset-confirm-btn"
              >确认重置</el-button
            >
          </div>
        </template>
      </el-dialog>
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
const resetRef = ref()
const loading = ref(false)

// 登录相关
const loginForm = ref({
  email: '',
  password: '',
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
    // 验证表单，通过了才会继续
    await loginRef.value.validate()
    //打开加载状态
    loading.value = true

    // 调用登录接口
    const res = await login({
      email: loginForm.value.email.trim(),
      password: loginForm.value.password,
    })

    // 保存登录信息
    userStore.setSession({
      email: loginForm.value.email.trim(),
      accessToken: res.data.token,
    })

    // 根据邮箱判断跳转
    if (loginForm.value.email.trim() === 'admin@example.com') {
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

// 忘记密码逻辑
const showResetDialog = ref(false)
const sendingCaptcha = ref(false)
const captchaCountdown = ref(0)
const resetForm = ref({
  email: '',
  captcha: '',
  password: '',
  password_confirmation: '',
})

const openResetDialog = () => {
  showResetDialog.value = true
}

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== resetForm.value.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const resetRules = {
  email: [{ required: true, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [{ required: true, min: 6, message: '密码至少6位', trigger: 'blur' }],
  password_confirmation: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

const sendResetCaptcha = async () => {
  if (!resetForm.value.email) return
  try {
    sendingCaptcha.value = true
    // 模拟发送
    captchaCountdown.value = 60
    const timer = setInterval(() => {
      captchaCountdown.value--
      if (captchaCountdown.value <= 0) {
        clearInterval(timer)
        sendingCaptcha.value = false
      }
    }, 1000)
    ElMessage.success('验证码已发送至邮箱')
  } catch (error) {
    sendingCaptcha.value = false
  }
}

const handleReset = async () => {
  if (!resetRef.value) return
  try {
    await resetRef.value.validate()
    ElMessage.success('密码重置成功！请登录')
    showResetDialog.value = false
  } catch (error) {
    ElMessage.error('请检查输入信息')
  }
}
</script>

<style scoped>
@import '@/styles/authPage.css';

/* --- 通用 Element 样式覆盖 --- */
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

/* --- 登录特定样式 --- */
.remember-forgot-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.forgot-link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6366f1;
  cursor: pointer;
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

/* --- 弹窗专项优化：防止滚动条 --- */
:deep(.reset-dialog-no-scroll) {
  border-radius: 20px !important;
  overflow: hidden !important; /* 核心：禁止溢出 */
}

:deep(.reset-dialog-no-scroll .el-dialog__body) {
  padding: 10px 28px !important; /* 缩小内边距 */
}

:deep(.reset-dialog-no-scroll .el-dialog__header) {
  padding-bottom: 0 !important;
  margin-right: 0 !important;
}

.reset-header-tip {
  text-align: center;
  margin-bottom: 1.25rem;
}

.reset-header-tip h2,
.reset-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.reset-header-tip p {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0;
}

/* 压缩弹窗内的表单间距 */
.compact-form-item {
  margin-bottom: 12px !important;
}

.input-with-button {
  display: flex;
  gap: 8px;
}

.reset-captcha-btn {
  flex: 0 0 80px; /* 固定宽度防止抖动 */
  height: 2.75rem;
  border-radius: 10px !important;
  background: #f1f5f9 !important;
  color: #6366f1 !important;
  border: 1px solid #e2e8f0 !important;
  font-size: 0.75rem !important;
  padding: 0 !important;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-bottom: 8px;
}

.reset-cancel-btn,
.reset-confirm-btn {
  flex: 1;
  height: 2.75rem;
  border-radius: 12px !important;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.reset-cancel-btn {
  background: white !important;
  border: 2px solid #e2e8f0 !important;
  color: #64748b !important;
}

.reset-cancel-btn:hover {
  border-color: #6366f1 !important;
  color: #6366f1 !important;
  background: #f5f3ff !important;
}

.reset-confirm-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.reset-confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}
</style>
