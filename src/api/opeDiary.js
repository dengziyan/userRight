import request from '@/utils/request'
export function getOpe() {
    return request({
      url: '/opeDiary',
      method: 'get'
    })
  }