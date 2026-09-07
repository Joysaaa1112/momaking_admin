<template>
	<div class="editor">
		<Toolbar style="border-bottom: 1px solid #e8e8e8"
				 :editor="editorRef"
				 :defaultConfig="toolbarConfig"
				 mode="default" />
		<Editor class="editor-wrapper"
				:style="{ minHeight: editorHeight }"
				style="overflow-y: hidden"
				v-model="valueHtml"
				:defaultConfig="editorConfig"
				mode="default"
				@onClear="handleClear"
				@onCreated="handleCreated"
				@onChange="handleChange" />
	</div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { onBeforeUnmount, ref, shallowRef, onMounted, defineExpose, defineEmits, defineProps } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
const props = defineProps({
	editorHeight: {
		type: String,
		default: '400px', // 默认高度
	},
	editorContentHeight: {
		type: String,
		default: '250px', // 编辑器内容默认最小高度
	},
})

const editorRef = shallowRef()
const valueHtml = ref('<p></p>')
const emit = defineEmits()

const toolbarConfig = {
	excludeKeys: ['group-video', 'todo', 'fullScreen'],
}
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} }
const uploadImages = ref([])
editorConfig.MENU_CONF['uploadImage'] = {
	server: 'https://api.momaking.cn/api/upload/offline',
	fieldName: 'file',
	meta: {
		uuid: 'system/article',
	},
	customInsert (res, insertFn) {
		if (res.code == 0) {
			uploadImages.value.push(res.data.path)
			emit('ImagesChange', uploadImages.value)
			insertFn(res.data.path)
		}
	},
}

onMounted(() => { })

onBeforeUnmount(() => {
	const editor = editorRef.value
	if (editor != null) editor.destroy()
})

const handleClear = () => {
	valueHtml.value = '<p></p>'
	emit('editorClear', valueHtml.value)
}
const handleCreated = (editor) => {
	editorRef.value = editor
	emit('editorCreated', editorRef)
}

const handleChange = () => {
	if (editorRef.value) {
		const html = editorRef.value.getHtml()
		emit('editorChange', html)
	}
}

defineExpose({
	getEditorContent: () => {
		if (editorRef.value) {
			return editorRef.value.getHtml()
		}
		return ''
	},
	getImages: () => {
		return uploadImages.value
	},
	setHtml: (html) => {
		valueHtml.value = html
	},
	clearContent: () => {
		valueHtml.value = '<p></p>'
	},
	onChange: (newContent) => {
		emit('editorChange', newContent)
	},
})
</script>

<style lang="scss" scoped>
.editor {
	border-radius: 6px;
	border: 1px solid #e8e8e8;
	overflow: hidden;
}

:deep(.w-e-scroll) {
	span {
		min-width: 1px;
	}
}
</style>
