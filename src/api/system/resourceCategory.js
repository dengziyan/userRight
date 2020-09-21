import request from '@/utils/request'

export function listAllCate() {
  return request({
    url: '/sysResourcesCategory/listAll',
    method: 'get'
  })
}

export function createResourceCategory(data) {
  return request({
    url: '/sysResourcesCategory/create',
    method: 'post',
    data: data
  })
}

export function updateResourceCategory(id, data) {
  return request({
    url: '/sysResourcesCategory/update' + id,
    method: 'post',
    data: data
  })
}

export function deleteResourceCategory(id) {
  return request({
    url: '/sysResourcesCategory/delete' + id,
    method: 'post'
  })
}
