import request from '@/utils/request'

export function getUser() {
  return request({
    url: '/userList',
    method: 'get'
  })
}