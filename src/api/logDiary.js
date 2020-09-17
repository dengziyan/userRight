import request from '@/utils/request'
export function getLog() {
    return request({
      url: '/logDiary',
      method: 'get'
    })
  }