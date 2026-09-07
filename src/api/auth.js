import { request1 as request } from '@/utils/request'
const api = {
	login: '/admin/auth/login',
	forgetEmail: '/api/auth/forget',
	resetPassword: '/api/auth/reset_password',
	makePermission: '/admin/auth/make',
	permissionTree: '/admin/auth/tree',
	permissionList: '/admin/auth/list',
	roleList: '/admin/auth/role/list',
	roleSave: '/admin/auth/role/make',
	authDelete: '/admin/auth/delete',
	roleDelete: '/admin/auth/role',
	roleDefault: '/admin/auth/role/default',
	userSearch: '/admin/auth/user/search',
}

export function loginApi(data) {
	return request({
		url: api.login,
		method: 'post',
		data: data,
	})
}

export function forgetEmailApi(data) {
	return request({
		url: api.forgetEmail,
		method: 'post',
		data: data,
	})
}

export function resetPasswordApi(data) {
	return request({
		url: api.resetPassword,
		method: 'post',
		data: data,
	})
}

export function makePermissionApi(data) {
	return request({
		url: api.makePermission,
		method: 'post',
		data,
	})
}

export function permissionTreeApi() {
	return request({
		url: api.permissionTree,
		method: 'get',
	})
}

export function permissionListApi(params) {
	return request({
		url: api.permissionList,
		method: 'get',
		params,
	})
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

export function authDeleteApi(params) {
	return request({
		url: api.authDelete,
		method: 'delete',
		params,
	})
}

export function roleDeleteApi(params) {
	return request({
		url: api.roleDelete,
		method: 'delete',
		params,
	})
}

export function roleDefaultApi(data) {
	return request({
		url: api.roleDefault,
		method: 'put',
		data,
	})
}

export function userSearchApi(params) {
	return request({
		url: api.userSearch,
		method: 'get',
		params,
	})
}
