import { request1 as request } from '@/utils/request'

const api = {
	make: '/admin/coupon/make',
	list: '/admin/coupon/list',
	status: '/admin/coupon/status',
	delete: '/admin/coupon/delete',
	sendToUser: '/admin/coupon/send/user',
}

export async function makeCouponApi(data) {
	return request({
		url: api.make,
		method: 'post',
		data,
	})
}

export function couponListApi(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}

export function changeCouponStatusApi(data) {
	return request({
		url: api.status,
		method: 'put',
		data,
	})
}

export function deleteCouponApi(data) {
	return request({
		url: api.delete,
		method: 'delete',
		data,
	})
}

export function sendCouponToUserApi(data) {
	return request({
		url: api.sendToUser,
		method: 'post',
		data,
	})
}
