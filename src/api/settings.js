import { request1 as request } from '@/utils/request'
const api = {
	cncModelCreate: '/admin/settings/cnc/model/create',
	cncModelList: '/admin/settings/cnc/model/list',
	cncModelDelete: '/admin/settings/cnc/model/delete',
	cncModelStatus: '/admin/settings/cnc/model/status',
	content: {
		list: '/admin/settings/content/list',
		make: '/admin/settings/content/make',
		delete: '/admin/settings/content/delete',
	},
}

export function cncModelCreate(data) {
	return request({
		url: api.cncModelCreate,
		method: 'post',
		data: data,
	})
}

export function cncModelList(params) {
	return request({
		url: api.cncModelList,
		method: 'get',
		params,
	})
}

export function cncModelStatus(data) {
	return request({
		url: api.cncModelStatus,
		method: 'put',
		data: data,
	})
}
export function cncModelDelete(params) {
	return request({
		url: api.cncModelDelete,
		method: 'get',
		params,
	})
}

export function makeContentApi(data) {
	return request({
		url: api.content.make,
		method: 'post',
		data: data,
	})
}
export function contentListApi(params) {
	return request({
		url: api.content.list,
		method: 'get',
		params,
	})
}
export function deleteContentApi(params) {
	return request({
		url: api.content.delete,
		method: 'get',
		params,
	})
}
