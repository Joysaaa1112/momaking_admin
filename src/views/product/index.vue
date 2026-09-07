<template>
	<div class="body-container">
		<a-card class="mb16">
			<a-flex justify="space-between">
				<a-space :size="16">
					<div class="flex">
						<span class="t">商品名称</span>
						<a-input class="v" v-model:value="data.search.name" placeholder="请输入商品名称" />
					</div>
					<div class="flex">
						<span class="t">商品分类</span>
						<a-select class="v" v-model:value="data.search.category_id" placeholder="请选择商品分类">
							<a-select-option value="1">商品分类1</a-select-option>
							<a-select-option value="2">商品分类2</a-select-option>
							<a-select-option value="3">商品分类3</a-select-option>
						</a-select>
					</div>
					<a-space :size="12">
						<a-button type="primary" @click="handleSearch">搜索</a-button>
						<a-button @click="handleReset">重置</a-button>
					</a-space>
				</a-space>
				<router-link to="/product/create"><a-button type="primary">新增商品</a-button></router-link>
			</a-flex>
		</a-card>
		<div class="mk-panel">
			<a-tabs v-model:activeKey="data.activeKey" style="padding-top: 4px" @change="onTabChange">
				<a-tab-pane v-for="(item, index) in data.paneList" :key="'' + (index + 1)" :tab="item.title"></a-tab-pane>
			</a-tabs>
			<a-table :columns="data.columns" :data-source="data.source" :loading="data.loading" :pagination="data.pagination" @change="onTableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key == 'first_image'">
						<a-image :src="record.first_image" :width="40" />
					</template>
					<template v-if="column.key == 'price'">
						<a-tag v-if="record.price == 0 && record.original_price != 0" color="red">免费</a-tag>
						<span v-else>￥{{ record.price != 0 ? record.price : record.original_price }}</span>
					</template>
					<template v-if="column.key == 'virtual'">
						<a-tag v-if="record.virtual == 1" color="blue">虚拟商品</a-tag>
						<a-tag v-else color="pink">实物商品</a-tag>
					</template>
					<template v-if="column.key == 'stock'">
						<a-tag v-if="record.stock <= 0" color="red">售罄</a-tag>
						<a-tag v-else-if="record.stock <= 20" color="orange">库存紧张</a-tag>
						<span v-else>{{ record.stock }}</span>
					</template>
					<template v-if="column.key == 'status'">
						<!-- todo:切换上下架 -->
						<a-switch v-model:checked="record.status" checked-children="上架" un-checked-children="下架" @change="handleStatusChange(record)" />
					</template>
					<template v-if="column.key == 'action'">
						<a-space>
							<router-link :to="`/product/create?id=${record.id}`">
								<a-button class="a-text-btn" type="link" size="small">编辑</a-button>
							</router-link>
							<a-button class="a-text-btn" type="link" size="small">更多</a-button>
						</a-space>
					</template>
				</template>
			</a-table>
		</div>
	</div>
</template>
<script setup>
	import { getProductListApi, putProductStatusApi } from '@/api/product'
	import { message } from 'ant-design-vue'
	import { status } from 'nprogress'
	import { onMounted, ref } from 'vue'

	const data = ref({
		activeKey: '1',
		loading: false,
		columns: [
			{
				title: '商品ID',
				dataIndex: 'id',
				key: 'id',
				width: 100,
			},
			{
				title: '商品图',
				dataIndex: 'first_image',
				key: 'first_image',
				width: 100,
			},
			{
				title: '商品名称',
				dataIndex: 'chinese_name',
				key: 'chinese_name',
				width: 320,
			},
			{
				title: '商品类型',
				dataIndex: 'virtual',
				key: 'virtual',
			},
			{
				title: '售价',
				dataIndex: 'price',
				key: 'price',
			},
			{
				title: '库存',
				dataIndex: 'stock',
				key: 'stock',
			},
			{
				title: '排序',
				dataIndex: 'sort',
				key: 'sort',
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			},
		],
		source: [],
		search: {
			name: '',
			category_id: undefined,
			status: 1,
		},
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		paneList: [
			{
				key: '1',
				title: '出售中的商品',
			},
			{
				key: '2',
				title: '仓库中的商品',
			},
			{
				key: '3',
				title: '已经售罄的商品',
			},
			{
				key: '4',
				title: '警惕库存的商品',
			},
		],
	})

	const getProductList = () => {
		const params = {
			page: data.value.pagination.current,
			limit: data.value.pagination.pageSize,
			status: data.value.search.status,
			name: data.value.search.name,
			category_id: data.value.search.category_id,
		}
		data.value.loading = true
		getProductListApi(params)
			.then((res) => {
				if (res.code == 0) {
					data.value.source = res.data.data.map((item) => {
						return {
							...item,
							status: item.status == 1 ? true : false,
						}
					})
					data.value.pagination.total = res.data.total
				}
			})
			.finally(() => {
				data.value.loading = false
			})
	}

	const onTabChange = (key) => {
		data.value.search.status = parseInt(key)
		data.value.pagination.current = 1
		getProductList()
	}

	onMounted(() => {
		getProductList()
	})

	const handleSearch = () => {
		data.value.pagination.current = 1
		getProductList()
	}

	const handleReset = () => {
		data.value.search = { name: '', category_id: undefined, status: 1 }
		getProductList()
	}

	const onTableChange = (a, b) => {
		data.value.pagination.current = a.current
		data.value.pagination.pageSize = a.pageSize
		getProductList()
	}

	const handleStatusChange = (record) => {
		const payload = {
			id: record.id,
			status: record.status ? 1 : 2,
		}
		data.value.loading = true
		putProductStatusApi(payload)
			.then((res) => {
				if (res.code == 0) {
					message.success('操作成功')
					getProductList()
				}
			})
			.finally(() => {
				data.value.loading = false
			})
	}
</script>
