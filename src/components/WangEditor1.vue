<template>
	<div class="editor">
		<Toolbar style="border-bottom: 1px solid #e8e8e8"
				 :editor="editorRef"
				 :defaultConfig="toolbarConfig"
				 mode="default" />
		<Editor class="editor-wrapper"
				:style="{ minHeight: editorHeight }"
				style="overflow-y: hidden"
				v-model="innerValue"
				:defaultConfig="editorConfig"
				mode="default"
				@onClear="handleClear"
				@onCreated="handleCreated"
				@onChange="handleChange" />
	</div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ref, shallowRef, watch, onMounted, onBeforeUnmount, defineProps, defineEmits, defineExpose } from 'vue'

// Props
const props = defineProps({
	modelValue: {
		type: String,
		default: '<p></p>',
	},
	editorHeight: {
		type: String,
		default: '400px',
	},
	editorContentHeight: {
		type: String,
		default: '250px',
	},
})

// Emits
const emit = defineEmits(['update:modelValue', 'editorCreated', 'editorChange', 'editorClear', 'ImagesChange'])

// 编辑器实例和内容
const editorRef = shallowRef()
const innerValue = ref(props.modelValue) // 用于双向绑定的内部值

// 工具栏配置
const toolbarConfig = {
	excludeKeys: ['group-video', 'todo', 'fullScreen'],
}

// 编辑器配置
const editorConfig = {
	placeholder: '请输入内容...',
	MENU_CONF: {},
}

// 图片上传配置
const uploadImages = ref([])
editorConfig.MENU_CONF['uploadImage'] = {
	server: 'https://api.momaking.cn/api/upload/offline',
	fieldName: 'file',
	meta: {
		uuid: 'system/article',
	},
	customInsert (res, insertFn) {
		if (res.code === 0) {
			uploadImages.value.push(res.data.path)
			emit('ImagesChange', uploadImages.value)
			insertFn(res.data.path)
		}
	},
}

// 双向绑定监听（v-model）
watch(
	() => props.modelValue,
	(val) => {
		if (val !== innerValue.value) innerValue.value = val
	},
)

watch(innerValue, (val) => {
	emit('update:modelValue', val)
})

// 生命周期
onBeforeUnmount(() => {
	if (editorRef.value) editorRef.value.destroy()
})

// 回调函数
const handleClear = () => {
	innerValue.value = '<p></p>'
	emit('editorClear', innerValue.value)
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

// 暴露方法
defineExpose({
	getEditorContent: () => editorRef.value?.getHtml() || '',
	getImages: () => uploadImages.value,
	setHtml: (html) => {
		innerValue.value = html
	},
	clearContent: () => {
		innerValue.value = '<p></p>'
	},
	onChange: (newContent) => {
		innerValue.value = newContent
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
