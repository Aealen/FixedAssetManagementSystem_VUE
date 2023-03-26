import request from '@/utils/request'

export function getAllLogs() {
  return request({
    url: '/log/getAllLogs',
    method: 'get'
  })
}
export function getLogsCount() {
  return request({
    url: '/log/getLogsCount',
    method: 'get'
  })
}
export function getAllLogsByPage(currPage, perPage) {
  return request({
    url: '/log/getAllLogsByPage',
    method: 'post',
    data: {
      'keyword': null,
      'page': currPage,
      'perPage': perPage
    }
  })
}
