<template>
	<div class="body-container">
		<a-card>
			<a-space class="mb16" :size="12">
				<a-button @click="showModal">手动添加</a-button>
				<div class="flex">
					<a-button type="primary" :loading="data.main.autoGenerateLoading" @click="handleAutoGenerate">自动生成</a-button>
					<p class="tips">自动生成只会生成当下的文章、内容，不包含前端页面</p>
				</div>
			</a-space>
			<a-table
				:loading="data.table.loading"
				:columns="data.table.columns"
				:data-source="data.table.source"
				:pagination="data.table.pagination"
				@change="tableHandlePaginationChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'lang'">
						<a-tag :color="record.lang == 1 ? 'blue' : 'orange'">{{ record.lang == 1 ? '中文' : '英文' }}</a-tag>
					</template>
					<template v-if="column.key === 'action'">
						<a-button type="link" @click="showModal(2, record)">编辑</a-button>
						<a-button type="link" @click="handleDelete(record)">删除</a-button>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.modal.visible" :title="data.modal.title" :confirm-loading="data.modal.confirmLoading" @ok="modalHandleOk">
			<div class="form-content">
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						<span>URL</span>
					</span>
					<a-input-group class="value" compact>
						<a-select v-model:value="data.modal.state.prefix" style="width: 100px">
							<a-select-option value="https">https</a-select-option>
							<a-select-option value="http">http</a-select-option>
						</a-select>
						<a-input style="width: calc(100% - 100px)" v-model:value="data.modal.state.url" placeholder="www.momaking.com" @blur="handleUrlBlur" />
					</a-input-group>
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						<span>语言</span>
					</span>
					<a-select class="value" v-model:value="data.modal.state.lang" v-model:options="data.modal.langOptions" placeholder="请选择语言"></a-select>
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						<span>最后修改时间</span>
					</span>
					<a-date-picker
						class="value"
						format="YYYY-MM-DD HH:mm:ss"
						:show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
						v-model:value="data.modal.state.modified_time"
						placeholder="请选择最后修改时间" />
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import dayjs, { Dayjs } from 'dayjs'
	import { message, Modal } from 'ant-design-vue'
	import { onMounted, ref } from 'vue'
	import { autoGenerateSitemapApi, deleteSitemapItemApi, getSitemapListApi, makeSitemapItemApi } from '@/api/sitemap'

	const data = ref({
		table: {
			loading: false,
			source: [],
			columns: [
				{
					title: 'URL',
					dataIndex: 'url',
					key: 'url',
				},
				{
					title: '语言',
					dataIndex: 'lang',
					key: 'lang',
				},
				{
					title: '最后修改时间',
					dataIndex: 'modified_time',
					key: 'modified_time',
				},
				{
					title: '操作',
					dataIndex: 'action',
					key: 'action',
				},
			],
			pagination: {
				current: 1,
				pageSize: 10,
				total: 0,
			},
			search: {
				url: undefined,
			},
		},
		modal: {
			visible: false,
			title: '添加到站点地图',
			confirmLoading: false,
			langOptions: [
				{
					label: '中文',
					value: 1,
				},
				{
					label: '英文',
					value: 2,
				},
			],
			state: {
				id: undefined,
				prefix: 'https',
				url: undefined,
				lang: 1,
				modified_time: undefined,
			},
		},
		main: {
			autoGenerateLoading: false,
		},
	})

	const showModal = (type, record) => {
		resetModalState()
		if (type == 1) {
			data.value.modal.title = '添加到站点地图'
		} else if (type == 2) {
			data.value.modal.title = '编辑站点地图'
			let url = record.url
			data.value.modal.state.id = record.id
			data.value.modal.state.url = url.replace(/^https?:\/\//, '')
			data.value.modal.state.prefix = url.includes('https') ? 'https' : 'http'
			data.value.modal.state.lang = record.lang
			data.value.modal.state.modified_time = dayjs(record.modified_time)
		}
		data.value.modal.visible = true
	}

	const resetModalState = () => {
		data.value.modal.state = {
			id: undefined,
			prefix: 'https',
			url: undefined,
			lang: 1,
			modified_time: undefined,
		}
	}

	const handleUrlBlur = () => {
		// 如果 URL 格式正确，但包含 http:// 或 https://，则去掉
		data.value.modal.state.url = data.value.modal.state.url.replace(/^https?:\/\//, '')
		// 去除首尾空格
		data.value.modal.state.url = data.value.modal.state.url.trim()
	}

	const modalHandleOk = () => {
		const payload = {
			...data.value.modal.state,
		}
		// URL 验证正则：检查是否是有效的 URL，允许 http:// 和 https://
		const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+)(:[0-9]+)?(\/[^\s]*)?$/

		if (!payload.url) {
			message.warning('URL不能为空')
			return
		} else if (!urlRegex.test(payload.url)) {
			message.warning('请输入有效的URL')
			return
		}

		// 如果 URL 格式正确，但包含 http:// 或 https://，则去掉
		payload.url = payload.prefix + '://' + payload.url.replace(/^https?:\/\//, '')

		if (!payload.lang) {
			message.warning('语言不能为空')
			return
		}
		if (!payload.modified_time) {
			message.warning('最后修改时间不能为空')
			return
		} else {
			payload.modified_time = dayjs(payload.modified_time).format('YYYY-MM-DD HH:mm:ss')
		}
		data.value.modal.confirmLoading = true
		makeSitemapItemApi(payload)
			.then((res) => {
				if (res.code == 0) {
					message.success('success')
					resetModalState()
					data.value.modal.visible = false
					getSitemapList()
				}
			})
			.finally(() => {
				data.value.modal.confirmLoading = false
			})
	}

	const getSitemapList = () => {
		const payload = {
			page: data.value.table.pagination.current,
			limit: data.value.table.pagination.pageSize,
			url: data.value.table.search.url,
		}
		data.value.table.loading = true
		getSitemapListApi(payload)
			.then((res) => {
				if (res.code == 0) {
					data.value.table.source = res.data.data
					data.value.table.pagination.total = res.data.total
				}
			})
			.finally(() => {
				data.value.table.loading = false
			})
	}

	const tableHandlePaginationChange = (a, b) => {
		data.value.table.pagination.current = a.current
		data.value.table.pagination.pageSize = a.pageSize
		getSitemapList()
	}

	const handleDelete = (record) => {
		Modal.confirm({
			title: '确定删除吗？',
			onOk: () => {
				deleteSitemapItemApi({ id: record.id }).then((res) => {
					if (res.code == 0) {
						message.success('删除成功')
						getSitemapList()
					}
				})
			},
		})
	}

	const handleAutoGenerate = () => {
		data.value.main.autoGenerateLoading = true
		autoGenerateSitemapApi({})
			.then((result) => {
				if (result.code == 0) {
					message.success('success')
				}
			})
			.finally(() => {
				data.value.main.autoGenerateLoading = false
			})
	}

	onMounted(() => {
		getSitemapList()
	})
</script>
<style lang="scss" scoped>
	.form-content {
		padding: 20px 0;
	}
	.group {
		margin-bottom: 24px;
		&:last-child {
			margin-bottom: 0;
		}
		span {
			&.title {
				display: block;
				margin-bottom: 8px;
				font-size: 15px;
				&::after {
					content: ':';
				}
				.must {
					color: red;
				}
				.tips {
					font-size: 12px;
					color: #999;
				}
			}
		}
		.value {
			width: 100%;
		}
	}
	.tips {
		font-size: 12px;
		color: #666;
		margin-bottom: 0;
		margin-left: 4px;
	}
</style>
