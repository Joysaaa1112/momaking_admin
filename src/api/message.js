import { request1 as request } from '@/utils/request'
const api = {
	list: '/admin/message/template/list',
	create: '/admin/message/template/create',
	send: '/admin/message/send',
}

export function templateListApi(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}

export function templateCreateApi(data) {
	return request({
		url: api.create,
		method: 'post',
		data,
	})
}

export function messageSendApi(data) {
	return request({
		url: api.send,
		method: 'post',
		data,
	})
}
