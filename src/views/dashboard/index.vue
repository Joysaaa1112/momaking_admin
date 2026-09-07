<template>
	<div class="body-container">
		<a-row :gutter="16" class="mb24">
			<a-col :span="6">
				<a-card class="mk-card">
					<div class="chartCard">
						<div class="chartTop">
							<div class="metaWrap">
								<div class="meta">
									<span>销售额</span>
									<span class="action">
										<a-tag color="green">今日</a-tag>
									</span>
								</div>
								<span class="total">
									<span class="symbol">￥</span>
									<span class="value">{{ data.main.sales.state.today }}</span>
								</span>
							</div>
						</div>
						<div class="content">
							<div class="contentFixed">
								<div class="trendItem">
									<span>
										昨日
										<span class="trendText">{{ data.main.sales.state.yesterday }}</span>
									</span>
								</div>
								<div class="trendItem">
									<span>
										日环比
										<span class="trendText">{{ data.main.sales.state.rate }}%</span>
									</span>
								</div>
							</div>
						</div>
						<div class="footer">
							<div class="field">
								<span class="label">本月销售额</span>
								<span class="number">￥{{ data.main.sales.state.month }}</span>
							</div>
						</div>
					</div>
				</a-card>
			</a-col>
			<a-col :span="6">
				<a-card class="mk-card">
					<div class="chartCard">
						<div class="chartTop">
							<div class="metaWrap">
								<div class="meta">
									<span>用户访问量</span>
									<span class="action">
										<a-tag color="green">今日</a-tag>
									</span>
								</div>
								<span class="total">
									<span class="value">{{ data.main.visitor.state.todayPv }}</span>
								</span>
							</div>
						</div>
						<div class="content">
							<div class="contentFixed">
								<div class="chart-container">
									<div class="chart" id="chart1" style="height: 46px"></div>
								</div>
							</div>
						</div>
						<div class="footer flex">
							<div class="field">
								<span class="label">今日访问人数</span>
								<span class="number">{{ data.main.visitor.state.todayUv }}</span>
							</div>
							<div class="field">
								<a class="link" @click="handleViewDetail">查看详情</a>
							</div>
						</div>
					</div>
				</a-card>
			</a-col>
			<a-col :span="6">
				<a-card class="mk-card">
					<div class="chartCard">
						<div class="chartTop">
							<div class="metaWrap">
								<div class="meta">
									<span>订单量</span>
									<span class="action">
										<a-tag color="green">今日</a-tag>
									</span>
								</div>
								<span class="total">
									<span class="value">{{ data.main.order.state.count }}</span>
								</span>
							</div>
						</div>
						<div class="content">
							<div class="contentFixed">
								<div class="trendItem">
									<span>
										昨日
										<span class="trendText">{{ data.main.order.state.yesterday }}</span>
									</span>
								</div>
								<div class="trendItem">
									<span>
										日同比
										<span class="trendText">{{ data.main.order.state.rate }}%</span>
									</span>
								</div>
							</div>
						</div>
						<div class="footer">
							<div class="field">
								<span class="label">今日支付</span>
								<span class="number">{{ data.main.order.state.pay_count }}</span>
							</div>
							<div class="field">
								<span class="label">本月订单</span>
								<span class="number">{{ data.main.order.state.month }}</span>
							</div>
						</div>
					</div>
				</a-card>
			</a-col>
			<a-col :span="6">
				<a-card class="mk-card">
					<div class="chartCard">
						<div class="chartTop">
							<div class="metaWrap">
								<div class="meta">
									<span>新增用户</span>
								</div>
								<span class="total">
									<span class="value">{{ data.main.user.state.count }}</span>
								</span>
							</div>
						</div>
						<div class="content">
							<div class="contentFixed">
								<div class="trendItem">
									<span>
										昨日
										<span class="trendText">{{ data.main.user.state.yesterday }}</span>
									</span>
								</div>
								<div class="trendItem">
									<span>
										日同比
										<span class="trendText">{{ data.main.user.state.rate }}%</span>
									</span>
								</div>
							</div>
						</div>
						<div class="footer">
							<div class="field">
								<span class="label">本月用户</span>
								<span class="number">{{ data.main.user.state.month }}</span>
							</div>
						</div>
					</div>
				</a-card>
			</a-col>
		</a-row>
		<a-row :gutter="16" class="mb24">
			<a-col :span="6">
				<a-list bordered class="mk-card" :data-source="data.main.feedback.source">
					<template #renderItem="{ item }">
						<a-list-item>
							<a-list-item-meta>
								<template #title>
									<span style="padding-right: 4px">{{ item.name }}</span>
									<span>{{ item.contact }}</span>
								</template>
								<template #description>
									<span style="padding-right: 4px">{{ item.content }}</span>
									<span>{{ item.create_time }}</span>
								</template>
							</a-list-item-meta>
						</a-list-item>
					</template>
					<template #header>
						<div>网站留言</div>
					</template>
				</a-list>
			</a-col>
			<a-col :span="6">
				<a-list bordered class="mk-card" :data-source="data.main.merchants.source">
					<template #renderItem="{ item }">
						<a-list-item>
							<a-list-item-meta>
								<template #title>
									<span style="padding-right: 4px">{{ item.company_name }}</span>
									<span>{{ item.contact }}</span>
								</template>
								<template #description>
									<span style="padding-right: 4px">{{ item.advantages }}</span>
									<span>{{ item.create_time }}</span>
								</template>
							</a-list-item-meta>
						</a-list-item>
					</template>
					<template #header>
						<div>入驻申请</div>
					</template>
				</a-list>
			</a-col>
			<a-col :span="6">
				<a-list bordered class="mk-card" :data-source="data.main.message.source">
					<template #renderItem="{ item }">
						<a-list-item>
							<a-list-item-meta>
								<template #title>
									<span style="padding-right: 4px">{{ item.type == 1 ? '国际站' : '中文站' }}</span>
									<span>{{ item.contact }} - {{ item.first_name }} {{ item.last_name }}</span>
								</template>
								<template #description>
									<span style="padding-right: 4px">{{ item.message }}</span>
									<br />
									<span>{{ item.create_time }}</span>
								</template>
							</a-list-item-meta>
						</a-list-item>
					</template>
					<template #header>
						<div>消息留言</div>
					</template>
				</a-list>
			</a-col>
		</a-row>
		<!-- <a-row>
			<a-col :span="12">
				<a-card :title="'数据统计'">
					<a-row>
						<a-col :span="4">
							<a-statistic title="今日注册" :value="data.main.statistics.state.today_count" />
						</a-col>
						<a-col :span="4">
							<a-statistic title="7天注册" :value="data.main.statistics.state.seven_days_count" />
						</a-col>
						<a-col :span="4">
							<a-statistic title="30天注册" :value="data.main.statistics.state.month_count" />
						</a-col>
						<a-col :span="3">
							<a-statistic title="今日支付" :value="data.main.statistics.state.today_pay_order_count" />
						</a-col>
						<a-col :span="3">
							<a-statistic title="今日订单" :value="data.main.statistics.state.today_order_count" />
						</a-col>
						<a-col :span="3">
							<a-statistic title="7天支付" :value="data.main.statistics.state.seven_days_pay_order_count" />
						</a-col>
						<a-col :span="3">
							<a-statistic title="7天订单" :value="data.main.statistics.state.seven_days_order_count" />
						</a-col>
					</a-row>
				</a-card>
			</a-col>
		</a-row> -->
		<a-modal v-model:open="data.main.visitor.modal.visible" title="访问详情" :footer="null" :width="850">
			<div class="form-content">
				<a-space :size="12" class="mb16">
					<a-range-picker v-model:value="data.main.visitor.modal.date" :format="data.dateFormat" @change="handleDateChange" />
					<a-button type="primary" @click="handleRecordSearch">查询</a-button>
				</a-space>
				<a-table
					:columns="data.main.visitor.modal.columns"
					:data-source="data.main.visitor.modal.source"
					:pagination="data.main.visitor.modal.pagination"
					:loading="data.main.visitor.modal.loading"
					@change="handleRecordTableChange" />
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { onBeforeMount, onMounted, ref } from 'vue'
	import { useUserStore } from '@/store/modules/user'
	import defaultAvatar from '@/assets/images/m.png'
	import { statisticsApi } from '@/api/dashboard'
	import * as echarts from 'echarts'
	import { orderApi, salesApi, userApi, visitorApi, recordApi } from '@/api/statistics'
	import { feedbackListApi, merchantsApi, messageApi } from '@/api/index'
	import dayjs from 'dayjs'

	const data = ref({
		lang: localStorage.getItem('lang') || 'zh',
		userInfo: {},
		dateFormat: 'YYYY-MM-DD',
		main: {
			welcomeText: '',
			statistics: {
				loading: false,
				state: {},
			},
			visitor: {
				loading: false,
				state: {
					todayPv: 0,
					todayUv: 0,
					chart: {
						xAxis: [],
						series: [],
					},
				},
				modal: {
					date: [],
					start_time: '',
					end_time: '',
					visible: false,
					loading: false,
					source: [],
					columns: [
						{
							title: 'IP',
							dataIndex: 'ip',
							key: 'ip',
						},
						{
							title: '设备',
							dataIndex: 'device',
							key: 'device',
						},
						{
							title: '语言',
							dataIndex: 'lang',
							key: 'lang',
						},
						{
							title: '访问页面',
							dataIndex: 'pathname',
							key: 'pathname',
							ellipsis: true,
						},
						{
							title: '来源',
							dataIndex: 'source',
							key: 'source',
						},
						{
							title: '访问时间',
							dataIndex: 'create_time',
							key: 'create_time',
						},
					],
					pagination: {
						current: 1,
						pageSize: 8,
						total: 0,
					},
				},
			},
			sales: {
				loading: false,
				state: {
					today: 0,
					yesterday: 0,
					month: 0,
					rate: 0,
				},
			},
			order: {
				loading: false,
				state: {
					count: 0,
					pay_count: 0,
					yesterday: 0,
					month: 0,
					rate: 0,
				},
			},
			user: {
				loading: false,
				state: {
					count: 0,
					yesterday: 0,
					month: 0,
					rate: 0,
				},
			},
			feedback: {
				loading: false,
				source: [],
			},
			merchants: {
				loading: false,
				source: [],
			},
			message: {
				loading: false,
				source: [],
			},
		},
	})

	const getStatistics = () => {
		data.value.main.statistics.loading = true
		statisticsApi()
			.then((res) => {
				if (res.code == 0) {
					data.value.main.statistics.state = res.data
				}
			})
			.finally(() => {
				data.value.main.statistics.loading = false
			})
	}

	const getTimeOfDayGreeting = () => {
		const now = new Date()
		const hours = now.getHours()
		const lang = data.value.lang

		if (hours >= 0 && hours < 6) {
			return lang === 'en' ? "It's late at night. Have a peaceful night!" : '夜深了，晚安，祝你有个宁静的夜晚！'
		} else if (hours >= 6 && hours < 9) {
			return lang === 'en' ? 'Good morning! Hope you have an energetic day ahead!' : '早上好，今天又是元气满满的一天！'
		} else if (hours >= 9 && hours < 12) {
			return lang === 'en' ? 'Good morning! Keep up the good work!' : '上午好，继续加油哦！'
		} else if (hours >= 12 && hours < 14) {
			return lang === 'en' ? 'Good afternoon! Enjoy your lunch!' : '中午好，享受你的午餐吧！'
		} else if (hours >= 14 && hours < 18) {
			return lang === 'en' ? 'Good afternoon! Hope your day is going well!' : '下午好，希望你今天过得愉快！'
		} else if (hours >= 18 && hours < 23) {
			return lang === 'en' ? 'Good evening! Time to relax and unwind!' : '晚上好，放松一下吧！'
		} else {
			return lang === 'en' ? "It's getting late. Have a good rest!" : '天快亮了，好好休息吧！'
		}
	}

	const initChat1 = (data) => {
		const chat = echarts.init(document.getElementById('chart1'))

		// 图表的配置
		const options = {
			tooltip: {
				trigger: 'axis',
			},
			xAxis: {
				show: false,
				type: 'category',
				boundaryGap: false,
				data: data.xAxis,
			},
			yAxis: {
				type: 'value',
				show: false,
			},
			series: [
				{
					data: data.series,
					type: 'line',
					smooth: 0.6,
					// 面积图
					areaStyle: {
						color: 'rgba(90, 117, 200)',
					},
				},
			],
			grid: {
				top: 1,
				right: 1,
				bottom: 1,
				left: 1,
			},
		}

		// 设置图表选项
		chat.setOption(options)

		// 动态调整图表尺寸
		chat.resize()
	}

	onBeforeMount(() => {
		data.value.main.welcomeText = getTimeOfDayGreeting()
		const userStore = useUserStore()
		data.value.userInfo = userStore.currentUser
		getStatistics()
	})

	const getVisitorData = () => {
		const payload = {
			site_id: 1,
		}
		visitorApi(payload).then((res) => {
			if (res.code == 0) {
				console.log(typeof res.data.pv)
				// 对象
				const pv = Object.entries(res.data.pv).map(([key, value]) => ({
					date: key,
					pv: value,
				}))
				data.value.main.visitor.state.chart.xAxis = pv.map((item) => item.date)
				data.value.main.visitor.state.chart.series = pv.map((item) => item.pv)
				initChat1(data.value.main.visitor.state.chart)
				data.value.main.visitor.state.todayPv = res.data.today_pv
				data.value.main.visitor.state.todayUv = res.data.today_uv
			}
		})
	}

	const getSalesData = () => {
		salesApi({}).then((res) => {
			if (res.code == 0) {
				data.value.main.sales.state.today = res.data.sales
				data.value.main.sales.state.yesterday = res.data.yesterday
				data.value.main.sales.state.month = res.data.month
				data.value.main.sales.state.rate = res.data.daily_ratio
			}
		})
	}

	const getOrderData = () => {
		orderApi({}).then((res) => {
			if (res.code == 0) {
				data.value.main.order.state.count = res.data.count
				data.value.main.order.state.pay_count = res.data.pay_count
				data.value.main.order.state.yesterday = res.data.yesterday
				data.value.main.order.state.month = res.data.month
				data.value.main.order.state.rate = res.data.daily_ratio
			}
		})
	}

	const getUserData = () => {
		userApi({}).then((res) => {
			if (res.code == 0) {
				data.value.main.user.state.count = res.data.count
				data.value.main.user.state.yesterday = res.data.yesterday
				data.value.main.user.state.month = res.data.month
				data.value.main.user.state.rate = res.data.daily_ratio
			}
		})
	}

	const handleViewDetail = () => {
		data.value.main.visitor.modal.visible = true
		data.value.main.visitor.modal.date = [dayjs(), dayjs()]
		data.value.main.visitor.modal.start_time = dayjs().format(data.value.dateFormat + ' 00:00:00')
		data.value.main.visitor.modal.end_time = dayjs().format(data.value.dateFormat + ' 23:59:59')
		getRecordData()
	}

	const getRecordData = () => {
		data.value.main.visitor.modal.loading = true
		const payload = {
			page: data.value.main.visitor.modal.pagination.current,
			limit: data.value.main.visitor.modal.pagination.pageSize,
			start_time: data.value.main.visitor.modal.start_time,
			end_time: data.value.main.visitor.modal.end_time,
		}
		recordApi(payload)
			.then((res) => {
				if (res.code == 0) {
					data.value.main.visitor.modal.source = res.data.data
					data.value.main.visitor.modal.pagination.total = res.data.total
				}
			})
			.finally(() => {
				data.value.main.visitor.modal.loading = false
			})
	}

	const handleDateChange = (date, arr) => {
		data.value.main.visitor.modal.start_time = arr[0]
		data.value.main.visitor.modal.end_time = arr[1]
	}

	const handleRecordTableChange = (a, b, c) => {
		data.value.main.visitor.modal.pagination.current = a.current
		data.value.main.visitor.modal.pagination.pageSize = a.pageSize
		getRecordData()
	}

	const handleRecordSearch = () => {
		data.value.main.visitor.modal.pagination.current = 1
		getRecordData()
	}

	const getFeedbackList = () => {
		feedbackListApi({}).then((res) => {
			if (res.code == 0) {
				data.value.main.feedback.source = res.data
			}
		})
	}

	const getMerchantsList = () => {
		merchantsApi({}).then((res) => {
			if (res.code == 0) {
				data.value.main.merchants.source = res.data
			}
		})
	}

	const getMessageList = () => {
		data.value.main.message.loading = true
		messageApi({})
			.then((res) => {
				if (res.code == 0) {
					data.value.main.message.source = res.data
				}
			})
			.finally(() => {
				data.value.main.message.loading = false
			})
	}

	onMounted(() => {
		getVisitorData()
		getSalesData()
		getOrderData()
		getUserData()
		getFeedbackList()
		getMerchantsList()
		getMessageList()
	})
</script>
<style lang="scss" scoped>
	.chart-container {
		height: 46px;
		.chart {
			height: 100%;
		}
	}
	.welcome {
		display: flex;
		align-items: center;
		.content {
			margin-left: 16px;
			h1 {
				margin-bottom: 12px;
				color: rgba(0, 0, 0, 0.88);
				font-weight: 500;
				font-size: 20px;
				line-height: 28px;
			}
			p {
				margin: 0;
			}
		}
	}
	.mk-card {
		background-color: #fff;
		border: 0;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
		:deep(.ant-card-body) {
			padding: 20px 24px 8px;
		}
	}
	.chartCard {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol', 'Noto Color Emoji';
		.chartTop {
			position: relative;
			width: 100%;
			overflow: hidden;
			.avatar {
				position: relative;
				top: 4px;
				float: left;
				margin-right: 20px;
			}
			.metaWrap {
				float: left;
				.meta {
					height: 22px;
					color: rgba(0, 0, 0, 0.65);
					font-size: 14px;
					line-height: 22px;
					.action {
						position: absolute;
						top: 4px;
						right: 0;
						line-height: 1;
						cursor: pointer;
					}
					.actions {
						position: absolute;
						top: -4px;
						right: 0;
						line-height: 1;
						cursor: pointer;
						display: flex;
						flex-wrap: wrap;
						gap: 8px;
					}
				}
				.total {
					height: 38px;
					margin-top: 4px;
					margin-bottom: 0;
					overflow: hidden;
					color: rgba(0, 0, 0, 0.88);
					font-size: 30px;
					line-height: 38px;
					white-space: nowrap;
					text-overflow: ellipsis;
					word-break: break-all;
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
						'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
					.symbol {
						font-size: 20px;
					}
				}
			}
		}
		.content {
			position: relative;
			width: 100%;
			height: 46px;
			.contentFixed {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				.trendItem {
					display: inline-block;
					font-size: 14px;
					line-height: 22px;
					margin-right: 16px;
					&:last-child {
						margin-right: 0;
					}
				}
			}
		}
		.footer {
			margin-top: 8px;
			padding-top: 9px;
			border-top: 1px solid rgba(5, 5, 5, 0.06);
			.field {
				display: inline-flex;
				justify-content: space-between;
				align-items: center;
				margin-right: 8px;
				&:last-child {
					margin-right: 0;
				}
				.label {
					color: rgba(0, 0, 0, 0.45);
					font-size: 14px;
					margin-right: 8px;
				}
				.number {
					color: rgba(0, 0, 0, 0.85);
					font-size: 14px;
				}
			}
		}
	}
	.green {
		color: #18ff3e;
	}
	.form-content {
		padding: 12px 0;
	}
	:deep(.ant-pagination-item-ellipsis) {
		display: inline-flex !important;
	}
</style>
