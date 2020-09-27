import request from '@/utils/request'

// 查询所有菜单
export function fetchList(query) {
  console.log(query)
  return request({
    url: '/sysMenu/getMenuList',
    method: 'get',
    params: query
  })
}
// 根据ID删除菜单
export function deleteMenu(id) {
  return request({
    url: '/sysMenu/delete?id=' + id,
    method: 'post'
  })
}
// 查询所有菜单
export function treeList(userId) {
  return request({
    url: '/sysMenu/userTreeList/' + userId,
    method: 'get'
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
    url: '/sysMenu/update?id=' + id,
    method: 'post',
    data: data
  })
}
// 修改菜单显示状态
export function updateEnable(id, enabled) {
  return request({
    url: '/sysMenu/updateEnable',
    method: 'post',
    params: {
      id: id,
      enabled: enabled
    }
  })
}
export function getMenu(id) {
  return request({
    url: '/sysMenu/' + id,
    method: 'get'
  })
}
// 获取树形结构的菜单
export function fetchTreeList() {
  return request({
    url: '/sysMenu/treeList',
    method: 'get'
  })
}

