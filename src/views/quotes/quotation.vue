<template>
	<div>
		<div class="btn-bar">
			<a-button :loading="data.main.processLoading" :disabled="data.main.loading">Reject the process</a-button>
			<a-button :loading="data.main.processLoading" :disabled="data.main.loading" type="primary" id="renderPdf" @click="saveQuote">
				Through the process
			</a-button>
		</div>
		<div class="container" id="content">
			<div class="header">
				<img class="bg" src="@/assets/images/document-bg.png" />
				<img class="logo" src="@/assets/images/9-2.png" />
				<span class="title" style="color: #fff">{{ data.main.quotationTitle }}</span>
			</div>
			<div class="sub-header">
				<div class="flex">
					<div class="left">
						<div class="title">Customer information</div>
						<div class="item" v-if="data.main.userInfo.first_name || data.main.userInfo.last_name">
							Name: {{ data.main.userInfo?.first_name + '' + data.main.userInfo?.last_name }}
						</div>
						<div class="item">Email: {{ data.main.userInfo?.email }}</div>
						<div class="item" v-if="data.main.userInfo.mobile">Phone: {{ data.main.userInfo?.mobile }}</div>
					</div>
					<div class="right">
						<div class="title">Quote Information</div>
						<div class="item">Number: {{ data.main.quoteNo }}</div>
						<div class="item">Date: {{ data.main.quoteInfo?.create_time }}</div>
					</div>
				</div>
			</div>
			<table class="mk-table">
				<thead>
					<tr>
						<th>SL</th>
						<th>Name</th>
						<th>Image</th>
						<th>Materials</th>
						<th>Rmarks</th>
						<th>Quantity</th>
						<th>Price(Inc VAT)</th>
						<th>Total(Inc VAT)</th>
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
						<td>{{ item.name }}</td>
						<td><img @click="showPreviewModal(item)" class="td-image pointer" :src="item.preview_base64" /></td>
						<td style="font-size: 13px">
							{{ item.attr_data?.material.label }}
							<br />
							{{ item.attr_data?.finish.label }}
						</td>
						<td style="font-size: 13px">{{ item.attr_data.remarks == undefined ? (data.lang == 'en' ? 'None' : '无') : item.attr_data.remarks }}</td>
						<td>{{ item.quantity }}</td>
						<td>
							￥
							<input class="price-input" v-model="item.unit_price" @input="debouncePriceChange(item)" />
							<span v-if="item.loading" class="loading"><a-spin /></span>
						</td>
						<td>￥{{ (item.quantity * item.unit_price).toFixed(2) }}</td>
					</tr>
					<tr class="other">
						<td colspan="8">
							<p>Shipping Cost : ￥{{ data.main.orderInfo.shipping_price }}</p>
						</td>
					</tr>
					<tr class="total">
						<td colspan="5">TOTAL :</td>
						<td>{{ numberToChinese(data.main.total.toFixed(2)) }}</td>
						<td>￥{{ data.main.firstTotal.toFixed(2) }}</td>
						<td>￥{{ data.main.total.toFixed(2) }}</td>
					</tr>
				</tbody>
			</table>
			<div class="footer">
				<div class="flex" style="justify-content: space-around">
					<div class="section supplier-section">
						<div class="item">
							<img class="confirm" src="" />
						</div>
						<div class="tip">Customer service</div>
					</div>
					<div class="section supplier-section">
						<div class="item">
							<img class="confirm" src="" />
						</div>
						<div class="tip">Suppliers stamp</div>
					</div>
					<div class="section">
						<div class="title">Momaking</div>
						<div class="item">
							Website:
							<a class="link" href="https://www.momaking.com">www.momaking.com</a>
						</div>
						<div class="item">Phone: 0755-23696802</div>
						<div class="item">Email: info@momaking.com</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import { onBeforeMount, ref } from 'vue'
	import { getAdminOrderInfoApi } from '@/api/order'
	import { useRoute } from 'vue-router'
	import { resolveStaticUrl } from '@/utils/url'

	const data = ref({
		lang: window.lang,
		main: {
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
	const getOrderInfo = async () => {
		data.value.main.loading = true
		const id = data.value.main.orderNo
		const pwd = data.value.main.pwd
		const payload = {
			order_no: id,
			pwd: pwd,
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
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
		// 检查滚动位置，直到滚动完成
		const checkIfDone = setInterval(function () {
			// 检查滚动位置
			if (window.pageYOffset === 0) {
				clearInterval(checkIfDone)
				if (callback) {
					callback()
				}
			}
		}, 100)
	}

	const saveQuote = () => {
		data.value.main.processLoading = true
		scrollToTop(function () {
			html2canvas(document.querySelector('#content'), {
				backgroundColor: '#ffffff',
				allowTaint: true, //开启跨域
				useCORS: true,
			}).then((canvas) => {
				var contentWidth = canvas.width
				var contentHeight = canvas.height

				var pageHeight = (contentWidth / 592.28) * 841.89
				var leftHeight = contentHeight
				var position = 0
				var imgWidth = 595.28
				var imgHeight = (592.28 / contentWidth) * contentHeight

				var pageData = canvas.toDataURL('image/jpeg', 1.0)
				var pdf = new jsPDF('', 'pt', 'a4')
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
				// 使用Blob将PDF转换为二进制数据
				var pdfBlob = pdf.output('blob')
				// 创建FormData对象
				var formData = new FormData()
				formData.append('file', pdfBlob, password(32) + '.pdf')
				formData.append('uuid', data.value.main.quoteInfo.uuid)
				var headers = {
					'Content-Type': 'multipart/form-data',
				}
				// 使用fetch API上传PDF到服务器
				fetch(uri.api + 'upload/offline', {
					method: 'POST',
					body: formData,
				})
					.then((response) => response.json())
					.then((response) => {
						if (response.code === 0) {
							window.open(response.data.path)
							request(uri.api + 'quotes/process', 'PUT', { order_no: data.value.main.orderNo, path: response.data.path, status: 3, lang: window.lang })
								.then((res) => {
									if (res.code === 0) {
										notification.open({
											message: window.lang == 'en' ? 'Tips' : '提示',
											description:
												window.lang == 'en'
													? "An email notification has been sent to the customer. If the customer's information includes phone number, please inform the customer of the review results and request payment of balance."
													: '已发送邮件通知客户，如果客户信息有显示电话号码，请告知客户审核结果，并支付尾款。',
											placement: 'topRight',
											duration: 0,
										})
										// window.open(response.data.path)
									}
								})
								.finally(() => {
									data.value.main.processLoading = false
								})
						} else {
							message.error('保存失败，请稍后再试')
							data.value.main.processLoading = false
						}
					})
			})
		})
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

	.container {
		width: 1024px;
		margin: 0 auto;
		background-color: #fff;

		.header {
			position: relative;
			margin-bottom: 36px;

			.bg {
				width: 100%;
				display: block;
			}

			.logo {
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
				font-size: 24px;
				color: #1b8bf5;
			}

			.item {
				margin-top: 16px;
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
</style>
