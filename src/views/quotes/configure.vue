<template>
	<div class="body-container">
		<a-card class="mb-16">
			<a-space>
				<a-button @click="showCategoryModal">材料分类</a-button>
				<a-button type="primary"
						  @click="showMaterialModal(1, {})">新建材料</a-button>
			</a-space>
		</a-card>
		<a-card>
			<a-table :data-source="data.source"
					 :columns="data.columns"
					 :pagination="data.pagination"
					 :loading="data.tableLoading"
					 @change="tableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'cn_name'">
						<span>{{ record.cn_name }}</span>
						/
						<span>{{ record.en_name }}</span>
					</template>
					<template v-if="column.key === 'material_craft_type'">
						<a-tag v-if="record.material_craft_type === 1"
							   color="blue">3D打印</a-tag>
						<a-tag v-else-if="record.material_craft_type === 2"
							   color="green">CNC机加工</a-tag>
					</template>
					<template v-if="column.key === 'material_category'">
						<span>{{ record.category?.cn_name }}</span>
					</template>
					<template v-if="column.key === 'actions'">
						<a-space>
							<a-button type="link"
									  size="small"
									  @click="showMaterialModal(2, record)">编辑</a-button>
							<a-button type="link"
									  size="small"
									  @click="deleteMaterialCategory(record.id)">删除</a-button>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.categoryModal.visible"
				 :title="data.categoryModal.title"
				 :footer="null"
				 width="850px">
			<a-space class="mb-16">
				<a-button type="primary"
						  @click="showCategoryEditModal(1, {})">新建分类</a-button>
			</a-space>
			<a-table :data-source="data.categoryModal.source"
					 :columns="data.categoryModal.columns"
					 :pagination="data.categoryModal.pagination"
					 :loading="data.categoryModal.loading"
					 @change="categoryTableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'craft_type'">
						<a-tag v-if="record.craft_type === 1"
							   color="blue">3D打印</a-tag>
						<a-tag v-else-if="record.craft_type === 2"
							   color="green">CNC机加工</a-tag>
					</template>
					<template v-if="column.key === 'actions'">
						<a-space>
							<a-button type="link"
									  size="small"
									  @click="showCategoryEditModal(2, record)">编辑</a-button>
							<a-button type="link"
									  size="small"
									  @click="deleteMaterialCategory(record.id)">删除</a-button>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-modal>

		<a-modal v-model:open="data.categoryModal.editeModal.visible"
				 :title="data.categoryModal.editeModal.title"
				 :footer="null"
				 :confirmLoading="data.categoryModal.editeModal.loading">
			<div class="form-wrap">
				<a-form :model="data.categoryModal.form"
						name="categoryForm"
						@finish="onCategoryModalFinish">
					<a-flex justify="space-between">
						<a-form-item label="中文名"
									 name="cn_name"
									 :rules="[{ required: true, message: '请输入中文分类名称' }]">
							<a-input v-model:value="data.categoryModal.form.cn_name"
									 placeholder="请输入中文分类名称" />
						</a-form-item>
						<a-form-item label="英文名"
									 name="en_name"
									 :rules="[{ required: true, message: '请输入英文分类名称' }]">
							<a-input v-model:value="data.categoryModal.form.en_name"
									 placeholder="请输入英文分类名称" />
						</a-form-item>
					</a-flex>

					<a-form-item label="工艺"
								 name="craft_type"
								 :rules="[{ required: true, message: '请选择工艺' }]">
						<a-select v-model:value="data.categoryModal.form.craft_type"
								  placeholder="请选择工艺">
							<a-select-option :value="1">3D打印</a-select-option>
							<a-select-option :value="2">CNC机加工</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="排序"
								 name="sort"
								 :rules="[{ required: true, message: '请输入排序' }]">
						<a-input v-model:value="data.categoryModal.form.sort"
								 placeholder="请输入排序" />
					</a-form-item>
					<a-form-item>
						<a-space :size="12">
							<a-button type="primary"
									  html-type="submit"
									  :loading="data.categoryModal.editeModal.loading">提交</a-button>
							<a-button @click="data.categoryModal.editeModal.visible = false">取消</a-button>
						</a-space>
					</a-form-item>
				</a-form>
			</div>
		</a-modal>
		<a-modal v-model:open="data.materialModal.visible"
				 :title="data.materialModal.title"
				 :confirmLoading="data.materialModal.loading"
				 :width="'75vw'"
				 :footer="null"
				 @cancel="closeMaterialModal">
			<a-form class="pd16"
					:model="data.materialModal.state"
					a-formdel="formState"
					name="basic"
					autocomplete="off"
					@finish="onMaterialFormFinish"
					style="max-width: 75%">
				<a-flex justify="space-between"
						class="w450">
					<a-form-item label="中文名"
								 name="cn_name"
								 :rules="[{ required: true, message: '请输入中文名' }]">
						<a-input v-model:value="data.materialModal.state.cn_name"
								 placeholder="请输入中文名" />
					</a-form-item>
					<a-form-item label="英文名"
								 name="en_name"
								 :rules="[{ required: true, message: '请输入英文名' }]">
						<a-input v-model:value="data.materialModal.state.en_name"
								 placeholder="请输入英文名" />
					</a-form-item>
				</a-flex>
				<a-form-item label="材料分类"
							 name="material_category"
							 :rules="[{ required: true, message: '请选择分类' }]"
							 class="w450">
					<a-select v-model:value="data.materialModal.state.material_category"
							  :options="data.materialModal.materialCategorys"
							  placeholder="请选择分类"
							  allowClear
							  @change="handleMaterialCategoryChange"></a-select>
				</a-form-item>
				<a-flex justify="space-between"
						class="w450"
						v-if="data.materialModal.currentCraftType === 2">
					<a-form-item label="每克价格"
								 name="price_per_gram"
								 :rules="[{ required: true, message: '请输入每克价格' }]">
						<a-input-number v-model:value="data.materialModal.state.price_per_gram"
										placeholder="请输入每克价格"
										:min="0"
										style="width: 120px" />
					</a-form-item>
					<a-form-item label="密度/mm³"
								 name="density"
								 :rules="[{ required: true, message: '请输入密度' }]">
						<a-input-number v-model:value="data.materialModal.state.density"
										placeholder="请输入密度"
										:min="0"
										style="width: 120px" />
					</a-form-item>
					<a-form-item label="硬度（洛氏硬度）"
								 name="hardness"
								 :rules="[{ required: true, message: '请输入硬度' }]"
								 v-if="data.materialModal.currentCraftType === 2">
						<a-input-number v-model:value="data.materialModal.state.hardness"
										placeholder="请输入硬度"
										:min="0"
										style="width: 120px" />
					</a-form-item>
				</a-flex>
				<a-flex justify="space-between"
						class="w450"
						v-if="data.materialModal.currentCraftType === 1">
					<a-form-item label="材料特性（中文）"
								 name="material_properties_cn"
								 :rules="[{ required: true, message: '请输入材料特性' }]">
						<a-input v-model:value="data.materialModal.state.material_properties_cn"
								 placeholder="请输入材料特性" />
					</a-form-item>
					<a-form-item label="材料特性（英文）"
								 name="material_properties_en"
								 :rules="[{ required: true, message: '请输入材料特性' }]">
						<a-input v-model:value="data.materialModal.state.material_properties_en"
								 placeholder="请输入材料特性" />
					</a-form-item>
				</a-flex>
				<a-form-item label="材料颜色"
							 :rules="[{ required: true, message: '请输入材料颜色' }]"
							 v-if="data.materialModal.currentCraftType === 1">
					<div style="width: 400px; margin-bottom: 12px">
						<a-input-group compact>
							<a-input v-model:value="data.materialModal.newColor_cn"
									 style="width: 40%"
									 placeholder="请在此处输入颜色中文名" />
							<a-input v-model:value="data.materialModal.newColor_en"
									 style="width: 40%"
									 placeholder="请在此处输入颜色英文名" />
							<a-button type="primary"
									  @click="addMaterialNewColor">添加</a-button>
						</a-input-group>
					</div>
					<div v-if="data.materialModal.state.colors.length > 0">
						<a-collapse accordion>
							<template #expandIcon="{ isActive }">
								<caret-right-outlined :rotate="isActive ? 90 : 0" />
							</template>
							<a-collapse-panel v-for="(color, index) in data.materialModal.state.colors"
											  :key="index"
											  :header="color.cn_name + ' / ' + color.en_name">
								<template #extra>
									<a style="color: #de5044"
									   @click="removeMaterialColor(index)">删除</a>
								</template>
								<a-space>
									<a-form-item label="每克价格"
												 class="inline">
										<a-input v-model:value="color.price_per_gram"></a-input>
									</a-form-item>
									<a-form-item label="密度/mm³"
												 class="inline">
										<a-input v-model:value="color.density"></a-input>
									</a-form-item>
									<a-form-item label="颜色代码"
												 class="inline">
										<a-input v-model:value="color.color"></a-input>
									</a-form-item>
								</a-space>
							</a-collapse-panel>
						</a-collapse>
					</div>
				</a-form-item>
				<a-form-item label="表面处理方式"
							 v-if="data.materialModal.currentCraftType === 2">
					<div class="mb-16">
						<a-button @click="addSurfaceItem">+ 添加表面处理方式</a-button>
					</div>
					<a-table :data-source="data.materialModal.surfaceTable.source"
							 :columns="data.materialModal.surfaceTable.columns"
							 size="small"
							 bordered
							 v-if="data.materialModal.surfaceTable.source.length > 0">
						<template #bodyCell="{ column, record }">
							<template v-if="column.key == 'cn_name'">
								<a-input v-model:value="record.cn_name"
										 placeholder="请输入中文名"
										 class="w150" />
							</template>
							<template v-if="column.key == 'en_name'">
								<a-input v-model:value="record.en_name"
										 placeholder="请输入英文名"
										 class="w150" />
							</template>
							<template v-if="column.key == 'type'">
								<a-select v-model:value="record.type"
										  v-model:options="data.typeOptions"
										  placeholder="请选择类型"
										  class="w150"></a-select>
							</template>
							<template v-if="column.key == 'base_price'">
								<a-input-number v-model:value="record.base_price"
												placeholder="请输入基础价格"
												class="w150" />
							</template>
							<template v-if="column.key == 'colors'">
								<div>
									<a-button @click="addSurfaceColorItem(record)"
											  size="small">添加颜色</a-button>
								</div>
								<a-space v-for="(item, index) in record.colors"
										 :key="index">
									<a-input-group compact>
										<a-input size="small"
												 v-model:value="item.cn_name"
												 style="width: 25%"
												 placeholder="中文名" />
										<a-input size="small"
												 v-model:value="item.en_name"
												 style="width: 25%"
												 placeholder="英文名" />
										<a-input size="small"
												 v-model:value="item.price"
												 style="width: 25%"
												 placeholder="金额" />
										<a-input size="small"
												 v-model:value="item.code"
												 style="width: 25%"
												 placeholder="颜色代码" />
									</a-input-group>
									<span class="delete-item"
										  @click="removeSurfaceColorItem(record, index)">删除</span>
								</a-space>
							</template>
							<template v-if="column.key === 'actions'">
								<a-space>
									<a class="white-space-nowrap"
									   @click="removeSurfaceItem(record)">删除</a>
								</a-space>
							</template>
						</template>
					</a-table>
				</a-form-item>
				<a-form-item label="排序"
							 name="sort"
							 :rules="[{ required: true, message: '请输入排序' }]">
					<a-input v-model:value="data.materialModal.state.sort"
							 placeholder="请输入排序"
							 style="width: 150px" />
					<p class="help-text">数字越小，排序越靠前</p>
				</a-form-item>
				<a-form-item label="材料预览图"
							 name="images"
							 :rules="[{ required: true, message: '请上传材料预览图' }]">
					<a-upload v-model:file-list="data.materialModal.fileList"
							  name="file"
							  :data="{ uuid: 'system/material' }"
							  action="https://api.momaking.cn/api/upload/offline"
							  list-type="picture-card"
							  accept="image/*"
							  @change="handleImageChange"
							  @remove="handleImageRemove">
						<div v-if="data.materialModal.state.images.length < 8">
							<plus-outlined />
							<div style="margin-top: 8px">上传图片</div>
						</div>
					</a-upload>
				</a-form-item>
				<a-flex justify="space-between">
					<a-form-item label="材料介绍"
								 name="description_cn"
								 :rules="[{ required: true, message: '请输入材料介绍' }]">
						<WangEditor :editorHeight="'350px'"
									v-model="data.materialModal.state.description_cn"></WangEditor>
					</a-form-item>
					<div style="width: 16px"></div>
					<a-form-item label="材料介绍（英文）"
								 name="description_en"
								 :rules="[{ required: true, message: 'Please enter material description' }]">
						<WangEditor :editorHeight="'350px'"
									v-model="data.materialModal.state.description_en"></WangEditor>
					</a-form-item>
				</a-flex>
				<a-form-item>
					<a-space>
						<a-button type="primary"
								  html-type="submit"
								  :loading="data.materialModal.loading">提交</a-button>
						<a-button @click="closeMaterialModal">取消</a-button>
					</a-space>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { makeMaterialCategoryApi, materialCategoryListApi, deleteMaterialCategoryApi, makeMaterialApi, materialListApi } from '@/api/quotation'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import WangEditor from '@/components/WangEditor1.vue'
import { CaretRightOutlined } from '@ant-design/icons-vue'

const data = ref({
	tableLoading: false,
	source: [],
	columns: [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: '材料名称',
			dataIndex: 'cn_name',
			key: 'cn_name',
		},
		{
			title: '工艺类型',
			dataIndex: 'material_craft_type',
			key: 'material_craft_type',
		},
		{
			title: '材料类型',
			dataIndex: 'material_category',
			key: 'material_category',
		},
		{
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
		},
		{
			title: '操作',
			dataIndex: 'actions',
			key: 'actions',
			scopedSlots: { customRender: 'actions' },
		},
	],
	typeOptions: [
		{
			value: 1,
			label: '纹理处理类',
		},
		{
			value: 2,
			label: '阳极氧化类',
		},
		{
			value: 3,
			label: '电镀类',
		},
		{
			value: 4,
			label: '涂层类',
		},
	],
	tableSearch: {
		name: undefined,
		craft_type: undefined,
	},
	pagination: {
		current: 1,
		pageSize: 10,
		total: 0,
	},
	categoryModal: {
		visible: false,
		title: '分类管理',
		loading: false,
		source: [],
		columns: [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
			},
			{
				title: '中文名称',
				dataIndex: 'cn_name',
				key: 'cn_name',
			},
			{
				title: '英文名称',
				dataIndex: 'en_name',
				key: 'en_name',
			},
			{
				title: '工艺类型',
				dataIndex: 'craft_type',
				key: 'craft_type',
			},
			{
				title: '排序',
				dataIndex: 'sort',
				key: 'sort',
			},
			{
				title: '操作',
				dataIndex: 'actions',
				key: 'actions',
				scopedSlots: { customRender: 'actions' },
			},
		],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		form: {
			id: undefined,
			cn_name: '',
			en_name: '',
			craft_type: 1,
			sort: 99,
		},
		editeModal: {
			visible: false,
			title: '编辑分类',
			loading: false,
		},
	},
	materialModal: {
		visible: false,
		title: '新建材料',
		loading: false,
		currentCraftType: undefined,
		materialColors: [],
		materialCategorys: [],
		newColor_cn: '',
		newColor_en: '',
		surfaceTable: {
			source: [],
			columns: [
				{
					title: '中文名',
					dataIndex: 'cn_name',
					key: 'cn_name',
				},
				{
					title: '英文名',
					dataIndex: 'en_name',
					key: 'en_name',
				},
				{
					title: '类型',
					dataIndex: 'type',
					key: 'type',
				},
				{
					title: '基础价格',
					dataIndex: 'base_price',
					key: 'base_price',
				},
				{
					title: '颜色',
					dataIndex: 'colors',
					key: 'colors',
				},
				{
					title: '操作',
					dataIndex: 'actions',
					key: 'actions',
				},
			],
		},
		fileList: [],

		state: {
			id: undefined,
			cn_name: '',
			en_name: '',
			material_category: undefined,
			images: [],
			description_cn: '',
			description_en: '',
			colors: [],
			price_per_gram: 0,
			density: 0,
			hardness: 0,
			sort: 99,
			material_properties_cn: '',
			material_properties_en: '',
		},
	},
})

const categoryLabelMap: Record<number, string> = {
	1: '3D打印材料',
	2: 'CNC材料',
}

const showCategoryModal = () => {
	if (data.value.categoryModal.source.length <= 0) {
		data.value.categoryModal.pagination = {
			current: 1,
			pageSize: 10,
			total: 0,
		}
		getMaterialCategoryList()
	}
	resetCategoryFormState()
	data.value.categoryModal.visible = true
}

const showCategoryEditModal = (type, record) => {
	resetCategoryFormState()
	if (type == 1) {
		data.value.categoryModal.editeModal.title = '新建分类'
	} else {
		data.value.categoryModal.editeModal.title = '编辑分类'
		data.value.categoryModal.form = {
			id: record.id,
			cn_name: record.cn_name,
			en_name: record.en_name,
			craft_type: record.craft_type,
			sort: record.sort,
		}
	}
	data.value.categoryModal.editeModal.visible = true
}

const resetCategoryFormState = () => {
	data.value.categoryModal.form = {
		id: undefined,
		cn_name: '',
		en_name: '',
		craft_type: 1,
		sort: 99,
	}
}

// 保存材料分类
const onCategoryModalFinish = (value: any) => {
	const payload = {
		...value,
	}
	if (data.value.categoryModal.form.id) {
		payload.id = data.value.categoryModal.form.id
	}
	data.value.categoryModal.editeModal.loading = true
	makeMaterialCategoryApi(payload)
		.then((res: any) => {
			data.value.categoryModal.editeModal.visible = false
			if (res.code == 0) {
				message.success(res.msg)
			}
		})
		.catch((error) => { })
		.finally(() => {
			data.value.categoryModal.editeModal.loading = false
			getMaterialCategoryList()
		})
}

interface ColorItem {
	cn_name: string
	en_name: string
	price: number
	code: string
}

interface SurfaceItem {
	cn_name: string
	en_name: string
	base_price: number
	colors: ColorItem[]
}

interface MaterialFormValues {
	[key: string]: any
	surfaceTable: {
		source: SurfaceItem[]
	}
}

const onMaterialFormFinish = (values: MaterialFormValues) => {
	const payload = {
		id: data.value.materialModal.state.id,
		...values,
		colors: [],
		surface:
			data.value.materialModal.surfaceTable?.source?.map((item) => ({
				cn_name: item.cn_name,
				en_name: item.en_name,
				base_price: item.base_price,
				type: item.type,
				colors:
					item.colors?.map((color) => ({
						cn_name: color.cn_name,
						en_name: color.en_name,
						price: color.price,
						code: color.code,
						key: color.key || getPassword(8), // 确保每个颜色都有唯一的key
					})) ?? [],
			})) ?? [],
	}
	if (data.value.materialModal.currentCraftType == 1) {
		payload.colors = data.value.materialModal.state.colors
	}
	data.value.materialModal.loading = true
	console.log(payload)
	makeMaterialApi(payload)
		.then((res: any) => {
			if (res.code == 0) {
				message.success(res.msg)
				data.value.materialModal.visible = false
				resetMaterialFormState()
				data.value.pagination.current = 1
				getMaterialList()
			}
		})
		.finally(() => {
			data.value.materialModal.loading = false
		})
}

const resetMaterialFormState = () => {
	data.value.materialModal.currentCraftType = undefined
	data.value.materialModal.state = {
		id: undefined,
		cn_name: '',
		en_name: '',
		material_category: undefined,
		images: [],
		description_cn: '',
		description_en: '',
		colors: [],
		price_per_gram: 0,
		density: 0,
		hardness: 0,
		sort: 99,
		material_properties_cn: '',
		material_properties_en: '',
	}
	data.value.materialModal.surfaceTable.source = []
	data.value.materialModal.fileList = []
}

const getMaterialCategoryList = () => {
	data.value.categoryModal.loading = true
	materialCategoryListApi(data.value.categoryModal.pagination)
		.then((res: any) => {
			data.value.categoryModal.source = res.data.data
			data.value.categoryModal.pagination.total = res.data.total
		})
		.finally(() => {
			data.value.categoryModal.loading = false
		})
}

const getMaterialCategoryNotPaginationList = async () => {
	data.value.materialModal.loading = true
	await materialCategoryListApi({ close_pagination: 1 })
		.then((res: any) => {
			var categorys = []
			res.data.forEach((item) => {
				if (!categorys[item.craft_type]) {
					categorys[item.craft_type] = []
				}
				categorys[item.craft_type].push(item)
			})
			data.value.materialModal.materialCategorys = Object.entries(categorys).map(([craftType, items]) => {
				return {
					label: categoryLabelMap[+craftType] || `类型${craftType}`,
					options: items.map((item: any) => ({
						value: item.id,
						label: item.cn_name,
						craft_type: item.craft_type,
					})),
				}
			})
		})
		.catch((error) => { })
		.finally(() => {
			data.value.materialModal.loading = false
		})
}

const deleteMaterialCategory = (id) => {
	Modal.confirm({
		title: '删除确认',
		content: '确定要删除此材料分类吗？',
		onOk() {
			// 调用删除接口
			deleteMaterialCategoryApi({ ids: [id] })
				.then((res: any) => {
					if (res.code === 0) {
						message.success('删除成功')
						getMaterialCategoryList()
					} else {
						message.error(res.msg)
					}
				})
				.catch((error) => {
					message.error('删除失败，请稍后再试')
				})
		},
	})
}

// 打开材料编辑
const showMaterialModal = async (type, record) => {
	await getMaterialCategoryNotPaginationList()
	if (type == 1) {
		data.value.materialModal.title = '新建材料'
	} else {
		data.value.materialModal.title = '编辑材料'
		data.value.materialModal.state = { ...record }
		console.log(data.value.materialModal.state)
		getMaterialCategoryCraftType(record.material_category)
		data.value.materialModal.state.colors = record.colors || []
		data.value.materialModal.fileList = record.images.map((img) => ({
			uid: img,
			name: img.split('/').pop(),
			status: 'done',
			url: img,
			response: { data: { path: img } },
		}))
		data.value.materialModal.surfaceTable.source = record.surface
	}
	data.value.materialModal.visible = true
}

const closeMaterialModal = () => {
	data.value.materialModal.visible = false
	resetMaterialFormState()
	data.value.materialModal.fileList = []
}

const categoryTableChange = (pagination) => {
	data.value.categoryModal.pagination = pagination
	getMaterialCategoryList()
}

const addSurfaceItem = () => {
	data.value.materialModal.surfaceTable.source.push({
		cn_name: '',
		en_name: '',
		base_price: '',
		colors: [],
		actions: undefined,
	})
}

const getPassword = (length) => {
	let pass = ''
	let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 1; i <= length; i++) {
		let char = Math.floor(Math.random() * str.length)
		pass += str.charAt(char)
	}
	return pass
}

const addSurfaceColorItem = (record) => {
	if (!record.colors) {
		record.colors = []
	}
	record.colors.push({
		cn_name: '',
		en_name: '',
		color_code: '',
		key: getPassword(8),
	})
}

const removeSurfaceColorItem = (record, index) => {
	if (record && Array.isArray(record.colors)) {
		record.colors.splice(index, 1)
	}
}

const removeSurfaceItem = (recordToRemove) => {
	const list = data.value.materialModal.surfaceTable.source
	const index = list.indexOf(recordToRemove)
	if (index !== -1) {
		list.splice(index, 1)
	}
}

const handleImageChange = (info) => {
	if (info.file.status === 'done') {
		var response = info.file.response
		if (response.code == 0) {
			data.value.materialModal.state.images.push(response.data.path)
		} else {
			message.error(response.msg)
		}
	}
	// 更新图片列表
	// data.value.materialModal.state.images = info.fileList.map((file) => file.response?.data?.path || file.url)
}

const handleImageRemove = (file) => {
	console.log(file)
	// 从状态中移除图片
	data.value.materialModal.state.images = data.value.materialModal.state.images.filter((img) => img !== file.response?.data?.path)
	// 更新文件列表
	data.value.materialModal.fileList = data.value.materialModal.fileList.filter((f) => f.uid !== file.uid)
}

const getMaterialList = () => {
	const payload = {
		page: data.value.pagination.current,
		page_size: data.value.pagination.pageSize,
		...data.value.tableSearch,
	}
	data.value.tableLoading = true
	materialListApi(payload)
		.then((res: any) => {
			data.value.source = res.data.data
			data.value.pagination.total = res.data.total
		})
		.finally(() => {
			data.value.tableLoading = false
		})
}

const tableChange = (paginate: any) => {
	data.value.pagination.current = paginate.current as number
	data.value.pagination.pageSize = paginate.pageSize
	getMaterialList()
}

const handleMaterialCategoryChange = (value, obj) => {
	data.value.materialModal.currentCraftType = obj.craft_type
}

const getMaterialCategoryCraftType = async (id) => {
	console.log(data.value.materialModal.materialCategorys)
	const category = data.value.materialModal.materialCategorys.find((item) => item.options.some((opt) => opt.value === id))
	data.value.materialModal.currentCraftType = category ? category.options.find((opt) => opt.value === id)?.craft_type : undefined
}

const addMaterialNewColor = () => {
	if (!data.value.materialModal.newColor_cn || !data.value.materialModal.newColor_en) {
		message.error('请填写颜色的中文名和英文名')
		return
	}
	data.value.materialModal.state.colors.push({
		cn_name: data.value.materialModal.newColor_cn,
		en_name: data.value.materialModal.newColor_en,
		price_per_gram: 0,
		density: 0,
		code: '',
	})
	data.value.materialModal.newColor_cn = ''
	data.value.materialModal.newColor_en = ''
}

const removeMaterialColor = (index) => {
	data.value.materialModal.state.colors.splice(index, 1)
}

onMounted(() => {
	getMaterialList()
	// getMaterialCategoryList()
})
</script>
<style lang="scss" scoped>
:deep(.ant-form-item) {
	margin-bottom: 16px;

	.ant-form-item-row {
		display: block;
	}
}

.inline {
	:deep(.ant-form-item) {
		margin-bottom: 16px;

		.ant-form-item-row {
			display: flex;
		}
	}
}

.pd16 {
	padding: 16px;
}

.w450 {
	width: 450px;
}

.w150 {
	width: 150px;
}

.delete-item {
	cursor: pointer;
	// 不换行
	white-space: nowrap;
	color: #ff4d4f;
}

.white-space-nowrap {
	white-space: nowrap;
}
</style>
