import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/res/materialFile/list',
	    method: 'get',
	    params
	  })
	}
	
	export function get(id) {
	  return request({
	    url: '/api/res/materialFile/list',
	    method: 'get',
	    params:{id:id}
	  })
	}
	export function save(data) {
	  return request({
	    url: '/api/res/materialFile/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/res/materialFile/del',
	    method: 'post',
	    params:{ids:ids}
	  })
	}
	export function issue(id) {
		console.log("id:::",id);
	  return request({
	    url: '/api/res/materialFile/issue',
	    method: 'post',
	    params:{id:id}
	  })
	}
	export function notissue(id) {
		console.log("id:::",id);
	  return request({
	    url: '/api/res/materialFile/notissue',
	    method: 'post',
	    params:{id:id}
	  })
	}
	