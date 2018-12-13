import request from '@/utils/request' 

//保存管理人员
export function	saveusers(data) {  
	return request({
		url: 'api/res/management/saveusers',
		method: 'post',
		data
	})
}	
//获取已经选择的人员信息
export function	getmanagerlist(params) {   
		return request({
			url: 'api/res/management/managementuserlist',
			method: 'get',
			params
		})
	}
//删除选择的人员
export function	deluser(idx) {  
	const params = { ids: idx }
	console.log("params:::",params);
	return request({
		url: 'api/res/management/del',
		method: 'get',
		params
	})
}
export function	gethzbuserbyareaid(params) {   
	return request({
		url: 'api/res/management/gethzbuserbyareaid',
		method: 'get',
		params
	})
}

export function	findOfficeUserstree(params) {   
	return request({
		url: 'api/res/management/orgusertrees',
		method: 'get',
		params
	})
}
// 组织机构树,包含人员
export function	findOrgtreesandusers(params) {
  return request({
    url: '/api/res/management/orgtreesandusers',
    method: 'get',
    params
  })
}
export function getorgtrees(params) {
	return request({
	  url: "/api/res/management/orgtrees",
	  method: "get",
	  params
	})
}
		
  export function getSynergOffice(params) {
    return request({
      url: "/api/res/management/synerg/office",
      method: "get",
      params
    })
	}
	
export function getLoweroffice(params) {
  return request({
    url: "/api/res/management/loweroffice",
    method: "get",
    params
  })
}
// 曝光保存
export function saveExposure(params) {
  return request({
    url: "/api/sysMsg/saveExposure",
    method: "post",
    data: params
  })
}


