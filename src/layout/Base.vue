<template>
	<div class="content-layout dark">
		<div class="side-layout" :class="state.collapsed ? 'collapsed' : ''">
			<a class="logo">
				<img src="@/assets/images/m.png" />
				<span>Momaking</span>
			</a>
			<div class="layout-sider-children">
				<a-menu
					style="width: 100%"
					mode="inline"
					theme="dark"
					:items="menus"
					:inline-collapsed="state.collapsed"
					:open-keys="state.openKeys"
					v-model:selectedKeys="state.selectedKeys"
					@select="handleMenuSelect"
					@openChange="handleOpenChange"></a-menu>
			</div>
		</div>
		<div class="right-layout" :class="state.collapsed ? 'collapsed' : ''">
			<header class="header-layout">
				<div class="header-container">
					<span class="nav-item" @click="toggleCollapsed">
						<MenuFoldOutlined v-if="!state.collapsed" />
						<MenuUnfoldOutlined v-else />
					</span>
					<div class="header-main-right">
						<a-dropdown :trigger="['click']" :arrow="{ pointAtCenter: true }">
							<div class="nav-item">
								<span>
									<svg-icon name="language-outline" color="#444" />
								</span>
							</div>
							<template #overlay>
								<a-menu>
									<a-menu-item key="0" class="language-item" @click="changeLanguage('zh')">
										<span class="prefix">zh</span>
										<span class="value">简体中文</span>
									</a-menu-item>

									<a-menu-item key="1" class="language-item" @click="changeLanguage('en')">
										<span class="prefix">en</span>
										<span class="value">English</span>
									</a-menu-item>
								</a-menu>
							</template>
						</a-dropdown>
						<a-dropdown :trigger="['click']" :arrow="{ pointAtCenter: true }">
							<div class="nav-item userinfo">
								<a-avatar :src="userInfo.avatar" :size="26" />
								<span class="username">{{ userInfo.nickname }}</span>
							</div>
							<template #overlay>
								<a-menu>
									<a-menu-item key="1" class="language-item" @click="logout()">
										<LogoutOutlined class="icon" />
										<span class="value">{{ lang == 'zh' ? '退出登录' : 'Logout' }}</span>
									</a-menu-item>
								</a-menu>
							</template>
						</a-dropdown>
					</div>
				</div>
			</header>
			<div class="body-layout">
				<router-view />
			</div>
		</div>
	</div>
</template>

<script setup>
	import '@/assets/css/main.scss'
	import { reactive, ref, h, watch } from 'vue'
	import { useRouter } from 'vue-router'
	import { useUserStore } from '@/store/modules/user'
	import {
		HomeOutlined,
		MailOutlined,
		AppstoreOutlined,
		SettingOutlined,
		UserOutlined,
		MessageOutlined,
		MenuFoldOutlined,
		MenuUnfoldOutlined,
		LogoutOutlined,
	} from '@ant-design/icons-vue'

	// 获取路由和用户信息
	const r = useRouter()
	const routes = r.getRoutes()
	const userInfo = ref({})
	const userPermissions = ref([]) // 存储用户权限
	const lang = localStorage.getItem('lang') || 'zh'

	// 初始化用户信息并获取权限
	const initUserInfo = () => {
		const userStore = useUserStore()
		console.log(userStore.currentUser)
		const currentUser = userStore.currentUser
		userInfo.value = currentUser
		console.log(userInfo.value)
		userPermissions.value = currentUser.auths || ['Dashboard'] // 假设用户权限存储在 `permissions`
	}
	initUserInfo()

	// 根据权限生成菜单
	const generateMenu = (routes, basePath = '') => {
		return routes
			.filter(
				(route) =>
					!route.meta?.hidden && (!route.meta?.permission || userPermissions.value.includes(route.meta.permission) || route.meta.permission == 'dashboard'), // 权限过滤
			)
			.map((route) => {
				const fullPath = basePath + route.path
				const obj = {
					key: route.name,
					icon: route.meta?.icon ? h(route.meta.icon) : '',
					label: route.meta?.title || route.name,
					title: route.meta?.title || route.name,
					path: fullPath,
					children: route.children ? generateMenu(route.children, fullPath + '/') : [],
				}
				if (obj.children.length === 0) {
					delete obj.children
				}
				return obj
			})
	}

	const homeRoute = routes.find((item) => item.name === 'home')
	const menus = generateMenu(homeRoute.children, '/')

	// 菜单状态管理
	const state = reactive({
		collapsed: false,
		selectedKeys: ['1'],
		openKeys: ['sub1'],
		preOpenKeys: ['sub1'],
		rootSubmenuKeys: menus.map((item) => item.key),
	})

	// 菜单操作逻辑
	watch(
		() => state.openKeys,
		(_val, _oldVal) => {
			state.preOpenKeys = _val
		},
	)
	const initCollapsed = JSON.parse(localStorage.getItem('collapsed') || 'false') || false
	state.collapsed = initCollapsed
	const toggleCollapsed = () => {
		state.collapsed = !state.collapsed
		state.openKeys = state.collapsed ? [] : state.preOpenKeys
		localStorage.setItem('collapsed', JSON.stringify(state.collapsed))
	}
	const handleMenuSelect = (item) => {
		state.selectedKeys = [item.key]
		r.push(item.item.path)
		localStorage.setItem('selectedKeys', JSON.stringify(state.selectedKeys))
		document.title = item.item.title
	}
	const handleOpenChange = (openKeys) => {
		const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1)
		if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			state.openKeys = openKeys
		} else {
			state.openKeys = latestOpenKey ? [latestOpenKey] : []
		}
		window.localStorage.setItem('openKeys', JSON.stringify(state.openKeys))
	}

	// 初始化选中和展开菜单
	const initializeSelectedKeys = () => {
		const currentRoute = r.currentRoute.value
		const newSelectedKey = currentRoute.name
		if (state.selectedKeys[0] !== newSelectedKey) {
			state.selectedKeys = [newSelectedKey]
			localStorage.setItem('selectedKeys', JSON.stringify(state.selectedKeys))
		}
		document.title = currentRoute.meta.title || document.title
		const parent = currentRoute.matched[1]
		if (parent) {
			if (state.openKeys.indexOf(parent.name) == -1) {
				state.openKeys.push(parent.name)
				localStorage.setItem('openKeys', JSON.stringify(state.openKeys))
			}
		}
	}
	initializeSelectedKeys()

	// 监听路由变化
	r.afterEach((to) => {
		state.selectedKeys = [to.name]
		localStorage.setItem('selectedKeys', JSON.stringify(state.selectedKeys))
		document.title = to.meta.title
		const parent = to.matched[1]
		if (parent) {
			if (state.openKeys.indexOf(parent.name) == -1) {
				state.openKeys.push(parent.name)
				localStorage.setItem('openKeys', JSON.stringify(state.openKeys))
			}
		}
	})

	// 语言切换
	const changeLanguage = (lang) => {
		if (lang === 'zh') {
			localStorage.setItem('lang', 'zh')
		} else {
			localStorage.setItem('lang', 'en')
		}
		window.location.reload()
	}

	// 退出登录
	const logout = () => {
		const userStore = useUserStore()
		userStore.logout()
		window.location.reload()
	}
</script>
