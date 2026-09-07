<template>
	<div class="body-container">
		<a-card class="mb16">
			<a-flex justify="space-between">
				<a-space :size="16">
					<div class="flex">
						<span class="t">昵称</span>
						<a-input class="v" v-model:value="data.table.search.name" placeholder="请输入昵称" />
					</div>
					<div class="flex">
						<span class="t">账号</span>
						<a-input class="v" v-model:value="data.table.search.account" placeholder="请输入账号" />
					</div>
					<a-space :size="12">
						<a-button type="primary" @click="handleSearch">搜索</a-button>
						<a-button @click="handleReset">重置</a-button>
					</a-space>
				</a-space>
			</a-flex>
		</a-card>
		<a-card>
			<a-space :size="12" class="mb16">
				<a-button type="primary">新增</a-button>
				<a-button @click="messageModalHandle" type="primary" ghost>短信群发</a-button>
				<a-button @click="couponModalHandle">发送优惠券</a-button>
			</a-space>
			<a-table
				:row-selection="rowSelection"
				:data-source="data.table.source"
				:columns="data.table.columns"
				:loading="data.table.loading"
				:pagination="data.table.pagination"
				:row-key="(record) => record.id"
				@change="handleTableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'nickname'">
						<span v-if="record.nickname">{{ record.nickname }}</span>
						<span v-else-if="record.first_name && record.last_name">{{ record.first_name }} {{ record.last_name }}</span>
						<span v-else>-</span>
					</template>
					<template v-if="column.key === 'mobile'">
						<span v-if="record.mobile == ''">-</span>
						<span v-else>{{ record.phone_code }}{{ record.mobile }}</span>
					</template>
					<template v-if="column.key === 'email'">
						<span v-if="record.email == ''">-</span>
						<span v-else>{{ record.email }}</span>
					</template>
					<template v-if="column.key === 'avatar'">
						<img class="avatar" v-if="record.avatar == ''" src="@/assets/images/mk-logo.png" />
						<a-avatar v-else :src="record.avatar" />
					</template>
					<template v-if="column.key === 'verified'">
						<a-tag color="green" v-if="record.verify_email == 1">邮箱已验证</a-tag>
						<a-tag color="green" v-else-if="record.verify_mobile == 1">手机已验证</a-tag>
						<a-tag v-else>未验证</a-tag>
					</template>
					<template v-if="column.key === 'is_monthly'">
						<a-tag :color="record.monthly_id ? 'green' : 'red'">{{ record.monthly_id ? '是' : '否' }}</a-tag>
					</template>
					<template v-if="column.key === 'action'">
						<a-space :size="8">
							<a-button class="a-text-btn" type="link" @click="handleDetail(record)">详情</a-button>
							<a-dropdown :trigger="['click']">
								<a class="ant-dropdown-link" @click.prevent>
									更多
									<DownOutlined style="font-size: 12px; transform: scale(0.8)" />
								</a>
								<template #overlay>
									<a-menu>
										<a-menu-item key="0" @click="handleDisable(record)">禁用</a-menu-item>
										<a-menu-item key="1">设置标签</a-menu-item>

										<a-menu-divider />
										<a-menu-item key="3">积分余额</a-menu-item>
									</a-menu>
								</template>
							</a-dropdown>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model:open="data.coupon.visible" :title="data.coupon.title" :confirm-loading="data.coupon.confirmLoading" :width="850">
			<div class="form-content">
				<a-space :size="12" class="mb16">
					<div class="flex">
						<span class="t">优惠券名称</span>
						<a-input v-model:value="data.coupon.search.name" placeholder="请输入优惠券名称" allowClear />
					</div>
					<div class="flex">
						<a-button type="primary" @click="handleCouponSearch">查询</a-button>
					</div>
				</a-space>
				<a-table
					:loading="data.coupon.loading"
					:data-source="data.coupon.source"
					:columns="data.coupon.columns"
					:pagination="data.coupon.pagination"
					@change="handleCouponTableChange">
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
						<template v-if="column.key === 'action'">
							<a-button :loading="record.loading" class="a-text-btn" type="link" @click="handleCouponSend(record)">发送</a-button>
						</template>
					</template>
				</a-table>
			</div>
		</a-modal>
		<a-modal v-model:open="data.message.visible" :title="data.message.title" :confirm-loading="data.message.confirmLoading" :width="850" @ok="handleMessageOk">
			<div class="form-content">
				<div class="group">
					<span class="title">
						<span>选择模板</span>
						<span class="must">*</span>
					</span>
					<div class="flex w380">
						<a-select
							class="value"
							v-model:value="data.message.state.template"
							v-model:options="data.message.templateList"
							placeholder="请选择模板"
							:options="data.message.templateList" />
						<a-button type="link" @click="handleAddTemplate(1)">添加模板</a-button>
					</div>
					<p class="tip">暂不支持包含变量的短信模板</p>
				</div>
				<div class="group">
					<span class="flex">
						<span class="title">
							<span>选择用户</span>
							<span class="must">*</span>
						</span>
						<span style="margin-bottom: 4px">已选{{ data.message.rowSelection.length }}人</span>
					</span>

					<a-table
						:data-source="data.message.userList"
						:columns="data.message.userColumns"
						:pagination="data.message.userPagination"
						:row-selection="messageRowSelection"
						:loading="data.message.tableLoading"
						@change="handleMessageTableChange"></a-table>
				</div>
			</div>
		</a-modal>
		<a-modal
			v-model:open="data.template.visible"
			:title="data.template.title"
			:confirm-loading="data.template.confirmLoading"
			:width="650"
			@ok="handleTemplateOk">
			<div class="form-content">
				<div class="group">
					<span class="title">
						<span>模板名称</span>
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.template.state.name" placeholder="请输入模板名称" />
				</div>
				<div class="group">
					<span class="title">
						<span>模板代码</span>
						<span class="must">*</span>
					</span>
					<a-input v-model:value="data.template.state.code" placeholder="请输入阿里云模板代码" />
				</div>
				<div class="flex">
					<div class="group" style="flex: 1; padding-right: 12px">
						<span class="title">
							<span>中文短信内容</span>
							<span class="must">*</span>
						</span>
						<a-textarea v-model:value="data.template.state.message_zh" placeholder="请输入短信内容" />
					</div>
					<div class="group" style="flex: 1; padding-left: 12px">
						<span class="title">
							<span>英文短信内容</span>
							<span class="must">*</span>
						</span>
						<a-textarea v-model:value="data.template.state.message_en" placeholder="请输入英文短信内容" />
					</div>
				</div>
				<div class="flex">
					<div class="group" style="flex: 1; padding-right: 12px">
						<span class="title">
							<span>中文邮件内容</span>
							<span class="must">*</span>
						</span>
						<a-textarea v-model:value="data.template.state.email_zh" placeholder="请输入邮件内容" />
					</div>
					<div class="group" style="flex: 1; padding-left: 12px">
						<span class="title">
							<span>英文邮件内容</span>
							<span class="must">*</span>
						</span>
						<a-textarea v-model:value="data.template.state.email_en" placeholder="请输入英文邮件内容" />
					</div>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { userListApi } from '@/api/users'
	import { onMounted, ref } from 'vue'
	import { DownOutlined } from '@ant-design/icons-vue'
	import { message } from 'ant-design-vue'
	import { couponListApi, sendCouponToUserApi } from '@/api/coupon'
	import { messageSendApi, templateCreateApi, templateListApi } from '@/api/message'
	const data = ref({
		table: {
			loading: false,
			rowSelection: [],
			source: [],
			columns: [
				{
					title: '用户ID',
					dataIndex: 'id',
					key: 'id',
				},
				{
					title: '头像',
					dataIndex: 'avatar',
					key: 'avatar',
				},
				{
					title: '昵称',
					dataIndex: 'nickname',
					key: 'nickname',
				},
				{
					title: '手机号',
					dataIndex: 'mobile',
					key: 'mobile',
				},
				{
					title: '邮箱',
					dataIndex: 'email',
					key: 'email',
				},
				{
					title: '货币',
					dataIndex: 'currency',
					key: 'currency',
				},
				{
					title: '语言',
					dataIndex: 'lang',
					key: 'lang',
				},
				{
					title: '验证状态',
					dataIndex: 'verified',
					key: 'verified',
				},
				{
					title: '月结',
					dataIndex: 'is_monthly',
					key: 'is_monthly',
				},
				{
					title: '注册时间',
					dataIndex: 'create_time',
					key: 'create_time',
				},
				{
					title: '操作',
					dataIndex: 'action',
					key: 'action',
				},
			],
			pagination: {
				total: 0,
				current: 1,
				pageSize: 10,
			},
			search: {
				name: '',
				account: '',
			},
		},
		coupon: {
			visible: false,
			title: '赠送优惠券',
			loading: false,
			confirmLoading: false,
			source: [],
			columns: [
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
					title: '操作',
					dataIndex: 'action',
					key: 'action',
					width: 100,
				},
			],
			search: {
				name: undefined,
			},
			pagination: {
				total: 0,
				current: 1,
				pageSize: 5,
			},
		},
		message: {
			visible: false,
			title: '短信群发',
			loading: false,
			tableLoading: false,
			confirmLoading: false,
			userList: [],
			templateList: [],
			userColumns: [
				{
					title: 'ID',
					dataIndex: 'id',
					key: 'id',
				},
				{
					title: '昵称',
					dataIndex: 'nickname',
					key: 'nickname',
				},
				{
					title: '手机号',
					dataIndex: 'mobile',
					key: 'mobile',
				},
				{
					title: '邮箱',
					dataIndex: 'email',
					key: 'email',
				},
				{
					title: '语言',
					dataIndex: 'lang',
					key: 'lang',
				},
				{
					title: '注册时间',
					dataIndex: 'create_time',
					key: 'create_time',
				},
			],
			rowSelection: [],
			userPagination: {
				total: 0,
				current: 1,
				pageSize: 10,
			},
			state: {
				template: undefined,
				userList: [],
			},
		},
		template: {
			visible: false,
			title: '添加模板',
			confirmLoading: false,
			templateList: [],
			state: {
				id: undefined,
				name: '',
				code: '',
			},
		},
	})

	const getUserList = () => {
		const payload = {
			page: data.value.table.pagination.current,
			limit: data.value.table.pagination.pageSize,
			...data.value.table.search,
		}
		data.value.table.loading = true
		userListApi(payload)
			.then((res) => {
				if (Object.keys(res.data).length > 0) {
					data.value.table.source = res.data.data
					data.value.table.pagination.total = res.data.total
				}
			})
			.finally(() => {
				data.value.table.loading = false
			})
	}
	const handleCouponSearch = () => {
		data.value.coupon.pagination.current = 1
		getCouponList()
	}
	const handleCouponTableChange = (a) => {
		data.value.coupon.pagination.current = a.current
		data.value.coupon.pagination.pageSize = a.pageSize
		getCouponList()
	}
	const handleTableChange = (a) => {
		data.value.table.pagination.current = a.current
		data.value.table.pagination.pageSize = a.pageSize
		getUserList()
	}
	const handleMessageTableChange = (a) => {
		data.value.message.userPagination.current = a.current
		data.value.message.userPagination.pageSize = a.pageSize
		messageUserList()
	}

	const handleMessageOk = () => {
		const payload = {
			template_id: data.value.message.state.template,
		}
		payload.user_list = data.value.message.rowSelection
		if (!payload.template_id) {
			message.warning('请选择模板')
			return
		}
		if (payload.user_list.length == 0) {
			message.warning('请选择用户')
			return
		}
		data.value.message.confirmLoading = true
		messageSendApi(payload)
			.then((res) => {
				if (res.code == 0) {
					message.success('成功，请等待发送队列')
				}
			})
			.finally(() => {
				data.value.message.confirmLoading = false
			})
	}

	const handleSearch = () => {
		data.value.table.pagination.current = 1
		getUserList()
	}

	const handleReset = () => {
		data.value.table.search = {
			nickname: '',
			account: '',
		}
		handleSearch()
	}

	const couponModalHandle = () => {
		data.value.coupon.search.name = undefined
		data.value.coupon.pagination.current = 1
		if (data.value.table.rowSelection.length == 0) {
			message.warning('请选择用户')
			return
		}
		data.value.coupon.visible = true
		getCouponList()
	}

	const getUserListFun = (page, limit, search) => {
		const payload = {
			page,
			limit,
			...search,
		}
		return new Promise((resolve, reject) => {
			userListApi(payload)
				.then((res) => {
					// if (Object.keys(res.data).length > 0) {
					// 	data.value.table.source = res.data.data
					// 	data.value.table.pagination.total = res.data.total
					// }
					// 把res传递到resolve
					resolve(res)
				})
				.finally(() => {
					resolve()
				})
		})
	}

	const messageModalHandle = () => {
		data.value.message.visible = true
		getTemplateList(0)
		messageUserList()
	}

	const messageUserList = () => {
		data.value.message.tableLoading = true
		getUserListFun(data.value.message.userPagination.current, data.value.message.userPagination.pageSize)
			.then((res) => {
				data.value.message.userList = res.data.data.map((item) => {
					return {
						...item,
						key: item.id,
					}
				})
				data.value.message.userPagination.total = res.data.total
			})
			.finally(() => {
				data.value.message.tableLoading = false
			})
	}

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			data.value.table.rowSelection = selectedRowKeys
		},
	}

	const messageRowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			data.value.message.rowSelection = selectedRowKeys
		},
	}

	const handleCouponSend = (record) => {
		const payload = {
			coupon_id: record.id,
			user_list: data.value.table.rowSelection,
		}
		data.value.coupon.confirmLoading = true
		record.loading = true
		sendCouponToUserApi(payload)
			.then((result) => {
				if (result.code == 0) {
					message.success('发送成功')
				}
			})
			.finally(() => {
				data.value.coupon.confirmLoading = false
				record.loading = false
			})
	}

	const getCouponList = () => {
		const payload = {
			page: data.value.coupon.pagination.current,
			page_size: data.value.coupon.pagination.pageSize,
			status: 1,
			...data.value.coupon.search,
		}
		data.value.coupon.loading = true
		couponListApi(payload)
			.then((res) => {
				data.value.coupon.source = res.data.data
				data.value.coupon.pagination.total = res.data.total
			})
			.finally(() => {
				data.value.coupon.loading = false
			})
	}

	const handleAddTemplate = (type) => {
		resetTemplateContent()
		if (type == 1) {
			data.value.template.title = '添加模板'
		} else {
			data.value.template.title = '修改模板'
		}
		data.value.template.visible = true
	}

	const handleTemplateOk = () => {
		const payload = {
			name: data.value.template.state.name,
			code: data.value.template.state.code,
			message_zh: data.value.template.state.message_zh,
			message_en: data.value.template.state.message_en,
			email_zh: data.value.template.state.email_zh,
			email_en: data.value.template.state.email_en,
		}
		if (data.value.template.state.id) {
			payload.id = data.value.template.state.id
		}
		if (!payload.name || !payload.code || !payload.message_zh || !payload.message_en || !payload.email_zh || !payload.email_en) {
			message.warning('请填写完整信息')
			return
		}
		data.value.template.confirmLoading = true
		templateCreateApi(payload)
			.then((res) => {
				if (res.code == 0) {
					message.success('添加成功')
					data.value.template.visible = false
					resetTemplateContent()
				}
			})
			.finally(() => {
				data.value.template.confirmLoading = true
			})
	}

	const resetTemplateContent = () => {
		data.value.template.state = {
			id: undefined,
			name: '',
			code: '',
			message_zh: '',
			message_en: '',
			email_zh: '',
			email_en: '',
		}
	}

	const getTemplateList = (paginate) => {
		templateListApi({ is_paginate: paginate }).then((res) => {
			if (paginate == 0) {
				data.value.message.templateList = res.data.map((item) => {
					return {
						...item,
						key: item.id,
						label: item.name,
						value: item.id,
					}
				})
			} else {
				data.value.template.templateList = res.data.data
			}
		})
	}

	onMounted(() => {
		getUserList()
	})
</script>
<style lang="scss" scoped>
	.avatar {
		width: 30px;
		height: 30px;
		display: inline-block;
		border-radius: 50%;
	}
	.form-content {
		padding: 16px 0;
		position: relative;
	}
	.group {
		margin-bottom: 24px;
		span {
			&.title {
				display: block;
				margin-bottom: 4px;
				font-size: 14px;
				color: #666;
				&::after {
					content: ':';
				}
				.must {
					color: red;
				}
			}
		}
		.value {
			width: 100%;
		}
		.w380 {
			width: 380px;
		}
	}
	.tip {
		color: #999;
		font-size: 12px;
		margin-top: 8px;
	}
	:deep(.ant-pagination-item-ellipsis) {
		display: flex !important;
	}
</style>
