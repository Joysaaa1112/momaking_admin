<template>
	<div class="body-container">
		<a-card>
			<a-flex wrap="wrap" :gap="16" class="mb24">
				<div class="a-item">
					<span class="title">{{ data.lang == 'zh' ? '客户邮箱' : 'Email' }}</span>
					<a-input class="w180" allowClear :placeholder="data.lang == 'zh' ? '订单编号' : 'Order Number'" v-model:value="data.search.email" />
				</div>
				<div class="a-item">
					<span class="title">{{ data.lang == 'zh' ? '订单编号' : 'Order Number' }}</span>
					<a-input class="w180" allowClear :placeholder="data.lang == 'zh' ? '订单编号' : 'Order Number'" v-model:value="data.search.orderNo" />
				</div>
				<div class="a-item">
					<span class="title">{{ data.lang == 'zh' ? '订单状态' : 'Order Status' }}</span>
					<a-select v-if="data.lang == 'zh'" allowClear class="w180" v-model:value="data.search.orderStatus" placeholder="订单状态">
						<a-select-option :value="0">未支付</a-select-option>
						<a-select-option :value="1">已支付</a-select-option>
						<a-select-option :value="2">审核中</a-select-option>
						<a-select-option :value="3">审核通过</a-select-option>
						<a-select-option :value="4">审核拒绝</a-select-option>
						<a-select-option :value="5">生产中</a-select-option>
						<a-select-option :value="6">已发货</a-select-option>
						<a-select-option :value="7">已拒收</a-select-option>
						<a-select-option :value="8">已签收</a-select-option>
						<a-select-option :value="9">已完成</a-select-option>
						<a-select-option :value="10">售后订单</a-select-option>
					</a-select>
					<a-select v-else class="w180" allowClear v-model:value="data.search.orderStatus" placeholder="Order Status">
						<a-select-option :value="0">Unpaid</a-select-option>
						<a-select-option :value="1">Paid</a-select-option>
						<a-select-option :value="2">Under Review</a-select-option>
						<a-select-option :value="3">Approved</a-select-option>
						<a-select-option :value="4">Rejected</a-select-option>
						<a-select-option :value="5">In Production</a-select-option>
						<a-select-option :value="6">Shipped</a-select-option>
						<a-select-option :value="7">Rejected Delivery</a-select-option>
						<a-select-option :value="8">Delivered</a-select-option>
						<a-select-option :value="9">Completed</a-select-option>
						<a-select-option :value="10">After-Sales Order</a-select-option>
					</a-select>
				</div>
				<div class="a-item">
					<span class="title">{{ data.lang == 'zh' ? '支付状态' : 'Pay Status' }}</span>
					<a-select v-if="data.lang == 'zh'" allowClear class="w180" v-model:value="data.search.payStatus" placeholder="支付状态">
						<a-select-option :value="0">未支付</a-select-option>
						<a-select-option :value="1">已支付</a-select-option>
						<a-select-option :value="2">已关闭</a-select-option>
						<a-select-option :value="3">等待付款</a-select-option>
						<a-select-option :value="4">已退款</a-select-option>
					</a-select>
					<a-select v-else class="w180" allowClear v-model:value="data.search.payStatus" placeholder="Pay Status">
						<a-select-option :value="0">Unpaid</a-select-option>
						<a-select-option :value="1">Paid</a-select-option>
						<a-select-option :value="2">Closed</a-select-option>
						<a-select-option :value="3">Waiting for Payment</a-select-option>
						<a-select-option :value="4">Refunded</a-select-option>
					</a-select>
				</div>
				<div class="a-item">
					<span class="title">{{ data.lang == 'zh' ? '日期' : 'Date' }}</span>
					<a-range-picker
						v-model:value="data.search.createTime"
						@change="rangePickerChange"
						allowClear
						:placeholder="data.lang == 'zh' ? ['开始日期', '结束日期'] : ['Start Date', 'End Date']" />
				</div>
				<div class="a-item button-item">
					<a-button type="primary" @click="searchOrder">{{ data.lang == 'zh' ? '查询' : 'Search' }}</a-button>
					<a-button @click="reset()">{{ data.lang == 'zh' ? '重置' : 'Reset' }}</a-button>
				</div>
			</a-flex>
			<a-table
				:dataSource="data.table.source"
				:columns="columns"
				:loading="data.table.loading"
				:pagination="data.table.pagination"
				:scroll="{ x: 1600 }"
				@change="onChangePage">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'email'">
						<span v-if="record.email">{{ record.email }}</span>
						<span v-else-if="record.phone">+{{ record.phone_code }} {{ record.phone }}</span>
						<span v-else-if="record.user">
							<span v-if="record.user.email">{{ record.user.email }}</span>
							<span v-else>{{ record.user.phone_code }} {{ record.user.mobile }}</span>
						</span>
					</template>
					<template v-if="column.key === 'order_status'">
						<a-tag color="default" v-if="record.order_status == 0">{{ record.order_status_text }}</a-tag>
						<a-tag color="success" v-else-if="record.order_status == 1">{{ record.order_status_text }}</a-tag>
						<a-tag color="default" v-else-if="record.order_status == 2">{{ record.order_status_text }}</a-tag>
						<a-tag color="cyan" v-else-if="record.order_status == 3">{{ record.order_status_text }}</a-tag>
						<a-tag color="orange" v-else-if="record.order_status == 4">{{ record.order_status_text }}</a-tag>
						<a-tag color="geekblue" v-else-if="record.order_status == 5">{{ record.order_status_text }}</a-tag>
						<a-tag color="blue" v-else-if="record.order_status == 6">{{ record.order_status_text }}</a-tag>
						<a-tag color="red" v-else-if="record.order_status == 7">{{ record.order_status_text }}</a-tag>
						<a-tag color="cyan" v-else-if="record.order_status == 8">{{ record.order_status_text }}</a-tag>
						<a-tag color="success" v-else-if="record.order_status == 9">
							✓
							{{ record.order_status_text }}
						</a-tag>
						<a-tag color="red" v-else-if="record.order_status >= 10">{{ record.order_status_text }}</a-tag>
					</template>
					<template v-if="column.key === 'pay_status'">
						<a-tag color="default" v-if="record.pay_status == 0">{{ record.pay_status_text }}</a-tag>
						<a-tag color="success" v-else-if="record.pay_status == 1">{{ record.pay_status_text }}</a-tag>
						<a-tag color="red" v-else-if="record.pay_status == 2">{{ record.pay_status_text }}</a-tag>
						<a-tag color="default" v-else-if="record.pay_status == 3">{{ record.pay_status_text }}</a-tag>
						<a-tag color="default" v-else-if="record.pay_status == 4">{{ record.pay_status_text }}</a-tag>
					</template>
					<template v-if="column.key === 'action'">
						<a-space :size="0">
							<a class="link">
								<router-link :to="'/order/details/' + record.order_no">
									{{ data.lang == 'zh' ? '订单详情' : 'Details' }}
								</router-link>
							</a>
							<a-divider type="vertical" />
							<a-dropdown :trigger="['click']">
								<a class="link" @click.prevent>{{ data.lang == 'zh' ? '更多' : 'More' }}</a>
								<template #overlay>
									<a-menu>
										<a-menu-item @click="showUpdateOrderModal(record)">{{ data.lang == 'zh' ? '修改' : 'Edit' }}</a-menu-item>
										<a-menu-item v-if="record.order_status == 2">
											<router-link :to="'/order/review/' + record.order_no + '?pwd=56c22f9ddbc6c07122b32c0160467625'">
												{{ data.lang == 'zh' ? '审核' : 'Review' }}
											</router-link>
										</a-menu-item>
										<a-menu-item v-if="record.order_status >= 1">
											<router-link :to="'/order/purchase/' + record.order_no">
												{{ data.lang == 'zh' ? '采购单' : 'Purchase' }}
											</router-link>
										</a-menu-item>
										<a-menu-item v-if="record.pay_status == 1" @click="generateShippingOrder(record)">
											{{ data.lang == 'zh' ? '生成送货单' : 'Generate Shipping Order' }}
										</a-menu-item>
									</a-menu>
								</template>
							</a-dropdown>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.order.modal.visible" :title="data.order.modal.title" :confirmLoading="data.order.modal.loading" @ok="updateOrderHandle">
			<div class="form-content">
				<div class="group">
					<span class="title">价格</span>
					<a-input v-model:value="data.order.modal.state.total_price" placeholder="修改订单价格"></a-input>
				</div>
				<div class="group">
					<span class="title">运费</span>
					<a-input v-model:value="data.order.modal.state.shipping_price" placeholder="修改订单运费"></a-input>
				</div>
				<div class="group">
					<span class="title">订单状态</span>
					<a-select allowClear class="full" v-model:value="data.order.modal.state.order_status" placeholder="修改订单状态">
						<a-select-option :value="0">未支付</a-select-option>
						<a-select-option :value="1">已支付</a-select-option>
						<a-select-option :value="5">生产中</a-select-option>
						<a-select-option :value="6">已发货</a-select-option>
						<a-select-option :value="7">已拒收</a-select-option>
						<a-select-option :value="9">已完成</a-select-option>
						<a-select-option :value="10">售后订单</a-select-option>
					</a-select>
				</div>
				<div class="group" v-if="data.order.modal.state.order_status == 6">
					<span class="title">发货单号</span>
					<a-input v-model:value="data.order.modal.state.tracking_number" placeholder="请输入快递单号"></a-input>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script setup>
	import { ref, computed, onBeforeMount } from 'vue'
	import { getOrderListApi, updateAdminOrderApi, generateDeliveryNoteApi } from '@/api/order'

	import { message } from 'ant-design-vue'

	const data = ref({
		lang: localStorage.getItem('lang') || 'zh',
		search: {
			email: undefined,
			orderNo: undefined,
			orderStatus: undefined,
			payStatus: undefined,
			createTime: undefined,
			start_time: undefined,
			end_time: undefined,
		},
		table: {
			loading: false,
			source: [],
			columnsZh: [
				{ title: 'ID', dataIndex: 'id', key: 'id', width: 90, fixed: 'left' },
				{ title: '订单编号', dataIndex: 'order_no', key: 'order_no', width: 120 },
				{ title: '订单类型', dataIndex: 'order_name', key: 'order_name', width: 120 },
				{ title: '客户', dataIndex: 'email', key: 'email', width: 180 },
				{ title: '货币', dataIndex: 'currency', key: 'currency', width: 120 },
				{ title: '产品金额', dataIndex: 'goods_price', key: 'goods_price', width: 100 },
				{ title: '运费', dataIndex: 'shipping_price', key: 'shipping_price', width: 100 },
				{ title: '订单金额', dataIndex: 'total_price', key: 'total_price', width: 120 },
				{ title: '订单状态', dataIndex: 'order_status', key: 'order_status', width: 120 },
				{ title: '支付状态', dataIndex: 'pay_status', key: 'pay_status', width: 120 },
				{ title: '实付金额', dataIndex: 'pay_price', key: 'pay_price', width: 100 },
				{ title: '下单时间', dataIndex: 'create_time', key: 'create_time', width: 120 },
				{ title: '操作', dataIndex: 'action', key: 'action' },
			],
			columnsEn: [
				{ title: 'ID', dataIndex: 'id', key: 'id', width: 90, fixed: 'left' },
				{ title: 'Order Number', dataIndex: 'order_no', key: 'order_no', width: 120 },
				{ title: 'Order Type', dataIndex: 'order_name', key: 'order_name', width: 120 },
				{ title: 'Customer', dataIndex: 'email', key: 'email', width: 180 },
				{ title: 'Currency', dataIndex: 'currency', key: 'currency', width: 120 },
				{ title: 'Product Price', dataIndex: 'goods_price', key: 'goods_price', width: 120 },
				{ title: 'Shipping Fee', dataIndex: 'shipping_price', key: 'shipping_price', width: 120 },
				{ title: 'Order Amount', dataIndex: 'total_price', key: 'total_price', width: 120 },
				{ title: 'Order Status', dataIndex: 'order_status', key: 'order_status', width: 120 },
				{ title: 'Payment Status', dataIndex: 'pay_status', key: 'pay_status', width: 120 },
				{ title: 'Paid Amount', dataIndex: 'pay_price', key: 'pay_price', width: 120 },
				{ title: 'Order Time', dataIndex: 'create_time', key: 'create_time', width: 120 },
				{ title: 'Actions', dataIndex: 'action', key: 'action' },
			],
			pagination: {
				current: 1,
				pageSize: 10,
				total: 0,
			},
		},
		order: {
			modal: {
				visible: false,
				title: '修改订单信息',
				loading: false,
				state: {
					id: undefined,
					total_price: undefined,
					shipping_price: undefined,
					order_status: undefined,
					tracking_number: undefined,
				},
			},
		},
	})

	const columns = computed(() => {
		return data.value.lang === 'zh' ? data.value.table.columnsZh : data.value.table.columnsEn
	})
	const searchOrder = () => {
		data.value.table.pagination.current = 1
		getOrderList()
	}
	// 订单列表
	const getOrderList = () => {
		const payload = {
			page: data.value.table.pagination.current,
			page_size: data.value.table.pagination.pageSize,
			lang: data.value.lang,
			order_no: data.value.search.orderNo || undefined,
			order_status: data.value.search.orderStatus,
			pay_status: data.value.search.payStatus,
			start_time: data.value.search.start_time || undefined,
			end_time: data.value.search.end_time || undefined,
		}
		data.value.table.loading = true
		getOrderListApi(payload)
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
	const showUpdateOrderModal = (record) => {
		data.value.order.modal.visible = true
		data.value.order.modal.state = {
			id: record.id,
			total_price: record.total_price,
			shipping_price: record.shipping_price,
			order_status: record.order_status,
			tracking_number: record.tracking_number,
		}
	}

	const updateOrderHandle = () => {
		var payload = { ...data.value.order.modal.state }
		var priceReg = /^[0-9]+.?[0-9]*$/
		if (!priceReg.test(payload.total_price)) {
			message.error('订单金额格式不正确')
			return
		}
		if (payload.total_price < 0) {
			message.error('订单金额不能小于0')
			return
		}
		if (!payload.shipping_price) {
			message.error('请输入运费')
			return
		}
		if (!priceReg.test(payload.shipping_price)) {
			message.error('运费格式不正确')
			return
		}
		if (payload.order_status == 6 && !payload.tracking_number) {
			message.error('请输入快递单号')
			return
		}
		data.value.order.modal.loading = true
		updateAdminOrderApi(payload)
			.then((result) => {
				if (result.code == 0) {
					message.success('修改成功')
					data.value.order.modal.visible = false
					resetOrderModalValue()
					getOrderList()
				} else {
					message.error(result.msg)
				}
			})
			.finally(() => {
				data.value.order.modal.loading = false
			})
	}

	const resetOrderModalValue = () => {
		data.value.order.modal.state = {
			id: undefined,
			total_price: undefined,
			shipping_price: undefined,
			order_status: undefined,
			tracking_number: undefined,
		}
	}

	// 重置
	const reset = () => {
		data.value.table.pagination.current = 1
		data.value.table.pagination.pageSize = 10
		data.value.search = {
			orderNo: undefined,
			orderStatus: undefined,
			createTime: undefined,
		}
		getOrderList()
	}
	const rangePickerChange = (a, b) => {
		data.value.search.start_time = b[0]
		data.value.search.end_time = b[1]
	}
	// 翻页
	const onChangePage = (paginate, pageSize) => {
		data.value.table.pagination.current = paginate.current
		data.value.table.pagination.pageSize = paginate.pageSize
		getOrderList()
	}
	// 生成送货单
	const generateShippingOrder = (record) => {
		data.value.table.loading = true
		generateDeliveryNoteApi({ order_no: record.order_no, lang: data.value.lang })
			.then((result) => {
				if (result.code == 0) {
					message.success(data.value.lang == 'zh' ? '生成成功' : 'Generate Success')
					setTimeout(() => {
						window.open(result.data.url, '_blank')
					}, 200)
				} else {
					message.error(result.msg)
				}
			})
			.finally(() => {
				data.value.table.loading = false
			})
	}
	onBeforeMount(() => {
		getOrderList()
	})
</script>
<style lang="scss" scoped>
	span,
	a {
		vertical-align: top;
	}
	:deep(.ant-input-clear-icon) {
		display: flex !important;
	}
	:deep(.anticon) {
		vertical-align: unset !important;
	}
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
	.link {
		font-size: 13px;
	}
</style>
