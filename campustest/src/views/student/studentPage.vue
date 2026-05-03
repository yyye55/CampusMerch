<template>
  <!-- 自定义弹窗 -->
  <Transition name="dialog">
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeDialog">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"></div>
      <div class="relative bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden transform transition-all scale-100">
        <!-- 成功弹窗 -->
        <div v-if="dialogType === 'success'" class="p-6 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ dialogTitle }}</h3>
          <p class="text-gray-500 mb-6 text-sm leading-relaxed">{{ dialogMessage }}</p>
          <button @click="closeDialog" class="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98]">
            好的，知道了
          </button>
        </div>
        <!-- 警告弹窗 -->
        <div v-else-if="dialogType === 'warning'" class="p-6 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-50 flex items-center justify-center">
            <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ dialogTitle }}</h3>
          <p class="text-gray-500 mb-6 text-sm leading-relaxed">{{ dialogMessage }}</p>
          <button @click="closeDialog" class="w-full py-3 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all active:scale-[0.98]">
            好的
          </button>
        </div>
        <!-- 确认弹窗 -->
        <div v-else-if="dialogType === 'confirm'" class="p-6 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg class="w-8 h-8 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ dialogTitle }}</h3>
          <p class="text-gray-500 mb-6 text-sm leading-relaxed">{{ dialogMessage }}</p>
          <div class="flex gap-3">
            <button @click="confirmCancel" class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-[0.98]">
              取消
            </button>
            <button @click="confirmAction" class="flex-1 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98]">
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <div class="min-h-screen bg-[#F9F7FF] relative overflow-hidden">
    <div class="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-[#a78bfa]/20 blur-3xl"></div>
    <div class="pointer-events-none absolute top-40 -right-20 h-80 w-80 rounded-full bg-[#8b5cf6]/15 blur-3xl"></div>
    <div class="max-w-6xl mx-auto px-4 md:px-6 py-8">
      
      <div class="text-center mb-6">
        <h1 class="text-[28px] md:text-[32px] font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
          🎨 校园文创预订系统
        </h1>
        <p class="text-sm text-gray-500">在线筛选、智能校验、可视化弹窗，预订流程更清晰</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="bg-white/80 backdrop-blur rounded-2xl border border-[#e5e7eb] p-4">
          <p class="text-xs text-gray-500 mb-1">在售商品</p>
          <p class="text-xl font-bold text-[#6366f1]">{{ goods.filter(g => g.inStock).length }}</p>
        </div>
        <div class="bg-white/80 backdrop-blur rounded-2xl border border-[#e5e7eb] p-4">
          <p class="text-xs text-gray-500 mb-1">总商品数</p>
          <p class="text-xl font-bold text-[#8b5cf6]">{{ goods.length }}</p>
        </div>
        <div class="bg-white/80 backdrop-blur rounded-2xl border border-[#e5e7eb] p-4">
          <p class="text-xs text-gray-500 mb-1">我的订单</p>
          <p class="text-xl font-bold text-[#7c3aed]">{{ orders.length }}</p>
        </div>
        <div class="bg-white/80 backdrop-blur rounded-2xl border border-[#e5e7eb] p-4">
          <p class="text-xs text-gray-500 mb-1">待处理订单</p>
          <p class="text-xl font-bold text-[#6366f1]">{{ pendingOrderCount }}</p>
        </div>
      </div>

      <div class="flex justify-center gap-3 mb-6">
        <button 
          @click="go('list')"
          :class="page === 'list' ? 'px-6 py-2.5 rounded-full font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-md' : 'px-6 py-2.5 rounded-full font-medium text-[#6366f1] bg-[#f3f4f6] hover:bg-[#e5e7eb] transition-all'"
        >
          🎁 商品大厅
        </button>
        <button 
          @click="go('myorder')"
          :class="page === 'myorder' ? 'px-6 py-2.5 rounded-full font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-md' : 'px-6 py-2.5 rounded-full font-medium text-[#6366f1] bg-[#f3f4f6] hover:bg-[#e5e7eb] transition-all'"
        >
          📋 我的订单
        </button>
        <button 
          @click="go('favorite')"
          :class="page === 'favorite' ? 'px-6 py-2.5 rounded-full font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-md' : 'px-6 py-2.5 rounded-full font-medium text-[#6366f1] bg-[#f3f4f6] hover:bg-[#e5e7eb] transition-all'"
        >
          ❤️ 我的收藏
        </button>
      </div>

      <div v-if="page === 'list'" class="page-transition">
        <div class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5 mb-6">
          <div class="flex flex-wrap gap-2 items-center mb-4">
            <span class="text-sm font-medium text-[#4c1d95] mr-2">📂 分类</span>
            <button 
              v-for="cat in categories" 
              :key="cat.value"
              @click="filters.category = cat.value; currentPage = 1"
              :class="filters.category === cat.value ? 'px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' : 'px-4 py-1.5 rounded-full text-sm font-medium text-[#6366f1] bg-white border border-[#e5e7eb] hover:bg-[#f3f4f6] transition-all'"
            >
              {{ cat.label }}
            </button>
          </div>
          <div class="flex flex-wrap gap-2 items-center mb-4">
            <span class="text-sm font-medium text-[#4c1d95] mr-2">📍 状态</span>
            <button 
              v-for="s in statusFilters" 
              :key="s.value"
              @click="filters.status = s.value; currentPage = 1"
              :class="filters.status === s.value ? 'px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' : 'px-4 py-1.5 rounded-full text-sm font-medium text-[#6366f1] bg-white border border-[#e5e7eb] hover:bg-[#f3f4f6] transition-all'"
            >
              {{ s.label }}
            </button>
          </div>
          <div class="flex flex-wrap gap-2 items-center mb-4">
            <span class="text-sm font-medium text-[#4c1d95] mr-2">💴 价格</span>
            <input 
              type="number" 
              v-model="filters.minPrice" 
              placeholder="最低" 
              class="w-28 px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] text-sm focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
            >
            <span class="text-[#9ca3af]">—</span>
            <input 
              type="number" 
              v-model="filters.maxPrice" 
              placeholder="最高" 
              class="w-28 px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] text-sm focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
            >
          </div>
          <div class="flex gap-3">
            <input 
              type="text" 
              v-model="filters.keyword" 
              placeholder="🔍 搜索商品名称或描述..." 
              @keyup.enter="applyFilter"
              class="flex-1 px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] text-sm focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
            >
            <button 
              @click="applyFilter"
              class="px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              搜索
            </button>
            <button 
              @click="resetFilter"
              class="px-5 py-2.5 rounded-xl font-medium text-[#6366f1] border border-[#6366f1] bg-white hover:bg-[#f3f4f6] transition-all"
            >
              重置
            </button>
          </div>
        </div>

        <div v-if="filteredGoods.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <div 
            v-for="g in paginatedGoods" 
            :key="g.id" 
            class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
            @click="openDetail(g)"
          >
            <div class="h-48 overflow-hidden">
              <img :src="g.pic" class="w-full h-full object-cover transition-transform hover:scale-105">
            </div>
            <div class="p-5">
              <div class="mb-3 flex items-start justify-between gap-3">
                <div class="flex flex-wrap gap-2">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#f3e8ff] text-[#6366f1]">{{ g.categoryText }}</span>
                  <span 
                    :class="g.inStock ? 'bg-[#d1fae5] text-[#059669]' : 'bg-[#fee2e2] text-[#dc2626]'"
                    class="px-2.5 py-1 rounded-lg text-xs font-medium"
                  >
                    {{ g.statusText }}
                  </span>
                </div>
                <button
                  class="favorite-heart-btn"
                  :class="{ 'is-active': isFavorite(g.id) }"
                  @click.stop="toggleFavorite(g)"
                  :aria-label="isFavorite(g.id) ? '取消收藏' : '收藏商品'"
                >
                  {{ isFavorite(g.id) ? '❤️' : '🤍' }}
                </button>
              </div>
              <h3 class="text-base font-bold text-gray-800 mb-2 leading-tight">{{ g.name }}</h3>
              <p class="text-xs text-gray-500 mb-3">{{ g.spec }}</p>
              <div class="flex justify-between items-center">
                <span class="text-xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">¥{{ g.price }}</span>
                <div class="text-xs text-gray-400">
                  <span>库存{{ g.stock }}</span>
                  <span class="mx-1">·</span>
                  <span>已售{{ g.sold }}</span>
                </div>
              </div>
              <button 
                class="w-full mt-3 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
                @click.stop="openDetail(g)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-12 text-center">
          <div class="text-5xl mb-4 opacity-40">🔍</div>
          <p class="text-sm text-gray-500">没有找到符合条件的商品</p>
        </div>

        <div v-if="filteredGoods.length > 0" class="flex justify-center gap-2 flex-wrap">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg text-sm font-medium text-[#6366f1] border border-[#e5e7eb] bg-white hover:bg-[#f3f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← 上一页
          </button>
          <button 
            v-for="p in totalPages" 
            :key="p"
            @click="currentPage = p"
            :class="currentPage === p ? 'px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' : 'px-4 py-2 rounded-lg text-sm font-medium text-[#6366f1] border border-[#e5e7eb] bg-white hover:bg-[#f3f4f6] transition-all'"
          >
            {{ p }}
          </button>
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg text-sm font-medium text-[#6366f1] border border-[#e5e7eb] bg-white hover:bg-[#f3f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            下一页 →
          </button>
        </div>
      </div>

      <div v-if="page === 'detail'" class="page-transition">
        <button 
          @click="go('list')"
          class="mb-5 flex items-center gap-1.5 text-sm text-[#6366f1] hover:text-[#8b5cf6] font-medium transition-colors"
        >
          ← 返回商品大厅
        </button>

        <div class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div class="md:flex">
            <div class="md:w-1/2 p-5">
              <img :src="currentGoods.pic" class="w-full h-64 md:h-80 object-cover rounded-2xl">
            </div>
            <div class="p-5 md:p-6 md:w-1/2">
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#f3e8ff] text-[#6366f1]">{{ currentGoods.categoryText }}</span>
                <span 
                  :class="currentGoods.inStock ? 'bg-[#d1fae5] text-[#059669]' : 'bg-[#fee2e2] text-[#dc2626]'"
                  class="px-2.5 py-1 rounded-lg text-xs font-medium"
                >
                  {{ currentGoods.statusText }}
                </span>
              </div>
              <div class="mb-3 flex items-center justify-between gap-3">
                <h2 class="text-xl font-bold text-gray-800 leading-tight">{{ currentGoods.name }}</h2>
                <button
                  class="favorite-heart-btn !static !h-11 !w-11 !shadow-none"
                  :class="{ 'is-active': isFavorite(currentGoods.id) }"
                  @click="toggleFavorite(currentGoods)"
                  :aria-label="isFavorite(currentGoods.id) ? '取消收藏' : '收藏商品'"
                >
                  {{ isFavorite(currentGoods.id) ? '❤️' : '🤍' }}
                </button>
              </div>
              <p class="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-5">¥{{ currentGoods.price }}</p>

              <div class="grid grid-cols-2 gap-3 mb-5">
                <div class="bg-[#f9fafb] rounded-xl p-3 text-center">
                  <p class="text-xs text-gray-500 mb-1">📦 库存</p>
                  <p class="text-sm font-bold text-gray-800">{{ currentGoods.stock }} 件</p>
                </div>
                <div class="bg-[#f9fafb] rounded-xl p-3 text-center">
                  <p class="text-xs text-gray-500 mb-1">🔥 已售</p>
                  <p class="text-sm font-bold text-gray-800">{{ currentGoods.sold }} 件</p>
                </div>
                <div class="bg-[#f9fafb] rounded-xl p-3 text-center">
                  <p class="text-xs text-gray-500 mb-1">📐 规格</p>
                  <p class="text-sm font-bold text-gray-800">{{ currentGoods.spec }}</p>
                </div>
                <div class="bg-[#f9fafb] rounded-xl p-3 text-center">
                  <p class="text-xs text-gray-500 mb-1">📍 状态</p>
                  <p class="text-sm font-bold text-gray-800">{{ currentGoods.statusText }}</p>
                </div>
              </div>

              <div class="bg-[#f9fafb] rounded-xl p-4 mb-5">
                <p class="text-sm font-medium text-gray-600 mb-2">✂️ 定制要求</p>
                <p class="text-sm text-gray-700 leading-relaxed">{{ currentGoods.customRequirement }}</p>
              </div>

              <p class="text-sm text-gray-600 mb-6 leading-relaxed">{{ currentGoods.desc }}</p>

              <div class="flex gap-3">
                <button 
                  class="flex-1 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
                  @click="goBook"
                  v-if="currentGoods.inStock"
                >
                  ✨ 立即预订
                </button>
                <button 
                  class="py-3 px-6 rounded-xl font-medium text-[#6366f1] border border-[#6366f1] bg-white hover:bg-[#f3f4f6] transition-all"
                  @click="go('list')"
                >
                  返回列表
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="page === 'book'" class="page-transition">
        <button 
          @click="go('detail')"
          class="mb-5 flex items-center gap-1.5 text-sm text-[#6366f1] hover:text-[#8b5cf6] font-medium transition-colors"
        >
          ← 返回商品详情
        </button>

        <div class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 max-w-2xl mx-auto">
          <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
            📝 提交预订申请
          </h2>

          <div class="bg-[#f9fafb] rounded-xl p-4 mb-5">
            <p class="text-xs text-gray-500 mb-1">预订商品</p>
            <p class="text-sm font-bold text-gray-800">{{ currentGoods.name }} - ¥{{ currentGoods.price }}/件</p>
            <p class="text-xs text-orange-600 mt-1" v-if="currentGoods.minOrder && currentGoods.minOrder > 1">
              ⚠️ 此商品最低起订量 {{ currentGoods.minOrder }} 件
            </p>
          </div>

          <div class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">📦 预订数量 <span class="text-red-500">*</span></label>
                <div class="flex items-center gap-2">
                  <button 
                    @click="decrementNum"
                    class="w-11 h-11 rounded-xl border border-[#e5e7eb] bg-white text-[#6366f1] font-bold hover:bg-[#f3f4f6] transition-all flex items-center justify-center"
                    :disabled="bookForm.num <= (currentGoods.minOrder || 1)"
                    :class="{'opacity-40 cursor-not-allowed': bookForm.num <= (currentGoods.minOrder || 1)}"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <input 
                    type="number" 
                    v-model.number="bookForm.num" 
                    :min="currentGoods.minOrder || 1" 
                    :max="currentGoods.stock"
                    class="flex-1 h-11 px-4 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] text-sm text-center font-semibold focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                    @blur="validateNum"
                    @input="validateNumInput"
                  >
                  <button 
                    @click="incrementNum"
                    class="w-11 h-11 rounded-xl border border-[#e5e7eb] bg-white text-[#6366f1] font-bold hover:bg-[#f3f4f6] transition-all flex items-center justify-center"
                    :disabled="bookForm.num >= currentGoods.stock"
                    :class="{'opacity-40 cursor-not-allowed': bookForm.num >= currentGoods.stock}"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                </div>
                <p v-if="errors.num" class="text-xs text-red-500 mt-2">{{ errors.num }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  最低 {{ currentGoods.minOrder || 1 }} 件起订，库存剩余 {{ currentGoods.stock }} 件
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">📐 尺寸选择 <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select 
                    v-model="bookForm.size"
                    class="select-beauty"
                    :class="{'text-gray-400': !bookForm.size}"
                  >
                    <option value="" disabled hidden>请选择尺寸</option>
                    <option v-for="s in currentGoods.sizes || ['S','M','L','XL']" :key="s" :value="s">{{ s }}</option>
                  </select>
                  <div class="select-arrow">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <p v-if="errors.size" class="text-xs text-red-500 mt-2">{{ errors.size }}</p>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">🎨 颜色选择 <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select 
                    v-model="bookForm.color"
                    class="select-beauty"
                    :class="{'text-gray-400': !bookForm.color}"
                  >
                    <option value="" disabled hidden>请选择颜色</option>
                    <option v-for="c in currentGoods.colors || ['红色','蓝色','黑色','白色']" :key="c" :value="c">{{ c }}</option>
                  </select>
                  <div class="select-arrow">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <p v-if="errors.color" class="text-xs text-red-500 mt-2">{{ errors.color }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">📋 定制要求</label>
                <div class="relative">
                  <select 
                    v-model="bookForm.custom"
                    class="select-beauty"
                    :class="{'text-gray-400': !bookForm.custom}"
                  >
                    <option value="" disabled hidden>请选择定制要求</option>
                    <option value="无需定制">无需定制</option>
                    <option value="需要定制">需要定制</option>
                  </select>
                  <div class="select-arrow">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">📝 备注信息</label>
              <textarea 
                v-model="bookForm.remark" 
                rows="4"
                class="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] text-sm focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                placeholder="请输入其他备注信息..."
              ></textarea>
            </div>
          </div>

          <div class="flex gap-3 mt-6 justify-center">
            <button 
              class="flex-1 md:flex-none md:w-36 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
              @click="submitOrder"
            >
              🚀 提交预订
            </button>
            <button 
              class="h-11 w-24 md:w-36 rounded-xl font-medium text-[#6366f1] border border-[#6366f1] bg-white hover:bg-[#f3f4f6] transition-all"
              @click="go('detail')"
            >
              取消
            </button>
          </div>
        </div>
      </div>

      <div v-if="page === 'myorder'" class="page-transition">
        <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
          📦 我的订单
        </h2>

        <div v-if="orders.length > 0" class="space-y-4">
          <div v-for="(o, i) in orders" :key="i" class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div class="flex-1">
                <h3 class="text-base font-bold text-gray-800 mb-3">{{ o.goodsName }}</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <p>📦 数量：<span class="font-semibold">{{ o.num }} 件</span></p>
                  <p v-if="o.size">📐 尺寸：<span class="font-semibold">{{ o.size }}</span></p>
                  <p v-if="o.color">🎨 颜色：<span class="font-semibold">{{ o.color }}</span></p>
                  <p v-if="o.custom">✂️ 定制：<span class="font-semibold">{{ o.custom }}</span></p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span :class="getStatusClass(o.status)" class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
                  {{ o.statusText }}
                </span>
              </div>
            </div>
            <p class="text-sm text-gray-500 mb-4">📝 备注：{{ o.remark || '无' }}</p>
            <div class="flex gap-2">
              <button 
                class="bg-[#f3e8ff] text-[#6366f1] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#e5e7eb] transition-all"
                @click="openOrderDetail(o)"
              >
                查看详情 →
              </button>
              <button 
                v-if="o.status === 1"
                class="bg-[#fee2e2] text-[#ef4444] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#fecaca] transition-all"
                @click="cancelOrder(i)"
              >
                取消订单
              </button>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-12 text-center">
          <div class="text-5xl mb-4 opacity-40">🛒</div>
          <p class="text-sm text-gray-500 mb-1">暂无订单</p>
          <p class="text-xs text-gray-400">快去挑选商品吧～</p>
        </div>
      </div>

      <div v-if="page === 'favorite'" class="page-transition">
        <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
          ❤️ 我的收藏
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eef2ff] text-[#6366f1] border border-[#c7d2fe]">
            {{ favoriteGoods.length }} 件
          </span>
        </h2>

        <div v-if="favoriteGoods.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div 
            v-for="g in favoriteGoods" 
            :key="g.id" 
            class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
            @click="openDetail(g)"
          >
            <div class="h-48 overflow-hidden">
              <img :src="g.pic" class="w-full h-full object-cover transition-transform hover:scale-105">
            </div>
            <div class="p-5">
              <div class="mb-3 flex items-start justify-between gap-3">
                <div class="flex flex-wrap gap-2">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#f3e8ff] text-[#6366f1]">{{ g.categoryText }}</span>
                  <span 
                    :class="g.inStock ? 'bg-[#d1fae5] text-[#059669]' : 'bg-[#fee2e2] text-[#dc2626]'"
                    class="px-2.5 py-1 rounded-lg text-xs font-medium"
                  >
                    {{ g.statusText }}
                  </span>
                </div>
                <button
                  class="favorite-heart-btn is-active"
                  @click.stop="toggleFavorite(g)"
                  aria-label="取消收藏"
                >
                  ❤️
                </button>
              </div>
              <h3 class="text-base font-bold text-gray-800 mb-2 leading-tight">{{ g.name }}</h3>
              <p class="text-xs text-gray-500 mb-3">{{ g.spec }}</p>
              <div class="flex justify-between items-center">
                <span class="text-xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">¥{{ g.price }}</span>
                <div class="text-xs text-gray-400">
                  <span>库存{{ g.stock }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-12 text-center">
          <div class="text-5xl mb-4 opacity-40">💗</div>
          <p class="text-sm text-gray-500 mb-1">还没有收藏商品</p>
          <p class="text-xs text-gray-400">去商品大厅挑选你喜欢的文创吧～</p>
        </div>
      </div>

      <div v-if="page === 'orderDetail'" class="page-transition">
        <button 
          @click="go('myorder')"
          class="mb-5 flex items-center gap-1.5 text-sm text-[#6366f1] hover:text-[#8b5cf6] font-medium transition-colors"
        >
          ← 返回订单列表
        </button>

        <div class="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 max-w-2xl mx-auto">
          <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
            🧾 订单详情
          </h2>

          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 w-20 font-medium">🎁 商品</span>
              <span class="text-sm font-semibold text-gray-800">{{ currentOrder.goodsName }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 w-20 font-medium">📦 数量</span>
              <span class="text-sm font-semibold text-gray-800">{{ currentOrder.num }} 件</span>
            </div>
            <div v-if="currentOrder.size" class="flex items-center gap-2">
              <span class="text-sm text-gray-500 w-20 font-medium">📐 尺寸</span>
              <span class="text-sm font-semibold text-gray-800">{{ currentOrder.size }}</span>
            </div>
            <div v-if="currentOrder.color" class="flex items-center gap-2">
              <span class="text-sm text-gray-500 w-20 font-medium">🎨 颜色</span>
              <span class="text-sm font-semibold text-gray-800">{{ currentOrder.color }}</span>
            </div>
            <div v-if="currentOrder.custom" class="flex items-center gap-2">
              <span class="text-sm text-gray-500 w-20 font-medium">✂️ 定制</span>
              <span class="text-sm font-semibold text-gray-800">{{ currentOrder.custom }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 w-20 font-medium">📝 备注</span>
              <span class="text-sm text-gray-600">{{ currentOrder.remark || '无' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 w-20 font-medium">📍 状态</span>
              <span :class="getStatusClass(currentOrder.status)" class="px-3 py-1.5 rounded-full text-xs font-medium">
                {{ currentOrder.statusText }}
              </span>
            </div>
          </div>

          <div v-if="currentOrder.custom === '需要定制' && currentOrder.status === 1" 
               class="border-2 border-dashed border-[#c4b5fd] rounded-2xl p-6 text-center mb-6 bg-[#F9F7FF]"
          >
            <div class="text-4xl mb-3">📤</div>
            <p class="text-sm font-medium text-[#6366f1] mb-4">上传定制设计稿</p>
            <input type="file" class="mb-4 w-full max-w-xs mx-auto text-sm" @change="handleFileUpload">
            <p v-if="selectedDesignFile" class="text-xs text-gray-500 mb-3 truncate">已选文件：{{ selectedDesignFile.name }}</p>
            <button 
              class="px-6 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
              @click="uploadDesign"
            >
              上传文件
            </button>
          </div>

          <div v-if="currentOrder.status === 3" class="flex justify-center">
            <button 
              class="px-8 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#059669] to-[#10b981] shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
              @click="finishOrder"
            >
              ✅ 确认收货
            </button>
          </div>

          <div v-if="currentOrder.status === 1" class="flex justify-center">
            <button 
              class="bg-[#fee2e2] text-[#ef4444] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#fecaca] transition-all"
              @click="cancelCurrentOrder"
            >
              ❌ 取消订单
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const page = ref('list')
const currentPage = ref(1)
const pageSize = ref(6)

const categories = [
  { value: '', label: '全部' },
  { value: 'wenchuang', label: '文创产品' },
  { value: 'wuliao', label: '活动物料' }
]

const statusFilters = [
  { value: '', label: '全部' },
  { value: 'available', label: '有货' },
  { value: 'out_of_stock', label: '缺货' }
]

const filters = ref({
  keyword: '',
  category: '',
  status: '',
  minPrice: '',
  maxPrice: ''
})

const goods = ref([
  { id:1, name:'校园文化衫', price:39, stock:100, sold:256, desc:'纯棉圆领文化衫，透气舒适，支持多种印花定制，是校园活动和班级聚会的不二之选。', pic:'https://picsum.photos/300/200?1', category:'wenchuang', categoryText:'文创产品', inStock:true, statusText:'有货', spec:'S/M/L/XL 多尺码', customRequirement:'提供设计稿或手绘稿，支持单面/双面/多色印刷', sizes:['S','M','L','XL','XXL'], colors:['白色','黑色','藏青','灰色'], minOrder:1 },
  { id:2, name:'纪念徽章', price:12, stock:200, sold:589, desc:'校园纪念款金属珐琅徽章，精致工艺，收藏级品质，可定制校徽、社团标志。', pic:'https://picsum.photos/300/200?2', category:'wenchuang', categoryText:'文创产品', inStock:true, statusText:'有货', spec:'直径25mm/30mm/35mm', customRequirement:'提供高清矢量图，支持金/银/铜等多种金属材质', sizes:['25mm','30mm','35mm'], colors:['金色','银色','古铜色'], minOrder:1 },
  { id:3, name:'定制笔记本', price:25, stock:150, sold:324, desc:'可定制封面校园纪念笔记本，100g道林纸，锁线装订，可平摊书写。', pic:'https://picsum.photos/300/200?3', category:'wenchuang', categoryText:'文创产品', inStock:true, statusText:'有货', spec:'A5/160页', customRequirement:'可定制封面图案、封底LOGO，支持烫金/烫银工艺', sizes:['A5','B5'], colors:['典雅黑','樱花粉','天空蓝','象牙白'], minOrder:1 },
  { id:4, name:'活动横幅', price:80, stock:50, sold:87, desc:'优质牛津布材质，高清喷印，色彩鲜艳，可反复使用，支持定制尺寸。', pic:'https://picsum.photos/300/200?4', category:'wuliao', categoryText:'活动物料', inStock:true, statusText:'有货', spec:'6米/8米/10米', customRequirement:'提供CMYK格式设计稿，支持多种尺寸定制', sizes:['6m×0.8m','8m×0.8m','10m×1m','12m×1m'], colors:['红底白字','蓝底白字','黄底黑字','定制'], minOrder:50 },
  { id:5, name:'手提纸袋', price:5, stock:500, sold:1200, desc:'250g白卡纸材质，精致印刷，绳结提手，送礼佳品。', pic:'https://picsum.photos/300/200?5', category:'wuliao', categoryText:'活动物料', inStock:true, statusText:'有货', spec:'21×27×12cm', customRequirement:'可定制LOGO和图案', sizes:['小','中','大'], colors:['牛皮纸色','白色','彩色印刷'], minOrder:200 },
  { id:6, name:'马克杯', price:35, stock:0, sold:156, desc:'陶瓷马克杯，支持热转印定制，杯身可印刷照片、图案、文字。', pic:'https://picsum.photos/300/200?6', category:'wenchuang', categoryText:'文创产品', inStock:false, statusText:'缺货', spec:'350ml', customRequirement:'提供高清图片，支持整圈印刷', sizes:['350ml','500ml'], colors:['白色','黑色','渐变蓝'], minOrder:1 },
  { id:7, name:'定制帆布袋', price:28, stock:80, sold:423, desc:'16安加厚帆布，环保耐用，支持丝网印刷，多种颜色可选。', pic:'https://picsum.photos/300/200?7', category:'wuliao', categoryText:'活动物料', inStock:true, statusText:'有货', spec:'40×35×10cm', customRequirement:'支持单面/双面印刷', sizes:['标准','加大'], colors:['原色','黑色','藏青','卡其'], minOrder:50 },
  { id:8, name:'钥匙扣', price:8, stock:300, sold:892, desc:'亚克力钥匙扣，双面高清印刷，支持定制任意图案。', pic:'https://picsum.photos/300/200?8', category:'wenchuang', categoryText:'文创产品', inStock:true, statusText:'有货', spec:'5cm', customRequirement:'提供PNG透明底图片，支持异形切割', sizes:['4cm','5cm','6cm'], colors:['透明边','白边','彩印'], minOrder:1 },
  { id:9, name:'海报印刷', price:15, stock:9999, sold:2341, desc:'157g铜版纸，高清印刷，支持多种尺寸，可覆膜防水。', pic:'https://picsum.photos/300/200?9', category:'wuliao', categoryText:'活动物料', inStock:true, statusText:'有货', spec:'A3/A2/A1', customRequirement:'提供CMYK格式设计稿，支持覆哑膜/亮膜', sizes:['A4','A3','A2','A1','A0'], colors:['彩色','黑白'], minOrder:1 }
])

const currentGoods = ref({})
const bookForm = ref({ num:1, size:'', color:'', custom:'', remark:'' })
const errors = ref({})
const orders = ref([])
const currentOrder = ref({})
const selectedDesignFile = ref(null)
const favoriteIds = ref([])

// 弹窗相关
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
let pendingConfirmAction = null

const filteredGoods = computed(() => {
  let arr = goods.value
  if(filters.value.keyword) {
    const kw = filters.value.keyword.toLowerCase()
    arr = arr.filter(g => g.name.toLowerCase().includes(kw) || g.desc.toLowerCase().includes(kw) || g.categoryText.includes(filters.value.keyword))
  }
  if(filters.value.category) arr = arr.filter(g => g.category === filters.value.category)
  if(filters.value.status === 'available') arr = arr.filter(g => g.inStock)
  if(filters.value.status === 'out_of_stock') arr = arr.filter(g => !g.inStock)
  if(filters.value.minPrice !== '') arr = arr.filter(g => g.price >= Number(filters.value.minPrice))
  if(filters.value.maxPrice !== '') arr = arr.filter(g => g.price <= Number(filters.value.maxPrice))
  return arr
})

const totalPages = computed(() => Math.ceil(filteredGoods.value.length / pageSize.value) || 1)
const pendingOrderCount = computed(() => orders.value.filter(o => o.status === 1 || o.status === 2 || o.status === 3).length)
const favoriteGoods = computed(() => goods.value.filter(g => favoriteIds.value.includes(g.id)))

const paginatedGoods = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredGoods.value.slice(start, start + pageSize.value)
})

const loadFavoriteIds = () => {
  try {
    const raw = localStorage.getItem('bangbang_favorite_ids')
    const parsed = raw ? JSON.parse(raw) : []
    favoriteIds.value = Array.isArray(parsed) ? parsed : []
  } catch (error) {
    favoriteIds.value = []
  }
}

const saveFavoriteIds = () => {
  localStorage.setItem('bangbang_favorite_ids', JSON.stringify(favoriteIds.value))
}

const isFavorite = (goodsId) => favoriteIds.value.includes(goodsId)

const toggleFavorite = (goodsItem) => {
  if(!goodsItem || !goodsItem.id) return
  if(isFavorite(goodsItem.id)) {
    favoriteIds.value = favoriteIds.value.filter(id => id !== goodsItem.id)
    showSuccessDialog('已取消收藏', `${goodsItem.name} 已从收藏夹移除。`)
  } else {
    favoriteIds.value = [...favoriteIds.value, goodsItem.id]
    showSuccessDialog('收藏成功', `${goodsItem.name} 已加入收藏夹。`)
  }
  saveFavoriteIds()
}

watch(currentPage, (newVal) => {
  if(newVal < 1) currentPage.value = 1
  if(newVal > totalPages.value) currentPage.value = totalPages.value
})

const closeDialog = () => {
  showDialog.value = false
  pendingConfirmAction = null
}

// 美化弹窗函数
const showSuccessDialog = (title, message) => {
  ElMessage({
    message: `${title}：${message}`,
    type: 'success',
    duration: 2000,
    showClose: true
  })
}

const showWarningDialog = (title, message) => {
  ElMessage({
    message: `${title}：${message}`,
    type: 'warning',
    duration: 2500,
    showClose: true
  })
}

const showConfirmDialog = (title, message, action) => {
  dialogType.value = 'confirm'
  dialogTitle.value = title
  dialogMessage.value = message
  pendingConfirmAction = action
  showDialog.value = true
}

const confirmCancel = () => {
  closeDialog()
}

const confirmAction = () => {
  showDialog.value = false
  if(pendingConfirmAction) pendingConfirmAction()
  pendingConfirmAction = null
}

const go = (p) => {
  page.value = p
  errors.value = {}
  if(p === 'list') currentPage.value = 1
}

const openDetail = (g) => {
  currentGoods.value = g
  // 关键修复：这里不再给size/color赋默认值，而是设为空，让下拉框显示提示
  bookForm.value = {
    num: g.minOrder || 1,
    size: '',
    color: '',
    custom:'',
    remark:''
  }
  go('detail')
}

const goBook = () => {
  if(!currentGoods.value.inStock) {
    showWarningDialog('提示', '该商品暂时缺货！')
    return
  }
  go('book')
}

const validateNum = () => {
  const minOrder = currentGoods.value.minOrder || 1
  let num = Number(bookForm.value.num)
  if (isNaN(num) || num < minOrder) {
    num = minOrder
  } else if (num > currentGoods.value.stock) {
    num = currentGoods.value.stock
  }
  bookForm.value.num = num
}

const validateNumInput = (e) => {
  const val = e.target.value
  if (val === '') return
  const num = Number(val)
  const minOrder = currentGoods.value.minOrder || 1
  if (isNaN(num)) {
    bookForm.value.num = minOrder
  } else if (num < minOrder) {
    // 不立即纠正，让用户输入完成
  } else if (num > currentGoods.value.stock) {
    bookForm.value.num = currentGoods.value.stock
  }
}

const incrementNum = () => {
  if (bookForm.value.num < currentGoods.value.stock) {
    bookForm.value.num++
  }
}

const decrementNum = () => {
  const minOrder = currentGoods.value.minOrder || 1
  if (bookForm.value.num > minOrder) {
    bookForm.value.num--
  }
}

const validateForm = () => {
  errors.value = {}
  let valid = true
  const minOrder = currentGoods.value.minOrder || 1
  
  if(!bookForm.value.num || bookForm.value.num < minOrder) { 
    errors.value.num = `请输入有效的预订数量（${minOrder}件起订）` 
    valid = false 
  }
  if(bookForm.value.num > currentGoods.value.stock) { 
    errors.value.num = `库存不足，最多可预订 ${currentGoods.value.stock} 件` 
    valid = false 
  }
  if(!bookForm.value.size) { 
    errors.value.size = '请选择尺寸' 
    valid = false 
  }
  if(!bookForm.value.color) { 
    errors.value.color = '请选择颜色' 
    valid = false 
  }
  return valid
}

const submitOrder = () => {
  if(!currentGoods.value.inStock || currentGoods.value.stock <= 0) {
    showWarningDialog('库存不足', '该商品当前不可预订，请返回列表选择其他商品。')
    go('detail')
    return
  }
  if(!validateForm()) return
  const order = {
    goodsName: currentGoods.value.name,
    num: bookForm.value.num,
    size: bookForm.value.size,
    color: bookForm.value.color,
    custom: bookForm.value.custom,
    remark: bookForm.value.remark,
    status:1,
    statusText: bookForm.value.custom === '需要定制' ? '待上传设计稿' : '待处理'
  }
  orders.value.unshift(order)
  currentGoods.value.stock -= bookForm.value.num
  currentGoods.value.sold += bookForm.value.num
  if(currentGoods.value.stock <= 0) {
    currentGoods.value.inStock = false
    currentGoods.value.statusText = '缺货'
  }
  showSuccessDialog('预订成功', '您的预订已成功提交，请在订单列表中查看详情！')
  go('myorder')
}

const openOrderDetail = (o) => {
  currentOrder.value = o
  go('orderDetail')
}

const cancelOrder = (index) => {
  if(!orders.value[index] || orders.value[index].status !== 1) {
    showWarningDialog('无法取消', '仅待处理状态订单可以取消。')
    return
  }
  showConfirmDialog('取消订单', '确定要取消这个订单吗？', () => {
    const canceled = orders.value.splice(index, 1)[0]
    const item = goods.value.find(g => g.name === canceled.goodsName)
    if(item) {
      item.stock += canceled.num
      item.sold -= canceled.num
      if(item.stock > 0 && !item.inStock) {
        item.inStock = true
        item.statusText = '有货'
      }
    }
    showSuccessDialog('操作成功', '订单已取消！')
  })
}

const cancelCurrentOrder = () => {
  if(currentOrder.value.status !== 1) {
    showWarningDialog('无法取消', '当前订单状态不允许取消。')
    return
  }
  showConfirmDialog('取消订单', '确定要取消这个订单吗？', () => {
    const index = orders.value.findIndex(o => o === currentOrder.value)
    if(index > -1) {
      const canceled = orders.value.splice(index, 1)[0]
      const item = goods.value.find(g => g.name === canceled.goodsName)
      if(item) {
        item.stock += canceled.num
        item.sold -= canceled.num
        if(item.stock > 0 && !item.inStock) {
          item.inStock = true
          item.statusText = '有货'
        }
      }
    }
    showSuccessDialog('操作成功', '订单已取消！')
    go('myorder')
  })
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  selectedDesignFile.value = file || null
  if(file) {
    showSuccessDialog('文件已选择', `已选择：${file.name}`)
  }
}

const uploadDesign = () => {
  if(currentOrder.value.custom !== '需要定制' || currentOrder.value.status !== 1) {
    showWarningDialog('无需上传', '当前订单不处于待上传设计稿状态。')
    return
  }
  if(!selectedDesignFile.value) {
    showWarningDialog('请选择文件', '请先选择设计稿文件后再上传。')
    return
  }
  currentOrder.value.status = 2
  currentOrder.value.statusText = '制作中'
  showSuccessDialog('上传成功', `设计稿 ${selectedDesignFile.value.name} 已成功上传！`)
  selectedDesignFile.value = null
}

const finishOrder = () => {
  if(currentOrder.value.status !== 3) {
    showWarningDialog('操作无效', '只有待收货订单才可以确认收货。')
    return
  }
  showConfirmDialog('确认收货', '确认已收到商品并完成订单吗？', () => {
    currentOrder.value.status = 4
    currentOrder.value.statusText = '已完成'
    showSuccessDialog('确认收货成功', '感谢您的购买！')
  })
}

const getStatusClass = (s) => {
  const classes = {
    1: 'bg-[#fef3c7] text-[#d97706]',
    2: 'bg-[#dbeafe] text-[#2563eb]',
    3: 'bg-[#f3e8ff] text-[#6366f1]',
    4: 'bg-[#d1fae5] text-[#059669]',
    5: 'bg-[#f3f4f6] text-[#6b7280]'
  }
  return classes[s] || 'bg-[#f3f4f6] text-[#6b7280]'
}

const applyFilter = () => {
  const minPrice = Number(filters.value.minPrice)
  const maxPrice = Number(filters.value.maxPrice)
  if(filters.value.minPrice !== '' && filters.value.maxPrice !== '' && minPrice > maxPrice) {
    showWarningDialog('价格区间有误', '最低价不能高于最高价，请调整后再搜索。')
    return
  }
  currentPage.value = 1
}

const resetFilter = () => {
  filters.value = { keyword:'', category:'', status:'', minPrice:'', maxPrice:'' }
  currentPage.value = 1
}

loadFavoriteIds()
</script>

<style>
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;800&display=swap');

:root {
  --el-color-primary: #6366f1;
  --el-color-primary-light-3: #818cf8;
  --el-color-primary-light-5: #a5b4fc;
  --el-color-primary-light-7: #c7d2fe;
  --el-color-primary-light-8: #e0e7ff;
  --el-color-primary-light-9: #eef2ff;
  --el-color-primary-dark-2: #4f46e5;
  --el-border-radius-base: 12px;
}

body { font-family: 'Noto Sans SC', sans-serif; }

.el-message {
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

.select-beauty {
  width: 100%;
  height: 44px;
  padding: 0 40px 0 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.25rem;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s ease;
}

.select-beauty:hover {
  border-color: #c7d2fe;
  background: #ffffff;
}

.select-beauty:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.select-beauty:focus + .select-arrow {
  color: #6366f1;
}

.favorite-heart-btn {
  flex-shrink: 0;
  height: 36px;
  width: 36px;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  transition: transform 0.18s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.favorite-heart-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
}

.favorite-heart-btn.is-active {
  border-color: #fecaca;
  background: #fff1f2;
}

.page-transition {
  animation: fadeInUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
