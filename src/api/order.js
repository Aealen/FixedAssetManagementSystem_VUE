import request from '@/utils/request'

export function getOrderCount() {
  return request({
    url: '/order/getCount',
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
