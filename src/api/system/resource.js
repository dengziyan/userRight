import request from '@/utils/request'
//查询
export function fetchList(params) {
  return request({
    url: '/sysResources/resourceList',
    method: 'get',
    params: params
  })
}
//
export function createResource(data) {
  return request({
    url: '/sysResourcesCategory/create',
    method: 'post',
    data: data
  })
}

export function updateResource(id, data) {
  return request({
    url: '/sysResourcesCategory/update' + id,
    method: 'post',
    data: data
  })
}

export function deleteResource(id) {
  return request({
    url: '/resource/delete/' + id,
    method: 'post'
  })
}

export function fetchAllResourceList() {
  return request({
    url: '/resource/listAll',
    method: 'get'
  })
}
