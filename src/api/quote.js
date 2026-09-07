import { request1 as request } from '@/utils/request'
const api = {
	createQuote: '/api/quotes/create',
	getAttribute: '/api/occ/attr/list',
	getOrderInfo: '/api/order/quote',
	shippingCost: '/api/shipping/cost',
	createOrder: '/api/order/quote/create',
	processOrder: '/api/quotes/process',
}

export async function createQuoteApi(data) {
	return request({
		url: api.createQuote,
		method: 'post',
		data,
	})
}

export function getAttributeApi(data) {
	return request({
		url: api.getAttribute,
		method: 'get',
		params: data,
	})
}

export function getOrerinfoApi(data) {
	return request({
		url: api.getOrderInfo,
		method: 'get',
		params: data,
	})
}

export function getQuoteItemsApi(quoteNo, data) {
	return request({
		url: '/api/quotes/' + quoteNo + '/items',
		method: 'get',
		params: data,
	})
}

export function shippingCostApi(data) {
	return request({
		url: api.shippingCost,
		method: 'get',
		params: data,
	})
}

export function setQuoteQuantityApi(hash, data) {
	return request({
		url: '/api/quotes/item/' + hash + '/quantity',
		method: 'put',
		data,
	})
}

export function createOrderApi(data) {
	return request({
		url: api.createOrder,
		method: 'post',
		data,
	})
}

export function processOrderApi(data) {
	return request({
		url: api.processOrder,
		method: 'put',
		data,
	})
}
