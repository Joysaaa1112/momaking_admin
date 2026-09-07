<template>
	<div class="body-container">
		<a-card>
			<a-flex justify="space-between" class="mb16">
				<a-space :size="16">
					<a-button type="primary" @click="showModal(1)">新增商品分类</a-button>
				</a-space>
			</a-flex>
			<a-table :columns="data.columns" :data-source="data.source" :loading="data.tableLoading">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key == 'status'">
						<a-tag :color="record.status == 1 ? 'green' : 'red'">{{ record.status == 1 ? '显示' : '隐藏' }}</a-tag>
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
		<a-modal v-model:open="data.modal.visible" :title="data.modal.title" :confirmLoading="data.modal.confirmLoading" @ok="handleOk">
			<div class="form-content">
				<div class="loading-wrap" v-if="data.modal.categoryLoading">
					<a-spin />
				</div>
				<div class="group">
					<span class="title">
						<span>中文名</span>
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.modal.formState.chinese_name" placeholder="请输入中文名" />
				</div>
				<div class="group">
					<span class="title">
						<span>英文名</span>
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.modal.formState.english_name" placeholder="请输入英文名" />
				</div>
				<div class="group">
					<span class="title">
						<span>上级分类</span>
						<span class="must">*</span>
					</span>
					<a-select v-model:value="data.modal.formState.parent_id" :options="data.modal.categoryList" placeholder="请选择上级分类" />
				</div>
				<div class="group">
					<span class="label">
						<span>状态</span>
						<span class="must">*</span>
					</span>
					<a-radio-group v-model:value="data.modal.formState.status" :options="data.modal.statusOptions" />
				</div>
				<div class="group">
					<span class="title">
						<span>排序</span>
						<span class="must">*</span>
					</span>
					<a-input-number v-model:value="data.modal.formState.sort" placeholder="请输入排序" />
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { deleteCategoryApi, getCategoryListApi, getCategoryTreeApi, makeCategoryApi } from '@/api/product'
	import { message, Modal } from 'ant-design-vue'
	import { onMounted, ref } from 'vue'

	const data = ref({
		tableLoading: false,
		columns: [
			{
				title: '中文名',
				dataIndex: 'chinese_name',
				key: 'chinese_name',
			},
			{
				title: '英文名',
				dataIndex: 'english_name',
				key: 'english_name',
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
			},
			{
				title: '排序',
				dataIndex: 'sort',
				key: 'sort',
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				width: 200,
			},
		],
		source: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		modal: {
			title: '',
			visible: false,
			confirmLoading: false,
			categoryList: [],
			categoryLoading: false,
			formState: {
				id: undefined,
				chinese_name: '',
				english_name: '',
				sort: 99,
				status: 1,
				parent_id: undefined,
			},
			statusOptions: [
				{
					label: '显示',
					value: 1,
				},
				{
					label: '隐藏',
					value: 0,
				},
			],
		},
	})

	const showModal = (type, record) => {
		resetForm()
		if (type == 1) {
			data.value.modal.title = '新增商品分类'
		} else if (type == 2) {
			data.value.modal.title = '编辑商品分类'
			data.value.modal.formState = {
				...record,
			}
		}
		data.value.modal.visible = true
		getCategoryList()
	}

	const handleDelete = (id) => {
		Modal.confirm({
			title: '删除商品分类',
			content: '确定删除该商品分类吗？',
			onOk: () => {
				deleteCategoryApi({ id: id }).then((result) => {
					if (result.code == 0) {
						message.success('删除成功')
						getCategoryTree()
					}
				})
			},
		})
	}

	const handleOk = () => {
		const payload = {
			chinese_name: data.value.modal.formState.chinese_name,
			english_name: data.value.modal.formState.english_name,
			status: data.value.modal.formState.status,
			sort: data.value.modal.formState.sort,
			parent_id: data.value.modal.formState.parent_id,
		}
		if (!payload.chinese_name || !payload.english_name) {
			message.error('请输入中文名和英文名')
			return
		}
		if (data.value.modal.formState.id) {
			payload.id = data.value.modal.formState.id
		}
		if (!payload.parent_id) {
			payload.parent_id = 0
		}
		data.value.modal.confirmLoading = true
		makeCategoryApi(payload)
			.then((result) => {
				if (result.code == 0) {
					message.success('success')
					data.value.modal.visible = false
					data.value.pagination.current = 1
					getCategoryTree()
					resetForm()
				}
			})
			.finally(() => {
				data.value.modal.confirmLoading = false
			})
	}

	const resetForm = () => {
		data.value.modal.formState = {
			id: undefined,
			chinese_name: '',
			english_name: '',
			sort: 99,
			status: 1,
			parent_id: undefined,
		}
	}

	const getCategoryList = () => {
		data.value.modal.categoryLoading = true
		getCategoryListApi()
			.then((result) => {
				if (result.code == 0) {
					data.value.modal.categoryList = result.data.map((item) => {
						return {
							...item,
							key: item.id,
							value: item.id,
							label: item.chinese_name,
							disabled: item.id == data.value.modal.formState.id ? true : false,
						}
					})
				}
			})
			.finally(() => {
				data.value.modal.categoryLoading = false
			})
	}

	const getCategoryTree = () => {
		data.value.tableLoading = true
		getCategoryTreeApi()
			.then((result) => {
				if (result.code == 0) {
					data.value.source = result.data.map((item) => {
						return {
							...item,
							key: item.id,
							value: item.id,
							label: item.chinese_name,
						}
					})
				}
			})
			.finally(() => {
				data.value.tableLoading = false
			})
	}

	// const handleTableChange = (a, b) => {
	// 	data.value.pagination.current = a.current
	// 	data.value.pagination.pageSize = a.pageSize
	// 	getCategoryList()
	// }

	onMounted(() => {
		getCategoryTree()
	})
</script>
<style lang="scss" scoped>
	.form-content {
		padding: 12px 0;
		position: relative;
	}
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
</style>
