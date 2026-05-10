<template>
  <div class="admin-app">
    <!-- ===== 顶部导航栏 ===== -->
    <header class="admin-header">
      <div class="header-container">
        <div class="logo-section">
          <div class="logo-icon">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div class="logo-text">
            <h1>校园文创预订系统</h1>
          </div>
        </div>

        <nav class="desktop-nav">
          <button
            v-for="tab in adminTabs"
            :key="tab.value"
            @click="navigate(tab.value)"
            class="nav-item"
            :class="{ active: activeTab === tab.value }"
          >
            <span class="icon" v-html="tab.icon"></span>
            {{ tab.label }}
          </button>
        </nav>

        <div class="header-right">
          <span class="admin-user-meta">
            <span class="admin-user-label">管理员</span>
            <span class="admin-user-value">Admin</span>
          </span>
          <button @click="handleAdminLogout" class="admin-logout-btn">退出登录</button>
        </div>
      </div>
    </header>

    <!-- ===== 主内容区域 ===== -->
    <main class="admin-main">
      <div class="content-wrapper">
        <!-- ===== 1. 数据看板 ===== -->
        <div v-if="activeTab === 'dashboard'" class="page-container dashboard-page">
          <!-- 改进后的欢迎横幅：标题与数据放一排 -->
          <section class="welcome-banner">
            <div class="banner-content-inline">
              <div class="banner-text">
                <h2>{{ greeting }}，管理员</h2>
                <p>CampusMerch 业务概览</p>
              </div>
              <div class="banner-inline-stats">
                <div class="inline-stat-item">
                  <span class="val">{{ adminStats.todayOrders }}</span>
                  <span class="lab">今日预订</span>
                </div>
                <div class="inline-stat-divider"></div>
                <div class="inline-stat-item">
                  <span class="val">{{ adminStats.pendingReview }}</span>
                  <span class="lab">待审定制稿</span>
                </div>
              </div>
            </div>
          </section>

          <div class="stats-grid">
            <div
              v-for="(stat, idx) in statCards"
              :key="idx"
              class="stat-card"
              :style="`--theme-color: ${stat.accentColor}`"
            >
              <div class="stat-header">
                <div class="stat-icon" v-html="stat.icon"></div>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
              <div class="stat-body">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-sub">{{ stat.sub }}</span>
              </div>
            </div>
          </div>

          <div class="dashboard-secondary">
            <div class="card process-card">
              <h3 class="card-title">订单流转效率 (状态机)</h3>
              <div class="stepper">
                <div
                  v-for="(step, i) in orderSteps"
                  :key="i"
                  class="step-item"
                  :class="{ active: activeStep === i }"
                >
                  <div class="step-dot">
                    <span class="count">{{ step.count }}</span>
                  </div>
                  <span class="step-label">{{ step.label }}</span>
                </div>
              </div>
            </div>

            <div class="card warning-card">
              <div class="card-header-flex">
                <h3 class="card-title text-red-500">库存预警 (Reserved Qty)</h3>
              </div>
              <div class="warning-summary">
                <div class="warning-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                    <path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p v-if="adminStats.lowStockCount > 0" class="warning-text">
                  当前有 <strong>{{ adminStats.lowStockCount }}</strong> 件商品库存不足，请及时补货
                </p>
                <p v-else class="warning-text success">库存充足，暂无预警</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== 2. 订单管理 ===== -->
        <div v-if="activeTab === 'orders'" class="page-container flex-col h-full">
          <header class="section-header-flex">
            <div>
              <h2 class="page-title">订单管理中心</h2>
              <p class="page-subtitle">处理预订、审核定制图、导出生产报表</p>
            </div>
            <button @click="handleExport" class="btn-outline" :disabled="exporting">
              <span v-if="exporting">报表生成中...</span>
              <span v-else>一键导出 Excel</span>
            </button>
          </header>

          <div class="toolbar">
            <div class="filter-tabs">
              <button
                v-for="s in orderFilters"
                :key="s.value"
                @click="handleOrderFilterClick(s)"
                class="filter-tab"
                :class="{ active: orderFilter === s.value }"
              >
                {{ s.label }}
              </button>
            </div>
            <div class="search-bar">
              <input type="text" v-model="orderKeyword" placeholder="按商品名称或备注搜索..." />
            </div>
          </div>

          <div class="list-container custom-scrollbar">
            <div v-for="o in filteredOrders" :key="o.id" class="order-card-new">
              <div class="card-top">
                <div class="main-info">
                  <h4 class="goods-name">{{ o.goodsName }}</h4>
                  <span class="time">{{ formatDate(o.createdAt) }}</span>
                </div>
                <!-- 优化后的状态标签 -->
                <div class="status-badge-container">
                  <span class="status-badge" :style="getStatusStyle(o.status)">{{
                    o.statusText
                  }}</span>
                </div>
              </div>
              <div class="card-mid">
                <div class="spec-grid">
                  <div class="spec-cell">
                    预订量: <b>{{ o.num }}</b>
                  </div>
                  <div class="spec-cell">
                    规格: <b>{{ o.size || '默认' }}</b>
                  </div>
                  <div class="spec-cell">
                    定制要求: <b>{{ o.custom || '无' }}</b>
                  </div>
                </div>
                <div v-if="o.remark" class="remark-text">备注: {{ o.remark }}</div>
              </div>
              <div class="card-footer">
                <div class="design-preview">
                  <a v-if="o.designFile" :href="o.designFile" target="_blank" class="link-btn"
                    >查看 OSS 设计稿</a
                  >
                  <span v-else class="text-gray-400 text-xs">暂未上传设计图</span>
                </div>
                <div class="actions">
                  <template v-if="o.status === 2">
                    <div class="adjust-box">
                      <input
                        type="number"
                        v-model.number="o.adjustNum"
                        :placeholder="o.num"
                        class="num-input"
                      />
                      <button @click="confirmQuantityChange(o)" class="btn-confirm-adjust">
                        确认修改
                      </button>
                    </div>
                    <div class="btn-group-row">
                      <button @click="reviewOrder(o, 'approve')" class="btn-success">
                        通过审核
                      </button>
                      <button @click="reviewOrder(o, 'reject')" class="btn-danger">驳回</button>
                    </div>
                  </template>
                  <button v-if="o.status === 3" @click="completeOrder(o)" class="btn-primary">
                    确认核销
                  </button>
                </div>
              </div>
            </div>
            <div v-if="filteredOrders.length === 0" class="empty-list">
              <p>暂无匹配订单</p>
            </div>
          </div>
        </div>

        <!-- ===== 3. 商品管理 ===== -->
        <div v-if="activeTab === 'products'" class="page-container flex-col h-full">
          <header class="section-header-flex">
            <div>
              <h2 class="page-title">商品库维护</h2>
              <p class="page-subtitle">管理库存、起订量及定制化规则</p>
            </div>
            <div class="header-btns">
              <button @click="triggerImport" class="btn-outline">批量导入 Excel</button>
              <button @click="openAddProduct" class="btn-primary">新增商品</button>
            </div>
          </header>

          <div class="product-grid-container custom-scrollbar">
            <div class="product-grid">
              <div v-for="g in goods" :key="g.id" class="product-card">
                <div class="p-img">
                  <img :src="g.pic || '/placeholder.png'" />
                  <span class="category-tag">{{
                    g.category === 'wenchuang' ? '文创产品' : '活动物料'
                  }}</span>
                </div>
                <div class="p-content">
                  <div class="p-header">
                    <h4 class="p-name">{{ g.name }}</h4>
                    <span class="p-price">¥{{ g.price }}</span>
                  </div>
                  <div class="p-stock-info">
                    <div class="stock-label">
                      库存: <b>{{ g.stock }}</b>
                    </div>
                    <div class="sold-label">
                      起订量: <b>{{ g.minOrder || 1 }}</b>
                    </div>
                  </div>
                  <div class="p-custom-rule">要求: {{ g.customRequirement }}</div>
                  <div class="p-footer">
                    <button
                      @click="toggleStock(g)"
                      class="status-btn"
                      :class="g.isOnline ? 'online' : 'offline'"
                    >
                      {{ g.isOnline ? '销售中' : '已停售' }}
                    </button>
                    <button @click="editProduct(g)" class="edit-btn">编辑</button>
                    <button @click="deleteProduct(g)" class="del-btn">删除</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 商品维护弹窗 (加右上角叉号，新增上架/不上架选项) -->
    <Transition name="fade">
      <div v-if="showProductModal" class="modal-overlay" @click.self="showProductModal = false">
        <div class="modal-card relative">
          <button @click="showProductModal = false" class="modal-close-btn">×</button>

          <div class="modal-header">
            <h3>{{ productForm.id ? '编辑商品' : '上架新商品' }}</h3>
          </div>
          <div class="modal-body custom-scrollbar">
            <div class="form-group">
              <label>商品名称 (Name) *</label>
              <input v-model="productForm.name" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>单价 (Price)</label>
                <input type="number" v-model.number="productForm.price" />
              </div>
              <div class="form-group">
                <label>库存 (Stock)</label>
                <input type="number" v-model.number="productForm.stock" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>最低起订量</label>
                <input type="number" v-model.number="productForm.minOrder" />
              </div>
              <div class="form-group">
                <label>定制化要求</label>
                <select v-model="productForm.customRequirement" class="form-select">
                  <option value="需要定制">需要定制</option>
                  <option value="无需定制">无需定制</option>
                </select>
              </div>
            </div>

            <!-- 新增上架/不上架选项 -->
            <div class="form-row">
              <div class="form-group">
                <label>商品状态</label>
                <select v-model="productForm.isOnline" class="form-select">
                  <option :value="true">立即上架销售</option>
                  <option :value="false">暂不上架/下架</option>
                </select>
              </div>
              <div class="form-group">
                <label>分类</label>
                <select v-model="productForm.category" class="form-select">
                  <option value="wenchuang">文创产品</option>
                  <option value="wuliao">活动物料</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>封面图片 (Cover URL)</label>
              <input v-model="productForm.pic" placeholder="OSS 图片链接" />
            </div>
          </div>
          <div class="modal-footer">
            <button @click="saveProduct" class="btn-primary w-full" :disabled="savingProduct">
              {{ savingProduct ? '保存中...' : '提交并发布' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <input
      type="file"
      ref="importInputRef"
      class="hidden"
      @change="handleImport"
      accept=".xlsx,.xls,.csv"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const activeTab = ref('dashboard')
const refreshing = ref(false)

const adminTabs = [
  {
    value: 'dashboard',
    label: '控制台',
    icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  },
  {
    value: 'orders',
    label: '订单管理',
    icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
  },
  {
    value: 'products',
    label: '商品维护',
    icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  },
]

const adminStats = ref({
  todayOrders: 8,
  pendingReview: 3,
  pendingDesign: 2,
  lowStockCount: 2,
  totalOrders: 145,
  totalProducts: 12,
  todayRevenue: 1250,
})

const goods = ref<any[]>([
  {
    id: 1,
    name: '校庆文化衫',
    price: 59,
    stock: 45,
    category: 'wenchuang',
    sold: 120,
    minOrder: 1,
    customRequirement: '需要定制',
    pic: '',
    isOnline: true,
  },
  {
    id: 2,
    name: '实验室铭牌',
    price: 15,
    stock: 5,
    category: 'wuliao',
    sold: 400,
    minOrder: 10,
    customRequirement: '无需定制',
    pic: '',
    isOnline: true,
  },
])

const orders = ref<any[]>([
  {
    id: 2024001,
    goodsName: '校庆文化衫',
    num: 2,
    status: 2,
    statusText: '待审核',
    designFile: null,
    createdAt: '2026-05-09 10:00',
    remark: '需要XL',
    adjustNum: null,
  },
  {
    id: 2024002,
    goodsName: '实验室铭牌',
    num: 50,
    status: 3,
    statusText: '制作中',
    designFile: null,
    createdAt: '2026-05-08 15:00',
    remark: '急用',
    adjustNum: null,
  },
])

const orderFilter = ref('all')
const orderKeyword = ref('')
const exporting = ref(false)
const showProductModal = ref(false)
const savingProduct = ref(false)

const productForm = ref({
  id: null as any,
  name: '',
  price: 0,
  stock: 0,
  category: 'wenchuang',
  customRequirement: '需要定制',
  isOnline: true,
  pic: '',
  minOrder: 1,
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return '早上好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const isTabMatch = orderFilter.value === 'all' || o.status === Number(orderFilter.value)
    const keyword = orderKeyword.value.trim().toLowerCase()
    return isTabMatch && o.goodsName.toLowerCase().includes(keyword)
  })
})

const statCards = computed(() => [
  {
    label: '累计预订量',
    value: adminStats.value.totalOrders,
    icon: '📦',
    accentColor: '#3b82f6',
    sub: '系统全周期需求',
  },
  {
    label: '今日流水',
    value: `¥${adminStats.value.todayRevenue}`,
    icon: '💰',
    accentColor: '#10b981',
    sub: '今日预估营收',
  },
  {
    label: '库存预警项',
    value: adminStats.value.lowStockCount,
    icon: '⚠️',
    accentColor: '#ef4444',
    sub: '库存低于阈值',
  },
  {
    label: '商品总数',
    value: adminStats.value.totalProducts,
    icon: '🛒',
    accentColor: '#8b5cf6',
    sub: '在线SKU总计',
  },
])

const orderSteps = computed(() => [
  { label: '已预订', count: orders.value.filter((o) => o.status === 1).length },
  { label: '待审核', count: orders.value.filter((o) => o.status === 2).length },
  { label: '制作中', count: orders.value.filter((o) => o.status === 3).length },
  { label: '已完成', count: orders.value.filter((o) => o.status === 4).length },
])

const activeStep = computed(() => (adminStats.value.pendingReview > 0 ? 1 : 0))

const orderFilters = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 2 },
  { label: '制作中', value: 3 },
  { label: '已完成', value: 4 },
  { label: '已驳回', value: 5 },
]

const confirmQuantityChange = (o: any) => {
  if (o.adjustNum !== null && o.adjustNum >= 0) {
    o.num = o.adjustNum
    ElMessage.success(`订单预订量已成功更新为 ${o.num}`)
  } else {
    ElMessage.warning('请输入有效的调整数量')
  }
}

const reviewOrder = async (o: any, action: 'approve' | 'reject') => {
  if (action === 'approve') {
    o.status = 3
    o.statusText = '制作中'
    ElMessage.success('审核通过，订单已更新')
  } else {
    o.status = 5
    o.statusText = '已驳回'
    ElMessage.info('订单已驳回')
  }
}

const completeOrder = async (o: any) => {
  o.status = 4
  o.statusText = '已完成'
  ElMessage.success('核销成功')
}

const saveProduct = async () => {
  if (!productForm.value.name) return ElMessage.warning('名称必填')
  savingProduct.value = true
  setTimeout(() => {
    if (productForm.value.id) {
      const idx = goods.value.findIndex((g) => g.id === productForm.value.id)
      if (idx !== -1) goods.value[idx] = { ...goods.value[idx], ...productForm.value }
    } else {
      goods.value.unshift({ ...productForm.value, id: Date.now(), sold: 0 })
    }
    ElMessage.success('商品库已保存')
    showProductModal.value = false
    savingProduct.value = false
  }, 500)
}

const deleteProduct = (g: any) => {
  ElMessageBox.confirm(`确定删除「${g.name}」吗？`, '提示', { type: 'warning' }).then(() => {
    goods.value = goods.value.filter((item) => item.id !== g.id)
    ElMessage.success('删除成功')
  })
}

// 优化后的状态标签逻辑
const getStatusStyle = (s: number) => {
  const map: any = {
    1: { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' },
    2: { bg: '#fff7ed', color: '#ea580c', border: '#ffedd5' },
    3: { bg: '#eff6ff', color: '#2563eb', border: '#dbeafe' },
    4: { bg: '#f0fdf4', color: '#16a34a', border: '#dcfce7' },
    5: { bg: '#fef2f2', color: '#dc2626', border: '#fee2e2' },
  }
  const style = map[s] || map[1]
  return `background: ${style.bg}; color: ${style.color}; border: 1px solid ${style.border};`
}

const handleOrderFilterClick = (s: any) => {
  orderFilter.value = s.value
}
const handleAdminLogout = () => {
  router.push('/')
}
const triggerImport = () => (document.querySelector('input[type="file"]') as any).click()
const handleImport = () => {}
const handleExport = () => {
  exporting.value = true
  setTimeout(() => {
    exporting.value = false
    ElMessage.success('报表已生成')
  }, 1000)
}
const navigate = (tab: string) => {
  activeTab.value = tab
}

const openAddProduct = () => {
  productForm.value = {
    id: null,
    name: '',
    price: 0,
    stock: 0,
    category: 'wenchuang',
    customRequirement: '需要定制',
    isOnline: true,
    pic: '',
    minOrder: 1,
  }
  showProductModal.value = true
}

const editProduct = (g: any) => {
  productForm.value = { ...g }
  showProductModal.value = true
}

const toggleStock = (g: any) => {
  g.isOnline = !g.isOnline
  ElMessage.info(g.isOnline ? '商品已上架' : '商品已停售')
}

const formatDate = (d: string) => d
const handleLowStockItemClick = (i: any) => {
  activeTab.value = 'products'
  editProduct(i)
}
</script>

<style scoped>
/* 核心布局 */
.admin-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f8fafc;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}
.admin-header {
  height: 64px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  z-index: 100;
  flex-shrink: 0;
}
.header-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-text h1 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
.desktop-nav {
  display: flex;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
}
.nav-item {
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border: none;
  background: none;
}
.nav-item.active {
  background: white;
  color: #8b5cf6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.admin-user-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
}
.admin-user-label {
  font-weight: 700;
  color: #7c3aed;
}
.admin-logout-btn {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 0.8125rem;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
}

.admin-main {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 2rem;
}
.content-wrapper {
  max-width: 1440px;
  margin: 0 auto;
}
.page-container {
  padding: 1.5rem;
}

/* 改进后的欢迎栏 */
.welcome-banner {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  color: white;
  margin-bottom: 1.5rem;
}
.banner-content-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.banner-text h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}
.banner-text p {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 4px 0 0 0;
}

.banner-inline-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.12);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);
}
.inline-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.inline-stat-item .val {
  font-size: 1.25rem;
  font-weight: 800;
}
.inline-stat-item .lab {
  font-size: 0.7rem;
  opacity: 0.8;
}
.inline-stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

/* 看板其他部分 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}
.stat-icon {
  width: 40px;
  height: 40px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--theme-color);
}
.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
}
.dashboard-secondary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}
.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}
.card-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
.stepper {
  display: flex;
  justify-content: space-between;
}
.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.step-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-item.active .step-dot {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: white;
}
.step-label {
  font-size: 0.75rem;
  margin-top: 8px;
  color: #94a3b8;
}

/* 订单中心 */
.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.toolbar {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  border: 1px solid #e2e8f0;
}
.filter-tab {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #64748b;
  background: #f8fafc;
  cursor: pointer;
  border: none;
}
.filter-tab.active {
  background: #8b5cf6;
  color: white;
}
.search-bar input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 240px;
}
.order-card-new {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

/* 订单卡片顶部：状态标签对齐优化 */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
  line-height: 1.2;
}

.goods-name {
  font-weight: 700;
  font-size: 1rem;
  color: #1e293b;
}
.spec-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #f8fafc;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.spec-cell {
  font-size: 0.75rem;
  color: #64748b;
}
.adjust-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px;
  background: #fffbeb;
  border-radius: 8px;
  border: 1px solid #fef3c7;
}
.btn-confirm-adjust {
  padding: 4px 12px;
  font-size: 11px;
  color: #16a34a;
  background: white;
  border: 1px solid #16a34a;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.btn-group-row {
  display: flex;
  gap: 8px;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  border-top: 1px dashed #e2e8f0;
  padding-top: 1rem;
  align-items: center;
}

/* 商品部分 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.product-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: 0.2s;
}
.p-img {
  height: 160px;
  background: #f1f5f9;
  position: relative;
}
.p-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  color: #8b5cf6;
  font-weight: 600;
}
.p-content {
  padding: 1.25rem;
}
.p-custom-rule {
  font-size: 0.7rem;
  color: #8b5cf6;
  background: #f5f3ff;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.p-stock-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}
.p-footer {
  display: flex;
  gap: 0.5rem;
}
.status-btn {
  flex: 1;
  padding: 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  border: none;
  font-weight: 600;
}
.status-btn.online {
  background: #ecfdf5;
  color: #10b981;
}
.status-btn.offline {
  background: #fef2f2;
  color: #ef4444;
}
.edit-btn {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}
.del-btn {
  color: #ef4444;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
}

/* 按钮与通用 */
.btn-primary {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn-outline {
  border: 1px solid #e2e8f0;
  color: #64748b;
  background: white;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
}
.btn-success {
  background: #10b981;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 600;
}
.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 600;
}
.num-input {
  width: 90px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 8px;
  outline: none;
}

/* 弹窗核心 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-card {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
}
.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: #f1f5f9;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #64748b;
  cursor: pointer;
  font-size: 18px;
  transition: 0.3s;
}
.modal-close-btn:hover {
  background: #fee2e2;
  color: #ef4444;
  transform: rotate(90deg);
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 6px;
  font-weight: 600;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  background: #fff;
  font-size: 0.875rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.warning-summary {
  padding: 2rem;
  text-align: center;
}
.warning-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 10px;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
