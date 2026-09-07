import { request1 as request } from '@/utils/request'

const api = {
	info: '/admin/order/quote/details',
	confirm: '/admin/order/confirm',
	list: '/admin/order/list',
	adminInfo: '/admin/order/admin/info',
	update: '/admin/order/update',
	package: '/admin/order/pack/file',
	deliveryNote: '/admin/order/delivery/note',
}

export async function getOrderInfoApi(params) {
	return request({
		url: api.info,
		method: 'get',
		params,
	})
}

export function orderConfirmApi(data) {
	return request({
		url: api.confirm,
		method: 'post',
		data,
	})
}

export function getOrderListApi(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}

export async function getAdminOrderInfoApi(params) {
	return request({
		url: api.adminInfo,
		method: 'get',
		params,
	})
}

export async function updateAdminOrderApi(data) {
	return request({
		url: api.update,
		method: 'put',
		data,
	})
}

export async function getOrderPackageApi(params) {
	return request({
		url: api.package,
		method: 'get',
		params,
	})
}

export async function generateDeliveryNoteApi(params) {
	return request({
		url: api.deliveryNote,
		method: 'get',
		params,
	})
}
