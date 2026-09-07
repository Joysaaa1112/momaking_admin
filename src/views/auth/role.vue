<template>
	<div class="body-container">
		<a-card>
			<a-space class="mb16">
				<a-button type="primary" @click="showModal(1)">添加角色</a-button>
			</a-space>
			<a-table
				:loading="data.table.loading"
				:columns="data.table.columns"
				:data-source="data.table.source"
				:pagination="data.table.pagination"
				@change="handleTableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key == 'is_default'">
						<a-switch :checked="record.is_default == 1 ? true : false" @change="handleDefaultChange(record)" />
					</template>
					<template v-if="column.key == 'action'">
						<a-space :size="16">
							<a-button class="a-text-btn" type="link" @click="showModal(2, record)">编辑</a-button>
							<a-button class="a-text-btn" type="link" :loading="record.deleteLoading" @click="handleDelete(record)">删除</a-button>
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
						角色名称
					</span>
					<a-input v-model:value="data.modal.formState.name" placeholder="请输入角色名称" />
				</div>

				<div class="group">
					<span class="title">
						<span class="must">*</span>
						角色状态
					</span>
					<a-radio-group v-model:value="data.modal.formState.status" :options="data.modal.statusOptions" />
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						<span>用户列表</span>
					</span>
					<a-select
						class="value"
						v-model:value="data.modal.formState.users"
						show-search
						mode="multiple"
						placeholder="请选择用户"
						:options="data.modal.userSource"
						:filter-option="filterOption"
						@change="handleSelectChange"></a-select>
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						权限列表
					</span>
					<a-tree v-model:checkedKeys="data.modal.formState.auths" :tree-data="data.modal.treeSource" checkable />
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { onMounted, ref } from 'vue'
	import { permissionTreeApi, roleDefaultApi, roleDeleteApi, roleListApi, roleSaveApi, userSearchApi } from '@/api/auth'
	import { message, Modal } from 'ant-design-vue'

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
					title: '角色名称',
					dataIndex: 'name',
					key: 'name',
				},
				{
					title: '用户数量',
					dataIndex: 'users_count',
					key: 'users_count',
				},
				{
					title: '默认权限',
					dataIndex: 'is_default',
					key: 'is_default',
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
			title: '添加角色',
			visible: false,
			loading: false,
			confirmLoading: false,
			treeLoading: false,
			treeSource: [],
			userSource: [],
			statusOptions: [
				{
					label: '启用',
					value: 1,
				},
				{
					label: '禁用',
					value: 2,
				},
			],
			formState: {
				id: undefined,
				name: undefined,
				auths: [],
				users: [],
				status: 1,
			},
		},
	})

	const getPermissionTree = () => {
		data.value.modal.loading = true
		permissionTreeApi()
			.then((result) => {
				if (result.code == 0) {
					// 如果result.data是空对象 转成空数组
					if (Object.keys(result.data).length == 0) {
						result.data = []
					}
					data.value.modal.treeSource = result.data
				}
			})
			.finally(() => {
				data.value.modal.loading = false
			})
	}

	const getRoleList = () => {
		data.value.table.loading = true
		const payload = {
			page: data.value.table.pagination.current,
			limit: data.value.table.pagination.pageSize,
			name: data.value.table.search.name,
		}
		data.value.table.loading = true
		roleListApi(payload)
			.then((result) => {
				if (result.code == 0) {
					data.value.table.source = result.data.data
					data.value.table.pagination.total = result.data.total
				}
			})
			.finally(() => {
				data.value.table.loading = false
			})
	}

	const showModal = (type, record) => {
		resetFormValue()
		if (type == 1) {
			data.value.modal.title = '添加权限'
		} else {
			data.value.modal.title = '编辑权限'
			data.value.modal.formState.id = record.id
			data.value.modal.formState.name = record.name
			data.value.modal.formState.status = record.status
			data.value.modal.formState.auths = record.auths
			var users = record.users.map((item) => item.id)
			data.value.modal.formState.users = users
			if (record.parent_id == undefined || record.parent_id == 0) {
				data.value.modal.formState.parent_id = undefined
			}
		}
		data.value.modal.visible = true
		getPermissionTree()
	}

	const handleSave = () => {
		const payload = {
			...data.value.modal.formState,
		}
		if (!payload.name) {
			message.warning('请输入角色名称')
			return
		}
		if (payload.auths.length == 0) {
			message.warning('请选择权限')
			return
		}
		if (payload.users.length == 0) {
			message.warning('请选择用户')
			return
		}
		data.value.modal.confirmLoading = true
		roleSaveApi(payload)
			.then((result) => {
				if (result.code == 0) {
					message.success('操作成功')
					data.value.modal.visible = false
					data.value.table.pagination.current = 1
					getRoleList()
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
			auths: [],
			users: [],
			status: 1,
		}
	}

	const handleTableChange = (a) => {
		data.value.table.pagination.current = a.current
		data.value.table.pagination.pageSize = a.pageSize
		getRoleList()
	}

	const handleDelete = (record) => {
		Modal.confirm({
			title: '提示',
			content: '确定要删除该角色吗？',
			onOk: () => {
				record.deleteLoading = true
				roleDeleteApi({ id: record.id })
					.then((result) => {
						if (result.code == 0) {
							message.success('删除成功')
							getRoleList()
						}
					})
					.finally(() => {
						record.deleteLoading = false
					})
			},
		})
	}

	const handleDefaultChange = (record) => {
		record.defaultLoading = true
		roleDefaultApi({ id: record.id })
			.then((result) => {
				if (result.code == 0) {
					message.success('设置成功')
					getRoleList()
				}
			})
			.finally(() => {
				record.defaultLoading = false
			})
	}

	// const handleSelectSearch = (value) => {
	// 	if (value) {
	// 		getUserList(value)
	// 	}
	// }

	// 节流控制
	const debounce = (fn, delay) => {
		let timer = null
		return function () {
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				fn.apply(this, arguments)
			}, delay)
		}
	}

	// const debounceSearch = debounce(handleSelectSearch, 300)

	const filterOption = (input, option) => {
		return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
	}

	const handleSelectChange = (value) => {}

	const getUserList = (value) => {
		userSearchApi({ account: value })
			.then((result) => {
				if (result.code == 0) {
					data.value.modal.userSource = result.data.map((item) => {
						return {
							label: (item.email || item.mobile || item.nickname) + ' - ' + item.nickname,
							value: item.id,
						}
					})
				}
			})
			.finally(() => {})
	}

	onMounted(() => {
		getRoleList()
		getUserList()
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
