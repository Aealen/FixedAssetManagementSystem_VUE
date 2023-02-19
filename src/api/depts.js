import request from '@/utils/request'

export function getAllDepts() {
  return request({
    url: '/dept/getAllDepts',
    method: 'get'
  })
}
export function getAllDeptsByPage(data) {
  return request({
    url: '/dept/getAllDeptsByPage',
    method: 'post',
    data
  })
}
export function updateDeptInfo(data) {
  return request({
    url: '/dept/updateDeptInfo',
    method: 'post',
    data
  })
}

export function addDept(name) {
  return request({
    url: '/dept/addDept/' + name,
    method: 'post'
  })
} export function getDeptCount() {
  return request({
    url: '/dept/getDeptCount',
    method: 'post'
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
