<template>
	<div class="body-container">
		<a-card>
			<a-flex wrap="wrap" :gap="16" class="mb24">
				<div class="a-item">
					<router-link :to="{ path: '/content/article/create' }"><a-button type="primary">新文章</a-button></router-link>
				</div>
			</a-flex>
			<a-table :data-source="data.source" :columns="data.columns" :loading="data.loading" :pagination="data.pagination" @change="handleTableChange">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'title'">
						<div class="flex">
							<a-image :src="record.thumbnail" :width="48" ::height="48"></a-image>
							<span style="margin-left: 8px">{{ record.title }}</span>
						</div>
					</template>
					<template v-if="column.key === 'category'">
						<span v-if="record.category?.name">{{ record.category.name }}</span>
						<span v-else>-</span>
					</template>
					<template v-if="column.key === 'description'">
						<div class="ellipsis">{{ record.description }}</div>
					</template>
					<template v-if="column.key === 'lang'">
						<a-tag v-if="record.lang == 'zh'">中文</a-tag>
						<a-tag v-else-if="record.lang == 'en'">英文</a-tag>
					</template>
					<template v-if="column.key === 'action'">
						<router-link :to="{ path: '/content/article/create', query: { id: record.id } }">
							<a-button type="link">修改</a-button>
						</router-link>
						<a-button type="link" @click="deletePosts(record.id)">删除</a-button>
					</template>
				</template>
			</a-table>
		</a-card>
	</div>
</template>
<script setup>
	import { deletePostsApi, postsListApi } from '@/api/posts'
	import { message, Modal } from 'ant-design-vue'
	import { onBeforeMount, ref } from 'vue'
	const data = ref({
		loading: false,
		source: [],
		columns: [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
			},
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				width: '30%',
			},
			{
				title: '摘要',
				dataIndex: 'description',
				key: 'description',
				width: '30%',
			},
			{
				title: '分类',
				dataIndex: 'category',
				key: 'category',
			},
			{
				title: '语言',
				dataIndex: 'lang',
				key: 'lang',
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				key: 'create_time',
			},
			{
				title: '操作',
				key: 'action',
			},
		],
		tableLoading: false,
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
	})
	const getPostsList = () => {
		const payload = {
			page: data.value.pagination.current,
			page_size: data.value.pagination.pageSize,
		}
		data.value.loading = true
		postsListApi(payload)
			.then((res) => {
				data.value.source = res.data.data
				data.value.pagination.total = res.data.total
			})
			.finally(() => {
				data.value.loading = false
			})
	}

	const handleTableChange = (a, b) => {
		data.value.pagination.current = a.current
		data.value.pagination.pageSize = a.pageSize
		getPostsList()
	}

	const deletePosts = (id) => {
		Modal.confirm({
			title: '提示',
			content: '确定要删除该文章吗？',
			onOk: () => {
				deletePostsApi({ id }).then((res) => {
					if (res.code == 0) {
						message.success(res.msg)
						getPostsList()
					}
				})
			},
		})
	}

	onBeforeMount(() => {
		getPostsList()
	})
</script>
<style lang="scss" scoped>
	.flex {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.ellipsis {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
