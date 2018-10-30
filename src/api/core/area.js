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

