import request from '@/utils/request'
import Qs from 'qs'
export function login(data) {
  return request({
    url: '/sysUser/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    transformRequest: [function(data) { //在请求之前对data传参进行格式转换
      data = Qs.stringify(data)
      return data
    }],
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
