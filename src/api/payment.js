import { request1 as request } from '@/utils/request'
const api = {
	wechatNative: '/pay/wechat/native',
	wechatNativQuery: '/pay/wechat/query',
}

export async function wechatNativeApi(data) {
	return request({
		url: api.wechatNative,
		method: 'post',
		data,
	})
}

export async function wechatOrderQueryApi(params) {
	return request({
		url: api.wechatNativQuery,
		method: 'get',
		params,
	})
}
