import { request1 as request } from '@/utils/request'
const api = {
	userInfo: '/admin/me',
	saveInformation: '/api/users/update',
}

export function getUserInfoApi(params) {
	return request({
		url: api.userInfo,
		method: 'get',
		params,
	})
}

export function saveUserInfoApi(data) {
	return request({
		url: api.userInfo,
		method: 'put',
		data,
	})
}

export function saveInformationApi(data) {
	return request({
		url: api.saveInformation,
		method: 'put',
		data,
	})
}
