<template>
	<div class="body-container">
		<a-card>
			<a-flex justify="space-between" class="mb16">
				<a-space :size="12">
					<div class="flex">
						<a-input v-model:value="data.table.search.name" placeholder="请输入模板名称" />
					</div>
					<a-space :size="8">
						<a-button type="primary" @click="handleSearch">搜索</a-button>
						<a-button @click="handleReset">重置</a-button>
					</a-space>
				</a-space>
				<a-space :size="12" class="mb16">
					<a-button type="primary" @click="showTemplateModal(1)">添加运费模板</a-button>
				</a-space>
			</a-flex>
			<a-table
				:columns="data.table.columns"
				:data-source="data.table.source"
				:loading="data.table.loading"
				:pagination="data.table.pagination"
				@change="handleTableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'billing_method'">
						{{ record.billing_method == 1 ? '按件数' : record.billing_method == 2 ? '按重量' : '按体积' }}
					</template>
					<template v-if="column.key === 'zone'">
						<a-button @click="showZoneList(record)" :loading="record.loading1" size="small">查看</a-button>
					</template>
					<template v-if="column.key === 'action'">
						<a-button type="link" @click="showTemplateModal(2, record)">编辑</a-button>
						<a-button v-if="record.id != 1" type="link" @click="deleteShipping(record)">删除</a-button>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.template.visible" :title="data.template.title" :width="1000" :footer="null">
			<div class="form-content">
				<div class="group">
					<span class="title">模板名称</span>
					<div class="value w248">
						<a-input v-model:value="data.template.form.name" placeholder="请输入模板名称" />
					</div>
				</div>
				<div class="group">
					<span class="title">计费方式</span>
					<div class="value w248 flex">
						<a-radio-group v-model:value="data.template.form.billing_method" :options="data.chargingOptions" />
					</div>
				</div>
				<div class="group" :style="{ border: data.template.zone.visible ? '1px solid #e5eeff' : 'none', borderRadius: '5px' }">
					<span class="title">配送区域及运费</span>
					<div class="value">
						<a-table class="cost-table mb16" :columns="data.template.cost.columns" :data-source="data.template.cost.source" :pagination="false" bordered>
							<template #bodyCell="{ column, record }">
								<template v-if="column.key === 'first'">
									<a-input class="w90" v-model:value="record.first" />
								</template>
								<template v-if="column.key === 'price'">
									<a-input class="w90" v-model:value="record.price" />
								</template>
								<template v-if="column.key === 'continue'">
									<a-input class="w90" v-model:value="record.continue" />
								</template>
								<template v-if="column.key === 'continue_price'">
									<a-input class="w90" v-model:value="record.continue_price" />
								</template>
							</template>
						</a-table>
						<a-button type="primary" @click="addDeliveryArea" :loading="data.template.zone.callLoading">添加配送区域</a-button>
					</div>
				</div>
				<div class="group">
					<span class="title">排序</span>
					<div class="value w248">
						<a-input v-model:value="data.template.form.sort" placeholder="请输入排序" />
					</div>
				</div>
				<div class="group">
					<span class="title" style="opacity: 0"></span>
					<div class="value">
						<a-button type="primary" @click="handleSubmit" :loading="data.template.confirmLoading">立即提交</a-button>
					</div>
				</div>
				<a-drawer
					:title="data.template.zone.title"
					placement="left"
					:closable="false"
					:open="data.template.zone.visible"
					:get-container="false"
					:style="{ position: 'absolute' }">
					<template #extra>
						<a-button style="margin-right: 8px" @click="closeZoneDrawer">关闭</a-button>
						<a-button type="primary" @click="confirmZoneDrawer">确定</a-button>
					</template>
					<a-tree
						v-model:expandedKeys="data.template.zone.expandedKeys"
						v-model:selectedKeys="data.template.zone.selectedKeys"
						v-model:checkedKeys="data.template.zone.checkedKeys"
						checkable
						:tree-data="data.template.zone.source"></a-tree>
				</a-drawer>
			</div>
		</a-modal>
		<a-modal v-model:open="data.table.zoneModal.visible" :title="data.table.zoneModal.title" :width="450">
			<div class="form-content">
				<a-space :size="12" wrap>
					<a-tag v-for="item in data.table.zoneModal.source" :key="item.key">{{ item.name == '' ? item.zone_code : item.name }}</a-tag>
				</a-space>
			</div>
		</a-modal>
		<!-- <a-modal v-model:open="data.template.zone.visible" :title="data.template.zone.title" :width="1000">
			<div class="form-content">
				<a-tree
					v-model:expandedKeys="data.template.zone.expandedKeys"
					v-model:selectedKeys="data.template.zone.selectedKeys"
					v-model:checkedKeys="data.template.zone.checkedKeys"
					checkable
					:tree-data="data.template.zone.source"></a-tree>
			</div>
		</a-modal> -->
	</div>
</template>
<script setup>
	import { deleteShippingApi, getShippingListApi, getTemplateZoneListApi, getZoneListApi, makeShippingApi } from '@/api/shipping'
	import { message, Modal } from 'ant-design-vue'
	import { onMounted, ref } from 'vue'

	const data = ref({
		table: {
			loading: false,
			columns: [
				{
					title: '模板名称',
					dataIndex: 'name',
				},
				{
					title: '计费方式',
					dataIndex: 'billing_method',
					key: 'billing_method',
				},
				{
					title: '配送区域',
					dataIndex: 'zone',
					key: 'zone',
					width: 200,
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
				},
			],
			source: [],
			pagination: {
				current: 1,
				pageSize: 10,
				total: 0,
			},
			search: {
				name: '',
			},
			zoneModal: {
				visible: false,
				title: '配送区域',
				source: [],
			},
		},
		template: {
			visible: false,
			title: '添加运费模板',
			confirmLoading: false,
			cost: {
				columns: [
					{
						title: '配送区域',
						dataIndex: 'region',
						key: 'region',
					},
					{
						title: '首重(KG)',
						dataIndex: 'first',
						key: 'first',
					},
					{
						title: '运费',
						dataIndex: 'price',
						key: 'price',
					},
					{
						title: '续重(KG)',
						dataIndex: 'continue',
						key: 'continue',
					},
					{
						title: '运费',
						dataIndex: 'continue_price',
						key: 'continue_price',
					},
					{
						title: '操作',
						dataIndex: 'action',
						key: 'action',
					},
				],
				source: [],
			},
			form: {
				name: '',
				description: '',
				billing_method: 2,
				sort: 0,
			},
			zone: {
				visible: false,
				selectedKeys: [],
				checkedKeys: [],
				expandedKeys: [],
				title: '选择配送区域',
				source: [],
				callLoading: false,
				selectedSource: [],
			},
		},
		chargingOptions: [
			{
				label: '按件数',
				value: 1,
				disabled: true,
			},
			{
				label: '按重量',
				value: 2,
			},
			{
				label: '按体积',
				value: 3,
				disabled: true,
			},
		],
	})

	const showTemplateModal = (type, record) => {
		resetValue()
		if (type == 1) {
			data.value.template.title = '添加运费模板'
		} else {
			data.value.template.title = '编辑运费模板'
			data.value.template.form = {
				id: record.id,
				name: record.name,
				billing_method: record.billing_method,
				sort: record.sort,
			}
			data.value.template.cost.source = record.zoneSource
			console.log(record, data.value.template.cost.source)
		}
		data.value.template.visible = true
	}

	const addDeliveryArea = () => {
		if (data.value.template.zone.source.length == 0) {
			getZoneList()
		} else {
			data.value.template.zone.visible = true
		}
	}

	const getZoneList = () => {
		data.value.template.zone.callLoading = true
		getZoneListApi()
			.then((res) => {
				if (res.code == 0) {
					data.value.template.zone.source = res.data
					data.value.template.zone.visible = true
				}
			})
			.finally(() => {
				data.value.template.zone.callLoading = false
			})
	}

	const closeZoneDrawer = () => {
		data.value.template.zone.visible = false
	}

	const confirmZoneDrawer = () => {
		// 根据key找到选中的区域 二维数组
		data.value.template.zone.selectedSource = filterSource(data.value.template.zone.source, data.value.template.zone.checkedKeys)
		// 最前面插入
		var regionText =
			data.value.template.zone.selectedSource.length > 1
				? data.value.template.zone.selectedSource[0].label + '等' + data.value.template.zone.selectedSource.length + '个地区'
				: data.value.template.zone.selectedSource[0].label
		data.value.template.cost.source.push({
			index: data.value.template.cost.source.length,
			region: regionText,
			first: 0,
			price: 0,
			continue: 0,
			continue_price: 0,
			zone: data.value.template.zone.selectedSource,
		})
		data.value.template.zone.selectedKeys = []
		data.value.template.zone.checkedKeys = []
		data.value.template.zone.expandedKeys = []
		data.value.template.zone.visible = false
	}

	const filterSource = (source, keys) => {
		// 递归
		const result = []
		source.forEach((item) => {
			if (keys.includes(item.key)) {
				var i = { ...item, children: undefined } // 删除一级元素的children
				result.push(i)
			}
			if (item.children) {
				result.push(...filterSource(item.children, keys))
			}
		})
		return result
	}

	const handleSubmit = () => {
		const payload = {
			id: data.value.template.form.id,
			name: data.value.template.form.name,
			billing_method: data.value.template.form.billing_method,
			sort: data.value.template.form.sort,
			zoneSource: data.value.template.cost.source,
		}
		if (!payload.name) {
			message.error('请输入模板名称')
			return
		}
		if (data.value.template.cost.source.length == 0) {
			message.error('请添加配送区域')
			return
		}
		data.value.template.confirmLoading = true
		makeShippingApi(payload)
			.then((res) => {
				if (res.code == 0) {
					message.success('添加成功')
					data.value.template.visible = false
					resetValue()
					getShippingList()
				}
			})
			.finally(() => {
				data.value.template.confirmLoading = false
			})
	}

	const getShippingList = () => {
		data.value.table.loading = true
		const payload = {
			name: data.value.table.search.name,
			page: data.value.table.pagination.current,
			limit: data.value.table.pagination.pageSize,
		}
		getShippingListApi(payload)
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

	const handleSearch = () => {
		data.value.table.pagination.current = 1
		getShippingList()
	}

	const handleReset = () => {
		data.value.table.search.name = ''
		data.value.table.pagination.current = 1
		getShippingList()
	}

	const handleTableChange = (a, b) => {
		console.log(a, b)
	}

	const showZoneList = (record) => {
		record.loading1 = true
		const payload = {
			id: record.id,
		}
		getTemplateZoneListApi(payload)
			.then((res) => {
				if (res.code == 0) {
					data.value.table.zoneModal.source = res.data
					data.value.table.zoneModal.visible = true
				}
			})
			.finally(() => {
				record.loading1 = false
			})
	}

	const resetValue = () => {
		data.value.template.form = {
			name: '',
			description: '',
			billing_method: 2,
			sort: 0,
		}
		data.value.template.cost.source = []
	}

	const deleteShipping = (record) => {
		Modal.confirm({
			title: '删除运费模板',
			content: '确定删除该运费模板吗？',
			onOk: () => {
				deleteShippingApi({ id: record.id }).then((res) => {
					if (res.code == 0) {
						message.success('删除成功')
						getShippingList()
					}
				})
			},
		})
	}

	onMounted(() => {
		getShippingList()
	})
</script>
<style lang="scss" scoped>
	.body-container {
		.anticon {
			vertical-align: -0.125em !important;
		}
	}
	.form-content {
		padding: 16px 0;
		position: relative;
		overflow: hidden;
	}
	.group {
		margin-bottom: 24px;
		display: flex;
		align-items: top;
		&:last-child {
			margin-bottom: 0;
		}
		.title {
			display: block;
			color: #666;
			font-size: 13px;
			width: 128px;
			text-align: right;
			height: 32px;
			line-height: 32px;
			float: left;
			padding-right: 12px;
			&::after {
				content: ':';
				padding: 0 4px;
			}
			.must {
				color: #f00;
			}
		}
		.value {
			width: calc(100% - 128px);
			display: block;
			min-height: 32px;
			&.flex {
				display: flex;
				align-items: center;
			}
		}
		.w248 {
			width: 248px;
		}
	}
	.cost-table {
		:deep(.ant-table) {
			.ant-table-thead {
				tr {
					th {
						background-color: #e5eeff;
					}
				}
			}
		}
	}
	.zone-content {
		max-height: 600px;
		overflow-y: auto;
		.item {
			display: flex;
			align-items: center;
			.children {
				display: flex;
				flex-wrap: wrap;
				gap: 12px;
			}
		}
	}
	:deep(.ant-drawer) {
		.ant-drawer-header {
			padding: 8px 24px;
			.ant-drawer-title {
				font-weight: 500;
				font-size: 14px;
			}
			button {
				height: 28px;
				line-height: 0;
				font-size: 13px;
			}
		}
	}
	.w90 {
		width: 90px;
	}
	.ant-btn-loading-icon {
		display: inline-flex;
		align-items: center;
	}
</style>
