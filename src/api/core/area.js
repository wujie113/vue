import request from '@/utils/request'

//区域树
export function tree(pid,iscontains) {
  if(iscontains==undefined)iscontains=null;
  return request({
    url: 'api/res/management/tree',
    method: 'get',
    params: {
      pid: pid,
      iscontains:iscontains
    }
  })
}
//区域人员
export function getAreausers(areaid) {
  return request({
    url: '/api/sys/user/gethzbuserbyareaid',
    method: 'get',
    params: {
      areaid: areaid
    }
  })
}

