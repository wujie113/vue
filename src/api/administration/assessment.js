import request from '@/utils/request'


export function getarealist() {
  return request({
    url: '/api/ass/assOrgTemplateItem/getarealist',
    method: 'get',
  })
}

export function getList(params) {
  return request({
    url: '/api/ass/assOrgTemplateItem/list',
    method: 'get',
    params
  })
}

export function get(id) {
  return request({
    url: '/api/ass/assOrgTemplateItem/list',
    method: 'get',
    params:{id:id}
  })
}
export function save(data) {
  return request({
    url: '/api/ass/assOrgTemplateItem/save',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/ass/assOrgTemplateItem/del',
    method: 'post',
    params:{ids:ids}
  })
}

export function getasslist(params){
  return request({
    url: '/api/ass/assOrgTemplateItem/list',
    method: 'get',
    params
  })
}

export function getscorelist(params) {
  return request({
    url: '/api/ass/assOrgTemplateItem/score/list',
    method: 'get',
    params
  })
}