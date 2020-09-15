import request from '@/utils/request'

export function getHome() {
  return request({
    url: '/userList',
    method: 'get'
  })
}