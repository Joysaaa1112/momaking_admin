import { request1 as request } from '@/utils/request'
const api = {
	country: '/admin/geo/country',
	state: '/admin/geo/state',
}

export async function getCountryApi(params) {
	return request({
		url: api.country,
		method: 'get',
		params,
	})
}

export async function getStateApi(params) {
	return request({
		url: api.state,
		method: 'get',
		params,
	})
}
