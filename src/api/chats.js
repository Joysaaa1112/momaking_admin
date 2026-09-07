import { request1 as request } from '@/utils/request'

const api = {
	roleList: '/admin/chats/role/list',
	roleSave: '/admin/chats/role/save',
	roleDelete: '/admin/chats/role/delete',
	roleStatus: '/admin/chats/role/status',
}

export function roleListApi(params) {
	return request({
		url: api.roleList,
		method: 'get',
		params,
	})
}

export function roleSaveApi(data) {
	return request({
		url: api.roleSave,
		method: 'post',
		data,
	})
}

export function roleDeleteApi(params) {
	return request({
		url: api.roleDelete,
		method: 'delete',
		params,
	})
}

export function roleStatusApi(data) {
	return request({
		url: api.roleStatus,
		method: 'put',
		data,
	})
}
