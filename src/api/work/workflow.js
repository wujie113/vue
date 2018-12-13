import request from '@/utils/request'

 
/****转派 {actid：流程id ，officeid：下发部门 ，receiveUserId：具体接单人，comment：备注}*/
export function send(data) {
	  return request({
	    url: '/api/work/proTask/sendtask',
	    method: 'post',
	    data
	  })
} 

/**退回 {actid::流程单id ,comment:备注} */
export function back(data) {
	return request({
		url: '/api/work/proTask/back',
		method: 'post',
		data
	})
} 

/***审核 {actid:流程单id,isaudit:是否通过 非1为不通过,comment:备注} */
export function audit(data) {
	return request({
		url: '/api/work/proTask/audit',
		method: 'post',
		data
	})
} 

/***工单开始处理 {actid:流程单id} */
export function beginhandel(data) {
	return request({
		url: '/api/work/proTask/beginhandel',
		method: 'post',
		data
	})
} 

/***工单完成处理 {actid:流程单id,comment:备注} */
export function endhandel(data) {
	return request({
		url: '/api/work/proTask/endhandel',
		method: 'post',
		data
	})
} 
/***工单完成处理 {actid:流程单id,comment:备注} */
export function officelist(data) {
	return request({
		url: '/api/res/management/loweroffice',
		method: 'post',
		data
	})
}
