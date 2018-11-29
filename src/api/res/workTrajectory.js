import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/res/workTrajectory/list',
	    method: 'get',
	    params
	  })
	}
	
	//查看轨迹
	export function gettrajectory(id) {
	  return request({
	    url: '/api/res/workTrajectory/get',
	    method: 'get',
	    params:{id:id}
	  })
	}
 
	export function save(data) {
	  return request({
	    url: '/api/res/workTrajectory/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/res/workTrajectory/del',
	    method: 'post',
	    params:{ids:ids}
	  })
	}

