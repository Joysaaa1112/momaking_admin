<template>
	<div class="review-wrap">
		<div class="container">
			<a-card class="mb24">
				<a-result class="mb24" status="success" title="Mechanic Design Review Submitted Successfully!">
					<template #extra>
						<router-link :to="'/' + data.lang + '/space/quotes/upload'">
							<a-button type="primary">Get a New Quote</a-button>
						</router-link>
					</template>
				</a-result>
			</a-card>
		</div>
	</div>
</template>
<script setup>
	import { ref, onBeforeMount } from 'vue'
	import { useRoute } from 'vue-router'

	const data = ref({
		lang: window.localStorage.getItem('lang') || 'zh',
		orderNo: null,
	})

	onBeforeMount(() => {
		const route = useRoute()
		data.value.orderNo = route.params.order_no
	})
</script>
<style lang="scss" scoped>
	:deep(.ant-steps-icon-dot) {
		width: 10px !important;
		height: 10px !important;
	}
	:deep(.ant-steps-item-title) {
		font-size: 14px;
	}
	.review-wrap {
		padding: 30px 0;
		background-color: #f0f1f8;
	}
</style>
