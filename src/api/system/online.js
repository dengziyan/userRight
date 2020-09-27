import request from '@/utils/request'

// 我自己用mock来测试的接口
export function getOnline() {
  return request({
    url: '/online',
    method: 'get'
  })
}

// 查询在线用户列表
export function Onlinelist(query) {
  return request({
    url: '/sys/online',
    method: 'get',
    params: query
  })
}

// 强退用户
export function forceLogout(tokenId) {
  return request({
    url: '/sys/online/force-logout?account=' + tokenId,
    method: 'delete'
  })
}
