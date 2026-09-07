import { request1 as request } from '@/utils/request'

const api = {
	getSetting: '/admin/settings/get',
	updateSetting: '/admin/settings/update',
	feedbackList: '/admin/index/feedback',
	merchants: '/admin/index/merchants',
	message: '/admin/index/message',
}

export function getSettingApi(params) {
	return request({
		url: api.getSetting,
		method: 'get',
		params,
	})
}

export function updateSettingApi(data) {
	return request({
		url: api.updateSetting,
		method: 'put',
		data,
	})
}

export function feedbackListApi(params) {
	return request({
		url: api.feedbackList,
		method: 'get',
		params,
	})
}

export function merchantsApi(params) {
	return request({
		url: api.merchants,
		method: 'get',
		params,
	})
}

export function messageApi(params) {
	return request({
		url: api.message,
		method: 'get',
		params,
	})
}
