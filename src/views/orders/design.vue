<template>
	<div class="body-container">
		<a-card>
			<a-table :columns="data.columns" :data-source="data.source" :loading="data.loading" :pagination="data.pagination">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'customer'">
						<a-tag v-if="record.customer?.email" color="blue">{{ record.customer?.email }}</a-tag>
						<a-tag v-else-if="record.customer?.mobile" color="green">{{ record.customer?.mobile }}</a-tag>
						<span v-else color="red">
							<a-tag v-if="record.contact">{{ record.contact }}</a-tag>
							<a-tag v-else>-</a-tag>
						</span>
					</template>
					<template v-if="column.key === 'images'">
						<a-avatar-group shape="square" :maxCount="3">
							<a-avatar v-for="image in record.images" :key="image" :src="image" :width="48" />
						</a-avatar-group>
					</template>
					<template v-if="column.key === 'keywords'">
						<div class="tag-container">
							<a-tag v-for="keyword in record.keywords" :key="keyword" color="pink">{{ keyword }}</a-tag>
						</div>
					</template>
					<template v-if="column.key === 'actions'">
						<a-space :size="0">
							<a class="link" @click="handleDetail(record)">{{ data.lang == 'zh' ? '详情' : 'Detail' }}</a>
							<a-divider type="vertical" />
							<a-dropdown :trigger="['click']">
								<a class="ant-dropdown-link" @click.prevent>
									更多
									<DownOutlined style="font-size: 12px; transform: scale(0.8)" />
								</a>
								<template #overlay>
									<a-menu>
										<a-menu-item key="0">接单</a-menu-item>
										<a-menu-divider />
										<a-menu-item key="1">未开放</a-menu-item>
									</a-menu>
								</template>
							</a-dropdown>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-drawer
			v-model:open="data.detail.visible"
			class="custom-class"
			root-class-name="root-class-name"
			style="color: #444"
			:title="data.detail.title"
			placement="right"
			size="large"
			@after-open-change="afterOpenChange">
			<div class="description-container">
				<div class="row">
					<div class="group">
						<span class="title">ID</span>
						<span class="value">{{ data.detail.state.id }}</span>
					</div>
					<div class="group">
						<span class="title">订单编号</span>
						<span class="value">{{ data.detail.state.design_no }}</span>
					</div>
				</div>
				<div class="row">
					<div class="group">
						<span class="title">联系方式</span>
						<span v-if="data.detail.state.customer">
							{{ !data.detail.state.customer?.mobile ? data.detail.state.customer.email : data.detail.state.customer.mobile }}
						</span>
						<span v-else>-</span>
					</div>
					<div class="group">
						<span class="title">数量</span>
						<span class="value">{{ data.detail.state.quantity }}</span>
					</div>
				</div>
				<div class="row">
					<div class="group">
						<span class="title">申请时间</span>
						<span class="value">{{ data.detail.state.create_time }}</span>
					</div>
				</div>
				<div class="row">
					<div class="group full">
						<span class="title">关键词</span>
						<div class="tag-container full">
							<a-tag v-for="keyword in data.detail.state.keywords" :key="keyword" color="pink">{{ keyword }}</a-tag>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="group full">
						<span class="title">图片</span>
						<div class="tag-container full">
							<a-image v-for="image in data.detail.state.images" :key="image" :src="image" :height="48" />
						</div>
					</div>
				</div>
				<div class="row">
					<div class="group" style="flex-direction: column; width: 100%; flex: 1; justify-content: left; align-items: flex-start">
						<span class="title" style="margin-bottom: 8px">内容详情</span>
						<div class="value content" v-html="data.detail.state.content"></div>
					</div>
				</div>
			</div>
		</a-drawer>
	</div>
</template>
<script setup>
	import { ref, onMounted, onBeforeMount } from 'vue'
	import { listDesignApi } from '@/api/design'
	import { DownOutlined } from '@ant-design/icons-vue'

	const data = ref({
		lang: window.localStorage.getItem('lang') || 'zh',
		loading: false,
		source: [],
		columns: [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
			},
			{
				title: 'Customer',
				dataIndex: 'customer',
				key: 'customer',
			},
			{
				title: 'No',
				dataIndex: 'design_no',
				key: 'design_no',
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				key: 'quantity',
			},
			{
				title: 'Images',
				dataIndex: 'images',
				key: 'images',
			},
			{
				title: 'Keywords',
				dataIndex: 'keywords',
				key: 'keywords',
				width: 200,
			},
			{
				title: 'create_time',
				dataIndex: 'create_time',
				key: 'create_time',
				width: 160,
			},
			{
				title: 'Actions',
				dataIndex: 'actions',
				key: 'actions',
				width: 150,
			},
		],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		detail: {
			visible: false,
			title: '',
			state: {},
		},
	})

	const handleDetail = (record) => {
		data.value.detail.visible = true
		data.value.detail.state = record
		data.value.detail.title = '编号: ' + record.id
	}

	const afterOpenChange = (open) => {
		// data.value.detail.visible = open
	}

	const getList = async () => {
		const res = await listDesignApi({
			page: data.value.pagination.current,
			pageSize: data.value.pagination.pageSize,
		})

		data.value.source = res.data.data
		data.value.source = data.value.source.map((item) => {
			return item
		})
		data.value.pagination.total = res.data.total
	}

	onBeforeMount(() => {
		if (data.value.lang == 'zh') {
			data.value.columns = [
				{
					title: 'ID',
					dataIndex: 'id',
					key: 'id',
				},
				{
					title: '客户',
					dataIndex: 'customer',
					key: 'customer',
				},
				{
					title: '编号',
					dataIndex: 'design_no',
					key: 'design_no',
				},
				{
					title: '数量',
					dataIndex: 'quantity',
					key: 'quantity',
				},
				{
					title: '图片',
					dataIndex: 'images',
					key: 'images',
				},
				{
					title: '关键词',
					dataIndex: 'keywords',
					key: 'keywords',
				},
				{
					title: '创建时间',
					dataIndex: 'create_time',
					key: 'create_time',
					width: 160,
				},
				{
					title: '操作',
					dataIndex: 'actions',
					key: 'actions',
					width: 150,
				},
			]
		}
	})

	onMounted(async () => {
		getList()
	})
</script>
<style scoped lang="scss">
	.tag-container {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		img {
			border-radius: 3.5px;
		}
	}
	.description-container {
		.row {
			margin-bottom: 16px;
			.group {
				width: 50%;
				display: flex;
				align-items: center;
				.title {
					margin-right: 8px;
					&::after {
						content: ':';
						padding-left: 2px;
					}
				}
				.content {
					min-width: 100%;
					border-radius: 5px;
					background-color: #f5f5f5;
					padding: 12px;
				}
			}
		}
	}
</style>
