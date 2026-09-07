<template>
	<div class="body-container">
		<div style="position: relative">
			<div class="loading-wrap" v-if="data.mainLoading">
				<a-spin />
			</div>
			<a-card class="mb16" :title="data.lang == 'zh' ? '流程进度' : 'Process Progress'">
				<a-steps progress-dot :current="data.currentProcess" :items="data.process"></a-steps>
			</a-card>
			<a-card class="mb16" :title="data.lang == 'zh' ? '订单详情' : 'Order Detail'">
				<a-descriptions>
					<a-descriptions-item :label="data.lang == 'zh' ? '订单类型' : 'Order Type'">{{ data.orderInfo.order_name }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '订单货币' : 'Currency'">{{ data.orderInfo.currency }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '订单状态' : 'Order Status'">
						<a-tag color="default" v-if="data.orderInfo.order_status == 0">{{ data.orderInfo.order_status_text }}</a-tag>
						<a-tag color="success" v-else-if="data.orderInfo.order_status == 1">{{ data.orderInfo.order_status_text }}</a-tag>
						<a-tag color="default" v-else-if="data.orderInfo.order_status == 2">{{ data.orderInfo.order_status_text }}</a-tag>
						<a-tag v-else-if="data.orderInfo.order_status == 3" color="cyan">{{ data.orderInfo.order_status_text }}</a-tag>
						<a-tag color="orange" v-else-if="data.orderInfo.order_status == 4">{{ data.orderInfo.order_status_text }}</a-tag>
						<a-tag color="geekblue" v-else-if="data.orderInfo.order_status == 5">{{ data.orderInfo.order_status_text }}</a-tag>
						<a-tag color="blue" v-else-if="data.orderInfo.order_status == 6">{{ data.orderInfo.order_status_text }}</a-tag>
						<a-tag color="red" v-else-if="data.orderInfo.order_status == 7">{{ data.orderInfo.order_status_text }}</a-tag>
						<a-tag color="cyan" v-else-if="data.orderInfo.order_status == 8">{{ data.orderInfo.order_status_text }}</a-tag>
						<a-tag color="success" v-else-if="data.orderInfo.order_status == 9">
							✓
							{{ data.orderInfo.order_status_text }}
						</a-tag>
						<a-tag color="red" v-else-if="data.orderInfo.order_status == 10">{{ data.orderInfo.order_status_text }}</a-tag>
					</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '订单金额' : 'Order Amout'">{{ data.orderInfo.total_price }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '订单编号' : 'Order No'">{{ data.orderInfo.order_no }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '支付方式' : 'Payment Method'">{{ data.orderInfo.pay_type_text }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '支付状态' : 'Pay Status'">
						<a-tag color="default" v-if="data.orderInfo.pay_status == 0">{{ data.orderInfo.pay_status_text }}</a-tag>
						<a-tag color="success" v-else-if="data.orderInfo.pay_status == 1">{{ data.orderInfo.pay_status_text }}</a-tag>
					</a-descriptions-item>
					<a-descriptions-item v-if="data.orderInfo.pay_status == 1" :label="data.lang == 'zh' ? '支付金额' : 'Pay Price'">
						{{ data.orderInfo.pay_price }}
					</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '下单时间' : 'Order Time'">{{ data.orderInfo.create_time }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '支付时间' : 'Pay Time'">{{ data.orderInfo.pay_time }}</a-descriptions-item>
					<a-descriptions-item v-if="data.orderInfo.coupon" :label="data.lang == 'zh' ? '优惠券' : 'Coupon'">
						<a-tag color="cyan">{{ data.orderInfo.coupon?.coupon_name }}</a-tag>
					</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '送货单' : 'Delivery Note'">
						<a v-if="data.orderInfo.delivery" :href="resolveStaticUrl(data.orderInfo.delivery?.path)" target="_blank">
							{{ data.orderInfo.delivery_note_type_text }}
						</a>
						<span v-else>{{ data.orderInfo.delivery_note_type_text }}</span>
					</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '快递方式' : 'Shipping Fee'">
						{{ data.orderInfo.shipping_method == 1 ? '顺丰标准速递(预付)' : '顺丰标准速递(到付) / 其他(备注为准)' }}
					</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '运费' : 'Shipping Fee'">{{ data.orderInfo.shipping_price }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '联系人' : 'Consignee'">{{ data.orderInfo.consignee }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '电话' : 'Mobile'">{{ data.orderInfo.phone_code }} {{ data.orderInfo.mobile }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '地区' : 'Region'">
						{{ data.orderInfo.country }} {{ data.orderInfo.state }} {{ data.orderInfo.city }}
					</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '邮编' : 'Postal Code'">{{ data.orderInfo.postal_code }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '地址' : 'Address'">{{ data.orderInfo.address }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '地址1' : 'Address1'">{{ data.orderInfo.address1 }}</a-descriptions-item>
					<a-descriptions-item :label="data.lang == 'zh' ? '备注' : 'Notes'">{{ data.orderInfo.notes }}</a-descriptions-item>
				</a-descriptions>
			</a-card>
			<a-card :title="data.lang == 'zh' ? '产品详情' : 'Product Details'">
				<a-table :dataSource="data.goodsTable.source" :columns="columns">
					<template #bodyCell="{ column, record }">
						<template v-if="column.key === 'name'">
							<div v-if="data.orderInfo.type == 1 || data.orderInfo.type == 2">
								<a-avatar shape="square" :src="record.goods_data.preview" :size="64" />
								<span style="padding-left: 8px">{{ record.goods_data.name }}</span>
							</div>
							<div v-else>
								<a-avatar shape="square" :src="record.goods_data.first_image" :size="64" />
								{{ data.lang == 'zh' ? record.goods_data.chinese_name : record.goods_data.english_name }}
							</div>
						</template>
						<template v-if="column.key == 'details'">
							<div class="information" v-if="data.orderInfo.type == 1 || data.orderInfo.type == 2">
								<div class="flex">
									<span class="t">体积</span>
									<span>{{ record.goods_data.volume }}mm³</span>
								</div>
								<div class="flex">
									<span class="t">表面积</span>
									<span>{{ record.goods_data.area }}mm³</span>
								</div>
								<div class="flex">
									<span class="t">重量</span>
									<span>{{ record.goods_data.weight }}g</span>
								</div>
								<div class="flex">
									<span class="t">长宽高</span>
									<span>({{ record.goods_data.length }}mm, {{ record.goods_data.width }}mm, {{ record.goods_data.height }}mm)</span>
								</div>
							</div>
							<div v-else>{{ record.goods_data.weight }}g, {{ record.goods_data.volume }}mm³</div>
						</template>
						<template v-if="column.key == 'attribute'">
							<div class="information" v-if="data.orderInfo.type == 1 || data.orderInfo.type == 2">
								<div class="flex">
									<span class="t">工艺</span>
									<span>{{ record.goods_data.configure_text?.process }}</span>
								</div>
								<div class="flex">
									<span class="t">材料</span>
									<span>{{ record.goods_data.configure_text?.material }}</span>
								</div>
								<div class="flex" v-if="record.goods_data.configure_text?.color">
									<span class="t">颜色</span>
									<span>{{ record.goods_data.configure_text?.color }}</span>
								</div>
								<div class="flex" v-if="record.goods_data.configure_text?.surface">
									<span class="t">表面处理</span>
									<a-tag v-for="(surface, index) in record.goods_data.configure_text?.surface" :key="index">{{ surface.label }}</a-tag>
								</div>
							</div>
							<div v-else>{{ record.goods_data.weight }}g, {{ record.goods_data.volume }}mm³</div>
						</template>
					</template>
				</a-table>
			</a-card>
		</div>
	</div>
</template>
<script setup>
	import { onBeforeMount, ref, computed, h } from 'vue'
	import { getOrderInfoApi } from '@/api/order'
	import { useRoute } from 'vue-router'
	import { resolveStaticUrl } from '@/utils/url'

	const data = ref({
		lang: localStorage.getItem('lang') || 'zh',
		mainLoading: false,
		orderNo: null,
		orderInfo: {},
		goodsTable: {
			source: [],
			columnsZh: [
				{
					title: '产品',
					dataIndex: 'name',
					key: 'name',
				},
				{
					title: '规格',
					dataIndex: 'details',
					key: 'details',
				},
				{
					title: '工艺',
					dataIndex: 'attribute',
					key: 'attribute',
				},
				{
					title: '单价',
					dataIndex: 'unit_price',
					key: 'unit_price',
				},
				{
					title: '数量',
					dataIndex: 'quantity',
					key: 'quantity',
				},
				{
					title: '金额',
					dataIndex: 'total_price',
					key: 'total_price',
				},
			],
			columnsEn: [
				{
					title: 'Product',
					dataIndex: 'name',
					key: 'name',
				},
				{
					title: 'Specification',
					dataIndex: 'attribute',
					key: 'attribute',
				},
				{
					title: 'Technology',
					dataIndex: 'technology',
					key: 'technology',
				},
				{
					title: 'Unit Price',
					dataIndex: 'unit_price',
					key: 'unit_price',
				},
				{
					title: 'Quantity',
					dataIndex: 'quantity',
					key: 'quantity',
				},
				{
					title: 'Total Amount',
					dataIndex: 'total_price',
					key: 'total_price',
				},
			],
		},
		process: [],
		currentProcess: ref(0),
	})

	const columns = computed(() => {
		return data.value.lang === 'zh' ? data.value.goodsTable.columnsZh : data.value.goodsTable.columnsEn
	})

	// 订单详情
	const getOrderInfo = () => {
		const payload = {
			order_no: data.value.orderNo,
		}
		data.value.mainLoading = true
		getOrderInfoApi(payload)
			.then((result) => {
				if (result.code == 0) {
					data.value.orderInfo = result.data
					data.value.goodsTable.source = result.data.goods.map((item) => {
						console.log(item)
						item.goods_data.configure_text = item.goods_data.configure_text ? JSON.parse(item.goods_data.configure_text) : {}
						if (typeof item.goods_data.configure_text == 'string') {
							item.goods_data.configure_text = JSON.parse(item.goods_data.configure_text)
						}
						return item
					})
					generateProcessData(data.value.orderInfo)
				}
			})
			.finally(() => {
				data.value.mainLoading = false
			})
	}

	// 生成流程进度数据
	const generateProcessData = (order) => {
		if (order.order_type == 1) {
			var processSteps = [
				{
					title: data.value.lang == 'zh' ? '提交订单' : 'Submit Order',
					description: order.create_time,
				},
				{
					title: data.value.lang == 'zh' ? '支付完成' : 'Payment Completed',
					description: order.pay_status === 1 && order.pay_time ? order.pay_time : '',
				},
				{
					title: data.value.lang == 'zh' ? '生产制造' : 'Manufacturing',
				},
				{
					title: data.value.lang == 'zh' ? '快递物流' : 'Shipping',
				},
				{
					title: data.value.lang == 'zh' ? '完成' : 'Completed',
					description: order.order_status >= 4 ? '已完成' : '',
				},
			]
			switch (order.order_status) {
				case 0:
					data.value.currentProcess = 0
					break
				case 1:
					data.value.currentProcess = 1
					break
				case 5:
					data.value.currentProcess = 2
					break
				case 6:
					data.value.currentProcess = 3
					break
				case 9:
					data.value.currentProcess = 4
					break
			}
		} else {
			var processSteps = [
				{
					title: data.value.lang == 'zh' ? '提交审核' : 'Submit for Review',
					description: order.create_time,
				},
				{
					title: data.value.lang == 'zh' ? '审核完成' : 'Order Review',
				},
				{
					title: data.value.lang == 'zh' ? '支付完成' : 'Payment Completed',
				},
				{
					title: data.value.lang == 'zh' ? '生产制造' : 'Manufacturing',
				},
				{
					title: data.value.lang == 'zh' ? '快递物流' : 'Shipping',
				},
				{
					title: data.value.lang == 'zh' ? '完成' : 'Completed',
				},
			]
			switch (order.order_status) {
				case 0:
				case 2:
					data.value.currentProcess = 0
					break
				case 3:
					data.value.currentProcess = 1
					break
				case 1:
					data.value.currentProcess = 2
					break
				case 3:
					data.value.currentProcess = 5
					break
			}
		}
		data.value.process = processSteps
	}

	onBeforeMount(() => {
		const route = useRoute()
		data.value.orderNo = route.params.order_no
		if (data.value.orderNo) {
			getOrderInfo()
		}
	})
</script>
<style scoped lang="scss">
	:deep(.ant-steps-icon-dot) {
		width: 10px !important;
		height: 10px !important;
	}
	:deep(.ant-steps-item-title) {
		font-size: 14px;
	}
	.td-text {
		padding-right: 8px;
		&:last-child {
			padding-right: 0;
		}
	}
	.information {
		.flex {
			justify-content: flex-start !important;
			flex-wrap: wrap;
			gap: 4px;
		}
	}
</style>
