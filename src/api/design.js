import { request1 as request } from '@/utils/request'

const api = {
	create: '/api/design/create',
	list: '/admin/design/list',
}

export async function createDesignApi(data) {
	return request({
		url: api.create,
		method: 'post',
		data,
	})
}

export async function listDesignApi(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}
