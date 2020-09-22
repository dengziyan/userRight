import request from '@/utils/request'

// 查询用户登录日志
export function list(query) {
  return request({
    url: '/sys/log/login-log',
    method: 'get',
    params: query
  })
}
// 导出登录日志
export function exportLogininfor(query) {
  return request({
    url: '/sys/log/login-log/export',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLogininfor(infoId) {
  return request({
    url: '/monitor/logininfor/' + infoId,
    method: 'delete'
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/monitor/logininfor/clean',
    method: 'delete'
  })
}


