<template>
  <div class="landing-container">
    <nav class="nav-bar">
      <div class="nav-action">
        <router-link to="/login" class="nav-link nav-link--outline">登录</router-link>
        <router-link to="/register" class="nav-link nav-link--solid">注册</router-link>
      </div>
    </nav>
    <div class="landing-body">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
.landing-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  /* 径向渐变：左上浅紫、右下浅蓝 + 整体轻渐变铺底 */
  background:
    radial-gradient(ellipse 120% 90% at 0% 0%, rgba(237, 233, 254, 0.95) 0%, transparent 58%),
    radial-gradient(ellipse 110% 85% at 100% 100%, rgba(219, 234, 254, 0.88) 0%, transparent 55%),
    linear-gradient(165deg, #faf5ff 0%, #f3f0ff 35%, #eef2ff 72%, #f8fafc 100%);
}

/* 装饰性柔光圆（低透明度 + 模糊，不挡正文） */
.landing-container::before,
.landing-container::after {
  content: '';
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(64px);
  opacity: 0.55;
  z-index: 0;
}

.landing-container::before {
  top: -120px;
  left: -100px;
  width: 340px;
  height: 340px;
  background: radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.45), rgba(99, 102, 241, 0.12));
}

.landing-container::after {
  bottom: -100px;
  right: -80px;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle at 70% 70%, rgba(147, 197, 253, 0.42), rgba(129, 140, 248, 0.1));
}

.nav-bar {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0 auto;
  max-width: 72rem;
  padding: 1rem 1.25rem;
}

.nav-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 线框按钮 — 登录 */
.nav-link {
  padding: 0.45rem 1.1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    color 0.22s ease;
}

.nav-link--outline {
  color: var(--first-color);
  border: 2px solid rgba(99, 102, 241, 0.45);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.08);
}

.nav-link--outline:hover {
  border-color: rgba(99, 102, 241, 0.65);
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 22px rgba(99, 102, 241, 0.18);
}

.nav-link--outline:active {
  transform: scale(0.96);
}

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
</style>
