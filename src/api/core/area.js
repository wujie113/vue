import request from '@/utils/request'

//区域树
export function tree(pid) {
  return request({
    url: '/api/sys/area/tree',
    method: 'get',
    params: {
      pid: pid
    }
  })
}
//区域人员
export function getAreausers(areaid) {
  return request({
    url: '/api/common/user/gethzbuserbyareaid',
    method: 'get',
    params: {
      areaid: areaid
    }
  })
}

