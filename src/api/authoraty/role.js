import request from '@/utils/request'
import Qs from 'qs'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/sys/role',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/sys/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/sys/role',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/sys/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(id, type) {
  const data = {
    id,
    type
  }
  return request({
    url: '/sys/role/status',
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

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/sys/role/' + roleId,
    method: 'delete'
  })
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/sys/role/export',
    method: 'get',
    params: query
  })
}
