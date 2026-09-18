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

		<!-- 流量指标 -->
		<a-row :gutter="16" class="mb16">
			<a-col v-for="card in trafficCards" :key="card.key" :span="4">
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

		<!-- 业务转化指标 -->
		<a-row :gutter="16" class="mb16">
			<a-col v-for="card in conversionCards" :key="card.key" :span="4">
				<a-card class="mk-card" :loading="state.loading">
					<div class="metric">
						<div class="metric-label">
							{{ card.label }}
							<a-tooltip v-if="card.tip" :title="card.tip">
								<QuestionCircleOutlined class="tip-icon" />
							</a-tooltip>
						</div>
						<div class="metric-value" :class="{ 'metric-value-sm': card.small }">{{ card.value }}</div>
						<div class="metric-growth">
							<span v-if="card.noGrowth" class="flat">{{ card.sub || '　' }}</span>
							<span v-else-if="card.growth === null || card.growth === undefined" class="flat">较上期 —</span>
							<span v-else :class="growthClass(card.growth)">
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
				<a-card :loading="state.loading" style="height: 100%">
					<template #title>
						报价转化漏斗
						<a-tooltip placement="right" overlay-class-name="funnel-tip">
							<template #title>
								<div>只统计<b>按顺序</b>走完前面每一步的访客：每一步都做过，且首次发生时间不早于上一步。</div>
								<div style="margin-top: 6px">
									所以会比「维度排行 → 事件」里的次数少，比如从订单列表直接去付老订单的客户，不算在这里的「支付成功」。
								</div>
							</template>
							<QuestionCircleOutlined class="tip-icon" />
						</a-tooltip>
					</template>
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
									<span class="ellipsis">
										{{ labelOf(state.rankingDimension, record.name) }}
										<span v-if="labelOf(state.rankingDimension, record.name) !== record.name" class="code">{{ record.name }}</span>
									</span>
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
					<a-select
						v-model:value="state.eventFilter.event_type"
						:options="eventOptions"
						placeholder="全部事件"
						allow-clear
						show-search
						option-filter-prop="label"
						style="width: 240px"
						@change="reloadEvents"
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
						<a-tooltip :title="record.event_name">
							<a-tag :color="categoryColor(record.event_category)">{{ labelOf('event', record.event_name) }}</a-tag>
						</a-tooltip>
					</template>
					<template v-else-if="column.dataIndex === 'visitor_id'">
						<a class="mono" @click="filterByVisitor(record.visitor_id)">{{ record.visitor_id.slice(0, 10) }}…</a>
					</template>
					<template v-else-if="column.dataIndex === 'device'">
						{{ [labelOf('device', record.device_type), record.browser, record.os].filter(Boolean).join(' / ') }}
					</template>
					<template v-else-if="column.dataIndex === 'referrer_type'">
						{{ labelOf('source', record.referrer_type) }}
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
	import { QuestionCircleOutlined } from '@ant-design/icons-vue'
	import * as echarts from 'echarts'
	import dayjs from 'dayjs'
	import { statEventsApi, statFunnelApi, statOverviewApi, statRankingApi, statTrendApi } from '@/api/stat'

	const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

	/**
	 * 事件中文名。和 Python 端 stat_service.EVENT_CATEGORY 的事件清单对应，
	 * 新增埋点事件时两边一起加；没登记的事件原样显示英文名，不会报错。
	 */
	const EVENT_LABELS = {
		pageview: '页面浏览',
		page_leave: '离开页面',
		scroll_depth: '滚动深度',
		element_click: '元素点击',
		outbound_click: '外链点击',
		site_search: '站内搜索',
		lang_switch: '切换语言',
		sign_up: '注册',
		sign_in: '登录',
		sign_out: '退出登录',
		auth_fail: '登录失败',
		quote_create: '开始上传（创建报价单）',
		file_upload_success: '上传完成',
		file_upload_fail: '上传失败',
		quote_price_view: '获得报价',
		quote_config_change: '修改报价配置',
		order_create: '提交订单',
		pay_success: '支付成功',
		chat_start: 'AI 对话',
		image_generate: 'AI 出图',
		contact_submit: '提交留言',
		js_error: '前端报错',
		api_error: '接口报错',
		slow_load: '加载缓慢',
	}

	const LABELS = {
		event: EVENT_LABELS,
		source: { direct: '直接访问', search: '搜索引擎', social: '社交媒体', ads: '广告投放', internal: '站内跳转', other: '其它网站' },
		device: { pc: '电脑', mobile: '手机', tablet: '平板', bot: '爬虫' },
	}

	/** 取中文名，没有登记的原样返回 */
	function labelOf(dimension, value) {
		const map = LABELS[dimension]
		return (map && map[value]) || value || '(空)'
	}

	const eventOptions = Object.entries(EVENT_LABELS).map(([value, label]) => ({ value, label: `${label}  ${value}` }))

	const CURRENCY_SYMBOL = { CNY: '¥', USD: '$', EUR: '€', GBP: '£', HKD: 'HK$', JPY: 'JP¥' }

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
		// 当前表格里数据实际对应的维度。表头和中文名要跟着数据走，不能跟着标签走，
		// 否则切标签后新数据还没回来的那一下，旧数据会套着新维度的名字显示
		rankingDimension: 'page',
		overview: { current: {}, growth: {}, amounts: { order: {}, pay: {} } },
		trend: { granularity: 'day', list: [] },
		funnel: [],
		ranking: [],
		events: [],
		eventTotal: 0,
		eventFilter: { event_type: undefined, visitor_id: '', page: 1, size: 20 },
	})

	/**
	 * 请求时序保护。同一块数据连续发了几次请求时（快速切标签、改日期时几块一起刷新），
	 * 只认最后一次发出的；先发出去但后回来的旧响应直接丢掉，不然会把新数据覆盖掉。
	 */
	const requestSeq = {}
	function nextSeq(key) {
		requestSeq[key] = (requestSeq[key] || 0) + 1
		return requestSeq[key]
	}
	const isLatest = (key, seq) => requestSeq[key] === seq

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

	/** { CNY: 1200, USD: 99 } → "¥1,200.00 / $99.00"；没有带币种的单独标出来 */
	function formatAmounts(amounts) {
		const entries = Object.entries(amounts || {}).filter(([, amount]) => Number(amount) > 0)
		if (!entries.length) return '0'
		return entries
			.map(([currency, amount]) => {
				const text = Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
				if (!currency) return text + '（未知币种）'
				return (CURRENCY_SYMBOL[currency] || currency + ' ') + text
			})
			.join(' / ')
	}

	const trafficCards = computed(() => {
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

	const conversionCards = computed(() => {
		const cur = state.overview.current || {}
		const growth = state.overview.growth || {}
		const amounts = state.overview.amounts || { order: {}, pay: {} }
		const orderAmount = formatAmounts(amounts.order)
		const payAmount = formatAmounts(amounts.pay)
		return [
			{ key: 'sign_ups', label: '注册', value: formatNumber(cur.sign_ups), growth: growth.sign_ups },
			{
				key: 'sign_in_users',
				label: '登录用户',
				value: formatNumber(cur.sign_in_users),
				growth: growth.sign_in_users,
				tip: '按用户ID去重。同一个人登录多次只算一个',
			},
			{ key: 'orders', label: '提交订单', value: formatNumber(cur.orders), growth: growth.orders },
			{
				key: 'order_amount',
				label: '下单金额',
				value: orderAmount,
				small: orderAmount.length > 12,
				noGrowth: true,
				tip: '按币种分开汇总，.com 站是美元、.cn 站是人民币，不做换算',
			},
			{
				key: 'payments',
				label: '支付成功',
				value: formatNumber(cur.payments),
				growth: growth.payments,
				tip: '只统计在支付页先看到待支付、之后付款成功的订单；换设备付款的统计不到，以财务数据为准',
			},
			{
				key: 'pay_amount',
				label: '支付金额',
				value: payAmount,
				small: payAmount.length > 12,
				noGrowth: true,
				sub: '埋点口径，非财务数据',
			},
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
		const isEvent = state.rankingDimension === 'event'
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
		{ title: '事件', dataIndex: 'event_name', width: 190 },
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
		const seq = nextSeq('overview')
		const res = await statOverviewApi(rangeParams())
		if (isLatest('overview', seq) && res && res.code === 0) state.overview = res.data
	}

	async function loadTrend() {
		const seq = nextSeq('trend')
		const res = await statTrendApi(rangeParams())
		if (isLatest('trend', seq) && res && res.code === 0) {
			state.trend = res.data
			await nextTick()
			renderTrend()
		}
	}

	async function loadFunnel() {
		const seq = nextSeq('funnel')
		const res = await statFunnelApi(rangeParams())
		if (isLatest('funnel', seq) && res && res.code === 0) state.funnel = res.data.list || []
	}

	async function loadRanking() {
		const seq = nextSeq('ranking')
		const dimension = state.dimension
		state.rankingLoading = true
		try {
			const res = await statRankingApi({ ...rangeParams(), dimension, limit: 20 })
			if (!isLatest('ranking', seq)) return
			if (res && res.code === 0) {
				state.ranking = res.data.list || []
				state.rankingDimension = dimension
			}
		} finally {
			// 只有最后一次请求结束才关 loading，否则前一个请求回来会把后一个的 loading 提前关掉
			if (isLatest('ranking', seq)) state.rankingLoading = false
		}
	}

	async function loadEvents() {
		const seq = nextSeq('events')
		state.eventsLoading = true
		try {
			const res = await statEventsApi({ ...rangeParams(), ...state.eventFilter })
			if (!isLatest('events', seq)) return
			if (res && res.code === 0) {
				state.events = res.data.list || []
				state.eventTotal = res.data.total || 0
			}
		} finally {
			if (isLatest('events', seq)) state.eventsLoading = false
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
		const seq = nextSeq('all')
		state.loading = true
		try {
			state.eventFilter.page = 1
			await Promise.all([loadOverview(), loadTrend(), loadFunnel(), loadRanking(), loadEvents()])
		} finally {
			if (isLatest('all', seq)) state.loading = false
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
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		// 多币种金额比较长，缩小字号避免在卡片里被截断
		&-value-sm {
			font-size: 17px;
			line-height: 31px;
		}

		&-growth {
			font-size: 12px;
		}
	}

	.tip-icon {
		margin-left: 4px;
		color: rgba(0, 0, 0, 0.35);
		font-size: 13px;
		cursor: help;
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

	.code {
		margin-left: 6px;
		color: rgba(0, 0, 0, 0.35);
		font-family: 'DM Mono', Consolas, Monaco, monospace;
		font-size: 12px;
	}

	.mono {
		font-family: 'DM Mono', Consolas, Monaco, monospace;
		font-size: 12px;
	}
</style>
