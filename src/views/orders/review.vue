<template>
	<div class="body-container">
		<a-page-header class="demo-page-header" :title="data.lang == 'zh' ? 'CNC报价单审核' : 'Purchase Order'" @back="() => $router.go(-1)">
			<template #extra>
				<a-button key="3" :disabled="true">下载全部图纸</a-button>
				<a-button key="1" :loading="data.main.processLoading" @click="saveQuote(4)">拒绝流程</a-button>
				<a-button key="1" :loading="data.main.processLoading" @click="saveQuote(3)">通过流程</a-button>
			</template>
		</a-page-header>
		<a-card>
			<div class="review-wrap">
				<div class="html-container" id="content">
					<div class="hmtl-header">
						<img class="bg" src="@/assets/images/document-bg.png" />
						<img v-if="data.lang == 'zh'" class="r-logo" src="@/assets/images/9-3.png" />
						<img v-else class="r-logo" src="@/assets/images/9-2.png" />
						<span class="title" style="color: #fff">{{ data.main.quotationTitle }}</span>
					</div>
					<div class="sub-header">
						<div class="flex" v-if="data.main.orderInfo">
							<div class="left">
								<div class="item" style="color: #1b8bf5">{{ data.lang == 'zh' ? '客户信息' : 'Customer' }}</div>
								<div class="item">{{ data.lang == 'zh' ? '联系人' : 'Contact' }}：{{ data.main.orderInfo.last_name }} {{ data.main.orderInfo.first_name }}</div>
								<div class="item company-item" v-if="!data.main.userCompany.hidden">
									{{ data.lang == 'zh' ? '公司' : 'Company' }}：
									<span style="padding-right: 8px">
										<span v-if="!data.main.userCompany.visit">
											{{ data.main.orderInfo.user?.company ? data.main.orderInfo.user.company : data.lang == 'zh' ? '无' : 'None' }}
										</span>
										<a-input v-model:value="data.main.orderInfo.user.company" v-else style="width: 120px"></a-input>
									</span>
									<a class="link" v-if="!data.main.userCompany.visit" @click="data.main.userCompany.visit = true">编辑</a>
									<a class="link" v-else @click="data.main.userCompany.visit = false">确认</a>
									<a class="link" @click="data.main.userCompany.hidden = true">隐藏</a>
								</div>
								<div class="item">{{ data.lang == 'zh' ? '联系电话' : 'Phone' }}：{{ data.main.orderInfo.phone_code }} {{ data.main.orderInfo.mobile }}</div>
								<div class="item">{{ data.lang == 'zh' ? '收货地址' : 'Address' }}：{{ data.main.orderInfo.address }}</div>
							</div>
							<div class="right">
								<div class="item" style="color: #1b8bf5">{{ data.lang == 'zh' ? '合同信息' : 'Contract' }}</div>
								<div class="item">{{ data.lang == 'zh' ? '订单编号' : 'Order Number' }}: {{ data.main.orderInfo?.order_no }}</div>
								<div class="item">{{ data.lang == 'zh' ? '签订日期' : 'Date of Signing' }}: {{ data.main.orderInfo?.create_time }}</div>
							</div>
						</div>
					</div>
					<table class="mk-table">
						<thead>
							<tr v-if="data.lang == 'en'">
								<th>SL</th>
								<th>Image</th>
								<th>Weight/Size</th>
								<th>Materials</th>
								<th>Rmarks</th>
								<th>Quantity</th>
								<th>Price(Inc VAT)</th>
								<th>Total(Inc VAT)</th>
							</tr>
							<tr v-else>
								<th>序号</th>
								<th>预览图</th>
								<th>重量/尺寸</th>
								<th>材料</th>
								<th>备注</th>
								<th>数量</th>
								<th>单价</th>
								<th>合计</th>
							</tr>
						</thead>
						<tbody>
							<tr v-if="data.main.loading">
								<td colspan="6" style="height: 100px">
									<a-spin />
								</td>
							</tr>
							<tr v-for="(item, index) in data.main.source" :key="index">
								<td>{{ index + 1 }}</td>
								<td><img @click="showPreviewModal(item)" class="td-image pointer" :src="item.preview_base64" /></td>
								<td>
									<p class="mg8">{{ (item.goods_data.weight * 1).toFixed(2) }}g</p>
									<p class="mg8">{{ item.goods_data.width }}x{{ item.goods_data.height }}x{{ item.goods_data.length }}mm</p>
									<p>{{ item.name }}</p>
								</td>
								<td style="font-size: 13px">
									<div class="information">
										<div class="flex">
											<span>{{ item.goods_data.configure_text?.process }}</span>
										</div>
										<div class="flex">
											<span>{{ item.goods_data.configure_text?.material }}</span>
										</div>
										<div class="flex" v-if="item.goods_data.configure_text?.color">
											<span>{{ item.goods_data.configure_text?.color }}</span>
										</div>
										<div class="flex" v-if="item.goods_data.configure_text?.surface">
											<a-tag v-for="(surface, index) in item.goods_data.configure_text?.surface" :key="index">{{ surface.label }}</a-tag>
										</div>
									</div>
								</td>
								<td style="font-size: 13px">{{ item.attr_data.remarks == undefined ? (data.lang == 'en' ? 'None' : '无') : item.attr_data.remarks }}</td>
								<td>{{ item.quantity }}</td>
								<td>￥{{ item.unit_price }}</td>
								<td>￥{{ item.total_price }}</td>
							</tr>
							<tr class="other">
								<td colspan="8">
									<p>{{ data.lang == 'zh' ? '运费' : 'Shipping Cost' }}: ￥{{ data.main.orderInfo.shipping_price }}</p>
								</td>
							</tr>
							<tr class="total" v-if="data.lang == 'zh'">
								<td colspan="5">总计 :</td>
								<td>{{ numberToChinese(data.main.total.toFixed(2)) }}</td>
								<td>￥{{ data.main.firstTotal.toFixed(2) }}</td>
								<td>￥{{ data.main.total.toFixed(2) }}</td>
							</tr>
							<tr class="total" v-else>
								<td colspan="6">TOTAL :</td>
								<td>￥{{ data.main.firstTotal.toFixed(2) }}</td>
								<td>￥{{ data.main.total.toFixed(2) }}</td>
							</tr>
						</tbody>
					</table>
					<div class="footer">
						<div class="flex" style="justify-content: space-between; align-items: baseline">
							<section class="company-section">
								<div class="item">供方：深圳市波士谭管理科技有限公司</div>
								<div class="item">联系人：罗女士</div>
								<div class="item">联系电话：0755-23696802</div>
								<div class="item" style="vertical-align: top">
									甲方审核盖章：
									<img width="150" height="150" src="@/assets/images/zhang.png" />
								</div>
							</section>
							<section class="company-section">
								<div class="item">
									<p>客户服务：</p>
									<img width="120" height="120" style="border: 1px solid #e8e8e8; border-radius: 8px" src="@/assets/images/service-qr-code-1.png" />
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>
			<a-modal v-model:open="data.main.supply.modal.visit" @ok="chooseSupply">
				<div class="group" style="padding: 42px 0 16px">
					<a-select
						v-model:value="data.main.supply.id"
						class="full"
						:placeholder="data.lang == 'zh' ? '请选择供应商' : 'Please select a supplier'"
						v-model:options="data.main.supplySource"></a-select>
				</div>
			</a-modal>
		</a-card>
	</div>
</template>
<script setup>
	import { onBeforeMount, ref } from 'vue'
	import { getAdminOrderInfoApi } from '@/api/order'
	import { useRoute } from 'vue-router'
	import { DownloadOutlined } from '@ant-design/icons-vue'
	import { supplyList } from '@/api/supply'
	import html2canvas from 'html2canvas'
	import jsPDF from 'jspdf'
	import { uploadOffline } from '@/api/upload'
	import { processOrderApi } from '@/api/quote'
	import { message } from 'ant-design-vue'
	import { resolveStaticUrl } from '@/utils/url'

	const data = ref({
		lang: window.lang,
		supplyPrice: 0.3,
		main: {
			supplySource: [],
			supply: {
				id: undefined,
				name: undefined,
				contact: undefined,
				phone: undefined,
				fax: undefined,
				modal: {
					visit: false,
				},
			},
			userCompany: {
				visit: false,
				hidden: false,
			},
			quotationTitle: '',
			loading: false,
			pwd: null,
			orderNo: undefined,
			quoteNo: undefined,
			userInfo: {
				first_name: '-',
				last_name: '-',
				email: '',
				mobile: '',
			},
			orderInfo: {
				shipping_price: '0.00',
			},
			source: [],
			firstTotal: 0,
			total: 0,
			processLoading: false,
			pdfPath: undefined,
			pdfName: undefined,
			processOrderBtnLoading: false,
		},
		viewer: {
			visit: false,
			url: '',
		},
	})
	// 防抖函数
	const debounce = (func, wait) => {
		let timeout
		return function (...args) {
			clearTimeout(timeout)
			timeout = setTimeout(() => func.apply(this, args), wait)
		}
	}

	// 打开供应商选择弹窗
	const showSupplyMokdal = () => {
		if (data.value.main.supplySource.length == 0) {
			getSupplyList()
		}
		data.value.main.supply.modal.visit = true
	}

	const chooseSupply = () => {
		const item = data.value.main.supplySource.find((item) => item.value == data.value.main.supply.id)
		data.value.main.supply.id = item.value
		data.value.main.supply.name = item.label
		data.value.main.supply.contact = item.contact
		data.value.main.supply.phone = item.phone
		data.value.main.supply.fax = item.fax
		data.value.main.supply.modal.visit = false
	}

	// 获取供应商列表
	const getSupplyList = () => {
		var payload = {
			page: 1,
			page_size: 1000,
		}
		supplyList(payload).then((res) => {
			data.value.main.supplySource = res.data.data.map((item) => {
				return {
					value: item.id,
					label: item.name,
					id: item.id,
					name: item.name,
					contact: item.contact,
					phone: item.phone,
					fax: item.fax,
				}
			})
		})
	}

	const getOrderInfo = async () => {
		data.value.main.loading = true
		const id = data.value.main.orderNo
		const payload = {
			order_no: id,
		}
		try {
			data.value.main.loading = true
			const response = await getAdminOrderInfoApi(payload)
			if (response.code === 0) {
				data.value.main.quoteInfo = response.data.quote
				data.value.main.quoteNo = response.data.quote.snowflake_id
				const items = response.data.goods
				for (const item of items) {
					item.loading = true
					item.preview_base64 = await getUrlBase64(resolveStaticUrl(item.goods_data.preview))
					item.loading = false
					item.goods_data.configure = item.goods_data.configure ? JSON.parse(item.goods_data.configure) : {}
					item.goods_data.configure_text = item.goods_data.configure_text ? JSON.parse(item.goods_data.configure_text) : {}
				}
				data.value.main.source = items
				if (response.data.quote.technology == 1) {
					data.value.main.quotationTitle = window.lang == 'en' ? '3D Print Quotation' : '3D打印报价单'
				} else if (response.data.quote.technology == 2) {
					data.value.main.quotationTitle = window.lang == 'en' ? 'CNC Quotation' : 'CNC机加工报价单'
				}

				data.value.main.userInfo = response.data.user
				data.value.main.orderInfo = response.data
				data.value.main.firstTotal = items.map((item) => parseFloat(item.unit_price)).reduce((a, b) => a + b, 0)
				data.value.main.total = items.map((item) => parseFloat(item.total_price)).reduce((a, b) => a + b, 0)
				data.value.main.total = data.value.main.orderInfo.shipping_price
					? data.value.main.total + parseFloat(data.value.main.orderInfo.shipping_price)
					: data.value.main.total
			}
		} catch (error) {
			console.error('Error fetching quote items:', error)
		} finally {
			data.value.main.loading = false
		}
	}

	const priceChange = (item) => {
		if (!item.unit_price) {
			return false
		}
		item.loading = true
		item.price = parseFloat(item.unit_price.replace(/[^\d.]/g, '')).toFixed(2)
		const payload = {
			order_id: item.order_id,
			goods_id: item.goods_id,
			price: item.unit_price,
		}
		console.log(payload)
		request(uri.api + 'order/admin/change', 'POST', payload)
			.then((response) => {
				data.value.main.firstTotal = data.value.main.source.map((item) => parseFloat(item.unit_price)).reduce((a, b) => a + b, 0)
				data.value.main.total = data.value.main.source.map((item) => parseFloat(item.unit_price) * parseFloat(item.quantity)).reduce((a, b) => a + b, 0)
				data.value.main.total = data.value.main.orderInfo.shipping_price
					? data.value.main.total + parseFloat(data.value.main.orderInfo.shipping_price)
					: data.value.main.total
			})
			.finally(() => {
				item.loading = false
			})
		// request(uri.api + 'quotes/item/price', 'PUT', payload)
		// 	.then((response) => {
		// 		data.value.main.firstTotal = data.value.main.source.map((item) => parseFloat(item.price)).reduce((a, b) => a + b, 0)
		// 		data.value.main.total = data.value.main.source.map((item) => parseFloat(item.unit_price) * parseFloat(item.quantity)).reduce((a, b) => a + b, 0)
		// 		console.log(data.value.main.total)
		// 		data.value.main.total = data.value.main.orderInfo.shipping_price
		// 			? data.value.main.total + parseFloat(data.value.main.orderInfo.shipping_price)
		// 			: data.value.main.total
		// 	})
		// 	.finally(() => {
		// 		item.loading = false
		// 	})
	}
	const debouncePriceChange = debounce(priceChange, 500)
	const scrollToTop = (callback) => {
		const element = document.querySelector('.body-layout')

		if (!element) {
			return
		}
		window.scroll(0, 0)
		// 开始平滑滚动到顶部
		element.scrollTo({
			top: 0,
			behavior: 'smooth',
		})

		// 使用 requestAnimationFrame 进行滚动监控
		const checkIfDone = () => {
			if (element.scrollTop === 0) {
				if (callback) {
					callback()
				}
			} else {
				// 继续监控
				requestAnimationFrame(checkIfDone)
			}
		}

		// 开始监控
		requestAnimationFrame(checkIfDone)
	}

	const saveQuote = (status) => {
		data.value.main.processLoading = true
		scrollToTop(function () {
			html2canvas(document.querySelector('#content'), {
				backgroundColor: '#ffffff',
				allowTaint: true, //开启跨域
				useCORS: true,
			}).then((canvas) => {
				data.value.main.processLoading = true
				const contentWidth = canvas.width
				const contentHeight = canvas.height

				const pageHeight = (contentWidth / 592.28) * 841.89
				var leftHeight = contentHeight
				let position = 0
				const imgWidth = 595.28
				const imgHeight = (592.28 / contentWidth) * contentHeight

				const pageData = canvas.toDataURL('image/jpeg', 1.0)
				const pdf = new jsPDF('', 'pt', 'a4')

				// 处理长图片分页
				if (leftHeight < pageHeight) {
					pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
				} else {
					while (leftHeight > 0) {
						pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
						leftHeight -= pageHeight
						position -= 841.89
						if (leftHeight > 0) {
							pdf.addPage()
						}
					}
				}

				// 使用 Blob 将 PDF 转换为二进制数据
				const pdfBlob = pdf.output('blob')

				// 创建FormData对象
				var formData = new FormData()
				formData.append('file', pdfBlob, password(32) + '.pdf')
				formData.append('uuid', data.value.main.quoteInfo.uuid)
				var headers = {
					'Content-Type': 'multipart/form-data',
				}
				uploadOffline(formData, headers)
					.then((response) => {
						if (response.code === 0) {
							data.value.main.pdfPath = response.data.path
							data.value.main.pdfName = response.data.path.split('/').pop()
							makeProcessOrder(status)
							window.open(response.data.path)
						}
					})
					.finally(() => {
						data.value.main.processLoading = false
					})
			})
		})
	}

	const makeProcessOrder = (status) => {
		data.value.main.processOrderBtnLoading = true
		processOrderApi({ order_no: data.value.main.orderNo, path: data.value.main.pdfPath, status: status, lang: data.value.lang, type: 1 })
			.then((result) => {
				if (result.code == 0) {
					message.success('success')
				}
			})
			.finally(() => {
				data.value.main.processOrderBtnLoading = false
			})
	}

	const password = (length = 32) => {
		const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let password = ''
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length)
			password += charset[randomIndex]
		}
		return password
	}
	const getUrlBase64 = (url, callback) => {
		return new Promise((resolve, reject) => {
			var canvas = document.createElement('canvas') //创建canvas DOM元素
			var ctx = canvas.getContext('2d')
			var img = new window.Image()
			img.crossOrigin = 'Anonymous'
			img.src = url
			img.onload = function () {
				canvas.height = img.height // 使用图片的实际高度
				canvas.width = img.width // 使用图片的实际宽度
				ctx.drawImage(img, 0, 0) // 将图片绘制在 (0, 0) 坐标
				var dataURL = canvas.toDataURL('image/png') // 确保MIME类型正确
				resolve(dataURL) // 返回Base64编码
				canvas = null
			}
			img.onerror = function (error) {
				reject(error)
			}
		})
	}
	// 数字转中文
	const numberToChinese = (num) => {
		const digitMap = ['零', '壹', '貳', '叄', '肆', '伍', '陸', '柒', '捌', '玖']
		const unitMap = ['', '拾', '佰', '仟']
		const bigUnitMap = ['', '萬', '億', '兆']

		if (num === 0) return '零元整'

		let integerPart = Math.floor(num)
		let decimalPart = Math.round((num - integerPart) * 100)

		let chineseStr = ''

		// 处理整数部分
		let unitPos = 0
		let needZero = false
		while (integerPart > 0) {
			let segment = integerPart % 10000
			let segmentStr = ''

			for (let i = 0; segment > 0; i++) {
				const digit = segment % 10
				if (digit !== 0) {
					segmentStr = digitMap[digit] + unitMap[i] + segmentStr
					needZero = true
				} else if (segmentStr.length > 0 && segmentStr[0] !== digitMap[0] && needZero) {
					segmentStr = digitMap[0] + segmentStr
					needZero = false
				}
				segment = Math.floor(segment / 10)
			}

			if (segmentStr.length > 0) {
				chineseStr = segmentStr + bigUnitMap[unitPos] + chineseStr
			} else if (chineseStr.length > 0 && chineseStr[0] !== digitMap[0]) {
				chineseStr = digitMap[0] + chineseStr
			}

			integerPart = Math.floor(integerPart / 10000)
			unitPos++
		}

		chineseStr += '元'

		// 处理小数部分
		if (decimalPart > 0) {
			const jiao = Math.floor(decimalPart / 10)
			const fen = decimalPart % 10

			if (jiao > 0) {
				chineseStr += digitMap[jiao] + '角'
			}
			if (fen > 0) {
				chineseStr += digitMap[fen] + '分'
			}
		} else {
			chineseStr += '整'
		}

		return chineseStr
	}
	onBeforeMount(() => {
		const route = useRoute()
		data.value.main.orderNo = route.params.order_no
		data.value.main.pwd = route.query.pwd
		if (data.value.main.orderNo) {
			getOrderInfo()
		}
		getSupplyList()
	})
</script>
<style lang="scss" scoped>
	body {
		margin: 0;
		padding: 0;
		background-color: #f5f6f7;
		color: #152026;
	}

	#app {
		padding-bottom: 72px;
	}
	.review-wrap {
		.html-container {
			width: 1024px;
			margin: 0 auto;
			background-color: #fff;
			padding: 12px;
			border: 1px solid #e6e6e6;
			border-radius: 8px;
			.hmtl-header {
				position: relative;
				margin-bottom: 36px;

				.bg {
					width: 100%;
					display: block;
				}

				.r-logo {
					height: 92px;
					position: absolute;
					top: 0;
					bottom: 0;
					left: 100px;
					margin: auto;
					display: block;
				}

				.title {
					font-size: 36px;
					position: absolute;
					right: 100px;
					height: 36px;
					line-height: 36px;
					top: 0;
					bottom: 0;
					margin: auto;
					color: #fff;
				}
			}

			.flex {
				display: flex;
				justify-content: space-between;
			}

			.sub-header {
				margin-bottom: 36px;

				.left {
					margin-left: 100px;
				}

				.right {
					margin-right: 100px;
				}

				.title {
					font-size: 16px;
					color: #1b8bf5;
				}

				.item {
					margin-top: 8px;
				}
			}

			.mk-table {
				width: 100%;
				border-collapse: collapse;
				margin-bottom: 36px;

				thead tr th {
					background-color: #1b8bf5;
					color: #fff;
					font-weight: 500;
					padding: 12px;
					text-align: center;
				}

				tbody {
					tr {
						&:nth-child(even) {
							background-color: #f1f2f6;
						}
						td {
							padding: 12px;
							text-align: center;
						}

						&.total {
							td {
								background-color: #1b8bf5 !important;
								color: #fff;
							}
						}

						&.other {
							background-color: #fff !important;
							td {
								text-align: right !important;

								p:last-child {
									margin-bottom: 0;
								}
							}
						}
					}

					.td-image {
						width: 90px;
						height: 90px;
						display: block;
						border: 1px solid #e8e8e8;
						border-radius: 3.5px;
						margin: 0 auto;
					}
				}
			}
		}

		.btn-bar {
			height: 60px;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

			button {
				margin: 0 8px;
			}
		}

		.footer {
			padding: 0 24px;
			padding-bottom: 36px;

			.section {
				.title {
					font-size: 24px;
					color: #1b8bf5;
				}

				.item {
					margin-top: 16px;

					.confirm {
						width: 100px;
						height: 100px;
					}
				}
			}
		}

		.supplier-section {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.item {
				margin-top: 0 !important;
			}

			.tip {
				color: #666;
				font-size: 12px;
				margin-top: 4px;
			}
		}

		.price-input {
			width: 90px;
			height: 18px;
			line-height: 16px;
			border: 0;
			outline: 0;
			background-color: transparent;
		}

		.pointer {
			cursor: pointer;
		}

		.toolbar-right {
			box-sizing: border-box;
			color: rgba(0, 0, 0, 0.88);
			font-size: 14px;
			line-height: 1.5714285714285714;
			z-index: 99;
			display: block;
			position: fixed;
			width: 48px;
			height: auto;
			min-height: 48px;
			inset-inline-end: 48px;
			inset-block-end: 78px;
			border-radius: 8px;

			.toolbar-btn {
				box-sizing: border-box;
				color: rgba(0, 0, 0, 0.88);
				font-size: 14px;
				line-height: 1;
				position: relative;
				display: inline-block;
				width: 100%;
				height: 48px;
				border: 0;
				background-color: #fff;
				box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
				cursor: pointer;
				border-radius: 50%;
				transition: 0.2s all;
				margin-bottom: 16px;

				&:last-child {
					margin-bottom: 0;
				}

				&:hover {
					background-color: #f0f0f0;
				}

				&.back-top img {
					width: 100%;
				}
			}
		}

		.svg-inline--fa {
			font-size: 20px;
		}

		a.link {
			color: #1b8bf5;
		}
	}
	.mg8 {
		margin-bottom: 8px;
	}
	.company-section {
		width: 50%;
	}
	.company-item {
		a {
			display: none;
		}
		&:hover {
			a {
				display: inline-block;
			}
		}
	}
</style>
