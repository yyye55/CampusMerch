<template>
  <div class="student-page">
    <div class="student-container">
      <div class="student-header">
        <div class="student-header-left">
          <h1 class="student-title">🎨 校园文创预订系统</h1>
          <p class="student-subtitle">在线筛选、智能校验、可视化弹窗，预订流程更清晰</p>
        </div>
        <button @click="handleLogout" class="logout-button">🚪 退出登录</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">在售商品</p>
          <p class="stat-value">
            {{ goods.filter((g) => g.inStock).length }}
          </p>
        </div>
        <div class="stat-card">
          <p class="stat-label">总商品数</p>
          <p class="stat-value">{{ goods.length }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">我的订单</p>
          <p class="stat-value">{{ orders.length }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">待处理订单</p>
          <p class="stat-value">{{ pendingOrderCount }}</p>
        </div>
      </div>

      <div class="tab-container">
        <button @click="go('list')" :class="page === 'list' ? 'tab-button active' : 'tab-button'">
          🎁 商品大厅
        </button>
        <button
          @click="go('myorder')"
          :class="page === 'myorder' ? 'tab-button active' : 'tab-button'"
        >
          📋 我的订单
        </button>
        <button
          @click="go('favorite')"
          :class="page === 'favorite' ? 'tab-button active' : 'tab-button'"
        >
          ❤️ 我的收藏
        </button>
      </div>

      <div v-if="page === 'list'" class="page-transition">
        <div class="filter-container">
          <div class="filter-group">
            <span class="filter-label">📂 分类</span>
            <button
              v-for="cat in categories"
              :key="cat.value"
              @click="
                filters.category = cat.value;
                currentPage = 1
              "
              :class="filters.category === cat.value ? 'filter-button active' : 'filter-button'"
            >
              {{ cat.label }}
            </button>
          </div>
          <div class="filter-group">
            <span class="filter-label">📍 状态</span>
            <button
              v-for="s in statusFilters"
              :key="s.value"
              @click="
                filters.status = s.value;
                currentPage = 1
              "
              :class="filters.status === s.value ? 'filter-button active' : 'filter-button'"
            >
              {{ s.label }}
            </button>
          </div>
          <div class="filter-group">
            <span class="filter-label">💴 价格</span>
            <input
              type="number"
              v-model="filters.minPrice"
              placeholder="最低"
              class="price-input"
            />
            <span class="price-separator">—</span>
            <input
              type="number"
              v-model="filters.maxPrice"
              placeholder="最高"
              class="price-input"
            />
          </div>
          <div class="search-container">
            <input
              type="text"
              v-model="filters.keyword"
              placeholder="🔍 搜索商品名称或描述..."
              @keyup.enter="applyFilter"
              class="search-input"
            />
            <button @click="applyFilter" class="search-button">搜索</button>
            <button @click="resetFilter" class="reset-button">重置</button>
          </div>
        </div>

        <div v-if="filteredGoods.length > 0" class="goods-grid">
          <div v-for="g in paginatedGoods" :key="g.id" class="goods-card" @click="openDetail(g)">
            <div class="goods-image">
              <img :src="g.img" />
            </div>
            <div class="goods-content">
              <div class="goods-header">
                <div class="goods-tags">
                  <span class="goods-tag category">{{ g.categoryText }}</span>
                  <span :class="g.inStock ? 'goods-tag in-stock' : 'goods-tag out-of-stock'">
                    {{ g.statusText }}
                  </span>
                </div>
                <button
                  class="favorite-button"
                  :class="{ active: isFavorite(g.id) }"
                  @click.stop="toggleFavorite(g)"
                  :aria-label="isFavorite(g.id) ? '取消收藏' : '收藏商品'"
                >
                  {{ isFavorite(g.id) ? '❤️' : '🤍' }}
                </button>
              </div>
              <h3 class="goods-name">{{ g.name }}</h3>
              <p class="goods-spec">{{ g.spec }}</p>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">🔍</div>
          <p class="empty-text">没有找到符合条件的商品</p>
        </div>

        <div v-if="filteredGoods.length > 0" class="pagination">
          <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-button">
            ← 上一页
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            @click="currentPage = p"
            :class="currentPage === p ? 'pagination-button active' : 'pagination-button'"
          >
            {{ p }}
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="pagination-button"
          >
            下一页 →
          </button>
        </div>
      </div>

      <div v-if="page === 'detail'" class="page-transition">
        <button @click="go('list')" class="detail-back-button">← 返回商品大厅</button>

        <div class="detail-container">
          <div class="detail-image-section">
            <img :src="currentGoods.img" class="detail-image" />
          </div>
          <div class="detail-content-section">
            <div class="detail-tags">
              <span class="detail-tag category">{{ currentGoods.categoryText }}</span>
              <span
                :class="currentGoods.inStock ? 'detail-tag in-stock' : 'detail-tag out-of-stock'"
              >
                {{ currentGoods.statusText }}
              </span>
            </div>
            <div class="detail-header">
              <h2 class="detail-title">
                {{ currentGoods.name }}
              </h2>
              <button
                class="detail-favorite-button"
                :class="{ active: isFavorite(currentGoods.id) }"
                @click="toggleFavorite(currentGoods)"
                :aria-label="isFavorite(currentGoods.id) ? '取消收藏' : '收藏商品'"
              >
                {{ isFavorite(currentGoods.id) ? '❤️' : '🤍' }}
              </button>
            </div>
            <p class="detail-price">¥{{ currentGoods.price }}</p>

            <div class="detail-stats-grid">
              <div class="detail-stat-card">
                <p class="detail-stat-label">📦 库存</p>
                <p class="detail-stat-value">{{ currentGoods.stock }} 件</p>
              </div>
              <div class="detail-stat-card">
                <p class="detail-stat-label">🔥 已售</p>
                <p class="detail-stat-value">{{ currentGoods.sold }} 件</p>
              </div>
              <div class="detail-stat-card">
                <p class="detail-stat-label">📐 规格</p>
                <p class="detail-stat-value">{{ currentGoods.spec }}</p>
              </div>
              <div class="detail-stat-card">
                <p class="detail-stat-label">📍 状态</p>
                <p class="detail-stat-value">{{ currentGoods.statusText }}</p>
              </div>
            </div>

            <div class="detail-custom-requirement">
              <p class="detail-custom-label">✂️ 定制要求</p>
              <p class="detail-custom-text">
                {{ currentGoods.customRequirement }}
              </p>
            </div>

            <p class="detail-description">{{ currentGoods.desc }}</p>

            <div class="detail-actions">
              <button class="detail-book-button" @click="goBook" v-if="currentGoods.inStock">
                ✨ 立即预订
              </button>
              <button class="detail-back-button-secondary" @click="go('list')">返回列表</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="page === 'book'" class="page-transition">
        <button @click="go('detail')" class="detail-back-button">← 返回商品详情</button>

        <div class="book-container">
          <h2 class="book-title">📝 提交预订申请</h2>

          <div class="book-product-info">
            <p class="book-product-label">预订商品</p>
            <p class="book-product-name">{{ currentGoods.name }} - ¥{{ currentGoods.price }}/件</p>
            <p class="book-warning" v-if="currentGoods.minOrder && currentGoods.minOrder > 1">
              ⚠️ 此商品最低起订量 {{ currentGoods.minOrder }} 件
            </p>
          </div>

          <div class="book-form">
            <div class="book-form-row">
              <div class="book-form-group">
                <label class="book-label">📦 预订数量 <span class="book-required">*</span></label>
                <div class="book-quantity-controls">
                  <button
                    @click="decrementNum"
                    class="book-quantity-button"
                    :disabled="bookForm.num <= (currentGoods.minOrder || 1)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <input
                    type="number"
                    v-model.number="bookForm.num"
                    :min="currentGoods.minOrder || 1"
                    :max="currentGoods.stock"
                    class="book-quantity-input"
                    @blur="validateNum"
                    @input="validateNumInput"
                  />
                  <button
                    @click="incrementNum"
                    class="book-quantity-button"
                    :disabled="bookForm.num >= currentGoods.stock"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </button>
                </div>
                <p v-if="errors.num" class="book-error">{{ errors.num }}</p>
                <p class="book-quantity-hint">
                  最低 {{ currentGoods.minOrder || 1 }} 件起订，库存剩余 {{ currentGoods.stock }} 件
                </p>
              </div>
              <div class="book-form-group">
                <label class="book-label">📐 尺寸选择 <span class="book-required">*</span></label>
                <select v-model="bookForm.size" class="book-select">
                  <option value="" disabled hidden>请选择尺寸</option>
                  <option
                    v-for="s in currentGoods.sizes || ['S', 'M', 'L', 'XL', 'XXL']"
                    :key="s"
                    :value="s"
                  >
                    {{ s }}
                  </option>
                </select>
                <p v-if="errors.size" class="book-error">{{ errors.size }}</p>
              </div>
            </div>

            <div class="book-form-row">
              <div class="book-form-group">
                <label class="book-label">🎨 颜色选择 <span class="book-required">*</span></label>
                <select v-model="bookForm.color" class="book-select">
                  <option value="" disabled hidden>请选择颜色</option>
                  <option
                    v-for="c in currentGoods.colors || ['红色', '蓝色', '黑色', '白色']"
                    :key="c"
                    :value="c"
                  >
                    {{ c }}
                  </option>
                </select>
                <p v-if="errors.color" class="book-error">{{ errors.color }}</p>
              </div>
              <div class="book-form-group">
                <label class="book-label">📋 定制要求</label>
                <select v-model="bookForm.custom" class="book-select">
                  <option value="" disabled hidden>请选择定制要求</option>
                  <option value="无需定制">无需定制</option>
                  <option value="需要定制">需要定制</option>
                </select>
              </div>
            </div>

            <div class="book-form-group">
              <label class="book-label">📝 备注信息</label>
              <textarea
                v-model="bookForm.remark"
                rows="4"
                class="book-textarea"
                placeholder="请输入其他备注信息..."
              ></textarea>
            </div>
          </div>

          <div class="book-actions">
            <button class="book-submit-button" @click="submitOrder">🚀 提交预订</button>
            <button class="book-cancel-button" @click="go('detail')">取消</button>
          </div>
        </div>
      </div>

      <div v-if="page === 'myorder'" class="page-transition">
        <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
          📦 我的订单
        </h2>

        <div v-if="orders.length > 0" class="orders-container">
          <div v-for="(o, i) in orders" :key="i" class="order-card">
            <div class="order-header">
              <div class="order-info">
                <h3 class="order-title">{{ o.goodsName }}</h3>
                <div class="order-details-grid">
                  <div class="order-detail-item">
                    📦 数量：<span class="order-detail-label">{{ o.num }} 件</span>
                  </div>
                  <div v-if="o.size" class="order-detail-item">
                    📐 尺寸：<span class="order-detail-label">{{ o.size }}</span>
                  </div>
                  <div v-if="o.color" class="order-detail-item">
                    🎨 颜色：<span class="order-detail-label">{{ o.color }}</span>
                  </div>
                  <div v-if="o.custom" class="order-detail-item">
                    ✂️ 定制：<span class="order-detail-label">{{ o.custom }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span :class="'order-status ' + getStatusClass(o.status)">
                  {{ o.statusText }}
                </span>
              </div>
            </div>
            <p class="order-remark">📝 备注：{{ o.remark || '无' }}</p>
            <div class="order-actions">
              <button class="order-detail-button" @click="openOrderDetail(o)">查看详情 →</button>
              <button v-if="o.status === 1" class="order-cancel-button" @click="cancelOrder(i)">
                取消订单
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">🛒</div>
          <p class="empty-text">暂无订单</p>
          <p class="empty-text">快去挑选商品吧～</p>
        </div>
      </div>

      <div v-if="page === 'favorite'" class="page-transition">
        <h2 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
          ❤️ 我的收藏
          <span
            class="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#A755F6] border border-[#C7D2FE]"
          >
            {{ favoriteGoods.length }} 件
          </span>
        </h2>

        <div v-if="favoriteGoods.length > 0" class="favorites-grid">
          <div v-for="g in favoriteGoods" :key="g.id" class="favorite-card" @click="openDetail(g)">
            <div class="favorite-image">
              <img :src="g.img" />
            </div>
            <div class="favorite-content">
              <div class="favorite-header">
                <div class="favorite-tags">
                  <span class="favorite-tag category">{{ g.categoryText }}</span>
                  <span :class="g.inStock ? 'favorite-tag in-stock' : 'favorite-tag out-of-stock'">
                    {{ g.statusText }}
                  </span>
                </div>
                <button
                  class="favorite-heart-button active"
                  @click.stop="toggleFavorite(g)"
                  aria-label="取消收藏"
                >
                  ❤️
                </button>
              </div>
              <h3 class="favorite-name">{{ g.name }}</h3>
              <p class="favorite-spec">{{ g.spec }}</p>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">💗</div>
          <p class="empty-text">还没有收藏商品</p>
          <p class="empty-text">去商品大厅挑选你喜欢的文创吧～</p>
        </div>
      </div>

      <div v-if="page === 'orderDetail'" class="page-transition">
        <button @click="go('myorder')" class="detail-back-button">← 返回订单列表</button>

        <div class="order-detail-container">
          <h2 class="order-detail-title">🧾 订单详情</h2>

          <div class="order-detail-info">
            <div class="order-detail-item">
              <span class="order-detail-label">🎁 商品</span>
              <span class="order-detail-value">{{ currentOrder.goodsName }}</span>
            </div>
            <div class="order-detail-item">
              <span class="order-detail-label">📦 数量</span>
              <span class="order-detail-value">{{ currentOrder.num }} 件</span>
            </div>
            <div v-if="currentOrder.size" class="order-detail-item">
              <span class="order-detail-label">📐 尺寸</span>
              <span class="order-detail-value">{{ currentOrder.size }}</span>
            </div>
            <div v-if="currentOrder.color" class="order-detail-item">
              <span class="order-detail-label">🎨 颜色</span>
              <span class="order-detail-value">{{ currentOrder.color }}</span>
            </div>
            <div v-if="currentOrder.custom" class="order-detail-item">
              <span class="order-detail-label">✂️ 定制</span>
              <span class="order-detail-value">{{ currentOrder.custom }}</span>
            </div>
            <div class="order-detail-item">
              <span class="order-detail-label">📝 备注</span>
              <span class="order-detail-value">{{ currentOrder.remark || '无' }}</span>
            </div>
            <div class="order-detail-item">
              <span class="order-detail-label">📍 状态</span>
              <span :class="'order-detail-status ' + getStatusClass(currentOrder.status)">
                {{ currentOrder.statusText }}
              </span>
            </div>
          </div>

          <div
            v-if="currentOrder.custom === '需要定制' && currentOrder.status === 1"
            class="order-detail-upload"
          >
            <div class="order-detail-upload-icon">📤</div>
            <p class="order-detail-upload-text">上传定制设计稿</p>
            <input type="file" class="detail-file-input" @change="handleFileUpload" />
            <p v-if="selectedDesignFile" class="order-detail-file-info">
              已选文件：{{ selectedDesignFile.name }}
            </p>
            <button class="detail-upload-button" @click="uploadDesign">上传文件</button>
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
            <button class="detail-cancel-button" @click="cancelCurrentOrder">❌ 取消订单</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

interface Goods {
  id: number
  name: string
  price: number
  stock: number
  sold: number
  desc: string
  img: string
  category: string
  categoryText: string
  inStock: boolean
  statusText: string
  spec: string
  customRequirement: string
  sizes: string[]
  colors: string[]
  minOrder?: number
}

interface Order {
  goodsName: string
  num: number
  size: string
  color: string
  custom: string
  remark: string
  status: number
  statusText: string
}

interface BookForm {
  num: number
  size: string
  color: string
  custom: string
  remark: string
}

const page = ref('list')
const currentPage = ref(1)
const pageSize = ref(6)

const categories = [
  { value: '', label: '全部' },
  { value: 'wenchuang', label: '文创产品' },
  { value: 'wuliao', label: '活动物料' },
]

const statusFilters = [
  { value: '', label: '全部' },
  { value: 'available', label: '有货' },
  { value: 'out_of_stock', label: '缺货' },
]

const filters = ref({
  keyword: '',
  category: '',
  status: '',
  minPrice: '',
  maxPrice: '',
})

const goods = ref([
  {
    id: 1,
    name: '校园文化衫',
    price: 39,
    stock: 100,
    sold: 256,
    desc: '纯棉圆领文化衫，透气舒适，支持多种印花定制，是校园活动和班级聚会的不二之选。',
    img: '/images/1.png',
    category: 'wenchuang',
    categoryText: '文创产品',
    inStock: true,
    statusText: '有货',
    spec: 'S/M/L/XL 多尺码',
    customRequirement: '提供设计稿或手绘稿，支持单面/双面/多色印刷',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['白色', '黑色', '藏青', '灰色'],
    minOrder: 1,
  },
  {
    id: 2,
    name: '纪念徽章',
    price: 12,
    stock: 200,
    sold: 589,
    desc: '校园纪念款金属珐琅徽章，精致工艺，收藏级品质，可定制校徽、社团标志。',
    img: '/images/2.png',
    category: 'wenchuang',
    categoryText: '文创产品',
    inStock: true,
    statusText: '有货',
    spec: '直径25mm/30mm/35mm',
    customRequirement: '提供高清矢量图，支持金/银/铜等多种金属材质',
    sizes: ['25mm', '30mm', '35mm'],
    colors: ['金色', '银色', '古铜色'],
    minOrder: 1,
  },
  {
    id: 3,
    name: '定制笔记本',
    price: 25,
    stock: 150,
    sold: 324,
    desc: '可定制封面校园纪念笔记本，100g道林纸，锁线装订，可平摊书写。',
    img: '/images/3.png',
    category: 'wenchuang',
    categoryText: '文创产品',
    inStock: true,
    statusText: '有货',
    spec: 'A5/160页',
    customRequirement: '可定制封面图案、封底LOGO，支持烫金/烫银工艺',
    sizes: ['A5', 'B5'],
    colors: ['典雅黑', '樱花粉', '天空蓝', '象牙白'],
    minOrder: 1,
  },
  {
    id: 4,
    name: '活动横幅',
    price: 80,
    stock: 50,
    sold: 87,
    desc: '优质牛津布材质，高清喷印，色彩鲜艳，可反复使用，支持定制尺寸。',
    img: '/images/4.png',
    category: 'wuliao',
    categoryText: '活动物料',
    inStock: true,
    statusText: '有货',
    spec: '6米/8米/10米',
    customRequirement: '提供CMYK格式设计稿，支持多种尺寸定制',
    sizes: ['6m×0.8m', '8m×0.8m', '10m×1m', '12m×1m'],
    colors: ['红底白字', '蓝底白字', '黄底黑字', '定制'],
    minOrder: 50,
  },
  {
    id: 5,
    name: '手提纸袋',
    price: 5,
    stock: 500,
    sold: 1200,
    desc: '250g白卡纸材质，精致印刷，绳结提手，送礼佳品。',
    img: '/images/5.png',
    category: 'wuliao',
    categoryText: '活动物料',
    inStock: true,
    statusText: '有货',
    spec: '21×27×12cm',
    customRequirement: '可定制LOGO和图案',
    sizes: ['小', '中', '大'],
    colors: ['牛皮纸色', '白色', '彩色印刷'],
    minOrder: 200,
  },
  {
    id: 6,
    name: '马克杯',
    price: 35,
    stock: 0,
    sold: 156,
    desc: '陶瓷马克杯，支持热转印定制，杯身可印刷照片、图案、文字。',
    img: '/images/6.png',
    category: 'wenchuang',
    categoryText: '文创产品',
    inStock: false,
    statusText: '缺货',
    spec: '350ml',
    customRequirement: '提供高清图片，支持整圈印刷',
    sizes: ['350ml', '500ml'],
    colors: ['白色', '黑色', '渐变蓝'],
    minOrder: 1,
  },
  {
    id: 7,
    name: '定制帆布袋',
    price: 28,
    stock: 80,
    sold: 423,
    desc: '16安加厚帆布，环保耐用，支持丝网印刷，多种颜色可选。',
    img: '/images/7.png',
    category: 'wuliao',
    categoryText: '活动物料',
    inStock: true,
    statusText: '有货',
    spec: '40×35×10cm',
    customRequirement: '支持单面/双面印刷',
    sizes: ['标准', '加大'],
    colors: ['原色', '黑色', '藏青', '卡其'],
    minOrder: 50,
  },
  {
    id: 8,
    name: '钥匙扣',
    price: 8,
    stock: 300,
    sold: 892,
    desc: '亚克力钥匙扣，双面高清印刷，支持定制任意图案。',
    img: '/images/8.png',
    category: 'wenchuang',
    categoryText: '文创产品',
    inStock: true,
    statusText: '有货',
    spec: '5cm',
    customRequirement: '提供PNG透明底图片，支持异形切割',
    sizes: ['4cm', '5cm', '6cm'],
    colors: ['透明边', '白边', '彩印'],
    minOrder: 1,
  },
  {
    id: 9,
    name: '海报印刷',
    price: 15,
    stock: 9999,
    sold: 2341,
    desc: '157g铜版纸，高清印刷，支持多种尺寸，可覆膜防水。',
    img: '/images/9.png',
    category: 'wuliao',
    categoryText: '活动物料',
    inStock: true,
    statusText: '有货',
    spec: 'A3/A2/A1',
    customRequirement: '提供CMYK格式设计稿，支持覆哑膜/亮膜',
    sizes: ['A4', 'A3', 'A2', 'A1', 'A0'],
    colors: ['彩色', '黑白'],
    minOrder: 1,
  },
])

const currentGoods = ref<Goods>({} as Goods)
const bookForm = ref<BookForm>({ num: 1, size: '', color: '', custom: '', remark: '' })
const errors = ref<Record<string, string>>({})
const orders = ref<Order[]>([])
const currentOrder = ref<Order>({} as Order)
const selectedDesignFile = ref<File | null>(null)
const favoriteIds = ref<number[]>([])

// 弹窗相关
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
let pendingConfirmAction: (() => void) | null = null

const filteredGoods = computed(() => {
  let arr = goods.value
  if (filters.value.keyword) {
    const kw = filters.value.keyword.toLowerCase()
    arr = arr.filter(
      (g) =>
        g.name.toLowerCase().includes(kw) ||
        g.desc.toLowerCase().includes(kw) ||
        g.categoryText.includes(filters.value.keyword),
    )
  }
  if (filters.value.category) arr = arr.filter((g) => g.category === filters.value.category)
  if (filters.value.status === 'available') arr = arr.filter((g) => g.inStock)
  if (filters.value.status === 'out_of_stock') arr = arr.filter((g) => !g.inStock)
  if (filters.value.minPrice !== '')
    arr = arr.filter((g) => g.price >= Number(filters.value.minPrice))
  if (filters.value.maxPrice !== '')
    arr = arr.filter((g) => g.price <= Number(filters.value.maxPrice))
  return arr
})

const totalPages = computed(() => Math.ceil(filteredGoods.value.length / pageSize.value) || 1)
const pendingOrderCount = computed(
  () => orders.value.filter((o) => o.status === 1 || o.status === 2 || o.status === 3).length,
)
const favoriteGoods = computed(() => goods.value.filter((g) => favoriteIds.value.includes(g.id)))

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

const isFavorite = (goodsId: number) => favoriteIds.value.includes(goodsId)

const toggleFavorite = (goodsItem: Goods) => {
  if (!goodsItem || !goodsItem.id) return
  if (isFavorite(goodsItem.id)) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== goodsItem.id)
    showSuccessDialog('已取消收藏', `${goodsItem.name} 已从收藏夹移除。`)
  } else {
    favoriteIds.value = [...favoriteIds.value, goodsItem.id]
    showSuccessDialog('收藏成功', `${goodsItem.name} 已加入收藏夹。`)
  }
  saveFavoriteIds()
}

watch(currentPage, (newVal) => {
  if (newVal < 1) currentPage.value = 1
  if (newVal > totalPages.value) currentPage.value = totalPages.value
})

const closeDialog = () => {
  showDialog.value = false
  pendingConfirmAction = null
}

// 美化弹窗函数
const showSuccessDialog = (title: string, message: string) => {
  ElMessage({
    message: `${title}：${message}`,
    type: 'success',
    duration: 2000,
    showClose: true,
  })
}

const showWarningDialog = (title: string, message: string) => {
  ElMessage({
    message: `${title}：${message}`,
    type: 'warning',
    duration: 2500,
    showClose: true,
  })
}

const showConfirmDialog = (title: string, message: string, action: () => void) => {
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
  if (pendingConfirmAction) pendingConfirmAction()
  pendingConfirmAction = null
}

const go = (p: string) => {
  page.value = p
  errors.value = {}
  if (p === 'list') currentPage.value = 1
}

const openDetail = (g: Goods) => {
  currentGoods.value = g
  // 关键修复：这里不再给size/color赋默认值，而是设为空，让下拉框显示提示
  bookForm.value = {
    num: g.minOrder || 1,
    size: '',
    color: '',
    custom: '',
    remark: '',
  }
  go('detail')
}

const goBook = () => {
  if (!currentGoods.value.inStock) {
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

const validateNumInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const val = target.value
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

  if (!bookForm.value.num || bookForm.value.num < minOrder) {
    errors.value.num = `请输入有效的预订数量（${minOrder}件起订）`
    valid = false
  }
  if (bookForm.value.num > currentGoods.value.stock) {
    errors.value.num = `库存不足，最多可预订 ${currentGoods.value.stock} 件`
    valid = false
  }
  if (!bookForm.value.size) {
    errors.value.size = '请选择尺寸'
    valid = false
  }
  if (!bookForm.value.color) {
    errors.value.color = '请选择颜色'
    valid = false
  }
  return valid
}

const submitOrder = () => {
  if (!currentGoods.value.inStock || currentGoods.value.stock <= 0) {
    showWarningDialog('库存不足', '该商品当前不可预订，请返回列表选择其他商品。')
    go('detail')
    return
  }
  if (!validateForm()) return
  const order = {
    goodsName: currentGoods.value.name,
    num: bookForm.value.num,
    size: bookForm.value.size,
    color: bookForm.value.color,
    custom: bookForm.value.custom,
    remark: bookForm.value.remark,
    status: 1,
    statusText: bookForm.value.custom === '需要定制' ? '待上传设计稿' : '待处理',
  }
  orders.value.unshift(order)
  currentGoods.value.stock -= bookForm.value.num
  currentGoods.value.sold += bookForm.value.num
  if (currentGoods.value.stock <= 0) {
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
  if (!orders.value[index] || orders.value[index].status !== 1) {
    showWarningDialog('无法取消', '仅待处理状态订单可以取消。')
    return
  }
  showConfirmDialog('取消订单', '确定要取消这个订单吗？', () => {
    const canceled = orders.value.splice(index, 1)[0]
    const item = goods.value.find((g) => g.name === canceled.goodsName)
    if (item) {
      item.stock += canceled.num
      item.sold -= canceled.num
      if (item.stock > 0 && !item.inStock) {
        item.inStock = true
        item.statusText = '有货'
      }
    }
    showSuccessDialog('操作成功', '订单已取消！')
  })
}

const cancelCurrentOrder = () => {
  if (currentOrder.value.status !== 1) {
    showWarningDialog('无法取消', '当前订单状态不允许取消。')
    return
  }
  showConfirmDialog('取消订单', '确定要取消这个订单吗？', () => {
    const index = orders.value.findIndex((o) => o === currentOrder.value)
    if (index > -1) {
      const canceled = orders.value.splice(index, 1)[0]
      const item = goods.value.find((g) => g.name === canceled.goodsName)
      if (item) {
        item.stock += canceled.num
        item.sold -= canceled.num
        if (item.stock > 0 && !item.inStock) {
          item.inStock = true
          item.statusText = '有货'
        }
      }
    }
    showSuccessDialog('操作成功', '订单已取消！')
    go('myorder')
  })
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  selectedDesignFile.value = file || null
  if (file) {
    showSuccessDialog('文件已选择', `已选择：${file.name}`)
  }
}

const uploadDesign = () => {
  if (currentOrder.value.custom !== '需要定制' || currentOrder.value.status !== 1) {
    showWarningDialog('无需上传', '当前订单不处于待上传设计稿状态。')
    return
  }
  if (!selectedDesignFile.value) {
    showWarningDialog('请选择文件', '请先选择设计稿文件后再上传。')
    return
  }
  currentOrder.value.status = 2
  currentOrder.value.statusText = '制作中'
  showSuccessDialog('上传成功', `设计稿 ${selectedDesignFile.value.name} 已成功上传！`)
  selectedDesignFile.value = null
}

const finishOrder = () => {
  if (currentOrder.value.status !== 3) {
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
    5: 'bg-[#f3f4f6] text-[#6b7280]',
  }
  return classes[s] || 'bg-[#f3f4f6] text-[#6b7280]'
}

const applyFilter = () => {
  const minPrice = Number(filters.value.minPrice)
  const maxPrice = Number(filters.value.maxPrice)
  if (filters.value.minPrice !== '' && filters.value.maxPrice !== '' && minPrice > maxPrice) {
    showWarningDialog('价格区间有误', '最低价不能高于最高价，请调整后再搜索。')
    return
  }
  currentPage.value = 1
}

const resetFilter = () => {
  filters.value = { keyword: '', category: '', status: '', minPrice: '', maxPrice: '' }
  currentPage.value = 1
}

const handleLogout = () => {
  // 清除本地存储的登录信息
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  // 显示退出登录提示
  ElMessage.success({
    message: '已成功退出登录！',
    duration: 2000,
  })

  // 直接跳转到 introPage 首页
  router.push('/')
}

loadFavoriteIds()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;800&display=swap');
@import '@/styles/studentPage.css';

:root {
  --first-color: #a755f6;
  --second-color: #7c3aed;
  --el-color-primary: #a755f6;
  --el-color-primary-light-3: #c4b5fd;
  --el-color-primary-light-5: #d8b4fe;
  --el-color-primary-light-7: #e9d5ff;
  --el-color-primary-light-8: #f3e8ff;
  --el-color-primary-light-9: #faf5ff;
  --el-color-primary-dark-2: #7c3aed;
  --el-border-radius-base: 12px;
}

body {
  font-family: 'Noto Sans SC', sans-serif;
}

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
  border-color: #a755f6;
  box-shadow: 0 0 0 3px rgba(167, 85, 246, 0.18);
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
  color: #a755f6;
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
  transition:
    transform 0.18s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
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
