import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/res/lake/list',
	    method: 'get',
	    params
	  })
	}
	export function getqlist(type) {
	  return request({
	    url: '/api/res/lake/qylist',
	    method: 'get',
	    params:{type:type}
	  })
	}
	export function get(id) {
	  return request({
	    url: '/api/res/lake/list',
	    method: 'get',
	    params:{id:id}
	  })
	}
	export function save(data) {
		console.log("data::",data)
	  return request({
	    url: '/api/res/lake/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/res/lake/del',
	    method: 'post',
	    params:{ids:ids}
	  })
	}
	export function hptree() {
		return request({
	    url: '/api/res/lake/tree',
	    method: 'get'
	  })
	}  