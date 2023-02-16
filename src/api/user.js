import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/auth/login',
    method: 'post',
    data
  })
}

export function getUserViewById() {
  return request({
    url: '/user/getUserViewById',
    method: 'get'
    // data: {
    //   token: token
    // }
  })
}

export function logout() {
  console.log('/user/auth/logout')
  return request({
    url: '/user/auth/logout',
    method: 'post'
  })
}
