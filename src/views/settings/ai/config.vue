<template>
	<div class="body-container">
		<a-card>
			<a-tabs v-model:activeKey="data.activeKey">
				<a-tab-pane v-for="(item, index) in data.tabs" :key="item.key" :tab="item.label" />
			</a-tabs>
			<div v-if="data.activeKey == 1">
				<a-flex class="mb16">
					<a-button type="primary" @click="showRoleModal(1, null)">添加角色</a-button>
				</a-flex>
				<a-table
					:data-source="data.role.source"
					:columns="data.role.columns"
					:loading="data.role.loading"
					:pagination="data.role.pagination"
					@change="handleRoleTableChange">
					<template #bodyCell="{ column, record }">
						<template v-if="column.key == 'status'">
							<a-switch v-model:checked="record.status" @change="changeRoleStatus(record)" />
						</template>
						<template v-if="column.key == 'action'">
							<a class="link" @click="showRoleModal(2, record)">编辑</a>
							<a class="link" @click="handleRoleDelete(record.id)">删除</a>
						</template>
					</template>
				</a-table>
			</div>
			<div v-else-if="data.activeKey == 2">12334</div>
		</a-card>
		<a-modal v-model:open="data.model.visible" :title="data.model.title">
			<div class="form-content">
				<div class="group">
					<span class="title">模型名称</span>
					<a-input placeholder="请输入模型名称"></a-input>
				</div>
				<div class="group">
					<span class="title">模型名称</span>
					<a-input placeholder="请输入模型名称"></a-input>
				</div>
			</div>
		</a-modal>
		<a-modal v-model:open="data.role.modal.visible" :title="data.role.modal.title" @ok="handleRoleOk" :confirmLoading="data.role.modal.loading">
			<div class="form-content">
				<div class="group">
					<span class="title">
						角色中文名
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.role.modal.state.name_zh" placeholder="请输入角色中文名"></a-input>
				</div>
				<div class="group">
					<span class="title">
						角色英文名
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.role.modal.state.name_en" placeholder="请输入角色英文名"></a-input>
				</div>
				<div class="group">
					<span class="title">
						系统提示词
						<span class="must">*</span>
					</span>
					<a-textarea v-model:value="data.role.modal.state.prompt_zh" placeholder="请输入系统提示词"></a-textarea>
				</div>
				<div class="group">
					<span class="title">
						System Prompt (English)
						<span class="must">*</span>
					</span>
					<a-textarea v-model:value="data.role.modal.state.prompt_en" placeholder="请输入系统提示词"></a-textarea>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup lang="ts">
	import { message, Modal } from 'ant-design-vue'
	import { onMounted, ref } from 'vue'
	import { roleSaveApi, roleListApi, roleDeleteApi, roleStatusApi } from '@/api/chats'

	const data = ref({
		activeKey: 1,
		tabs: [
			{ key: 1, label: '对话角色' },
			{ key: 2, label: '语言模型' },
		],
		model: {
			visible: false,
			title: '添加模型',
			loading: false,
		},
		role: {
			loading: false,
			source: [],
			columns: [
				{
					title: 'ID',
					dataIndex: 'id',
					key: 'id',
				},
				{
					title: 'code',
					dataIndex: 'code',
					key: 'code',
				},
				{
					title: '角色中文名',
					dataIndex: 'name_zh',
					key: 'name_zh',
				},
				{
					title: '角色英文名',
					dataIndex: 'name_en',
					key: 'name_en',
				},
				{
					title: '状态',
					dataIndex: 'status`',
					key: 'status',
				},
				{
					title: '操作',
					key: 'action',
				},
			],
			pagination: {
				current: 1,
				pageSize: 10,
				total: 0,
			},
			modal: {
				visible: false,
				title: '添加对话角色',
				loading: false,
				state: {
					id: undefined,
					name_zh: '',
					name_en: '',
					prompt_zh: '',
					prompt_en: '',
				},
			},
		},
	})

	const showCreateModel = (type: number, record: any) => {
		if (type === 1) {
			// Add model logic
		} else if (type === 2) {
			// Edit model logic
		}

		data.value.model.visible = true
	}

	const showRoleModal = (type: number, record: any) => {
		resetFormState()
		if (type === 1) {
			// Add role logic
		} else if (type === 2) {
			data.value.role.modal.state.id = record.id
			data.value.role.modal.state.name_zh = record.name_zh
			data.value.role.modal.state.name_en = record.name_en
			data.value.role.modal.state.prompt_zh = record.prompt_zh
			data.value.role.modal.state.prompt_en = record.prompt_en
		}

		data.value.role.modal.visible = true
	}

	const handleRoleOk = () => {
		const payload = {
			...data.value.role.modal.state,
		}

		if (!payload.name_zh || !payload.name_en || !payload.prompt_zh || !payload.prompt_en) {
			message.error('请填写完整信息')
			return
		}

		data.value.role.modal.loading = true
		roleSaveApi(payload)
			.then((res: any) => {
				if (res.code === 0) {
					message.success('保存成功')
					data.value.role.modal.visible = false
					resetFormState()
					getRoleList()
				}
			})
			.finally(() => {
				data.value.role.modal.loading = false
			})
	}

	const getRoleList = () => {
		const payload = {
			page: data.value.role.pagination.current,
			limit: data.value.role.pagination.pageSize,
		}

		data.value.role.loading = true

		roleListApi(payload)
			.then((res: any) => {
				if (res.code === 0) {
					data.value.role.source = res.data.data.map((item: any) => {
						var status = item.status === 1 ? true : false
						return { ...item, status: status }
					})
					data.value.role.pagination.total = res.data.total
				}
			})
			.finally(() => {
				data.value.role.loading = false
			})
	}

	const handleRoleTableChange = (pagination: any) => {
		data.value.role.pagination.current = pagination.current
		data.value.role.pagination.pageSize = pagination.pageSize
		getRoleList()
	}

	const handleRoleDelete = (id: number) => {
		Modal.confirm({
			title: '删除对话角色',
			content: '确定删除该对话角色吗？',
			onOk: () => {
				roleDeleteApi({ id: id }).then((res: any) => {
					if (res.code === 0) {
						message.success('删除成功')
						getRoleList()
					}
				})
			},
		})
	}

	const changeRoleStatus = (record) => {
		roleStatusApi({ id: record.id, status: record.status ? 1 : 0 }).then((res: any) => {
			if (res.code === 0) {
				message.success('状态更新成功')
				getRoleList()
			}
		})
	}

	const resetFormState = () => {
		data.value.role.modal.state = {
			id: undefined,
			name_zh: '',
			name_en: '',
			prompt_zh: '',
			prompt_en: '',
		}
	}

	onMounted(() => {
		getRoleList()
	})
</script>
<style scoped>
	:deep(.ant-tabs-tab) {
		padding: 0;
		padding-bottom: 12px;
	}
	.form-content {
		padding: 12px;
		.group {
			margin-bottom: 24px;
			span {
				&.title {
					display: block;
					margin-bottom: 4px;
					font-size: 14px;
					color: #666;
					&::after {
						content: ':';
					}
					.must {
						color: red;
					}
				}
			}
		}
	}
</style>
