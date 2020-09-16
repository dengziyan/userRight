export function getResource() {
    return request({
      url: '/resourceList',
      method: 'get'
    })
  }