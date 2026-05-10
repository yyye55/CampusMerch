import request from '@/utils/request'

// 创建订单（预订）
export function createOrder(data: {
  product_id: number
  quantity: number
  size: string
  color: string
  remark?: string
}) {
  return request.post('/orders', data)
}

// 获取我的订单列表
export function getMyOrders(params?: {
  page?: number
  pageSize?: number
  status?: number
}) {
  return request.get('/my-orders', { params })
}

// 获取订单详情
export function getOrderDetail(id: number) {
  return request.get(`/orders/${id}`)
}

// 更新订单状态
export function updateOrderStatus(id: number, data: { status: number }) {
  return request.put(`/orders/${id}/status`, data)
}

// 上传设计稿
export function uploadDesign(id: number, formData: FormData) {
  return request.post(`/orders/${id}/design`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 导出订单
export function exportOrders(params?: {
  startDate?: string
  endDate?: string
}) {
  return request.get('/orders/export', {
    params,
    responseType: 'blob',
  })
}
