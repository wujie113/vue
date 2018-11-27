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
