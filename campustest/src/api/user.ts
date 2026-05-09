import request from '@/utils/request'

// 获取用户信息
export function getUserInfo() {
  return request.get('/user/info')
}

// 更新用户信息
export function updateUserInfo(data: {
  name?: string
  phone?: string
  avatar?: string
}) {
  return request.put('/user/info', data)
}

// 获取用户统计信息
export function getUserStats() {
  return request.get('/user/stats')
}

// 获取收藏列表
export function getFavorites() {
  return request.get('/favorites')
}

// 添加收藏
export function addFavorite(productId: number) {
  return request.post(`/favorites/${productId}`)
}

// 取消收藏
export function removeFavorite(productId: number) {
  return request.delete(`/favorites/${productId}`)
}

// 检查是否收藏
export function checkFavorite(productId: number) {
  return request.get(`/favorites/${productId}/check`)
}
