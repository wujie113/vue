import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/res/workTrajectory/list',
	    method: 'get',
	    params
	  })
	}
	
	//查看轨迹和日期筛选
	export function gettrajectory(params) {
	  return request({
	    url: '/api/res/workTrajectory/get',
	    method: 'get',
	    params
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


