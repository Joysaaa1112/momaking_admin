import { request1 as request } from '@/utils/request'
const api = {
	list: '/admin/pages/list',
	make: '/admin/pages/make',
}

export function pagesListApi(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}

export function makePagesApi(data) {
	return request({
		url: api.make,
		method: 'post',
		data: data,
	})
}
