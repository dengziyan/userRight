import request from '@/utils/request'
import Qs from 'qs'
import { getIDKey } from '@/utils/auth'
export function login(data) {
  return request({
    url: '/sysUser/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    transformRequest: [function(data) { // 在请求之前对data传参进行格式转换
      data = Qs.stringify(data)
      return data
    }],
    data
  })
}

export function getInfo(id) {
  id = id || getIDKey()
  return request({
    url: '/sys/user-info/' + id,
    method: 'get'
  })
}

export function logout(username) {
  return request({
    url: '/sysUser/logout',
    method: 'post',
    data: {
      account: username
    }
  })
}

export function setLoginStatus(id) {
  return request({
    url: '/sysUser/login-status?type=success',
    method: 'post',
    data: {
      id: id
    }
  })
}
