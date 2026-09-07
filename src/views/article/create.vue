<template>
	<div class="body-container">
		<a-card>
			<a-row>
				<a-col :span="18"
					   style="padding-right: 24px">
					<a-input v-model:value="data.formState.title"
							 class="title-input"
							 placeholder="文章标题"></a-input>
					<wang-editor ref="editorRef"
								 :editorHeight="'600px'"
								 @editorCreated="editorCreate"
								 @ImagesChange="imagesChange"
								 class="mb24" />
					<div class="flex flex-buttons">
						<a-button type="primary"
								  @click="handleSubmit">
							{{ data.formState.id != undefined ? (data.lang == 'zh' ? '修改' : 'Update') : data.lang == 'zh' ? '发布' : 'Submit' }}
						</a-button>
					</div>
				</a-col>
				<a-col :span="6">
					<a-card title="封面"
							class="mb24">
						<a-upload name="file"
								  list-type="picture-card"
								  class="avatar-uploader"
								  :data="{ uuid: 'system/article' }"
								  :show-upload-list="false"
								  :headers="data.upload.headers"
								  action="https://api.momaking.cn/api/upload/offline"
								  :before-upload="beforeUpload"
								  @change="uploadChange">
							<img class="preview-image"
								 v-if="data.formState.cover"
								 :src="data.formState.cover" />
							<div v-else>
								<div v-if="data.upload.loading"><i class="fa-solid fa-spinner mk-spinner"></i></div>
								<div v-else><i class="fa-solid fa-plus"></i></div>
								<div class="ant-upload-text">Upload</div>
							</div>
						</a-upload>
					</a-card>
					<a-card title="其他"
							class="mb24">
						<div class="group">
							<span class="title">语言</span>
							<a-select class="full"
									  v-model:options="data.languageOptions"
									  v-model:value="data.formState.lang"
									  placeholder="请选择分类"></a-select>
						</div>
						<div class="group">
							<span class="title">分类</span>
							<a-select class="full"
									  v-model:options="data.categoryList"
									  v-model:value="data.formState.category_id"
									  placeholder="请选择分类"></a-select>
						</div>
						<div class="group">
							<span class="title">关键词</span>
							<a-textarea v-model:value="data.formState.keywords"
										:rows="2"></a-textarea>
						</div>
						<div class="group">
							<span class="title">摘要</span>
							<a-textarea v-model:value="data.formState.description"
										:rows="4"></a-textarea>
						</div>
					</a-card>
				</a-col>
			</a-row>
		</a-card>
	</div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import WangEditor from '@/components/WangEditor.vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { makePosts, getCategoryList as getCategoryListApi, postsDetails } from '@/api/posts'
import { useRoute } from 'vue-router'

const data = ref({
	lang: window.localStorage.getItem('lang') || 'zh',
	pageLoading: false,
	upload: {
		loading: false,
	},
	languageOptions: [
		{ label: '中文', value: 'zh' },
		{ label: 'English', value: 'en' },
	],
	categoryList: [],
	formState: {
		id: undefined,
		title: '',
		content: '',
		keywords: '',
		description: '',
		lang: 'zh',
		cover: '',
		category_id: undefined,
	},
})
const editorRef = ref(null)

// 获取编辑器内容的方法
const getContent = () => {
	if (editorRef.value) {
		// 调用子组件暴露的方法
		const content = editorRef.value.getEditorContent()
		return content
	}
}
const getEditorImages = () => {
	if (editorRef.value) {
		const images = editorRef.value.getImages()
		console.log(images)
	}
}

const setHtml = () => {
	editorRef.value.setHtml(data.value.formState.content)
}

const handleSubmit = () => {
	var payload = data.value.formState
	payload.content = getContent()
	if (payload.title == '') {
		message.error(data.value.lang == 'en' ? 'Title is required!' : '标题不能为空')
		return
	}
	if (payload.content == '') {
		message.error(data.value.lang == 'en' ? 'Content is required!' : '内容不能为空')
		return
	}
	if (payload.cover == '') {
		message.error(data.value.lang == 'en' ? 'Cover is required!' : '封面不能为空')
		return
	}
	payload.thumbnail = payload.cover
	data.pageLoading = true
	makePosts(payload)
		.then((res) => {
			if (res.code == 0) {
				message.success(data.value.lang == 'en' ? 'Successfully published!' : '发布成功')
				resetValue()
			}
		})
		.finally(() => {
			data.pageLoading = false
		})
}

const resetValue = () => {
	data.value.formState = {
		id: undefined,
		title: '',
		content: '',
		keywords: '',
		description: '',
		lang: 'zh',
		cover: '',
		category_id: undefined,
	}
	editorClear('')
}

const editorCreate = () => {
	if (editorRef.value) {
		editorRef.value.setHtml(data.value.formState.content)
	}
}

const editorClear = (content) => {
	if (editorRef.value) {
		editorRef.value.clearContent()
		editorRef.value.setHtml(content)
	}
}

const imagesChange = (images) => {
	if (images.length > 0 && data.value.formState.cover == '') {
		data.value.formState.cover = images[0]
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
			data.value.formState.cover = response.data.path
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

const getPostsDetails = () => {
	postsDetails({ id: data.value.formState.id }).then((result) => {
		if (result.code == 0) {
			const d = result.data
			data.value.formState.title = d.title
			data.value.formState.description = d.description
			data.value.formState.cover = d.thumbnail
			data.value.formState.content = d.content
			data.value.formState.keywords = d.keywords
			data.value.formState.lang = d.lang
			data.value.formState.category_id = d.category_id == 0 ? undefined : Number(d.category_id)
			setHtml()
		}
	})
}

const getCategoryList = () => {
	getCategoryListApi().then((result) => {
		if (result.code == 0) {
			data.value.categoryList = result.data
		}
	})
}
onBeforeMount(() => {
	getCategoryList()
	const r = useRoute()
	if (r.query.id) {
		data.value.formState.id = r.query.id
		getPostsDetails()
	}
})
</script>
<style lang="scss" scoped>
.title-input {
	height: 56px;
	text-align: center;
	border: 0;
	outline: 0;
	box-shadow: none;
	font-size: 18px;
	margin-bottom: 24px;
	border: 1px solid #e8e8e8;
}

.cover-bar {
	width: 100%;
	height: 200px;
	border: 1px solid #e8e8e8;
	border-radius: 6px;
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
