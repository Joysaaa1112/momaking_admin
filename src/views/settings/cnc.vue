<template>
	<div class="body-container">
		<a-card>
			<a-flex wrap="wrap"
					:gap="16"
					class="mb24"
					justify="space-between"
					align="center">
				<a-flex :gap="16">
					<div class="a-item">
						<a-button type="primary"
								  @click="showUploadModal(1)">上传模型</a-button>
					</div>
					<div class="a-item">
						<span style="color: #666">如果同时开启多个模型，将用每个模型分预测价格除以模型数量获取平均值</span>
					</div>
				</a-flex>
				<a-flex>
					<span>模型状态：</span>
					<a-switch :checked="data.aiPriceSwitch"
							  @change="cncAiPriceSwitchChange" />
				</a-flex>
			</a-flex>
			<a-table :dataSource="data.source"
					 :columns="data.columns"
					 :pagination="data.pagination"
					 :loading="data.tableLoading"
					 @change="tableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key == 'type'">
						<a-tag v-if="record.type == 1"
							   color="blue">预测模型</a-tag>
						<a-tag v-else
							   color="pink">数学标准化模型</a-tag>
					</template>
					<template v-if="column.key == 'status'">
						<a-switch :checked="record.status == 1 ? true : false"
								  @change="handleSwitchChange(record)" />
					</template>
					<template v-if="column.key === 'action'">
						<a-button type="link"
								  @click="showUploadModal(2, record)">编辑</a-button>
						<a-button type="link"
								  @click="deleteModel(record.id)">删除</a-button>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.modal.visit"
				 :title="data.modal.title"
				 :confirmLoading="data.modal.loading"
				 @ok="modalHandleOk">
			<div class="form-content">
				<div class="group">
					<span class="title">
						模型文件
						<span class="must">*</span>
					</span>
					<a-upload name="file"
							  list-type="picture-card"
							  class="avatar-uploader"
							  :data="{ uuid: 'system/cnc_models' }"
							  :show-upload-list="false"
							  :headers="data.headers"
							  action="https://api.momaking.cn/api/upload/offline"
							  :before-upload="beforeUpload"
							  @change="handleChange">
						<div v-if="data.modal.state.path">
							<span style="/**强制换行 */ padding: 4px; word-break: break-all">{{ data.modal.state.filename }}</span>
						</div>
						<div v-else>
							<loading-outlined v-if="data.modal.upload.loading"></loading-outlined>
							<plus-outlined v-else></plus-outlined>
							<div class="ant-upload-text">Upload</div>
						</div>
					</a-upload>
				</div>
				<div class="group">
					<span class="title">
						模型名称
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.modal.state.name"
							 placeholder="模型名称"></a-input>
				</div>
				<div class="group">
					<span class="title">
						模型类型
						<span class="must">*</span>
					</span>
					<a-select class="full"
							  v-model:value="data.modal.state.type"
							  placeholder="模型类型">
						<a-select-option :value="1">预测模型</a-select-option>
						<a-select-option :value="2">数学标准化模型</a-select-option>
					</a-select>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { cncModelCreate, cncModelList, cncModelStatus, cncModelDelete } from '@/api/settings'
import { Modal } from 'ant-design-vue'
import { getSettingApi, updateSettingApi } from '@/api'
import { stripLegacyStaticBase } from '@/utils/url'
const data = ref({
	aiPriceSwitch: false,
	headers: {
		Authorization: localStorage.getItem('authorization'),
	},
	tableLoading: false,
	source: [],
	columns: [
		{ title: 'ID', dataIndex: 'id', key: 'id', width: 90, fixed: 'left' },
		{ title: '模型名称', dataIndex: 'name', key: 'name' },
		{ title: '文件名', dataIndex: 'filename', key: 'filename' },
		{ title: '路径', dataIndex: 'path', key: 'path', width: 200 },
		{ title: '类型', dataIndex: 'type', key: 'type' },
		{ title: '状态', dataIndex: 'status', key: 'status' },
		{ title: '创建时间', dataIndex: 'create_time', key: 'create_time' },
		{ title: '更新时间', dataIndex: 'update_time', key: 'update_time' },
		{ title: '操作', dataIndex: 'action', key: 'action' },
	],
	search: {
		name: '',
	},
	pagination: {
		current: 1,
		pageSize: 10,
		total: 0,
	},
	modal: {
		visit: false,
		loading: false,
		title: '上传模型',
		upload: {
			loading: false,
		},
		state: {
			type: 1,
			filename: '',
			path: null,
			name: '',
		},
	},
})

const tableChange = (a, b) => {
	data.value.pagination.current = a.current
	data.value.pagination.pageSize = a.pageSize
	getCncModelList()
}

const deleteModel = (recordId) => {
	Modal.confirm({
		title: '确定要删除该模型吗？',
		onOk () {
			data.value.tableLoading = true
			cncModelDelete({ id: recordId })
				.then((result) => {
					if (result.code == 0) {
						getCncModelList()
					} else {
						message.error(result.msg)
					}
				})
				.finally(() => {
					data.value.tableLoading = false
				})
		},
		onCancel () {
			console.log('Cancel')
		},
	})
}

const getCncModelList = () => {
	const payload = {
		page: data.value.pagination.current,
		page_size: data.value.pagination.pageSize,
		name: data.value.search.name || undefined,
	}
	cncModelList(payload)
		.then((result) => {
			if (result.code == 0) {
				data.value.source = result.data.data
				data.value.pagination.total = result.data.total
			}
		})
		.catch((err) => {
			console.log(err)
		})
}

const modalHandleOk = () => {
	var payload = {
		type: data.value.modal.state.type,
		filename: data.value.modal.state.filename,
		name: data.value.modal.state.name,
		path: data.value.modal.state.path,
	}
	if (data.value.modal.state.id) {
		payload.id = data.value.modal.state.id
	}
	if (!data.value.modal.state.path) {
		message.error('请上传模型文件')
		return
	}
	if (!data.value.modal.state.name) {
		message.error('请输入模型名称')
		return
	}
	data.value.modal.loading = true
	cncModelCreate(payload)
		.then((result) => {
			if (result.code == 0) {
				message.success(result.msg)
				data.value.modal.visit = false
				getCncModelList()
			}
		})
		.finally(() => {
			data.value.modal.loading = false
		})
}

const resetModalValue = () => {
	data.value.modal.state = {
		type: 1,
		filename: '',
		path: null,
		name: '',
	}
}

const showUploadModal = (type, record) => {
	resetModalValue()
	if (type == 1) {
		data.value.modal.title = '上传模型'
	} else {
		data.value.modal.title = '编辑模型'
		data.value.modal.state = {
			id: record.id,
			type: record.type,
			filename: record.filename,
			path: record.path,
			name: record.name,
		}
	}
	data.value.modal.visit = true
}

const handleSwitchChange = (record) => {
	record.status = record.status == 1 ? 0 : 1
	data.value.tableLoading = true
	cncModelStatus({ id: record.id, status: record.status })
		.then((result) => { })
		.finally(() => {
			data.value.tableLoading = false
		})
}

const cncAiPriceSwitchChange = (value) => {
	data.value.aiPriceSwitch = value
	updateSettingApi({ name: 'cnc_ai_price', value: value ? 1 : 0 }).then((result) => {
		if (result.code == 0) {
			message.success(result.msg)
		}
	})
}

const getAiPriceSwitch = () => {
	getSettingApi({ name: 'cnc_ai_price' }).then((result) => {
		if (result.code == 0) {
			data.value.aiPriceSwitch = Number(result.data.value) == 1 ? true : false
		}
	})
}

const handleChange = (info) => {
	if (info.file.status === 'uploading') {
		data.value.modal.upload.loading = true
		return
	}
	if (info.file.status === 'done') {
		var response = info.file.response
		if (response.code == 0) {
			data.value.modal.state.path = stripLegacyStaticBase(response.data.path)
		} else {
			message.error(response.msg)
		}
		data.value.modal.upload.loading = false
	}
	if (info.file.status === 'error') {
		data.value.modal.upload.loading = false
		message.error('upload error')
	}
}
const beforeUpload = (file) => {
	data.value.modal.state.filename = file.name
}

onBeforeMount(() => {
	getCncModelList()
})
onMounted(() => {
	getAiPriceSwitch()
})
</script>
<style lang="scss" scoped>
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
</style>
