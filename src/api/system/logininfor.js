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
    responseType: 'arraybuffer',
    params: query
  })
}

// 删除登录日志
export function delLogininfor(infoIds) {
  return request({
    url: '/sys/log/login-log',
    method: 'delete',
    params:{
      ids: infoIds + ''
    }
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/sys/log/login-log/clean',
    method: 'delete'
  })
}


