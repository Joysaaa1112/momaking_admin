<template>
	<div class="payment-wrap">
		<div class="container">
			<div class="row mb16" v-if="data.orderInfo.pay_status == 1">
				<div class="col-12">
					<a-card>
						<a-result status="success" :title="data.lang == 'en' ? 'Your payment has been successfully processed' : '您的付款已成功处理'">
							<template #extra>
								<router-link :to="{ path: '/' + data.lang + '/space/order/list' }">
									<a-button type="primary" key="orderList">查看订单列表</a-button>
								</router-link>
								<router-link :to="{ path: '/' + data.lang + '/space/quotes/upload' }">
									<a-button key="buy">新的报价</a-button>
								</router-link>
							</template>
						</a-result>
					</a-card>
				</div>
			</div>
			<div class="row mb16">
				<div class="col-12">
					<a-card :title="'订单详情'">
						<a-table :dataSource="data.goods.source" :columns="data.goods.columns" bordered :pagination="false">
							<template #bodyCell="{ column, record }">
								<template v-if="column.key === 'goods'">
									<li v-for="(goods, index) in record.goods" :key="index">
										{{ goods.name }}
									</li>
								</template>
								<template v-if="column.key === 'total_price'">
									<span class="price">￥{{ record.total_price }}</span>
								</template>
							</template>
						</a-table>
					</a-card>
				</div>
			</div>
			<div class="row mb16" v-if="data.orderInfo.pay_status == 0">
				<div class="col-12">
					<a-card :title="'支付方式'">
						<div class="payment-methods">
							<a-button
								class="payment-item"
								v-for="(method, index) in data.paymentMethods"
								:key="index"
								:disabled="method.disabled || method.locked"
								:class="method.checked ? 'primary' : 'default'"
								@click="choosePayment(method.id)">
								<span class="icon" :style="{ 'background-color': method.backgroundColor }">
									<svg-icon v-if="method.icon" :name="method.icon" :color="method.color" />
								</span>
								<span>{{ method.name }}</span>
							</a-button>
						</div>
						<div class="payment-container" v-if="data.main.paymentContentVisit">
							<div class="payment-loading-wrap" v-if="data.main.paymentContentLoading">
								<a-spin />
							</div>
							<div v-else>
								<div class="flex" v-if="data.main.methodId == 2">
									<div class="wechat-payment">
										<div class="wechat-payment-head">
											<img src="@/assets/images/wechat-pay-full.png" />
										</div>
										<div class="wechat-payment-content">
											<a-qrcode :size="252" color="#000" bg-color="#fff" :value="data.main.payment.wechatPayQrCodeUrl" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</a-card>
				</div>
			</div>
			<div class="row" v-if="data.orderInfo.pay_status == 0">
				<div class="col-12">
					<a-card class="payment-footer">
						<div class="flex">
							<div class="method">
								<span class="title">支付方式</span>
								<span class="text">
									<span class="icon" :style="{ 'background-color': data.main.method.backgroundColor }">
										<svg-icon v-if="data.main.method.icon" :name="data.main.method.icon" :color="data.main.method.color" />
									</span>
									<span>{{ data.main.method.name }}</span>
								</span>
							</div>
							<div class="summary">
								<div class="flex">
									<div class="method">
										<span class="title">总计</span>
										<span class="text">
											<span class="price">￥{{ data.orderInfo.total_price }}</span>
										</span>
									</div>
									<div class="method" v-if="!data.main.paymentContentVisit">
										<a-button type="primary" @click="pay()">立即支付</a-button>
									</div>
									<div class="method buttons-method" v-else>
										<a-button @click="changeMethod()">更换支付方式</a-button>
									</div>
								</div>
							</div>
						</div>
					</a-card>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import { ref, onBeforeMount } from 'vue'
	import { useRoute } from 'vue-router'
	import { getOrderInfoApi } from '@/api/order'
	import { wechatNativeApi, wechatOrderQueryApi } from '@/api/payment'
	import { notification } from 'ant-design-vue'

	const data = ref({
		lang: localStorage.getItem('lang') || 'zh',
		orderNo: null,
		orderInfo: {},
		main: {
			methodId: 2,
			method: null,
			paymentContentVisit: false,
			paymentContentLoading: false,
			payment: {
				wechatNativeOutTradeNo: null,
				wechatPayQrCodeUrl: '',
				wechatPayTimer: null,
			},
		},
		goods: {
			source: [],
			columns: [
				{
					title: '订单编号',
					dataIndex: 'order_no',
					key: 'order_no',
				},
				{
					title: '订单类型',
					dataIndex: 'order_name',
					key: 'order_name',
				},
				{
					title: '产品预览',
					dataIndex: 'goods',
					key: 'goods',
				},
				{
					title: '下单时间',
					dataIndex: 'create_time',
					dataIndex: 'create_time',
				},
				{
					title: '订单金额',
					dataIndex: 'total_price',
					key: 'total_price',
				},
			],
		},
		paymentMethods: [
			{
				id: 1,
				name: window.lang == 'en' ? 'Balance' : '余额',
				icon: 'cash-outline',
				color: '#fff',
				backgroundColor: '#adc0d3',
				disabled: true,
				checked: false,
				locked: false,
			},
			{
				id: 2,
				name: window.lang == 'en' ? 'Wechat Pay' : '微信支付',
				icon: 'logo-wechat-pay',
				color: '#fff',
				backgroundColor: '#cfe9d3',
				disabled: false,
				checked: true,
				locked: false,
			},
			{
				id: 3,
				name: window.lang == 'en' ? 'Ali Pay' : '支付宝支付',
				icon: 'logo-alipay',
				color: '#fff',
				backgroundColor: '#1677ff',
				disabled: true,
				checked: false,
				locked: false,
			},
			{
				id: 4,
				name: window.lang == 'en' ? 'Corporate Transfer' : '对公转账',
				icon: 'card-outline',
				color: '#fff',
				backgroundColor: '#f0b90b',
				disabled: false,
				checked: false,
				locked: false,
			},
		],
	})
	// 立即支付
	const pay = async () => {
		data.value.main.paymentContentVisit = true
		data.value.main.paymentContentLoading = true
		// 锁定所有方法
		lockMethods()

		try {
			switch (data.value.main.methodId) {
				case 1:
					// Handle payment method 1
					break
				case 2:
					// Handle WeChat Pay
					await wechatNative()
					break
				case 3:
					// Handle payment method 3
					break
				case 4:
					// Handle payment method 4
					break
			}
		} catch (error) {
			// 如果有错误，解锁所有方法
			unlockMethods()
		} finally {
			data.value.main.paymentContentLoading = false
		}
	}

	const wechatNative = async () => {
		try {
			const res = await wechatNativeApi({
				order_no: data.value.orderNo,
			}).then(async (res) => {
				console.log(res.data)
				data.value.main.payment.wechatPayQrCodeUrl = res.data.code_url
				data.value.main.payment.wechatNativeOutTradeNo = res.data.out_trade_no
				// 轮询支付结果
				// 轮询支付结果
				data.value.main.payment.wechatPayTimer = setInterval(async () => {
					const result = await wechatOrderQueryApi({ out_trade_no: data.value.main.payment.wechatNativeOutTradeNo })
					if (result.code === 0) {
						clearInterval(data.value.main.payment.wechatPayTimer)
						notification.success({
							message: window.lang === 'en' ? 'Payment success' : '支付成功',
							description: window.lang === 'en' ? 'Your payment has been successfully processed.' : '您的支付已成功处理。',
						})
						setTimeout(() => {
							window.location.reload()
						}, 1000)
					} else if (result.code == 10001) {
					} else {
						clearInterval(data.value.main.payment.wechatPayTimer)
						notification.error(result.msg)
					}
				}, 3000)

				// 设置超时机制
				data.value.main.payment.timeoutTimer = setTimeout(() => {
					clearInterval(data.value.main.payment.wechatPayTimer)
					// 取消支付的处理逻辑
					unlockMethods() // 解锁方法
					notification.error({
						message: 'Error',
						description: window.lang === 'en' ? 'Payment timeout, please try again.' : '支付超时，请重新尝试',
					})
				}, 5 * 60 * 1000) // 5分钟
			})
			// Handle the response from the API
		} catch (error) {
			// Handle the error
			unlockMethods() // 解锁方法在API调用失败时
		}
	}
	// 更换支付方式
	const changeMethod = () => {
		data.value.main.paymentContentVisit = false
		data.value.main.paymentContentLoading = false
		unlockMethods()
	}
	//锁定支付方式
	const lockMethods = (id) => {
		data.value.paymentMethods.forEach((item) => {
			if (id !== undefined) {
				if (item.id === id) {
					item.locked = true
				}
			} else {
				item.locked = true
			}
		})
	}
	//解锁支付方式
	const unlockMethods = (id) => {
		data.value.paymentMethods.forEach((item) => {
			if (id !== undefined) {
				if (item.id === id) {
					item.locked = false
				}
			} else {
				item.locked = false
			}
		})
	}

	// 获取订单详情
	const getOrderInfo = async () => {
		const payload = { order_no: data.value.orderNo }
		const response = await getOrderInfoApi(payload)

		if (response.code === 0) {
			const orderData = response.data
			data.value.orderInfo = { ...orderData }
			data.value.goods.source = [
				{
					order_no: orderData.order_no,
					order_name: orderData.order_name,
					total_price: orderData.total_price,
					create_time: orderData.create_time,
					goods: orderData.goods.map((item) => {
						return {
							name: item.name,
						}
					}),
				},
			]
			console.log(data.value.goods.source)

			const pcsQuantity = data.value.orderInfo.goods.reduce((total, item) => total + item.quantity, 0)
			// data.value.payment.shippingDate = calculateShippingDate(pcsQuantity)
		} else if (response.code === 401) {
			notification.error({
				message: 'Error',
				description: window.lang === 'en' ? 'Session expired, please log in again.' : '登录失效，请重新登录',
			})

			window.localStorage.removeItem('authorization')
			window.localStorage.removeItem('uuid')
			window.localStorage.removeItem('member')

			setTimeout(() => {
				window.location.href = `/${window.lang}/signin?redirect=${encodeURIComponent(window.location.pathname)}`
			}, 2000)
		}
	}
	// 支付方式选择
	const choosePayment = (id) => {
		data.value.paymentMethods.forEach((item) => {
			if (item.id === id) {
				item.checked = true
			} else {
				item.checked = false
			}
		})
		data.value.main.methodId = id
		data.value.main.method = getPaymentMethod(id)
	}
	// 获取支付方式
	const getPaymentMethod = (id) => {
		return data.value.paymentMethods.find((item) => item.id === id)
	}
	onBeforeMount(async () => {
		// 默认支付方式
		data.value.main.method = getPaymentMethod(data.value.main.methodId)
		const route = useRoute()
		data.value.orderNo = route.params.order_no
		if (data.value.orderNo) {
			await getOrderInfo()
		}
	})
</script>
<style scoped lang="scss">
	.payment-wrap {
		padding: 30px 0;
		background-color: #f0f1f8;
		.mb16 {
			margin-bottom: 16px;
		}
		.payment-methods {
			display: flex;
			flex-wrap: wrap;
			gap: 16px;
			.payment-item {
				display: flex;
				align-items: center;
				transition: 0.3s all ease-in;
				border-radius: 4px;
				cursor: pointer;
				height: 42px;
				&[disabled] {
					cursor: not-allowed;
				}
				&:hover,
				&.primary {
					color: #353535;
					border-color: #4096ff;
					background-color: #f7faff;
				}
				.icon {
					display: block;
					width: 24px;
					height: 24px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 8px;
				}
			}
		}
		.payment-container {
			background-color: #f7faff;
			padding: 24px;
			border-radius: 4px;
			margin-top: 16px;
			position: relative;
			min-height: 150px;
			.payment-loading-wrap {
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				z-index: 1;
				background-color: rgba(255, 255, 255, 0.8);
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.wechat-payment {
				width: 300px;
			}
			.wechat-payment {
				width: 300px;
				border-radius: 15px;
				overflow: hidden;
				box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
				user-select: none;
				.wechat-payment-head {
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #fff;
					padding: 12px 0;
					img {
						height: 38px;
						display: block;
					}
				}
				.wechat-payment-content {
					background-color: #00c800;
					padding: 24px;
					img {
						width: 252px;
						display: block;
					}
				}
			}
		}
		.payment-footer {
			.method {
				display: flex;
				align-items: center;
				margin-right: 16px;
				&.buttons-method {
					button {
						margin-right: 16px;
						&:last-child {
							margin-right: 0;
						}
					}
				}
				&:last-child {
					margin-right: 0;
				}
				.title {
					&::after {
						content: ':';
						padding: 0 2px 0 4px;
					}
				}
				.text {
					display: flex;
					align-items: center;
					margin-left: 16px;
				}
				.icon {
					display: block;
					width: 24px;
					height: 24px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 8px;
				}
			}
		}
		.price {
			color: #52af00;
			font-weight: 600;
			font-size: 18px;
		}
	}
</style>
