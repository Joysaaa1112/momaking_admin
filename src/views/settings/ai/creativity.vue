<template>
	<div class="body-container">
		<a-card>
			<a-flex class="mb16">
				<a-button type="primary" @click="showCreativityModal(1, null)">添加创意</a-button>
			</a-flex>
			<a-table :columns="data.columns" :dataSource="data.source" :pagination="data.pagination" :loading="data.loading" @change="handleTableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key == 'action'">
						<a-space>
							<a class="link" @click="showCreativityModal(2, record)">编辑</a>
							<a class="link" @click="handleDelete(record.id)">删除</a>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.modal.visible" :title="data.modal.title" :confirmLoading="data.modal.loading" @ok="handleSubmit">
			<div class="p-2">
				<div class="group">
					<div class="title">中文标题</div>
					<a-textarea v-model:value="data.modal.state.title_zh" placeholder="请输入中文标题"></a-textarea>
				</div>
				<div class="group">
					<div class="title">英文标题</div>
					<a-textarea v-model:value="data.modal.state.title_en" placeholder="请输入英文标题"></a-textarea>
				</div>
				<div class="group">
					<div class="title">分类</div>
					<a-input v-model:value="data.modal.state.category" placeholder="请输入分类"></a-input>
				</div>
				<div class="group">
					<div class="title">中文内容</div>
					<a-textarea v-model:value="data.modal.state.content_zh" placeholder="请输入中文内容"></a-textarea>
				</div>
				<div class="group">
					<div class="title">英文内容</div>
					<a-textarea v-model:value="data.modal.state.content_en" placeholder="请输入英文内容"></a-textarea>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup lang="ts">
	import { message, Modal } from 'ant-design-vue'
	import { onMounted, ref } from 'vue'
	import { getCreativityListApi, createCreativityApi, deleteCreativityApi } from '@/api/creativity'

	const data = ref({
		loading: false,
		source: [],
		columns: [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
			},
			{
				title: '中文标题',
				dataIndex: 'title_zh',
				key: 'title_zh',
			},
			{
				title: '英文标题',
				dataIndex: 'title_en',
				key: 'title_en',
			},
			{
				title: '分类',
				dataIndex: 'category',
				key: 'category',
			},
			{
				title: '中文内容',
				dataIndex: 'content_zh',
				key: 'content_zh',
			},
			{
				title: '英文内容',
				dataIndex: 'content_en',
				key: 'content_en',
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				key: 'create_time',
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				width: 120,
			},
		],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		modal: {
			visible: false,
			title: '新建创意',
			loading: false,
			state: {
				id: undefined,
				title_zh: '',
				title_en: '',
				category: '',
				content_zh: '',
				content_en: '',
			},
		},
	})

	const showCreativityModal = (type, record) => {
		if (type == 1) {
			data.value.modal.title = '新建创意'
		} else {
			data.value.modal.title = '编辑创意'
			data.value.modal.state.content_zh = record.content_zh
			data.value.modal.state.content_en = record.content_en
			data.value.modal.state.title_zh = record.title_zh
			data.value.modal.state.title_en = record.title_en
			data.value.modal.state.category = record.category
			data.value.modal.state.id = record.id
		}
		data.value.modal.visible = true
	}

	const resetForm = () => {
		data.value.modal.state = {
			id: undefined,
			title_zh: '',
			title_en: '',
			category: '',
			content_zh: '',
			content_en: '',
		}
	}

	const handleSubmit = () => {
		const payload = {
			...data.value.modal.state,
		}
		if (!payload.content_zh || !payload.content_en) {
			message.error('请填写完整信息')
			return
		}
		data.value.modal.loading = true
		createCreativityApi(payload)
			.then((res: any) => {
				if (res.code == 0) {
					message.success('操作成功')
					resetForm()
					data.value.modal.visible = false
					data.value.pagination.current = 1
					getCreativityList()
				}
			})
			.finally(() => {
				data.value.modal.loading = false
			})
	}

	const getCreativityList = () => {
		data.value.loading = true
		const params = {
			page: data.value.pagination.current,
			page_size: data.value.pagination.pageSize,
		}
		getCreativityListApi(params)
			.then((res: any) => {
				if (res.code == 0) {
					data.value.source = res.data.data
					data.value.pagination.total = res.data.total
				}
			})
			.finally(() => {
				data.value.loading = false
			})
	}

	const handleTableChange = (pagination) => {
		data.value.pagination.current = pagination.current
		data.value.pagination.pageSize = pagination.pageSize
		getCreativityList()
	}

	const handleDelete = (id) => {
		Modal.confirm({
			title: '确认删除该创意吗？',
			onOk() {
				data.value.loading = true
				deleteCreativityApi({ id })
					.then((res: any) => {
						if (res.code == 0) {
							message.success('删除成功')
							data.value.pagination.current = 1
							getCreativityList()
						}
					})
					.finally(() => {
						data.value.loading = false
					})
			},
		})
	}

	onMounted(() => {
		getCreativityList()
	})
</script>
<style scoped>
	.p-2 {
		padding: 16px;
	}
	.group {
		margin-bottom: 16px;
		&:last-child {
			margin-bottom: 0;
		}
		.title {
			margin-bottom: 8px;
			color: #333;
		}
	}
</style>
