import axios from '@/plugins/axios'
import qs from 'qs'
// 用户登录
export function login(data) {
  return axios({
    url: '/safety/api/user/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 注册新用户
export function signup(data) {
  return axios({
    url: '/safety/api/user/register',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取用户信息
export function getInfo() {
  return axios({
    url: '/safety/api/user/index',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return axios({
    url: '/safety/api/user/logout',
    method: 'post'
  })
}

// 获取所有用户列表
export function getAllUser() {
  return axios({
    url: '/lzzAPI/api2/user/getAllUser',
    method: 'get'
  })
}

// 修改密码
export function updateUserPassword(data) {
  return axios({
    url: '/lzzAPI/api2/user/updateUserPassword',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改个人信息
export function updateUserInfo(data) {
  return axios({
    url: '/lzzAPI/api2/user/updateUserInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改用户权限
export function updateUserRoles(data) {
  return axios({
    url: '/lzzAPI/api2/user/updateUserRoles',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 发送手机验证码
export function sendSmsCode(data) {
  return axios({
    url: '/safety/api/sms/send',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改用户权限
export function addressList() {
  return axios({
    url: '/safety/api/address/addressList',
    method: 'get'
  })
}

// 密码重置
export function resetPassword(data) {
  return axios({
    url: '/lzzAPI/api2/user/resetPassword',
    method: 'post',
    data: qs.stringify(data)
  })
}
