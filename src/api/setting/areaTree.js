import request from '@/utils/request'
// 区域树
export function AreaTree(params) {
  return request({
    url: '/api/sys/area/tree',
    method: 'get',
    params
  })
}
// 个人区域树
export function AreaMytree(params) {
  return request({
    url: '/api/sys/area/mytree',
    method: 'get',
    params
  })
}
// 删除
export function Delete(ids) {
  return request({
    url: '/api/sys/area/del',
    method: 'post',
    data: { ids }
  })
}
// 新增
export function Add(params) {
  return request({
    url: '/api/sys/area/save',
    method: 'post',
    data: params
  })
}
// 查询对象详情
export function Datails(params) {
  return request({
    url: '/api/sys/area/get',
    method: 'get',
    params
  })
}
