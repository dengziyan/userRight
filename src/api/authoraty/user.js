import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/userright'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/sys/user',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(id) {
  return request({
    url: '/sys/user-info/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: data
  })
}
// 新增用户
export function batchAddUser(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/sys/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(id) {
  return request({
    url: '/sys/user/' + id,
    method: 'delete'
  })
}

// 导出用户
export function exportUser() {
  return request({
    url: '/sys/user/export',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

// 用户密码重置
export function resetUserPwd(id, password) {
  const data = {
    id,
    password
  }
  return request({
    url: '/sys/user/reset-password',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/sys/user/status',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/sys/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/sys/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/sys/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/sys/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplates() {
  return request({
    url: '/sys/user/template',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
