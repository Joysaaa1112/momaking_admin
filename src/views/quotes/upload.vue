<template>
	<div class="quote-wrap">
		<div class="container">
			<div class="row mb24">
				<div class="col-12">
					<a-card :title="data.lang == 'zh' ? '1.选择加工工艺' : '1.Select processing technology'">
						<div class="row quote-section">
							<div class="col-lg-3 col-md-6 col-6"
								 v-for="(item, index) in technologyOptions"
								 :key="index">
								<div class="quote-item"
									 :class="item.is_checked == true ? 'active' : ''"
									 @click="handleQuoteItemClick(item)">
									<div class="item-image">
										<img :src="item.icon" />
									</div>
									<div class="item-content">
										<h3>{{ data.lang == 'en' ? item.en_name : item.cn_name }}</h3>
									</div>
								</div>
							</div>
						</div>
					</a-card>
				</div>
			</div>
			<div class="row"
				 v-if="data.main.formType == 1">
				<div class="col-12">
					<a-card :title="data.lang == 'zh' ? '2.上传3D图纸' : '2.Upload 3D drawings'">
						<div class="row">
							<div class="col-12">
								<input type="file"
									   id="file-input"
									   multiple
									   style="display: none" />
								<div class="quote-upload-bar"
									 :class="data.uploadBar.dragging == true ? 'dragover' : ''"
									 v-if="!data.uploadBar.uploading">
									<div class="upload-tip-content"
										 @click="openFileInput"
										 draggable="true"
										 @dragover.prevent="handleDragOver"
										 @drop.prevent="handleDrop">
										<img class="up-icon"
											 src="@/assets/images/CodiconCloudUpload.svg" />
										<div class="up-heading">
											<span>
												<a class="browse">{{ data.lang == 'en' ? 'Upload Files' : '选择文件' }}</a>
												{{ data.lang == 'en' ? 'or Drag and Drop Here' : '或拖放到这里' }}
											</span>
										</div>
										<div class="up-sub-heading">{{ data.lang == 'en' ? 'You can upload multiple files at once' : '您可以一次选择多个文件' }}</div>
										<div class="up-suffix">{{ data.lang == 'en' ? 'Instant Quote' : '自动报价' }}: STEP, STP, STL, OBJ</div>
										<div class="up-suffix">
											{{ data.lang == 'en' ? 'Manual Quote' : '手动报价' }}: DWS, DWF, DWG, PDF, SLDPRT, SAT, 3DXML, 3MF, PRT, IPT, CATPART, X_T, PTC, X_B, DXF
										</div>
										<input type="file"
											   ref="fileInput"
											   multiple
											   style="display: none"
											   @change="handleFileInput" />
									</div>
								</div>
								<div class="progress-content"
									 v-if="data.uploadBar.uploading">
									<h3 class="progress-text">{{ data.uploadBar.progress }}%</h3>
									<div>
										<a-progress :stroke-color="{
											'0%': '#3080e3',
											'100%': '#87d068',
										}"
													:percent="data.uploadBar.progress" />
									</div>
								</div>
							</div>
						</div>
					</a-card>
				</div>
			</div>
			<div class="row"
				 v-else>
				<div class="col-12">
					<a-card :title="data.lang == 'zh' ? '2.结构设计' : '2.Mechanic Design'">
						<div class="row">
							<div class="col-lg-6 col-12">
								<div class="group">
									<span class="title">
										<span class="must"></span>
										<span>{{ data.lang == 'zh' ? '上传ID,创意图片' : 'Upload ID, creative image' }}</span>
									</span>
									<div class="upload-item">
										<a-upload name="file"
												  :data="{ uuid: data.upload.uuid }"
												  v-model:file-list="data.upload.designImgFileList"
												  action="https://api.momaking.cn/api/upload/offline"
												  :before-upload="imageBeforeUpload"
												  list-type="picture-card"
												  @change="imageUploadChange">
											<div v-if="data.upload.designImgFileList.length < 8">
												<plus-outlined />
												<div style="margin-top: 8px">Upload</div>
											</div>
										</a-upload>
									</div>
									<p class="eroror-text"
									   v-if="data.upload.errors.img != undefined">{{ data.upload.errors.img }}</p>
								</div>
							</div>
							<div class="col-lg-6 col-12">
								<div class="group">
									<span class="title">{{ data.lang == 'zh' ? '相关文件图纸(2D, 3D)' : 'Related files and drawings (2D, 3D)' }}</span>
									<div class="upload-item">
										<a-upload name="file"
												  :data="{ uuid: data.upload.uuid }"
												  v-model:file-list="data.upload.designOtherFileList"
												  action="https://api.momaking.cn/api/upload/offline"
												  :before-upload="otherBeforeUpload"
												  list-type="picture-card"
												  @change="otherUploadChange">
											<div v-if="data.upload.designOtherFileList.length < 8">
												<plus-outlined />
												<div style="margin-top: 8px">Upload</div>
											</div>
										</a-upload>
									</div>
								</div>
							</div>
							<div class="col-lg-6 col-12">
								<div class="group">
									<span class="title">
										<span class="must"></span>
										<span>{{ data.lang == 'zh' ? '期望零件数量' : 'Expected part quantity' }}</span>
									</span>
									<a-input-number v-model:value="data.designState.quantity"
													class="full-item"
													:min="1"
													:placeholder="data.lang == 'zh' ? '请输入期望零件数量' : 'Please enter the desired quantity of parts'" />
									<p class="eroror-text"
									   v-if="data.upload.errors.quantity != undefined">{{ data.upload.errors.quantity }}</p>
								</div>
							</div>
							<div class="col-lg-6 col-12">
								<div class="group">
									<span class="title">
										<span class="must"></span>
										<span>{{ data.lang == 'zh' ? '关键词' : 'Keywords' }}</span>
									</span>
									<a-select class="full-item"
											  v-model:value="data.designState.keywords"
											  mode="tags"
											  :placeholder="data.lang == 'zh' ? '输入创意关键点，回车确认' : 'Enter the key points of your idea and press Enter to confirm'"></a-select>
									<p class="eroror-text"
									   v-if="data.upload.errors.keywords != undefined">{{ data.upload.errors.keywords }}</p>
								</div>
							</div>
							<div class="col-12">
								<div class="group">
									<span class="title">{{ data.lang == 'zh' ? '创意概述' : 'Creative overview' }}</span>
									<div class="editor-item">
										<Toolbar style="border-bottom: 1px solid #d9d9d9"
												 :editor="editorRef"
												 :defaultConfig="toolbarConfig"
												 mode="default" />
										<Editor style="height: 400px; overflow-y: hidden"
												v-model="valueHtml"
												:defaultConfig="editorConfig"
												mode="default"
												@onCreated="handleCreated" />
									</div>
									<p class="eroror-text"
									   v-if="data.upload.errors.content != undefined">{{ data.upload.errors.content }}</p>
								</div>
							</div>
							<div class="buttons">
								<a-button type="primary"
										  class="submit-btn"
										  :loading="data.upload.confirmLoading"
										  @click="submitDesignOrder">
									{{ data.lang == 'zh' ? '提交设计请求' : 'Submit design request' }}
								</a-button>
							</div>
						</div>
					</a-card>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, onBeforeMount, shallowRef, onMounted, watch } from 'vue'
import iconJgsj from '@/assets/images/quote-jgsj-icon.png'
import icon3d from '@/assets/images/quote-3d-icon.png'
import iconCnc from '@/assets/images/quote-cnc-icon.png'
import iconMold from '@/assets/images/quote-mold-icon.png'
import { message, notification } from 'ant-design-vue'
import { createQuoteApi, getAttributeApi } from '@/api/quote'
import { createDesignApi } from '@/api/design'
import { CloseOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import router from '@/router'
import '@wangeditor/editor/dist/css/style.css'

const editorRef = shallowRef()
const valueHtml = ref('<p>hello</p>')
const handleCreated = (editor) => {
	editorRef.value = editor // 记录 editor 实例，重要！
}
const toolbarConfig = {
	excludeKeys: ['group-image', 'group-video', 'todo'],
}
const editorConfig = { placeholder: '请输入内容...' }
const data = ref({
	lang: localStorage.getItem('lang') || 'zh',
	fileHash: [],
	main: {
		source: [],
		quoteType: 1,
		quoteNo: '',
		technology: 1,
		attributes: [],
		defaultAttributes: [],
		formType: 1,
	},
	uploadBar: {
		dragging: false,
		uploading: false,
		loading: true,
		progress: 0,
	},
	defaultObj: {
		options: {
			process: [],
			material: [],
			finish: [],
			color: [],
			precision: [],
			surface: null,
		},
		choose: {
			process: undefined,
			material: undefined,
			finish: undefined,
			color: undefined,
			precision: undefined,
			surface: undefined,
		},
	},
	upload: {
		uuid: window.localStorage.getItem('uuid'),
		designImgFileList: [],
		designOtherFileList: [],
		loading: false,
		confirmLoading: false,
		headers: {
			Authorization: localStorage.getItem('authorization'),
		},
		errors: {
			img: undefined,
			other: undefined,
			quantity: undefined,
			keywords: undefined,
			content: undefined,
		},
	},
	designState: {
		imgFileList: [],
		otherFileList: [],
		quantity: 1,
		keywords: [],
	},
})
const uuid = window.localStorage.getItem('uuid')
window.lang = window.localStorage.getItem('lang')
// 工艺选项
const technologyOptions = ref([
	{
		id: 3,
		cn_name: '结构设计',
		en_name: 'Mechanic Design',
		icon: iconJgsj,
		is_checked: false,
	},
	{
		id: 1,
		cn_name: '3D打印',
		en_name: '3D Printing',
		icon: icon3d,
		is_checked: true,
	},
	{
		id: 2,
		cn_name: 'CNC加工',
		en_name: 'CNC machining',
		icon: iconCnc,
		is_checked: false,
	},
	{
		id: 4,
		cn_name: '注塑成型',
		en_name: 'Injection mold',
		icon: iconMold,
		is_checked: false,
	},
])
// 选择工艺
const handleQuoteItemClick = (item) => {
	technologyOptions.value.forEach((item) => {
		item.is_checked = false
	})
	item.is_checked = !item.is_checked
	data.value.main.technology = item.id
	if (item.id == 3) {
		data.value.main.formType = 2
	} else {
		data.value.main.formType = 1
	}
}
// 上传
const fileInput = ref(null)
const openFileInput = () => {
	fileInput.value.click()
}
const handleFileInput = (event) => {
	const files = event.target.files
	handleFiles(files)
}
const handleDragOver = (event) => {
	event.preventDefault()
	data.value.uploadBar.dragging = true
}
const handleDrop = (event) => {
	event.preventDefault()
	const files = event.dataTransfer.files
	data.value.uploadBar.dragging = false
	handleFiles(files)
}
const handleFiles = async (files) => {
	if (files.length > 20) {
		message.info(window.lang == 'en' ? 'Only 20 files can be uploaded at a time.' : '一次只能上传20个文件')
		return
	}
	data.value.uploadBar.loading = true
	// Allowed suffixes
	const allowSuffix = ['.stp', '.step', '.stl', '.obj', '.amf', '.3mf', '.dxf', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.glft']
	// Validate suffixes
	const okFiles = []
	const inOkFiles = []
	for (const file of files) {
		const fileName = file.name.toLowerCase()
		const fileExtension = fileName.slice(fileName.lastIndexOf('.'))
		if (allowSuffix.includes(fileExtension)) {
			okFiles.push(file)
		} else {
			inOkFiles.push(file)
		}
	}

	// Handle invalid files
	if (inOkFiles.length > 0) {
		if (window.lang === 'en') {
			const additional = inOkFiles.length > 1 ? ` and ${inOkFiles.length - 1} more files` : ''
			data.value.uploadBar.errorMessage = `${inOkFiles[0].name}${additional} are not supported formats.`
		} else {
			const additional = inOkFiles.length > 1 ? `等${inOkFiles.length - 1}个文件` : ''
			data.value.uploadBar.errorMessage = `${inOkFiles[0].name}${additional}格式不支持`
		}
	}
	// 添加beforeunload事件监听器
	window.addEventListener('beforeunload', handleBeforeUnload)
	data.value.uploadBar.uploading = true
	if (!uuid) {
		uuid = getUuid()
		window.localStorage.setItem('uuid', uuid)
	}
	if (data.value.main.quoteNo == '') {
		var payload = {
			uuid: uuid,
			technology: data.value.main.technology,
		}
		data.value.uploadBar.message = window.lang == 'en' ? 'Creating quote...' : '创建报价中...'
		await createQuote(payload)
		console.log('创建报价单')
	}
	okFiles.map((item) => {
		var pwd = password(16)
		data.value.fileHash.push(pwd)
		var obj = {
			name: item.name,
			attribute: {},
			hash: pwd,
			loading: true,
			is_analyze: false,
		}
		obj.tmp = data.value.defaultObj
		obj.attribute = getAttributeOptions(obj.tmp, data.value.main.technology, true)
		obj.options = obj.tmp.options
		obj.choose = obj.tmp.choose
		data.value.main.source.unshift(obj)
	})

	await uploadFileOnce(okFiles)
	// 移除beforeunload事件监听器
	window.removeEventListener('beforeunload', handleBeforeUnload)
	setTimeout(() => {
		const currentLang = window.location.pathname.split('/')[1] // 获取当前页面的语言前缀

		router.push({
			path: `/${currentLang}/space/quotes/config`,
			query: {
				quoteNo: data.value.main.quoteNo,
			},
		})
	}, 200)
	// 清理
	// data.value.uploadBar.uploading = false
	data.value.fileHash = []
}
let progressInterval
const simulateSlowProgress = (onProgress) => {
	let progress = 80
	clearInterval(progressInterval) // 确保没有其他的定时器在运行
	progressInterval = setInterval(() => {
		if (progress < 99) {
			progress += 1 // 每次增加0.5%
			onProgress(progress)
		} else {
			clearInterval(progressInterval) // 达到90%后停止
		}
	}, 200) // 每200毫秒增加一次
}
// file upload
const uploadFilesWithProgress = (quoteNo, files, onProgress) => {
	return new Promise((resolve, reject) => {
		if (files.length === 0) {
			reject(new Error('No files to upload.'))
			return
		}
		const formData = new FormData()
		files.forEach((file) => {
			formData.append('files[]', file)
		})
		for (var i in data.value.fileHash) {
			formData.append('filehash[]', data.value.fileHash[i])
		}
		formData.append('quote_no', quoteNo)
		formData.append('uuid', uuid)
		const defaultItem = {
			options: {},
			choose: {},
		}
		if (data.value.main.quoteInfo?.technology != undefined) {
			var attr = getAttributeOptions(defaultItem, data.value.main.quoteInfo.technology)
		} else {
			var attr = getAttributeOptions(defaultItem, data.value.main.technology)
		}
		formData.append('attribute', JSON.stringify(attr))
		const xhr = new XMLHttpRequest()
		xhr.open('POST', import.meta.env.VITE_BASE_API_URL + '/api/quotes/upload')

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				const progress = Math.round((event.loaded / event.total) * 100)
				if (progress >= 80) {
					simulateSlowProgress(onProgress)
				} else {
					onProgress(progress)
				}
			}
		}

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				clearInterval(progressInterval) // 停止模拟进度
				onProgress(100) // 确保在服务器响应后设置进度为100%
				resolve(JSON.parse(xhr.responseText))
			} else {
				reject(new Error('Failed to upload files.'))
			}
		}

		xhr.onerror = () => {
			reject(new Error('Network error occurred while uploading files.'))
		}

		xhr.setRequestHeader('Authorization', localStorage.getItem('authorization'))
		xhr.send(formData)
	})
}
// 上传文件
const uploadFileOnce = async (files) => {
	return new Promise((resolve, reject) => {
		uploadFilesWithProgress(data.value.main.quoteNo, files, (progress) => {
			data.value.uploadBar.progress = progress
		})
			.then((uploadResponse) => {
				data.value.uploadBar.progress = 100
				data.value.uploadBar.message = window.lang === 'en' ? 'Successfully' : '上传完成'
				resolve(uploadResponse)
			})
			.catch((error) => reject(error))
			.finally(() => {
				data.value.uploadBar.loading = false
			})
	})
}
// 创建报价单
const createQuote = async (payload) => {
	try {
		const result = await createQuoteApi(payload)
		data.value.main.quoteNo = result.data.quote_no
	} catch (err) {
		console.error('Error creating quote:', err)
	} finally {
		data.value.uploadBar.loading = false
	}
}
// 获取工艺材料属性
const getAttributeOptions = (obj, process, type) => {
	obj.choose.process = obj.choose.process == undefined ? process : obj.choose.process
	// 过滤和映射属性函数
	const filterAndMapAttributes = (type, process) =>
		data.value.main.attributes
			.filter((item) => item.type === type && item.process === process)
			.map((item) => ({ label: `${item.en_name} ${item.cn_name}`, value: item.id }))

	// 设置默认选项函数
	const setDefaultChoice = (options, choiceKey) => {
		if (options.length > 0) {
			obj.options[choiceKey] = options
			if (obj.choose[choiceKey] === undefined) {
				obj.choose[choiceKey] = options[0].value
			}
		} else {
			obj.options[choiceKey] = []
			obj.choose[choiceKey] = undefined
		}
	}

	// 过滤并映射材料、表面处理和精度属性
	const materials = filterAndMapAttributes(2, process)
	const finishes = filterAndMapAttributes(3, process)
	const precisions = filterAndMapAttributes(5, process)

	// 如果type为false，则设置默认选项
	if (!type) {
		setDefaultChoice(materials, 'material')
		setDefaultChoice(finishes, 'finish')
		setDefaultChoice(precisions, 'precision')
	}

	// 过滤并映射颜色属性
	var colors,
		searchKey = !type ? obj.choose.material : materials[0].value
	colors = data.value.main.attributes
		.filter((item) => item.process == searchKey)
		.map((item) => ({ label: item.en_name + ' ' + item.cn_name, value: item.id }))
	if (!type) {
		obj.choose.color = undefined
		if (colors.length > 0 && !type) {
			obj.options.color = colors
			if (obj.choose.color == undefined) {
				obj.choose.color = colors[0].value
			}
		}
	}
	// 设置表面选项函数
	const setSurfaceOptions = () => {
		const finish = findItem(obj.choose.finish)
		if (!finish || !finish.surface) return

		const surface = finish.surface
		if (!surface) return

		obj.options.surface = {
			origin: surface,
			options: surface.map((item) => ({ value: item.id, label: window.lang == 'en' ? item.en_name : item.cn_name })),
			material: [],
			film: [],
			remark: '',
		}

		if (obj.choose.surface?.info) {
			const selectedSurface = surface.find((item) => item.id === obj.choose.surface.info)
			if (selectedSurface) {
				obj.options.surface.remark = window.lang == 'en' ? selectedSurface.en_remark : selectedSurface.cn_remark
				obj.options.surface.material = selectedSurface.items.map((item) => ({
					value: item.id,
					label: window.lang == 'en' ? item.en_name : item.cn_name,
				}))

				// Set default surface material if not defined
				if (!obj.choose.surface.material && selectedSurface.items.length > 0) {
					obj.choose.surface.material = selectedSurface.items[0].id
				}
			}
		}
		if (obj.choose.surface?.material) {
			const selectedSurface = surface.find((item) => item.id === obj.choose.surface.info)
			if (selectedSurface) {
				// set default surface film if not defined
				selectedSurface.items.find((item) => {
					if (item.id == obj.choose.surface.material) {
						if (item.films.length > 0) {
							obj.options.surface.film = item.films.map((item, index) => ({
								label: item.name,
								value: index,
							}))
							if (obj.choose.surface.film == undefined) {
								obj.choose.surface.film = 0
							}
						}
					}
				})
			}
		}
	}
	setSurfaceOptions()
	// 构造返回对象项函数
	const constructResultItem = (choiceKey, findFunction) => {
		const keys = choiceKey.split('.')
		let itemKey = obj.choose
		// 逐级访问嵌套的属性
		for (const key of keys) {
			itemKey = itemKey[key]
			if (!itemKey) {
				break
			}
		}
		if (!itemKey) {
			return undefined
		}

		const item = findFunction(itemKey)
		if (choiceKey == 'surface.info' || choiceKey == 'surface.material') {
			return item ? { label: window.lang == 'en' ? item.en_name : item.cn_name, value: item.id } : undefined
		}
		return item ? { label: `${item.en_name} ${item.cn_name}`, value: item.id } : undefined
	}
	// 构造表面选项
	const surface =
		obj.choose.surface && obj.options.surface && Array.isArray(obj.options.surface.origin) && obj.options.surface.origin.length > 0
			? {
				info: constructResultItem('surface.info', (id) => obj.options.surface.origin.find((item) => item.id === id)),
				material: constructResultItem('surface.material', (id) =>
					obj.options.surface.origin.find((item) => item.id === obj.choose.surface.info)?.items.find((item) => item.id === id),
				),
				film:
					obj.choose.surface.film !== undefined
						? {
							label: obj.options.surface.origin
								.find((item) => item.id === obj.choose.surface.info)
								?.items.find((item) => item.id === obj.choose.surface.material)?.films[obj.choose.surface.film]?.name,
							value: obj.choose.surface.film,
						}
						: undefined,
			}
			: undefined
	console.log('surface', surface)
	// 返回最终构造的对象
	return {
		process: constructResultItem('process', findItem),
		material: constructResultItem('material', findItem),
		finish: constructResultItem('finish', findItem),
		precision: constructResultItem('precision', findItem),
		color: constructResultItem('color', findItem),
		remarks: obj.choose.remarks,
		surface: surface,
	}
}
// 获取属性选项
const getAttribute = () => {
	data.value.main.itemLoading = true
	getAttributeApi()
		.then((result) => {
			if (result.code == 0) {
				data.value.main.attributes = result.data
				var obj = data.value.defaultObj
				data.value.main.defaultAttributes = getAttributeOptions(obj, data.value.main.technology)
			}
		})
		.finally(() => {
			data.value.main.quoteNo = getUriId()
			if (data.value.main.quoteNo) {
				data.value.main.audit_status = 1
				getOrderInfo()
			}
		})
}
const findItem = (id) => {
	for (var i in data.value.main.attributes) {
		if (data.value.main.attributes[i].id == id) {
			return data.value.main.attributes[i]
		}
	}
}
const handleBeforeUnload = (event) => {
	event.preventDefault()
	event.returnValue = '' // 某些浏览器需要这样设置
}
const getUriId = () => {
	const url = new URL(window.location.href)
	const pathname = url.pathname
	const match = pathname.match(/\/(\d+)$/)
	if (match) {
		const id = match[1]
		return id
	}

	return false
}
const password = (length) => {
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
	var maxPos = chars.length
	var pwd = ''
	for (var i = 0; i < length; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos))
	}
	return pwd
}
const imageBeforeUpload = (file) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
	if (!isJpgOrPng) {
		file.status = 'error'
		message.error(data.value.lang == 'en' ? 'You can only upload JPG file!' : '只能上传图片格式文件')
		return false
	}
	const isLt2M = file.size / 1024 / 1024 < 2
	if (!isLt2M) {
		file.status = 'error'
		message.error(data.value.lang == 'en' ? 'Image must smaller than 2MB!' : '最大不能超过 2MB!')
	}
	return isJpgOrPng && isLt2M
}
const otherBeforeUpload = (file) => {
	const isLt10M = file.size / 1024 / 1024 < 10
	if (!isLt10M) {
		file.status = 'error'
		message.error(data.value.lang == 'en' ? 'Image must smaller than 10MB!' : '最大不能超过 10MB!')
	}
	return isLt10M
}
// ID创意图片上传
const imageUploadChange = (info) => {
	if (info.file.status === 'removed') {
		// 获取被移除文件的 UID
		const uid = info.file.uid

		// 在 imgFileList 中找到并删除对应的文件
		const index = data.value.designState.imgFileList.findIndex((file) => file.uid === uid)
		if (index !== -1) {
			data.value.designState.imgFileList.splice(index, 1)
		}
	}

	if (info.file.status === 'done') {
		var response = info.file.response
		if (response.code == 0) {
			data.value.designState.imgFileList.push({
				uid: info.file.uid,
				path: response.data.path,
			})
		} else {
			message.error(response.msg)
		}
	}
}
const otherUploadChange = (info) => {
	if (info.file.status === 'removed') {
		// 获取被移除文件的 UID
		const uid = info.file.uid

		// 在 imgFileList 中找到并删除对应的文件
		const index = data.value.designState.otherFileList.findIndex((file) => file.uid === uid)
		if (index !== -1) {
			data.value.designState.otherFileList.splice(index, 1)
		}
	}
	if (info.file.status === 'done') {
		var response = info.file.response
		if (response.code == 0) {
			data.value.designState.otherFileList.push(response.data.path)
		} else {
			message.error(response.msg)
		}
	}
}
// 提交结构设计申请
const submitDesignOrder = () => {
	var payload = {
		uuid: localStorage.getItem('uuid'),
		images: data.value.designState.imgFileList.map((item) => item.path),
		files: data.value.designState.otherFileList,
		quantity: data.value.designState.quantity,
		keywords: data.value.designState.keywords,
		content: editorRef.value.getHtml(),
	}
	var checkResult = true
	if (payload.images.length == 0) {
		data.value.upload.errors.img = data.value.lang == 'en' ? 'Please upload at least one image!' : '请上传至少一张图片'
		checkResult = false
	}
	if (payload.quantity == 0 || payload.quantity == '') {
		data.value.upload.errors.quantity = data.value.lang == 'en' ? 'Please enter the quantity!' : '请输入数量'
		checkResult = false
	}
	if (payload.keywords.length == 0) {
		data.value.upload.errors.keywords = data.value.lang == 'en' ? 'Please enter the keywords!' : '请输入关键词'
		checkResult = false
	}
	if (editorRef.value.getText() == '') {
		data.value.upload.errors.content = data.value.lang == 'en' ? 'Please enter the content!' : '请输入内容'
		checkResult = false
	}
	if (checkResult == false) {
		return
	}
	data.value.upload.confirmLoading = true
	createDesignApi(payload)
		.then((result) => {
			if (result.code == 0) {
				notification.success({
					message: data.value.lang == 'en' ? 'Success' : '成功',
					description: data.value.lang == 'en' ? 'Your design has been submitted successfully!' : '您的设计已提交成功',
				})
				router.push({ path: `/${data.value.lang}/space/quotes/design-review` })
			}
		})
		.finally(() => {
			data.value.upload.confirmLoading = false
		})
}
watch(
	() => data.value.designState.imgFileList,
	(newValue) => {
		if (newValue.length > 0) {
			data.value.upload.errors.img = undefined
		}
	},
	{ deep: true },
)
watch(
	() => data.value.designState.keywords,
	(newValue) => {
		if (newValue.length > 0) {
			data.value.upload.errors.keywords = undefined
		}
	},
	{ deep: true },
)
watch(
	() => data.value.designState.quantity,
	(newValue) => {
		if (newValue > 0) {
			data.value.upload.errors.quantity = undefined
		}
	},
	{ deep: true },
)
onBeforeMount(() => {
	getAttribute()
	const technologyQuery = router.currentRoute.value.query.technology
	if (technologyQuery != undefined) {
		const technologyId = Number(technologyQuery)
		technologyOptions.value.forEach((option) => {
			option.is_checked = option.id === technologyId
		})
	}
})
onMounted(() => {
	i18nChangeLanguage(data.value.lang == 'en' ? 'en' : 'zh-CN')
})
</script>
<style scoped lang="scss">
.quote-technology-content {
	background-color: #fff;
	padding: 30px;
	border-radius: 10px;
}

.quote-section {
	.quote-section-title {
		h2 {
			font-size: 20px;
			font-weight: 500;
			margin-bottom: 24px;
		}
	}

	.quote-item {
		border: 1.5px dashed #ababab;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding: 24px;
		cursor: pointer;
		user-select: none;
		transition: 0.4s all;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.048);

		&.active,
		&:hover {
			border: 1.5px solid #3080e3;
			background-color: #fafcff;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.048);
		}

		.item-image {
			img {
				width: 42px;
				height: 42px;
			}
		}

		.item-content {
			margin-top: 16px;

			h3 {
				font-size: 18px;
				font-weight: 500;
			}
		}
	}
}

.quote-upload-bar {
	border-radius: 5px;
	text-align: center;
	transition: all 0.2s;
	border: 2px dashed #3080e3;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
	color: #747892;
	background-color: rgba(255, 255, 255, 0.5);
	font-size: 14px;

	.upload-loading {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1;
		background-color: rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&.dragover {
		border-color: red;
	}

	.upload-tip-content {
		padding: 24px;
		cursor: pointer;

		.up-icon {
			width: 60px;
			display: inline-block;
		}

		.up-heading,
		.up-sub-haeding {
			color: #253843;
			font-weight: 600px;
			font-size: 15px;
			margin-bottom: 10px;
		}

		.up-heading {
			a {
				color: #3080e3;
			}
		}

		.up-sub-haeding {
			font-size: 13px;
		}

		.up-suffix {
			margin-bottom: 10px;
			color: #666;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}
}

.progress-content {
	padding: 30px 0;

	.progress-text {
		font-size: 18px;
		margin-bottom: 16px;
		text-align: center;
	}
}

:deep(.ant-progress-bg) {
	height: 20px !important;
}

:deep(.ant-upload-list) {
	padding: 8px;
	box-sizing: border-box;
	border: 1px solid #d9d9d9;
	// display: flex;
	// flex-wrap: wrap;
	// gap: 16px;
	border-radius: 8px;

	.ant-upload-list-item-container {
		display: inline-block;
	}

	.file-item {
		width: 90px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
		transition: 0.2s all ease-in;
		border-radius: 8px;
		position: relative;
		box-sizing: border-box;

		&:hover {
			background-color: #f1f1f1;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.048);

			.remove {
				display: block;
			}
		}

		.icon {
			position: relative;

			span {
				position: absolute;
				bottom: 4px;
				left: -4px;
				background-color: #ffb929;
				border-radius: 5px;
				line-height: 1.2;
				color: #fff;
				padding: 4px;
				transform: scale(0.7);
				font-size: 12px;
			}

			svg {
				width: 36px;
				height: 36px;
				color: #6e6e6e;
			}
		}

		.remove {
			font-size: 14px;
			position: absolute;
			top: 6px;
			right: 6px;
			display: none;
			color: #999;
		}

		span {
			&:first-child {
				flex: 1;
				color: #253843;
			}
		}
	}
}

.group {
	display: block;
	margin-bottom: 24px;

	.title {
		display: block;
		margin-block: 8px;

		&::after {
			content: ':';
			padding-left: 2px;
		}

		.must {
			&::before {
				content: '*';
				color: red;
			}
		}
	}

	.eroror-text {
		color: #ff0400;
		margin-top: 2px;
		font-size: 12px;
	}
}

:deep(.ant-upload-list-picture-card) {
	padding-bottom: 0;

	.ant-upload-list-item {
		&::before {
			display: none;
		}
	}

	.ant-upload-list-item-actions {
		.anticon-eye {
			display: none;
		}

		.ant-btn-text:not(:disabled):hover {
			background-color: rgba(0, 0, 0, 0.5);
		}

		// display: none;
	}

	.anticon-picture {
		width: 32px;
		height: 32px;
		background-image: url('@/assets/images/file-icon.png');
		background-size: cover;

		svg {
			display: none;
		}
	}
}

:deep(.ant-select-selection-item-remove) {
	line-height: 20px;
}

.editor-item {
	border: 1px solid #d9d9d9;
	border-radius: 8px;
	overflow: hidden;
}

.submit-btn {
	height: 42px;
}
</style>
