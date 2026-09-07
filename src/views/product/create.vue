<template>
	<div class="body-container">
		<a-page-header class="mb16"
					   style="border: 1px solid #f0f0f0; background-color: #fff; border-radius: 8px"
					   title="添加商品"
					   @back="() => $router.go(-1)" />
		<div class="mk-panel">
			<div style="position: relative">
				<div class="loading-wrap"
					 v-if="data.mainLoading">
					<a-spin />
				</div>
				<a-tabs style="padding-top: 4px"
						v-model:activeKey="data.activeKey">
					<a-tab-pane key="1"
								tab="商品信息">
						<div class="form-content">
							<div class="group">
								<div class="label">
									<span class="must">*</span>
									<span>商品类型</span>
								</div>
								<div class="value">
									<div class="virtual-list">
										<div class="item"
											 v-for="item in data.virtualOptions"
											 :key="item.id"
											 :class="{ active: item.check }"
											 @click="() => handleVirtual(item.id)">
											<div class="name">{{ item.name }}</div>
											<div class="tip">{{ item.tip }}</div>
											<div class="san"></div>
											<div class="check">✓</div>
										</div>
									</div>
									<p class="tips">虚拟商品在此场景中为模型文件，购买后会保存到个人中心</p>
								</div>
							</div>
							<div class="group"
								 v-if="data.formState.virtual == 1">
								<div class="label">
									<span class="must">*</span>
									<span>取货方式</span>
								</div>
								<div class="value flex">
									<a-radio-group v-model:value="data.formState.pickup_type"
												   :options="data.pickupType" />
								</div>
							</div>
							<div class="group"
								 v-if="data.formState.virtual == 1 && data.formState.pickup_type == 1">
								<div class="label">
									<span class="must">*</span>
									<span>下载文件</span>
								</div>
								<div class="value">
									<a-upload name="file"
											  :data="{ uuid: 'system/product' }"
											  class="avatar-uploader"
											  :show-upload-list="false"
											  :headers="data.upload.headers"
											  action="https://api.momaking.cn/api/upload/offline"
											  :before-upload="fileBeforeUpload"
											  @change="fileUploadChange">
										<a-button class="flex"
												  :loading="data.upload.loading1">
											<UploadOutlined />
											<span v-if="data.formState.file_path">{{ data.formState.file_path.split('/').pop() }}</span>
											<span v-else>{{ data.lang == 'zh' ? '上传文件' : 'Upload File' }}</span>
										</a-button>
									</a-upload>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span class="must">*</span>
									<span>商品名称</span>
								</div>
								<div class="value">
									<a-flex gap="small"
											class="w460">
										<a-input style="width: 100%; flex: 1"
												 v-model:value="data.formState.chinese_name"
												 placeholder="请输入商品中文名称" />
										<a-input style="width: 100%; flex: 1"
												 v-model:value="data.formState.english_name"
												 placeholder="请输入商品英文名称" />
									</a-flex>
								</div>
							</div>
							<div class="group">
								<div class="flex"
									 style="align-items: flex-start">
									<div class="label">
										<span class="must">*</span>
										<span>商品分类</span>
									</div>
									<div class="value">
										<a-cascader class="w460"
													v-model:value="data.formState.category_id"
													multiple
													max-tag-count="responsive"
													:options="data.categoryList"
													placeholder="请选择商品分类"
													:show-checked-strategy="Cascader.SHOW_CHILD"
													@change="handleCategoryChange"></a-cascader>
										<p class="tips">可选择多个分类</p>
									</div>
									<a-button type="link"
											  size="small"
											  class="ml12 a-text-btn"
											  style="margin-top: 4px">
										<router-link to="/product/category">添加分类</router-link>
									</a-button>
								</div>
							</div>
							<div class="group"
								 v-if="data.formState.virtual != 1">
								<div class="label">
									<span>商品单位</span>
								</div>
								<div class="value">
									<a-input class="w460"
											 v-model:value="data.formState.unit"
											 placeholder="请输入商品单位" />
									<p class="tips">例如件、个、瓶、箱、包等</p>
								</div>
							</div>
							<div class="group"
								 v-if="data.formState.virtual == 1">
								<div class="label">
									<span class="must">*</span>
									<span>内容格式</span>
								</div>
								<div class="value">
									<a-select class="w460"
											  v-model:options="data.fileFormatOptions"
											  v-model:value="data.formState.format"
											  placeholder="请输入商品单位" />
									<p class="tips">主要文件的后缀、格式例如.stp、.stl、.obj、.fbx等</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span class="must">*</span>
									<span>商品图片</span>
								</div>
								<div class="value">
									<div class="w460">
										<a-upload name="file"
												  :data="{ uuid: 'system/product' }"
												  v-model:file-list="data.upload.images"
												  action="https://api.momaking.cn/api/upload/offline"
												  :before-upload="beforeUpload"
												  list-type="picture-card"
												  @remove="handleRemove"
												  @change="uploadChange">
											<div v-if="data.upload.images.length < 8">
												<plus-outlined />
												<div style="margin-top: 8px">{{ data.lang == 'zh' ? '上传' : 'Upload' }}</div>
											</div>
										</a-upload>
									</div>
									<p class="tips">建议尺寸：800*800，可拖拽改变图片顺序，默认首张图为主图，最多上传10张</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span class="must">*</span>
									<span>商品状态</span>
								</div>
								<div class="value flex">
									<a-radio-group v-model:value="data.formState.status"
												   :options="data.productStatus" />
								</div>
							</div>
							<div class="group">
								<div class="label t"></div>
								<div class="value flex">
									<a-button type="primary"
											  @click="() => handleNext('1')">下一步</a-button>
								</div>
							</div>
						</div>
					</a-tab-pane>
					<a-tab-pane key="2"
								tab="规格库存">
						<div class="form-content">
							<div class="group">
								<div class="label">
									<span>售价</span>
								</div>
								<div class="value">
									<a-input class="w460"
											 v-model:value="data.formState.price"
											 placeholder="请输入商品售价" />
									<p class="tips">如果售价为0，则表示该商品为免费商品</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>原价</span>
								</div>
								<div class="value">
									<a-input class="w460"
											 v-model:value="data.formState.original_price"
											 placeholder="请输入商品原价" />
									<p class="tips">如果原价和售价都为0，则表示该商品为免费商品</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>库存</span>
								</div>
								<div class="value">
									<a-input-number min="0"
													max="9999999999"
													class="w460"
													v-model:value="data.formState.stock"
													placeholder="请输入商品库存" />
									<p class="tips">0-9999999999</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>重量</span>
								</div>
								<div class="value">
									<a-input class="w460"
											 v-model:value="data.formState.weight"
											 placeholder="请输入商品重量" />
									<p class="tips">产品重量，例如100g、1kg</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>体积</span>
								</div>
								<div class="value">
									<a-input class="w460"
											 v-model:value="data.formState.volume"
											 placeholder="请输入商品体积" />
									<p class="tips">产品体积，例如100000mm³</p>
								</div>
							</div>
							<div class="group">
								<div class="label t"></div>
								<div class="value">
									<a-space :size="12">
										<a-button @click="() => handleNext('0')">上一步</a-button>
										<a-button type="primary"
												  @click="() => handleNext('2')">下一步</a-button>
									</a-space>
								</div>
							</div>
						</div>
					</a-tab-pane>
					<a-tab-pane key="3"
								tab="商品详情">
						<div class="form-content">
							<div class="group"
								 style="display: flex; flex-direction: column">
								<div class="label"
									 style="text-align: left">
									<span class="must">*</span>
									<span>商品详情</span>
								</div>
								<div class="value">
									<a-row>
										<a-col :span="18">
											<a-row>
												<a-col :span="12"
													   style="padding-right: 12px">
													<wang-editor ref="editorRef"
																 :editorHeight="'600px'"
																 @editorCreated="editorCreate"
																 @editorChange="editorChange" />
												</a-col>
												<a-col :span="12"
													   style="padding-left: 12px">
													<wang-editor ref="editorRef1"
																 :editorHeight="'600px'"
																 @editorCreated="editorCreate1"
																 @editorChange="editorChange1" />
												</a-col>
											</a-row>
										</a-col>
										<a-col :span="6">
											<div class="phone">
												<div class="content"
													 v-html="data.formState.content"></div>
											</div>
										</a-col>
									</a-row>
								</div>
							</div>
							<div class="group">
								<div class="label t"></div>
								<div class="value">
									<a-space :size="12">
										<a-button @click="() => handleNext('1')">上一步</a-button>
										<a-button type="primary"
												  @click="() => handleNext('3')">下一步</a-button>
									</a-space>
								</div>
							</div>
						</div>
					</a-tab-pane>
					<a-tab-pane key="4"
								tab="营销设置">
						<div class="form-content">
							<div class="group">
								<div class="label">
									<span>评分</span>
								</div>
								<div class="value">
									<a-rate class="w460"
											v-model:value="data.formState.score"
											allow-half />
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>已售数量</span>
								</div>
								<div class="value">
									<a-input class="w460"
											 v-model:value="data.formState.sales"
											 placeholder="请输入商品已售数量" />
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>排序</span>
								</div>
								<div class="value">
									<a-input class="w460"
											 v-model:value="data.formState.sort"
											 placeholder="请输入商品排序" />
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>赠送优惠券</span>
								</div>
								<div class="value">
									<a-button type="primary"
											  @click="() => handleCoupon()">添加</a-button>
								</div>
							</div>
							<div class="group">
								<div class="label t"></div>
								<div class="value">
									<a-space :size="12">
										<a-button @click="() => handleNext('2')">上一步</a-button>
										<a-button type="primary"
												  @click="() => handleNext('4')">下一步</a-button>
									</a-space>
								</div>
							</div>
						</div>
					</a-tab-pane>
					<a-tab-pane key="5"
								tab="其他设置">
						<div class="form-content">
							<div class="group">
								<div class="label">
									<span>商品关键词</span>
								</div>
								<div class="value">
									<a-input class="w460"
											 v-model:value="data.formState.keywords"
											 placeholder="请输入商品关键词" />
									<p class="tips">PC端的SEO优化以及可以根据关键字进行商品搜索</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>英文关键词</span>
								</div>
								<div class="value">
									<a-input class="w460"
											 v-model:value="data.formState.keywords_en"
											 placeholder="请输入商品关键词" />
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>商品简介</span>
								</div>
								<div class="value">
									<a-textarea class="w460"
												v-model:value="data.formState.description"
												placeholder="请输入商品简介" />
									<p class="tips">公众号分享商品以及PC端SEO优化使用</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>英文简介</span>
								</div>
								<div class="value">
									<a-textarea class="w460"
												v-model:value="data.formState.description_en"
												placeholder="请输入商品简介" />
								</div>
							</div>
							<div class="group">
								<div class="label t"></div>
								<div class="value">
									<a-space :size="12">
										<a-button @click="() => handleNext('3')"
												  :disabled="data.formConfirmLoading">上一步</a-button>
										<a-button type="primary"
												  @click="handleSave"
												  :loading="data.formConfirmLoading">保存</a-button>
									</a-space>
								</div>
							</div>
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
		</div>
	</div>
</template>
<script setup>
import { getCategoryTreeApi, getProductInfoApi, makeProductApi } from '@/api/product'
import { onBeforeMount, onMounted, ref } from 'vue'
import { Cascader, message } from 'ant-design-vue'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
import WangEditor from '@/components/WangEditor.vue'
import router from '@/router'

const data = ref({
	lang: localStorage.getItem('lang') || 'zh',
	mainLoading: false,
	activeKey: '1',
	fileFormatOptions: [
		{
			value: 'stp',
			label: 'stp/step',
		},
		{
			value: 'stl',
			label: 'stl',
		},
		{
			value: 'obj',
			label: 'obj',
		},
		{
			value: 'fbx',
			label: 'fbx',
		},
		{
			value: '3dm',
			label: '3dm',
		},
		{
			value: 'gltf',
			label: 'gltf',
		},
	],
	upload: {
		images: [],
		loading: false,
		loading1: false,
		headers: {
			Authorization: localStorage.getItem('token'),
		},
	},
	pickupType: [
		{
			value: 1,
			label: '下载文件',
		},
		{
			value: 2,
			label: 'CDK兑换码',
		},
	],
	virtualOptions: [
		{
			id: 1,
			name: '虚拟商品',
			tip: '(自动发货)',
			check: true,
		},
		{
			id: 2,
			name: '实物商品',
			tip: '(快递发货)',
			check: false,
		},
	],
	productStatus: [
		{
			value: 1,
			label: '上架',
		},
		{
			value: 2,
			label: '下架',
		},
	],
	categoryList: [],
	formConfirmLoading: false,
	formState: {
		chinese_name: '',
		english_name: '',
		virtual: 1,
		category_id: [],
		images: [],
		file_path: '',
		score: 0,
		stock: 99999,
		status: 1,
		format: '',
		unit: '',
		content: '',
		content_en: '',
		sales: 0,
		sort: 0,
		pickup_type: 1,
	},
})

const editorRef = ref(null)
const editorRef1 = ref(null)
const editorCreate = () => {
	if (editorRef.value) {
		editorRef.value.setHtml(data.value.formState.content)
	}
}
const editorCreate1 = () => {
	if (editorRef1.value) {
		editorRef1.value.setHtml(data.value.formState.content_en)
	}
}

const editorChange = (newContent) => {
	data.value.formState.content = newContent
}
const editorChange1 = (newContent) => {
	data.value.formState.content_en = newContent
}

const handleVirtual = (id) => {
	data.value.virtualOptions.forEach((item) => {
		item.check = item.id === id
	})
	data.value.formState.virtual = id
}

const getCategoryList = () => {
	getCategoryTreeApi().then((res) => {
		if (res.code == 0 && res.data.length > 0) {
			data.value.categoryList = res.data
		}
	})
}

const handleCategoryChange = () => {
	console.log(data.value.formState.category_id)
}

const handleRemove = (info) => {
	data.value.formState.images = data.value.formState.images.filter((item) => item !== info.response.data.path)
	console.log(data.value.formState.images)
}
const uploadChange = (info) => {
	if (info.file.status === 'uploading') {
		data.value.upload.loading = true
		return
	}
	if (info.file.status === 'done') {
		var response = info.file.response
		if (response.code == 0) {
			data.value.formState.images.push(response.data.path)
			console.log(data.value.formState.images)
		} else {
			message.error(response.msg)
		}
		data.value.upload.loading = false
	}
	if (info.file.status === 'error') {
		data.value.upload.loading = false
		message.error('upload error')
	}
}

const fileUploadChange = (info) => {
	if (info.file.status === 'uploading') {
		data.value.upload.loading = true
		return
	}
	if (info.file.status === 'done') {
		var response = info.file.response
		if (response.code == 0) {
			data.value.formState.file_path = response.data.path
		}
		data.value.upload.loading1 = false
	}
	if (info.file.status === 'error') {
		data.value.upload.loading = false
		message.error('upload error')
	}
}

const beforeUpload = (file) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
	if (!isJpgOrPng) {
		message.error(data.value.lang == 'en' ? 'You can only upload JPG file!' : '只能上传图片格式文件')
		return false
	}
	const isLt2M = file.size / 1024 / 1024 < 2
	if (!isLt2M) {
		message.error(data.value.lang == 'en' ? 'Image must smaller than 2MB!' : '最大不能超过 2MB!')
	}
	return isJpgOrPng && isLt2M
}

const fileBeforeUpload = (file) => {
	const isLt2M = file.size / 1024 / 1024 < 20
	if (!isLt2M) {
		message.error(data.value.lang == 'en' ? 'File must smaller than 20MB!' : '最大不能超过 20MB!')
	}
	return isLt2M
}

const handleNext = (key) => {
	data.value.activeKey = '' + (Number(key) + 1)
}

const handleCoupon = () => {
	// console.log(111)
}

const handleSave = () => {
	const payload = {
		...data.value.formState,
	}
	if (!payload.chinese_name || !payload.english_name) {
		message.error('请输入商品名称')
		return
	}
	if (payload.virtual == 1 && payload.pickup_type == 1 && !payload.file_path) {
		message.error('请上传商品文件')
		return
	}
	if (payload.virtual == 2) {
		payload.file_path = ''
		payload.pickup_type = 1
	}
	if (!payload.category_id || payload.category_id.length == 0) {
		message.error('请选择商品分类')
		return
	}
	// if (!payload.unit) {
	// 	message.error('请输入商品单位')
	// 	return
	// }
	if (!payload.content) {
		message.error('请输入商品详情')
		return
	}
	if (payload.images.length == 0) {
		message.error('请上传商品图片')
		return
	}
	data.value.formConfirmLoading = true
	makeProductApi(payload)
		.then((res) => {
			if (res.code == 0) {
				message.success('保存成功')

				setTimeout(() => {
					window.location.href = '/product/list'
				}, 1000)
			}
		})
		.finally(() => {
			data.value.formConfirmLoading = false
		})
}

const getProductInfo = (id) => {
	data.value.mainLoading = true
	getProductInfoApi({ id })
		.then((res) => {
			if (res.code == 0) {
				data.value.formState = res.data
				data.value.formState.category_id = res.data.categories
				data.value.virtualOptions.forEach((item) => {
					item.check = item.id === res.data.virtual
				})
				data.value.upload.images = res.data.images.map((item, index) => {
					var name = item.split('/').pop()
					return {
						uid: index,
						name: name,
						url: item,
						thumbUrl: item,
						status: 'done',
						response: {
							data: {
								path: item,
							},
						},
					}
				})
			}
		})
		.finally(() => {
			data.value.mainLoading = false
		})
}

onBeforeMount(() => { })

onMounted(() => {
	const id = router.currentRoute.value.query.id
	if (id) {
		getProductInfo(id)
	}
	getCategoryList()
})
</script>
<style lang="scss" scoped>
:deep(.ant-page-header) {
	padding: 12px 20px;

	.ant-page-header-back {
		margin-top: 2px;

		svg {
			color: rgba(0, 0, 0, 0.85);
		}
	}

	.ant-page-header-heading-title {
		font-size: 18px;
		font-weight: 500;
	}
}

.form-content {
	padding: 12px;

	.group {
		display: flex;
		align-items: top;
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}

		.label {
			width: 100px;
			line-height: 32px;
			font-weight: 500;
			text-align: right;
			color: #303133;
			padding-right: 12px;

			&.t {
				&::after {
					display: none;
				}
			}

			&::after {
				content: ':';
				margin-left: 2px;
			}

			.must {
				color: #f00;
				padding-right: 2px;
			}
		}

		.value {
			flex: 1;
		}
	}
}

.w460 {
	width: 460px;
}

.ml12 {
	margin-left: 12px;
}

.virtual-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;

	.item {
		width: 120px;
		height: 60px;
		background: rgb(255, 255, 255);
		border-radius: 3px;
		float: left;
		text-align: center;
		padding-top: 8px;
		position: relative;
		cursor: pointer;
		line-height: 23px;
		border: 1px solid rgb(231, 231, 231);
		transition: 0.3s all ease-in-out;
		user-select: none;

		&:hover,
		&.active {
			border: 1px solid #0d6efd;
		}

		.name {
			font-size: 14px;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.85);
		}

		.tip {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.45);
		}

		.san {
			position: absolute;
			bottom: 0px;
			right: 0px;
			width: 0px;
			height: 0px;
			border-bottom: 26px solid #0d6efd;
			border-left: 26px solid transparent;
			display: none;
		}

		&.active {
			.san {
				display: block;
			}
		}

		.check {
			position: absolute;
			bottom: -2px;
			right: 2px;
			color: rgb(255, 255, 255);
			font-family: system-ui;
		}
	}
}

.tips {
	font-size: 12px;
	color: rgba(0, 0, 0, 0.45);
	margin-bottom: 0;
	margin-top: 4px;
}

.phone {
	width: 344px;
	height: 644px;
	background: url(@/assets/images/phonebg.632cc2f9.png) no-repeat top;
	background-size: 344px 644px;
	padding: 40px 20px;
	padding-top: 50px;
	margin: 0 auto;
	word-break: break-all;

	:deep(.content) {
		width: 312px;
		height: 564px;
		overflow-y: auto;
		padding: 0 6px;
		margin: 0 auto;
		box-sizing: border-box;

		/* 修改滚动条样式 */
		&::-webkit-scrollbar {
			width: 4px;
		}

		/* 滚动条轨道 */
		&::-webkit-scrollbar-track {
			background-color: #f1f1f1;
			border-radius: 10px;
		}

		/* 滚动条滑块 */
		&::-webkit-scrollbar-thumb {
			background-color: #888;
			border-radius: 10px;
		}

		/* 滑块悬停效果 */
		&::-webkit-scrollbar-thumb:hover {
			background-color: #838383;
		}

		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			margin-bottom: 1rem;
		}
	}
}

:deep(.ant-upload-wrapper) {
	.ant-upload-list-item-actions {
		display: flex;
		align-items: center;
		justify-content: center;

		a {
			display: flex;
			height: 22px;
			align-items: center;
		}
	}
}
</style>
