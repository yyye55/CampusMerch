<template>
  <landingNav>
    <section class="hero">
      <i class="fas fa-university"></i>
      <h2>校园文创与活动物料预订管理系统</h2>
      <p>便捷预订 · 智能管理 · 高效流转</p>
      <div class="hero-btn">
        <router-link class="primary-btn" to="/login"><i class="fas fa-arrow-right"></i> 立即开始</router-link>
      </div>
    </section>
  </landingNav>
</template>

<script setup lang="ts">
import landingNav from '@/components/landingNav.vue'
</script>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.fa-university {
  font-size: 60px;
  color: aliceblue;
}
h2 {
  margin-top: 20px;
  font-size: 60px;
  color: aliceblue;
  font-weight: 500;

}
p {
  margin-top: 10px;
  font-size: 20px;
  color: aliceblue;
}
.hero-btn {
  margin-top: 30px;
}
.primary-btn {
  padding: 10px 20px;
  background-color: transparent;
  color: aliceblue;
  border: 5px solid aliceblue;
  border-radius: 40px;
  cursor: pointer;
  font-size: 40px;
  text-decoration: none;
}
.primary-btn:hover {
  background-color: aliceblue;
  color: #ee7652;
  transition: all 0.3s ease-in-out;
}
</style>
