// 静态资源地址兼容处理
// 历史数据：存储的是相对路径（或带 https://static.momaking.com/ 前缀的完整地址）
// 新数据：后端已切换到阿里云 OSS，直接返回完整地址
const LEGACY_STATIC_BASE = 'https://static.momaking.com/'

// 相对路径的默认前缀，如需整体切换到 OSS 域名，配置 VITE_STATIC_BASE_URL 即可
const STATIC_BASE = import.meta.env.VITE_STATIC_BASE_URL || LEGACY_STATIC_BASE

// 是否为完整地址（http/https/协议相对/base64/blob）
const isAbsoluteUrl = (url) => /^(https?:)?\/\//i.test(url) || /^(data|blob):/i.test(url)

/**
 * 拼接静态资源完整地址，兼容历史相对路径与新的 OSS 完整地址
 * @param {string} path 相对路径或完整地址
 * @returns {string} 完整地址
 */
export const resolveStaticUrl = (path) => {
	if (!path) {
		return ''
	}
	const url = String(path).trim()
	if (isAbsoluteUrl(url)) {
		return url
	}
	return STATIC_BASE.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '')
}

/**
 * 去掉历史静态域名前缀，OSS 等其他完整地址原样保留
 * @param {string} path 相对路径或完整地址
 * @returns {string} 提交给后端保存的路径
 */
export const stripLegacyStaticBase = (path) => {
	if (!path) {
		return ''
	}
	return String(path).trim().replace(/^https?:\/\/static\.momaking\.com\//i, '')
}
