<template>
	<div class="body-container">
		<a-card>
			<a-flex wrap="wrap" :gap="16" class="mb24">
				<div class="a-item">
					<a-button type="primary" @click="showModal(1)">新建分类</a-button>
				</div>
			</a-flex>
			<a-table :data-source="data.source" :columns="data.columns">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key == 'is_reception_show'">
						<a-switch :checked="record.is_reception_show == 1 ? true : false" @change="changeReception(record)" />
					</template>
					<template v-if="column.key == 'action'">
						<a-button type="link" @click="showModal(2, record)">修改</a-button>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.modal.visit" :title="data.modal.title" :confirmLoading="data.modal.confirmLoading" @ok="modalHandleOk">
			<div class="form">
				<div class="flex">
					<div class="group full" style="padding-right: 8px">
						<span class="title">
							分类中文名
							<span class="must">*</span>
						</span>
						<a-input v-model:value="data.modal.state.name" placeholder="请输入中文名"></a-input>
					</div>
					<div class="group full" style="padding-left: 8px; margin-bottom: 24px">
						<span class="title">
							分类英文名
							<span class="must">*</span>
						</span>
						<a-input v-model:value="data.modal.state.en_name" placeholder="请输入英文名"></a-input>
					</div>
				</div>
				<div class="group">
					<span class="title">
						简码
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.modal.state.code" @input="handleCategoryCode" placeholder="请输入分类简码"></a-input>
				</div>
				<div class="group">
					<span class="title">
						父级
						<span class="must">*</span>
					</span>
					<a-select class="full" v-model:options="data.modal.categoryTree" v-model:value="data.modal.state.parent_id" placeholder="请选择父级分类"></a-select>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import {
		getCategoryAll,
		makeCategory,
		getCategoryList as getCategoryListApi,
		getCategoryTree as getCategoryTreeApi,
		makeCategoryReceptionApi,
	} from '@/api/posts'
	import { message } from 'ant-design-vue'
	import { onBeforeMount, ref } from 'vue'

	const data = ref({
		source: [],
		columns: [
			{
				title: '分类名',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '简码',
				dataIndex: 'code',
				key: 'code',
			},
			{
				title: '前台展示',
				dataIndex: 'is_reception_show',
				key: 'is_reception_show',
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
		tableLoading: false,
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		modal: {
			visit: false,
			title: '新建分类',
			confirmLoading: false,
			categoryTree: [],
			state: {
				id: undefined,
				name: '',
				en_name: '',
				code: '',
				parent_id: undefined,
			},
		},
	})
	const getAllCategory = () => {
		getCategoryAll().then((result) => {
			data.value.modal.categoryAll = result.data.map((item) => {
				return {
					value: item.id,
					label: item.name,
				}
			})
		})
	}
	const showModal = (type, record) => {
		resetValue()
		if (type === 1) {
			data.value.modal.title = '新建分类'
		} else if (type === 2) {
			data.value.modal.title = '编辑分类'
			data.value.modal.state = {
				id: record.id,
				name: record.name,
				en_name: record.en_name,
				code: record.code,
				parent_id: record.parent_id,
			}
		}
		data.value.modal.visit = true
	}

	const modalHandleOk = () => {
		const payload = {
			name: data.value.modal.state.name,
			en_name: data.value.modal.state.en_name,
			code: data.value.modal.state.code,
			parent_id: data.value.modal.state.parent_id,
		}
		if (payload.name == '') {
			message.error('分类名不能为空')
			return
		}
		if (payload.en_name == '') {
			message.error('分类英文名不能为空')
			return
		}
		if (payload.code == '') {
			message.error('分类简码不能为空')
			return
		}
		if (data.value.modal.state.id != undefined) {
			payload.id = data.value.modal.state.id
		}
		data.value.modal.confirmLoading = true
		makeCategory(payload)
			.then((result) => {
				if (result.code == 0) {
					getCategoryTree()
				}
			})
			.finally(() => {
				data.value.modal.confirmLoading = false
				data.value.modal.visit = false
			})
	}

	const changeReception = (record) => {
		data.value.tableLoading = true
		var status = record.is_reception_show == 0 ? 1 : 0
		record.is_reception_show = status
		makeCategoryReceptionApi({ id: record.id, status })
			.then((result) => {
				if (result.code == 0) {
					getCategoryTree()
				}
			})
			.finally(() => {
				data.value.tableLoading = false
			})
	}

	const resetValue = () => {
		data.value.modal.state = {
			id: undefined,
			name: '',
			en_name: '',
			code: '',
			parent_id: undefined,
		}
	}
	const getCategoryList = () => {
		getCategoryListApi().then((result) => {
			if (result.code == 0) {
				if (JSON.stringify(result.data) == '{}') {
					data.value.source = []
				} else {
					data.value.modal.categoryTree = result.data
				}
			}
		})
	}

	const getCategoryTree = () => {
		getCategoryTreeApi().then((result) => {
			if (result.code == 0) {
				if (JSON.stringify(result.data) == '{}') {
					data.value.source = []
				} else {
					data.value.source = result.data
				}
			}
		})
	}

	const handleCategoryCode = (e) => {
		const regex = /^[a-zA-Z0-9-_]*$/
		if (!regex.test(data.value.modal.state.code)) {
			data.value.modal.state.code = data.value.modal.state.code.replace(/[^a-zA-Z0-9-_]/g, '')
		}
	}

	onBeforeMount(() => {
		getCategoryTree()
		getCategoryList()
	})
</script>
<style lang="scss" scoped>
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
			}
		}
	}
</style>
