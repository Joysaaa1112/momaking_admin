import { request1 as request } from '@/utils/request'

const api = {
	list: '/admin/creativity/list',
	create: '/admin/creativity/create',
	delete: '/admin/creativity/delete',
}

export function getCreativityListApi(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}

export function createCreativityApi(data) {
	return request({
		url: api.create,
		method: 'post',
		data,
	})
}

export function deleteCreativityApi(params) {
	return request({
		url: api.delete,
		method: 'delete',
		params,
	})
}
