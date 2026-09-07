import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from './store/modules/user'
import { message } from 'ant-design-vue'

NProgress.configure({ showSpinner: false })

const allowList = ['authlogin', 'register', 'upload', 'config', 'quotation', 'view', 'resetPassword']
const lang = window.localStorage.getItem('lang') || 'zh'
// const wordpressLoginPath = 'https://www.momaking.com' + '/' + lang + '/signin'
const loginPath = '/auth/login'
const homePath = '/' // 如果用户无权限时的重定向地址

router.beforeEach(async (to, from, next) => {
	NProgress.start()
	const userStore = useUserStore()
	const token = userStore.getToken()
	if (token) {
		try {
			await userStore.getUserInfo()
			if (to.meta?.permission) {
				const hasPermission = userStore.currentUser.auths.includes(to.meta.permission)
				if (!hasPermission) {
					message.warning('您没有权限访问该页面')
					// 无权限，跳转到首页
					next({ path: homePath, replace: true })
					NProgress.done()
					return
				}
			}

			next()
		} catch (error) {
			next()
			userStore.clearToken()
			window.location.href = loginPath + `?redirect=${encodeURIComponent(to.fullPath)}`
		}
	} else {
		if (allowList.includes(to.name)) {
			next()
		} else {
			next()
			window.location.href = loginPath + `?redirect=${encodeURIComponent(to.fullPath)}`
			NProgress.done()
		}
	}
	NProgress.done()
})

router.afterEach(() => {
	NProgress.done()
})
