<template>
	<div class="body-container">
		<!-- 页头 -->
		<div class="page-head mb16">
			<div class="page-head-text">
				<h2>运营概览</h2>
				<p>
					数据更新于 {{ data.updatedAt || '—' }}
					<span class="divider">·</span>
					统计口径为自然日
				</p>
			</div>
			<a-space>
				<a-button @click="goAnalytics">访问统计</a-button>
				<a-button type="primary" :loading="data.loading" @click="loadAll">
					<template #icon><ReloadOutlined /></template>
					刷新
				</a-button>
			</a-space>
		</div>

		<!-- 核心指标 -->
		<a-row :gutter="16" class="mb16">
			<a-col v-for="card in kpiCards" :key="card.key" :span="6">
				<a-card class="mk-card" :loading="card.loading">
					<div class="kpi">
						<div class="kpi-head">
							<span class="kpi-label">{{ card.label }}</span>
							<a-tag color="blue" class="kpi-tag">今日</a-tag>
						</div>
						<div class="kpi-value">
							<span v-if="card.symbol" class="kpi-symbol">{{ card.symbol }}</span>{{ card.value }}
						</div>
						<div class="kpi-delta">
							<span class="muted">较昨日</span>
							<span :class="growthClass(card.growth)">
								<template v-if="card.growth === null">—</template>
								<template v-else>
									<ArrowUpOutlined v-if="card.growth > 0" />
									<ArrowDownOutlined v-else-if="card.growth < 0" />
									{{ Math.abs(card.growth) }}%
								</template>
							</span>
							<span class="muted kpi-prev">昨日 {{ card.prev }}</span>
						</div>
						<div class="kpi-foot">
							<span v-for="field in card.fields" :key="field.label" class="kpi-field">
								<span class="muted">{{ field.label }}</span>
								<span class="kpi-field-value">{{ field.value }}</span>
							</span>
							<a v-if="card.link" @click="card.link.onClick">{{ card.link.text }}</a>
						</div>
					</div>
				</a-card>
			</a-col>
		</a-row>

		<a-row :gutter="16" class="mb16">
			<!-- 访问趋势 -->
			<a-col :span="16">
				<a-card class="mk-card card-flat" title="访问趋势">
					<template #extra><span class="muted">近 7 天浏览量 PV</span></template>
					<a-spin :spinning="data.main.visitor.loading">
						<div ref="trendRef" class="trend-chart"></div>
						<a-empty
							v-if="!data.main.visitor.state.chart.xAxis.length && !data.main.visitor.loading"
							class="trend-empty"
							:image="simpleImage"
							description="暂无访问数据" />
					</a-spin>
				</a-card>
			</a-col>
			<!-- 注册与订单 -->
			<a-col :span="8">
				<a-card class="mk-card card-flat" title="注册与订单" :loading="data.main.statistics.loading">
					<div class="matrix">
						<div class="matrix-row matrix-head">
							<span>指标</span>
							<span>今日</span>
							<span>近 7 天</span>
							<span>本月</span>
						</div>
						<div v-for="row in overviewRows" :key="row.label" class="matrix-row">
							<span class="matrix-label">{{ row.label }}</span>
							<span>{{ cellText(row.today) }}</span>
							<span>{{ cellText(row.week) }}</span>
							<span>{{ cellText(row.month) }}</span>
						</div>
					</div>
					<div class="matrix-foot">
						<span class="muted">今日支付转化率</span>
						<span class="matrix-foot-value">{{ payRate }}</span>
					</div>
				</a-card>
			</a-col>
		</a-row>

		<!-- 待处理信息 -->
		<a-row :gutter="16">
			<a-col v-for="panel in panels" :key="panel.key" :span="8">
				<a-card class="mk-card card-flat" :title="panel.title" :loading="panel.loading">
					<template #extra>
						<span class="muted">{{ panel.items.length }} 条</span>
					</template>
					<div class="panel-body">
						<div v-for="item in panel.items" :key="item.id" class="panel-item">
							<div class="panel-item-head">
								<span class="panel-item-title">
									<a-tag v-if="item.tag" color="blue">{{ item.tag }}</a-tag>
									{{ item.title || '匿名' }}
									<span v-if="item.subtitle" class="muted panel-item-sub">{{ item.subtitle }}</span>
								</span>
								<a-tooltip :title="item.time">
									<span class="muted panel-item-time">{{ formatTime(item.time) }}</span>
								</a-tooltip>
							</div>
							<a-tooltip :title="item.content">
								<div class="panel-item-content">{{ item.content || '（无内容）' }}</div>
							</a-tooltip>
						</div>
						<a-empty v-if="!panel.items.length && !panel.loading" :image="simpleImage" description="暂无数据" />
					</div>
				</a-card>
			</a-col>
		</a-row>

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
					size="small"
					@change="handleRecordTableChange" />
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
	import { useRouter } from 'vue-router'
	import { Empty } from 'ant-design-vue'
	import { ArrowDownOutlined, ArrowUpOutlined, ReloadOutlined } from '@ant-design/icons-vue'
	import * as echarts from 'echarts'
	import dayjs from 'dayjs'
	import { statisticsApi } from '@/api/dashboard'
	import { orderApi, salesApi, userApi, visitorApi, recordApi } from '@/api/statistics'
	import { feedbackListApi, merchantsApi, messageApi } from '@/api/index'

	const router = useRouter()
	const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
	const trendRef = ref(null)
	let trendChart = null
	let trendObserver = null

	const data = ref({
		dateFormat: 'YYYY-MM-DD',
		updatedAt: '',
		loading: false,
		main: {
			statistics: {
				loading: false,
				state: {},
			},
			visitor: {
				loading: false,
				state: {
					todayPv: 0,
					todayUv: 0,
					yesterdayPv: null,
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
						{ title: 'IP', dataIndex: 'ip', key: 'ip', width: 130 },
						{ title: '设备', dataIndex: 'device', key: 'device', ellipsis: true },
						{ title: '语言', dataIndex: 'lang', key: 'lang', width: 80 },
						{ title: '访问页面', dataIndex: 'pathname', key: 'pathname', ellipsis: true },
						{ title: '来源', dataIndex: 'source', key: 'source', ellipsis: true },
						{ title: '访问时间', dataIndex: 'create_time', key: 'create_time', width: 160 },
					],
					pagination: {
						current: 1,
						pageSize: 8,
						total: 0,
						showTotal: (total) => `共 ${total} 条`,
					},
				},
			},
			sales: {
				loading: false,
				state: { today: 0, yesterday: 0, month: 0, rate: null },
			},
			order: {
				loading: false,
				state: { count: 0, pay_count: 0, yesterday: 0, month: 0, rate: null },
			},
			user: {
				loading: false,
				state: { count: 0, yesterday: 0, month: 0, rate: null },
			},
			feedback: { loading: false, source: [] },
			merchants: { loading: false, source: [] },
			message: { loading: false, source: [] },
		},
	})

	function formatNumber(value) {
		return Number(value || 0).toLocaleString('en-US')
	}

	function formatMoney(value) {
		return Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	}

	/** 后端没返回的指标显示占位符，不要拿 0 充数误导判断 */
	function cellText(value) {
		if (value === null || value === undefined || value === '') return '—'
		return formatNumber(value)
	}

	/** 列表时间统一短格式，悬浮看完整时间；解析不了就原样显示 */
	function formatTime(value) {
		if (!value) return '—'
		const time = dayjs(value)
		return time.isValid() ? time.format('MM-DD HH:mm') : value
	}

	function toGrowth(value) {
		if (value === null || value === undefined || value === '') return null
		const num = Number(value)
		return Number.isNaN(num) ? null : num
	}

	function growthClass(value) {
		if (value === null || !value) return 'flat'
		return value > 0 ? 'up' : 'down'
	}

	const payRate = computed(() => {
		const order = data.value.main.order.state
		const count = Number(order.count || 0)
		if (!count) return '—'
		return ((Number(order.pay_count || 0) / count) * 100).toFixed(1) + '%'
	})

	/** 访问量接口没给环比，用趋势数据里昨天的 PV 自己算 */
	const visitorGrowth = computed(() => {
		const state = data.value.main.visitor.state
		const yesterday = Number(state.yesterdayPv)
		if (state.yesterdayPv === null || !yesterday) return null
		return Number((((Number(state.todayPv || 0) - yesterday) / yesterday) * 100).toFixed(1))
	})

	const kpiCards = computed(() => {
		const main = data.value.main
		const sales = main.sales.state
		const visitor = main.visitor.state
		const order = main.order.state
		const user = main.user.state
		return [
			{
				key: 'sales',
				label: '销售额',
				symbol: '¥',
				value: formatMoney(sales.today),
				growth: toGrowth(sales.rate),
				prev: '¥' + formatMoney(sales.yesterday),
				loading: main.sales.loading,
				fields: [{ label: '本月销售额', value: '¥' + formatMoney(sales.month) }],
			},
			{
				key: 'visitor',
				label: '访问量 PV',
				value: formatNumber(visitor.todayPv),
				growth: visitorGrowth.value,
				prev: visitor.yesterdayPv === null ? '—' : formatNumber(visitor.yesterdayPv),
				loading: main.visitor.loading,
				fields: [{ label: '访客数 UV', value: formatNumber(visitor.todayUv) }],
				link: { text: '访问明细', onClick: handleViewDetail },
			},
			{
				key: 'order',
				label: '订单量',
				value: formatNumber(order.count),
				growth: toGrowth(order.rate),
				prev: formatNumber(order.yesterday),
				loading: main.order.loading,
				fields: [
					{ label: '今日支付', value: formatNumber(order.pay_count) },
					{ label: '本月订单', value: formatNumber(order.month) },
				],
			},
			{
				key: 'user',
				label: '新增用户',
				value: formatNumber(user.count),
				growth: toGrowth(user.rate),
				prev: formatNumber(user.yesterday),
				loading: main.user.loading,
				fields: [{ label: '本月新增', value: formatNumber(user.month) }],
			},
		]
	})

	const overviewRows = computed(() => {
		const statistics = data.value.main.statistics.state || {}
		const order = data.value.main.order.state
		return [
			{
				label: '注册用户',
				today: statistics.today_count,
				week: statistics.seven_days_count,
				month: statistics.month_count,
			},
			{
				label: '订单量',
				today: statistics.today_order_count,
				week: statistics.seven_days_order_count,
				month: order.month,
			},
			{
				label: '支付订单',
				today: statistics.today_pay_order_count,
				week: statistics.seven_days_pay_order_count,
				month: null,
			},
		]
	})

	/** 三个留言面板字段各不相同，先归一化成同一种结构，模板只写一遍 */
	const panels = computed(() => {
		const main = data.value.main
		return [
			{
				key: 'feedback',
				title: '网站留言',
				loading: main.feedback.loading,
				items: (main.feedback.source || []).map((item, index) => ({
					id: item.id || 'feedback-' + index,
					title: item.name,
					subtitle: item.contact,
					content: item.content,
					time: item.create_time,
				})),
			},
			{
				key: 'merchants',
				title: '入驻申请',
				loading: main.merchants.loading,
				items: (main.merchants.source || []).map((item, index) => ({
					id: item.id || 'merchants-' + index,
					title: item.company_name,
					subtitle: item.contact,
					content: item.advantages,
					time: item.create_time,
				})),
			},
			{
				key: 'message',
				title: '消息留言',
				loading: main.message.loading,
				items: (main.message.source || []).map((item, index) => ({
					id: item.id || 'message-' + index,
					tag: item.type == 1 ? '国际站' : '中文站',
					title: [item.first_name, item.last_name].filter(Boolean).join(' ') || item.contact,
					subtitle: item.contact,
					content: item.message,
					time: item.create_time,
				})),
			},
		]
	})

	const goAnalytics = () => router.push({ name: 'stat' })

	const renderTrend = () => {
		if (!trendRef.value) return
		if (!trendChart) trendChart = echarts.init(trendRef.value)
		const chart = data.value.main.visitor.state.chart
		trendChart.setOption({
			tooltip: { trigger: 'axis' },
			grid: { top: 16, right: 16, bottom: 24, left: 48 },
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: chart.xAxis,
				axisLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.15)' } },
				axisLabel: { color: 'rgba(0, 0, 0, 0.45)' },
			},
			yAxis: {
				type: 'value',
				minInterval: 1,
				axisLabel: { color: 'rgba(0, 0, 0, 0.45)' },
				splitLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.06)' } },
			},
			series: [
				{
					name: '浏览量 PV',
					type: 'line',
					smooth: true,
					symbolSize: 6,
					data: chart.series,
					itemStyle: { color: '#0256ff' },
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: 'rgba(2, 86, 255, 0.18)' },
							{ offset: 1, color: 'rgba(2, 86, 255, 0)' },
						]),
					},
				},
			],
		})
		trendChart.resize()
	}

	/** pv 的 key 可能是 2026-10-12 也可能是 10-12，两种都兼容；匹配不到返回 null */
	const pickPv = (list, day) => {
		const full = day.format('YYYY-MM-DD')
		const short = day.format('MM-DD')
		const hit = list.find((item) => item.date === full || item.date === short || String(item.date).endsWith(short))
		return hit ? hit.pv : null
	}

	const getStatistics = () => {
		data.value.main.statistics.loading = true
		return statisticsApi()
			.then((res) => {
				if (res.code == 0) {
					data.value.main.statistics.state = res.data || {}
				}
			})
			.finally(() => {
				data.value.main.statistics.loading = false
			})
	}

	const getVisitorData = () => {
		data.value.main.visitor.loading = true
		return visitorApi({ site_id: 1 })
			.then((res) => {
				if (res.code != 0) return
				const list = Object.entries(res.data.pv || {}).map(([date, pv]) => ({ date, pv }))
				data.value.main.visitor.state.chart.xAxis = list.map((item) => item.date)
				data.value.main.visitor.state.chart.series = list.map((item) => item.pv)
				data.value.main.visitor.state.todayPv = res.data.today_pv
				data.value.main.visitor.state.todayUv = res.data.today_uv
				data.value.main.visitor.state.yesterdayPv = pickPv(list, dayjs().subtract(1, 'day'))
				renderTrend()
			})
			.finally(() => {
				data.value.main.visitor.loading = false
			})
	}

	const getSalesData = () => {
		data.value.main.sales.loading = true
		return salesApi({})
			.then((res) => {
				if (res.code == 0) {
					data.value.main.sales.state.today = res.data.sales
					data.value.main.sales.state.yesterday = res.data.yesterday
					data.value.main.sales.state.month = res.data.month
					data.value.main.sales.state.rate = res.data.daily_ratio
				}
			})
			.finally(() => {
				data.value.main.sales.loading = false
			})
	}

	const getOrderData = () => {
		data.value.main.order.loading = true
		return orderApi({})
			.then((res) => {
				if (res.code == 0) {
					data.value.main.order.state.count = res.data.count
					data.value.main.order.state.pay_count = res.data.pay_count
					data.value.main.order.state.yesterday = res.data.yesterday
					data.value.main.order.state.month = res.data.month
					data.value.main.order.state.rate = res.data.daily_ratio
				}
			})
			.finally(() => {
				data.value.main.order.loading = false
			})
	}

	const getUserData = () => {
		data.value.main.user.loading = true
		return userApi({})
			.then((res) => {
				if (res.code == 0) {
					data.value.main.user.state.count = res.data.count
					data.value.main.user.state.yesterday = res.data.yesterday
					data.value.main.user.state.month = res.data.month
					data.value.main.user.state.rate = res.data.daily_ratio
				}
			})
			.finally(() => {
				data.value.main.user.loading = false
			})
	}

	const getFeedbackList = () => {
		data.value.main.feedback.loading = true
		return feedbackListApi({})
			.then((res) => {
				if (res.code == 0) {
					data.value.main.feedback.source = res.data || []
				}
			})
			.finally(() => {
				data.value.main.feedback.loading = false
			})
	}

	const getMerchantsList = () => {
		data.value.main.merchants.loading = true
		return merchantsApi({})
			.then((res) => {
				if (res.code == 0) {
					data.value.main.merchants.source = res.data || []
				}
			})
			.finally(() => {
				data.value.main.merchants.loading = false
			})
	}

	const getMessageList = () => {
		data.value.main.message.loading = true
		return messageApi({})
			.then((res) => {
				if (res.code == 0) {
					data.value.main.message.source = res.data || []
				}
			})
			.finally(() => {
				data.value.main.message.loading = false
			})
	}

	const loadAll = () => {
		data.value.loading = true
		Promise.allSettled([
			getStatistics(),
			getVisitorData(),
			getSalesData(),
			getOrderData(),
			getUserData(),
			getFeedbackList(),
			getMerchantsList(),
			getMessageList(),
		]).finally(() => {
			data.value.loading = false
			data.value.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
		})
	}

	const handleViewDetail = () => {
		data.value.main.visitor.modal.visible = true
		data.value.main.visitor.modal.date = [dayjs(), dayjs()]
		data.value.main.visitor.modal.start_time = dayjs().format(data.value.dateFormat + ' 00:00:00')
		data.value.main.visitor.modal.end_time = dayjs().format(data.value.dateFormat + ' 23:59:59')
		data.value.main.visitor.modal.pagination.current = 1
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

	// 原来只存了日期，查询时丢了时分秒，拿不到当天完整数据
	const handleDateChange = (date, arr) => {
		data.value.main.visitor.modal.start_time = arr[0] ? arr[0] + ' 00:00:00' : ''
		data.value.main.visitor.modal.end_time = arr[1] ? arr[1] + ' 23:59:59' : ''
	}

	const handleRecordTableChange = (pagination) => {
		data.value.main.visitor.modal.pagination.current = pagination.current
		data.value.main.visitor.modal.pagination.pageSize = pagination.pageSize
		getRecordData()
	}

	const handleRecordSearch = () => {
		data.value.main.visitor.modal.pagination.current = 1
		getRecordData()
	}

	onMounted(() => {
		loadAll()
		// 侧边栏折叠不会触发 window.resize，用 ResizeObserver 盯容器宽度
		if (trendRef.value && window.ResizeObserver) {
			trendObserver = new ResizeObserver(() => trendChart && trendChart.resize())
			trendObserver.observe(trendRef.value)
		}
	})

	onBeforeUnmount(() => {
		if (trendObserver) {
			trendObserver.disconnect()
			trendObserver = null
		}
		if (trendChart) {
			trendChart.dispose()
			trendChart = null
		}
	})
</script>
<style lang="scss" scoped>
	.page-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		.page-head-text {
			h2 {
				margin: 0;
				color: rgba(0, 0, 0, 0.88);
				font-size: 20px;
				font-weight: 600;
				line-height: 28px;
			}
			p {
				margin: 4px 0 0;
				color: rgba(0, 0, 0, 0.45);
				font-size: 13px;
			}
			.divider {
				padding: 0 6px;
				color: rgba(0, 0, 0, 0.25);
			}
		}
	}

	.mk-card {
		background-color: #fff;
		border: 0;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
		height: 100%;
		:deep(.ant-card-body) {
			padding: 20px 24px;
		}
		&.card-flat {
			:deep(.ant-card-head) {
				min-height: 48px;
				padding: 0 20px;
				border-bottom: 1px solid rgba(5, 5, 5, 0.06);
			}
			:deep(.ant-card-head-title) {
				padding: 12px 0;
				font-size: 15px;
				font-weight: 600;
			}
			:deep(.ant-card-body) {
				padding: 16px 20px;
			}
		}
	}

	.muted {
		color: rgba(0, 0, 0, 0.45);
	}

	.up {
		color: #52c41a;
	}

	.down {
		color: #ff4d4f;
	}

	.flat {
		color: rgba(0, 0, 0, 0.45);
	}

	.kpi {
		&-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		&-label {
			color: rgba(0, 0, 0, 0.65);
			font-size: 14px;
			line-height: 22px;
		}
		&-tag {
			margin: 0;
		}
		&-value {
			margin: 8px 0 6px;
			color: rgba(0, 0, 0, 0.88);
			font-size: 28px;
			font-weight: 600;
			line-height: 36px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-variant-numeric: tabular-nums;
		}
		&-symbol {
			margin-right: 2px;
			font-size: 18px;
			font-weight: 500;
		}
		&-delta {
			display: flex;
			align-items: center;
			gap: 6px;
			font-size: 13px;
			white-space: nowrap;
			overflow: hidden;
			:deep(.anticon) {
				font-size: 11px;
			}
		}
		&-prev {
			margin-left: auto;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		&-foot {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			margin-top: 12px;
			padding-top: 12px;
			border-top: 1px solid rgba(5, 5, 5, 0.06);
			font-size: 13px;
			white-space: nowrap;
		}
		&-field {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			overflow: hidden;
		}
		&-field-value {
			color: rgba(0, 0, 0, 0.85);
			font-variant-numeric: tabular-nums;
		}
	}

	.trend-chart {
		width: 100%;
		height: 268px;
	}

	// 空状态压在图表区域中间，不额外占高度
	.trend-empty {
		margin-top: -178px;
		padding-bottom: 80px;
	}

	.matrix {
		&-row {
			display: grid;
			grid-template-columns: 1fr 0.8fr 0.8fr 0.8fr;
			align-items: center;
			padding: 9px 0;
			border-bottom: 1px solid rgba(5, 5, 5, 0.06);
			font-size: 13px;
			> span:not(:first-child) {
				color: rgba(0, 0, 0, 0.85);
				text-align: right;
				font-variant-numeric: tabular-nums;
			}
			&:last-child {
				border-bottom: 0;
			}
		}
		&-head {
			color: rgba(0, 0, 0, 0.45);
			> span:not(:first-child) {
				color: rgba(0, 0, 0, 0.45);
			}
		}
		&-label {
			color: rgba(0, 0, 0, 0.65);
		}
		&-foot {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 12px;
			padding-top: 12px;
			border-top: 1px solid rgba(5, 5, 5, 0.06);
			font-size: 13px;
			&-value {
				color: rgba(0, 0, 0, 0.88);
				font-size: 16px;
				font-weight: 600;
				font-variant-numeric: tabular-nums;
			}
		}
	}

	.panel-body {
		height: 300px;
		margin: -4px -6px -4px 0;
		padding-right: 6px;
		overflow-y: auto;
	}

	.panel-item {
		padding: 10px 0;
		border-bottom: 1px solid rgba(5, 5, 5, 0.06);
		&:last-child {
			border-bottom: 0;
		}
		&-head {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			gap: 8px;
		}
		&-title {
			flex: 1;
			color: rgba(0, 0, 0, 0.88);
			font-size: 13px;
			font-weight: 500;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			:deep(.ant-tag) {
				margin-right: 4px;
			}
		}
		&-sub {
			margin-left: 6px;
			font-weight: 400;
		}
		&-time {
			flex: none;
			font-size: 12px;
			font-variant-numeric: tabular-nums;
		}
		&-content {
			margin-top: 2px;
			color: rgba(0, 0, 0, 0.65);
			font-size: 13px;
			line-height: 20px;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	.form-content {
		padding: 12px 0;
	}

	:deep(.ant-pagination-item-ellipsis) {
		display: inline-flex !important;
	}
</style>
