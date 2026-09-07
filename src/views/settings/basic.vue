<template>
	<div class="body-container">
		<a-card>
			<a-tabs v-model:activeKey="data.activeKey">
				<a-tab-pane :key="1" tab="基本设置" :disabled="true"></a-tab-pane>
				<a-tab-pane :key="2" tab="协议政策">
					<a-space :size="16" class="mb16">
						<a-button type="primary" @click="showContentModal(1)">新建</a-button>
					</a-space>
					<a-table :data-source="data.content.source" :columns="data.content.columns" :pagination="data.content.pagination" @change="contentTableChange">
						<template #bodyCell="{ column, record }">
							<template v-if="column.key === 'lang'">
								<span v-if="record.lang == 'zh'">中文</span>
								<span v-else>English</span>
							</template>
							<template v-if="column.key === 'actions'">
								<a-button type="link" @click="showContentModal(2, record)">修改</a-button>
								<a-button type="link" @click="deleteContent(record.id)">删除</a-button>
								<a-button type="link" target="_blank" :href="'https://www.momaking.com/' + (record.lang == 1 ? 'zh' : 'en') + '/content/' + record.slug">
									预览
								</a-button>
							</template>
						</template>
					</a-table>
				</a-tab-pane>
				<a-tab-pane :key="3" tab="页面TDK">
					<a-flex class="mb16" justify="space-between" align="center">
						<a-space>
							<div class="flex">
								<a-input v-model:value="data.pages.table.search.name" allowClear placeholder="页面名称/路径"></a-input>
							</div>
							<div class="flex">
								<a-space :size="8">
									<a-button type="primary" @click="searchPages">查询</a-button>
									<a-button @click="resetPagesSearch">重置</a-button>
								</a-space>
							</div>
						</a-space>
						<a-space>
							<a-button type="primary" @click="showPagesModal(1)">添加页面</a-button>
						</a-space>
					</a-flex>

					<a-table
						:loading="data.pages.table.loading"
						:dataSource="data.pages.table.source"
						:columns="data.pages.table.columns"
						:pagination="data.pages.table.pagination"
						@change="pagesTableChange">
						<template #bodyCell="{ column, record }">
							<template v-if="column.key === 'description'">
								<div class="ellipsis" style="max-width: 300px">
									{{ record.description }}
								</div>
							</template>
							<template v-if="column.key === 'actions'">
								<a-button type="link" @click="showPagesModal(2, record)">修改</a-button>
							</template>
						</template>
					</a-table>
				</a-tab-pane>
			</a-tabs>
		</a-card>
		<a-modal width="850px" style="top: 20px" v-model:open="data.content.visit" :title="data.content.title" @ok="handleContentOk">
			<div class="form-content">
				<div class="group mb24">
					<span class="title">
						标题
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.content.state.title" placeholder="请输入标题"></a-input>
				</div>
				<div class="flex mb24">
					<div class="group" style="margin: 0; flex: 1; padding-right: 12px">
						<span class="title">
							语言
							<span class="must">*</span>
						</span>
						<a-select v-model:value="data.content.state.lang" class="full">
							<a-select-option value="zh">中文 CN</a-select-option>
							<a-select-option value="en">英文 EN</a-select-option>
						</a-select>
					</div>
					<div class="group" style="margin: 0; flex: 1; padding-left: 12px">
						<span class="title">
							链接
							<span class="tips">（只允许英文、数组、_-，组成，且不能数字和_-开头）</span>
							<span class="must">*</span>
						</span>
						<a-input v-model:value="data.content.state.slug" placeholder="请输入链接"></a-input>
					</div>
				</div>
				<div class="group">
					<span class="title">
						正文
						<span class="tips">（只允许英文、数组、_-，组成，且不能数字和_-开头）</span>
						<span class="must">*</span>
					</span>
					<wang-editor ref="editorRef" @editorCreated="editorCreate" @editorChange="editorChange" />
				</div>
			</div>
		</a-modal>
		<a-modal v-model:open="data.pages.modal.visible" :title="data.pages.modal.title" :confirmLoading="data.pages.modal.confirm" @ok="handlePagesOk">
			<div class="form-content">
				<div class="group">
					<span class="title">
						<span>页面名称</span>
					</span>
					<div class="value">
						<a-input v-model:value="data.pages.modal.state.name" placeholder="请输入页面名称"></a-input>
					</div>
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						<span>页面链接</span>
					</span>
					<div class="value">
						<a-input v-model:value="data.pages.modal.state.path" placeholder="请输入页面匹配链接"></a-input>
					</div>
					<p class="tips">匹配的页面链接，例如/zh/content，/zh/shop</p>
				</div>
				<div class="tips mb8" style="margin-top: 0">SEO相关</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						<span>标题</span>
					</span>
					<div class="value">
						<a-input v-model:value="data.pages.modal.state.title" placeholder="请输入页面标题"></a-input>
					</div>
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						<span>关键词</span>
					</span>
					<div class="value">
						<a-textarea v-model:value="data.pages.modal.state.keywords" placeholder="请输入页面关键词"></a-textarea>
					</div>
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						<span>描述</span>
					</span>
					<div class="value">
						<a-textarea v-model:value="data.pages.modal.state.description" placeholder="请输入页面描述"></a-textarea>
					</div>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { onBeforeMount, onMounted, ref } from 'vue'
	import WangEditor from '@/components/WangEditor.vue'
	import { makeContentApi, contentListApi, deleteContentApi } from '@/api/settings'
	import { message, Modal } from 'ant-design-vue'
	import { makePagesApi, pagesListApi } from '@/api/pages'

	const editorRef = ref(null)
	const data = ref({
		lang: localStorage.getItem('lang') || 'zh',

		activeKey: 2,
		content: {
			source: [],
			columns: [
				{
					title: '标题',
					dataIndex: 'title',
					key: 'title',
				},
				{
					title: '语言',
					dataIndex: 'lang',
					key: 'lang',
				},
				{
					title: '链接',
					dataIndex: 'slug',
					key: 'slug',
				},
				{
					title: '创建时间',
					dataIndex: 'create_time',
					key: 'create_time',
				},
				{
					title: '修改时间',
					dataIndex: 'update_time',
					key: 'update_time',
				},
				{
					title: '操作',
					dataIndex: 'actions',
					key: 'actions',
				},
			],
			loading: false,
			visit: false,
			title: '',
			confirmLoading: false,
			state: {
				id: undefined,
				lang: 'zh',
				title: '',
				slug: '',
				content: '',
			},
			pagination: {
				current: 1,
				pageSize: 10,
				total: 0,
			},
		},
		pages: {
			modal: {
				visible: false,
				title: '添加页面',
				loading: false,
				confirmLoading: false,
				state: {
					id: undefined,
					name: '',
					path: '',
					title: '',
					keywords: '',
					description: '',
				},
			},
			table: {
				loading: false,
				source: [],
				columns: [
					{
						title: '页面名称',
						dataIndex: 'name',
						key: 'name',
					},
					{
						title: '页面链接',
						dataIndex: 'path',
						key: 'path',
					},
					{
						title: '标题',
						dataIndex: 'title',
						key: 'title',
					},
					{
						title: '关键词',
						dataIndex: 'keywords',
						key: 'keywords',
					},
					{
						title: '描述',
						dataIndex: 'description',
						key: 'description',
						width: 350,
					},
					{
						title: '修改时间',
						dataIndex: 'update_time',
						key: 'update_time',
					},
					{
						title: '操作',
						dataIndex: 'actions',
						key: 'actions',
					},
				],
				pagination: {
					current: 1,
					pageSize: 10,
					total: 0,
				},
				search: {
					name: undefined,
				},
			},
		},
	})

	const resetContentModalValue = () => {
		editorRef.value = null
		data.value.content.state = {
			id: undefined,
			lang: 'zh',
			title: '',
			slug: '',
			content: '',
		}
	}

	const getContentList = () => {
		const payload = {
			page: data.value.content.pagination.current,
			pageSize: data.value.content.pagination.pageSize,
		}
		contentListApi(payload).then((result) => {
			if (result.code == 0) {
				data.value.content.pagination.total = result.data.total
				data.value.content.source = result.data.data
			}
		})
	}
	const contentTableChange = (a, b) => {
		console.log(a, b)
	}
	const editorChange = () => {
		data.value.content.state.content = editorRef.value.getEditorContent()
	}
	const editorCreate = () => {
		if (editorRef.value) {
			editorRef.value.setHtml(data.value.content.state.content)
		}
	}
	const deleteContent = (id) => {
		Modal.confirm({
			title: '确定要删除该内容吗?',
			content: '请注意，此操作不可撤回!',
			onOk() {
				deleteContentApi({ id }).then((result) => {
					if (result.code == 0) {
						message.success('删除成功')
						getContentList()
					}
				})
			},
			onCancel() {
				console.log('Cancel')
			},
			class: 'test',
		})
	}
	const showContentModal = (type, record) => {
		resetContentModalValue()
		if (type === 1) {
			data.value.content.title = '新建内容'
		} else {
			data.value.content.title = '编辑内容'
			data.value.content.state = record
		}
		data.value.content.visit = true
	}

	const handleContentOk = () => {
		const payload = data.value.content.state
		if (payload.title == '') {
			message.error('标题不能为空')
			return
		}
		if (payload.slug == '') {
			message.error('链接不能为空')
			return
		}
		if (payload.content == '') {
			message.error('正文不能为空')
			return
		}
		data.value.content.confirmLoading = true
		makeContentApi(payload)
			.then((result) => {
				if (result.code == 0) {
					resetContentModalValue()
					message.success('保存成功')
					getContentList()
				}
			})
			.finally(() => {
				data.value.content.confirmLoading = false
				data.value.content.visit = false
			})
	}

	const showPagesModal = (type, record) => {
		resetPagesModalState()
		if (type == 1) {
			data.value.pages.modal.title = '添加页面'
		} else {
			data.value.pages.modal.title = '编辑页面'
			data.value.pages.modal.state.id = record.id
			data.value.pages.modal.state.name = record.name
			data.value.pages.modal.state.path = record.path
			data.value.pages.modal.state.title = record.title
			data.value.pages.modal.state.keywords = record.keywords
			data.value.pages.modal.state.description = record.description
		}
		data.value.pages.modal.visible = true
	}

	const handlePagesOk = () => {
		const payload = {
			...data.value.pages.modal.state,
		}
		if (payload.path == '') {
			message.warning('请输入页面路径')
			return
		}
		if (payload.title == '') {
			message.warning('请输入页面标题')
			return
		}
		if (payload.description == '') {
			message.warning('请输入页面描述')
			return
		}
		data.value.pages.modal.confirmLoading = true
		makePagesApi(payload)
			.then((result) => {
				if (result.code == 0) {
					message.success('保存成功')
					resetPagesModalState()
					data.value.pages.modal.visible = false
					getPagesList()
				}
			})
			.finally(() => {
				data.value.pages.modal.confirmLoading = false
			})
	}

	const getPagesList = () => {
		const payload = {
			page: data.value.pages.table.pagination.current,
			limit: data.value.pages.table.pagination.pageSize,
			...data.value.pages.table.search,
		}
		data.value.pages.table.loading = true
		pagesListApi(payload)
			.then((result) => {
				if (result.code == 0) {
					data.value.pages.table.pagination.total = result.data.total
					data.value.pages.table.source = result.data.data
				}
			})
			.finally(() => {
				data.value.pages.table.loading = false
			})
	}

	const pagesTableChange = (a, b) => {
		data.value.pages.table.pagination.current = a.current
		data.value.pages.table.pagination.pageSize = a.pageSize
		getPagesList()
	}

	const searchPages = () => {
		data.value.pages.table.pagination.current = 1
		getPagesList()
	}
	const resetPagesSearch = () => {
		data.value.pages.table.search.name = undefined
		searchPages()
	}

	const resetPagesModalState = () => {
		data.value.pages.modal.state = {
			id: undefined,
			name: '',
			path: '',
			title: '',
			keywords: '',
			description: '',
		}
	}

	onBeforeMount(() => {
		getContentList()
	})
	onMounted(() => {
		getPagesList()
	})
</script>
<style lang="scss" scoped>
	:deep(.ant-tabs-tab) {
		padding: 0;
		padding-bottom: 12px;
	}
	.ellipsis {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
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
	}
	.tips {
		color: #999;
		font-size: 12px;
		margin-top: 4px;
	}
</style>
