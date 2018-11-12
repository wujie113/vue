import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/res/waterSubstation/list',
	    method: 'get',
	    params
	  })
	}
	
	export function get(id) {
	  return request({
	    url: '/api/res/waterSubstation/list',
	    method: 'get',
	    params:{id:id}
	  })
	}
	export function save(data) {
	  return request({
	    url: '/api/res/waterSubstation/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/res/waterSubstation/del',
	    method: 'post',
	    params:{ids:ids}
	  })
	}
	export function	getfiles(data){  
		return request({
	    url: '/c/common/fileRecord/getFiles',
	    method: 'get',
	    params: data
	  })
	}