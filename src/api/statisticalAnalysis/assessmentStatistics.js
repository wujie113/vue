import request from '@/utils/request'
// 考核管理
export function getChartsList(params) {
  return request({
    url: '/api/dc/asschart',
    method: 'get',
    params
  })
}

// 投诉管理
export function getComplaintChartsList(params) {
  return request({
    url: '/api/dc/complaintchart',
    method: 'get',
    params
  })
}