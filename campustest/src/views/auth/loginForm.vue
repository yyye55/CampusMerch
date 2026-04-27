<template>
  <landingNav>
    <div class="container">
      <div class="login-container">
        <h1>登录</h1>
        <form>
          <div class="form-control">
            <input type="email" id="email" required />
            <label for="email">
              <span
                v-for="(letter, index) in emailTxet.split('')"
                :key="index"
                :style="{ transitionDelay: index * 50 + 'ms' }"
                >{{ letter }}</span
              >
            </label>
          </div>
          <div class="form-control">
            <input type="password" id="password" required />
            <label for="password">
              <span
                v-for="(letter, index) in passwordText.split('')"
                :key="index"
                :style="{ transitionDelay: index * 50 + 'ms' }"
                >{{ letter }}</span
              >
              <!-- 让每个字母的出现有延迟 -->
            </label>
          </div>
          <button class="login-btn">登录</button>
          <p>还没有账号？ <router-link to="/register">注册账号</router-link></p>
        </form>
        </div>
    </div>
  </landingNav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import landingNav from '@/components/landingNav.vue'
const emailTxet = ref('邮箱')
const passwordText = ref('密码')
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.login-container {
  background-color: rgba(255, 255, 255, 0.874);
  padding: 30px 40px;
  border-radius: 10px;
  width: 320px;
}

.login-container h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #ee7652ba;
}

.form-control {
  position: relative;
  margin: 20px 0 40px;
  width: 100%;
  color: #ee7652ba;
}

.form-control input {
  background-color: transparent;
  border: 0;
  border-bottom: 2px solid rgb(247, 131, 102);
  display: block;
  width: 100%;
  padding: 15px 0;
  font-size: 18px;
  color: #ee7652ba;
}

.form-control input:focus,
.form-control input:valid {
  outline: none;
  border-bottom-color: #ee7652ba;
}
.login-btn {
  cursor: pointer;
  width: 100%;
  background-color:  #ea8567;
  padding: 12px;
  font-size: 15px;
  border: 0;
  border-radius: 3px;
  margin-bottom: 20px;
  transition: transform 0.1s ease;
}

.form-control label {
  position: absolute;
  top: 15px;
  left: 0;
  pointer-events: none;
}

.form-control label span {
  display: inline-block;
  font-size: 18px;
  min-width: 5px;
  transition: 0.2s;
}

.form-control input:focus ~ label span,
.form-control input:valid ~ label span {
  color: #ee7652ba;
  transform: translateY(-30px);
}

.container p {
  color: #ee7652ba;
  text-align: center;
  font-size: 14px;
}

.login-container a {
  text-decoration: none;
  color:  #ee7652ba;
}
.login-container a:hover {
  text-decoration: underline;
}
</style>
