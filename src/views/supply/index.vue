<template>
	<div class="body-container">
		<a-card>
			<a-flex wrap="wrap" :gap="16" class="mb24">
				<div class="a-item">
					<a-button type="primary" @click="showSupplyModal(1)">添加供应商</a-button>
				</div>
			</a-flex>
			<a-table :dataSource="data.source" :columns="data.columns" :pagination="data.pagination" :loading="data.tableLoading" @change="tableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<a-button type="link" @click="showSupplyModal(2, record)">修改</a-button>
						<a-button type="link" @click="deleteSupply(record.id)">删除</a-button>
					</template>
				</template>
			</a-table>
			<a-modal v-model:open="data.modal.visit" :title="data.modal.title" :confirmLoading="data.modal.loading" @ok="modalHandleOk">
				<div class="form-content">
					<div class="group">
						<span class="title">
							全称
							<span class="must">*</span>
						</span>
						<a-input placeholder="请输入供应商全称" v-model:value="data.modal.state.name"></a-input>
					</div>
					<div class="group">
						<span class="title">
							联系人
							<span class="must">*</span>
						</span>
						<a-input placeholder="请输入联系人" v-model:value="data.modal.state.contact"></a-input>
					</div>
					<div class="group">
						<span class="title">
							联系电话
							<span class="must">*</span>
						</span>
						<a-input placeholder="请输入联系电话" v-model:value="data.modal.state.phone"></a-input>
					</div>
					<div class="group">
						<span class="title">
							传真号码
							<span class="must">*</span>
						</span>
						<a-input placeholder="请输入传真号码" v-model:value="data.modal.state.fax"></a-input>
					</div>
				</div>
			</a-modal>
		</a-card>
	</div>
</template>
<script setup>
	import { onBeforeMount, ref } from 'vue'
	import { makeSupply, supplyList, deleteSupply as deleteSupplyApi } from '@/api/supply'
	import { Modal } from 'ant-design-vue'
	const data = ref({
		tableLoading: false,
		source: [],
		columns: [
			{ title: 'ID', dataIndex: 'id', key: 'id', width: 90, fixed: 'left' },
			{ title: '供应商', dataIndex: 'name', key: 'name' },
			{ title: '联系电话', dataIndex: 'phone', key: 'phone', width: 200 },
			{ title: '传真号码', dataIndex: 'fax', key: 'fax' },
			{ title: '创建时间', dataIndex: 'create_time', key: 'create_time' },
			{ title: '操作', dataIndex: 'action', key: 'action' },
		],
		search: {
			name: '',
		},
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		modal: {
			visit: false,
			loading: false,
			title: '添加供应商',
			state: {
				id: undefined,
				name: '',
				contact: '',
				phone: '',
				fax: '',
			},
		},
	})

	const tableChange = (a, b) => {
		data.value.pagination.current = a.current
		data.value.pagination.pageSize = a.pageSize
		getSupplyList()
	}

	const resetModalState = () => {
		data.value.modal.state = {
			id: undefined,
			name: '',
			contact: '',
			phone: '',
			fax: '',
		}
	}

	const getSupplyList = () => {
		const payload = {
			page: data.value.pagination.current,
			page_size: data.value.pagination.pageSize,
			name: data.value.search.name,
		}
		data.value.tableLoading = true
		supplyList(payload)
			.then((result) => {
				if (result.code == 0) {
					data.value.source = result.data.data
					data.value.pagination.total = result.data.total
				}
			})
			.finally(() => {
				data.value.tableLoading = false
			})
	}

	const showSupplyModal = (type, record) => {
		resetModalState()
		if (type == 1) {
			data.value.modal.title = '添加供应商'
		} else {
			data.value.modal.title = '修改供应商'
			data.value.modal.state.id = record.id
			data.value.modal.state.name = record.name
			data.value.modal.state.contact = record.contact
			data.value.modal.state.phone = record.phone
			data.value.modal.state.fax = record.fax
		}
		data.value.modal.visit = true
	}
	const modalHandleOk = () => {
		var payload = {
			name: data.value.modal.state.name,
			contact: data.value.modal.state.contact,
			phone: data.value.modal.state.phone,
			fax: data.value.modal.state.fax,
		}
		if (data.value.modal.state.id !== undefined) {
			payload.id = data.value.modal.state.id
		}
		data.value.modal.loading = true
		makeSupply(payload)
			.then((result) => {
				if (result.code == 0) {
					data.value.modal.visit = false
					getSupplyList()
				} else {
					message.error(result.msg)
				}
			})
			.finally(() => {
				data.value.modal.loading = false
			})
	}

	const deleteSupply = (id) => {
		Modal.confirm({
			title: '确定删除该供应商吗？',
			onOk() {
				deleteSupplyApi({ id: id }).then((result) => {
					if (result.code == 0) {
						getSupplyList()
					} else {
						message.error(result.msg)
					}
				})
			},
		})
	}

	onBeforeMount(() => {
		getSupplyList()
	})
</script>
<style lang="scss" scoped>
	.form-content {
		padding: 12px 0;
	}
	.group {
		margin-bottom: 24px;
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
