<template>
	<div class="body-container">
		<a-card>
			<div class="mb16">
				<a-button type="primary" @click="showCouponModal(1)">添加优惠券</a-button>
			</div>
			<a-space :size="16" class="mb16">
				<div class="flex">
					<span class="title">优惠券名称</span>
					<a-input allowClear class="item" v-model:value="data.search.name" placeholder="优惠券名称" />
				</div>
				<div class="flex">
					<span class="title">优惠券类型</span>
					<a-select class="item" allowClear v-model:value="data.search.type" placeholder="优惠券使用方式">
						<a-select-option :value="1">满减</a-select-option>
						<a-select-option :value="2">折扣</a-select-option>
						<a-select-option :value="3">使金额固定</a-select-option>
						<a-select-option :value="4">运费减免</a-select-option>
					</a-select>
				</div>
				<div class="flex">
					<span class="title">领取方式</span>
					<a-select class="item" allowClear v-model:value="data.search.receive_type" placeholder="优惠券领取方式">
						<a-select-option :value="1">手动领取</a-select-option>
						<a-select-option :value="2">新人券</a-select-option>
						<a-select-option :value="3">系统赠送券</a-select-option>
					</a-select>
				</div>
				<div class="flex">
					<span class="title">开启状态</span>
					<a-select class="item" allowClear v-model:value="data.search.status" placeholder="开启状态">
						<a-select-option :value="1">启用</a-select-option>
						<a-select-option :value="2">关闭</a-select-option>
					</a-select>
				</div>
				<a-space :size="8">
					<a-button type="primary" @click="searchHandle">搜索</a-button>
					<a-button @click="resetSearch">重置</a-button>
				</a-space>
			</a-space>
			<a-table :data-source="data.source" :columns="data.columns" :loading="data.tableLoading" :pagination="data.pagination" @change="pageChangeHandle">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'type'">
						<div class="mb8">
							<a-tag v-if="record.type == 1">满减</a-tag>
							<a-tag v-if="record.type == 2">折扣</a-tag>
							<a-tag v-if="record.type == 3">使金额固定</a-tag>
							<a-tag v-if="record.type == 4">运费减免</a-tag>
						</div>
						<div>
							<a-tag v-if="record.order_type == 1">通用券</a-tag>
							<a-tag v-if="record.order_type == 2">3D打印可用</a-tag>
							<a-tag v-if="record.order_type == 3">CNC可用</a-tag>
							<a-tag v-if="record.order_type == 4">结构设计可用</a-tag>
							<a-tag v-if="record.order_type == 5">钣金加工可用</a-tag>
							<a-tag v-if="record.order_type == 6">注塑服务可用</a-tag>
						</div>
					</template>
					<template v-if="column.key === 'receive_type'">
						<a-tag v-if="record.receive_type == 1">手动领取</a-tag>
						<a-tag v-if="record.receive_type == 2">新人券</a-tag>
						<a-tag v-if="record.receive_type == 3">系统赠送</a-tag>
					</template>
					<template v-if="column.key === 'coupon_time'">
						<span v-if="record.coupon_time != 0">{{ record.coupon_time }}天</span>
						<span v-else>{{ record.start_use_time + '至' + record.end_use_time }}</span>
					</template>
					<template v-if="column.key === 'start_time'">
						<span v-if="!record.start_time && !record.end_time">不限时</span>
						<span v-else>{{ record.start_time + '至' + record.end_time }}</span>
					</template>
					<template v-if="column.key === 'use_min_price'">
						<span v-if="record.use_min_price == 0">无门槛</span>
						<span v-else>订单金额满{{ record.use_min_price }}时可用</span>
					</template>
					<template v-if="column.key === 'status'">
						<a-switch :checked="record.status == 1 ? true : false" @change="handleSwitchChange(record)" />
					</template>
					<template v-if="column.key === 'total_count'">
						<span v-if="record.total_count == -1">不限量</span>
						<div v-else>
							<div>
								<span style="color: #ff0000">发布</span>
								:{{ record.total_count }}
							</div>
							<div>
								<span style="color: #06b50d">剩余</span>
								:{{ record.remain_count }}
							</div>
						</div>
					</template>

					<template v-if="column.key === 'actions'">
						<a-button type="link" @click="showCouponModal(2, record)">修改</a-button>
						<a-button type="link" @click="deleteCoupon(record)">删除</a-button>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal
			width="850px"
			style="top: 20px"
			v-model:open="data.modal.visible"
			:title="data.modal.title"
			:confirmLoading="data.modal.confirmLoading"
			@ok="handleOk">
			<div class="form-content">
				<div class="group">
					<span class="title">
						优惠券名称
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.modal.state.name" />
				</div>
				<div class="group">
					<span class="title">
						优惠券面额
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.modal.state.value" />
				</div>
				<div class="group">
					<span class="title">
						规则说明
						<span class="must">*</span>
					</span>
					<wang-editor ref="editorRef" @editorCreated="editorCreate" class="mb24" />
				</div>
				<div class="group">
					<span class="title">
						订单类型
						<span class="must">*</span>
					</span>
					<a-radio-group v-model:value="data.modal.state.order_type">
						<a-radio :value="1">通用</a-radio>
						<a-radio :value="2">3D打印</a-radio>
						<a-radio :value="3">CNC</a-radio>
						<a-radio :value="4">结构设计</a-radio>
						<a-radio :value="5">钣金加工</a-radio>
						<a-radio :value="6">注塑服务</a-radio>
					</a-radio-group>
				</div>
				<div class="group">
					<span class="title">
						领取方式
						<span class="must">*</span>
					</span>
					<a-radio-group v-model:value="data.modal.state.receive_type">
						<a-radio :value="1">手动领取</a-radio>
						<a-radio :value="2">新人券</a-radio>
						<a-radio :value="3">系统赠送券</a-radio>
					</a-radio-group>
				</div>
				<div class="group">
					<span class="title">
						优惠券类型
						<span class="must">*</span>
					</span>
					<a-radio-group v-model:value="data.modal.state.type">
						<a-radio :value="1">满减</a-radio>
						<a-radio :value="2">折扣</a-radio>
						<a-radio :value="3">使金额固定</a-radio>
						<a-radio :value="4">运费减免</a-radio>
					</a-radio-group>
				</div>
				<div class="group">
					<span class="title">
						使用门槛
						<span class="must">*</span>
					</span>
					<a-radio-group v-model:value="data.modal.state.use_min_price_type">
						<a-radio :value="1">无门槛</a-radio>
						<a-radio :value="2">最低消费</a-radio>
						<div v-if="data.modal.state.use_min_price_type == 2" class="child-item">
							<a-input-number v-model:value="data.modal.state.use_min_price" />
							<p class="tips">填写优惠券的最低消费金额</p>
						</div>
					</a-radio-group>
				</div>
				<div class="group">
					<span class="title">
						使用时间
						<span class="must">*</span>
					</span>
					<a-radio-group v-model:value="data.modal.state.use_time_type">
						<a-radio :value="1">天数</a-radio>
						<a-radio :value="2">时间范围</a-radio>
					</a-radio-group>
					<div v-if="data.modal.state.use_time_type == 1" class="child-item">
						<a-input-number v-model:value="data.modal.state.coupon_time" />
						<p class="tips">领取后多少天内有效</p>
					</div>
					<div v-else class="child-item">
						<a-range-picker v-model:value="data.modal.state.use_time_range" @change="datePickerChange" />
					</div>
				</div>
				<div class="group" v-if="data.modal.state.receive_type == 1">
					<span class="title">
						领取时间
						<span class="must">*</span>
					</span>
					<a-radio-group v-model:value="data.modal.state.receive_time_type">
						<a-radio :value="1">限时</a-radio>
						<a-radio :value="2">不限时</a-radio>
					</a-radio-group>
					<div class="child-item" v-if="data.modal.state.receive_time_type == 1">
						<a-range-picker v-model:value="data.modal.state.receive_time_range" @change="datePickerChange1" />
					</div>
				</div>
				<div class="group" v-if="data.modal.state.receive_type == 1">
					<span class="title">
						优惠券发布数量
						<span class="must">*</span>
					</span>
					<a-radio-group v-model:value="data.modal.state.is_permanent">
						<a-radio :value="1">限量</a-radio>
						<a-radio :value="2">不限数量</a-radio>
					</a-radio-group>
					<div class="child-item" v-if="data.modal.state.is_permanent == 1">
						<a-input-number v-model:value="data.modal.state.total_count"></a-input-number>
					</div>
				</div>
				<div class="group" v-if="data.modal.state.receive_type == 1">
					<span class="title">
						单用户最大领取数
						<span class="must">*</span>
					</span>
					<div>
						<a-input-number v-model:value="data.modal.state.receive_limit"></a-input-number>
						<p class="tips">填写每个用户可以领取多少张</p>
					</div>
				</div>
				<div class="group" v-if="data.modal.state.receive_type == 1">
					<span class="title">
						状态
						<span class="must">*</span>
					</span>
					<a-radio-group v-model:value="data.modal.state.status">
						<a-radio :value="1">开启</a-radio>
						<a-radio :value="2">关闭</a-radio>
					</a-radio-group>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { couponListApi, makeCouponApi, changeCouponStatusApi, deleteCouponApi } from '@/api/coupon'
	import { message, Modal } from 'ant-design-vue'
	import { onBeforeMount, ref } from 'vue'
	import dayjs, { Dayjs } from 'dayjs'
	import WangEditor from '@/components/WangEditor.vue'

	const editorRef = ref(null)
	const dateFormat = 'YYYY-MM-DD'
	const data = ref({
		source: [],
		columns: [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
			},
			{
				title: '优惠券名称',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '优惠券类型',
				dataIndex: 'type',
				key: 'type',
			},
			{
				title: '优惠券面值',
				dataIndex: 'value',
				key: 'value',
			},
			{
				title: '领取方式',
				dataIndex: 'receive_type',
				key: 'receive_type',
			},
			{
				title: '领取日期',
				dataIndex: 'start_time',
				key: 'start_time',
			},
			{
				title: '使用门槛',
				dataIndex: 'use_min_price',
				key: 'use_min_price',
			},
			{
				title: '使用时间',
				dataIndex: 'coupon_time',
				key: 'coupon_time',
			},
			{
				title: '发布数量',
				dataIndex: 'total_count',
				key: 'total_count',
			},
			{
				title: '是否开启',
				dataIndex: 'status',
				key: 'status',
			},
			{
				title: '操作',
				dataIndex: 'actions',
				key: 'actions',
			},
		],
		tableLoading: false,
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		search: {
			name: '',
			type: undefined,
			receive_type: undefined,
			status: undefined,
		},
		modal: {
			visible: false,
			title: '添加优惠券',
			confirmLoading: false,
			state: {
				id: undefined,
				name: '',
				value: 1,
				content: '',
				order_type: 1,
				use_min_price_type: 1,
				use_min_price: 0,
				use_time_type: 1,
				coupon_time: 3,
				receive_time_range: undefined,
				use_time_range: undefined,
				start_use_time: undefined,
				end_use_time: undefined,
				receive_time_type: 2,
				start_time: undefined,
				end_time: undefined,
				type: 1,
				receive_type: 1,
				is_permanent: 1,
				total_count: 99,
				receive_limit: 1,
				status: 1,
			},
		},
	})
	// 获取编辑器内容的方法
	const getContent = () => {
		if (editorRef.value) {
			// 调用子组件暴露的方法
			const content = editorRef.value.getEditorContent()
			return content
		}
	}
	const editorCreate = () => {
		if (editorRef.value) {
			editorRef.value.setHtml(data.value.modal.state.content)
		}
	}

	const editorClear = (content) => {
		if (editorRef.value) {
			console.log(123)
			editorRef.value.clearContent()
			editorRef.value.setHtml(content)
		}
	}
	const handleSwitchChange = (record) => {
		record.status = record.status == 1 ? 2 : 1
		data.value.tableLoading = true
		changeCouponStatusApi({ id: record.id, status: record.status })
			.then((result) => {
				if (result.code == 0) {
					getCouponList()
				}
			})
			.finally(() => {
				data.value.tableLoading = false
			})
	}
	const getCouponList = () => {
		const payload = {
			page: data.value.pagination.current,
			page_size: data.value.pagination.pageSize,
			name: data.value.search.name,
			type: data.value.search.type,
			receive_type: data.value.search.receive_type,
			status: data.value.search.status,
		}
		data.value.tableLoading = true
		couponListApi(payload)
			.then((result) => {
				if (result.code == 0) {
					data.value.source = result.data.data
					data.value.source = result.data.data.map((item) => {
						if (item.start_time) {
							// 格式化时间
							item.start_time = dayjs(item.start_time).format(dateFormat)
						}
						if (item.end_time) {
							// 格式化时间
							item.end_time = dayjs(item.end_time).format(dateFormat)
						}
						if (item.start_use_time) {
							// 格式化时间
							item.start_use_time = dayjs(item.start_use_time).format(dateFormat)
						}
						if (item.end_use_time) {
							// 格式化时间
							item.end_use_time = dayjs(item.end_use_time).format(dateFormat)
						}
						return item
					})
					data.value.pagination.total = result.data.total
				}
			})
			.finally(() => {
				data.value.tableLoading = false
			})
	}

	const resetModalStateValue = () => {
		data.value.modal.state = {
			id: undefined,
			name: '',
			value: 1,
			content: '',
			order_type: 1,
			use_min_price_type: 1,
			use_min_price: 0,
			use_time_type: 1,
			coupon_time: 3,
			use_time_range: undefined,
			start_use_time: undefined,
			end_use_time: undefined,
			receive_time_type: 2,
			start_time: undefined,
			end_time: undefined,
			type: 1,
			receive_type: 1,
			is_permanent: 1,
			total_count: 99,
			receive_limit: 1,
			status: 1,
		}
	}

	const showCouponModal = (type, record) => {
		resetModalStateValue()
		if (type == 1) {
			data.value.modal.title = '添加优惠券'
		} else {
			data.value.modal.title = '修改优惠券'
			makeRecordByModal(record)
		}
		data.value.modal.visible = true
		editorClear(record?.content)
	}

	const makeRecordByModal = (record) => {
		data.value.modal.state = record
		data.value.modal.state.id = record.id
		data.value.modal.state.use_min_price_type = record.use_min_price > 0 ? 2 : 1
		if (record.coupon_time > 0) {
			data.value.modal.state.use_time_type = 1
		} else {
			data.value.modal.state.use_time_type = 2
			data.value.modal.state.use_time_range = [dayjs(record.start_use_time, dateFormat), dayjs(record.end_use_time, dateFormat)]
		}
		if (record.start_time && record.end_time) {
			data.value.modal.state.receive_time_type = 1
			data.value.modal.state.receive_time_range = [dayjs(record.start_time, dateFormat), dayjs(record.end_time, dateFormat)]
		} else {
			data.value.modal.state.receive_time_type = 2
			data.value.modal.state.receive_time_range = undefined
		}
		if (record.is_permanent == 0) {
			data.value.modal.state.is_permanent = 1
			data.value.modal.state.total_count = record.total_count
		} else {
			data.value.modal.state.is_permanent = 2
			data.value.modal.state.total_count = -1
		}
	}

	const handleOk = () => {
		const {
			name,
			value,
			use_min_price_type,
			use_min_price,
			use_time_type,
			coupon_time,
			order_type,
			use_time_range,
			start_use_time,
			end_use_time,
			type,
			receive_time_type,
			start_time,
			end_time,
			receive_type,
			is_permanent,
			total_count,
			receive_limit,
			status,
		} = data.value.modal.state
		var payload = {
			name: name,
			value: value,
			type: type,
			receive_type: receive_type,
			order_type: order_type,
			use_min_price: use_min_price,
		}
		if (data.value.modal.state.id != undefined) {
			payload.id = data.value.modal.state.id
		}
		const content = getContent()
		payload.content = content
		if (name == '') {
			message.error('优惠券名称不能为空')
			return
		}
		if (!value) {
			message.error('优惠券面值不能为空')
			return
		}
		if (receive_type == 1) {
			if (data.value.modal.state.is_permanent == 1 && total_count == 0) {
				message.error('限量优惠券不能小于1')
				return
			}
			if (receive_limit == 0) {
				message.error('单用户最大领取数不能小于1')
				return
			}
		}
		if (use_min_price_type == 2 && use_min_price == 0) {
			message.error('最低消费不能为0')
			return
		}
		if (use_time_type == 2 && (start_use_time == '' || start_use_time == undefined || end_use_time == '' || end_use_time == undefined)) {
			message.error('请选择使用时间')
			return
		}
		if (receive_time_type == 1 && (start_time == undefined || start_time == '' || end_time == undefined || end_time == undefined)) {
			message.error('请选择领取时间')
			return
		}
		if (use_time_type == 1) {
			payload.coupon_time = coupon_time
			payload.start_use_time = null
			payload.end_use_time = null
		} else {
			payload.coupon_time = 0
			payload.start_use_time = start_use_time
			payload.end_use_time = end_use_time
		}
		if (is_permanent == 1) {
			payload.is_permanent = false
			payload.total_count = total_count
		} else {
			payload.is_permanent = true
			payload.total_count = -1
		}
		if (receive_time_type == 1) {
			if (receive_type == 1) {
				payload.start_time = start_time
				payload.end_time = end_time
			} else {
				payload.start_time = null
				payload.end_time = null
			}
		} else {
			payload.start_time = null
			payload.end_time = null
		}
		if (receive_limit == 0) {
			payload.receive_limit = 1
		} else {
			payload.receive_limit = receive_limit
		}
		if (use_min_price_type == 2) {
			payload.use_min_price = use_min_price
		} else {
			payload.use_min_price = 0
		}
		payload.status = status
		data.value.modal.confirmLoading = true
		makeCouponApi(payload)
			.then((result) => {
				if (result.code == 0) {
					message.success('操作成功')
					getCouponList()
				}
			})
			.finally(() => {
				data.value.modal.confirmLoading = false
				data.value.modal.visible = false
			})
	}

	const deleteCoupon = (record) => {
		Modal.confirm({
			title: '确定删除该优惠券吗?',
			onOk() {
				deleteCouponApi({ id: record.id }).then((result) => {
					if (result.code == 0) {
						message.success('删除成功')
						getCouponList()
					}
				})
			},
		})
	}

	const datePickerChange = (a, b) => {
		data.value.modal.state.start_use_time = b[0]
		data.value.modal.state.end_use_time = b[1]
	}
	const datePickerChange1 = (a, b) => {
		data.value.modal.state.start_time = b[0]
		data.value.modal.state.end_time = b[1]
	}

	const searchHandle = () => {
		getCouponList()
	}

	const resetSearch = () => {
		data.value.search = {
			name: '',
			type: undefined,
			receive_type: undefined,
			status: undefined,
		}
		data.value.pagination.current = 1
		getCouponList()
	}

	const pageChangeHandle = (a, b) => {
		data.value.pagination.current = a.current
		data.value.pagination.pageSize = a.pageSize
		getCouponList()
	}
	onBeforeMount(() => {
		getCouponList()
	})
</script>
<style lang="scss" scoped>
	.form-content {
		max-width: 500px;
		padding: 24px 0;
	}
	.group {
		margin-bottom: 24px;
		&:last-child {
			margin-bottom: 0;
		}
		span {
			&.title {
				display: block;
				margin-bottom: 8px;
				font-size: 14px;
				&::after {
					content: ':';
				}
				.must {
					color: red;
				}
			}
		}
	}
	.child-item {
		margin-top: 6px;
	}
	.tips {
		margin-top: 2px;
		margin-bottom: 0;
		font-size: 12px;
		color: #999;
	}
</style>
