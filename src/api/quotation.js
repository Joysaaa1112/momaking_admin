import { request1 as request } from '@/utils/request'

const api = {
	makeMaterialCategory: '/admin/quotation/materialCategory',
	materialCategory: '/admin/quotation/material/category',
	materialCategoryList: '/admin/quotation/material/category/list',
	materialSave: '/admin/quotation/material',
	materialList: '/admin/quotation/material/list',
}

export function makeMaterialCategoryApi(data) {
	return request({
		url: api.makeMaterialCategory,
		method: 'post',
		data,
	})
}

export async function materialCategoryListApi(params) {
	return request({
		url: api.materialCategoryList,
		method: 'get',
		params,
	})
}

export function deleteMaterialCategoryApi(params) {
	return request({
		url: api.materialCategory,
		method: 'delete',
		data: params,
	})
}

export function makeMaterialApi(data) {
	return request({
		url: api.materialSave,
		method: 'post',
		data,
	})
}

export function materialListApi(params) {
	return request({
		url: api.materialList,
		method: 'get',
		params,
	})
}
