<template>
  <div class="min-h-screen overflow-x-hidden" style="background: #F0F8FF; color: #2C3E50;">

    <!-- ===== 顶部导航栏 ===== -->
    <header class="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6" style="background: #FFFFFF; box-shadow: 0 2px 12px rgba(139, 92, 246, 0.08); border-bottom: 1px solid rgba(139, 92, 246, 0.08);">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); box-shadow: 0 4px 16px rgba(139, 92, 246, 0.25);">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <div>
          <h1 class="text-sm font-bold tracking-wide" style="color: #2C3E50;">校园文创预订系统</h1>
          <p class="text-[10px]" style="color: #90A4AE;">管理后台</p>
        </div>
      </div>

      <!-- Tab 导航 -->
      <nav class="hidden md:flex items-center gap-1 p-1 rounded-xl" style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.08);">
        <button
          v-for="tab in adminTabs" :key="tab.value"
          @click="navigate(tab.value)"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
          :style="activeTab === tab.value
            ? 'background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: #FFFFFF; box-shadow: 0 2px 10px rgba(139, 92, 246, 0.2);'
            : 'color: #546E7A;'"
          @mouseenter="activeTab !== tab.value ? $event.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)' : ''"
          @mouseleave="activeTab !== tab.value ? $event.currentTarget.style.background = 'transparent' : ''"
        >
          <span v-html="tab.icon"></span>
          {{ tab.label }}
        </button>
      </nav>

      <!-- 右侧 -->
      <div class="flex items-center gap-3">
        <div class="text-right hidden sm:block">
          <p class="text-xs" style="color: #90A4AE;">{{ currentDate }}</p>
          <p class="text-xs" style="color: #90A4AE; opacity: 0.6;">{{ currentTime }}</p>
        </div>
        <button @click="refresh" class="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95" style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.1);" title="刷新数据">
          <svg :class="['w-4 h-4', refreshing ? 'animate-spin' : '']" style="color: #8B5CF6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- ===== 移动端底部 Tab ===== -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-around safe-area-pb" style="background: #FFFFFF; box-shadow: 0 -2px 12px rgba(139, 92, 246, 0.08); border-top: 1px solid rgba(139, 92, 246, 0.08);">
      <button
        v-for="tab in adminTabs" :key="tab.value"
        @click="navigate(tab.value)"
        :class="['flex flex-col items-center gap-0.5 px-4 py-2 transition-all', activeTab === tab.value ? '' : '']"
        :style="activeTab === tab.value ? 'color: #8B5CF6;' : 'color: #90A4AE;'"
      >
        <span class="text-lg" v-html="tab.icon"></span>
        <span class="text-[10px] font-medium">{{ tab.label }}</span>
        <div v-if="activeTab === tab.value" class="w-1 h-1 rounded-full mt-0.5" style="background: #8B5CF6;"></div>
      </button>
    </nav>

    <!-- ===== 主内容 ===== -->
    <main class="pt-16 pb-20 md:pb-8 min-h-screen">

      <!-- ===== 数据看板 ===== -->
      <div v-if="activeTab === 'dashboard'" class="page-transition max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-5">

        <!-- 欢迎横幅 -->
        <div class="relative overflow-hidden rounded-2xl p-6 md:p-8" style="background: linear-gradient(135deg, #7C3AED, #8B5CF6); box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);">
          <!-- 噪点纹理 -->
          <div class="absolute inset-0 pointer-events-none opacity-20" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E&quot;);"></div>
          <div class="absolute -top-8 -right-8 w-64 h-64 rounded-full opacity-15 blur-3xl" style="background: rgba(255, 255, 255, 0.3);"></div>
          <div class="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 blur-2xl" style="background: rgba(255, 255, 255, 0.2);"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 class="text-xl md:text-2xl font-bold mb-1 flex items-center gap-2" style="color: white; text-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                {{ greeting }}，管理员
              </h2>
              <p style="color: rgba(255, 255, 255, 0.75); font-size: 13px;">这里是您今天的运营数据中心，随时掌握业务动态</p>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
              <div class="backdrop-blur-sm rounded-xl px-4 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" style="background: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.2);">
                <p class="text-2xl font-bold" style="color: white; text-shadow: 0 1px 4px rgba(0,0,0,0.15);">{{ adminStats.todayOrders }}</p>
                <p style="font-size: 10px; color: rgba(255, 255, 255, 0.7);">今日新增订单</p>
              </div>
              <div class="backdrop-blur-sm rounded-xl px-4 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" style="background: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.2);">
                <p class="text-2xl font-bold" style="color: white; text-shadow: 0 1px 4px rgba(0,0,0,0.15);">{{ adminStats.pendingReview }}</p>
                <p style="font-size: 10px; color: rgba(255, 255, 255, 0.7);">待审核</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 每日一句 -->
        <div class="text-center py-1">
          <p style="font-size: 12px;" :style="{ color: dailyQuote.color }">{{ dailyQuote.text }}</p>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(stat, idx) in statCards" :key="idx"
            class="group relative overflow-hidden rounded-xl p-5 cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.08); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.08);"
            :style="'--accent: ' + stat.accentColor"
            @mouseenter="$event.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.15)'; $event.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';"
            @mouseleave="$event.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.08)'; $event.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.08)';"
          >
            <!-- 渐变标题栏 -->
            <div class="absolute top-0 left-0 right-0 h-1 rounded-t-xl" :style="{ background: 'linear-gradient(90deg, ' + stat.accentColor + ', ' + stat.accentColor2 + ')' }"></div>
            <!-- 光晕 -->
            <div class="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-xl" :style="{ background: stat.accentColor }"></div>

            <div class="flex items-start justify-between mb-3 relative z-10">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" :style="{ background: stat.accentColor + '15', color: stat.accentColor }">
                <span class="text-xl" v-html="stat.icon"></span>
              </div>
            </div>

            <p class="text-3xl font-bold mb-0.5 relative z-10" style="color: #2C3E50;">{{ stat.value }}</p>
            <p class="text-sm relative z-10" style="color: #546E7A;">{{ stat.label }}</p>
            <p v-if="stat.sub" class="text-xs mt-1 relative z-10" style="color: #90A4AE;">{{ stat.sub }}</p>
          </div>
        </div>

        <!-- 订单状态 + 库存预警 -->
        <div class="grid md:grid-cols-5 gap-4">
          <!-- 订单状态分布 -->
          <div class="md:col-span-3 rounded-xl p-5 transition-all duration-300" style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.08); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.05);">
            <h3 class="text-sm font-bold mb-5 flex items-center gap-2" style="color: #2C3E50;">
              <span class="w-2 h-2 rounded-full" style="background: #A855F7; box-shadow: 0 0 8px rgba(168, 85, 247, 0.4);"></span>
              订单状态分布
            </h3>

            <!-- 步骤卡片横向 -->
            <div class="relative flex justify-between">
              <!-- 连接线 -->
              <div class="absolute top-5 left-[calc(10%/2)] right-[calc(10%/2)] h-0.5" style="background: rgba(139, 92, 246, 0.12); top: 20px; height: 2px;"></div>
              <div class="absolute top-5 left-[calc(10%/2)] h-0.5 transition-all duration-500" :style="{ width: completedLineWidth + '%', top: '20px', height: '2px', background: 'linear-gradient(90deg, #8B5CF6, #A855F7)' }"></div>

              <div
                v-for="(step, i) in orderSteps" :key="i"
                class="relative flex flex-col items-center gap-2 cursor-default group z-10"
              >
                <div
                  :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2', getStepClass(step.status, i)]"
                >
                  <svg v-if="i===0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  <svg v-else-if="i===1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <svg v-else-if="i===2" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <svg v-else-if="i===3" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="text-center">
                  <p class="text-[10px] font-medium" :style="getStepClass(step.status, i).includes('active') || getStepClass(step.status, i).includes('completed') ? 'color: #8B5CF6;' : 'color: #90A4AE;'">{{ step.label }}</p>
                  <p class="text-sm font-bold" :style="getStepClass(step.status, i).includes('active') || getStepClass(step.status, i).includes('completed') ? 'color: #8B5CF6;' : 'color: #90A4AE; opacity: 0.5;'">{{ step.count }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 库存预警 -->
          <div class="md:col-span-2 rounded-xl p-5 transition-all duration-300" style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.08); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.05);">
            <h3 class="text-sm font-bold mb-4 flex items-center gap-2" style="color: #2C3E50;">
              <svg class="w-4 h-4" style="color: #EF5350;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              库存预警
              <span class="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style="background: rgba(239, 83, 80, 0.1); color: #EF5350; border: 1px solid rgba(239, 83, 80, 0.15);">{{ adminStats.lowStockCount }}</span>
            </h3>

            <!-- 温馨空状态 -->
            <div v-if="lowStockGoods.length === 0" class="text-center py-6">
              <div class="mb-3 flex justify-center">
                <svg class="w-20 h-20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="28" fill="rgba(168, 85, 247, 0.08)" stroke="rgba(168, 85, 247, 0.2)" stroke-width="2"/>
                  <path d="M20 32l8 8 16-16" stroke="#A855F7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p style="font-size: 13px; color: #546E7A; font-weight: 500;">库存充足，订单顺利</p>
              <p style="font-size: 12px; color: #90A4AE; margin-top: 4px;">今天又是美好的一天！</p>
            </div>

            <!-- 预警列表 -->
            <div v-else class="space-y-2.5 max-h-52 overflow-y-auto custom-scrollbar">
              <div
                v-for="item in lowStockGoods" :key="item.id"
                class="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer group"
                style="background: rgba(139, 92, 246, 0.03);"
                @mouseenter="$event.currentTarget.style.background = item.stock <= 5 ? 'rgba(239, 83, 80, 0.06)' : 'rgba(255, 183, 77, 0.06)'; $event.currentTarget.style.borderColor = item.stock <= 5 ? 'rgba(239, 83, 80, 0.15)' : 'rgba(255, 183, 77, 0.15)';"
                @mouseleave="$event.currentTarget.style.background = 'rgba(139, 92, 246, 0.03)'; $event.currentTarget.style.borderColor = 'transparent';"
                @click="navigate('products'); editProduct(item)"
              >
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" :style="{ background: item.stock <= 5 ? 'rgba(239, 83, 80, 0.1)' : 'rgba(255, 183, 77, 0.1)', color: item.stock <= 5 ? '#EF5350' : '#FFB74D' }">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium truncate" style="color: #2C3E50;">{{ item.name }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="flex-1 h-1 rounded-full overflow-hidden" style="background: rgba(139, 92, 246, 0.08);">
                      <div class="h-full rounded-full" :style="{ width: Math.min(item.stock / 20 * 100, 100) + '%', background: item.stock <= 5 ? '#EF5350' : '#FFB74D' }"></div>
                    </div>
                    <span class="text-[10px] font-bold" :style="{ color: item.stock <= 5 ? '#EF5350' : '#FFB74D' }">{{ item.stock }}件</span>
                  </div>
                </div>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium" style="color: #8B5CF6;">编辑</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷入口 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            v-for="shortcut in shortcuts"
            :key="shortcut.label"
            @click="shortcut.action"
            :disabled="shortcut.disabled"
            class="group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-1"
            style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.1); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.05);"
            @mouseenter="$event.currentTarget.style.borderColor = shortcut.hoverColor + '40'; $event.currentTarget.style.boxShadow = '0 6px 20px ' + shortcut.hoverColor + '15';"
            @mouseleave="$event.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.1)'; $event.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.05)';"
          >
            <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110" :style="{ background: shortcut.hoverColor + '15', color: shortcut.hoverColor }">
              <span class="text-xl" v-html="shortcut.icon"></span>
            </div>
            <p class="text-sm font-bold mb-0.5" style="color: #2C3E50;">{{ shortcut.label }}</p>
            <p class="text-xs" style="color: #90A4AE;">{{ shortcut.sub }}</p>
          </button>
        </div>
      </div>

      <!-- ===== 订单管理 ===== -->
      <div v-if="activeTab === 'orders'" class="page-transition max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">

        <!-- 返回 + 标题 -->
        <div class="flex items-center gap-3 mb-2">
          <button @click="navigate('dashboard')" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105" style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.1); box-shadow: 0 2px 6px rgba(139, 92, 246, 0.05);">
            <svg class="w-4 h-4" style="color: #546E7A;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h2 class="text-lg font-bold flex items-center gap-2" style="color: #2C3E50;">
              <svg class="w-5 h-5" fill="none" style="color: #8B5CF6;" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              订单管理
            </h2>
            <p class="text-xs" style="color: #90A4AE;">共 {{ orderTotal }} 条订单</p>
          </div>
        </div>

        <!-- 筛选栏 -->
        <div class="rounded-xl p-4 transition-all duration-300" style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.08); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.05);">
          <!-- 胶囊标签 -->
          <div class="flex flex-wrap gap-2 mb-3">
            <button
              v-for="s in adminOrderFilters"
              :key="s.value"
              @click="orderFilter = s.value; orderPage = 1; loadOrders()"
              :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5',]"
              :style="orderFilter === s.value
                ? 'background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);'
                : 'background: rgba(139, 92, 246, 0.05); color: #546E7A; border: 1px solid rgba(139, 92, 246, 0.08);'"
              @mouseenter="orderFilter !== s.value ? $event.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)' : ''"
              @mouseleave="orderFilter !== s.value ? $event.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)' : ''"
            >
              <span v-html="s.icon"></span>
              {{ s.label }}
            </button>
          </div>
          <!-- 搜索 -->
          <div class="flex flex-wrap gap-2">
            <div class="flex-1 min-w-[200px] relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: #90A4AE;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input
                type="text" v-model="orderKeyword"
                placeholder="搜索商品名称、备注..."
                class="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-all"
                style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.background='#FFFFFF'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.background='#F0F8FF'; $event.target.style.boxShadow='none';"
                @keyup.enter="orderPage = 1; loadOrders()"
              >
            </div>
            <button
              @click="orderPage = 1; loadOrders()"
              class="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 active:scale-95 hover:shadow-md"
              style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);">
              搜索
            </button>
            <button
              @click="orderKeyword = ''; orderFilter = 'all'; orderPage = 1; loadOrders()"
              class="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style="background: rgba(144, 164, 174, 0.1); color: #546E7A; border: 1px solid rgba(144, 164, 174, 0.15);"
              @mouseenter="$event.currentTarget.style.background='rgba(144, 164, 174, 0.15)'"
              @mouseleave="$event.currentTarget.style.background='rgba(144, 164, 174, 0.1)'"
            >重置</button>
          </div>
        </div>

        <!-- 上传进度 Toast -->
        <Transition name="toast">
          <div v-if="uploadingOrderId" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm" style="background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.15); color: #A855F7;">
            <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            设计稿上传中...
          </div>
        </Transition>

        <!-- 骨架屏加载 -->
        <div v-if="loadingOrders" class="space-y-3">
          <div v-for="i in 3" :key="i" class="rounded-xl p-5 skeleton-card">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="skeleton w-10 h-10 rounded-xl"></div>
                <div>
                  <div class="skeleton w-32 h-4 rounded mb-1"></div>
                  <div class="skeleton w-20 h-3 rounded"></div>
                </div>
              </div>
              <div class="skeleton w-16 h-6 rounded-full"></div>
            </div>
            <div class="grid grid-cols-4 gap-2 mb-4">
              <div v-for="j in 4" :key="j" class="skeleton w-full h-12 rounded-lg"></div>
            </div>
            <div class="skeleton w-24 h-8 rounded-xl"></div>
          </div>
        </div>

        <!-- 订单列表 -->
        <div v-else-if="orders.length > 0" class="space-y-3">
          <div
            v-for="o in paginatedOrders" :key="o.id"
            class="rounded-xl p-5 transition-all duration-300 group"
            style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.08); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.04);"
            @mouseenter="$event.currentTarget.style.boxShadow='0 8px 24px rgba(139, 92, 246, 0.1)'; $event.currentTarget.style.borderColor='rgba(139, 92, 246, 0.15)';"
            @mouseleave="$event.currentTarget.style.boxShadow='0 2px 8px rgba(139, 92, 246, 0.04)'; $event.currentTarget.style.borderColor='rgba(139, 92, 246, 0.08)';"
          >
            <!-- 头部 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style="background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.12);">
                  <svg class="w-5 h-5" style="color: #8B5CF6;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <div>
                  <h3 class="text-sm font-bold" style="color: #2C3E50;">{{ o.goodsName }}</h3>
                  <p class="text-xs" style="color: #90A4AE;">#{{ o.id }} · {{ formatDate(o.createdAt) }}</p>
                </div>
              </div>
              <span :style="statusStyle(o.status).container">{{ o.statusText }}</span>
            </div>

            <!-- 详情网格 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div class="rounded-lg px-3 py-2" style="background: rgba(139, 92, 246, 0.03);">
                <p class="text-[10px] mb-0.5" style="color: #90A4AE;">数量</p>
                <p class="text-sm font-bold" style="color: #2C3E50;">{{ o.num }} 件</p>
              </div>
              <div v-if="o.size" class="rounded-lg px-3 py-2" style="background: rgba(139, 92, 246, 0.03);">
                <p class="text-[10px] mb-0.5" style="color: #90A4AE;">尺寸</p>
                <p class="text-sm font-bold" style="color: #2C3E50;">{{ o.size }}</p>
              </div>
              <div v-if="o.color" class="rounded-lg px-3 py-2" style="background: rgba(139, 92, 246, 0.03);">
                <p class="text-[10px] mb-0.5" style="color: #90A4AE;">颜色</p>
                <p class="text-sm font-bold" style="color: #2C3E50;">{{ o.color }}</p>
              </div>
              <div v-if="o.custom" class="rounded-lg px-3 py-2" style="background: rgba(139, 92, 246, 0.03);">
                <p class="text-[10px] mb-0.5" style="color: #90A4AE;">定制</p>
                <p class="text-sm font-bold" style="color: #2C3E50;">{{ o.custom }}</p>
              </div>
            </div>

            <!-- 备注 -->
            <p v-if="o.remark" class="text-xs mb-4 rounded-lg px-3 py-2" style="color: #546E7A; background: rgba(139, 92, 246, 0.03);">备注：{{ o.remark }}</p>

            <!-- 设计稿 -->
            <div v-if="o.designFile" class="mb-4">
              <a :href="o.designFile" target="_blank" class="inline-flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 transition-all" style="color: #A855F7; background: rgba(168, 85, 247, 0.06); border: 1px solid rgba(168, 85, 247, 0.12);">
                查看设计稿
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>

            <!-- 操作 -->
            <div class="flex flex-wrap gap-2 pt-3" style="border-top: 1px solid rgba(139, 92, 246, 0.06);">
              <div v-if="o.custom === '需要定制' && o.status === 1" class="w-full">
                <div class="rounded-xl p-3" style="background: rgba(168, 85, 247, 0.04); border: 1px dashed rgba(168, 85, 247, 0.2);">
                  <p class="text-xs font-medium mb-2" style="color: #A855F7;">为该订单上传定制设计稿</p>
                  <div class="flex flex-wrap gap-2 items-center">
                    <input type="file" :ref="el => fileInputs[o.id] = el" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf" class="text-xs flex-1 min-w-[150px]" style="color: #546E7A;">
                    <button @click="submitDesign(o)" :disabled="!fileInputs[o.id]?.files[0] || uploadingOrderId === o.id"
                      class="px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                      style="background: linear-gradient(135deg, #8B5CF6, #7C3AED);">
                      {{ uploadingOrderId === o.id ? '上传中...' : '上传设计稿' }}
                    </button>
                  </div>
                </div>
              </div>

              <template v-if="o.status === 2">
                <button @click="reviewOrder(o, 'approve')" :disabled="reviewingId === o.id"
                  class="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                  style="background: linear-gradient(135deg, #A855F7, #388E3C); box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);">
                  通过审核
                </button>
                <button @click="reviewOrder(o, 'reject')" :disabled="reviewingId === o.id"
                  class="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                  style="background: linear-gradient(135deg, #EF5350, #E53935); box-shadow: 0 4px 12px rgba(239, 83, 80, 0.2);">
                  驳回
                </button>
                <div class="flex items-center gap-1.5 ml-1">
                  <input type="number" v-model.number="o.adjustNum" :placeholder="'原:' + o.num"
                    class="w-20 px-2 py-1.5 rounded-lg text-xs transition-all" style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                    @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                    @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.boxShadow='none';"
                  >
                  <span class="text-[10px]" style="color: #90A4AE;">调整数量</span>
                </div>
              </template>

              <button v-if="o.status === 3" @click="completeOrder(o)" :disabled="completingId === o.id"
                class="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                style="background: linear-gradient(135deg, #A855F7, #388E3C); box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);">
                确认核销
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="rounded-xl p-16 text-center transition-all duration-300" style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.08); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.05);">
          <div class="mb-6 flex justify-center">
            <svg class="w-32 h-32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 纸张 -->
              <rect x="24" y="28" width="80" height="72" rx="8" fill="rgba(139, 92, 246, 0.05)" stroke="rgba(139, 92, 246, 0.12)" stroke-width="2"/>
              <!-- 横线 -->
              <line x1="36" y1="50" x2="92" y2="50" stroke="rgba(139, 92, 246, 0.15)" stroke-width="2" stroke-linecap="round"/>
              <line x1="36" y1="62" x2="80" y2="62" stroke="rgba(139, 92, 246, 0.1)" stroke-width="2" stroke-linecap="round"/>
              <line x1="36" y1="74" x2="72" y2="74" stroke="rgba(139, 92, 246, 0.08)" stroke-width="2" stroke-linecap="round"/>
              <!-- 铅笔 -->
              <path d="M88 88L96 96L92 100L84 92L88 88Z" fill="rgba(255, 183, 77, 0.3)" stroke="rgba(255, 183, 77, 0.5)" stroke-width="1.5" stroke-linejoin="round"/>
              <line x1="80" y1="96" x2="84" y2="92" stroke="rgba(255, 183, 77, 0.4)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <p style="font-size: 14px; color: #546E7A; margin-bottom: 8px; font-weight: 500;">当前还没有订单哦～</p>
          <p style="font-size: 12px; color: #90A4AE; margin-bottom: 16px;">等待用户下单后，这里会展示订单信息</p>
          <button @click="orderKeyword = ''; orderFilter = 'all'; orderPage = 1; loadOrders()"
            class="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
            style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.2);">
            清除筛选
          </button>
        </div>

        <!-- 分页 -->
        <div v-if="orderTotal > orderPageSize" class="flex justify-center gap-2 flex-wrap">
          <button @click="orderPage--; loadOrders()" :disabled="orderPage === 1"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style="background: #FFFFFF; color: #546E7A; border: 1px solid rgba(139, 92, 246, 0.1);">上一页</button>
          <div class="px-4 py-2 rounded-lg text-sm font-medium"
            style="background: rgba(139, 92, 246, 0.08); color: #8B5CF6; border: 1px solid rgba(139, 92, 246, 0.15);">
            第 {{ orderPage }} / {{ totalPages }} 页
          </div>
          <button @click="orderPage++; loadOrders()" :disabled="orderPage >= totalPages"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style="background: #FFFFFF; color: #546E7A; border: 1px solid rgba(139, 92, 246, 0.1);">下一页</button>
        </div>
      </div>

      <!-- ===== 商品管理 ===== -->
      <div v-if="activeTab === 'products'" class="page-transition max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">

        <!-- 标题 + 操作 -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <button @click="navigate('dashboard')" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105" style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.1); box-shadow: 0 2px 6px rgba(139, 92, 246, 0.05);">
              <svg class="w-4 h-4" style="color: #546E7A;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div>
              <h2 class="text-lg font-bold flex items-center gap-2" style="color: #2C3E50;">
                <svg class="w-5 h-5" style="color: #8B5CF6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                商品管理
              </h2>
              <p class="text-xs" style="color: #90A4AE;">共 {{ productTotal }} 件商品</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="triggerImport"
              class="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
              style="background: rgba(144, 164, 174, 0.1); color: #546E7A; border: 1px solid rgba(144, 164, 174, 0.15);"
              @mouseenter="$event.currentTarget.style.background='rgba(144, 164, 174, 0.15)'"
              @mouseleave="$event.currentTarget.style.background='rgba(144, 164, 174, 0.1)'"
            >
              批量导入
            </button>
            <button @click="openAddProduct"
              class="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); box-shadow: 0 4px 14px rgba(139, 92, 246, 0.2);">
              添加商品
            </button>
          </div>
        </div>

        <!-- 骨架屏 -->
        <div v-if="loadingProducts" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div v-for="i in 8" :key="i" class="rounded-xl overflow-hidden skeleton-card">
            <div class="skeleton h-36"></div>
            <div class="p-4">
              <div class="skeleton w-3/4 h-4 rounded mb-2"></div>
              <div class="skeleton w-1/2 h-3 rounded mb-3"></div>
              <div class="skeleton w-full h-2 rounded mb-3"></div>
              <div class="skeleton w-full h-8 rounded"></div>
            </div>
          </div>
        </div>

        <!-- 商品网格 -->
        <div v-else-if="goods.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <div
            v-for="g in productsPage" :key="g.id"
            class="group rounded-xl overflow-hidden transition-all duration-300"
            style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.08); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.04);"
            :style="'--stock-color: ' + (g.stock <= 5 ? '#EF5350' : g.stock <= 10 ? '#FFB74D' : '#A855F7')"
            @mouseenter="$event.currentTarget.style.boxShadow='0 8px 24px rgba(139, 92, 246, 0.12)'; $event.currentTarget.style.borderColor='rgba(139, 92, 246, 0.15)'; $event.currentTarget.style.transform='translateY(-2px)';"
            @mouseleave="$event.currentTarget.style.boxShadow='0 2px 8px rgba(139, 92, 246, 0.04)'; $event.currentTarget.style.borderColor='rgba(139, 92, 246, 0.08)'; $event.currentTarget.style.transform='translateY(0)';"
          >
            <!-- 图片 -->
            <div class="relative h-36 overflow-hidden" style="background: rgba(139, 92, 246, 0.02);">
              <img v-if="g.pic" :src="g.pic" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" @error="g.pic = ''">
              <div v-else class="w-full h-full flex items-center justify-center" style="background: rgba(139, 92, 246, 0.03);">
                <svg class="w-12 h-12" viewBox="0 0 48 48" fill="none">
                  <rect x="4" y="4" width="40" height="40" rx="4" fill="rgba(139, 92, 246, 0.05)" stroke="rgba(139, 92, 246, 0.1)" stroke-width="1.5"/>
                  <rect x="8" y="8" width="32" height="32" rx="3" fill="rgba(139, 92, 246, 0.03)" stroke="rgba(139, 92, 246, 0.06)" stroke-width="1"/>
                  <text x="24" y="30" text-anchor="middle" fill="rgba(139, 92, 246, 0.3)" font-size="11" font-weight="bold">文创</text>
                </svg>
              </div>
              <!-- 分类 -->
              <div class="absolute top-2 left-2">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm border"
                  :style="g.category === 'wenchuang' ? 'background: rgba(139, 92, 246, 0.1); color: #8B5CF6; border-color: rgba(139, 92, 246, 0.15);' : 'background: rgba(168, 85, 247, 0.1); color: #A855F7; border-color: rgba(168, 85, 247, 0.15);'">
                  {{ g.categoryText }}
                </span>
              </div>
              <!-- 库存条 -->
              <div class="absolute bottom-0 left-0 right-0 h-1.5" style="background: rgba(139, 92, 246, 0.06);">
                <div class="h-full transition-all duration-700" :style="{ width: Math.min(g.stock / 100 * 100, 100) + '%', background: 'linear-gradient(90deg, var(--stock-color), var(--stock-color)aa)' }"></div>
              </div>
            </div>

            <!-- 信息 -->
            <div class="p-4">
              <div class="flex items-start justify-between gap-2 mb-2">
                <h3 class="text-sm font-bold truncate flex-1" style="color: #2C3E50;">{{ g.name }}</h3>
                <span class="text-sm font-bold flex-shrink-0" style="color: #8B5CF6;">¥{{ g.price }}</span>
              </div>
              <p class="text-xs truncate mb-3" style="color: #90A4AE;">{{ g.spec || g.desc || '暂无规格描述' }}</p>

              <!-- 库存进度 -->
              <div class="flex items-center gap-2 mb-3 text-xs">
                <div class="flex-1">
                  <div class="flex justify-between mb-1" style="color: #90A4AE;">
                    <span>库存</span>
                    <span class="font-bold" :style="{ color: g.stock <= 5 ? '#EF5350' : g.stock <= 10 ? '#FFB74D' : '#546E7A' }">{{ g.stock }}</span>
                  </div>
                  <div class="h-1.5 rounded-full overflow-hidden" style="background: rgba(139, 92, 246, 0.06);">
                    <div class="h-full rounded-full transition-all duration-700" :style="{ width: Math.min(g.stock / 100 * 100, 100) + '%', background: 'linear-gradient(90deg, var(--stock-color), var(--stock-color)aa)' }"></div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[10px]" style="color: #90A4AE; opacity: 0.5;">已售</p>
                  <p class="text-xs font-bold" style="color: #90A4AE;">{{ g.sold }}</p>
                </div>
              </div>

              <!-- 操作 -->
              <div class="flex gap-2 pt-2" style="border-top: 1px solid rgba(139, 92, 246, 0.05);">
                <button @click="toggleStock(g)" :disabled="togglingId === g.id"
                  class="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                  :style="g.inStock
                    ? 'background: rgba(168, 85, 247, 0.08); color: #A855F7; border: 1px solid rgba(168, 85, 247, 0.15);'
                    : 'background: rgba(239, 83, 80, 0.06); color: #EF5350; border: 1px solid rgba(239, 83, 80, 0.12);'"
                  @mouseenter="$event.currentTarget.style.opacity='0.8'"
                  @mouseleave="$event.currentTarget.style.opacity='1'"
                >
                  {{ togglingId === g.id ? '...' : g.inStock ? '上架中' : '已下架' }}
                </button>
                <button @click="editProduct(g)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style="background: rgba(139, 92, 246, 0.05); color: #546E7A; border: 1px solid rgba(139, 92, 246, 0.08);">编辑</button>
                <button @click="deleteProduct(g)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style="background: rgba(239, 83, 80, 0.05); color: rgba(239, 83, 80, 0.7); border: 1px solid rgba(239, 83, 80, 0.1);">删除</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="rounded-xl p-16 text-center transition-all duration-300" style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.08); box-shadow: 0 2px 8px rgba(139, 92, 246, 0.05);">
          <div class="mb-6 flex justify-center">
            <svg class="w-32 h-32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 礼盒主体 -->
              <rect x="28" y="50" width="72" height="56" rx="6" fill="rgba(139, 92, 246, 0.05)" stroke="rgba(139, 92, 246, 0.15)" stroke-width="2"/>
              <rect x="28" y="50" width="72" height="18" rx="6" fill="rgba(139, 92, 246, 0.08)" stroke="rgba(139, 92, 246, 0.2)" stroke-width="2"/>
              <!-- 蝴蝶结 -->
              <ellipse cx="64" cy="50" rx="14" ry="8" fill="rgba(139, 92, 246, 0.1)" stroke="rgba(139, 92, 246, 0.2)" stroke-width="1.5"/>
              <circle cx="64" cy="50" r="4" fill="rgba(139, 92, 246, 0.15)"/>
              <!-- 丝带 -->
              <line x1="64" y1="50" x2="64" y2="106" stroke="rgba(139, 92, 246, 0.15)" stroke-width="2"/>
              <line x1="28" y1="78" x2="100" y2="78" stroke="rgba(139, 92, 246, 0.15)" stroke-width="2"/>
              <!-- 星星装饰 -->
              <circle cx="44" cy="36" r="4" fill="rgba(255, 183, 77, 0.15)" stroke="rgba(255, 183, 77, 0.25)" stroke-width="1"/>
              <circle cx="84" cy="36" r="4" fill="rgba(255, 183, 77, 0.15)" stroke="rgba(255, 183, 77, 0.25)" stroke-width="1"/>
              <circle cx="64" cy="28" r="4" fill="rgba(255, 183, 77, 0.15)" stroke="rgba(255, 183, 77, 0.25)" stroke-width="1"/>
            </svg>
          </div>
          <p style="font-size: 14px; color: #546E7A; margin-bottom: 6px; font-weight: 500;">还没有上架商品哦～</p>
          <p style="font-size: 12px; color: #90A4AE; margin-bottom: 20px;">点击下方按钮，开始添加你的第一款文创吧</p>
          <button @click="openAddProduct"
            class="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
            style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.25);">
            添加商品
          </button>
        </div>

        <!-- 分页 -->
        <div v-if="productTotalPages > 1" class="flex justify-center gap-2 flex-wrap">
          <button @click="productPage--; loadProducts()" :disabled="productPage === 1"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style="background: #FFFFFF; color: #546E7A; border: 1px solid rgba(139, 92, 246, 0.1);">上一页</button>
          <div class="px-4 py-2 rounded-lg text-sm font-medium"
            style="background: rgba(139, 92, 246, 0.08); color: #8B5CF6; border: 1px solid rgba(139, 92, 246, 0.15);">
            第 {{ productPage }} / {{ productTotalPages }} 页
          </div>
          <button @click="productPage++; loadProducts()" :disabled="productPage >= productTotalPages"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style="background: #FFFFFF; color: #546E7A; border: 1px solid rgba(139, 92, 246, 0.1);">下一页</button>
        </div>

        <!-- 商品弹窗 -->
        <Transition name="dialog">
          <div v-if="showProductModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showProductModal = false">
            <div class="absolute inset-0" style="background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);"></div>
            <div class="relative rounded-xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar" style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.1); box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);">
              <div class="p-6">
                <div class="flex items-center justify-between mb-5">
                  <h3 class="text-base font-bold" style="color: #2C3E50;">{{ productForm.id ? '编辑商品' : '添加商品' }}</h3>
                  <button @click="showProductModal = false" class="w-7 h-7 rounded-lg flex items-center justify-center transition-all" style="background: rgba(139, 92, 246, 0.05);"
                    @mouseenter="$event.currentTarget.style.background='rgba(139, 92, 246, 0.1)'"
                    @mouseleave="$event.currentTarget.style.background='rgba(139, 92, 246, 0.05)'">
                    <svg class="w-4 h-4" style="color: #546E7A;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-medium mb-1.5" style="color: #546E7A;">商品名称 <span style="color: #EF5350;">*</span></label>
                    <input v-model="productForm.name" class="w-full px-4 py-2.5 rounded-xl text-sm transition-all" style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                      @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.background='#FFFFFF'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                      @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.background='#F0F8FF'; $event.target.style.boxShadow='none';"
                      placeholder="请输入商品名称">
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-medium mb-1.5" style="color: #546E7A;">价格 (元) <span style="color: #EF5350;">*</span></label>
                      <input type="number" v-model.number="productForm.price" class="w-full px-4 py-2.5 rounded-xl text-sm transition-all" style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                        @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.background='#FFFFFF'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                        @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.background='#F0F8FF'; $event.target.style.boxShadow='none';"
                        placeholder="0.00">
                    </div>
                    <div>
                      <label class="block text-xs font-medium mb-1.5" style="color: #546E7A;">库存 <span style="color: #EF5350;">*</span></label>
                      <input type="number" v-model.number="productForm.stock" class="w-full px-4 py-2.5 rounded-xl text-sm transition-all" style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                        @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.background='#FFFFFF'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                        @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.background='#F0F8FF'; $event.target.style.boxShadow='none';"
                        placeholder="0">
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-medium mb-1.5" style="color: #546E7A;">分类</label>
                      <select v-model="productForm.category" class="w-full px-4 py-2.5 rounded-xl text-sm transition-all" style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;">
                        <option value="wenchuang">文创产品</option>
                        <option value="wuliao">活动物料</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium mb-1.5" style="color: #546E7A;">最低起订量</label>
                      <input type="number" v-model.number="productForm.minOrder" class="w-full px-4 py-2.5 rounded-xl text-sm transition-all" style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                        @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.background='#FFFFFF'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                        @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.background='#F0F8FF'; $event.target.style.boxShadow='none';"
                        placeholder="1">
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1.5" style="color: #546E7A;">商品规格</label>
                    <input v-model="productForm.spec" class="w-full px-4 py-2.5 rounded-xl text-sm transition-all" style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                      @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.background='#FFFFFF'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                      @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.background='#F0F8FF'; $event.target.style.boxShadow='none';"
                      placeholder="如：S/M/L/XL 多尺码">
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1.5" style="color: #546E7A;">商品描述</label>
                    <textarea v-model="productForm.desc" rows="2" class="w-full px-4 py-3 rounded-xl text-sm resize-none transition-all" style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                      @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.background='#FFFFFF'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                      @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.background='#F0F8FF'; $event.target.style.boxShadow='none';"
                      placeholder="请输入商品描述..."></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1.5" style="color: #546E7A;">定制要求</label>
                    <textarea v-model="productForm.customRequirement" rows="2" class="w-full px-4 py-3 rounded-xl text-sm resize-none transition-all" style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                      @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.background='#FFFFFF'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                      @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.background='#F0F8FF'; $event.target.style.boxShadow='none';"
                      placeholder="请输入定制要求..."></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1.5" style="color: #546E7A;">图片地址</label>
                    <input v-model="productForm.pic" class="w-full px-4 py-2.5 rounded-xl text-sm transition-all" style="background: #F0F8FF; border: 1px solid rgba(139, 92, 246, 0.1); color: #2C3E50;"
                      @focus="$event.target.style.borderColor='rgba(139, 92, 246, 0.4)'; $event.target.style.background='#FFFFFF'; $event.target.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)';"
                      @blur="$event.target.style.borderColor='rgba(139, 92, 246, 0.1)'; $event.target.style.background='#F0F8FF'; $event.target.style.boxShadow='none';"
                      placeholder="https://...">
                    <div v-if="productForm.pic" class="mt-2">
                      <img :src="productForm.pic" class="w-20 h-14 rounded-lg object-cover" style="border: 1px solid rgba(139, 92, 246, 0.08);" @error="productForm.pic = ''">
                    </div>
                  </div>
                </div>
                <div class="flex gap-3 mt-6">
                  <button @click="saveProduct" :disabled="savingProduct"
                    class="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); box-shadow: 0 4px 14px rgba(139, 92, 246, 0.2);">
                    {{ savingProduct ? '保存中...' : '保存' }}
                  </button>
                  <button @click="showProductModal = false"
                    class="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                    style="background: rgba(144, 164, 174, 0.1); color: #546E7A; border: 1px solid rgba(144, 164, 174, 0.15);">
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </main>

    <!-- ===== 导入结果弹窗 ===== -->
    <Transition name="dialog">
      <div v-if="showImportResult" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showImportResult = false">
        <div class="absolute inset-0" style="background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px);"></div>
        <div class="relative rounded-xl max-w-md w-full overflow-hidden" style="background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.1); box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);">
          <div class="p-6">
            <h3 class="text-base font-bold mb-4 flex items-center gap-2" style="color: #2C3E50;">批量导入结果</h3>
            <div v-if="importData.successCount > 0" class="mb-4 p-3 rounded-xl" style="background: rgba(168, 85, 247, 0.06); border: 1px solid rgba(168, 85, 247, 0.1);">
              <p class="text-sm font-medium" style="color: #A855F7;">成功导入 {{ importData.successCount }} 件商品</p>
            </div>
            <div v-if="importData.errors && importData.errors.length > 0">
              <p class="text-sm font-medium mb-2" style="color: #EF5350;">导入失败 {{ importData.errors.length }} 条</p>
              <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                <div v-for="(err, idx) in importData.errors" :key="idx" class="rounded-xl p-3 text-xs" style="background: rgba(239, 83, 80, 0.04); border: 1px solid rgba(239, 83, 80, 0.1); color: #EF5350;">
                  第 {{ err.row }} 行「{{ err.field }}」：{{ err.reason }}
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-center">
              <button @click="showImportResult = false; loadProducts(); loadStats()"
                class="px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); box-shadow: 0 4px 14px rgba(139, 92, 246, 0.2);">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 隐藏导入 -->
    <input type="file" ref="importInputRef" accept=".xlsx,.xls,.csv" class="hidden" @change="handleImport">
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from './api'

// ============ 状态 ============
const activeTab = ref('dashboard')
const refreshing = ref(false)
const loadingOrders = ref(false)
const loadingProducts = ref(false)
const currentDate = ref('')
const currentTime = ref('')
let clockTimer = null

const adminTabs = [
  { value: 'dashboard', label: '数据看板', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' },
  { value: 'orders', label: '订单管理', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
  { value: 'products', label: '商品管理', icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
]

// ============ 数据 ============
const adminStats = ref({
  todayOrders: 0, pendingReview: 0, pendingDesign: 0,
  lowStockCount: 0, totalOrders: 0, totalProducts: 0, todayRevenue: 0
})
const lowStockGoods = ref([])
const goods = ref([])
const orders = ref([])

// ============ 商品列表 ============
const productPage = ref(1)
const productPageSize = 8
const productTotalPages = ref(1)
const productsPage = computed(() => goods.value.map(g => ({
  ...g,
  inStock: g.stock > 0,
  statusText: productStatusMap[g.stock > 0] || '已下架',
  categoryText: productCategoryMap[g.category] || g.category,
})))
const productTotal = ref(0)

const adminOrderFilters = [
  { value: 'all', label: '全部', icon: '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>' },
  { value: 1, label: '待上传', icon: '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"/></svg>' },
  { value: 2, label: '待审核', icon: '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { value: 3, label: '制作中', icon: '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>' },
  { value: 4, label: '已完成', icon: '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { value: 5, label: '已驳回', icon: '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
]

// ============ 订单列表 ============
const orderFilter = ref('all')
const orderKeyword = ref('')
const orderPage = ref(1)
const orderPageSize = 10
const orderTotal = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(orderTotal.value / orderPageSize)))
const filteredOrders = computed(() => orders.value)

const paginatedOrders = computed(() => {
  const start = (orderPage.value - 1) * orderPageSize
  return filteredOrders.value.slice(start, start + orderPageSize).map(o => ({
    ...o,
    statusText: orderStatusMap[o.status] || '未知',
  }))
})

const orderStatusMap = { 1: '待上传设计稿', 2: '待审核', 3: '制作中', 4: '已完成', 5: '已驳回' }
const productStatusMap = { true: '有货', false: '已下架' }
const productCategoryMap = { wenchuang: '文创产品', wuliao: '活动物料' }

// ============ 商品表单 ============
const showProductModal = ref(false)
const savingProduct = ref(false)
const productForm = ref({
  id: null, name: '', price: 0, stock: 0, category: 'wenchuang',
  spec: '', desc: '', customRequirement: '', pic: '', minOrder: 1,
})

// ============ 操作状态 ============
const uploadingOrderId = ref(null)
const reviewingId = ref(null)
const completingId = ref(null)
const togglingId = ref(null)
const exporting = ref(false)
const fileInputs = reactive({})

// ============ 导入 ============
const importInputRef = ref(null)
const showImportResult = ref(false)
const importData = ref({ successCount: 0, errors: [] })

// ============ 计算属性 ============
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 9) return '早上好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  if (h < 21) return '傍晚好'
  return '晚上好'
})

const dailyQuotes = [
  { text: '今日也是元气满满的文创打工人～', color: 'rgba(139, 92, 246, 0.7)' },
  { text: '每一件文创，都承载着校园的美好回忆', color: 'rgba(168, 85, 247, 0.7)' },
  { text: '用心做好每一件产品，用情服务每一位同学', color: 'rgba(167, 139, 250, 0.7)' },
  { text: '库存充足，订单顺利，今天又是美好的一天！', color: 'rgba(139, 92, 246, 0.7)' },
  { text: '让创意落地，让美好发生', color: 'rgba(168, 85, 247, 0.7)' },
]
const dailyQuote = computed(() => dailyQuotes[new Date().getDay() % dailyQuotes.length])

const statCards = computed(() => [
  {
    label: '今日新增订单', value: adminStats.value.todayOrders,
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
    accentColor: '#8B5CF6', accentColor2: '#7C3AED', sub: '用户总数 / 项目总数'
  },
  {
    label: '待审核订单', value: adminStats.value.pendingReview,
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    accentColor: '#FFB74D', accentColor2: '#FFA726', sub: '待处理流程'
  },
  {
    label: '待审核定制图', value: adminStats.value.pendingDesign,
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    accentColor: '#AB47BC', accentColor2: '#9C27B0', sub: '创意设计审核'
  },
  {
    label: '库存预警商品', value: adminStats.value.lowStockCount,
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
    accentColor: '#EF5350', accentColor2: '#E53935', sub: '及时补货，避免缺货'
  },
])

const orderSteps = computed(() => [
  { label: '待上传', status: 1, count: orders.value.filter(o => o.status === 1).length },
  { label: '待审核', status: 2, count: orders.value.filter(o => o.status === 2).length },
  { label: '制作中', status: 3, count: orders.value.filter(o => o.status === 3).length },
  { label: '已完成', status: 4, count: orders.value.filter(o => o.status === 4).length },
])

const completedLineWidth = computed(() => {
  if (!orders.value.length) return 0
  const maxStatus = Math.max(...orders.value.map(o => o.status).filter(s => s), 0)
  return Math.max(0, (maxStatus - 1) / 3 * 100)
})

function getStepClass(status, index) {
  const stepStatus = [1, 2, 3, 4][index]
  const maxActive = Math.max(...orders.value.map(o => o.status).filter(s => s), 0)
  if (maxActive >= stepStatus) {
    if (maxActive === stepStatus) return 'active-step'
    if (stepStatus === 4 && maxActive > stepStatus) return 'completed-step'
    return 'completed-step'
  }
  return 'pending-step'
}

const shortcuts = computed(() => [
  { label: '订单管理', sub: `${adminStats.value.totalOrders} 条订单待处理`, icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>', action: () => navigate('orders'), hoverColor: '#8B5CF6', disabled: false },
  { label: '商品管理', sub: `${adminStats.value.totalProducts} 件商品在架`, icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>', action: () => navigate('products'), hoverColor: '#A855F7', disabled: false },
  { label: '批量导入', sub: 'Excel / CSV 批量上架', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>', action: () => triggerImport(), hoverColor: '#AB47BC', disabled: false },
  { label: '导出报表', sub: '下载 Excel / CSV', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>', action: () => handleExport(), hoverColor: '#A855F7', disabled: exporting.value },
])

// ============ 时钟 ============
function updateClock() {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// ============ 刷新 ============
async function refresh() {
  refreshing.value = true
  await Promise.all([loadStats(), activeTab.value === 'orders' ? loadOrders() : null, activeTab.value === 'products' ? loadProducts() : null])
  refreshing.value = false
}

// ============ 数据加载 ============
async function loadStats() {
  try {
    const data = await api.stats()
    adminStats.value = data
    lowStockGoods.value = data.lowStockList || []
  } catch (e) {
    ElMessage.error('加载统计数据失败：' + e.message)
  }
}

async function loadProducts() {
  loadingProducts.value = true
  try {
    const params = { page: productPage.value, pageSize: productPageSize }
    const res = await api.products.list(params)
    goods.value = res.list
    productTotal.value = res.pagination.total
    productTotalPages.value = res.pagination.totalPages
  } catch (e) {
    ElMessage.error('加载商品列表失败：' + e.message)
  } finally {
    loadingProducts.value = false
  }
}

async function loadOrders() {
  loadingOrders.value = true
  try {
    const params = { page: orderPage.value, pageSize: orderPageSize }
    if (orderFilter.value !== 'all') params.status = orderFilter.value
    if (orderKeyword.value) params.keyword = orderKeyword.value
    const res = await api.orders.list(params)
    orders.value = res.list
    orderTotal.value = res.pagination.total
  } catch (e) {
    ElMessage.error('加载订单列表失败：' + e.message)
  } finally {
    loadingOrders.value = false
  }
}

// ============ 导航 ============
function navigate(tab) {
  activeTab.value = tab
  if (tab === 'dashboard') loadStats()
  if (tab === 'products') { productPage.value = 1; loadProducts() }
  if (tab === 'orders') { orderPage.value = 1; orderFilter.value = 'all'; orderKeyword.value = ''; loadOrders() }
}

// ============ 商品 CRUD ============
const openAddProduct = () => {
  productForm.value = { id: null, name: '', price: 0, stock: 0, category: 'wenchuang', spec: '', desc: '', customRequirement: '', pic: '', minOrder: 1 }
  showProductModal.value = true
}
const editProduct = (g) => {
  productForm.value = { ...g }
  showProductModal.value = true
}
const saveProduct = async () => {
  if (!productForm.value.name?.trim()) { ElMessage.warning('商品名称不能为空'); return }
  if (!productForm.value.price || productForm.value.price <= 0) { ElMessage.warning('商品价格必须大于 0'); return }
  savingProduct.value = true
  try {
    if (productForm.value.id) {
      await api.products.update(productForm.value.id, productForm.value)
      ElMessage.success('商品更新成功')
    } else {
      await api.products.create(productForm.value)
      ElMessage.success('商品创建成功')
    }
    showProductModal.value = false
    await loadProducts()
    await loadStats()
  } catch (e) {
    if (e.errors?.length) { e.errors.forEach(err => ElMessage.error(`「${err.field}」：${err.reason}`)) }
    else { ElMessage.error(e.message) }
  } finally {
    savingProduct.value = false
  }
}
const deleteProduct = (g) => {
  ElMessage.confirm(`确定删除「${g.name}」？`, '删除商品', { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' })
    .then(async () => {
      try {
        await api.products.remove(g.id)
        ElMessage.success('商品已删除')
        await loadProducts()
        await loadStats()
      } catch (e) { ElMessage.error(e.message) }
    }).catch(() => {})
}
const toggleStock = async (g) => {
  togglingId.value = g.id
  try {
    await api.products.toggleStock(g.id, !g.inStock)
    g.inStock = !g.inStock
    g.statusText = g.inStock ? '有货' : '已下架'
    ElMessage.success(`商品已${g.inStock ? '上架' : '下架'}`)
    await loadStats()
  } catch (e) { ElMessage.error(e.message) } finally {
    togglingId.value = null
  }
}

// ============ 设计稿上传 ============
const submitDesign = async (o) => {
  const input = fileInputs[o.id]
  const file = input?.files?.[0]
  if (!file) return
  uploadingOrderId.value = o.id
  const fd = new FormData()
  fd.append('file', file)
  try {
    const result = await api.orders.uploadDesign(o.id, fd)
    o.designFile = result.designFile
    o.status = 2
    o.statusText = '待审核'
    ElMessage.success('设计稿上传成功，订单进入待审核状态')
    if (input) input.value = ''
    await loadStats()
  } catch (e) {
    if (e.errors?.length) { e.errors.forEach(err => ElMessage.error(`「${err.field}」：${err.reason}`)) }
    else { ElMessage.error(e.message) }
  } finally {
    uploadingOrderId.value = null
  }
}

// ============ 审核 ============
const reviewOrder = async (o, action) => {
  reviewingId.value = o.id
  try {
    const data = { action }
    if (action === 'approve' && o.adjustNum && o.adjustNum > 0) data.adjustNum = o.adjustNum
    await api.orders.review(o.id, data)
    if (action === 'approve') {
      o.status = 3; o.statusText = '制作中'
      if (o.adjustNum) o.num = o.adjustNum
      ElMessage.success('审核通过，订单进入制作中状态')
    } else {
      o.status = 5; o.statusText = '已驳回'
      ElMessage.success('订单已驳回，库存已返还')
    }
    await loadStats()
  } catch (e) {
    if (e.errors?.length) { e.errors.forEach(err => ElMessage.error(`「${err.field}」：${err.reason}`)) }
    else { ElMessage.error(e.message) }
  } finally {
    reviewingId.value = null
  }
}

// ============ 核销 ============
const completeOrder = async (o) => {
  completingId.value = o.id
  try {
    await api.orders.complete(o.id)
    o.status = 4; o.statusText = '已完成'
    ElMessage.success('订单核销完成')
    await loadStats()
  } catch (e) { ElMessage.error(e.message) } finally {
    completingId.value = null
  }
}

// ============ 导入 ============
const triggerImport = () => importInputRef.value?.click()
const handleImport = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('file', file)
  try {
    const result = await api.products.import(fd)
    importData.value = result
    showImportResult.value = true
    if (result.successCount > 0) ElMessage.success(`导入完成：成功 ${result.successCount} 条，失败 ${result.errors?.length || 0} 条`)
    else ElMessage.warning(`导入完成：成功 0 条，失败 ${result.errors?.length || 0} 条`)
    await loadProducts()
    await loadStats()
  } catch (e) { ElMessage.error(e.message) }
  e.target.value = ''
}

// ============ 导出 ============
const handleExport = async () => {
  exporting.value = true
  try {
    const params = {}
    if (orderFilter.value !== 'all') params.status = orderFilter.value
    if (orderKeyword.value) params.keyword = orderKeyword.value
    await api.orders.export(params)
    ElMessage.success('报表导出成功')
  } catch (e) { ElMessage.error('导出失败：' + e.message) } finally {
    exporting.value = false
  }
}

// ============ 工具 ============
const statusStyle = (s) => {
  const styles = {
    1: { container: 'padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: rgba(255, 183, 77, 0.1); color: #FFB74D; border: 1px solid rgba(255, 183, 77, 0.15);' },
    2: { container: 'padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: rgba(139, 92, 246, 0.1); color: #8B5CF6; border: 1px solid rgba(139, 92, 246, 0.15);' },
    3: { container: 'padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: rgba(255, 183, 77, 0.12); color: #FFB74D; border: 1px solid rgba(255, 183, 77, 0.2);' },
    4: { container: 'padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: rgba(168, 85, 247, 0.1); color: #A855F7; border: 1px solid rgba(168, 85, 247, 0.15);' },
    5: { container: 'padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: rgba(239, 83, 80, 0.08); color: #EF5350; border: 1px solid rgba(239, 83, 80, 0.12);' },
  }
  return styles[s] || styles[5]
}

const formatDate = (str) => {
  if (!str) return '刚刚'
  const d = new Date(str)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return d.toLocaleDateString('zh-CN')
}

// ============ 初始化 ============
onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  loadStats()
})
onUnmounted(() => { if (clockTimer) clearInterval(clockTimer) })
</script>

<style>
/* ===== 步骤状态 ===== */
.active-step {
  border-color: #8B5CF6 !important;
  color: #8B5CF6 !important;
  background: rgba(139, 92, 246, 0.1) !important;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1) !important;
}
.completed-step {
  border-color: #A855F7 !important;
  color: #A855F7 !important;
  background: rgba(168, 85, 247, 0.1) !important;
}
.pending-step {
  border-color: rgba(144, 164, 174, 0.3) !important;
  color: rgba(144, 164, 174, 0.4) !important;
  background: rgba(144, 164, 174, 0.05) !important;
}

/* ===== 动画 ===== */
.page-transition { animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.dialog-enter-active, .dialog-leave-active { transition: all 0.25s ease; }
.dialog-enter-from, .dialog-leave-to { opacity: 0; transform: scale(0.95); }

.toast-enter-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(20px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }

/* ===== 骨架屏 ===== */
.skeleton {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.04) 25%, rgba(139, 92, 246, 0.08) 50%, rgba(139, 92, 246, 0.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skeleton-card { background: #FFFFFF; border: 1px solid rgba(139, 92, 246, 0.08); border-radius: 12px; }

/* ===== 滚动条 ===== */
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.12); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.2); }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.08); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.15); }

/* ===== 安全区 ===== */
.safe-area-pb { padding-bottom: env(safe-area-inset-bottom, 0); }

/* ===== 输入 ===== */
input, select, textarea { outline-color: #8B5CF6; font-family: 'Source Han Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif; }
input::placeholder, textarea::placeholder { color: rgba(144, 164, 174, 0.5); }
input[type="file"]::file-selector-button {
  background: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
  border: none;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
input[type="file"]::file-selector-button:hover { background: rgba(139, 92, 246, 0.18); }

/* ===== 按钮波纹效果 ===== */
button { position: relative; overflow: hidden; }
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: rippleEffect 0.6s linear;
  pointer-events: none;
}
@keyframes rippleEffect {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
}

/* ===== 全局字体 ===== */
* { font-family: 'Source Han Sans SC', 'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif; }
</style>
