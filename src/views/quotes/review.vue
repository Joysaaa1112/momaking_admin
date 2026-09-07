<template>
	<div class="review-wrap">
		<div class="container">
			<a-card class="mb24">
				<a-result class="mb24" status="success" title="Order Review Submitted Successfully!">
					<template #extra>
						<router-link :to="{ path: '/' + data.lang + '/space/order/details/' + data.orderInfo.order_no }">
							<a-button key="console" type="primary">{{ data.lang == 'zh' ? '查看订单详情' : 'View Order Detail' }}</a-button>
						</router-link>
						<a-button key="buy">Get a New Quote</a-button>
					</template>
				</a-result>
			</a-card>
		</div>
	</div>
</template>
<script setup>
	import { ref, onBeforeMount } from 'vue'
	import { getOrderInfoApi } from '@/api/order'
	import { useRoute } from 'vue-router'

	const data = ref({
		lang: window.localStorage.getItem('lang') || 'zh',
		orderNo: null,
		orderInfo: {},
		process: [],
		currentProcess: ref(0),
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
					generateProcessData(data.value.orderInfo)
				}
			})
			.finally(() => {
				data.value.mainLoading = false
			})
	}
	// 生成流程进度数据
	const generateProcessData = (order) => {
		const processSteps = [
			{
				title: data.value.lang == 'zh' ? '提交订单' : 'Submit Order',
				description: order.create_time,
			},
			{
				title: data.value.lang == 'zh' ? '人工审核' : 'Manual Review',
				description:
					order.order_status === 9 ? (data.value.lang == 'zh' ? '等待审核' : 'Pending Review') : order.order_status == 8 ? '审核完成' : 'Review Completed',
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
				data.value.currentProcess = 0
				break
			case 9:
				data.value.currentProcess = 1
				break
			case 8:
				data.value.currentProcess = 1
				break
			case 1:
				data.value.currentProcess = 2
			case 3:
				data.value.currentProcess = 5
				break
		}
		data.value.process = processSteps
	}

	onBeforeMount(() => {
		const route = useRoute()
		console.log(route.params)
		data.value.orderNo = route.params.order_no
		if (data.value.orderNo) {
			getOrderInfo()
		}
	})
</script>
<style lang="scss" scoped>
	:deep(.ant-steps-icon-dot) {
		width: 10px !important;
		height: 10px !important;
	}
	:deep(.ant-steps-item-title) {
		font-size: 14px;
	}
	.review-wrap {
		padding: 30px 0;
		background-color: #f0f1f8;
	}
</style>
