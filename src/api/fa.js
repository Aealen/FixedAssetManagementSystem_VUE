import request from '@/utils/request'

export function getFaCount() {
  return request({
    url: '/fa/getFaCount',
    method: 'get'
  })
}

export function addFa(data) {
  return request({
    url: '/fa/addFa',
    method: 'post',
    data
  })
}

export function queryFaByPage(data) {
  return request({
    url: '/fa/getFaCount',
    method: 'get',
    data
  })
}

export function delFa(fid) {
  return request({
    url: '/fa/delFa/' + fid,
    method: 'get'
  })
}

export function getAllType() {
  return request({
    url: '/fa/getAllType/',
    method: 'get'
  })
}