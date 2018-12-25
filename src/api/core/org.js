import request from '@/utils/request'

//部门列表
export function list(pid) {
  return request({
    url: '/api/sys/office/list',
    method: 'get',
    params: {
      id: pid
    }
  })
}
//部门用户列表列表
export function findOrgUsers(pid) {
  return request({
    url: '/api/sys/office/childs',
    method: 'get',
    params: {
      pid: pid
    }
  })
} 
//查询第二级河长办(不包含人员)
export function getLoweroffice(params) {
  return request({
    url: "/api/res/management/loweroffice",
    method: "get",
    params
  })
}
