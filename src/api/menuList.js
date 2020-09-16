import request from '@/utils/request'

export function getMenu() {
  return request({
    url: '/menuList',
    method: 'get'
  })
}