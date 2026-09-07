<template>
	<div>
		<ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
	</div>
</template>

<script>
	import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5'
	import { SlashCommand } from 'ckeditor5-premium-features'

	import 'ckeditor5/ckeditor5.css'
	import 'ckeditor5-premium-features/ckeditor5-premium-features.css'

	export default {
		name: 'app',
		data() {
			return {
				editor: ClassicEditor,
				editorData: '<p>Hello from CKEditor 5 in Vue!</p>',
				editorConfig: {
					plugins: [Bold, Undo, Italic, Essentials],
					toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
					licenseKey: '<YOUR_LICENSE_KEY>',
					mention: {
						// Mention configuration
					},
				},
			}
		},
	}
</script>
