import request from '@/utils/request'

export function getUserInfo() {
  return request.get('/api/user/info')
}

export function updateUserInfo(data: { name?: string; phone?: string; avatar?: string }) {
  return request.put('/api/user/info', data)
}

export function getUserStats() {
  return request.get('/api/user/stats')
}

export function getFavorites() {
  return request.get('/api/favorites')
}

export function addFavorite(productId: number) {
  return request.post(`/api/favorites/${productId}`)
}

export function removeFavorite(productId: number) {
  return request.delete(`/api/favorites/${productId}`)
}

export function checkFavorite(productId: number) {
  return request.get(`/api/favorites/${productId}/check`)
}
