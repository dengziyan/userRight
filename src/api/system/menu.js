import request from '@/utils/request'

export function fetchList(parentId, params) {
  return request({
    url: '/menu/list/' + parentId,
    method: 'get',
    params: params
  })
}

// 根据ID删除菜单
export function deleteMenu(id) {
  return request({
    url: '/sysMenu/delete' + id,
    method: 'post'
  })
}
// 添加菜单信息
export function createMenu(data) {
  return request({
    url: '/sysMenu/insert',
    method: 'post',
    data: data
  })
}
// 更新菜单
export function updateMenu(id, data) {
  return request({
    url: '/sysMenu/update' + id,
    method: 'post',
    data: data
  })
}

export function getMenu(id) {
  return request({
    url: '/sysMenu/' + id,
    method: 'get',
  })
}

export function updateHidden(id, params) {
  return request({
    url: '/sysMenu/updateHidden/' + id,
    method: 'post',
    params: params
  })
}

export function fetchTreeList() {
  return request({
    url: '/sysMenu/treeList',
    method: 'get'
  })
}

