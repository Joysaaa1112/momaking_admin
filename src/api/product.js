import { request1 as request } from '@/utils/request'
const api = {
	category: '/admin/product/category',
	categoryTree: '/admin/product/category/tree',
	product: '/admin/product',
	productInfo: '/admin/product/info',
	productStatus: '/admin/product/status',
}

export function makeCategoryApi(data) {
	return request({
		url: api.category,
		method: 'post',
		data: data,
	})
}

export function getCategoryListApi(params) {
	return request({
		url: api.category,
		method: 'get',
		params: params,
	})
}

export function getCategoryTreeApi(params) {
	return request({
		url: api.categoryTree,
		method: 'get',
		params: params,
	})
}

export function deleteCategoryApi(data) {
	return request({
		url: api.category,
		method: 'delete',
		data: data,
	})
}

export function makeProductApi(data) {
	return request({
		url: api.product,
		method: 'post',
		data: data,
	})
}

export function getProductListApi(params) {
	return request({
		url: api.product,
		method: 'get',
		params: params,
	})
}

export function getProductInfoApi(params) {
	return request({
		url: api.productInfo,
		method: 'get',
		params,
	})
}

export function putProductStatusApi(data) {
	return request({
		url: api.productStatus,
		method: 'put',
		data: data,
	})
}
