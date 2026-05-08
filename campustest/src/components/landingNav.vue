<template>
  <div class="landing-container">


      <slot></slot>

  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
.landing-container {
  background:  #e4c2f34f;
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

<<<<<<< HEAD
/* 实心渐变 — 注册 */
.nav-link--solid {
  color: #fff !important;
  border: none;
  background: linear-gradient(135deg, #4f6ae8 0%, #5b62f0 50%, #6366f1 100%);
  box-shadow:
    0 6px 20px rgba(99, 102, 241, 0.32),
    0 2px 8px rgba(79, 70, 229, 0.12);
}

.nav-link--solid:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow:
    0 12px 32px rgba(99, 102, 241, 0.38),
    0 4px 12px rgba(79, 70, 229, 0.15);
  filter: brightness(1.03);
}

.nav-link--solid:active {
  transform: scale(0.96);
}

.nav-link--outline.router-link-active {
  color: var(--second-color);
  border-color: rgba(99, 102, 241, 0.75);
  background: rgba(238, 242, 255, 0.92);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.16);
}

.nav-link--solid.router-link-active {
  filter: brightness(0.97);
  box-shadow:
    0 8px 26px rgba(99, 102, 241, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.landing-body {
  position: relative;
  z-index: 1;
}
=======
>>>>>>> b50897ecb81934a3a570354c23893323d4644736
</style>
