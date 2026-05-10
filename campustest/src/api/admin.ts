import request from '@/utils/request'

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

export const api = {
  stats: (): Promise<AdminStats> => request.get('/api/admin/stats'),

  products: {
    list: (params: { page: number; pageSize: number }) =>
      request.get('/api/products', { params }),
    create: (data: Partial<Product>) => request.post('/api/products', data),
    update: (id: number, data: Partial<Product>) =>
      request.put(`/api/products/${id}`, data),
    remove: (id: number) => request.delete(`/api/products/${id}`),
    toggleStock: (id: number, inStock: boolean) =>
      request.patch(`/api/products/${id}/stock`, { inStock }),
    import: (formData: FormData) =>
      request.post('/api/products/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  },

  orders: {
    list: (params: {
      page: number
      pageSize: number
      status?: number | string
      keyword?: string
    }) => request.get('/api/orders', { params }),
    uploadDesign: (id: number, formData: FormData) =>
      request.post(`/api/orders/${id}/design`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    review: (id: number, data: { action: 'approve' | 'reject'; adjustNum?: number }) =>
      request.put(`/api/admin/orders/${id}/review`, data),
    complete: (id: number) => request.post(`/api/orders/${id}/complete`),
    export: async (params: Record<string, unknown>): Promise<void> => {
      const res = await request.get('/api/orders/export', { params, responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders_${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  },
}
