<template>
	<a-config-provider
		:theme="{
			token: {
				colorPrimary: '#0256ff',
			},
		}">
		<router-view />
	</a-config-provider>
</template>
<script>
	window.lang = localStorage.getItem('lang') || 'en'
</script>
