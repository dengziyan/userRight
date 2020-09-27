import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/userright'
import Qs from "qs";

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
export function delUser(ids) {
  return request({
    url: '/sys/user',
    method: 'delete',
    params: {
      ids: ids + ''
    }
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/sys/user/export',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(account, email) {
  const data = {
    account,
    email
  }
  return request({
    url: '/sys/user/reset-password',
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
// 用户状态修改
export function changeUserStatus(account, type) {
  const data = {
    account,
    type
  }
  return request({
    url: '/sys/user/status',
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



// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/sys/user-info',
    method: 'put',
    data: data
  })
}
// 查询用户个人信息
export function getUserProfile(id){
  return request({
    url: '/sys/user-info/' + id,
    method: 'put',
    data: id
  })
}
// // 用户密码重置
// export function updateUserPwd(oldPassword, newPassword) {
//   const data = {
//     oldPassword,
//     newPassword
//   }
//   return request({
//     url: '/sys/user/profile/updatePwd',
//     method: 'put',
//     params: data
//   })
// }

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/sys/user-info/avatar',
    method: 'post',
    data
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
// 发送短信验证码找回密码
export function getCode(phoneNumber) {
  return request({
    url: '/sysUser/getCode/' + phoneNumber,
    method: 'get'
  })
}
// 发送短信验证码找回密码
export function codeEquals(code) {
  return request({
    url: '/sysUser/codeEquals/' + code,
    method: 'get'
  })
}
