import request from '@/utils/request'

export function getOrderCount() {
  return request({
    url: '/order/getCount',
    method: 'get'
  })
}
export function getOrderCountByRole(rid, uid) {
  return request({
    url: '/order/getCountByRole/' + rid + '/' + uid,
    method: 'get'
  })
}

export function getOrderByPageAndRole(data) {
  return request({
    url: '/order/getOrderByPageAndRole',
    method: 'post',
    data
  })
}
export function queryByPageForCustodian(data) {
  return request({
    url: '/order/queryByPageForCustodian',
    method: 'post',
    data
  })
}

export function getOrderSearchCount(keyword, page, perPage) {
  return request({
    url: '/order/getOrderSearchCount',
    method: 'post',
    data: {
      'keyword': keyword,
      'page': page,
      'perPage': perPage
    }
  })
}
export function getOrderCountByStatus(status) {
  return request({
    url: '/order/getCountByStatus/' + status,
    method: 'get'
  })
}
export function getOrderCountTrend() {
  return request({
    url: '/order/getOrderCountTrend',
    method: 'get'
  })
}

export function getOrderByPage(data) {
  return request({
    url: '/order/queryByPage',
    method: 'post',
    data
  })
}

export function getWorker(did) {
  return request({
    url: '/order/getWorker/' + did,
    method: 'post'
  })
}

export function getOrderByID(id) {
  return request({
    url: '/order/getOrderByID/' + id,
    method: 'get'
  })
}

export function delOrder(id) {
  return request({
    url: '/order/del/' + id,
    method: 'get'
  })
}

export function updateOrderStatus(id, status) {
  return request({
    url: '/order/updateOrderStatus/' + id + '/' + status,
    method: 'get'
  })
}

export function addOrder(data) {
  return request({
    url: '/order/addOrder/',
    method: 'post',
    data
  })
}
