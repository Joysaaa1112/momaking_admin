import { defineStore } from 'pinia'
import { getUserInfoApi } from '@/api/user'

export const useUserStore = defineStore({
	id: 'user',
	state: () => ({
		isLoggedIn: false,
		user: null,
		token: '',
	}),
	getters: {
		isAuthenticated: (state) => state.isLoggedIn,
		currentUser: (state) => state.user,
		currentToken: (state) => state.token,
	},
	actions: {
		login(userInfo) {
			return new Promise((resolve, reject) => {
				login_api(userInfo)
					.then((res) => {
						if (res?.code == 0) {
							this.token = res.data.token
							localStorage.setItem('authorization', res.data.token)
							this.isLoggedIn = true
							resolve(this.token)
						}
					})
					.catch((err) => {
						reject(err)
					})
			})
		},
		logout() {
			this.isLoggedIn = false
			this.user = null
			window.localStorage.removeItem('authorization')
			window.localStorage.removeItem('uuid')
			window.localStorage.removeItem('member')
		},
		getToken() {
			this.token = localStorage.getItem('authorization') || ''
			return this.token
		},
		getUserInfo() {
			return new Promise((resolve, reject) => {
				getUserInfoApi()
					.then((res) => {
						if (res.data.nickname == '') {
							res.data.nickname = res.data.first_name + res.data.last_name
						}
						this.user = res.data
						resolve(res)
					})
					.catch((err) => {
						reject(err)
					})
			})
		},
		clearToken() {
			window.localStorage.removeItem('authorization')
			window.localStorage.removeItem('uuid')
			window.localStorage.removeItem('member')
		},
	},
})
