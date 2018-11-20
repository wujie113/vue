import request from '@/utils/request'

export function getList(params) {
	return request({
		url: '/api/work/complaint/list',
		method: 'get',
		params
	})
}

export function get(id) {
	return request({
    url: "/api/work/complaint/get",
    method: "get",
    params: { id: id }
  });
}

export function save(data) {
	return request({
		url: '/api/work/complaint/save',
		method: 'post',
		data
	})
}

export function del(ids) {
	return request({
		url: '/api/work/complaint/del',
		method: 'post',
		params: { ids: ids }
	})
}

//查看回复详情 以及未回复条数
export function showstatus(id) {
	return request({
		url: '/api/work/complaint/showStatus',
		method: 'post',
		params: { id: id }
	})
}

//提交回复
export function addComment(params) {
	return request({
		url: '/api/work/complaint/insertANDupdateTOstatus',
		method: 'post',
		data: params
	})
}
