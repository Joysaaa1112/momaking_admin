import { request1 as request } from '@/utils/request'

const api = {
	visitor: '/admin/statistics/visitor',
	sales: '/admin/statistics/sales',
	order: '/admin/statistics/order',
	user: '/admin/statistics/user',
	record: '/admin/statistics/visitorRecord',
}

export function visitorApi(params) {
	return request({
		url: api.visitor,
		method: 'get',
		params,
	})
}

export function salesApi(params) {
	return request({
		url: api.sales,
		method: 'get',
		params,
	})
}

export function orderApi(params) {
	return request({
		url: api.order,
		method: 'get',
		params,
	})
}

export function userApi(params) {
	return request({
		url: api.user,
		method: 'get',
		params,
	})
}

export function recordApi(params) {
	return request({
		url: api.record,
		method: 'get',
		params,
	})
}
