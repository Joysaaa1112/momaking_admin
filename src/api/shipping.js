import { request1 as request } from '@/utils/request'

const api = {
	shippingList: '/admin/shipping/list',
	zoneList: '/admin/shipping/zone/list',
	makeShipping: '/admin/shipping/make',
	templateZoneList: '/admin/shipping/template/zone/list',
	deleteShipping: '/admin/shipping/delete',
}

export function getShippingListApi(params) {
	return request({
		url: api.shippingList,
		method: 'get',
		params,
	})
}

export function getZoneListApi(params) {
	return request({
		url: api.zoneList,
		method: 'get',
		params,
	})
}

export function makeShippingApi(data) {
	return request({
		url: api.makeShipping,
		method: 'post',
		data,
	})
}

export function getTemplateZoneListApi(params) {
	return request({
		url: api.templateZoneList,
		method: 'get',
		params,
	})
}

export function deleteShippingApi(params) {
	return request({
		url: api.deleteShipping,
		method: 'delete',
		params,
	})
}
