import request from '@/utils/request'
import Qs from "qs";
// 查询所有后台资源分类
export function listAllCate() {
  return request({
    url: '/sysResourcesCategory/listAll',
    method: 'get'
  })
}
// 添加后台资源分类
export function createResourceCategory(data) {
  return request({
    url: '/sysResourcesCategory/create',
    method: 'post',
    data: data
  })
}
// 修改后台资源分类
export function updateResourceCategory(id, data) {
  return request({
    url: '/sysResourcesCategory/update?id=' + id,
    method: 'post',
    data: data
  })
}
// 根据ID删除后台资源
export function deleteResourceCategory(id) {
  return request({
    url: '/sysResourcesCategory/delete/' + id,
    method: 'post'
  })
}

// 资源状态修改
export function changecategoryStatus(id, type) {
  const data = {
    id,
    type
  }
  return request({
    url: '/sysResourcesCategory/update/status',
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
