import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/auth/login',
    method: 'post',
    data
  })
}

export function regist(data) {
  const { username, password, nickname, deptId, phoneNum, email, roleId } = data
  return request({
    url: '/user/auth/regist',
    method: 'post',
    data: {
      username: username,
      password: password,
      nickname: nickname,
      deptId: deptId,
      phoneNum: phoneNum,
      email: email,
      roleId: roleId
    }
  })
}

export function getUserViewsByPage(keyword, page, perPage) {
  return request({
    url: '/user/queryUserByPage',
    method: 'post',
    data: {
      'keyword': keyword,
      'page': page,
      'perPage': perPage
    }
  })
}
export function getOnlineCount() {
  return request({
    url: '/user/getOnlineCount',
    method: 'get'
  })
}

export function getUserViewsCount() {
  return request({
    url: '/user/getUserCount',
    method: 'get'
  })
}

export function getUserSearchCount(keyword, page, perPage) {
  return request({
    url: '/user/getSearchCount',
    method: 'post',
    data: {
      'keyword': keyword,
      'page': page,
      'perPage': perPage
    }
  })
}

export function getUserViewByToken() {
  return request({
    url: '/user/getUserViewByToken',
    method: 'get'
    // data: {
    //   token: token
    // }
  })
}

export function getUserViewById(uid) {
  return request({
    url: '/user/getUserViewById/' + uid,
    method: 'get'
  })
}
export function resetUserPassword(uid) {
  return request({
    url: '/user/resetPassword/' + uid,
    method: 'get'
  })
}

export function delUser(uid) {
  return request({
    url: '/user/delUser/' + uid,
    method: 'get'
  })
}
export function getAllCustodian() {
  return request({
    url: '/user/getAllCustodian',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/auth/logout',
    method: 'post'
  })
}

export function sendCode(data) {
  return request({
    url: '/user/auth/sendResetPasswordMail',
    method: 'post',
    data
  })
}
export function checkCode(data) {
  return request({
    url: '/user/auth/checkCode',
    method: 'post',
    data
  })
}

export function changePwd(data) {
  return request({
    url: '/user/auth/changePwd',
    method: 'post',
    data
  })
}
