/**
 * 站点埋点统计（新）。
 *
 * 走 request2（Python 后端 mt.momaking.*），数据源是 mk_momaking_stat_* 四张表。
 * 注意和 api/statistics.js 区分：那个是 PHP 后端的旧统计，读的是已废弃的
 * mk_momaking_statistics_record，只有 PV/UV，没有行为事件。
 */
import { request2 as request } from '@/utils/request'

const api = {
	overview: '/api/stat/overview',
	trend: '/api/stat/trend',
	ranking: '/api/stat/ranking',
	funnel: '/api/stat/funnel',
	events: '/api/stat/events',
}

/** 概览指标 + 与上一个等长周期的环比。params: { site_id, start, end } 日期为 YYYYMMDD */
export function statOverviewApi(params) {
	return request({ url: api.overview, method: 'get', params })
}

/** 趋势曲线。params: { site_id, start, end, granularity: 'day' | 'hour' } */
export function statTrendApi(params) {
	return request({ url: api.trend, method: 'get', params })
}

/** 维度排行。params: { site_id, start, end, dimension, limit } */
export function statRankingApi(params) {
	return request({ url: api.ranking, method: 'get', params })
}

/** 报价主漏斗。params: { site_id, start, end } */
export function statFunnelApi(params) {
	return request({ url: api.funnel, method: 'get', params })
}

/** 事件明细分页。params: { site_id, start, end, event_type, visitor_id, page, size } */
export function statEventsApi(params) {
	return request({ url: api.events, method: 'get', params })
}
