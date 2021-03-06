import request from '@/utils/request'

	export function getList(params) {
	  return request({
	    url: '/api/sys/addressbook/list',
	    method: 'get',
	    params
	  })
	}
	
	export function get(id) {
	  return request({
	    url: '/api/sys/addressbook/list',
	    method: 'get',
	    params: { id : id }
	  })
	}
	export function save(data) {
	  return request({
	    url: '/api/sys/addressbook/save',
	    method: 'post',
	    data
	  })
	}
	
	export function del(ids) {
	  return request({
	    url: '/api/sys/addressbook/del',
	    method: 'post',
	    params:{ ids:ids }
		})
	 }		
	 export function synchronous(officeid) {
	  return request({
	    url: '/api/sys/addressbook/synchronous',
	    method: 'post',
	    officeid
		})
	 }
	 