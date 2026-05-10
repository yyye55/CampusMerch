import request from '@/utils/request'

export interface StatisticsResponse {
  totalOrders: number
  todayRevenue: number
  pendingOrders: number
  lowStockCount: number
  todayOrders: number
  pendingReview: number
  pendingDesign: number
  totalProducts: number
}

export interface OrderItem {
  id: number
  goodsName: string
  quantity: number
  price: number
  status: number
  statusText: string
  createdAt: string
  userName: string
  userEmail: string
  phone: string
  address: string
  color?: string
  size?: string
  customRequirement?: string
  designFileUrl?: string
  remark?: string
}

export interface ProductItem {
  id: number
  name: string
  price: number
  stock: number
  category: string
  categoryText: string
  minOrder: number
  customRequirement: string
  isOnline: boolean
  sold: number
  version?: number
  spec?: string
  sizes?: string[]
  colors?: string[]
  desc?: string
}

export interface ImportResult {
  total: number
  success: number
  failed: number
  errors: { row: string; message: string }[]
  successItems: { name: string; price: number; stock: number }[]
}

export function getStatistics(): Promise<StatisticsResponse> {
  return request.get<StatisticsResponse>('/api/admin/stats') as unknown as Promise<StatisticsResponse>
}

export function getOrders(params?: { status?: number; keyword?: string }): Promise<OrderItem[]> {
  return request.get<OrderItem[]>('/api/my-orders', { params }) as unknown as Promise<OrderItem[]>
}

export function reviewOrder(orderId: number, data: { status: string; quantity?: number }): Promise<void> {
  return request.put(`/api/admin/orders/${orderId}/review`, data) as unknown as Promise<void>
}

export function completeOrder(orderId: number): Promise<void> {
  return request.post(`/api/orders/${orderId}/complete`) as unknown as Promise<void>
}

export function exportOrders(params?: { status?: number }): Promise<Blob> {
  return request.get('/api/orders/export', {
    params,
    responseType: 'blob',
  }) as unknown as Promise<Blob>
}

export function getProducts(params?: { page?: number; pageSize?: number; keyword?: string }): Promise<ProductItem[]> {
  return request.get<ProductItem[]>('/api/products', { params }) as unknown as Promise<ProductItem[]>
}

export function updateProduct(id: number, data: Partial<ProductItem>): Promise<void> {
  return request.put(`/api/products/${id}`, data) as unknown as Promise<void>
}

export function deleteProduct(id: number): Promise<void> {
  return request.delete(`/api/products/${id}`) as unknown as Promise<void>
}

export function importProducts(formData: FormData): Promise<ImportResult> {
  return request.post<ImportResult>('/api/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as unknown as Promise<ImportResult>
}

export function createProduct(data: Omit<ProductItem, 'id' | 'sold'>): Promise<ProductItem> {
  return request.post('/api/products', data) as unknown as Promise<ProductItem>
}