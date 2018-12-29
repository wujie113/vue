import request from '@/utils/request'

 

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

export function findsettemplateItemlist(params){
  return request({
    url: '/api/ass/assOrgTemplateItem/findsettemplateitemlist',
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


export function geteditscorelist(params) {
  return request({
    url: '/api/ass/assOrgTemplateItem/score/editlist',
    method: 'get',
    params
  })
}
 
export function savescore(params) {
  return request({
    url: '/api/ass/assOrgScores/save',
    method: 'post',
    data: params
  })
}

export function editsavescore(params) {
  return request({
    url: '/api/ass/assOrgScores/edit/save',
    method: 'post',
    data: params
  })
}


export function officelist(params) {
  return request({
    url: '/api/dc/asstable',
    method: 'post',
    data: params
  })
}

