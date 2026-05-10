<template>
  <!-- 自定义弹窗：Teleport 到 body + 纯 CSS，避免未加载 Tailwind 时布局崩溃 -->
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="showDialog" class="sp-dialog-overlay" role="dialog" aria-modal="true">
        <div class="sp-dialog-backdrop" aria-hidden="true" @click="closeDialog"></div>
        <div class="sp-dialog-card" @click.stop>
          <!-- 成功弹窗 -->
          <div v-if="dialogType === 'success'" class="sp-dialog-body">
            <div class="sp-dialog-icon sp-dialog-icon--success">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="sp-dialog-icon-svg">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 class="sp-dialog-title">{{ dialogTitle }}</h3>
            <p class="sp-dialog-msg">{{ dialogMessage }}</p>
            <button
              type="button"
              class="sp-dialog-btn sp-dialog-btn--primary sp-dialog-btn--block"
              @click="closeDialog"
            >
              好的，知道了
            </button>
          </div>
          <!-- 警告弹窗 -->
          <div v-else-if="dialogType === 'warning'" class="sp-dialog-body">
            <div class="sp-dialog-icon sp-dialog-icon--warning">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="sp-dialog-icon-svg">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
            <h3 class="sp-dialog-title">{{ dialogTitle }}</h3>
            <p class="sp-dialog-msg">{{ dialogMessage }}</p>
            <button
              type="button"
              class="sp-dialog-btn sp-dialog-btn--warning sp-dialog-btn--block"
              @click="closeDialog"
            >
              好的
            </button>
          </div>
          <!-- 确认弹窗（导出明细、确认收货、取消订单、退出登录等） -->
          <div v-else-if="dialogType === 'confirm'" class="sp-dialog-body">
            <div class="sp-dialog-icon sp-dialog-icon--confirm">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="sp-dialog-icon-svg">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 class="sp-dialog-title">{{ dialogTitle }}</h3>
            <p class="sp-dialog-msg">{{ dialogMessage }}</p>
            <div class="sp-dialog-actions">
              <button
                type="button"
                class="sp-dialog-btn sp-dialog-btn--ghost"
                @click="confirmCancel"
              >
                取消
              </button>
              <button
                type="button"
                class="sp-dialog-btn sp-dialog-btn--primary"
                @click="confirmAction"
              >
                {{ dialogConfirmText }}
              </button>
            </div>
          </div>
          <!-- 兜底：避免 dialogType 未匹配时只剩全屏遮罩、底层按钮全部点不到 -->
          <div v-else class="sp-dialog-body">
            <h3 class="sp-dialog-title">提示</h3>
            <p class="sp-dialog-msg">对话框状态异常，请关闭后重试。</p>
            <button
              type="button"
              class="sp-dialog-btn sp-dialog-btn--primary sp-dialog-btn--block"
              @click="closeDialog"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <div class="student-page">
    <div class="student-container">
      <div class="student-header">
        <div class="student-header-main">
          <div class="student-header-copy">
            <h1 class="student-title">🎨 校园文创预订系统</h1>
          </div>
          <div class="student-header-actions">
            <span v-if="userStore.email" class="student-user-meta" :title="userStore.email">
              <span class="student-user-label">账号</span>
              <span class="student-user-value">{{ userDisplayShort }}</span>
            </span>
            <span v-else class="student-user-meta student-user-meta--guest">
              <span class="student-user-value">访客模式</span>
            </span>
            <el-button class="student-logout-btn" text type="primary" @click="handleLogoutClick">
              退出登录
            </el-button>
          </div>
        </div>
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
              @click="setCategoryFilter(cat)"
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
              @click="setStatusFilter(s)"
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
          <div class="filter-group filter-group--search">
            <span class="filter-label">🔍 搜索</span>
            <div class="search-row">
              <input
                type="text"
                v-model="filters.keyword"
                placeholder="商品名称或描述..."
                @keyup.enter="applyFilter"
                class="search-input"
              />
              <button type="button" @click="applyFilter" class="search-button">搜索</button>
              <button type="button" @click="resetFilter" class="reset-button">重置</button>
            </div>
          </div>
        </div>

        <div v-if="filteredGoods.length > 0" class="goods-grid goods-grid--list-page">
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
              <p class="goods-price" :class="{ 'goods-price--out': !g.inStock }">
                ¥{{ formatGoodsCardPrice(g.price) }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">🔍</div>
          <p class="empty-text">没有找到符合条件的商品</p>
        </div>

        <div v-if="filteredGoods.length > 0" class="pagination">
          <button
            v-if="showPaginationPrev"
            type="button"
            @click="currentPage--"
            class="pagination-button"
          >
            ← 上一页
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            @click="currentPage = p"
            :class="currentPage === p ? 'pagination-button active' : 'pagination-button'"
          >
            {{ p }}
          </button>
          <button
            v-if="showPaginationNext"
            type="button"
            @click="currentPage++"
            class="pagination-button"
          >
            下一页 →
          </button>
        </div>
      </div>

      <div v-if="page === 'detail'" class="page-transition detail-page">
        <button type="button" @click="go('list')" class="detail-back-button">← 返回商品大厅</button>

        <div class="detail-page-layout">
          <div class="detail-page-sidebar">
            <section class="detail-summary-card" aria-label="商品信息">
              <div class="detail-image-frame detail-image-frame--side">
                <img
                  :src="currentGoods.img"
                  class="detail-image"
                  :alt="currentGoods.name || '商品图片'"
                />
              </div>

              <div class="detail-tags">
                <span class="detail-tag category">{{ currentGoods.categoryText }}</span>
                <span
                  :class="currentGoods.inStock ? 'detail-tag in-stock' : 'detail-tag out-of-stock'"
                >
                  {{ currentGoods.statusText }}
                </span>
              </div>

              <div class="detail-header">
                <h2 class="detail-title">{{ currentGoods.name }}</h2>
                <button
                  type="button"
                  class="detail-favorite-button"
                  :class="{ active: isFavorite(currentGoods.id) }"
                  @click="toggleFavorite(currentGoods)"
                  :aria-label="isFavorite(currentGoods.id) ? '取消收藏' : '收藏商品'"
                >
                  {{ isFavorite(currentGoods.id) ? '❤️' : '🤍' }}
                </button>
              </div>

              <p class="detail-price">¥{{ currentGoods.price }}</p>

              <div class="detail-stats-grid detail-stats-grid--compact">
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

              <p
                v-if="currentGoods.minOrder && currentGoods.minOrder > 1"
                class="book-warning detail-min-order-warning"
              >
                ⚠️ 此商品最低起订量 {{ currentGoods.minOrder }} 件
              </p>

              <div class="detail-custom-requirement">
                <p class="detail-custom-label">✂️ 定制要求</p>
                <p class="detail-custom-text">{{ currentGoods.customRequirement }}</p>
              </div>

              <div class="detail-description-wrap">
                <p class="detail-description-label">商品说明</p>
                <p class="detail-description">{{ currentGoods.desc }}</p>
              </div>
            </section>
          </div>

          <div class="detail-page-main">
            <template v-if="currentGoods.inStock">
              <section class="detail-book-card" aria-label="预订表单">
                <p class="book-product-label detail-book-card-label">规格与预订</p>
                <div class="book-form detail-book-form">
                  <div class="book-form-row detail-book-form-row-pair">
                    <div class="book-form-group">
                      <label class="book-label"
                        >📦 预订数量 <span class="book-required">*</span></label
                      >
                      <div class="book-quantity-controls">
                        <button
                          type="button"
                          @click="decrementNum"
                          class="book-quantity-button"
                          :disabled="bookForm.num <= (currentGoods.minOrder || 1)"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                          type="button"
                          @click="incrementNum"
                          class="book-quantity-button"
                          :disabled="bookForm.num >= currentGoods.stock"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                        最低 {{ currentGoods.minOrder || 1 }} 件起订，库存剩余
                        {{ currentGoods.stock }} 件
                      </p>
                    </div>
                    <div class="book-form-group">
                      <label class="book-label"
                        >📐 尺寸选择 <span class="book-required">*</span></label
                      >
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

                  <div class="book-form-row detail-book-form-row-pair">
                    <div class="book-form-group">
                      <label class="book-label"
                        >🎨 颜色选择 <span class="book-required">*</span></label
                      >
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
                      rows="3"
                      class="book-textarea"
                      placeholder="请输入其他备注信息..."
                    ></textarea>
                  </div>
                </div>

                <div class="detail-book-actions">
                  <button type="button" class="book-submit-button" @click="submitOrder">
                    ✨ 立即预订
                  </button>
                  <button type="button" class="book-cancel-button" @click="go('list')">取消</button>
                </div>
              </section>
            </template>

            <div v-else class="detail-book-card detail-book-card--out-of-stock">
              <p class="detail-out-of-stock-text">该商品目前缺货，暂时无法预订</p>
              <button type="button" class="book-cancel-button" @click="go('list')">返回列表</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="page === 'myorder'" class="page-transition">
        <h2 class="section-heading">
          <span>📦 我的订单</span>
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
        <h2 class="section-heading">
          <span>❤️ 我的收藏</span>
          <span class="section-heading-badge">{{ favoriteGoods.length }} 件</span>
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

          <!-- ========== 订单详情 · 定制设计稿上传区（图标点击 = 打开文件选择，与点 input 一致）========== -->
          <div
            v-if="(currentOrder.custom === '需要定制' || currentOrder.customRequirement) && currentOrder.status === 1"
            class="order-detail-upload"
          >
            <!-- 【新增】图标点击触发下方 ref="designFileInputRef" 的 file input -->
            <div
              class="order-detail-upload-icon"
              role="button"
              tabindex="0"
              aria-label="选择设计稿文件"
              @click="triggerFileUpload"
              @keydown.enter.prevent="triggerFileUpload"
              @keydown.space.prevent="triggerFileUpload"
            >
              📤
            </div>
            <p class="order-detail-upload-text">上传定制设计稿</p>
            <!-- 【新增】id 供无障碍；ref 供 triggerFileUpload() 内 .click() -->
            <input
              id="order-design-file-input"
              ref="designFileInputRef"
              type="file"
              class="detail-file-input detail-file-input--visually-hidden"
              tabindex="-1"
              @change="handleFileUpload"
            />
            <p v-if="selectedDesignFile" class="order-detail-file-info">
              已选文件：{{ selectedDesignFile.name }}
            </p>
            <button type="button" class="order-detail-action-primary" @click="uploadDesign">
              上传文件
            </button>
          </div>

          <div v-if="currentOrder.status === 3" class="flex justify-center">
            <button type="button" class="order-detail-action-success" @click="finishOrder">
              ✅ 确认收货
            </button>
          </div>

          <div v-if="currentOrder.status === 1" class="flex justify-center">
            <button type="button" class="order-detail-action-danger" @click="cancelCurrentOrder">
              ❌ 取消订单
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getProducts, getProductDetail } from '@/api/product'
import {
  createOrder,
  getMyOrders,
  getOrderDetail,
  uploadDesign as apiUploadDesign,
} from '@/api/order'

const router = useRouter()
const userStore = useUserStore()

const userDisplayShort = computed(() => {
  const e = userStore.email?.trim()
  if (!e) return ''
  if (e.length <= 26) return e
  const at = e.indexOf('@')
  if (at <= 0) return `${e.slice(0, 18)}…`
  return `${e.slice(0, 8)}…${e.slice(at)}`
})

function handleLogoutClick() {
  showConfirmDialog(
    '退出登录',
    '确定要退出登录吗？',
    () => {
      userStore.logout()
      ElMessage.success('已退出登录')
      void router.replace('/login')
    },
    { confirmText: '确定' },
  )
}

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
  /** 后端订单ID */
  id?: number
  /** 订单编号 */
  orderNo?: string
  /** 下单时间（毫秒时间戳） */
  createdAt?: number
  /** 单价（元） */
  unitPrice?: number
  /** 订单金额（元） */
  totalAmount?: number
  /** 支付 / 结算说明 */
  paymentRecord?: string
  goodsName: string
  num: number
  size: string
  color: string
  custom: string
  remark: string
  status: number
  statusText: string
  /** 后端原始状态字符串 */
  statusRaw?: string
  /** 商品的定制要求 */
  customRequirement?: string
}

interface BookForm {
  num: number
  size: string
  color: string
  custom: string
  remark: string
}

/** 商品卡片价格：¥XX.XX，取自商品数据 */
function formatGoodsCardPrice(price: number) {
  const n = Number(price)
  return Number.isFinite(n) ? n.toFixed(2) : '0.00'
}

const page = ref('list')
/** 商品大厅每页条数（2 行×4 列 = 8） */
const GOODS_LIST_PAGE_SIZE = 8

const API_BASE_URL = 'http://127.0.0.1:8000'

const getImageUrl = (path: string): string => {
  if (!path) return '/images/default.png'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('//')) return 'http:' + path
  return API_BASE_URL + path
}

const currentPage = ref(1)
const pageSize = ref(GOODS_LIST_PAGE_SIZE)

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
// 【新增】与模板中 ref="designFileInputRef" 对应
const designFileInputRef = ref<HTMLInputElement | null>(null)

// 【新增】点击上传图标时调用，与直接点击 <input type="file">（含「选择文件」）效果一致
const triggerFileUpload = () => {
  designFileInputRef.value?.click()
}
const favoriteIds = ref<number[]>([])

// 加载状态
const loading = ref({
  goods: false,
  detail: false,
  order: false,
  orders: false,
  favorite: false,
  upload: false,
})

/** 导出订单：可选日期区间（YYYY-MM-DD），空表示不按日期筛选 */
const exportStartDate = ref('')
const exportEndDate = ref('')
const exportLoading = ref(false)

// 弹窗相关
const showDialog = ref(false)
const dialogType = ref<'success' | 'warning' | 'confirm'>('confirm')
const dialogTitle = ref('')
const dialogMessage = ref('')
const dialogConfirmText = ref('确认')
let pendingConfirmAction: (() => void) | null = null

interface ConfirmDialogOptions {
  confirmText?: string
}

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

/** 仅多页时显示；不在第 1 页时显示上一页 */
const showPaginationPrev = computed(() => totalPages.value > 1 && currentPage.value > 1)

/** 仅当本页满页且仍有后续页时显示下一页 */
const showPaginationNext = computed(
  () =>
    totalPages.value > 1 &&
    paginatedGoods.value.length === pageSize.value &&
    currentPage.value < totalPages.value,
)

const loadFavoriteIds = () => {
  try {
    const stored = localStorage.getItem('campus_favorites')
    if (stored) {
      favoriteIds.value = JSON.parse(stored)
    } else {
      favoriteIds.value = []
    }
  } catch (error) {
    console.error('加载收藏失败', error)
    favoriteIds.value = []
  }
}

const isFavorite = (goodsId: number) => favoriteIds.value.includes(goodsId)

const toggleFavorite = (goodsItem: Goods) => {
  if (!goodsItem || !goodsItem.id) return

  try {
    if (isFavorite(goodsItem.id)) {
      favoriteIds.value = favoriteIds.value.filter((id) => id !== goodsItem.id)
      localStorage.setItem('campus_favorites', JSON.stringify(favoriteIds.value))
      showSuccessDialog('已取消收藏', `${goodsItem.name} 已从收藏夹移除。`)
    } else {
      favoriteIds.value = [...favoriteIds.value, goodsItem.id]
      localStorage.setItem('campus_favorites', JSON.stringify(favoriteIds.value))
      showSuccessDialog('收藏成功', `${goodsItem.name} 已加入收藏夹。`)
    }
  } catch (error) {
    console.error('收藏操作失败', error)
    ElMessage.error('收藏操作失败，请重试')
  }
}

const setCategoryFilter = (cat: { value: string; label: string }) => {
  filters.value.category = cat.value
  currentPage.value = 1
}

const setStatusFilter = (s: { value: string; label: string }) => {
  filters.value.status = s.value
  currentPage.value = 1
}

watch(currentPage, (newVal) => {
  if (newVal < 1) currentPage.value = 1
  if (newVal > totalPages.value) currentPage.value = totalPages.value
})

/** 筛选/搜索条件变化时回到第 1 页（与 filteredGoods 计算结果联动） */
watch(
  filters,
  () => {
    currentPage.value = 1
  },
  { deep: true },
)

const closeDialog = () => {
  showDialog.value = false
  pendingConfirmAction = null
  dialogConfirmText.value = '确认'
}

function onGlobalKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (!showDialog.value) return
  e.preventDefault()
  closeDialog()
}

// 加载商品列表
const loadGoods = async () => {
  try {
    loading.value.goods = true
    const res = await getProducts()
    if (res && res.data && Array.isArray(res.data)) {
      goods.value = res.data.map((item) => {
        const existingGoods = goods.value.find((g) => g.id === item.id)
        return {
          id: item.id,
          name: item.name,
          price: parseFloat(item.price) || 0,
          stock: item.available_stock ?? item.stock ?? 0,
          sold: item.sold_stock || 0,
          desc: existingGoods?.desc || '',
          img: existingGoods?.img || '/images/default.png',
          category: item.category || 'wenchuang',
          categoryText: item.category || '文创产品',
          inStock: item.available_stock > 0,
          statusText: item.is_stock_low ? '库存紧张' : item.available_stock > 0 ? '有货' : '缺货',
          spec: existingGoods?.spec || '',
          customRequirement: existingGoods?.customRequirement || '',
          sizes: existingGoods?.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
          colors: existingGoods?.colors || ['红色', '蓝色', '黑色', '白色'],
          minOrder: existingGoods?.minOrder || 1,
        }
      })
    }
  } catch (error) {
    console.error('加载商品列表失败', error)
    ElMessage.error('加载商品列表失败，将使用本地数据')
  } finally {
    loading.value.goods = false
  }
}

// 加载我的订单
const loadOrders = async () => {
  try {
    loading.value.orders = true
    const res = await getMyOrders()
    if (res && res.data && Array.isArray(res.data)) {
      orders.value = res.data.map((item) => {
        const product = goods.value.find((g) => g.id === item.product_id)
        const hasCustomRequirement = product?.customRequirement || ''
        return {
          id: item.id,
          orderNo: item.order_no,
          createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
          unitPrice: item.unit_price ? parseFloat(item.unit_price) : 0,
          totalAmount: item.total_price ? parseFloat(item.total_price) : 0,
          paymentRecord: '待支付（校园文创预订·统一结算）',
          goodsName: item.product?.name || '未知商品',
          num: item.quantity,
          size: item.size || '',
          color: item.color || '',
          custom: hasCustomRequirement ? '需要定制' : '',
          remark: item.remark || '',
          status: statusStringToNumber(item.status),
          statusRaw: item.status,
          statusText: getStatusText(item.status),
          customRequirement: hasCustomRequirement,
        }
      })
    }
  } catch (error) {
    console.error('加载订单失败', error)
    ElMessage.error('加载订单失败，将使用本地数据')
  } finally {
    loading.value.orders = false
  }
}

// 状态字符串转数字
const statusStringToNumber = (status: string): number => {
  const map: Record<string, number> = {
    draft: 0,
    booked: 1,
    design_pending: 2,
    ready: 3,
    completed: 4,
    rejected: 5,
  }
  return map[status] ?? 0
}

// 获取状态显示文本
const getStatusText = (status: number | string): string => {
  const numStatus = typeof status === 'string' ? statusStringToNumber(status) : status
  const map: Record<number, string> = {
    0: '草稿',
    1: '已预订',
    2: '待审核',
    3: '待收货',
    4: '已完成',
    5: '已驳回',
  }
  return map[numStatus] ?? '未知'
}

onMounted(() => {
  userStore.updateFromStorage()
  document.addEventListener('keydown', onGlobalKeydown, true)
  loadGoods()
  loadOrders()
  loadFavoriteIds()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onGlobalKeydown, true)
})

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

const showConfirmDialog = (
  title: string,
  message: string,
  action: () => void,
  options?: ConfirmDialogOptions,
) => {
  dialogType.value = 'confirm'
  dialogTitle.value = title
  dialogMessage.value = message
  dialogConfirmText.value = options?.confirmText ?? '确认'
  pendingConfirmAction = action
  showDialog.value = true
}

const confirmCancel = () => {
  closeDialog()
}

const confirmAction = () => {
  showDialog.value = false
  const fn = pendingConfirmAction
  pendingConfirmAction = null
  dialogConfirmText.value = '确认'
  if (fn) {
    try {
      fn()
    } catch (e) {
      console.error(e)
      ElMessage.error('操作失败，请重试')
    }
  }
}

const go = (p: string) => {
  page.value = p
  errors.value = {}
  if (p === 'list') currentPage.value = 1
}

const openDetail = async (g: Goods) => {
  try {
    loading.value.detail = true

    let goodsData = g

    try {
      const res = await getProductDetail(g.id)
      if (res && res.data) {
        const item = res.data
        const firstDesignExample = item.attachments?.design_examples?.[0]?.url
        goodsData = {
          id: item.id,
          name: item.name,
          price: parseFloat(item.price) || g.price,
          stock: item.stock,
          sold: g.sold,
          desc: g.desc,
          img: firstDesignExample ? getImageUrl(firstDesignExample) : g.img,
          category: item.category || g.category,
          categoryText: g.categoryText,
          inStock: item.status === 'active' && item.stock > 0,
          statusText: item.status === 'active' ? (item.stock > 0 ? '有货' : '缺货') : '已下架',
          spec: g.spec,
          customRequirement: g.customRequirement,
          sizes: g.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
          colors: g.colors || ['红色', '蓝色', '黑色', '白色'],
          minOrder: g.minOrder || 1,
        }
      }
    } catch (error) {
      console.warn('加载商品详情失败，使用本地数据', error)
    }

    currentGoods.value = goodsData
    bookForm.value = {
      num: goodsData.minOrder || 1,
      size: '',
      color: '',
      custom: '',
      remark: '',
    }
    go('detail')
  } catch (error) {
    console.error('打开商品详情失败', error)
    ElMessage.error('打开商品详情失败')
  } finally {
    loading.value.detail = false
  }
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

  if (!valid) {
    ElMessage.warning('请填写所有必填项')
  }

  return valid
}

const submitOrder = async () => {
  if (loading.value.order) return

  if (!currentGoods.value.inStock || currentGoods.value.stock <= 0) {
    showWarningDialog('库存不足', '该商品当前不可预订，请返回列表选择其他商品。')
    return
  }
  if (!validateForm()) return

  try {
    loading.value.order = true

    const orderData = {
      product_id: currentGoods.value.id,
      quantity: bookForm.value.num,
      size: bookForm.value.size,
      color: bookForm.value.color,
      remark: bookForm.value.remark,
    }

    const res = await createOrder(orderData)

    if (res && res.data) {
      const item = res.data
      const order: Order = {
        id: item.id,
        orderNo: item.order_no,
        createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
        unitPrice: item.unit_price ? parseFloat(item.unit_price) : currentGoods.value.price,
        totalAmount: item.total_price
          ? parseFloat(item.total_price)
          : currentGoods.value.price * bookForm.value.num,
        paymentRecord: '待支付（校园文创预订·统一结算）',
        goodsName: item.product?.name || currentGoods.value.name,
        num: item.quantity,
        size: item.size || bookForm.value.size,
        color: item.color || bookForm.value.color,
        custom: bookForm.value.custom || '',
        remark: item.remark || bookForm.value.remark,
        status: statusStringToNumber(item.status),
        statusRaw: item.status,
        statusText: getStatusText(item.status),
        customRequirement: currentGoods.value.customRequirement || '',
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
  } catch (error: any) {
    console.error('创建订单失败', error)
    const message = error.response?.data?.message || '预订失败，请重试'
    ElMessage.error(message)
  } finally {
    loading.value.order = false
  }
}

const openOrderDetail = async (o: Order) => {
  try {
    if (o.id) {
      try {
        const item = await getOrderDetail(o.id)
        if (item) {
          currentOrder.value = {
            id: item.id,
            orderNo: item.order_no,
            createdAt: item.created_at ? new Date(item.created_at).getTime() : o.createdAt,
            unitPrice: item.unit_price ? parseFloat(item.unit_price) : o.unitPrice,
            totalAmount: item.total_price ? parseFloat(item.total_price) : o.totalAmount,
            paymentRecord: '待支付（校园文创预订·统一结算）',
            goodsName: item.product?.name || o.goodsName,
            num: item.quantity || o.num,
            size: item.size || o.size,
            color: item.color || o.color,
            custom: o.custom || (o.customRequirement ? '需要定制' : ''),
            remark: item.remark || o.remark,
            status: statusStringToNumber(item.status),
            statusRaw: item.status,
            statusText: getStatusText(item.status),
            customRequirement: o.customRequirement || '',
          }
          go('orderDetail')
          return
        }
      } catch (error) {
        console.warn('加载订单详情失败，使用本地数据', error)
      }
    }
    currentOrder.value = o
    go('orderDetail')
  } catch (error) {
    console.error('打开订单详情失败', error)
    ElMessage.error('打开订单详情失败')
  }
}

const cancelOrder = (index: number) => {
  if (!orders.value[index] || orders.value[index].status !== 1) {
    showWarningDialog('无法取消', '仅待处理状态订单可以取消。')
    return
  }
  showConfirmDialog('取消订单', '确定要取消这个订单吗？', () => {
    const canceled = orders.value.splice(index, 1)[0]
    if (!canceled) return
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
      if (!canceled) return
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

const uploadDesign = async () => {
  if (loading.value.upload) return

  if ((currentOrder.value.custom !== '需要定制' && !currentOrder.value.customRequirement) || currentOrder.value.status !== 1) {
    showWarningDialog('无需上传', '当前订单不处于待上传设计稿状态。')
    return
  }
  if (!selectedDesignFile.value) {
    showWarningDialog('请选择文件', '请先选择设计稿文件后再上传。')
    return
  }

  const file = selectedDesignFile.value
  if (file.size > 15 * 1024 * 1024) {
    showWarningDialog('文件过大', '设计稿文件大小不能超过15MB')
    return
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/postscript',
    'image/psd',
  ]
  if (!allowedTypes.includes(file.type)) {
    showWarningDialog('文件格式不支持', '仅支持 jpg/png/pdf/ai/psd 格式')
    return
  }

  try {
    loading.value.upload = true

    const orderId = currentOrder.value.id
    if (!orderId) {
      showWarningDialog('订单无效', '无法获取订单ID，请刷新页面后重试')
      return
    }

    const formData = new FormData()
    formData.append('design_file', file)

    await apiUploadDesign(orderId, formData)

    currentOrder.value.statusRaw = 'design_pending'
    currentOrder.value.status = statusStringToNumber('design_pending')
    currentOrder.value.statusText = getStatusText('design_pending')
    showSuccessDialog('上传成功', `设计稿 ${file.name} 已成功上传！`)
    selectedDesignFile.value = null
  } catch (error: any) {
    console.error('上传设计稿失败', error)
    const message = error.response?.data?.message || '上传失败，请重试'
    ElMessage.error(message)
  } finally {
    loading.value.upload = false
  }
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

const getStatusClass = (s: number) => {
  const classes: Record<number, string> = {
    0: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/80',
    1: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200/80',
    2: 'bg-orange-100 text-orange-800 ring-1 ring-orange-200/80',
    3: 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/80',
    4: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80',
    5: 'bg-red-100 text-red-800 ring-1 ring-red-200/80',
  }
  return classes[s] ?? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/80'
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

/** 当前导出用户名（与登录邮箱联动，未登录时为默认文案） */
function getExportUserDisplayName(): string {
  const email = localStorage.getItem('campus_login_email')
  if (email?.trim()) {
    const local = email.split('@')[0]?.trim()
    if (local) return sanitizeFilenameSegment(local)
  }
  const name = localStorage.getItem('bangbang_display_name')?.trim()
  if (name) return sanitizeFilenameSegment(name)
  return '校园用户'
}

function sanitizeFilenameSegment(raw: string): string {
  const s = raw.replace(/[/\\:*?"<>|]/g, '_').trim()
  return s.slice(0, 48) || '用户'
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** YYYY-MM-DD HH:mm:ss */
function formatDateTime(ms: number): string {
  const d = new Date(ms)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

function safeFiniteNumber(n: unknown, fallback = 0): number {
  const x = Number(n)
  return Number.isFinite(x) ? x : fallback
}

function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return '0.00'
  return (Math.round(n * 100) / 100).toFixed(2)
}

/** 解析 YYYY-MM-DD 为当日 0 点本地时间戳 */
function parseDateStart(isoDate: string): number | null {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null
  const parts = isoDate.split('-').map(Number)
  const y = parts[0]
  const mo = parts[1]
  const d = parts[2]
  if (y == null || mo == null || d == null) return null
  const t = new Date(y, mo - 1, d, 0, 0, 0, 0).getTime()
  return Number.isNaN(t) ? null : t
}

/** 当日 23:59:59.999 */
function parseDateEnd(isoDate: string): number | null {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null
  const parts = isoDate.split('-').map(Number)
  const y = parts[0]
  const mo = parts[1]
  const d = parts[2]
  if (y == null || mo == null || d == null) return null
  const t = new Date(y, mo - 1, d, 23, 59, 59, 999).getTime()
  return Number.isNaN(t) ? null : t
}

function resolvePaymentRecord(o: Order): string {
  if (o.paymentRecord?.trim()) return o.paymentRecord
  const map: Record<number, string> = {
    1: '待支付（校园统一结算）',
    2: '制作中（未结清）',
    3: '待收货（物流中）',
    4: '已完成（已结清）',
    5: '已取消',
  }
  return map[o.status] ?? '—'
}

/** CSV 单元格转义，兼容 undefined / 数字 / 换行 */
function escapeCsvField(val: unknown): string {
  const raw = val == null ? '' : String(val)
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const inner = normalized.replace(/"/g, '""')
  if (/[",\n]/.test(inner)) return `"${inner}"`
  return inner
}

function buildCsvContent(rows: Order[]): string {
  const headers = [
    '订单编号',
    '商品名称',
    '预订时间',
    '单价(元)',
    '数量',
    '订单金额(元)',
    '订单状态',
    '支付记录',
    '尺寸',
    '颜色',
    '定制',
    '备注',
  ]
  const lines: string[] = [headers.map((h) => escapeCsvField(h)).join(',')]
  rows.forEach((o, idx) => {
    const g = goods.value.find((x) => x.name === o.goodsName)
    const unit = safeFiniteNumber(o.unitPrice ?? g?.price, 0)
    const num = safeFiniteNumber(o.num, 0)
    const totalRaw = o.totalAmount ?? unit * num
    const total = safeFiniteNumber(totalRaw, 0)
    const orderNo = o.orderNo ?? `LEGACY-${String(idx + 1).padStart(4, '0')}`
    const timeStr =
      o.createdAt != null && Number.isFinite(o.createdAt) ? formatDateTime(o.createdAt) : '—'
    const cells: unknown[] = [
      orderNo,
      o.goodsName ?? '',
      timeStr,
      formatMoney(unit),
      String(num),
      formatMoney(total),
      o.statusText ?? '',
      resolvePaymentRecord(o),
      o.size || '—',
      o.color || '—',
      o.custom || '—',
      o.remark || '无',
    ]
    lines.push(cells.map((c) => escapeCsvField(c)).join(','))
  })
  return lines.join('\r\n')
}

/** 触发 CSV 下载（UTF-8 BOM + 延迟 revoke 兼容 Safari；IE 使用 msSaveBlob） */
function downloadCsvFile(filename: string, csvBody: string) {
  const bom = '\uFEFF'
  const blob = new Blob([bom + csvBody], {
    type: 'text/csv;charset=utf-8',
  })

  const nav = navigator as Navigator & {
    msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean
    msSaveBlob?: (blob: Blob, defaultName?: string) => boolean
  }

  if (typeof nav.msSaveOrOpenBlob === 'function') {
    nav.msSaveOrOpenBlob(blob, filename)
    return
  }
  if (typeof nav.msSaveBlob === 'function') {
    nav.msSaveBlob(blob, filename)
    return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', filename)
  a.rel = 'noopener noreferrer'
  a.style.display = 'none'
  a.style.position = 'fixed'
  a.style.left = '-9999px'
  a.style.top = '0'

  document.body.appendChild(a)
  try {
    if (typeof a.click === 'function') {
      a.click()
    } else {
      throw new Error('browser does not support programmatic click')
    }
  } finally {
    window.setTimeout(() => {
      try {
        document.body.removeChild(a)
      } catch {
        /* ignore */
      }
      URL.revokeObjectURL(url)
    }, 200)
  }
}

function buildExportCsvFilename(): string {
  const userLabel = getExportUserDisplayName()
  const today = new Date()
  const datePart = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`
  return `校园文创订单明细_${userLabel}_${datePart}.csv`
}

/** 校验导出日期区间（空表示不按日期筛选） */
function validateExportDateInputs(): boolean {
  const start = exportStartDate.value.trim()
  const end = exportEndDate.value.trim()
  if (!start && !end) return true

  const t0 = start ? parseDateStart(start) : null
  const t1 = end ? parseDateEnd(end) : null
  if (start && t0 === null) {
    showWarningDialog('日期有误', '起始日期格式不正确。')
    return false
  }
  if (end && t1 === null) {
    showWarningDialog('日期有误', '结束日期格式不正确。')
    return false
  }
  if (t0 != null && t1 != null && t0 > t1) {
    showWarningDialog('日期有误', '起始日期不能晚于结束日期。')
    return false
  }
  return true
}

/** 仅导出当前会话「我的订单」列表（单用户前端数据） */
function getOrdersForExportFiltered(): Order[] {
  let list = [...orders.value]
  const start = exportStartDate.value.trim()
  const end = exportEndDate.value.trim()
  if (!start && !end) return list

  const t0 = start ? parseDateStart(start) : null
  const t1 = end ? parseDateEnd(end) : null

  list = list.filter((o) => {
    if (o.createdAt == null) return false
    if (t0 != null && o.createdAt < t0) return false
    if (t1 != null && o.createdAt > t1) return false
    return true
  })
  return list
}

function clearExportDateFilters() {
  exportStartDate.value = ''
  exportEndDate.value = ''
}

/** 导出流程防抖：防止短时间重复打开确认框或重复触发 */
let exportButtonLastClickAt = 0
const EXPORT_BUTTON_DEBOUNCE_MS = 700

async function runExportOrdersCsv() {
  try {
    const filtered = getOrdersForExportFiltered()
    if (filtered.length === 0) {
      ElMessage.warning(
        exportStartDate.value || exportEndDate.value
          ? '所选时间范围内没有可导出的订单'
          : '当前没有可导出的订单',
      )
      return
    }

    exportLoading.value = true
    await nextTick()
    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 280)
    })

    let csv: string
    try {
      csv = buildCsvContent(filtered)
    } catch (e) {
      console.error('[export] buildCsvContent', e)
      throw e
    }

    const filename = buildExportCsvFilename()
    try {
      downloadCsvFile(filename, csv)
    } catch (e) {
      console.error('[export] downloadCsvFile', e)
      throw e
    }

    ElMessage.success('导出成功，文件已下载')
  } catch (err) {
    console.error('[export]', err)
    ElMessage.error('导出失败，请重试')
  } finally {
    exportLoading.value = false
  }
}

function onClickExportOrders() {
  if (exportLoading.value) return

  const now = Date.now()
  if (now - exportButtonLastClickAt < EXPORT_BUTTON_DEBOUNCE_MS) {
    return
  }
  exportButtonLastClickAt = now

  if (orders.value.length === 0) {
    showWarningDialog('暂无订单', '当前没有可导出的订单记录。')
    return
  }
  if (!validateExportDateInputs()) return

  const useRange = Boolean(exportStartDate.value.trim() || exportEndDate.value.trim())
  const msg = useRange ? '是否确认导出所选时间范围内的订单明细？' : '是否确认导出全部订单明细？'
  showConfirmDialog('导出明细', msg, () => {
    void runExportOrdersCsv().catch((err) => {
      console.error('[export] unhandled', err)
      exportLoading.value = false
      ElMessage.error('导出失败，请重试')
    })
  })
}

loadFavoriteIds()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;800&display=swap');
@import '@/styles/studentPage.css';

:root {
  --first-color: #4f6ae8;
  --second-color: #3d52c4;
  --el-color-primary: #4f6ae8;
  --el-color-primary-light-3: #a5b4fc;
  --el-color-primary-light-5: #c7d2fe;
  --el-color-primary-light-7: #e0e7ff;
  --el-color-primary-light-8: #eef2ff;
  --el-color-primary-light-9: #f5f3ff;
  --el-color-primary-dark-2: #3d52c4;
  --el-border-radius-base: 12px;
}

body {
  font-family: 'Noto Sans SC', sans-serif;
}

.el-message {
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow:
    0 4px 24px rgba(15, 23, 42, 0.06),
    0 20px 50px -24px rgba(79, 70, 229, 0.12);
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
  border-color: #4f6ae8;
  box-shadow: 0 0 0 3px rgba(79, 106, 232, 0.22);
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
  color: #4f6ae8;
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
</style>
