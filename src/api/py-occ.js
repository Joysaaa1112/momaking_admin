import { request2 as request } from '@/utils/request'
const api = {
	analysis: '/api/quotes/item/analysis',
	saveItemAttr: '/api/quotes/item/save/attr',
}

export async function analysisApi(data) {
	return request({
		url: api.analysis,
		method: 'get',
		params: data,
	})
}

export function saveItemAttrApi(data) {
	return request({
		url: api.saveItemAttr,
		method: 'post',
		data,
	})
}
