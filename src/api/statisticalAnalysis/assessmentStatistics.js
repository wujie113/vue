import request from '@/utils/request'
// 考核管理
export function getChartsList(params) {
  return request({
    url: '/api/dc/asschart',
    method: 'get',
    params
  })
}

//考核管理 table数据api/dc/asstable
export function getAssessTable(params) {
  return request({
    url: '/api/dc/asstable',
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

// 工单统计
export function getOrderChartsList(params) {
  return request({
    url: '/api/dc/workchart',
    method: 'get',
    params
  })
}