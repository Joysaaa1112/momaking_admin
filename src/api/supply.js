import { request1 as request } from '@/utils/request'

const api = {
	create: '/admin/supply/create',
	list: '/admin/supply/list',
	delete: '/admin/supply/delete',
}

export function supplyList(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}

export function makeSupply(data) {
	return request({
		url: api.create,
		method: 'post',
		data,
	})
}

export function deleteSupply(params) {
	return request({
		url: api.delete,
		method: 'delete',
		params,
	})
}
