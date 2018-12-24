import request from '@/utils/request'
export function getChartsList(params) {
  return request({
    url: '/api/dc/asschart',
    method: 'get',
    params
  })
}