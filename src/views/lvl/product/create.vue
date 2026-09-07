<template>
	<div class="body-container">
		<a-page-header class="mb16"
					   style="border: 1px solid #f0f0f0; background-color: #fff; border-radius: 8px"
					   title="添加商品"
					   @back="() => $router.go(-1)" />
		<div class="mk-panel">
			<a-tabs style="padding-top: 4px"
					v-model:activeKey="data.activeKey">
				<a-tab-pane :key="1"
							tab="商品信息">
					<div class="form-content">
						<div class="group">
							<div class="label">
								<span class="must">*</span>
								<span>商品名称</span>
							</div>
							<div class="value">
								<a-input v-model:value="data.formState.name"
										 class="w460"
										 placeholder="请输入商品名称" />
								<p class="err"
								   v-if="data.formErrors.name">{{ data.formErrors.name }}</p>
							</div>
						</div>
						<div class="group">
							<div class="label">
								<span class="must">*</span>
								<span>分类</span>
							</div>
							<div class="value">
								<a-select v-model:value="data.formState.category_id"
										  class="w460"
										  placeholder="请输入商品名称" />
								<p class="err"
								   v-if="data.formErrors.category_id">{{ data.formErrors.category_id }}</p>
							</div>
						</div>
						<div class="group">
							<div class="label">
								<span class="must">*</span>
								<span>媒体文件</span>
							</div>
							<div class="value">
								<div>
									<a-flex gap="middle">
										<draggable v-if="data.formState.images.length > 0"
												   :list="data.formState.images"
												   item-key="name"
												   class="flex gap8"
												   ghost-class="ghost"
												   chosen-class="chosen"
												   animation="300">
											<template #item="{ element }">
												<div class="image-item">
													<span class="close-item">
														<CloseOutlined />
													</span>
													<img :src="element"
														 :width="100" />
												</div>
											</template>
										</draggable>
										<a-upload class="product-media-upload"
												  name="file"
												  :data="{ uuid: 'system/product' }"
												  v-model:file-list="data.upload.images"
												  :show-upload-list="false"
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
									</a-flex>
								</div>
								<p class="err"
								   v-if="data.formErrors.images">{{ data.formErrors.images }}</p>
							</div>
						</div>
						<div class="group">
							<div class="label">
								<span>商品排序</span>
							</div>
							<div class="value">
								<a-input-number :min="0"
												:max="100"
												v-model:value="data.formState.sort" />
								<p class="tips mt-1">决定商品的排序顺序，值越小越靠前</p>
							</div>
						</div>
						<div class="group">
							<div class="label">
								<span class="must">*</span>
								<span>状态</span>
							</div>
							<div class="value flex">
								<a-radio-group v-model:value="data.formState.status"
											   :options="data.productStatus" />
							</div>
						</div>
						<div class="group">
							<div class="label t"></div>
							<a-space>
								<a-button @click="() => handleNext('1')">下一步</a-button>
								<a-button type="primary"
										  @click="handleSubmit">保存</a-button>
							</a-space>
						</div>
					</div>
				</a-tab-pane>
				<a-tab-pane :key="2"
							tab="规格库存">
					<div class="form-content">
						<div class="group">
							<div class="label">
								<span class="must">*</span>
								<span>规格类型</span>
							</div>
							<div class="value flex">
								<a-radio-group v-model:value="data.formState.attr_type"
											   :options="data.attrTypeOptions" />
								<p class="err"
								   v-if="data.formErrors.attr_type">{{ data.formErrors.attr_type }}</p>
							</div>
						</div>
						<div v-if="data.formState.attr_type == 1"
							 style="margin-bottom: 16px">
							<div class="group">
								<div class="label">
									<span class="must">*</span>
									<span>商品价格</span>
								</div>
								<div class="value">
									<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px">
										<a-input-number :min="0.01"
														v-model:value="data.formState.goods_price" />
										<span class="unit">美元</span>
									</div>
									<p class="err"
									   v-if="data.formErrors.goods_price">{{ data.formErrors.goods_price }}</p>
									<p class="tips mt-1">商品的实际购买金额，最低0.01</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span>划线价</span>
								</div>
								<div class="value">
									<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px">
										<a-input-number :min="0.01"
														v-model:value="data.formState.line_price" />
										<span class="unit">美元</span>
									</div>
									<p class="tips mt-1">划线价仅用于商品页展示</p>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span class="must">*</span>
									<span>当前库存</span>
								</div>
								<div class="value">
									<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px">
										<a-input-number :min="0.01"
														v-model:value="data.formState.stock" />
										<span class="unit">件</span>
									</div>
									<p class="err"
									   v-if="data.formErrors.stock">{{ data.formErrors.stock }}</p>
									<p class="tips mt-1">商品的实际库存数量，为0时用户无法下单</p>
								</div>
							</div>
						</div>
						<div v-else
							 style="margin-bottom: 16px">
							<div class="group">
								<div class="label">
									<span class="must">*</span>
									<span>商品规格</span>
								</div>
								<div class="value">
									<div class="w460">
										<div class="attr-group"
											 v-for="(group, index) in data.attrGroups"
											 :key="index">
											<div class="attr-group-head">
												<a-input class="input"
														 v-model:value="group.name"
														 placeholder="请输入规则名称" />
												<span class="close"
													  @click="removeAttrGroup(index)">删除</span>
											</div>
											<div class="attr-group-content">
												<span class="lvl-tag"
													  v-for="(label, i) in group.children"
													  :key="i"
													  :closable="true"
													  @close="handleGroupItemClose">
													{{ label.name }}
													<CloseOutlined @click="handleGroupItemClose(group, i)" />
												</span>
												<span>
													<a-tag v-if="!group.inpvst"
														   @click="showGroupItemInput(group, index)">
														<PlusOutlined />
														新标签
													</a-tag>
													<a-input v-else
															 :ref="(el) => (inputRefs[`inputRef-${index}`] = el)"
															 size="small"
															 style="width: 67.3px; height: 22px"
															 @blur="createGroupItem($event, group)"
															 @keyup.enter="createGroupItem($event, group)" />
												</span>
											</div>
										</div>
										<a-space :size="12">
											<a-button @click="addAttrGroup">添加规则组</a-button>
										</a-space>
										<p class="tips mt-1">最多添加3个商品规格组，生成的SKU数量不能超出50个</p>
									</div>
								</div>
							</div>
							<div class="group">
								<div class="label">
									<span class="must">*</span>
									<span>商品规格</span>
								</div>
								<div class="value">
									<a-table :data-source="data.skuTable.source"
											 :columns="data.skuTable.columns"
											 bordered>
										<template #bodyCell="{ column, record }">
											<template v-if="column.key == 'pic'">
												<a-upload class="sku-upload"
														  name="file"
														  :data="{ uuid: 'system/product' }"
														  :show-upload-list="false"
														  action="https://api.momaking.cn/api/upload/offline"
														  :before-upload="beforeUpload"
														  list-type="picture-card"
														  @change="skuUploadChange($event, record)">
													<img v-if="record.pic"
														 :width="50"
														 :height="50"
														 :src="record.pic"
														 fallback="//static.momaking.com/1402c56e-faf7-44c1-a88e-78c6c799a673/20250208/b1ca4b5916ded3fe1656d8cd35fdd3ad.png" />
													<div v-else>
														<div v-if="record.upload_loading">
															<LoadingOutlined />
														</div>
														<div v-else>
															<PlusOutlined />
														</div>
													</div>
												</a-upload>
											</template>
											<template v-if="column.key == 'is_show'">
												<a-switch :checked="record.is_show == 1"
														  @change="itemShowChange(record)"></a-switch>
											</template>
											<template v-if="column.key == 'is_default_select'">
												<a-switch :checked="record.is_default_select == 1"
														  @change="itemDefaultSelectChange(record)"></a-switch>
											</template>
											<template v-if="
												column.key == 'cost' ||
												column.key == 'price' ||
												column.key == 'ot_price' ||
												column.key == 'stock' ||
												column.key == 'weight' ||
												column.key == 'volumn' ||
												column.key == 'unique'
											">
												<a-input-number v-model:value="record[column.key]" />
											</template>
										</template>
									</a-table>
								</div>
							</div>
						</div>
						<div class="group">
							<div class="label t"></div>
							<a-space>
								<a-button @click="() => handleNext('0')">上一步</a-button>
								<a-button @click="() => handleNext('2')">下一步</a-button>
								<a-button type="primary"
										  @click="handleSubmit">保存</a-button>
							</a-space>
						</div>
					</div>
				</a-tab-pane>
				<a-tab-pane :key="3"
							tab="商品详情">
					<div class="editor-container form-content">
						<div class="group"
							 style="display: block">
							<wang-editor ref="wangEditorRef"
										 :editorHeight="'450px'"
										 @editorCreated="editorCreate" />
							<p class="err"
							   v-if="data.formErrors.content">{{ data.formErrors.content }}</p>
						</div>
						<div class="group">
							<a-space>
								<a-button @click="() => handleNext('1')">上一步</a-button>
								<a-button type="primary"
										  @click="handleSubmit">保存</a-button>
							</a-space>
						</div>
					</div>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import WangEditor from '@/components/WangEditor.vue'
import { PlusOutlined, UploadOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { nextTick } from 'process'
import draggable from 'vuedraggable'
import { message } from 'ant-design-vue'

const data = ref({
	skuTable: {
		source: [],
		columns: [],
	},
	activeKey: 1,
	formState: {
		name: '',
		category_id: undefined,
		content: '123123',
		images: [],
		status: 1,
		attr_type: 1,
		sort: 100,
		goods_price: 0,
		line_price: 0,
		stock: 100,
		attr_detail: {},
	},
	formErrors: {
		name: '',
		category_id: '',
		content: '',
		images: '',
		status: '',
		attr_type: '',
		sort: '',
		goods_price: '',
		line_price: '',
		stock: '',
	},
	upload: {
		images: [],
		loading: false,
		loading1: false,
		headers: {
			Authorization: localStorage.getItem('token'),
		},
	},
	attrGroups: [],
	priceData: [],
	imageData: [],
	attrEditor: {},
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
	attrTypeOptions: [
		{
			value: 1,
			label: '单规格',
		},
		{
			value: 2,
			label: '多规格',
		},
	],
})

const inputRefs = ref({})
const editorRef = ref(null)

const editorCreate = () => {
	if (editorRef.value) {
		editorRef.value.setHtml(data.value.formState.content)
	}
}

const setHtml = () => {
	editorRef.value.setHtml(data.value.formState.content)
}
const editorClear = (content) => {
	if (editorRef.value) {
		editorRef.value.clearContent()
		editorRef.value.setHtml(content)
	}
}

// 获取编辑器内容的方法
const getContent = () => {
	if (editorRef.value) {
		// 调用子组件暴露的方法
		const content = editorRef.value.getEditorContent()
		return content
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
const handleRemove = (info) => {
	data.value.formState.images = data.value.formState.images.filter((item) => item !== info.response.data.path)
}
const skuUploadChange = (info, record) => {
	if (info.file.status === 'uploading') {
		record.upload_loading = true
		return
	}
	if (info.file.status === 'done') {
		var response = info.file.response
		if (response.code == 0) {
			record.pic = response.data.path
			record.image = response.data.path
		} else {
			message.error(response.msg)
		}
		record.upload_loading = false
	}
	if (info.file.status === 'error') {
		record.upload_loading = false
		message.error('upload error')
	}
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

const checkForm = () => {
	var isValid = true
	if (!data.value.formState.name) {
		data.value.formErrors.name = '请输入商品名称'
		isValid = false
	} else {
		data.value.formErrors.name = ''
	}
	if (!data.value.formState.category_id) {
		data.value.formErrors.category_id = '请选择商品分类'
		isValid = false
	} else {
		data.value.formErrors.category_id = ''
	}
	if (data.value.formState.images.length == 0) {
		data.value.formErrors.images = '请上传商品图片'
		isValid = false
	} else {
		data.value.formErrors.images = ''
	}
	if (!data.value.formState.attr_type) {
		data.value.formErrors.attr_type = '请选择商品类型'
		isValid = false
	} else {
		if (data.value.formState.attr_type == 1) {
			if (!data.value.formState.goods_price) {
				data.value.formErrors.goods_price = '请输入商品价格'
				isValid = false
			} else {
				data.value.formErrors.goods_price = ''
			}
			if (!data.value.formState.stock) {
				data.value.formErrors.stock = '请输入商品库存'
				isValid = false
			} else {
				data.value.formErrors.stock = ''
			}
		}
		data.value.formErrors.attr_type = ''
	}

	if (!data.value.formState.content) {
		data.value.formErrors.content = '请输入商品描述'
		isValid = false
	} else {
		data.value.formErrors.content = ''
	}
	return isValid
}

const handleNext = (key) => {
	data.value.activeKey = Number(key) + 1
	console.log(data.value.skuTable.source)
}

const addAttrGroup = () => {
	if (data.value.attrGroups.length == 3) {
		message.info('最多添加3个商品规格组')
		return
	}
	data.value.attrGroups.push({
		name: '',
		inpvst: false,
		children: [],
	})
}

const removeAttrGroup = (index) => {
	// 确保 index 是有效的
	if (index >= 0 && index < data.value.attrGroups.length) {
		data.value.attrGroups.splice(index, 1) // 删除指定下标的元素
		debounceGenerateSKUs()
	}
}

const showGroupItemInput = (group, index) => {
	group.inpvst = true
	focusInput(index)
}

const createGroupItem = (event, group) => {
	setTimeout(() => {
		var v = event.target.value
		if (!v) {
			group.inpvst = false
			return
		}
		group.children.push({
			name: v,
		})
		event.target.value = ''
		group.inpvst = false
		debounceGenerateSKUs()
	}, 50)
}

// 聚焦输入框的方法
const focusInput = (index) => {
	nextTick(() => {
		const inputRef = inputRefs.value[`inputRef-${index}`]
		if (inputRef) {
			inputRef.focus()
		}
	})
}

const handleGroupItemClose = (group, index) => {
	// 确保 group.children 是数组且下标有效
	if (group && Array.isArray(group.children) && index < group.children.length) {
		group.children.splice(index, 1) // 删除指定下标的元素
		debounceGenerateSKUs()
	}
}

// 防抖函数
const debounce = (fn, delay) => {
	let timer = null
	return function () {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			fn.apply(this, arguments)
		}, delay)
	}
}

// 防抖生成 SKU
const debounceGenerateSKUs = () => {
	debounce(generateSKUs, 300)()
}

// 生成 SKU
const generateSKUs = () => {
	const { attrGroups, priceData, imageData } = data.value
	const skuData = []

	// 递归生成 SKU 组合
	const createCombinations = (index, currentCombination) => {
		if (index === attrGroups.length) {
			// 当遍历到所有属性组时，将当前组合加入结果数组
			const skuCode = currentCombination.join('-') // SKU 编码，如：红色-L

			// 创建 SKU 对象
			const sku = {
				detail: {},
				pic: imageData[skuCode] || '',
				price: priceData[skuCode] || '',
				cost: 0,
				price: 0,
				ot_price: 0,
				stock: 100,
				weight: 0,
				volumn: 0,
				is_show: 1,
				attr_arr: currentCombination, // 组合的属性值
				is_default_select: 0,
				unique: Math.random().toString(36).substring(7), // 随机生成 unique
				index: skuData.length + 1, // 索引值
			}
			// 动态填充 detail 字段
			attrGroups.forEach((group, i) => {
				sku.detail[group.name] = currentCombination[i] // 将属性名和属性值填充到 detail
			})

			// 将生成的 SKU 添加到结果数组
			skuData.push(sku)
			return
		}

		// 确保当前属性组存在且包含有效的 children
		const currentGroup = attrGroups[index]
		if (currentGroup && Array.isArray(currentGroup.children)) {
			// 遍历当前属性组的选项，递归生成组合
			currentGroup.children.forEach((option) => {
				createCombinations(index + 1, [...currentCombination, option.name])
			})
		} else {
			console.error(`Invalid group or missing 'children' at index ${index}:`, currentGroup)
		}
	}
	// 从第一个属性组开始生成组合
	createCombinations(0, [])
	generateSkuTable(skuData)
	data.value.formState.attr_detail = skuData[0].detail
	return skuData
}

// 生成 SKU 表格
const generateSkuTable = (skuData) => {
	// 生成表头
	const columns = []
	if (skuData.length > 0 && skuData[0].detail) {
		for (const key in skuData[0].detail) {
			columns.push({
				title: key,
				dataIndex: key,
				key: key,
			})
		}
	}
	Object.keys(skuData[0]).forEach((key) => {
		if (!columns.find((item) => item.dataIndex == key)) {
			if (
				key == 'pic' ||
				key == 'image' ||
				key == 'cost' ||
				key == 'price' ||
				key == 'ot_price' ||
				key == 'stock' ||
				key == 'weight' ||
				key == 'volumn' ||
				key == 'is_show' ||
				key == 'is_default_select' ||
				key == 'is_show'
			) {
				const keyToNameMap = {
					cost: '成本价',
					pic: '图片',
					price: '售价',
					ot_price: '划线价',
					stock: '库存',
					weight: '重量(KG)',
					volumn: '体积(m³)',
					is_show: '是否显示',
					is_default_select: '默认选中',
				}
				let name = keyToNameMap[key] || key

				columns.push({
					title: name,
					dataIndex: key,
					key: key,
				})
			}
		}
	})
	// 生成表格数据
	const source = skuData.map((item) => {
		const row = {}
		for (const key in item) {
			if (key == 'detail') {
				for (const k in item[key]) {
					row[k] = item[key][k]
				}
			} else {
				row[key] = item[key]
			}
		}
		row['attr_details'] = item.detail
		return row
	})
	data.value.skuTable = {
		source,
		columns,
	}
}

// 是否显示
const itemShowChange = (record) => {
	record.is_show = record.is_show == 1 ? 0 : 1
	console.log(record.is_show)
}

// 默认选中
const itemDefaultSelectChange = (record) => {
	data.value.skuTable.source.forEach((item) => {
		// 只能有一个默认选中
		if (item.is_default_select == 1) {
			item.is_default_select = 0
		}
	})
	record.is_default_select = record.is_default_select == 1 ? 0 : 1
	console.log(record.is_default_select)
}

// 保存商品
const handleSubmit = () => {
	const payload = {
		...data.value.formState,
	}
	var content = getContent()
	console.log(content)
	if (content) {
		payload.content = content
	}
	if (payload.attr_type == 1) {
		payload.attr_value = ''
	} else if (payload.attr_type == 2) {
		payload.goods_price = undefined
		payload.line_price = undefined
		payload.attr_value = data.value.skuTable.source
		payload.items = data.value.attrGroups.map((item) => {
			return {
				value: item.name,
				detail: item.children.map((item) => {
					return item.name
				}),
			}
		})
	}

	checkForm()
	console.log(payload)
}

onMounted(() => {
	editorCreate()
})
</script>
<style lang="scss" scoped>
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

	.tips {
		color: #666;
		font-size: 13px;

		&.mt-1 {
			margin-top: 4px;
		}
	}

	.err {
		color: #f00;
		font-size: 13px;
	}

	.unit {
		color: #444;
		font-size: 12px;
	}
}

.w460 {
	width: 460px;
}

.attr-group {
	border: 1px solid #e8e8e8;
	border-radius: 5px;
	margin-bottom: 16px;
	overflow: hidden;

	.attr-group-head {
		padding: 8px;
		border-bottom: 1px solid #e8e8e8;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		background-color: #f5f6f7;

		.input {
			border: 0;
			outline: 0;
			background-color: transparent;
			box-shadow: none;
			padding: 0;
			flex: 1;
		}

		.close {
			font-size: 12px;
			color: #f00;
			cursor: pointer;
		}
	}

	.attr-group-content {
		padding: 8px;
	}
}

.lvl-tag {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	color: rgba(0, 0, 0, 0.88);
	font-size: 12px;
	line-height: 20px;
	list-style: none;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
		'Segoe UI Symbol', 'Noto Color Emoji';
	display: inline-block;
	height: auto;
	margin-inline-end: 8px;
	padding-inline: 7px;
	white-space: nowrap;
	background: rgba(0, 0, 0, 0.02);
	border: 1px solid #d9d9d9;
	border-radius: 4px;
	opacity: 1;
	transition: all 0.2s;
	text-align: start;
	display: inline-flex;
	align-items: center;

	:deep(.anticon) {
		cursor: pointer;

		svg {
			margin-left: 2px;
			transform: scale(0.85);
		}
	}
}

.sku-upload {
	width: auto;

	:deep(.ant-upload) {
		min-width: 50px;
		width: auto !important;
		height: 50px !important;
		margin: 0 !important;
	}
}

#image-list {
	display: inline-block;

	img {
		max-width: 90px;
	}
}

.product-media-upload {
	width: 68px !important;
	height: 68px !important;

	:deep(.ant-upload) {
		min-width: 68px !important;
		width: 68px !important;
		height: 68px !important;
		margin: 0 !important;
	}
}

.flex {
	flex-wrap: wrap;

	&.gap8 {
		gap: 8px;
	}

	.image-item {
		width: 68px;
		height: 68px;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		box-sizing: border-box;
		padding: 12px;
		position: relative;

		img {
			max-height: 60px;
		}

		.close-item {
			position: absolute;
			top: 2px;
			right: 2px;
			cursor: pointer;
			color: #fff;
			font-size: 12px;
			background-color: rgba(0, 0, 0, 0.35);
			border-radius: 50%;
			width: 16px;
			height: 16px;
			line-height: 14px;
			text-align: center;

			&:hover {
				background-color: rgba(0, 0, 0, 0.5);
			}
		}
	}
}

.editor-container {
	max-width: 800px;
}
</style>
