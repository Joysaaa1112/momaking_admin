import { request1 as request } from '@/utils/request'
const api = {
	makeUser: '/admin/place/make/user',
	myUsers: '/admin/place/my/users',
	order: '/admin/place/order',
}

export function makeUserApi(data) {
	return request({
		url: api.makeUser,
		method: 'post',
		data,
	})
}

export function myUsersApi(params) {
	return request({
		url: api.myUsers,
		method: 'get',
		params,
	})
}

export function updateOrderApi(data) {
	return request({
		url: api.order,
		method: 'put',
		data,
	})
}
