import request from '@/utils/request'

export interface ProductAttachment {
  design_examples?: { url: string; title: string }[]
  manual?: string
}

export interface Product {
  id: number
  name: string
  price: string
  stock: number
  reserved_stock: number
  sold_stock: number
  available_stock: number
  is_stock_low: boolean
  category: string
  status: 'active' | 'inactive'
}

export interface ProductDetail {
  id: number
  name: string
  price: string
  stock: number
  orders_count: number
  category: string
  status: 'active' | 'inactive'
  attachments: ProductAttachment
}

export interface ProductListResponse {
  code: number
  message: string
  data: Product[]
}

export interface ProductDetailResponse {
  code: number
  message: string
  data: ProductDetail
}

export function getProducts(params?: {
  category?: string
  min_price?: number
  max_price?: number
}) {
  return request.get<ProductListResponse>('/api/products', { params }).then((res) => res.data)
}

export function getProductDetail(id: number) {
  return request
    .get<ProductDetailResponse>(`/api/products/${id}`)
    .then((res) => res.data)
}

export function getCategories() {
  return request.get('/api/categories').then((res) => res.data)
}
