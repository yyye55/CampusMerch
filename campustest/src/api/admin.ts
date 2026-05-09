import request from '@/utils/request'

// ============ 类型定义 ============

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: 'wenchuang' | 'wuliao'
  spec?: string
  desc?: string
  customRequirement?: string
  pic?: string
  minOrder: number
  sold?: number
}

export interface Order {
  id: number
  goodsName: string
  num: number
  size?: string
  color?: string
  custom?: string
  remark?: string
  designFile?: string
  status: 1 | 2 | 3 | 4 | 5
  statusText?: string
  createdAt: string
  adjustNum?: number
}

export interface AdminStats {
  todayOrders: number
  pendingReview: number
  pendingDesign: number
  lowStockCount: number
  totalOrders: number
  totalProducts: number
  todayRevenue: number
  lowStockList?: Product[]
}

export interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ListResponse<T> {
  list: T[]
  pagination: PaginationInfo
}

// ============ API 对象 ============

export const api = {
  // ============ 数据看板 ============
  stats: (): Promise<AdminStats> => request.get('/admin/stats'),

  // ============ 商品管理 ============
  products: {
    list: (params: { page: number; pageSize: number }) =>
      request.get('/products', { params }),
    create: (data: Partial<Product>) => request.post('/products', data),
    update: (id: number, data: Partial<Product>) =>
      request.put(`/products/${id}`, data),
    remove: (id: number) => request.delete(`/products/${id}`),
    toggleStock: (id: number, inStock: boolean) =>
      request.patch(`/products/${id}/stock`, { inStock }),
    import: (formData: FormData) =>
      request.post('/products/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  },

  // ============ 订单管理 ============
  orders: {
    list: (params: {
      page: number
      pageSize: number
      status?: number | string
      keyword?: string
    }) => request.get('/orders', { params }),
    uploadDesign: (id: number, formData: FormData) =>
      request.post(`/orders/${id}/design`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    review: (id: number, data: { action: 'approve' | 'reject'; adjustNum?: number }) =>
      request.put(`/admin/orders/${id}/review`, data),
    complete: (id: number) => request.post(`/orders/${id}/complete`),
    export: async (params: Record<string, unknown>): Promise<void> => {
      const res = await request.get('/orders/export', { params, responseType: 'blob' })
      const blob = new Blob([res], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders_${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  },
}
