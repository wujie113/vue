import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/res/camera/list',
	    method: 'get',
	    params
	  })
	}
	
	export function getBtn   (id) {
	  return request({
	    url: '/api/res/camera/recoveryExecl',
	    method: 'get',
	    params:{id:id}
	  })
	}
	export function save(data) {
	  return request({
	    url: '/api/res/camera/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/res/camera/del',
	    method: 'post',
	    params:{ids:ids}
	  })
	}