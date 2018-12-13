import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/work/proTask/prolist',
	    method: 'get',
	    params
	  })
	}
	
	export function get(id) {
	  return request({
	    url: '/api/work/proTask/acttaskinfo',
	    method: 'get',
	    params:{id:id}
	  })
	}
		
	export function acttaskinfo(id) {
	  return request({
	    url: '/api/work/proTask/acttaskinfo',
	    method: 'get',
	    params:{id:id}
	  })
	}
	export function save(data) {
	  return request({
	    url: '/api/work/proTask/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/work/proTask/del',
	    method: 'post',
	    params:{ids:ids}
	  })
	}

	//提交督办
	export function subcontent(params) {
	  return request({
	    url: '/api/work/workUrge/save',
	    method: 'post',
	    params
	  })
	}

	//督办记录

	export function urgelist(id){
		return request({
			url:'api/work/workUrge/urgelist',
			method:'get',
			params:{id:id}
		})
	}

	