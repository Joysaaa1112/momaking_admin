import { request1 as request } from '@/utils/request'
const api = {
	list: '/admin/sitemap/list',
	make: '/admin/sitemap/make',
	delete: '/admin/sitemap/delete',
	autoGenerate: '/admin/sitemap/auto/generate',
}

export function getSitemapListApi(params) {
	return request({
		url: api.list,
		method: 'get',
		params,
	})
}

export function makeSitemapItemApi(data) {
	return request({
		url: api.make,
		method: 'post',
		data: data,
	})
}

export function deleteSitemapItemApi(params) {
	return request({
		url: api.delete,
		method: 'delete',
		params,
	})
}

export function autoGenerateSitemapApi(params) {
	return request({
		url: api.autoGenerate,
		method: 'get',
		params,
	})
}
