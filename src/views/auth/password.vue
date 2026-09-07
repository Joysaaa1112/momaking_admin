<template>
	<div class="auth-wrap">
		<div class="container">
			<div class="row">
				<div class="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-12">
					<form class="card auth-form inner-content" method="post">
						<div class="card-body">
							<div class="title">
								<h3>Reset Password</h3>
							</div>
							<div class="form-step">
								<a-steps v-if="data.currentStep != 2" :current="data.currentStep" :items="data.items" size="small"></a-steps>
							</div>
							<div class="setp1" v-if="data.currentStep == 0">
								<div v-if="data.setp1.locked">
									<a-alert
										:message="data.lang == 'zh' ? '验证码已发送，请前往邮箱查看' : 'Verification code has been sent, please go to the email to check'"
										type="success" />
								</div>
								<div v-else>
									<div class="group">
										<a-input class="inp" v-model:value="data.state.email" placeholder="Enter your email" />
									</div>
									<div class="button">
										<a-button block type="primary" :loading="data.setp1.loading" :disabled="data.setp1.locked" @click="getForgetEmail">Next</a-button>
									</div>
								</div>
							</div>
							<div class="setp1" v-if="data.currentStep == 1">
								<div class="group">
									<a-input-password v-model:value="data.state.new_password" placeholder="Enter your password" @input="checkPassword" />
									<p v-if="data.setp2.errors.new_password" class="tips">{{ data.setp2.errors.new_password }}</p>
								</div>
								<div class="group">
									<a-input-password v-model:value="data.state.confirm_password" placeholder="Enter confirm password" @input="checkPassword" />
									<p v-if="data.setp2.errors.confirm_password" class="tips">{{ data.setp2.errors.confirm_password }}</p>
								</div>
								<div class="button">
									<a-button block type="primary" :loading="data.setp2.loading" :disabled="data.setp2.locked" @click="savePassword">Save</a-button>
								</div>
							</div>
							<div class="setp1" v-if="data.currentStep == 2">
								<a-result status="success" :title="data.lang == 'zh' ? '密码修改成功' : 'Password changed successfully'">
									<template #extra>
										<a-button type="primary" :href="'/' + data.lang">Go Home</a-button>
									</template>
								</a-result>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import { ref, onBeforeMount } from 'vue'
	import { forgetEmailApi, resetPasswordApi } from '@/api/auth'
	import { message, notification } from 'ant-design-vue'
	import { useRoute } from 'vue-router'
	import router from '@/router'
	const r = useRoute()

	const data = ref({
		lang: localStorage.getItem('lang') || 'zh',
		state: {
			token: undefined,
			email: undefined,
			code: undefined,
			new_password: undefined,
			confirm_password: undefined,
		},
		setp1: {
			loading: false,
			locked: false,
		},
		setp2: {
			loading: false,
			locked: false,
			errors: {
				new_password: undefined,
				confirm_password: undefined,
			},
		},
		codeTimer: null,
		currentStep: 0,
		items: [],
	})
	// 获取重置密码邮件
	const getForgetEmail = () => {
		var payload = {
			email: data.value.state.email,
			lang: data.value.lang,
		}
		if (payload.email == '') {
			message.error(window.lang == 'zh' ? '邮箱不能为空' : 'Email cannot be empty')
			return
		}
		data.value.setp1.loading = true
		forgetEmailApi(payload)
			.then((res) => {
				if (res.code == 0) {
					notification.success({
						message: window.lang == 'en' ? 'Send Successfully!' : '发送成功',
					})
				}
			})
			.finally(() => {
				data.value.setp1.locked = true
				data.value.setp1.loading = false
			})
	}

	const savePassword = () => {
		var payload = {
			token: data.value.state.token,
			new_password: data.value.state.new_password,
			confirm_password: data.value.state.confirm_password,
		}
		if (!checkPassword()) {
			return
		}
		data.value.setp2.loading = true
		resetPasswordApi(payload)
			.then((res) => {
				if (res.code == 0) {
					notification.success({
						message: window.lang == 'en' ? 'Reset Successfully!' : '重置成功',
					})
					localStorage.setItem('authorization', res.data.token)
					localStorage.setItem('uuid', res.data.info?.uuid)
					localStorage.setItem('member', JSON.stringify(res.data.info))
					data.value.currentStep = 2
					router.push({
						path: r.fullPath.split('?')[0] + '?step=2',
					})
				}
			})
			.finally(() => {
				data.value.setp2.locked = true
				data.value.setp2.loading = false
			})
	}

	const checkPassword = () => {
		var passwordRegex = /^[A-Za-z0-9!@#$%^&*_=+:\-]{6,20}$/
		if (!passwordRegex.test(data.value.state.new_password)) {
			data.value.setp2.errors.new_password =
				window.lang == 'zh'
					? '密码必须包含字母、数字、特殊字符，长度为6-20位'
					: 'Password must contain letters, numbers, and special characters, and be between 6 and 20 characters'
			return false
		} else {
			data.value.setp2.errors.new_password = undefined
		}

		if (data.value.state.confirm_password && data.value.state.new_password != data.value.state.confirm_password) {
			data.value.setp2.errors.confirm_password = window.lang == 'zh' ? '两次输入的密码不一致' : 'The two entered passwords are inconsistent'
			return false
		} else {
			data.value.setp2.errors.confirm_password = undefined
		}
		return true
	}

	onBeforeMount(() => {
		data.value.items = [
			{
				title: data.lang == 'zh' ? '验证邮箱' : 'Verify Email',
			},
			{
				title: data.lang == 'zh' ? '设置新密码' : 'Set New Password',
			},
			{
				title: data.lang == 'zh' ? '完成' : 'Finish',
			},
		]
		if (r.query.token) {
			data.value.state.token = r.query.token
			data.value.currentStep = 1
		}
		if (r.query.step) {
			data.value.currentStep = parseInt(r.query.step)
		}
	})
</script>
<style lang="scss" scoped>
	.tips {
		margin-top: 4px;
		font-size: 12px;
		line-height: 1.2;
		color: red;
	}
	.auth-wrap {
		background: #f0f1f8;
		padding: 30px 0;
		.auth-form {
			padding: 70px;
			background-color: #fff;
			border-radius: 8px;
			overflow: hidden;
			border: none;
			box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.075);
			.title {
				h3 {
					font-size: 25px;
					font-weight: 700;
					color: #151515;
				}
				margin-bottom: 45px;
			}
			.form-step {
				margin-bottom: 45px;
			}
			.group {
				margin-bottom: 24px;
				position: relative;
				.inp {
					height: 42px;
				}
				&.verify-code-group {
					button {
						position: absolute;
						right: 5px;
						top: 5px;
					}
				}
			}
			.button {
				display: flex;
				justify-content: center;
				button {
					height: 38px;
					padding: 0 2rem;
				}
			}
		}
	}
</style>
