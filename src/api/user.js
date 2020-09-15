import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user-rights-system/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user-rights-system/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user-rights-system/user/logout',
    method: 'post'
  })
}
