import request from '@/utils/request'
import Qs from 'qs';
// 查询资源列表
export function fetchList(params) {
  return request({
    url: '/sysResources/getResourceList',
    method: 'get',
    params: params
  })
}
// 删除一条资源数据
export function deleteResource(id) {
  return request({
    url: '/sysResources/delete?id=' + id,
    method: 'post'
  })
}
// 更新资源数据
export function updateResource(id, data) {
  return request({
    url: '/sysResources/update?id=' + id,
    method: 'post',
    data: data
  })
}
// 资源状态修改
export function changeResourceStatus(id, type) {
  const data = {
    id,
    type
  }
  return request({
    url: '/sysResources/update/status',
    method: 'put',
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
// 插入一条资源数据
export function createResource(data) {
  return request({
    url: '/sysResources/insert',
    method: 'post',
    data: data
  })
}

export function fetchAllResourceList() {
  return request({
    url: '/sysResources/resourceList',
    method: 'get'
  })
}

