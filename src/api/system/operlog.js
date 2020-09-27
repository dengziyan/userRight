import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/sys/log/operation-log',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperlog(operIds) {
  return request({
    url: '/sys/log/operation-log',
    method: 'delete',
    params:{
      ids : operIds+''
    }
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/sys/log/operation-log/clean',
    method: 'delete'
  })
}

// 导出操作日志
export function exportOperlog(query) {
  return request({
    url: '/sys/log/operation-log/export',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}
