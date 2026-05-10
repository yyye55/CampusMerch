<template>
  <div class="admin-app">
    <!-- ===== 顶部导航栏 ===== -->
    <header class="admin-header">
      <div class="admin-header-main">
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

        <div class="header-right">
          <span class="admin-user-meta">
            <span class="admin-user-label">管理员</span>
            <span class="admin-user-value">Admin</span>
          </span>
          <button @click="handleAdminLogout" class="admin-logout-btn">退出登录</button>
        </div>
      </div>
    </header>

    <!-- ===== 导航标签栏 ===== -->
    <nav class="admin-nav-tabs">
      <div class="nav-tabs-container">
        <button
          v-for="tab in adminTabs"
          :key="tab.value"
          @click="navigate(tab.value)"
          class="nav-tab-item"
          :class="{ active: activeTab === tab.value }"
        >
          <span class="nav-tab-icon" v-html="tab.icon"></span>
          {{ tab.label }}
        </button>
      </div>
    </nav>

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
                <p>业务概览</p>
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
                <h3 class="card-title">库存预警</h3>
              </div>
              <div class="warning-summary" :class="{ success: adminStats.lowStockCount === 0 }">
                <div class="warning-icon">
                  <svg v-if="adminStats.lowStockCount > 0" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                    <path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path
                      d="M5 13l4 4L19 7"
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

          <!-- 操作日志 -->
          <div class="card logs-card">
            <div class="card-header-flex">
              <h3 class="card-title">最近操作</h3>
              <button @click="clearLogs" class="clear-logs-btn">清空</button>
            </div>
            <div class="logs-list custom-scrollbar">
              <div v-for="(log, idx) in recentLogs" :key="idx" class="log-item">
                <div class="log-icon" :class="log.type">
                  <svg v-if="log.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="log.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </div>
                <div class="log-content">
                  <p class="log-action">{{ log.action }}</p>
                  <p class="log-time">{{ log.time }}</p>
                </div>
              </div>
              <div v-if="recentLogs.length === 0" class="empty-logs">
                <p>暂无操作记录</p>
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
                <div class="status-badge-container">
                  <span class="status-badge" :class="getStatusClass(o.status)">{{
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
                    颜色: <b>{{ o.color || '默认' }}</b>
                  </div>
                  <div class="spec-cell">
                    收货人: <b>{{ o.userName || '-' }}</b>
                  </div>
                  <div class="spec-cell">
                    电话: <b>{{ o.phone || '-' }}</b>
                  </div>
                  <div class="spec-cell">
                    定制要求: <b>{{ o.customRequirement || '无' }}</b>
                  </div>
                </div>
                <div v-if="o.remark" class="remark-text">备注: {{ o.remark }}</div>
                <div v-if="o.address" class="address-text">收货地址: {{ o.address }}</div>
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
                        :placeholder="String(o.num)"
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
                <span class="category-tag">{{
                  g.category === 'wenchuang' ? '文创产品' : '活动物料'
                }}</span>
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
                    <button @click="removeProduct(g)" class="del-btn">删除</button>
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
              <label>定制要求描述</label>
              <input v-model="productForm.customRequirement" placeholder="描述商品的定制服务要求，如：提供设计稿支持印刷" />
            </div>
            <div class="form-group">
              <label>规格描述</label>
              <input v-model="productForm.spec" placeholder="如：S/M/L/XL 多尺码" />
            </div>
            <div class="form-group">
              <label>尺寸选项 (用逗号分隔)</label>
              <input v-model="productForm.sizesStr" placeholder="如：S,M,L,XL,XXL" />
            </div>
            <div class="form-group">
              <label>颜色选项 (用逗号分隔)</label>
              <input v-model="productForm.colorsStr" placeholder="如：白色,黑色,藏青,灰色" />
            </div>
            <div class="form-group">
              <label>商品描述</label>
              <textarea v-model="productForm.desc" rows="3" placeholder="请输入商品详细描述"></textarea>
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

          </div>
          <div class="modal-footer">
            <button @click="saveProduct" class="btn-primary w-full" :disabled="savingProduct">
              {{ savingProduct ? '保存中...' : '提交并发布' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 批量导入结果弹窗 -->
    <Transition name="fade">
      <div v-if="showImportResult" class="modal-overlay" @click.self="showImportResult = false">
        <div class="modal-card import-result-modal">
          <button @click="showImportResult = false" class="modal-close-btn">×</button>
          <div class="modal-header">
            <h3>批量导入结果</h3>
          </div>
          <div class="modal-body custom-scrollbar">
            <div class="import-summary">
              <div class="summary-row">
                <span class="summary-label">总条数</span>
                <span class="summary-value">{{ importResult.total }}</span>
              </div>
              <div class="summary-row success">
                <span class="summary-label">成功导入</span>
                <span class="summary-value">{{ importResult.success }}</span>
              </div>
              <div class="summary-row error">
                <span class="summary-label">失败条数</span>
                <span class="summary-value">{{ importResult.failed }}</span>
              </div>
            </div>

            <div v-if="importResult.errors.length > 0" class="import-errors">
              <h4 class="errors-title">失败明细</h4>
              <div class="errors-list">
                <div v-for="(error, idx) in importResult.errors" :key="idx" class="error-item">
                  <span class="error-row">{{ error.row }}</span>
                  <span class="error-message">{{ error.message }}</span>
                </div>
              </div>
            </div>

            <div v-if="importResult.success > 0" class="import-success-list">
              <h4 class="success-title">成功导入的商品</h4>
              <div class="success-items">
                <div v-for="(item, idx) in importResult.successItems" :key="idx" class="success-item">
                  <span class="success-name">{{ item.name }}</span>
                  <span class="success-price">¥{{ item.price }}</span>
                  <span class="success-stock">库存: {{ item.stock }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="showImportResult = false" class="btn-primary w-full">确定</button>
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
import {
  getStatistics,
  getOrders,
  reviewOrder as reviewOrderAPI,
  completeOrder as completeOrderAPI,
  exportOrders,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  type StatisticsResponse,
  type OrderItem,
  type ProductItem,
} from '@/api/admin'

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

const adminStats = ref<StatisticsResponse & { todayOrders: number; pendingReview: number; pendingDesign: number; totalProducts: number }>({
  totalOrders: 145,
  todayRevenue: 1250,
  pendingOrders: 3,
  lowStockCount: 2,
  todayOrders: 8,
  pendingReview: 3,
  pendingDesign: 2,
  totalProducts: 12,
})

const goods = ref<ProductItem[]>([
  {
    id: 1,
    name: '校园文化衫',
    price: 39,
    stock: 100,
    category: 'wenchuang',
    categoryText: '文创产品',
    sold: 256,
    minOrder: 1,
    customRequirement: '提供设计稿或手绘稿，支持单面/双面/多色印刷',
    isOnline: true,
    spec: 'S/M/L/XL 多尺码',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['白色', '黑色', '藏青', '灰色'],
    desc: '纯棉圆领文化衫，透气舒适，支持多种印花定制',
  },
  {
    id: 2,
    name: '纪念徽章',
    price: 12,
    stock: 200,
    category: 'wenchuang',
    categoryText: '文创产品',
    sold: 589,
    minOrder: 1,
    customRequirement: '提供高清矢量图，支持金/银/铜等多种金属材质',
    isOnline: true,
    spec: '直径25mm/30mm/35mm',
    sizes: ['25mm', '30mm', '35mm'],
    colors: ['金色', '银色', '古铜色'],
    desc: '校园纪念款金属珐琅徽章，精致工艺，收藏级品质',
  },
  {
    id: 3,
    name: '定制笔记本',
    price: 25,
    stock: 150,
    category: 'wenchuang',
    categoryText: '文创产品',
    sold: 324,
    minOrder: 1,
    customRequirement: '可定制封面图案、封底LOGO，支持烫金/烫银工艺',
    isOnline: true,
    spec: 'A5/160页',
    sizes: ['A5', 'B5'],
    colors: ['典雅黑', '樱花粉', '天空蓝', '象牙白'],
    desc: '可定制封面校园纪念笔记本，100g道林纸，锁线装订',
  },
  {
    id: 4,
    name: '活动横幅',
    price: 80,
    stock: 50,
    category: 'wuliao',
    categoryText: '活动物料',
    sold: 87,
    minOrder: 50,
    customRequirement: '提供CMYK格式设计稿，支持多种尺寸定制',
    isOnline: true,
    spec: '6米/8米/10米',
    sizes: ['6m×0.8m', '8m×0.8m', '10m×1m'],
    colors: ['红底白字', '蓝底白字', '黄底黑字', '定制'],
    desc: '优质牛津布材质，高清喷印，色彩鲜艳，可反复使用',
  },
  {
    id: 5,
    name: '手提纸袋',
    price: 5,
    stock: 500,
    category: 'wuliao',
    categoryText: '活动物料',
    sold: 1200,
    minOrder: 200,
    customRequirement: '可定制LOGO和图案',
    isOnline: true,
    spec: '21×27×12cm',
    sizes: ['小', '中', '大'],
    colors: ['牛皮纸色', '白色', '彩色印刷'],
    desc: '250g白卡纸材质，精致印刷，绳结提手，送礼佳品',
  },
  {
    id: 6,
    name: '马克杯',
    price: 35,
    stock: 0,
    category: 'wenchuang',
    categoryText: '文创产品',
    sold: 156,
    minOrder: 1,
    customRequirement: '提供高清图片，支持整圈印刷',
    isOnline: false,
    spec: '350ml',
    sizes: ['350ml', '500ml'],
    colors: ['白色', '黑色', '渐变蓝'],
    desc: '陶瓷马克杯，支持热转印定制，杯身可印刷照片、图案',
  },
  {
    id: 7,
    name: '定制帆布袋',
    price: 28,
    stock: 80,
    category: 'wuliao',
    categoryText: '活动物料',
    sold: 423,
    minOrder: 50,
    customRequirement: '支持单面/双面印刷',
    isOnline: true,
    spec: '40×35×10cm',
    sizes: ['标准', '加大'],
    colors: ['原色', '黑色', '藏青', '卡其'],
    desc: '16安加厚帆布，环保耐用，支持丝网印刷',
  },
  {
    id: 8,
    name: '钥匙扣',
    price: 8,
    stock: 300,
    category: 'wenchuang',
    categoryText: '文创产品',
    sold: 892,
    minOrder: 1,
    customRequirement: '提供PNG透明底图片，支持异形切割',
    isOnline: true,
    spec: '5cm',
    sizes: ['4cm', '5cm', '6cm'],
    colors: ['透明边', '白边', '彩印'],
    desc: '亚克力钥匙扣，双面高清印刷，支持定制任意图案',
  },
])

const orders = ref<(OrderItem & { num: number; adjustNum: number | null; remark: string; designFile: string })[]>([
  {
    id: 2024001,
    goodsName: '校庆文化衫',
    quantity: 2,
    num: 2,
    price: 59,
    size: 'XL',
    color: '白色',
    status: 2,
    statusText: '待审核',
    designFile: 'https://oss.example.com/designs/2024001.png?expires=2h',
    designFileUrl: 'https://oss.example.com/designs/2024001.png?expires=2h',
    createdAt: '2026-05-09 10:00',
    remark: '需要XL',
    adjustNum: null,
    address: '北京市海淀区学院路15号 学生宿舍3号楼201',
    userName: '张三',
    userEmail: 'zhangsan@example.com',
    phone: '138****8888',
    customRequirement: '需要XL',
  },
  {
    id: 2024002,
    goodsName: '实验室铭牌',
    quantity: 50,
    num: 50,
    price: 15,
    size: '10cm×5cm',
    color: '银色',
    status: 3,
    statusText: '制作中',
    designFile: 'https://oss.example.com/designs/2024002.png?expires=2h',
    designFileUrl: 'https://oss.example.com/designs/2024002.png?expires=2h',
    createdAt: '2026-05-08 15:00',
    remark: '急用',
    adjustNum: null,
    address: '北京市海淀区学院路15号 物理学院楼302室',
    userName: '李四',
    userEmail: 'lisi@example.com',
    phone: '139****9999',
    customRequirement: '',
  },
  {
    id: 2024003,
    goodsName: '校徽钥匙扣',
    quantity: 10,
    num: 10,
    price: 8,
    size: '标准',
    color: '金色',
    status: 4,
    statusText: '已完成',
    designFile: 'https://oss.example.com/designs/2024003.png?expires=2h',
    designFileUrl: 'https://oss.example.com/designs/2024003.png?expires=2h',
    createdAt: '2026-05-05 14:00',
    remark: '',
    adjustNum: null,
    address: '北京市海淀区学院路15号 化学系办公室',
    userName: '王五',
    userEmail: 'wangwu@example.com',
    phone: '137****7777',
    customRequirement: '',
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
  minOrder: 1,
  spec: '',
  sizesStr: '',
  colorsStr: '',
  desc: '',
})

const recentLogs = ref<any[]>([
  { action: '审核通过订单 #2024001', time: '10分钟前', type: 'success' },
  { action: '驳回订单 #2024003', time: '25分钟前', type: 'warning' },
  { action: '新增商品「校庆纪念徽章」', time: '1小时前', type: 'info' },
  { action: '核销订单 #2024002', time: '2小时前', type: 'success' },
  { action: '下架商品「旧款文化衫」', time: '3小时前', type: 'warning' },
])

const addLog = (action: string, type: 'success' | 'warning' | 'info' = 'info') => {
  const now = new Date()
  const timeStr = formatTime(now)
  recentLogs.value.unshift({ action, time: timeStr, type })
  if (recentLogs.value.length > 50) {
    recentLogs.value.pop()
  }
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

const showImportResult = ref(false)
const importResult = ref({
  total: 0,
  success: 0,
  failed: 0,
  errors: [] as Array<{ row: string; message: string }>,
  successItems: [] as Array<{ name: string; price: number; stock: number }>,
})

const clearLogs = () => {
  recentLogs.value = []
}

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
    icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
    sub: '系统全周期需求',
  },
  {
    label: '今日流水',
    value: `¥${adminStats.value.todayRevenue}`,
    icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    sub: '今日预估营收',
  },
  {
    label: '库存预警项',
    value: adminStats.value.lowStockCount,
    icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
    sub: '库存低于阈值',
  },
  {
    label: '商品总数',
    value: adminStats.value.totalProducts,
    icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
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
    addLog(`修改订单 #${o.id} 数量为 ${o.num}`, 'info')
  } else {
    ElMessage.warning('请输入有效的调整数量')
  }
}

const getStatusClass = (s: number) => {
  const map: any = {
    1: 'status-pending',
    2: 'status-review',
    3: 'status-processing',
    4: 'status-completed',
    5: 'status-rejected',
  }
  return map[s] || 'status-pending'
}

const handleOrderFilterClick = (s: any) => {
  orderFilter.value = s.value
}
const handleAdminLogout = () => {
  router.push('/')
}
const triggerImport = () => (document.querySelector('input[type="file"]') as any).click()
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
    minOrder: 1,
    spec: '',
    sizesStr: '',
    colorsStr: '',
    desc: '',
  }
  showProductModal.value = true
}

const editProduct = (g: any) => {
  productForm.value = {
    ...g,
    spec: g.spec || '',
    sizesStr: Array.isArray(g.sizes) ? g.sizes.join(',') : (g.sizesStr || ''),
    colorsStr: Array.isArray(g.colors) ? g.colors.join(',') : (g.colorsStr || ''),
    desc: g.desc || '',
  }
  showProductModal.value = true
}

const toggleStock = (g: any) => {
  g.isOnline = !g.isOnline
  ElMessage.info(g.isOnline ? '商品已上架' : '商品已停售')
  addLog(g.isOnline ? `上架商品「${g.name}」` : `下架商品「${g.name}」`, g.isOnline ? 'success' : 'warning')
}

const formatDate = (d: string) => d
const handleLowStockItemClick = (i: any) => {
  activeTab.value = 'products'
  editProduct(i)
}

const loadStatistics = async () => {
  try {
    const data = await getStatistics()
    adminStats.value = {
      ...adminStats.value,
      totalOrders: data.totalOrders || adminStats.value.totalOrders,
      todayRevenue: data.todayRevenue || adminStats.value.todayRevenue,
      pendingOrders: data.pendingOrders || adminStats.value.pendingOrders,
      lowStockCount: data.lowStockCount || adminStats.value.lowStockCount,
      todayOrders: data.todayOrders || adminStats.value.todayOrders,
      pendingReview: data.pendingReview || adminStats.value.pendingReview,
      pendingDesign: data.pendingDesign || adminStats.value.pendingDesign,
      totalProducts: data.totalProducts || adminStats.value.totalProducts,
    }
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

const loadOrders = async () => {
  try {
    const params: { status?: number; keyword?: string } = {}
    if (orderFilter.value !== 'all') {
      params.status = parseInt(orderFilter.value)
    }
    if (orderKeyword.value) {
      params.keyword = orderKeyword.value
    }
    
    const data = await getOrders(params)
    orders.value = data.map((item: OrderItem) => ({
      ...item,
      num: item.quantity,
      adjustNum: null,
      remark: item.customRequirement || '',
      designFile: item.designFileUrl || '',
      receiver: item.userName || '',
    }))
  } catch (error) {
    ElMessage.error('加载订单列表失败')
  }
}

const loadProducts = async () => {
  try {
    const data = await getProducts()
    goods.value = data.map((item: ProductItem) => ({
      ...item,
      categoryText: item.category === 'wenchuang' ? '文创产品' : '活动物料',
    }))
  } catch (error) {
    ElMessage.error('加载商品列表失败')
  }
}

const reviewOrder = async (o: any, action: string) => {
  const quantity = o.adjustNum !== null ? o.adjustNum : o.num
  
  try {
    if (action === 'approve') {
      await reviewOrderAPI(o.id, { status: 'approved', quantity })
      o.status = 3
      o.statusText = '制作中'
      o.num = quantity
      ElMessage.success('审核通过')
      addLog(`审核通过订单 #${o.id}`, 'success')
    } else {
      await reviewOrderAPI(o.id, { status: 'rejected' })
      o.status = 5
      o.statusText = '已驳回'
      ElMessage.success('已驳回')
      addLog(`驳回订单 #${o.id}`, 'warning')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const completeOrder = async (o: any) => {
  try {
    await completeOrderAPI(o.id)
    o.status = 4
    o.statusText = '已完成'
    ElMessage.success('核销成功')
    addLog(`核销订单 #${o.id}`, 'success')
  } catch (error) {
    ElMessage.error('核销失败')
  }
}

const saveProduct = async () => {
  if (!productForm.value.name) return ElMessage.warning('名称必填')
  savingProduct.value = true
  
  try {
    const form = { ...productForm.value } as any
    form.sizes = form.sizesStr ? form.sizesStr.split(',').map((s: string) => s.trim()) : []
    form.colors = form.colorsStr ? form.colorsStr.split(',').map((s: string) => s.trim()) : []
    form.categoryText = form.category === 'wenchuang' ? '文创产品' : '活动物料'
    
    if (productForm.value.id) {
      await updateProduct(productForm.value.id, form)
      const idx = goods.value.findIndex((g) => g.id === productForm.value.id)
      if (idx !== -1) goods.value[idx] = { ...goods.value[idx], ...form }
      addLog(`编辑商品「${productForm.value.name}」`, 'info')
    } else {
      const newProduct = await createProduct(form)
      goods.value.unshift({ ...newProduct, sold: 0 })
      addLog(`新增商品「${productForm.value.name}」`, 'success')
    }
    
    ElMessage.success('商品库已保存')
    showProductModal.value = false
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    savingProduct.value = false
  }
}

const removeProduct = async (g: any) => {
  ElMessageBox.confirm(`确定删除「${g.name}」吗？`, '提示', { type: 'warning' }).then(async () => {
    try {
      await deleteProduct(g.id)
      goods.value = goods.value.filter((item) => item.id !== g.id)
      ElMessage.success('删除成功')
      addLog(`删除商品「${g.name}」`, 'warning')
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleImport = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const result = await importProducts(formData)
    
    importResult.value = {
      total: result.total,
      success: result.success,
      failed: result.failed,
      errors: result.errors.map((e: any) => ({ row: String(e.row), message: e.message })),
      successItems: result.successItems,
    }

    result.successItems.forEach((item: { name: string; price: number; stock: number }) => {
      goods.value.unshift({
        ...item,
        id: Date.now() + Math.random(),
        category: 'wenchuang',
        categoryText: '文创产品',
        minOrder: 1,
        customRequirement: '需要定制',
        sold: 0,
        isOnline: true,
        sizes: [],
        colors: [],
      })
    })

    showImportResult.value = true
    addLog(`批量导入商品: ${result.success}条成功, ${result.failed}条失败`, result.success > 0 ? 'success' : 'warning')
  } catch (error) {
    ElMessage.error('导入失败')
  }
  
  event.target.value = ''
}

const handleExport = async () => {
  exporting.value = true
  
  try {
    const params: { status?: number } = {}
    if (orderFilter.value !== 'all') {
      params.status = parseInt(orderFilter.value)
    }
    
    const response = await exportOrders(params)
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `订单报表_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
    addLog('导出订单报表', 'success')
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

onMounted(() => {
  loadStatistics()
  loadOrders()
  loadProducts()
})
</script>

<style>
@import '@/styles/adminPage.css';
</style>
