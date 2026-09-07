<template>
	<div class="login-container">
		<div class="login-box">
			<div class="logo">
				<img src="@/assets/images/logo-en.png" alt="" />
			</div>
			<div class="account-wrap">
				<div class="group">
					<a-input v-model:value="data.state.account.email" placeholder="Please enter your email">
						<template #prefix>
							<user-outlined />
						</template>
					</a-input>
				</div>
				<div class="group">
					<a-input-password v-model:value="data.state.account.password" placeholder="Please enter your password">
						<template #prefix>
							<LockOutlined />
						</template>
					</a-input-password>
				</div>
				<div class="group">
					<a-button type="primary" block :loading="data.loading" @click="handleLogin">Login</a-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import { ref } from 'vue'
	import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
	import { message } from 'ant-design-vue'
	import { loginApi } from '@/api/auth'
	import router from '@/router'

	const data = ref({
		loading: false,
		state: {
			account: {
				email: '',
				password: '',
			},
		},
	})

	const handleLogin = () => {
		const payload = {
			email: data.value.state.account.email,
			password: data.value.state.account.password,
		}
		if (!payload.email) {
			message.error('Please enter your email')
			return
		}
		if (!payload.password) {
			message.error('Please enter your password')
			return
		}
		data.value.loading = true
		loginApi(payload)
			.then((result) => {
				if (result.code === 0) {
					window.localStorage.setItem('authorization', result.data.token)
					window.localStorage.setItem('member', JSON.stringify(result.data.user))
					message.success('Login successful')

					// 获取 URL 中的 redirect 参数
					const urlParams = new URLSearchParams(window.location.search)
					const redirect = urlParams.get('redirect')

					if (redirect) {
						window.location.href = redirect // 跳转到 redirect URL
					} else {
						window.location.href = '/' // 默认跳转到首页
					}
				}
			})
			.finally(() => {
				data.value.loading = false
			})
	}
</script>
<style lang="scss" scoped>
	.login-container {
		height: 100vh;
		overflow: hidden;
		background-image: url(@/assets/images/RE4wtcs.d18b0c6e.jpg);
		background-position: 50%;
		background-repeat: no-repeat;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		.login-box {
			width: 360px;
			background-color: #fff;
			border-radius: 5px;
			padding: 24px;
			padding-top: 40px;
			.logo {
				width: 100%;
				margin-bottom: 24px;
				img {
					height: 42px;
					display: block;
					margin: 0 auto;
				}
			}
			.group {
				margin-bottom: 24px;
			}
		}
	}
</style>
