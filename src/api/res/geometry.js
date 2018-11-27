import request from '@/utils/request'
export function getgeometryList(params) {
	return request({
		url: '/api/res/geometry/list',
		method: 'get',
		params
	})
}