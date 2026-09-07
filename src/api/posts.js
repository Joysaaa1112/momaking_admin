import { request1 as request } from '@/utils/request'

const api = {
	create: '/admin/posts/create',
	list: '/admin/posts/list',
	delete: '/admin/posts/delete',
	details: '/admin/posts/details',
	category: {
		all: '/admin/posts/category/all',
		list: '/admin/posts/category/list',
		tree: '/admin/posts/category/tree',
		create: '/admin/posts/category/create',
		reception: '/admin/posts/category/reception',
	},
}

export function postsListApi(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}

export function makePosts(data) {
	return request({
		url: api.create,
		method: 'post',
		data,
	})
}

export function postsDetails(params) {
	return request({
		url: api.details,
		method: 'get',
		params,
	})
}

export function deletePostsApi(params) {
	return request({
		url: api.delete,
		method: 'delete',
		params,
	})
}

export function getCategoryAll(params) {
	return request({
		url: api.category.all,
		method: 'get',
		params,
	})
}

export function getCategoryList(params) {
	return request({
		url: api.category.list,
		method: 'get',
		params,
	})
}
export function getCategoryTree(params) {
	return request({
		url: api.category.tree,
		method: 'get',
		params,
	})
}

export function makeCategory(data) {
	return request({
		url: api.category.create,
		method: 'post',
		data,
	})
}

export function makeCategoryReceptionApi(data) {
	return request({
		url: api.category.reception,
		method: 'put',
		data,
	})
}
