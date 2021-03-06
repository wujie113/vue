import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/work/dutyClock/list',
	    method: 'get',
	    params
	  })
	}
	
	export function get(id) {
	  return request({
	    url: '/api/work/dutyClock/list',
	    method: 'get',
	    params:{id:id}
	  })
	}
	export function save(data) {
	  return request({
	    url: '/api/work/dutyClock/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/work/dutyClock/del',
	    method: 'post',
	    params:{ids:ids}
	  })
	}

