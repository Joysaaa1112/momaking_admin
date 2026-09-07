<template>
	<div class="body-container">
		<a-card>
			<a-space :size="12" class="mb16">
				<a-button type="primary" @click="showUserModal(1)">添加客户</a-button>
			</a-space>
			<a-table
				:loading="data.table.loading"
				:columns="data.table.columns"
				:data-source="data.table.source"
				:pagination="data.table.pagination"
				@change="handleTableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key == 'name'">
						<span v-if="record.first_name">{{ record.first_name }} {{ record.last_name }}</span>
						<span v-else-if="record.nickname">{{ record.nickname }}</span>
						<span v-else>-</span>
					</template>
					<template v-if="column.key == 'mobile'">
						<span v-if="record.mobile">{{ record.mobile }}</span>
						<span v-else>-</span>
					</template>
					<template v-if="column.key == 'email'">
						<span v-if="record.email">{{ record.email }}</span>
						<span v-else>-</span>
					</template>
					<template v-if="column.key == 'address'">
						<span v-if="record.shipping">{{ record.shipping.address_1 }}</span>
						<span v-else>-</span>
					</template>
					<template v-if="column.key == 'leader'">
						<a-avatar style="margin-right: 8px" v-if="record.leader.avatar" :src="record.leader.avatar" />
						<span>
							<span v-if="record.leader.first_name">{{ record.leader.first_name }} {{ record.leader.last_name }}</span>
							<span v-else-if="record.leader.nickname">{{ record.leader.nickname }}</span>
							<span v-else>-</span>
						</span>
					</template>
					<template v-if="column.key == 'action'">
						<a-space :size="8">
							<a-button class="a-text-btn" type="link" @click="handlePlaceOrder(record)">代下单</a-button>
							<a-button class="a-text-btn" type="link" @click="showUserModal(2, record)">编辑</a-button>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.userModal.visible" :title="data.userModal.title" :confirm-loading="data.userModal.confirmLoading" @ok="handleUserModalOk">
			<div class="form-content">
				<div class="group">
					<span class="title">
						<span>姓名</span>
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.userModal.formState.name" placeholder="请输入姓名" />
				</div>
				<div class="group">
					<span class="title">
						<span>账号</span>
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.userModal.formState.account" placeholder="请输入手机号或邮箱" />
				</div>
				<div class="group">
					<span class="title">
						<span>登录密码</span>
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.userModal.formState.password" placeholder="请输入登录密码" />
				</div>
				<a-flex justify="space-between" gap="small">
					<div class="group" style="flex: 1">
						<span class="title">
							<span>国家、地区</span>
							<span class="must">*</span>
						</span>
						<a-cascader
							class="value"
							v-model:value="data.userModal.formState.country"
							:options="data.userModal.countryOptions"
							:load-data="getState"
							placeholder="Please select"
							change-on-select />
					</div>
					<div class="group" style="flex: 1">
						<span class="title">
							<span>城市</span>
							<span class="must">*</span>
						</span>
						<a-input v-model:value="data.userModal.formState.city" placeholder="请输入城市" />
					</div>
				</a-flex>
				<div class="group">
					<span class="title">
						<span>详细地址</span>
						<span class="must">*</span>
					</span>
					<a-textarea v-model:value="data.userModal.formState.address" placeholder="请输入详细收货地址" />
				</div>
			</div>
		</a-modal>
		<a-modal v-model:open="data.orderModal.visible" :title="data.orderModal.title" :confirm-loading="data.orderModal.confirmLoading" @ok="handleOrderModalOk">
			<div class="form-content">
				<div class="loading-wrap" v-if="data.orderModal.mainLoading">
					<a-spin />
				</div>
				<div class="group">
					<span class="title">订单编号</span>
					<a-input v-model:value="data.orderModal.orderNo" readonly :disabled="true" placeholder="请输入订单编号" />
				</div>
				<div class="group">
					<span class="title">
						<span>运费</span>
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.orderModal.formState.shipping_price" placeholder="请输入运费" />
				</div>
				<div class="group">
					<span class="title">
						<span>支付状态</span>
						<span class="must">*</span>
					</span>
					<a-select class="value" v-model:value="data.orderModal.formState.pay_status" placeholder="请选择支付状态">
						<a-select-option :value="0">未支付</a-select-option>
						<a-select-option :value="1">已支付</a-select-option>
					</a-select>
				</div>
				<div class="group">
					<span class="title">
						<span>产品金额</span>
						<span class="must">*</span>
					</span>
					<a-table
						:loading="data.orderModal.goodsTable.loading"
						:columns="data.orderModal.goodsTable.columns"
						:data-source="data.orderModal.goodsTable.source"
						size="small">
						<template #bodyCell="{ column, record }">
							<template v-if="column.key == 'goods_name'">
								<a-space :size="8">
									<a-image :src="resolveStaticUrl(record.goods_data.preview)" :width="40" />
									<span>{{ record.goods_data.name }}</span>
								</a-space>
							</template>
							<template v-if="column.key == 'quantity'">
								<a-input v-model:value="record.quantity" placeholder="请输入数量" />
							</template>
							<template v-if="column.key == 'price'">
								<a-input v-model:value="record.unit_price" placeholder="请输入单价" />
							</template>
						</template>
					</a-table>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { getCountryApi, getStateApi } from '@/api/geo'
	import { resolveStaticUrl } from '@/utils/url'
	import { getOrderInfoApi } from '@/api/order'
	import { makeUserApi, myUsersApi, updateOrderApi } from '@/api/place'
	import router from '@/router'
	import { message, Modal } from 'ant-design-vue'
	import { onBeforeMount, onMounted, ref } from 'vue'

	const data = ref({
		lang: localStorage.getItem('lang') || 'zh',
		tabs: {
			activeKey: '1',
		},
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
					title: '姓名',
					dataIndex: 'name',
					key: 'name',
				},
				{
					title: '手机号',
					dataIndex: 'mobile',
					key: 'mobile',
				},
				{
					title: '邮箱',
					dataIndex: 'email',
					key: 'email',
				},
				{
					title: '负责人',
					dataIndex: 'leader',
					key: 'leader',
				},
				{
					title: '收货地址',
					dataIndex: 'address',
					key: 'address',
				},
				// {
				// 	title: '订单',
				// 	dataIndex: 'order',
				// 	key: 'order',
				// },
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
				account: undefined,
			},
		},
		userModal: {
			visible: false,
			title: '添加用户',
			confirmLoading: false,

			formState: {
				name: '',
				account: '',
				password: '',
				country: [],
				city: '',
				address: '',
			},
			countryLoading: false,
			countryOptions: [],
		},
		orderModal: {
			visible: false,
			title: '修改订单',
			orderNo: undefined,
			orderInfo: {},
			mainLoading: false,
			confirmLoading: false,
			formState: {
				shipping_price: 0,
				pay_status: 0,
			},
			goodsTable: {
				loading: false,
				source: [],
				columns: [
					{
						title: '产品名称',
						dataIndex: 'goods_name',
						key: 'goods_name',
					},
					{
						title: '数量',
						dataIndex: 'quantity',
						key: 'quantity',
						width: 120,
					},
					{
						title: '单价',
						dataIndex: 'price',
						key: 'price',
						width: 120,
					},
				],
			},
		},
	})

	const showUserModal = (type, record) => {
		if (type == 1) {
			data.value.userModal.title = '添加用户'
		} else {
			data.value.userModal.title = '编辑用户'
			data.value.userModal.formState.id = record.id
			data.value.userModal.formState.name = record.nickname
			if (record.mobile) {
				data.value.userModal.formState.account = record.mobile
			}
			if (record.email) {
				data.value.userModal.formState.account = record.email
			}
			data.value.userModal.formState.password = record.password
			data.value.userModal.formState.country = [record.shipping.country, record.shipping.state]
			data.value.userModal.formState.city = record.shipping.city
			data.value.userModal.formState.address = record.shipping.address_1
		}

		data.value.userModal.visible = true
		if (data.value.userModal.countryOptions.length == 0) {
			getCountries()
		}
	}

	const getCountries = async () => {
		data.value.userModal.countryLoading = true
		const res = await getCountryApi()
		data.value.userModal.countryOptions = res.data.map((item) => ({
			value: item.code,
			label: item.chinese_name,
			isLeaf: false,
		}))
		data.value.userModal.countryLoading = false
	}

	const getState = (selectedOptions) => {
		const targetOption = selectedOptions[selectedOptions.length - 1]
		targetOption.loading = true
		getStateApi({ country_code: targetOption.value })
			.then((res) => {
				targetOption.loading = false
				if (Object.keys(res.data).length > 0) {
					targetOption.children = res.data.map((item) => ({
						value: item.code,
						label: item.chinese_name,
					}))
				}
			})
			.finally(() => {
				targetOption.loading = false
			})
	}

	const handleUserModalOk = () => {
		const payload = {
			...data.value.userModal.formState,
		}
		var countryObj = payload.country
		payload.country = countryObj[0]
		payload.state = countryObj[1] || undefined
		if (!payload.name) {
			message.error('请输入姓名')
			return
		}
		if (!payload.account) {
			message.error('请输入手机号或邮箱')
			return
		}
		if (!payload.password) {
			message.error('请输入登录密码')
			return
		}
		if (!payload.country) {
			message.error('请选择国家')
			return
		}
		if (!payload.city) {
			message.error('请输入城市')
			return
		}
		if (!payload.address) {
			message.error('请输入详细收货地址')
			return
		}
		data.value.userModal.confirmLoading = true
		makeUserApi(payload)
			.then((res) => {
				if (res.code == 0) {
					message.success('success')
					data.value.userModal.visible = false
					getMyUsers()
				}
			})
			.finally(() => {
				data.value.userModal.confirmLoading = false
			})
	}

	const getMyUsers = () => {
		data.value.table.loading = true
		const payload = {
			page: data.value.table.pagination.current,
			page_size: data.value.table.pagination.pageSize,
			...data.value.table.search,
		}
		data.value.table.loading = true
		myUsersApi(payload)
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

	const getOrderInfo = () => {
		data.value.orderModal.mainLoading = true
		getOrderInfoApi({ order_no: data.value.orderModal.orderNo })
			.then((result) => {
				if (result.code == 0) {
					data.value.orderModal.orderInfo = result.data
					data.value.orderModal.goodsTable.source = result.data.goods
					data.value.orderModal.formState.shipping_price = result.data.shipping_price
					data.value.orderModal.formState.pay_status = result.data.pay_status
				}
			})
			.finally(() => {
				data.value.orderModal.mainLoading = false
			})
	}

	const handleOrderModalOk = () => {
		console.log(data.value.orderModal.formState)
		const payload = {
			order_no: data.value.orderModal.orderNo,
			...data.value.orderModal.formState,
		}
		payload.goods = data.value.orderModal.goodsTable.source.map((item) => ({
			id: item.id,
			quantity: item.quantity || 1,
			unit_price: item.unit_price || 0,
		}))
		if (payload.shipping_price == '') {
			message.error('请输入运费')
			return
		}
		Modal.confirm({
			title: '确定修改订单吗？',
			onOk: () => {
				data.value.orderModal.confirmLoading = true
				updateOrderApi(payload)
					.then((res) => {
						if (res.code == 0) {
							message.success('success')
							data.value.orderModal.visible = false
						}
					})
					.finally(() => {
						data.value.orderModal.confirmLoading = false
					})
			},
		})
	}

	const handleTableChange = (pagination) => {
		data.value.table.pagination.current = pagination.current
		data.value.table.pagination.pageSize = pagination.pageSize
		getMyUsers()
	}

	const handlePlaceOrder = (record) => {
		var token = localStorage.getItem('authorization')
		if (!token) {
			message.error('请先登录')
			return
		}
		token = token.replace('Bearer ', '')
		window.open(`https://www.momaking.com/${data.value.lang}/space/quotation/upload?type=place&uid=${record.id}&token=${token}`, '_blank')
	}

	onBeforeMount(() => {
		const query = router.currentRoute.value.query
		if (query.order_no) {
			data.value.orderModal.orderNo = query.order_no
		}
	})

	onMounted(() => {
		getMyUsers()
		if (data.value.orderModal.orderNo) {
			data.value.orderModal.visible = true
			getOrderInfo()
		}
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
		.value {
			width: 100%;
		}
	}
</style>
