import { createRouter, createWebHistory } from 'vue-router'
import { SimpleLayout, BaseLayout } from '@/layout'
import { DashboardOutlined, UserOutlined, ProfileOutlined, SettingOutlined, BoxPlotOutlined, BookOutlined, DollarCircleOutlined, BarChartOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
const lang = window.localStorage.getItem('lang') || 'zh'
const routes = [
	{
		name: 'home',
		path: '/',
		redirect: `dashboard`,
		meta: { title: 'menu.home' },
		component: BaseLayout,
		children: [
			{
				name: 'dashboard',
				path: 'dashboard',
				meta: { title: lang == 'en' ? 'Dashboard' : '仪表盘', hidden: false, icon: h(DashboardOutlined), permission: 'dashboard' },
				component: () => import('../views/dashboard/index.vue'),
			},
			{
				// 埋点统计。这里刻意不写 meta.permission：permission.js 会拿它和后端返回的
				// auths 比对，权限系统里还没有对应条目的话，进页面会被拦下提示"没有权限"。
				// 等 PHP 那边加了 stat 权限项，再补上 permission: 'stat' 即可。
				name: 'stat',
				path: 'stat',
				meta: { title: lang == 'en' ? 'Analytics' : '访问统计', hidden: false, icon: h(BarChartOutlined) },
				component: () => import('../views/stat/index.vue'),
			},
			{
				name: 'userIndex',
				path: 'user',
				meta: { title: lang == 'en' ? 'User Manager' : '用户管理', hidden: false, icon: h(UserOutlined), permission: 'userManager' },
				children: [
					{
						name: 'user',
						path: 'list',
						meta: { title: lang == 'en' ? 'User' : '用户', permission: 'userList' },
						component: () => import('../views/user/index.vue'),
					},
					{
						name: 'userTag',
						path: 'tag',
						meta: { title: lang == 'en' ? 'User Tag' : '用户标签', permission: 'userTag' },
						component: () => import('../views/user/tag.vue'),
					},
				],
			},
			{
				name: 'orderIndex',
				path: 'order',
				meta: { title: lang == 'en' ? 'Order Manager' : '订单管理', hidden: false, icon: h(ProfileOutlined), permission: 'orderManager' },
				children: [
					{
						name: 'order',
						path: 'list',
						meta: { title: lang == 'en' ? 'Order' : '订单', permission: 'orderList' },
						component: () => import('../views/orders/order.vue'),
					},
					{
						name: 'details',
						path: 'details/:order_no',
						meta: { title: lang == 'en' ? 'Order details' : '订单详情', hidden: true, permission: 'orderDetails' },
						component: () => import('../views/orders/details.vue'),
					},
					{
						name: 'review',
						path: 'review/:order_no',
						meta: { title: lang == 'en' ? 'Order review' : '订单审核', hidden: true, permission: 'orderReview' },
						component: () => import('../views/orders/review.vue'),
					},
					{
						name: 'purchase',
						path: 'purchase/:order_no',
						meta: { title: lang == 'en' ? 'Purchase' : '采购单', hidden: true, permission: 'orderPurchase' },
						component: () => import('../views/orders/purchase.vue'),
					},
					{
						name: 'design',
						path: 'design',
						meta: { title: lang == 'en' ? 'Design' : '结构设计', hidden: false, permission: 'orderDesign' },
						component: () => import('../views/orders/design.vue'),
					},
					{
						name: 'place',
						path: 'place',
						meta: { title: lang == 'zh' ? '代客下单' : 'Place Order', permission: 'orderPlace' },
						component: () => import('../views/orders/place.vue'),
					},
				],
			},
			{
				name: 'product',
				path: 'product',
				meta: { title: lang == 'en' ? 'Product' : '产品管理', hidden: false, icon: h(BoxPlotOutlined), permission: 'productManager' },
				children: [
					{
						name: 'statistics',
						path: 'statistics',
						meta: { title: lang == 'zh' ? '商品统计' : 'Product Statistics', permission: 'productStatistics' },
						component: () => import('../views/product/statistics.vue'),
					},
					{
						name: 'productList',
						path: 'list',
						meta: { title: lang == 'zh' ? '商品列表' : 'Product List', permission: 'productList' },
						component: () => import('../views/product/index.vue'),
					},
					{
						name: 'productCategory',
						path: 'category',
						meta: { title: lang == 'zh' ? '商品分类' : 'Product Category', permission: 'productCategory' },
						component: () => import('../views/product/category.vue'),
					},
					{
						name: 'productCreate',
						path: 'create',
						meta: { title: lang == 'zh' ? '新增商品' : 'Create Product', hidden: true, permission: 'productCreate' },
						component: () => import('../views/product/create.vue'),
					},
				],
			},
			{
				name: 'articleIndex',
				path: 'content',
				meta: { title: lang == 'en' ? 'Content' : '内容管理', hidden: false, icon: h(BookOutlined), permission: 'contentManager' },
				children: [
					{
						name: 'article',
						path: 'article/list',
						meta: { title: lang == 'en' ? 'Articles' : '文章列表', permission: 'articleList' },
						component: () => import('../views/article/index.vue'),
					},
					{
						name: 'create',
						path: 'article/create',
						meta: { title: lang == 'en' ? 'Create' : '发布文章', hidden: true, permission: 'articleCreate' },
						component: () => import('../views/article/create.vue'),
					},
					{
						name: 'category',
						path: 'article/category',
						meta: { title: lang == 'en' ? 'Category' : '分类', hidden: false, permission: 'articleCategory' },
						component: () => import('../views/article/category.vue'),
					},
				],
			},
			{
				name: 'marketing',
				path: 'marketing',
				meta: { title: lang == 'en' ? 'Marketing' : '营销', hidden: false, icon: h(BookOutlined), permission: 'marketing' },
				children: [
					{
						name: 'index',
						path: 'index',
						meta: { title: lang == 'en' ? 'Coupon List' : '优惠券列表', permission: 'couponList' },
						component: () => import('../views/coupon/index.vue'),
					},
				],
			},
			{
				name: 'supplyIndex',
				path: 'supply',
				meta: { title: lang == 'en' ? 'Supply Manager' : '供应商管理', hidden: false, icon: h(BoxPlotOutlined), permission: 'supplyManager' },
				children: [
					{
						name: 'supply',
						path: 'list',
						meta: { title: lang == 'en' ? 'Supply' : '供应商', permission: 'supplyList' },
						component: () => import('../views/supply/index.vue'),
					},
				],
			},
			{
				name: 'lvl',
				path: 'lvl',
				meta: { title: lang == 'en' ? 'LVL' : 'LVL', icon: h(DollarCircleOutlined), permission: 'lvl' },
				children: [
					{
						name: 'lvlproduct',
						path: 'product',
						meta: { title: lang == 'en' ? 'Product' : '产品', permission: 'lvlproduct' },
						component: () => import('../views/lvl/product/index.vue'),
					},
					{
						name: 'createProduct',
						path: 'product/create',
						meta: { title: lang == 'en' ? 'Product' : '产品', hidden: true, permission: 'lvlproductcreate' },
						component: () => import('../views/lvl/product/create.vue'),
					},
				],
			},
			{
				name: 'setting',
				path: 'setting',
				meta: { title: lang == 'en' ? 'Settings' : '设置', hidden: false, icon: h(SettingOutlined), permission: 'setting' },
				children: [
					{
						name: 'basic',
						path: 'basic',
						meta: { title: lang == 'en' ? 'Basic Setting' : '基础设置', permission: 'basicSetting' },
						component: () => import('../views/settings/basic.vue'),
					},
					{
						name: 'ai',
						path: 'ai',
						meta: { title: lang == 'en' ? 'AI Setting' : 'AI管理', permission: 'aiSetting' },
						children: [
							{
								name: 'aiConfig',
								path: 'config',
								meta: { title: lang == 'en' ? 'AI Config' : 'AI配置', permission: 'aiConfig' },
								component: () => import('../views/settings/ai/config.vue'),
							},
							{
								name: 'creativity',
								path: 'creativity',
								meta: { title: lang == 'en' ? 'Creativity' : '创意管理', permission: 'creativity' },
								component: () => import('../views/settings/ai/creativity.vue'),
							},
						],
					},
					{
						name: 'auth',
						path: 'auth',
						meta: { title: lang == 'en' ? 'Permission' : '权限管理', permission: 'permissionManager' },
						children: [
							{
								name: 'permission',
								path: 'permission',
								meta: { title: lang == 'en' ? 'Permission' : '权限管理', permission: 'permission' },
								component: () => import('../views/auth/permission.vue'),
							},
							{
								name: 'role',
								path: 'role',
								meta: { title: lang == 'en' ? 'Role' : '角色管理', permission: 'roleManager' },
								component: () => import('../views/auth/role.vue'),
							},
						],
					},
					{
						name: 'quotationConfigure',
						path: 'quotation',
						meta: { title: lang == 'en' ? 'Quotation Configure' : '报价配置', permission: 'quotationConfigure' },
						component: () => import('../views/quotes/configure.vue'),
					},
					{
						name: 'cnc',
						path: 'cnc',
						meta: { title: lang == 'en' ? 'CNC Model' : 'CNC模型管理', permission: 'cncModel' },
						component: () => import('../views/settings/cnc.vue'),
					},

					{
						name: 'shipping',
						path: 'shipping',
						meta: { title: lang == 'zh' ? '运费模板' : 'Shipping', permission: 'shipping' },
						component: () => import('../views/shipping/index.vue'),
					},
					{
						name: 'xml',
						path: 'xml',
						meta: { title: lang == 'zh' ? '站点地图' : 'XML', permission: 'xml' },
						component: () => import('../views/xml/index.vue'),
					},
				],
			},
		],
	},
	{
		path: '/auth/login',
		name: 'authlogin',
		component: () => import('../views/auth/login.vue'),
		meta: { title: 'Login' },
	},
	{
		path: '/:catchAll(.*)', // 捕获所有未匹配的路由
		name: 'NotFound',
		component: BaseLayout,
		children: [
			{
				path: '/:catchAll(.*)',
				component: () => import('../views/error/404.vue'),
			},
		],
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
