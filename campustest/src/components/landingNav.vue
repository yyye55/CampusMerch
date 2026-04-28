<template>
  <div class="landing-container">
    <!-- 导航栏 -->
    <nav class="nav-bar">
      <div class="logo">CampusMerch</div>
      <div class="nav-action">
        <router-link to="/login">登录</router-link>
        <router-link to="/register">注册</router-link>
      </div>
    </nav>
    <slot></slot>
  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
.landing-container {
  background:  #ffffff;
  animation: gradient 15s ease infinite;
  height: 100vh;
  overflow: hidden;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  font-size: 20px;
  color: var(--first-color);
  font-weight: 500;
}
a {
  color: var(--first-color);
  text-decoration: none;
  margin-right: 25px;
  border-radius: 10px;
}
a:hover {
  text-decoration: underline;
  color: var(--second-color);
  font-weight: 700;
}

</style>
