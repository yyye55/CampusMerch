<template>
  <landingNav>
    <section class="intro-hero">
      <div class="intro-hero__inner">
        <div class="intro-hero__icon-wrap" aria-hidden="true">
          <svg
            class="intro-hero__icon"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 6L8 19v12l2 1.1V45l22 12 22-12V32.1L56 31V19L32 6Z"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linejoin="round"
            />
            <path
              d="M20 30.5V42l12 6.5L44 42V30.5"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M32 22v9.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            <path
              d="M14 24l18 9 18-9"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <h1 class="intro-hero__title">校园文创与活动物料预订管理系统</h1>
        <p class="intro-hero__subtitle">便捷预订 · 智能管理 · 高效流转</p>

        <div class="intro-hero__actions">
          <router-link class="intro-hero__cta" to="/login">立即开始</router-link>
        </div>
      </div>
    </section>
  </landingNav>
</template>

<script setup lang="ts">
import landingNav from '@/components/landingNav.vue'
</script>

<style scoped>
.intro-hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 5rem);
  padding: 2rem 1.25rem 3rem;
  text-align: center;
}

.intro-hero__inner {
  max-width: 52rem;
  margin: 0 auto;
}

.intro-hero__icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
  animation: introFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.06s;
}

.intro-hero__icon {
  width: clamp(3.25rem, 10vw, 4.25rem);
  height: clamp(3.25rem, 10vw, 4.25rem);
  color: var(--first-color, #6366f1);
  filter: drop-shadow(0 10px 28px rgba(99, 102, 241, 0.22));
}

.intro-hero__title {
  font-size: clamp(1.375rem, 4.2vw, 2.75rem);
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
  margin: 0 auto;
  max-width: min(42rem, 92vw);
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 42%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: introFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.12s;
}

.intro-hero__subtitle {
  margin-top: clamp(0.75rem, 2vw, 1.125rem);
  font-size: clamp(0.875rem, 2.4vw, 1.125rem);
  font-weight: 500;
  line-height: 1.65;
  color: #7c7c9c;
  letter-spacing: 0.06em;
  animation: introFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.2s;
}

.intro-hero__actions {
  margin-top: clamp(1.75rem, 4vw, 2.5rem);
  display: flex;
  justify-content: center;
  animation: introFadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.28s;
}

.intro-hero__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0.65rem 2.25rem;
  border-radius: 9999px;
  font-size: clamp(0.9375rem, 2.6vw, 1.0625rem);
  font-weight: 700;
  color: #ffffff !important;
  text-decoration: none;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 48%, #8b5cf6 100%);
  box-shadow:
    0 8px 28px rgba(99, 102, 241, 0.35),
    0 2px 8px rgba(79, 70, 229, 0.12);
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s ease,
    filter 0.22s ease;
}

.intro-hero__cta:hover {
  transform: translateY(-3px) scale(1.035);
  box-shadow:
    0 14px 40px rgba(99, 102, 241, 0.42),
    0 4px 14px rgba(79, 70, 229, 0.18);
  filter: brightness(1.03);
}

.intro-hero__cta:active {
  transform: scale(0.97);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.28);
}

@keyframes introFadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
