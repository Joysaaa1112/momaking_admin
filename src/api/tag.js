import { request1 as request } from '@/utils/request'
const api = {
	tagList: '/admin/tag/list',
	tagSave: '/admin/tag/make',
	tagDelete: '/admin/tag/delete',
	categoryList: '/admin/tag/category/list',
	categorySave: '/admin/tag/category/make',
	categoryDelete: '/admin/tag/category/delete',
}

export function categoryListApi(params) {
	return request({
		url: api.categoryList,
		method: 'get',
		params,
	})
}

export function categorySaveApi(data) {
	return request({
		url: api.categorySave,
		method: 'post',
		data,
	})
}

export function categoryDeleteApi(params) {
	return request({
		url: api.categoryDelete,
		method: 'delete',
		params,
	})
}

export function tagListApi(params) {
	return request({
		url: api.tagList,
		method: 'get',
		params,
	})
}

export function tagSaveApi(data) {
	return request({
		url: api.tagSave,
		method: 'post',
		data,
	})
}

export function tagDeleteApi(params) {
	return request({
		url: api.tagDelete,
		method: 'delete',
		params,
	})
}
