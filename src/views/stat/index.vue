<template>
	<div class="body-container">
		<!-- 筛选条件 -->
		<a-card class="mb16">
			<a-space wrap>
				<a-radio-group v-model:value="state.quick" button-style="solid" @change="onQuickChange">
					<a-radio-button value="today">今日</a-radio-button>
					<a-radio-button value="yesterday">昨日</a-radio-button>
					<a-radio-button value="7">近 7 天</a-radio-button>
					<a-radio-button value="30">近 30 天</a-radio-button>
				</a-radio-group>
				<a-range-picker v-model:value="state.range" :allow-clear="false" @change="onRangeChange" />
				<a-select v-model:value="state.siteId" style="width: 140px" @change="loadAll">
					<a-select-option :value="''">全部站点</a-select-option>
					<a-select-option :value="1">momaking.com</a-select-option>
					<a-select-option :value="2">momaking.cn</a-select-option>
				</a-select>
				<a-button type="primary" :loading="state.loading" @click="loadAll">刷新</a-button>
			</a-space>
		</a-card>

		<!-- 概览指标 -->
		<a-row :gutter="16" class="mb16">
			<a-col v-for="card in cards" :key="card.key" :span="4">
				<a-card class="mk-card" :loading="state.loading">
					<div class="metric">
						<div class="metric-label">{{ card.label }}</div>
						<div class="metric-value">{{ card.value }}</div>
						<div class="metric-growth">
							<span v-if="card.growth === null || card.growth === undefined" class="flat">较上期 —</span>
							<span v-else :class="growthClass(card.growth, card.invert)">
								较上期 {{ card.growth > 0 ? '+' : '' }}{{ card.growth }}%
							</span>
						</div>
					</div>
				</a-card>
			</a-col>
		</a-row>

		<!-- 访问趋势 -->
		<a-card title="访问趋势" class="mb16">
			<a-spin :spinning="state.loading">
				<div ref="trendRef" class="chart"></div>
			</a-spin>
		</a-card>

		<a-row :gutter="16" class="mb16">
			<!-- 报价漏斗 -->
			<a-col :span="9">
				<a-card title="报价转化漏斗" :loading="state.loading" style="height: 100%">
					<div v-for="(step, index) in state.funnel" :key="step.event_type" class="funnel-step">
						<div class="funnel-head">
							<span class="funnel-name">{{ index + 1 }}. {{ step.name }}</span>
							<span class="funnel-visitors">{{ formatNumber(step.visitors) }} 人</span>
						</div>
						<a-progress :percent="step.total_rate || 0" :show-info="false" :stroke-width="10" />
						<div class="funnel-rate">
							<span>占入口 {{ step.total_rate === null ? '—' : step.total_rate + '%' }}</span>
							<span v-if="index > 0" :class="stepRateClass(step.step_rate)">
								上一步转化 {{ step.step_rate === null ? '—' : step.step_rate + '%' }}
							</span>
						</div>
					</div>
					<a-empty v-if="!state.funnel.length" :image="simpleImage" description="暂无数据" />
				</a-card>
			</a-col>

			<!-- 维度排行 -->
			<a-col :span="15">
				<a-card title="维度排行" style="height: 100%">
					<a-tabs v-model:activeKey="state.dimension" size="small" @change="loadRanking">
						<a-tab-pane v-for="item in dimensions" :key="item.key" :tab="item.label" />
					</a-tabs>
					<a-table
						:columns="rankingColumns"
						:data-source="state.ranking"
						:loading="state.rankingLoading"
						:pagination="false"
						:scroll="{ y: 320 }"
						row-key="name"
						size="small"
					>
						<template #bodyCell="{ column, record }">
							<template v-if="column.dataIndex === 'name'">
								<a-tooltip :title="record.name">
									<span class="ellipsis">{{ record.name || '(空)' }}</span>
								</a-tooltip>
							</template>
							<template v-else-if="column.dataIndex === 'ratio'">
								<a-progress :percent="record.ratio" size="small" :format="(p) => p + '%'" />
							</template>
						</template>
					</a-table>
				</a-card>
			</a-col>
		</a-row>

		<!-- 事件明细 -->
		<a-card title="事件明细">
			<template #extra>
				<a-space>
					<a-input
						v-model:value="state.eventFilter.event_type"
						placeholder="事件类型，如 quote_price_view"
						allow-clear
						style="width: 220px"
						@press-enter="reloadEvents"
					/>
					<a-input
						v-model:value="state.eventFilter.visitor_id"
						placeholder="访客ID"
						allow-clear
						style="width: 200px"
						@press-enter="reloadEvents"
					/>
					<a-button @click="reloadEvents">查询</a-button>
				</a-space>
			</template>
			<a-table
				:columns="eventColumns"
				:data-source="state.events"
				:loading="state.eventsLoading"
				:pagination="pagination"
				row-key="id"
				size="small"
				:scroll="{ x: 1400 }"
				@change="onEventsTableChange"
			>
				<template #bodyCell="{ column, record }">
					<template v-if="column.dataIndex === 'event_name'">
						<a-tag :color="categoryColor(record.event_category)">{{ record.event_name }}</a-tag>
					</template>
					<template v-else-if="column.dataIndex === 'visitor_id'">
						<a class="mono" @click="filterByVisitor(record.visitor_id)">{{ record.visitor_id.slice(0, 10) }}…</a>
					</template>
					<template v-else-if="column.dataIndex === 'device'">
						{{ [record.device_type, record.browser, record.os].filter(Boolean).join(' / ') }}
					</template>
					<template v-else-if="column.dataIndex === 'props'">
						<a-tooltip v-if="record.props" :title="JSON.stringify(record.props)">
							<span class="ellipsis mono">{{ JSON.stringify(record.props) }}</span>
						</a-tooltip>
						<span v-else>—</span>
					</template>
				</template>
			</a-table>
		</a-card>
	</div>
</template>

<script setup>
	import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
	import { Empty, message } from 'ant-design-vue'
	import * as echarts from 'echarts'
	import dayjs from 'dayjs'
	import { statEventsApi, statFunnelApi, statOverviewApi, statRankingApi, statTrendApi } from '@/api/stat'

	const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

	const dimensions = [
		{ key: 'page', label: '页面' },
		{ key: 'entry', label: '落地页' },
		{ key: 'source', label: '来源类型' },
		{ key: 'referrer', label: '来源域名' },
		{ key: 'event', label: '事件' },
		{ key: 'device', label: '设备' },
		{ key: 'browser', label: '浏览器' },
		{ key: 'os', label: '系统' },
		{ key: 'country', label: '国家' },
		{ key: 'utm_source', label: 'utm_source' },
	]

	const state = reactive({
		loading: false,
		rankingLoading: false,
		eventsLoading: false,
		quick: '7',
		range: [dayjs().subtract(6, 'day'), dayjs()],
		siteId: '',
		dimension: 'page',
		overview: { current: {}, growth: {} },
		trend: { granularity: 'day', list: [] },
		funnel: [],
		ranking: [],
		events: [],
		eventTotal: 0,
		eventFilter: { event_type: '', visitor_id: '', page: 1, size: 20 },
	})

	const trendRef = ref(null)
	let trendChart = null

	/** 日期统一转成后端要的 YYYYMMDD */
	function rangeParams() {
		return {
			site_id: state.siteId,
			start: state.range[0].format('YYYYMMDD'),
			end: state.range[1].format('YYYYMMDD'),
		}
	}

	function formatNumber(value) {
		const num = Number(value || 0)
		return num.toLocaleString('en-US')
	}

	function formatDuration(seconds) {
		const total = Math.round(Number(seconds || 0))
		if (total < 60) return total + ' 秒'
		const minute = Math.floor(total / 60)
		return minute + ' 分 ' + (total % 60) + ' 秒'
	}

	const cards = computed(() => {
		const cur = state.overview.current || {}
		const growth = state.overview.growth || {}
		return [
			{ key: 'pv', label: '浏览量 PV', value: formatNumber(cur.pv), growth: growth.pv },
			{ key: 'uv', label: '访客数 UV', value: formatNumber(cur.uv), growth: growth.uv },
			{ key: 'sessions', label: '会话数', value: formatNumber(cur.sessions), growth: growth.sessions },
			{ key: 'new_visitors', label: '新访客', value: formatNumber(cur.new_visitors), growth: growth.new_visitors },
			// 跳出率涨是坏事，颜色要反过来
			{ key: 'bounce_rate', label: '跳出率', value: (cur.bounce_rate || 0) + '%', growth: growth.bounce_rate, invert: true },
			{ key: 'avg_duration', label: '平均停留', value: formatDuration(cur.avg_duration), growth: growth.avg_duration },
		]
	})

	function growthClass(value, invert) {
		if (!value) return 'flat'
		const good = invert ? value < 0 : value > 0
		return good ? 'up' : 'down'
	}

	function stepRateClass(rate) {
		if (rate === null || rate === undefined) return 'flat'
		return rate < 30 ? 'down' : 'flat'
	}

	function categoryColor(category) {
		return (
			{ browse: 'blue', auth: 'purple', quote: 'green', order: 'gold', ai: 'cyan', lead: 'magenta', error: 'red' }[category] ||
			'default'
		)
	}

	const rankingColumns = computed(() => {
		const isEvent = state.dimension === 'event'
		return [
			{ title: '名称', dataIndex: 'name', ellipsis: true },
			isEvent
				? { title: '次数', dataIndex: 'event_count', width: 90, sorter: (a, b) => a.event_count - b.event_count }
				: { title: 'PV', dataIndex: 'pv', width: 90, sorter: (a, b) => a.pv - b.pv },
			{ title: 'UV', dataIndex: 'uv', width: 90, sorter: (a, b) => a.uv - b.uv },
			{ title: '占比', dataIndex: 'ratio', width: 140 },
		]
	})

	const eventColumns = [
		{ title: '时间', dataIndex: 'create_time', width: 160, fixed: 'left' },
		{ title: '事件', dataIndex: 'event_name', width: 170 },
		{ title: '页面', dataIndex: 'pathname', width: 200, ellipsis: true },
		{ title: '数值', dataIndex: 'value', width: 90 },
		{ title: '扩展属性', dataIndex: 'props', width: 200, ellipsis: true },
		{ title: '访客', dataIndex: 'visitor_id', width: 120 },
		{ title: '用户ID', dataIndex: 'uid', width: 90 },
		{ title: '设备', dataIndex: 'device', width: 200 },
		{ title: '来源', dataIndex: 'referrer_type', width: 100 },
		{ title: 'IP', dataIndex: 'ip', width: 130 },
	]

	const pagination = computed(() => ({
		current: state.eventFilter.page,
		pageSize: state.eventFilter.size,
		total: state.eventTotal,
		showSizeChanger: true,
		showTotal: (total) => `共 ${total} 条`,
	}))

	function onQuickChange() {
		const today = dayjs()
		const preset = {
			today: [today, today],
			yesterday: [today.subtract(1, 'day'), today.subtract(1, 'day')],
			7: [today.subtract(6, 'day'), today],
			30: [today.subtract(29, 'day'), today],
		}
		state.range = preset[state.quick] || preset[7]
		loadAll()
	}

	function onRangeChange() {
		// 手动选了日期就不再高亮快捷按钮，避免两者显示不一致
		state.quick = ''
		loadAll()
	}

	function renderTrend() {
		if (!trendRef.value) return
		if (!trendChart) trendChart = echarts.init(trendRef.value)

		const list = state.trend.list || []
		trendChart.setOption({
			tooltip: { trigger: 'axis' },
			legend: { data: ['浏览量 PV', '访客数 UV', '会话数'] },
			grid: { left: 48, right: 24, top: 40, bottom: 32 },
			xAxis: { type: 'category', data: list.map((item) => item.label), boundaryGap: false },
			yAxis: { type: 'value', minInterval: 1 },
			series: [
				{ name: '浏览量 PV', type: 'line', smooth: true, showSymbol: list.length < 40, areaStyle: { opacity: 0.08 }, data: list.map((i) => i.pv) },
				{ name: '访客数 UV', type: 'line', smooth: true, showSymbol: list.length < 40, data: list.map((i) => i.uv) },
				{ name: '会话数', type: 'line', smooth: true, showSymbol: list.length < 40, data: list.map((i) => i.sessions) },
			],
		})
		trendChart.resize()
	}

	async function loadOverview() {
		const res = await statOverviewApi(rangeParams())
		if (res && res.code === 0) state.overview = res.data
	}

	async function loadTrend() {
		const res = await statTrendApi(rangeParams())
		if (res && res.code === 0) {
			state.trend = res.data
			await nextTick()
			renderTrend()
		}
	}

	async function loadFunnel() {
		const res = await statFunnelApi(rangeParams())
		if (res && res.code === 0) state.funnel = res.data.list || []
	}

	async function loadRanking() {
		state.rankingLoading = true
		try {
			const res = await statRankingApi({ ...rangeParams(), dimension: state.dimension, limit: 20 })
			if (res && res.code === 0) state.ranking = res.data.list || []
		} finally {
			state.rankingLoading = false
		}
	}

	async function loadEvents() {
		state.eventsLoading = true
		try {
			const res = await statEventsApi({ ...rangeParams(), ...state.eventFilter })
			if (res && res.code === 0) {
				state.events = res.data.list || []
				state.eventTotal = res.data.total || 0
			}
		} finally {
			state.eventsLoading = false
		}
	}

	function reloadEvents() {
		state.eventFilter.page = 1
		loadEvents()
	}

	function onEventsTableChange(page) {
		state.eventFilter.page = page.current
		state.eventFilter.size = page.pageSize
		loadEvents()
	}

	function filterByVisitor(visitorId) {
		state.eventFilter.visitor_id = visitorId
		reloadEvents()
		message.info('已按该访客筛选，清空输入框可恢复')
	}

	async function loadAll() {
		state.loading = true
		try {
			state.eventFilter.page = 1
			await Promise.all([loadOverview(), loadTrend(), loadFunnel(), loadRanking(), loadEvents()])
		} finally {
			state.loading = false
		}
	}

	const onResize = () => trendChart && trendChart.resize()

	onMounted(() => {
		loadAll()
		window.addEventListener('resize', onResize)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', onResize)
		if (trendChart) {
			trendChart.dispose()
			trendChart = null
		}
	})
</script>

<style lang="scss" scoped>
	.mb16 {
		margin-bottom: 16px;
	}

	.chart {
		width: 100%;
		height: 320px;
	}

	.metric {
		&-label {
			color: rgba(0, 0, 0, 0.45);
			font-size: 14px;
		}

		&-value {
			margin: 6px 0 4px;
			font-size: 26px;
			font-weight: 600;
			line-height: 1.2;
		}

		&-growth {
			font-size: 12px;
		}
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

	.funnel-step {
		margin-bottom: 14px;

		.funnel-head {
			display: flex;
			justify-content: space-between;
			font-size: 13px;
		}

		.funnel-name {
			font-weight: 500;
		}

		.funnel-rate {
			display: flex;
			justify-content: space-between;
			font-size: 12px;
			color: rgba(0, 0, 0, 0.45);
		}
	}

	.ellipsis {
		display: inline-block;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: bottom;
	}

	.mono {
		font-family: 'DM Mono', Consolas, Monaco, monospace;
		font-size: 12px;
	}
</style>
