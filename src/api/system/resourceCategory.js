import request from '@/utils/request'

export function listAllCate() {
  return request({
    url: '/sysResources/listAll',
    method: 'get'
  })
}

export function createResourceCategory(data) {
  return request({
    url: '/sysResources/create',
    method: 'post',
    data: data
  })
}

export function updateResourceCategory(id, data) {
  return request({
    url: '/sysResources/update' + id,
    method: 'post',
    data: data
  })
}

export function deleteResourceCategory(id) {
  return request({
    url: '/sysResources/delete' + id,
    method: 'post'
  })
}
