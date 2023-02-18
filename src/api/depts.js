import request from '@/utils/request'

export function getAllDepts() {
  return request({
    url: '/dept/getAllDepts',
    method: 'get'
  })
}

export function setUserDept(uid, did) {
  return request({
    url: '/dept/setUserDept',
    method: 'post',
    data: {
      uid: uid,
      did: did
    }
  })
}
