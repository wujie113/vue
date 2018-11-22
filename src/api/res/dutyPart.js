import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/res/dutyPart/list',
	    method: 'get',
	    params
	  })
	}
	
	export function get(id) {
	  return request({
	    url: '/api/res/dutyPart/list',
	    method: 'get',
	    params:{id:id}
	  })
	}
	export function save(data) {
	  return request({
	    url: '/api/res/dutyPart/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/res/dutyPart/del',
	    method: 'post',
	    params:{ids:ids}
	  })
	}


	export function addspot(params){
		return request({
	    url: '/api/work/dutyClock/addspot',
	    method: 'post',
	    data:params
	  })
	}

	export function getspot(id) {
	  return request({
	    url: '/api/work/dutyClock/getspot',
	    method: 'get',
	    params:{id:id}
	  })
	}

	export function delBtn(id) {
	  return request({
	    url: '/api/work/dutyClock/delspot',
	    method: 'post',
	    params:{id:id}
	  })
	}
	

	