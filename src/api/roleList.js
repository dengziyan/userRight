import request from '@/utils/request'

export function getRole() {
  return request({
    url: '/roleList',
    method: 'get'
  })
}