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

export function getUserViewsCount() {
  return request({
    url: '/user/getUserCount',
    method: 'get'
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
  console.log('/user/auth/logout')
  return request({
    url: '/user/auth/logout',
    method: 'post'
  })
}
