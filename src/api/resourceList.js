import request from '@/utils/request'

export function getResource() {
    return request({
      url: '/resourceList',
      method: 'get'
    })
  }