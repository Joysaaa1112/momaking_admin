<template>
	<div class="checkout-wrap">
		<div class="container">
			<a-row :gutter="16">
				<a-col :span="16">
					<a-card>
						<a-collapse v-model:activeKey="activeKey" :bordered="false" style="background: rgb(255, 255, 255)">
							<template #expandIcon="{ isActive }">
								<caret-right-outlined :rotate="isActive ? 90 : 0" />
							</template>
							<a-collapse-panel key="1" header="基本信息" :style="customStyle">
								<div class="group">
									<span class="title">
										Contacts
										<span class="m"></span>
									</span>
									<span v-if="!data.info.edit">{{ data.state.first_name }} {{ data.state.last_name }}</span>
									<div v-else class="flex">
										<a-space :size="16">
											<a-input v-model:value="data.state.first_name" class="small-inp" placeholder="first name" />
											<a-input v-model:value="data.state.last_name" class="small-inp" placeholder="last name" />
										</a-space>
									</div>
								</div>
								<div class="flex group-flex simple" style="justify-content: start; align-items: center">
									<div class="group">
										<span class="title">
											Phone
											<span class="m"></span>
										</span>
										<span v-if="!data.info.edit">{{ data.state.phone_code }} {{ data.state.phone }}</span>
										<div v-else class="flex">
											<a-input-group compact>
												<a-select
													v-model:value="data.state.phone_code"
													v-model:options="data.info.phoneCodeOptions"
													show-search
													:filter-option="filterOption"
													style="width: 40%"></a-select>
												<a-input v-model:value="data.state.phone" style="width: 60%" placeholder="phone number" />
											</a-input-group>
										</div>
									</div>
								</div>
								<div class="group">
									<a class="link" v-if="!data.info.edit" @click="data.info.edit = !data.info.edit">Edit</a>
									<div v-else class="group group-buttons">
										<a-button type="link" @click="data.info.edit = false">Cancel</a-button>
										<a-button type="link" @click="saveInfo(1, 1)" :loading="data.info.saveLoading">Save</a-button>
									</div>
								</div>
							</a-collapse-panel>
							<a-collapse-panel key="2" :header="data.lang == 'zh' ? '收货地址' : 'Shipping Address'" :style="customStyle">
								<div class="flex group-flex simple" style="justify-content: start; align-items: center">
									<div class="group">
										<span class="title">
											Country
											<span class="m"></span>
										</span>
										<span v-if="!data.shipping.edit">{{ data.state.country }}</span>
										<div class="" v-else>
											<a-select
												v-model:value="data.state.country"
												v-model:options="data.shipping.countries"
												show-search
												:filter-option="filterOption"
												@change="countryChange()"
												class="small-inp"
												placeholder="Select a country"></a-select>
										</div>
									</div>
									<div class="group">
										<span class="title">
											State
											<span class="m"></span>
										</span>
										<span v-if="!data.shipping.edit">{{ data.state.state }}</span>
										<div class="" v-else>
											<a-select
												v-model:value="data.state.state"
												v-model:options="data.shipping.states"
												show-search
												:filter-option="filterOption"
												class="small-inp"
												placeholder="Select a state"></a-select>
										</div>
									</div>
								</div>
								<div class="flex group-flex simple" style="justify-content: start; align-items: center">
									<div class="group">
										<span class="title">
											Town/City
											<span class="m"></span>
										</span>
										<span v-if="!data.shipping.edit">{{ data.state.city }}</span>
										<div v-else>
											<a-input v-model:value="data.state.city" placeholder="Town/city" />
										</div>
									</div>
									<div class="group">
										<span class="title">
											Postal code
											<span class="m" v-if="data.lang != 'zh'"></span>
										</span>
										<span v-if="!data.shipping.edit">{{ data.state.postal_code }}</span>
										<div v-else>
											<a-input v-model:value="data.state.postal_code" placeholder="Postal code" />
										</div>
									</div>
								</div>
								<div class="group">
									<span class="title">
										Address1
										<span class="m"></span>
									</span>
									<span v-if="!data.shipping.edit">{{ data.state.address }}</span>
									<div v-else>
										<a-input v-model:value="data.state.address" placeholder="Address1" />
									</div>
								</div>
								<div class="group">
									<span class="title">Address2</span>
									<span v-if="!data.shipping.edit">{{ data.state.address1 }}</span>
									<div v-else>
										<a-input v-model:value="data.state.address1" placeholder="Address2" />
									</div>
								</div>
								<div class="group">
									<a class="link" v-if="!data.shipping.edit" @click="data.shipping.edit = !data.shipping.edit">Edit</a>
									<div v-else class="group group-buttons">
										<a-button type="link" @click="data.shipping.edit = false">Cancel</a-button>
										<a-button type="link" @click="saveInfo(2, 2)" :loading="data.shipping.saveLoading">Save</a-button>
									</div>
								</div>
							</a-collapse-panel>
							<a-collapse-panel key="3" :header="data.lang == 'zh' ? '备注' : 'Notes'" :style="customStyle">
								<div class="group">
									<span class="title">Notes</span>
									<span v-if="!data.notes.edit">{{ data.state.notes == '' ? '-' : data.state.notes }}</span>
									<div v-else>
										<a-textarea v-model:value="data.state.notes"></a-textarea>
									</div>
								</div>
								<div class="group">
									<a class="link" v-if="!data.notes.edit" @click="data.notes.edit = !data.notes.edit">Edit</a>
									<div v-else class="group group-buttons">
										<a-button type="link" @click="data.notes.edit = false">Cancel</a-button>
										<a-button type="link" @click="saveInfo(2, 3)" :loading="data.notes.saveLoading">Save</a-button>
									</div>
								</div>
							</a-collapse-panel>
							<a-collapse-panel key="4" :header="data.lang == 'zh' ? '产品信息' : 'Products'" :style="customStyle">
								<div class="table-responsive">
									<a-table :dataSource="data.orderInfo.goods" :columns="goodsTableColumns" :pagination="false"></a-table>
								</div>
							</a-collapse-panel>
						</a-collapse>
					</a-card>
				</a-col>
				<a-col :span="8">
					<a-card :title="'Order summary'">
						<div class="order-summary-lines">
							<div class="summary-line">
								<span class="left">预计发货日期</span>
								<span class="right">{{ data.payment.shippingDate }}</span>
							</div>
							<div class="summary-line">
								<span class="left">订单价值</span>
								<span class="right">￥{{ data.orderInfo.goods_price }}</span>
							</div>
							<div class="summary-line">
								<span class="left">运费</span>
								<span class="right">￥{{ data.orderInfo.shipping_price }}</span>
							</div>
						</div>
						<div class="total-line">
							<div class="title">总价</div>
							<div class="price">￥{{ data.orderInfo.total_price }}</div>
						</div>
						<div class="section-line"></div>
						<div class="payment-buttons">
							<a-button type="primary" size="large" block :disabled="data.payment.buttonDisabled" :loading="data.payment.loading" @click="confirmOrder(true)">
								立即支付
							</a-button>
						</div>
					</a-card>
				</a-col>
			</a-row>
		</div>
	</div>
</template>

<script setup>
	import { ref, onBeforeMount, watch, computed } from 'vue'
	import { CaretRightOutlined } from '@ant-design/icons-vue'
	import { getOrderInfoApi, orderConfirmApi } from '@/api/order'
	import { getCountriesApi, getStatesApi } from '@/api/geo'
	import { saveUserInfoApi } from '@/api/user'
	import { useRoute } from 'vue-router'
	import { notification } from 'ant-design-vue'
	import { useUserStore } from '@/store/modules/user'

	const activeKey = ref(['1', '2', '3', '4'])
	const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`
	const customStyle = 'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden'

	const data = ref({
		lang: localStorage.getItem('lang') || 'zh',
		orderNo: null,
		orderInfo: {},
		goodsColumnsZh: [
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '数量',
				dataIndex: 'quantity',
				key: 'quantity',
			},
			{
				title: '单价',
				dataIndex: 'unit_price',
				key: 'unit_price',
			},
			{
				title: '总价',
				dataIndex: 'total_price',
				key: 'total_price',
			},
		],
		goodsColumnsEn: [
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '数量',
				dataIndex: 'quantity',
				key: 'quantity',
			},
			{
				title: '单价',
				dataIndex: 'unit_price',
				key: 'unit_price',
			},
			{
				title: '总价',
				dataIndex: 'total_price',
				key: 'total_price',
			},
		],
		userInfo: {},
		info: {
			edit: false,
			saveLoading: false,
			phoneCodeOptions: [],
		},
		shipping: {
			edit: false,
			saveLoading: false,
			countries: [],
			states: [],
		},
		notes: {
			edit: false,
			saveLoading: false,
		},
		state: {
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			country: undefined,
			state: undefined,
			city: '',
			postal_code: '',
			address: '',
			address2: '',
			notes: '',
		},
		payment: {
			loading: false,
			selected: 1,
			disabled: false,
			checkWechatInterval: null,
			shippingDate: '',
			options: [
				{
					label: '微信支付',
					value: 1,
				},
				{
					label: '支付宝',
					value: 2,
					disabled: false,
				},
				{
					label: 'Stripe',
					value: 3,
					disabled: true,
				},
				{
					label: 'Paypal',
					value: 4,
					disabled: true,
				},
				{
					label: 'Credit card',
					value: 5,
					disabled: true,
				},
			],
			wechatModal: {
				visible: false,
				qrcode: '',
				out_trade_no: '',
			},
			aliModal: {
				visible: false,
			},
		},
	})
	const goodsTableColumns = computed(() => {
		return data.value.lang === 'zh' ? data.value.goodsColumnsZh : data.value.goodsColumnsEn
	})
	// 设置用户信息的通用函数
	const setUserInfo = (info) => {
		if (info.first_name) data.value.state.first_name = info.first_name
		if (info.last_name) data.value.state.last_name = info.last_name
		if (info.phone_code || (window.lang === 'zh' && !info.phone_code)) {
			data.value.state.phone_code = info.phone_code || '+86'
		}
		if (info.mobile) data.value.state.phone = info.mobile
		if (info.country_code) data.value.state.country = info.country_code
		if (info.state_code) data.value.state.state = info.state_code
		if (info.city) data.value.state.city = info.city
		if (info.postal_code) data.value.state.postal_code = info.postal_code
		if (info.address) data.value.state.address = info.address
		if (info.address1) data.value.state.address1 = info.address1
		if (info.notes) data.value.state.notes = info.notes
	}
	// 订单信息
	const getOrderInfo = async () => {
		const payload = { order_no: data.value.orderNo }
		const response = await getOrderInfoApi(payload)

		if (response.code === 0) {
			const orderData = response.data
			data.value.orderInfo = { ...orderData }
			if (data.value.orderInfo) {
				setUserInfo(data.value.orderInfo)
			}

			const pcsQuantity = data.value.orderInfo.goods.reduce((total, item) => total + item.quantity, 0)
			data.value.payment.shippingDate = calculateShippingDate(pcsQuantity)
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

	const countryChange = () => {
		getStates(data.value.state.country)
	}
	// 国家
	const getCountries = async () => {
		const response = await getCountriesApi()
		if (response.code === 0) {
			const countryData = response.data
			// 处理国家数据
			data.value.shipping.countries = response.data.map((country) => {
				return {
					label: country.english_name + ' (' + country.code + ')',
					value: country.code,
					id: country.id,
				}
			})
			const uniquePhoneCodes = new Set()
			const uniqueItems = response.data.filter((item) => {
				if (!uniquePhoneCodes.has(item.phone_code)) {
					uniquePhoneCodes.add(item.phone_code)
					return true
				}
				return false
			})
			data.value.info.phoneCodeOptions = uniqueItems.map((item) => {
				const phone_code = item.phone_code.replace('+', '')
				return {
					label: '+ ' + phone_code,
					value: '+' + item.phone_code,
				}
			})
			// 根据选中的国家获取地区
			if (data.value.state.country) {
				getStates(data.value.state.country)
			}
		}
	}

	// 地区
	const getStates = async (country_code) => {
		var response = await getStatesApi({ country_code: country_code })
		if (response.code === 0) {
			const stateData = response.data
			data.value.shipping.states = response.data.map((state) => {
				return {
					label: state.name,
					value: state.code,
					id: state.id,
				}
			})
		}
	}

	const filterOption = (input, option) => {
		return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
	}

	const saveInfo = (type, n) => {
		if (type == undefined) {
			type = 1
		}
		var payload
		if (type == 1) {
			payload = data.value.state
			payload.mobile = payload.phone
		} else {
			payload = {
				order_no: data.value.orderNo,
				notes: data.value.state.notes,
				phone_code: data.value.state.phone_code,
				mobile: data.value.state.phone,
				country_code: data.value.state.country,
				state_code: data.value.state.state,
				city: data.value.state.city,
				address: data.value.state.address,
				address1: data.value.state.address1,
				postal_code: data.value.state.postal_code,
			}
		}
		payload.email = undefined

		payload.type = type
		makeSaveLoading(n, 1)
		saveUserInfoApi(payload)
			.then((result) => {
				confirmOrder()
			})
			.catch((err) => {})
			.finally(() => {
				makeSaveLoading(n, 2)
			})
	}
	const makeSaveLoading = (n, t) => {
		if (t == 1) {
			switch (n) {
				case 1:
					data.value.info.saveLoading = true
					break
				case 2:
					data.value.shipping.saveLoading = true
					break
				case 3:
					data.value.notes.saveLoading = true
					break
			}
		} else {
			switch (n) {
				case 1:
					data.value.info.saveLoading = false
					break
				case 2:
					data.value.shipping.saveLoading = false
					break
				case 3:
					data.value.notes.saveLoading = false
					break
			}
		}
	}
	// 确认订单
	const confirmOrder = (jump) => {
		data.value.payment.loading = true
		var payload = {
			order_no: data.value.orderNo,
			email: data.value.userInfo.email,
			first_name: data.value.state.first_name,
			last_name: data.value.state.last_name,
			phone_code: data.value.state.phone_code,
			phone_number: data.value.state.phone,
			country_code: data.value.state.country,
			state_code: data.value.state.state,
			city: data.value.state.city,
			postal_code: data.value.state.postal_code,
			address: data.value.state.address,
			address1: data.value.state.address1,
			notes: data.value.state.notes,
		}
		orderConfirmApi(payload)
			.then((result) => {
				if (result.code == 0 && jump == true) {
					window.location.href = '/' + data.value.lang + '/space/payment/' + data.value.orderNo
				}
			})
			.finally(() => {
				data.value.payment.loading = false
			})
	}
	const userStore = useUserStore()
	// 用户信息
	const getUserInfo = () => {
		data.value.userInfo = userStore.currentUser

		if (data.value.userInfo) {
			setUserInfo(data.value.userInfo)
		}
	}
	const calculateShippingDate = (itemCount) => {
		// 获取当前日期
		const initialDate = new Date()

		// 计算处理天数：基础3天 + 每10个商品增加1天
		let processingDays = Math.max(3, Math.ceil(itemCount / 10) + 1)
		let shippingDate = new Date(initialDate)

		// 计算发货日期，逐天递增
		shippingDate.setDate(shippingDate.getDate() + processingDays)

		// 格式化日期为 YYYY.MM.DD
		const year = shippingDate.getFullYear()
		const month = String(shippingDate.getMonth() + 1).padStart(2, '0')
		const day = String(shippingDate.getDate()).padStart(2, '0')
		const formattedDate = `${year}.${month}.${day}`

		return formattedDate
	}
	watch(
		() => data.value.state,
		(newValue) => {
			if (
				(newValue.first_name || newValue.last_name) &&
				newValue.phone_code &&
				newValue.phone &&
				newValue.country &&
				newValue.state &&
				newValue.city &&
				newValue.address
			) {
				if (window.lang == 'zh') {
					data.value.payment.buttonDisabled = false
				} else {
					if (newValue.postal_code) {
						data.value.payment.buttonDisabled = false
					}
				}
			} else {
				data.value.payment.buttonDisabled = true
			}
		},
		{
			deep: true,
		},
	)
	onBeforeMount(async () => {
		const route = useRoute()
		const orderNo = route.params.order_no
		data.value.orderNo = orderNo
		if (orderNo) {
			getUserInfo()
			await getOrderInfo()
		}
		await getCountries()
	})
</script>

<style lang="scss" scoped>
	.checkout-wrap {
		padding: 30px 0;
		background-color: #f0f1f8;
		.flex {
			&.group-flex {
				margin-bottom: 16px;
			}
			&.simple {
				justify-content: start;
				align-items: center;
			}
			.group {
				margin-bottom: 0;
				margin-right: 24px;
				&:last-child {
					margin-right: 0;
				}
			}
		}
		.group {
			display: flex;
			align-items: center;
			color: #000;
			margin-bottom: 16px;
			flex-wrap: wrap;
			gap: 12px;

			&:last-child {
				margin-bottom: 0;
			}
			.title {
				color: #666;
				&::after {
					content: ':';
					padding-left: 2px;
				}
				.m {
					color: #ff0140;
					&::after {
						content: '*';
					}
				}
			}
		}
	}
	:deep(.ant-collapse-header) {
		padding: 8px 16px !important;
	}
	:deep(.ant-collapse-content-box) {
		padding: 16px !important;
		background-color: #fff;
	}
	.small-inp {
		width: 160px;
	}
	.order-summary-lines .summary-line,
	.payment-methods .payment-line {
		font-variant: tabular-nums;
		display: flex;
		align-items: center;
		color: #253843;
		font-size: 14px;
		font-weight: 500;
		justify-content: space-between;
		line-height: 28px;
		margin-bottom: 12px;
	}
	.order-summary-lines .summary-line span.left {
		display: inline-block;
	}
	.order-summary-lines .summary-line span.left::after,
	.total-line .title::after,
	.payment-methods .payment-line span.left::after {
		content: ':';
		padding-left: 2px;
	}
	.total-line {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24px;
	}
	.total-line .title {
		font-size: 17px;
		font-weight: 700;
		line-height: 23px;
	}
	.total-line .price {
		color: #ff0003;
		font-size: 17px;
		font-weight: 600;
		line-height: 23px;
	}
	.total-line .vat {
		font-size: 12px;
	}
	.section-line {
		margin-bottom: 16px;
		border-top: 2px dashed #e8e8e8;
	}
	.payment-buttons {
		span {
			transform: unset !important;
		}
	}
	.group-buttons {
		button {
			padding: 0;
		}
	}
</style>
