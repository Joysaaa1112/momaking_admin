<template>
	<a-result sub-title="Sorry, the page you visited does not exist." style="background-color: #fff; height: calc(-56px + 100vh); padding-top: 100px">
		<template #icon>
			<img src="@/assets/images/404.png" alt="404" />
		</template>
		<template #extra>
			<a-button type="primary" @click="goHome">Back Home</a-button>
		</template>
	</a-result>
</template>
<script setup>
	import { useRouter } from 'vue-router'
	const router = useRouter()
	const goHome = () => {
		router.push('/dashboard')
	}
</script>
