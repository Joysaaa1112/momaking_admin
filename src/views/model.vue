<template>
	<div id="viewer-container" ref="viewerContainer" style="width: 100%; height: 100vh"></div>
</template>
<script>
	import * as OV from 'online-3d-viewer'
	import { useRoute } from 'vue-router'

	export default {
		data() {
			return {}
		},
		mounted() {
			const r = useRoute()
			OV.Init3DViewerFromUrlList(this.$refs.viewerContainer, [decodeURIComponent(r.query.path)], (viewer) => {
				viewer.SetBackgroundColor(0xffffff, 0xffffff)
				viewer.SetModelColor(0x000000)
			})
		},
	}
</script>
<style>
	#viewer-container {
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
