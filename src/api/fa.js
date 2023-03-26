import request from '@/utils/request'

export function getFaCount() {
  return request({
    url: '/fa/getFaCount',
    method: 'get'
  })
}
export function getFASearchCount(keyword, page, perPage) {
  return request({
    url: '/fa/getFASearchCount',
    method: 'post',
    data: {
      'keyword': keyword,
      'page': page,
      'perPage': perPage
    }
  })
}

export function addFa(data) {
  return request({
    url: '/fa/addFa',
    method: 'post',
    data
  })
}

export function getFaByID(id) {
  return request({
    url: '/fa/queryFaByID/' + id,
    method: 'post'
  })
}

export function queryFaByPage(data) {
  return request({
    url: '/fa/getFaCount',
    method: 'get',
    data
  })
}
export function queryFaByTDID(data) {
  return request({
    url: '/fa/queryFaByTDID',
    method: 'post',
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
export function getTypeCount() {
  return request({
    url: '/fa/getTypeCount/',
    method: 'get'
  })
}
export function getAllTypeByPage(data) {
  return request({
    url: '/fa/getAllTypeByPage/',
    method: 'post',
    data
  })
}
export function updateTypeInfo(data) {
  return request({
    url: '/fa/updateTypeInfo/',
    method: 'post',
    data
  })
}
export function addType(data) {
  return request({
    url: '/fa/addType?typename=' + data,
    method: 'post'
  })
}

export function updatefa(data) {
  return request({
    url: '/fa/updatefa',
    method: 'post',
    data
  })
}
