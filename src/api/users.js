import { request1 as request } from '@/utils/request'

const api = {
	list: '/admin/users/list',
}

export function userListApi(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}
