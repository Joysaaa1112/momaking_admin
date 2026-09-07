import { request1 as request } from '@/utils/request'
const api = {
	statistics: '/admin/index/statistics',
}

export function statisticsApi() {
	return request({
		url: api.statistics,
		method: 'get',
	})
}
