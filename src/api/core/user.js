import request from '@/utils/request'
//查看用户详情
export function userinfo(id) {  
  return request({
    url: '/api/sys/user/info',
    method: 'get',
    params:{userid:id}
  })
}
export function officeuserlist(id) {  
  return request({
    url: '/api/sys/office/user',
    method: 'get',
    params:{id:id}
  })
}
