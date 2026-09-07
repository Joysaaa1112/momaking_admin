<template>
	<div class="body-container">
		<a-card>
			<a-space class="mb16">
				<a-button type="primary" @click="showModal(1)">添加权限</a-button>
			</a-space>
			<a-table :loading="data.table.loading" :data-source="data.table.source" :columns="data.table.columns" :pagination="data.table.pagination">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key == 'type'">
						<span>{{ record.type == 1 ? '菜单' : '按钮' }}</span>
					</template>
					<template v-if="column.key == 'action'">
						<a-space :size="16">
							<a-button class="a-text-btn" type="link" @click="showModal(2, record)">编辑</a-button>
							<a-button class="a-text-btn" type="link" @click="handleDelete(record.id)">删除</a-button>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.modal.visible" :title="data.modal.title" :confirm-loading="data.modal.confirmLoading" @ok="handleSave">
			<div class="form-content">
				<div class="loading-wrap" v-if="data.modal.loading">
					<a-spin />
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						权限名称
					</span>
					<a-input v-model:value="data.modal.formState.name" placeholder="请输入权限名称" />
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						权限代码
					</span>
					<a-input v-model:value="data.modal.formState.permission" placeholder="请输入权限代码" />
				</div>
				<div class="group">
					<span class="title">父权限</span>
					<a-tree-select
						v-model:value="data.modal.formState.parent_id"
						show-search
						style="width: 100%"
						:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
						placeholder="请选择父权限"
						allow-clear
						tree-default-expand-all
						:tree-data="data.table.source"
						tree-node-filter-prop="label" />
					<!-- <a-select class="value" v-model:value="data.modal.formState.parent_id" v-model:options="data.modal.source" placeholder="请选择父权限" allow-clear /> -->
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						权限类型
					</span>
					<a-radio-group v-model:value="data.modal.formState.type" :options="data.modal.authTypeOptions" />
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { authDeleteApi, makePermissionApi, permissionListApi, permissionTreeApi } from '@/api/auth'
	import { message, Modal } from 'ant-design-vue'
	import { onMounted, ref } from 'vue'

	const data = ref({
		table: {
			loading: false,
			source: [],
			columns: [
				{
					title: 'ID',
					dataIndex: 'id',
					key: 'id',
				},
				{
					title: '权限名称',
					dataIndex: 'name',
					key: 'name',
				},
				{
					title: '权限类型',
					dataIndex: 'type',
					key: 'type',
				},
				{
					title: '权限码',
					dataIndex: 'permission',
					key: 'permission',
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
		modal: {
			title: '添加权限',
			visible: false,
			loading: false,
			confirmLoading: false,
			authTypeOptions: [
				{
					label: '菜单',
					value: 1,
				},
				{
					label: '按钮',
					value: 2,
				},
			],
			formState: {
				id: undefined,
				name: undefined,
				permission: undefined,
				parent_id: undefined,
				type: 1,
			},
		},
	})

	const getPermissionTree = () => {
		data.value.table.loading = true
		permissionTreeApi()
			.then((result) => {
				if (result.code == 0) {
					// 如果result.data是空对象 转成空数组
					if (Object.keys(result.data).length == 0) {
						result.data = []
					}
					data.value.table.source = result.data
				}
			})
			.finally(() => {
				data.value.table.loading = false
			})
	}

	const getPermissionList = () => {
		data.value.modal.loading = true
		permissionListApi({})
			.then((result) => {
				if (result.code == 0) {
					data.value.modal.source = result.data.map((item) => {
						if (data.value.modal.formState.id == item.id) {
							item.disabled = true
						}
						if (item.parent_id == 0) {
							item.parent_id = undefined
						}
						item.label = item.name
						item.value = item.id
						return item
					})
				}
			})
			.finally(() => {
				data.value.modal.loading = false
			})
	}

	const showModal = (type, record) => {
		resetFormValue()
		if (type == 1) {
			data.value.modal.title = '添加权限'
		} else {
			data.value.modal.title = '编辑权限'
			data.value.modal.formState = record
			if (record.parent_id == undefined || record.parent_id == 0) {
				data.value.modal.formState.parent_id = undefined
			}
		}
		data.value.modal.visible = true
		getPermissionList()
	}

	const handleSave = () => {
		const params = {
			...data.value.modal.formState,
		}
		if (params.parent_id == undefined) {
			params.parent_id = 0
		}
		if (!params.name || !params.permission || !params.type) {
			message.warning('请输入必填项')
			return
		}
		data.value.modal.confirmLoading = true
		makePermissionApi(params)
			.then((result) => {
				if (result.code == 0) {
					resetFormValue()
					data.value.modal.visible = false
					message.success(result.msg)
					getPermissionTree()
				}
			})
			.finally(() => {
				data.value.modal.confirmLoading = false
			})
	}

	const resetFormValue = () => {
		data.value.modal.formState = {
			id: undefined,
			name: undefined,
			permission: undefined,
			parent_id: undefined,
			type: 1,
		}
	}

	const handleDelete = (id) => {
		Modal.confirm({
			title: '确定删除吗？',
			content: '删除后将无法恢复',
			onOk: () => {
				authDeleteApi({ id }).then((result) => {
					if (result.code == 0) {
						message.success(result.msg)
						getPermissionTree()
					}
				})
			},
		})
	}

	onMounted(() => {
		getPermissionTree()
	})
</script>
<style lang="scss" scoped>
	.form-content {
		padding: 16px 0 12px;
		position: relative;
	}
	.group {
		margin-bottom: 24px;
		&:last-child {
			margin-bottom: 0;
		}
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
		.value {
			width: 100%;
		}
	}
</style>
