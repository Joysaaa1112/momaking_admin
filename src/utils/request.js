import { message } from 'ant-design-vue'
import axios from 'axios'

// 从环境变量中获取两个不同的API URL
const apiUrl1 = import.meta.env.VITE_BASE_API_URL
const apiUrl2 = import.meta.env.VITE_PY_BASE_API_URL
const ACCESS_TOKEN = 'authorization'

// 创建第一个axios实例
const request1 = axios.create({
	baseURL: apiUrl1,
	timeout: 60000,
})

// 创建第二个axios实例
const request2 = axios.create({
	baseURL: apiUrl2,
	timeout: 60000,
})

// 错误处理函数
const errorHandler = (error) => {
	message.error(error.message)
	return Promise.reject(error)
}

// 添加拦截器到第一个axios实例
request1.interceptors.request.use((config) => {
	const token = window.localStorage.getItem(ACCESS_TOKEN)
	if (token != null) {
		config.headers[ACCESS_TOKEN] = token
	}
	return config
}, errorHandler)

request1.interceptors.response.use((response) => {
	if (response.data.code == 0) {
		return response.data
	} else if (response.data.code == 10001) {
	} else if (response.data.code === 401) {
		window.localStorage.removeItem(ACCESS_TOKEN)
	} else {
		message.error(response.data.msg || 'error')
	}
	return response.data
}, errorHandler)

// 添加拦截器到第二个axios实例
request2.interceptors.request.use((config) => {
	const token = window.localStorage.getItem(ACCESS_TOKEN)
	if (token != null) {
		config.headers[ACCESS_TOKEN] = token
	}
	return config
}, errorHandler)

request2.interceptors.response.use((response) => {
	if (response.data.code !== 0) {
		message.error(response.data.msg || 'error')
	}
	if (response.data.code === 401) {
		window.localStorage.removeItem(ACCESS_TOKEN)
	}
	return response.data
}, errorHandler)

export { request1, request2 }
