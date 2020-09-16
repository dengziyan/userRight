export function getOpe() {
    return request({
      url: '/opeDiary',
      method: 'get'
    })
  }