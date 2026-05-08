const BASE = '/api'

interface RequestOptions {
  headers?: Record<string, string>
  responseType?: 'blob'
}

interface ApiError extends Error {
  code?: number
  errors?: Array<{ field: string; reason: string }>
  data?: unknown
}

interface ApiResponse<T = unknown> {
  code: number
  message?: string
  data: T
  errors?: Array<{ field: string; reason: string }>
}

async function request<T = unknown>(
  method: string,
  url: string,
  data?: BodyInit | null,
  options: RequestOptions = {},
): Promise<T> {
  const { headers = {}, responseType } = options
  const config: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  }

  if (data instanceof FormData) {
    config.body = data
    delete config.headers['Content-Type']
  } else if (data) {
    config.body = JSON.stringify(data)
  }

  const res = await fetch(BASE + url, config)

  if (responseType === 'blob') {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.blob() as unknown as T
  }

  const json: ApiResponse<T> = await res.json()

  if (json.code !== 0) {
    const err = new Error(json.message || '请求失败') as ApiError
    err.code = json.code
    err.errors = json.errors
    err.data = json.data
    throw err
  }

  return json.data
}

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
  stats: (): Promise<AdminStats> => request<AdminStats>('GET', '/admin/stats'),

  // ============ 商品管理 ============
  products: {
    list: (params: { page: number; pageSize: number }) =>
      request<ListResponse<Product>>('GET', `/products?${toQuery(params)}`),
    create: (data: Partial<Product>) => request<Product>('POST', '/products', data),
    update: (id: number, data: Partial<Product>) =>
      request<Product>('PUT', `/products/${id}`, data),
    remove: (id: number) => request<void>('DELETE', `/products/${id}`),
    toggleStock: (id: number, inStock: boolean) =>
      request<void>('PATCH', `/products/${id}/stock`, { inStock }),
    import: (formData: FormData) =>
      request<{
        successCount: number
        errors: Array<{ row: number; field: string; reason: string }>
      }>('POST', '/products/import', formData, { headers: {} }),
  },

  // ============ 订单管理 ============
  orders: {
    list: (params: {
      page: number
      pageSize: number
      status?: number | string
      keyword?: string
    }) => request<ListResponse<Order>>('GET', `/orders?${toQuery(params)}`),
    uploadDesign: (id: number, formData: FormData) =>
      request<{ designFile: string }>('POST', `/orders/${id}/design`, formData, { headers: {} }),
    review: (id: number, data: { action: 'approve' | 'reject'; adjustNum?: number }) =>
      request<void>('PUT', `/admin/orders/${id}/review`, data),
    complete: (id: number) => request<void>('POST', `/orders/${id}/complete`),
    export: async (params: Record<string, unknown>): Promise<void> => {
      const blob = await request<Blob>('GET', `/orders/export?${toQuery(params)}`, null, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders_${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  },
}

function toQuery(obj: Record<string, unknown> | undefined): string {
  return Object.entries(obj || {})
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}
