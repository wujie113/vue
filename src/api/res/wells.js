import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/res/wells/list',
	    method: 'get',
	    params
	  })
	}
	
	export function get(id) {
	  return request({
	    url: '/api/res/wells/recoveryExecl',
	    method: 'get',
	    params:{id:id}
	  })
	}
	export function save(data) {
	  return request({
	    url: '/api/res/wells/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/res/wells/del',
	    method: 'post',
	    params:{ids:ids}
	  })
	}
	export function delBtn(id) {
	  return request({
	    url: '/api/res/wells/deleteExecl',
	    method: 'post',
	    params:{id:id}
	  })
	}

	export function	getfiles(data){  
		return request({
	    url: '/c/common/fileRecord/getFiles',
	    method: 'get',
	    params: data
	  })
	}