<template>
	<div class="body-top"></div>
	<div class="body-container">
		<a-card>
			<a-tabs class="user-center-tab"
					v-model:activeKey="data.activeTabKey"
					tab-position="left">
				<a-tab-pane :key="1"
							:tab="data.lang == 'zh' ? '基本设置' : 'Basic Settings'">
					<div class="tab-title">{{ data.lang == 'zh' ? '基本设置' : 'Basic Settings' }}</div>
					<a-row>
						<a-col :span="5">
							<a-form :model="data.formState"
									name="basic"
									autocomplete="off"
									@finish="onFinish"
									@finishFailed="onFinishFailed">
								<a-form-item class="mk-form-item hide-must"
											 :label="data.lang == 'zh' ? '昵称' : 'Nickname'"
											 name="nickname"
											 :rules="[{ required: true, message: 'Please input your nickname!' }]">
									<a-input v-model:value="data.formState.nickname"
											 allowClear />
								</a-form-item>
								<a-space>
									<a-form-item class="mk-form-item hide-must"
												 :label="data.lang == 'zh' ? '姓' : 'Last Name'"
												 name="last_name"
												 :rules="[{ required: true, message: data.lang == 'zh' ? '请输入您的姓！' : 'Please input your last name!' }]">
										<a-input v-model:value="data.formState.last_name" />
									</a-form-item>
									<a-form-item class="mk-form-item hide-must"
												 :label="data.lang == 'zh' ? '名' : 'First Name'"
												 name="first_name"
												 :rules="[{ required: true, message: data.lang == 'zh' ? '请输入您的名！' : 'Please input your first name!' }]">
										<a-input v-model:value="data.formState.first_name" />
									</a-form-item>
								</a-space>
								<div class="group">
									<label for="">联系方式</label>
									<a-space-compact block>
										<a-select v-model:value="data.formState.phone_code"
												  v-model:options="data.phoneCodeOptions"
												  showSearch
												  :filterOption="filterOption"
												  allow-clear
												  style="width: 40%"></a-select>
										<a-input v-model:value="data.formState.mobile"
												 :style="{ width: '100%' }" />
									</a-space-compact>
								</div>
								<a-space>
									<a-form-item class="mk-form-item hide-must"
												 :label="data.lang == 'zh' ? '国家' : 'Country'"
												 name="country">
										<a-select v-model:value="data.formState.country"
												  v-model:options="data.countries"
												  :filterOption="filterOption"
												  show-search
												  allow-clear></a-select>
									</a-form-item>
									<a-form-item class="mk-form-item hide-must"
												 :label="data.lang == 'zh' ? '州/省份' : 'State'"
												 name="state">
										<a-select v-model:value="data.formState.state"
												  :filterOption="filterOption"
												  v-model:options="data.states"
												  show-search
												  allow-clear></a-select>
									</a-form-item>
								</a-space>
								<a-space>
									<a-form-item class="mk-form-item hide-must"
												 :label="data.lang == 'zh' ? '城市' : 'City'"
												 name="city">
										<a-input v-model:value="data.formState.city"
												 allowClear />
									</a-form-item>
									<a-form-item class="mk-form-item hide-must"
												 :label="data.lang == 'zh' ? '邮编' : 'Postal Code'"
												 name="postal_code">
										<a-input v-model:value="data.formState.postal_code"
												 allowClear />
									</a-form-item>
								</a-space>
								<a-form-item class="mk-form-item hide-must"
											 :label="data.lang == 'zh' ? '地址1' : 'Address1'"
											 name="address">
									<a-input v-model:value="data.formState.address"
											 allowClear />
								</a-form-item>
								<a-form-item class="mk-form-item hide-must"
											 :label="data.lang == 'zh' ? '地址2' : 'Address2'"
											 name="address1">
									<a-input v-model:value="data.formState.address1"
											 allowClear />
								</a-form-item>
								<div class="buttons">
									<a-button type="primary"
											  @click="saveInformation"
											  :loading="data.basic.saveLoading">
										{{ data.lang == 'zh' ? '更新基本信息' : 'Update Basic Information' }}
									</a-button>
								</div>
							</a-form>
						</a-col>
						<a-col :span="19"
							   style="padding-left: 104px">
							<p class="label">头像</p>
							<a-upload name="file"
									  list-type="picture-card"
									  class="avatar-uploader"
									  :show-upload-list="false"
									  :headers="data.upload.headers"
									  action="https://api.momaking.cn/api/upload"
									  :before-upload="beforeUpload"
									  @change="uploadChange">
								<img class="preview-image"
									 v-if="data.upload.imgsrc"
									 :src="data.upload.imgsrc" />
								<div v-else>
									<div v-if="data.upload.loading"><i class="fa-solid fa-spinner mk-spinner"></i></div>
									<div v-else><i class="fa-solid fa-plus"></i></div>
									<div class="ant-upload-text">Upload</div>
								</div>
							</a-upload>
						</a-col>
					</a-row>
				</a-tab-pane>
				<a-tab-pane :disabled="true"
							:key="2"
							:tab="data.lang == 'zh' ? '安全设置' : 'Security Settings'">Content of tab123</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>
<script setup>
import { ref, h, watch, onBeforeMount } from 'vue'
import defaultAvatar from '@/assets/images/m.png'
import { getCountriesApi, getStatesApi } from '@/api/geo'
import { useUserStore } from '@/store/modules/user'
import { saveInformationApi } from '@/api/user'
import { notification } from 'ant-design-vue'

const data = ref({
	lang: localStorage.getItem('lang') || 'zh',
	activeTabKey: 1,
	phoneCodeOptions: [],
	countries: [],
	states: [],
	userInfo: {},
	basic: {
		saveLoading: false,
	},
	upload: {
		imgsrc: undefined,
		loading: false,
		headers: {
			Authorization: localStorage.getItem('authorization'),
		},
	},
	formState: {
		avatar: '',
		nickname: '',
		first_name: '',
		last_name: '',
		mobile: '',
		country: undefined,
		state: undefined,
		city: '',
		postal_code: '',
		address: '',
		address1: '',
		phone_code: '',
	},
})
const userInfo = ref({})

// 国家
const getCountries = async () => {
	const response = await getCountriesApi()
	if (response.code === 0) {
		const countryData = response.data
		// 处理国家数据
		data.value.countries = response.data.map((country) => {
			return {
				label: country.english_name + ' (' + country.code + ')',
				value: country.code,
				id: country.id,
			}
		})
		const uniquePhoneCodes = new Set()
		const uniqueItems = response.data.filter((item) => {
			if (!uniquePhoneCodes.has(item.phone_code)) {
				uniquePhoneCodes.add(item.phone_code)
				return true
			}
			return false
		})
		data.value.phoneCodeOptions = uniqueItems.map((item) => {
			const phone_code = item.phone_code.replace('+', '')
			return {
				label: '+ ' + phone_code,
				value: '+' + item.phone_code,
			}
		})
		// 根据选中的国家获取地区
		if (data.value.formState.country) {
			getStates(data.value.formState.country)
		}
	}
}

// 地区
const getStates = async (country_code) => {
	var response = await getStatesApi({ country_code: country_code })
	if (response.code === 0) {
		const stateData = response.data
		data.value.states = response.data.map((state) => {
			return {
				label: state.name,
				value: state.code,
				id: state.id,
			}
		})
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
			data.value.upload.imgsrc = response.data.path
			data.value.formState.avatar = response.data.path
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
		message.error(window.lang == 'en' ? 'You can only upload JPG file!' : '只能上传图片格式文件')
		return false
	}
	const isLt2M = file.size / 1024 / 1024 < 2
	if (!isLt2M) {
		message.error(window.lang == 'en' ? 'Image must smaller than 2MB!' : '最大不能超过 2MB!')
	}
	return isJpgOrPng && isLt2M
}
const filterOption = (input, option) => {
	return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const onFinish = (values) => {
	console.log('Success:', values)
}
const onFinishFailed = (errorInfo) => {
	console.log('Failed:', errorInfo)
}
const setUserInfo = (info) => {
	if (info.avatar) {
		data.value.formState.avatar = info.avatar
		data.value.upload.imgsrc = info.avatar
	}
	if (info.nickname) data.value.formState.nickname = info.nickname
	if (info.first_name) data.value.formState.first_name = info.first_name
	if (info.last_name) data.value.formState.last_name = info.last_name
	if (info.phone_code || (data.value.lang === 'zh' && !info.phone_code)) {
		data.value.formState.phone_code = info.phone_code || '+86'
	}
	if (info.mobile) data.value.formState.mobile = info.mobile
	if (info.country_code) data.value.formState.country = info.country_code
	if (info.state_code) data.value.formState.state = info.state_code
	if (info.city) data.value.formState.city = info.city
	if (info.postal_code) data.value.formState.postal_code = info.postal_code
	if (info.address) data.value.formState.address = info.address
	if (info.address1) data.value.formState.address1 = info.address1
	if (info.notes) data.value.formState.notes = info.notes
	return
}
const initUserInfo = () => {
	const userStore = useUserStore()
	userInfo.value = userStore.currentUser
	setUserInfo(userInfo.value)
}
initUserInfo()
const saveInformation = () => {
	const payload = data.value.formState
	data.value.basic.saveLoading = true
	saveInformationApi(payload)
		.then((result) => {
			if (result.code == 0) {
				notification.success({
					message: window.lang == 'en' ? 'Save Successfully!' : '保存成功',
				})
			}
		})
		.catch((err) => { })
		.finally(() => {
			data.value.basic.saveLoading = false
		})
}
onBeforeMount(() => {
	getCountries()
})
</script>
<style lang="scss" scoped>
.userinfo-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	.username {
		margin-bottom: 4px;
		color: rgba(0, 0, 0, 0.88);
		font-weight: 500;
		font-size: 20px;
		line-height: 28px;
	}
}

.user-center-tab {
	:deep(.ant-tabs-nav-list) {
		padding-right: 12px;
	}

	:deep(.ant-tabs-tab) {
		border-radius: 8px;
	}

	:deep(.ant-tabs-tab-active) {
		background-color: #e6f7ff;
	}

	:deep(.ant-tabs-ink-bar) {
		opacity: 0;
	}
}

.tab-title {
	margin-bottom: 12px;
	color: rgba(0, 0, 0, 0.88);
	font-weight: 500;
	font-size: 20px;
	line-height: 28px;
}

.mk-form-item {
	:deep(.ant-form-item-row) {
		display: unset !important;
	}

	// :deep(.ant-select-clear) {
	// 	margin-top: -10px;
	// }
	:deep(.ant-input-clear-icon) {
		display: flex;
	}
}

.group {
	margin-bottom: 24px;

	label {
		position: relative;
		max-width: 100%;
		height: 32px;
		color: rgba(0, 0, 0, 0.88);
		font-size: 14px;
		flex-grow: 0;
		overflow: hidden;
		white-space: nowrap;
		text-align: end;
		vertical-align: middle;
	}

	:deep(.ant-select-clear) {
		margin-top: -10px;
	}
}

.label {
	&::after {
		content: ':';
		position: relative;
		margin-block: 0;
		margin-inline-start: 2px;
		margin-inline-end: 8px;
	}
}
</style>
