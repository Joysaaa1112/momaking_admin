<template>
	<div class="body-container">
		<div class="mk-panel" style="padding: 0">
			<a-row style="min-height: 50vh">
				<a-col :span="4" style="min-width: 160px">
					<div class="left-wrapper">
						<div class="wrapper-header">
							<span class="add-category" @click="categoryModalHandle(1)">
								<PlusOutlined />
								添加分类
							</span>
						</div>
						<div class="category-list">
							<div class="loading-wrap" v-if="data.categoryLoading">
								<a-spin />
							</div>
							<div
								class="item"
								:class="{ active: data.selectCategory == item.id }"
								v-for="item in data.categorys"
								:key="item.id"
								@click="selectCategory(item.id)">
								<img src="@/assets/images/dir.jpg" />
								<span class="name">{{ item.name }}</span>
								<a-dropdown :trigger="['click']" v-if="item.id != 0">
									<span class="action" @click.prevent><MoreOutlined /></span>
									<template #overlay>
										<a-menu>
											<a-menu-item key="1" @click="categoryModalHandle(2, item)">编辑</a-menu-item>
											<a-menu-item key="2" @click="categoryDelete(item)">
												<a-spin v-if="item.deleteLoading" />
												<span>删除</span>
											</a-menu-item>
										</a-menu>
									</template>
								</a-dropdown>
							</div>
						</div>
					</div>
				</a-col>
				<a-col :span="20">
					<div class="right-wrapper">
						<div class="wrapper-header">
							<a-button type="primary" @click="tagModalHandle(1)">添加标签</a-button>
						</div>
						<div class="wrapper-body" style="padding: 0 20px">
							<a-table
								:data-source="data.tagTable.source"
								:columns="data.tagTable.columns"
								:pagination="data.tagTable.pagination"
								:loading="data.tagTable.loading"
								@change="tagTableChange">
								<template #bodyCell="{ column, record }">
									<template v-if="column.key == 'category_name'">
										<span v-if="record.category == null">未分类</span>
										<span v-else>{{ record.category.name }}</span>
									</template>
									<template v-if="column.key == 'action'">
										<a-space :size="8">
											<a-button class="a-text-btn" type="link" @click="tagModalHandle(2, record)">编辑</a-button>
											<a-button class="a-text-btn" type="link" @click="tagDelete(record)" :loading="record.deleteLoading">删除</a-button>
										</a-space>
									</template>
								</template>
							</a-table>
						</div>
					</div>
				</a-col>
			</a-row>
		</div>
		<a-modal v-model:open="data.categoryModal.visible" :title="data.categoryModal.title" :confirmLoading="data.categoryModal.loading" @ok="categoryHandleOk">
			<div class="form-content">
				<div class="group">
					<span class="title">分类名称</span>
					<a-input v-model:value="data.categoryModal.state.name" placeholder="请输入分类名称"></a-input>
				</div>
				<div class="group">
					<span class="title">排序</span>
					<a-input v-model:value="data.categoryModal.state.sort" placeholder="请输入排序"></a-input>
				</div>
			</div>
		</a-modal>
		<a-modal v-model:open="data.tagModal.visible" :title="data.tagModal.title" :confirmLoading="data.tagModal.loading" @ok="tagHandleOk">
			<div class="form-content">
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						标签分类
					</span>
					<a-select class="value" placeholder="请选择标签分类" v-model:value="data.tagModal.state.category_id" v-model:options="data.categorys"></a-select>
				</div>
				<div class="group">
					<span class="title">
						<span class="must">*</span>
						标签名称
					</span>
					<a-input class="value" placeholder="请输入标签名称" v-model:value="data.tagModal.state.name"></a-input>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script setup>
	import { onMounted, ref } from 'vue'
	import { PlusOutlined, MoreOutlined } from '@ant-design/icons-vue'
	import { categoryDeleteApi, categoryListApi, categorySaveApi, tagDeleteApi, tagListApi, tagSaveApi } from '@/api/tag'
	import { message, Modal } from 'ant-design-vue'
	const data = ref({
		selectCategory: 0,
		categoryLoading: false,
		categorys: [],
		tagTable: {
			source: [],
			columns: [
				{
					title: 'ID',
					dataIndex: 'id',
					key: 'id',
				},
				{
					title: '标签名称',
					dataIndex: 'name',
					key: 'name',
				},
				{
					title: '标签分类',
					dataIndex: 'category_name',
					key: 'category_name',
				},
				{
					title: '操作',
					key: 'action',
					key: 'action',
					width: 200,
				},
			],
			loading: false,
			pagination: {
				current: 1,
				pageSize: 10,
				total: 0,
			},
		},
		categoryModal: {
			visible: false,
			title: '添加标签分类',
			loading: false,
			confirmLoading: false,
			state: {
				id: undefined,
				name: '',
				sort: 99,
			},
		},
		tagModal: {
			visible: false,
			title: '添加标签',
			loading: false,
			confirmLoading: false,
			state: {
				id: undefined,
				category_id: undefined,
				name: '',
			},
		},
	})

	const categoryModalHandle = (type, record) => {
		resetCategoryState()
		if (type == 1) {
			data.value.categoryModal.title = '添加标签分类'
		} else {
			data.value.categoryModal.title = '编辑  标签分类'
			data.value.categoryModal.state = record
		}
		data.value.categoryModal.visible = true
	}

	const categoryHandleOk = () => {
		const payload = {
			name: data.value.categoryModal.state.name,
			sort: data.value.categoryModal.state.sort,
		}
		if (data.value.categoryModal.state.id) {
			payload.id = data.value.categoryModal.state.id
		}
		data.value.categoryModal.confirmLoading = true
		categorySaveApi(payload)
			.then((res) => {
				if (res.code == 0) {
					data.value.categoryModal.visible = false
					message.success('操作成功')
					resetCategoryState()
					getCategoryList()
				}
			})
			.finally(() => {
				data.value.categoryModal.confirmLoading = false
			})
	}

	const getCategoryList = () => {
		data.value.categoryLoading = true
		categoryListApi()
			.then((res) => {
				data.value.categorys = res.data.map((item) => {
					return {
						...item,
						label: item.name,
						value: item.id,
					}
				})
				// 头部插入全部
				data.value.categorys.unshift({
					id: 0,
					name: '全部',
					label: '未分类',
					value: 0,
				})
			})
			.finally(() => {
				data.value.categoryLoading = false
			})
	}

	const categoryDelete = (record) => {
		Modal.confirm({
			title: '提示',
			content: '分类下的标签也会被删除，确定要删除该分类吗？',
			onOk: () => {
				record.deleteLoading = true
				categoryDeleteApi({ id: record.id })
					.then((res) => {
						if (res.code == 0) {
							message.success('删除成功')
							if (data.value.selectCategory == record.id) {
								data.value.selectCategory = 0
							}
							getCategoryList()
							getTagList()
						}
					})
					.finally(() => {
						record.deleteLoading = false
					})
			},
		})
	}

	const selectCategory = (id) => {
		data.value.selectCategory = id
		getTagList()
	}

	const resetCategoryState = () => {
		data.value.categoryModal.state = {
			id: undefined,
			name: '',
			sort: 99,
		}
	}

	const tagModalHandle = (type, record) => {
		resetTagState()
		if (type == 1) {
			data.value.tagModal.title = '添加标签'
			data.value.tagModal.state.category_id = data.value.selectCategory
		} else {
			data.value.tagModal.title = '编辑标签'
			data.value.tagModal.state = record
		}
		data.value.tagModal.visible = true
	}

	const resetTagState = () => {
		data.value.tagModal.state = {
			id: undefined,
			category_id: undefined,
			name: '',
		}
	}

	const tagDelete = (record) => {
		Modal.confirm({
			title: '提示',
			content: '确定要删除该标签吗？',
			onOk: () => {
				record.deleteLoading = true
				tagDeleteApi({ id: record.id })
					.then((res) => {
						if (res.code == 0) {
							message.success('操作成功')
							getTagList()
						}
					})
					.finally(() => {
						record.deleteLoading = false
					})
			},
		})
	}

	const tagHandleOk = () => {
		const payload = {
			category_id: data.value.tagModal.state.category_id,
			name: data.value.tagModal.state.name,
		}
		if (data.value.tagModal.state.id) {
			payload.id = data.value.tagModal.state.id
		}
		data.value.tagModal.confirmLoading = true
		tagSaveApi(payload)
			.then((res) => {
				if (res.code == 0) {
					data.value.tagModal.visible = false
					message.success('操作成功')
					resetTagState()
					getTagList()
				}
			})
			.finally(() => {
				data.value.tagModal.confirmLoading = false
			})
	}

	const getTagList = () => {
		data.value.tagTable.loading = true
		const payload = {
			category_id: data.value.selectCategory,
			page: data.value.tagTable.pagination.current,
			limit: data.value.tagTable.pagination.pageSize,
		}
		tagListApi(payload)
			.then((res) => {
				if (res.code == 0) {
					data.value.tagTable.source = res.data.data
					data.value.tagTable.pagination.total = res.data.total
				}
			})
			.finally(() => {
				data.value.tagTable.loading = false
			})
	}

	const tagTableChange = (pagination) => {
		data.value.tagTable.pagination.current = pagination.current
		data.value.tagTable.pagination.pageSize = pagination.pageSize
		getTagList()
	}

	onMounted(() => {
		getCategoryList()
		getTagList()
	})
</script>
<style lang="scss" scoped>
	.wrapper-header {
		height: 66px;
		display: flex;
		align-items: center;
		padding: 20px 0 20px 20px;
	}
	.wrapper-body {
		padding: 20px;
	}
	.left-wrapper {
		min-width: 160px;
		border-right: 1px solid #f2f2f2;
		height: 100%;
		.add-category {
			display: block;
			cursor: pointer;
			flex: 1;
			padding: 8px;
		}
	}
	.form-content {
		padding: 16px 0 12px;
		position: relative;
	}
	.group {
		margin-bottom: 24px;
		&:last-child {
			margin-bottom: 0;
		}
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
	}
	.category-list {
		height: calc(100% - 66px);
		position: relative;
		overflow-y: auto;
		.item {
			display: flex;
			align-items: center;
			padding: 12px 8px 8px 24px;
			cursor: pointer;
			&:hover {
				background-color: #f5f7fa;
			}
			&.active {
				background-color: #e5eeff;
			}
			img {
				height: 16px;
				display: block;
				margin-right: 8px;
			}
			.name {
				font-size: 14px;
				color: #333;
				flex: 1;
			}
			.action {
				padding: 0 6px;
			}
		}
	}
</style>
