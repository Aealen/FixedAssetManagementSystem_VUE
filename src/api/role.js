import request from '@/utils/request'

export function getAllRoles() {
  return request({
    url: '/role/getAllRoles',
    method: 'get'
  })
}

export function setUserRole(uid, rid) {
  return request({
    url: '/role/setUserRole',
    method: 'post',
    data: {
      uid: uid,
      rid: rid
    }
  })
}
