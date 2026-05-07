<template>
  <landingNav>
    <div class="top-right-buttons">
      <router-link class="auth-btn login-btn" to="/login">登录</router-link>
      <router-link class="auth-btn register-btn" to="/register">注册</router-link>
    </div>
    <section class="hero">
      <!-- 动态背景效果 -->
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
      <div class="particles">
        <div class="particle" v-for="i in 20" :key="i"></div>
      </div>

      <!-- 主内容 -->
      <div class="hero-content">
        <i class="fas fa-palette hero-icon"></i>
        <h2 class="hero-title">
          <span class="title-text">校园文创预订系统</span>
        </h2>
        <p class="hero-subtitle">便捷预订 · 智能管理 · 高效流转</p>
        <div class="hero-btn">
          <router-link class="primary-btn" to="/login">
            <span>立即开始</span>
          </router-link>
        </div>

        <!-- 特色功能卡片 -->
        <div class="feature-cards">
          <div class="feature-card">
            <div class="feature-icon">📦</div>
            <h3>一键预订</h3>
            <p>多种文创产品快速下单</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>定制服务</h3>
            <p>支持个性化设计定制</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>智能管理</h3>
            <p>订单状态实时追踪</p>
          </div>
        </div>
      </div>
    </section>
  </landingNav>
</template>

<script setup lang="ts">
import landingNav from '@/components/landingNav.vue'
</script>

<style scoped>
.top-right-buttons {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.auth-btn {
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.login-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.register-btn {
  background: white;
  color: #6366f1;
  border: 2px solid #6366f1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.register-btn:hover {
  background: #f5f3ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.2);
}

.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #e4c2f34f;
  animation: gradient 15s ease infinite;
}

/* 渐变背景 */
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #e7bdfa 0%, #e4c2f34f 50%, #a78bfab3 100%);
  z-index: 0;
}

.bg-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  animation: gradientShift 8s ease-in-out infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 网格背景 */
.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 1;
}

/* 浮动形状 */
.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

/* 粒子效果 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(99, 102, 241, 0.6);
  border-radius: 50%;
  animation: particleFloat 15s ease-in-out infinite;
}

.particle:nth-child(1) {
  left: 10%;
  top: 20%;
  animation-delay: 0s;
}
.particle:nth-child(2) {
  left: 20%;
  top: 80%;
  animation-delay: 1s;
}
.particle:nth-child(3) {
  left: 30%;
  top: 40%;
  animation-delay: 2s;
}
.particle:nth-child(4) {
  left: 40%;
  top: 60%;
  animation-delay: 3s;
}
.particle:nth-child(5) {
  left: 50%;
  top: 30%;
  animation-delay: 4s;
}
.particle:nth-child(6) {
  left: 60%;
  top: 70%;
  animation-delay: 5s;
}
.particle:nth-child(7) {
  left: 70%;
  top: 50%;
  animation-delay: 6s;
}
.particle:nth-child(8) {
  left: 80%;
  top: 20%;
  animation-delay: 7s;
}
.particle:nth-child(9) {
  left: 90%;
  top: 90%;
  animation-delay: 8s;
}
.particle:nth-child(10) {
  left: 15%;
  top: 50%;
  animation-delay: 9s;
}
.particle:nth-child(11) {
  left: 25%;
  top: 10%;
  animation-delay: 10s;
}
.particle:nth-child(12) {
  left: 35%;
  top: 90%;
  animation-delay: 11s;
}
.particle:nth-child(13) {
  left: 45%;
  top: 15%;
  animation-delay: 12s;
}
.particle:nth-child(14) {
  left: 55%;
  top: 85%;
  animation-delay: 13s;
}
.particle:nth-child(15) {
  left: 65%;
  top: 35%;
  animation-delay: 14s;
}
.particle:nth-child(16) {
  left: 75%;
  top: 65%;
  animation-delay: 0.5s;
}
.particle:nth-child(17) {
  left: 85%;
  top: 45%;
  animation-delay: 1.5s;
}
.particle:nth-child(18) {
  left: 5%;
  top: 75%;
  animation-delay: 2.5s;
}
.particle:nth-child(19) {
  left: 95%;
  top: 25%;
  animation-delay: 3.5s;
}
.particle:nth-child(20) {
  left: 50%;
  top: 50%;
  animation-delay: 4.5s;
}

@keyframes particleFloat {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-100px) scale(0.5);
    opacity: 0.2;
  }
}

/* 主内容容器 */
.hero-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 20px;
}

/* 徽章 */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  animation: fadeInDown 0.8s ease-out;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

/* 主图标 */
.hero-icon {
  font-size: 80px;
  color: #6366f1;
  filter: drop-shadow(0 4px 20px rgba(99, 102, 241, 0.3));
  animation:
    float 3s ease-in-out infinite,
    glow 2s ease-in-out infinite alternate;
  margin-bottom: 20px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0% {
    filter: drop-shadow(0 4px 20px rgba(99, 102, 241, 0.3));
  }
  100% {
    filter: drop-shadow(0 4px 30px rgba(139, 92, 246, 0.5));
  }
}

/* 标题 */
.hero-title {
  margin: 0 0 20px 0;
}

.title-text {
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -1px;
  text-align: center;
  color: #6366f1;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 副标题 */
.hero-subtitle {
  font-size: 22px;
  color: #6b7280;
  letter-spacing: 4px;
  font-weight: 500;
  margin: 0 0 40px 0;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

/* 按钮 */
.hero-btn {
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 40px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.primary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.6);
}

.primary-btn:hover::before {
  left: 100%;
}

.primary-btn i {
  transition: transform 0.3s ease;
}

.primary-btn:hover i {
  transform: translateX(5px);
}

/* 特色功能卡片 */
.feature-cards {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.feature-card {
  background: rgba(255, 255, 255, 0.824);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  padding: 30px;
  width: 200px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  background: white;
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.feature-card h3 {
  color: #1e1b4b;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.feature-card p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  letter-spacing: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .title-text {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 16px;
    letter-spacing: 2px;
  }

  .feature-cards {
    flex-direction: column;
    align-items: center;
  }

  .feature-card {
    width: 80%;
  }
}
</style>
