import request from '@/utils/request'

export interface CreateOrderData {
  product_id: number
  quantity: number
  size?: string
  color?: string
  shipping_address?: string
  remark?: string
}

export interface OrderProduct {
  id: number
  name: string
  price: string
}

export interface OrderAttachment {
  id: number
  file_name: string
  file_type: string
  file_size: string
  preview_url: string
}

export interface OrderItem {
  id: number
  order_no: string
  user_id: number
  product_id: number
  product: OrderProduct
  quantity: number
  unit_price: string
  total_price: string
  size?: string
  color?: string
  shipping_address?: string
  remark?: string
  status: 'draft' | 'booked' | 'design_pending' | 'ready' | 'completed' | 'rejected'
  attachments: OrderAttachment[]
  created_at: string
}

export interface OrderListResponse {
  current_page: number
  data: OrderItem[]
  total: number
  per_page: number
  last_page: number
}

export interface CreateOrderResponse {
  code: number
  message: string
  data: OrderItem
}

export function createOrder(data: CreateOrderData) {
  return request.post<CreateOrderResponse>('/api/orders', data).then((res) => res.data)
}

export function getMyOrders(params?: { status?: string; per_page?: number }) {
  return request.get<OrderListResponse>('/api/my-orders', { params }).then((res) => res.data)
}

export function getOrderDetail(orderId: number) {
  return request.get<OrderItem>(`/api/orders/${orderId}`).then((res) => res.data)
}

export function uploadDesign(orderId: number, formData: FormData) {
  return request.post(`/api/orders/${orderId}/design`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => res.data)
}

export function exportOrders(params?: { startDate?: string; endDate?: string }) {
  return request.get('/api/orders/export', {
    params,
    responseType: 'blob',
  })
}
