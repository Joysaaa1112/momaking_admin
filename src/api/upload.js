import { request1 as request } from '@/utils/request'

const api = {
	offline: '/api/upload/offline',
}
export function uploadOffline(data, headers) {
	return request({
		url: api.offline,
		method: 'post',
		headers: headers,
		data,
	})
}
