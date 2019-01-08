import request from '@/utils/request'

export function getLoglist(params) {
  return request({
    url: '/api/res/management/sys/log',
    method: 'get',
    params
  })
}