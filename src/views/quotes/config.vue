<template>
	<div class="config-wrap">
		<div class="small-container container">
			<div class="row">
				<div class="col-12">
					<div class="quote-item" v-if="data.main.itemLoading">
						<div class="quote-header">
							<span class="skeleton-animation" style="width: 150px; height: 16px; margin-bottom: 8px"></span>
						</div>
						<div class="quote-wrapper">
							<div class="quote-body">
								<div class="quote-info-thumb">
									<div class="quote-thumb-loading">
										<div class="loading-box">
											<img src="http://wp.cc/wp-content/uploads/2024/05/cropped-m.png" alt="Logo" />
											<div class="loading-circle"></div>
											<div class="planet"></div>
											<div class="planet planet2"></div>
										</div>
									</div>
								</div>
								<section class="qutoe-content-section">
									<div class="quote-content">
										<div class="craft-lines">
											<div class="line">
												<span style="width: 200px; height: 16px; margin-bottom: 10px" class="skeleton-animation"></span>
											</div>
											<div class="line">
												<span style="width: 200px; height: 16px; margin-bottom: 10px" class="skeleton-animation"></span>
											</div>
											<div class="line">
												<span style="width: 200px; height: 16px; margin-bottom: 10px" class="skeleton-animation"></span>
											</div>
											<div class="line">
												<span style="width: 200px; height: 16px; margin-bottom: 10px" class="skeleton-animation"></span>
											</div>
											<div class="line">
												<span style="width: 200px; height: 16px" class="skeleton-animation"></span>
											</div>
										</div>
										<div class="message-box">
											<span style="width: 200px; height: 16px" class="skeleton-animation"></span>
										</div>
									</div>
									<span style="width: 100%; height: 32px" class="skeleton-animation"></span>
								</section>
								<div class="info-actions">
									<span style="width: 100%; height: 200px" class="skeleton-animation"></span>
								</div>
							</div>
						</div>
					</div>
					<div class="quote-item" v-for="(item, index) in data.main.source" :key="index">
						<div class="quote-header">
							<a-checkbox :checked="typeof item.is_checked == 'number' ? (item.is_checked == 1 ? true : false) : item.is_checked">{{ item.name }}</a-checkbox>
						</div>
						<div class="quote-wrapper">
							<div class="quote-body">
								<div class="quote-info-thumb">
									<div class="quote-thumb-loading" v-if="item.loading">
										<div class="loading-box">
											<img src="@/assets/images/mk-logo.png" alt="Logo" />
											<div class="loading-circle"></div>
											<div class="planet"></div>
											<div class="planet planet2"></div>
										</div>
									</div>
									<img class="quote-image" :src="resolveStaticUrl(item.preview)" />
									<div class="info-dimensioni">
										<div class="title" v-if="data.lang == 'en'">Item dimensions ({{ data.main.quoteInfo.unitText }}):</div>
										<div class="title" v-else>项目尺寸 ({{ data.main.quoteInfo.unitText }}):</div>
										<div>
											<span>{{ item.width }}x{{ item.height }}x{{ item.length }}</span>
										</div>
									</div>
									<a-button class="preview-btn" type="primary" @click="showPreviewModal(item)">
										<svg width="14" height="14" viewBox="0 0 14 14" fill="black" xmlns="http://www.w3.org/2000/svg">
											<path
												d="M7.39525 13.6156L3.473 11.3002C3.31173 11.185 3.18502 11.0468 3.09287 10.8855C3.00072 10.7243 2.95464 10.5457 2.95464 10.3499V5.78834C2.95464 5.60403 2.99496 5.42837 3.07559 5.26134C3.15623 5.09431 3.2887 4.9532 3.473 4.83801L7.46436 2.47084C7.64867 2.36717 7.82721 2.31533 8 2.31533C8.17279 2.31533 8.35133 2.36717 8.53564 2.47084L12.527 4.83801C12.6998 4.9532 12.8294 5.09431 12.9158 5.26134C13.0022 5.42837 13.0454 5.60403 13.0454 5.78834V10.3499C13.0454 10.5457 12.9993 10.7243 12.9071 10.8855C12.815 11.0468 12.6883 11.185 12.527 11.3002L8.53564 13.6156C8.36285 13.7307 8.17278 13.7883 7.96544 13.7883C7.7581 13.7883 7.56803 13.7307 7.39525 13.6156ZM7.48164 11.7667V8.36285L4.59611 6.68682V10.0216L7.48164 11.7667ZM8.51836 11.7667L11.4212 10.0216V6.68682L8.51836 8.36285V11.7667ZM0 3.66307V2.33261C0 1.68754 0.227502 1.13751 0.682505 0.682505C1.13751 0.227502 1.68754 0 2.33261 0H3.66307V1.43413H2.33261C2.07919 1.43413 1.86609 1.52052 1.6933 1.6933C1.52052 1.86609 1.43413 2.07919 1.43413 2.33261V3.66307H0ZM2.33261 16C1.68754 16 1.13751 15.7725 0.682505 15.3175C0.227502 14.8625 0 14.3125 0 13.6674V12.3369H1.43413V13.6674C1.43413 13.9208 1.52052 14.1339 1.6933 14.3067C1.86609 14.4795 2.07919 14.5659 2.33261 14.5659H3.66307V16H2.33261ZM12.3369 15.9309V14.4968H13.6674C13.9208 14.4968 14.1339 14.4104 14.3067 14.2376C14.4795 14.0648 14.5659 13.8517 14.5659 13.5983V12.2678H16V13.5983C16 14.2433 15.7725 14.7934 15.3175 15.2484C14.8625 15.7034 14.3125 15.9309 13.6674 15.9309H12.3369ZM14.5659 3.66307V2.33261C14.5659 2.07919 14.4795 1.86609 14.3067 1.6933C14.1339 1.52052 13.9208 1.43413 13.6674 1.43413H12.3369V0H13.6674C14.3125 0 14.8625 0.227502 15.3175 0.682505C15.7725 1.13751 16 1.68754 16 2.33261V3.66307H14.5659ZM8 7.4298L10.8855 5.7365L8 4.07775L5.11447 5.7365L8 7.4298Z"
												fill="currentColor"></path>
										</svg>
										<span v-if="data.lang == 'en'">Preview</span>
										<span v-else>预览模型</span>
									</a-button>
								</div>
								<section class="qutoe-content-section">
									<div class="quote-content">
										<div class="craft-lines">
											<div class="line" v-if="item.attribute.process != undefined">{{ item.attribute.process.label }}</div>
											<div class="line" v-if="item.attribute.material != undefined">{{ item.attribute.material.label }}</div>
											<div class="line" v-if="item.attribute.finish != undefined">{{ item.attribute.finish.label }}</div>
											<div class="line" v-if="item.attribute.surface != undefined">
												<span v-if="item.attribute.surface.info != undefined">{{ item.attribute.surface.info.label }}</span>
												<span v-if="item.attribute.surface.material != undefined">{{ item.attribute.surface.material.label }}</span>
												<span v-if="item.attribute.surface.film != undefined">{{ item.attribute.surface.film.label }}</span>
											</div>
											<div class="line" v-if="item.attribute.precision != undefined">{{ item.attribute.precision.label }}</div>
											<div class="line" v-if="item.attribute.color != undefined">{{ item.attribute.color.label }}</div>
										</div>
										<div class="message-box">
											<div class="status" v-if="item.is_manual_quote == 1">
												<span v-if="item.loading" style="width: 150px" class="skeleton-animation"></span>
												<span v-else>
													<span v-if="item.is_manual_quote == 1" class="manual-quote-tip">Manual Quote</span>
												</span>
											</div>
											<div class="message" v-for="(message, i) in item.messages" :key="i">{{ data.lang == 'en' ? message.en : message.zh }}</div>
										</div>
									</div>
									<a-button class="custom-btn" v-if="!item.isExpanded" @click="item.isExpanded = !item.isExpanded" :disabled="data.main.isWaitingReview" block>
										<span>Process customization</span>
										<DownOutlined />
									</a-button>
									<a-button class="custom-btn white" v-if="item.isExpanded" @click="item.isExpanded = false" :disabled="data.main.isWaitingReview" block>
										<span>Process customization</span>
										<UpOutlined />
									</a-button>
								</section>
								<div class="info-actions">
									<div class="quantita-main">
										<div class="line">
											<span class="title" v-if="data.lang == 'en'">Quantity</span>
											<span class="title" v-else>数量</span>
											<div class="right">
												<div class="quantity-input">
													<span @click="setQuantity(item, 'setdesc')">-</span>
													<input type="text" :disabled="data.main.isWaitingReview" v-model="item.quantity" @change="debouncedQuantityChange(item)" />
													<span @click="setQuantity(item, 'setinc')">+</span>
												</div>
											</div>
										</div>
										<div class="line">
											<span class="title" v-if="data.lang == 'en'">
												Unit price
												<span class="vat">(VAT incl.)</span>
											</span>
											<span class="title" v-else>
												单价
												<span class="vat">(含税)</span>
											</span>
											<div class="right price-box">
												<span v-if="item.loading || item.priceLoading" style="width: 60px" class="skeleton-animation"></span>
												<span v-else>￥{{ item.price }}</span>
											</div>
										</div>
										<div class="line">
											<span class="title" v-if="data.lang == 'en'">
												Total price
												<span class="vat">(VAT incl.)</span>
											</span>
											<span class="title" v-else>
												合计
												<span class="vat">(含税)</span>
											</span>
											<div class="right price-box">
												<span v-if="item.loading || item.priceLoading" style="width: 60px" class="skeleton-animation"></span>
												<span v-else>￥{{ (item.price * item.quantity).toFixed(2) }}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="customize-box" v-if="item.isExpanded">
								<div class="customize-body">
									<a-tabs v-model:activeKey="item.activeKey" centered>
										<a-tab-pane :key="1" :tab="data.lang == 'en' ? 'Materials' : '材料'" class="customize-pane">
											<div class="row card-gap">
												<div class="col-6 col-lg-3" v-for="(material, index) in item.tmp.options.material" :key="index">
													<div class="material-card">
														<div class="box" @click="chooseOption(item, 'material', material.value)">
															<div class="card-head">
																<div class="color-item" :style="'background-color:' + material.color"></div>
																<div>
																	<h3 v-if="data.lang == 'en'">{{ material.en_name }}</h3>
																	<h3 v-else>{{ material.cn_name }}</h3>
																	<!-- <p class="price">￥1952.55 / 件</p> -->
																</div>
																<CheckOutlined class="checked" v-if="item.choose.material == material.value" />
															</div>
															<div class="card-content" v-if="material.cn_remark || material.en_remark">
																<p v-if="data.lang == 'en'">{{ material.en_remark }}</p>
																<p v-else>{{ material.cn_remark }}</p>
															</div>
															<div class="attributes-wrap" v-if="material.attributes && material.attributes.length > 0">
																<div class="attribute-item" v-for="(attr, i) in material.attributes" :key="i">
																	<div class="name">{{ data.lang == 'en' ? attr.en_name : attr.cn_name }}</div>
																	<div class="percent-bar">
																		<div class="percent-bar-inner" :style="'width:' + attr.percent"></div>
																	</div>
																	<div class="value">{{ attr.value }}</div>
																</div>
															</div>
														</div>
														<div class="more-bar">
															<a-button type="link" @click="showItemArticleModal(material)">{{ data.lang == 'en' ? 'Material Data' : '材料数据' }}</a-button>
														</div>
													</div>
												</div>
											</div>
										</a-tab-pane>
										<a-tab-pane :key="2" :tab="data.lang == 'en' ? 'Post processing' : '后期处理'" force-render>
											<div class="row">
												<div class="col-12" v-if="item.tmp.options.finish && item.tmp.options.finish.length > 0">
													<div class="process-field-section">
														<div class="title">{{ data.lang == 'en' ? 'Surface Treatment' : '表面处理' }}</div>
														<div class="row">
															<div class="col-lg-3 col-6" v-for="(finish, index) in item.tmp.options.finish" :key="index">
																<div class="field-item" @click="chooseOption(item, 'finish', finish.value)">
																	<div class="top">
																		<a-radio :checked="item.choose.finish == finish.value" v-model:value="finish.value">
																			{{ data.lang == 'en' ? finish.en_name : finish.cn_name }}
																		</a-radio>
																	</div>
																	<div class="content">
																		<p>{{ data.lang == 'en' ? finish.en_remark : finish.cn_remark }}</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="col-12" v-if="item.tmp.options.surface && item.tmp.options.surface.origin && item.tmp.options.surface.origin.length > 0">
													<div class="process-field-section">
														<div class="title">{{ data.lang == 'en' ? 'Special Handling' : '特殊处理配置' }}</div>
														<div class="row">
															<div class="col-lg-3 col-6" v-for="(surface, index) in item.tmp.options.surface.origin" :key="index">
																<div class="field-item" @click="chooseOption(item, 'surface', surface.id)">
																	<div class="top">
																		<a-radio :checked="item.choose.surface.info == surface.id">
																			{{ data.lang == 'en' ? surface.en_name : surface.cn_name }}
																		</a-radio>
																	</div>
																	<div class="content" v-if="surface.items && surface.items.length > 0">
																		<div class="group" v-if="item.choose.surface.info == surface.id">
																			<label>分类</label>
																			<a-select class="full" v-model:value="item.choose.surface.material">
																				<a-select-option v-for="(typeItem, typeItemIndex) in surface.items" :key="typeItemIndex" :value="typeItem.id">
																					{{ data.lang == 'en' ? typeItem.en_name : typeItem.cn_name }}
																				</a-select-option>
																			</a-select>
																		</div>
																		<div v-if="item.choose.surface.info == surface.id" style="margin-bottom: 12px">
																			<div class="group" v-if="item.options.surface.film && item.options.surface.film.length > 0">
																				<label>{{ data.lang == 'en' ? 'Film Thickness' : '膜厚' }}</label>
																				<a-select class="full" v-model:value="item.choose.surface.film">
																					<a-select-option v-for="(film, filmIndex) in item.tmp.options.surface.film" :key="filmIndex" :value="film.value">
																						{{ film.label }}
																					</a-select-option>
																				</a-select>
																			</div>
																		</div>
																		<p>{{ data.lang == 'en' ? surface.en_remark : surface.cn_remark }}</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="col-12" v-if="item.tmp.options.precision && item.tmp.options.precision.length > 0">
													<div class="process-field-section">
														<div class="title">{{ data.lang == 'en' ? 'precision' : '精度' }}</div>
														<div class="row">
															<div class="col-lg-3 col-6" v-for="(precision, index) in item.tmp.options.precision" :key="index">
																<div class="field-item" @click="chooseOption(item, 'precision', precision.value)">
																	<div class="top">
																		<a-radio :checked="item.choose.precision == precision.value" v-model:value="precision.value">
																			{{ precision.label }}
																		</a-radio>
																	</div>
																	<div class="content" v-if="precision.cn_remark || precision.en_remark">
																		<p>{{ data.lang == 'en' ? precision.en_remark : precision.cn_remark }}</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="col-12" v-if="item.tmp.options.color && item.tmp.options.color.length > 0">
													<div class="process-field-section">
														<div class="title">{{ data.lang == 'en' ? 'Coloring' : '染色' }}</div>
														<div class="row">
															<div class="col-lg-3 col-6" v-for="(color, index) in item.tmp.options.color" :key="index">
																<div class="field-item" @click="chooseOption(item, 'color', color.value)">
																	<div class="top">
																		<a-radio :checked="item.choose.color == color.value">
																			{{ color.label }}
																		</a-radio>
																	</div>
																	<div class="content" v-if="color.cn_remark || color.en_remark">
																		<p>{{ data.lang == 'en' ? color.en_remark : color.cn_remark }}</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</a-tab-pane>
										<a-tab-pane :key="3" :tab="data.lang == 'en' ? 'Other' : '其他'">
											<div class="row">
												<div class="col-12" v-if="item.tmp.options.finish && item.tmp.options.finish.length > 0">
													<div class="process-field-section">
														<div class="title">{{ data.lang == 'en' ? 'Remark' : '备注' }}</div>
														<a-textarea :placeholder="data.lang == 'en' ? 'Please enter here' : '请在此处输入'" v-model:value="item.choose.remark"></a-textarea>
													</div>
												</div>
											</div>
										</a-tab-pane>
									</a-tabs>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-7 col-12">
					<div v-if="data.lang == 'en'" style="height: 100%">
						<div class="quote-upload-bar" style="height: 100%" :class="data.uploadBar.dragging == true ? 'dragover' : ''" v-if="!data.uploadBar.uploading">
							<div class="upload-tip-content" @click="openFileInput" draggable="true" @dragover.prevent="handleDragOver" @drop.prevent="handleDrop">
								<img class="up-icon" src="@/assets/images/CodiconCloudUpload.svg" />
								<div class="up-heading">
									<span>
										<a class="browse">Upload Files</a>
										or Drag and Drop Here
									</span>
								</div>
								<div class="up-sub-heading">You can upload multiple files at once</div>
								<div class="up-suffix">Instant Quote: STEP, STP, STL, OBJ</div>
								<div class="up-suffix">Manual Quote: DWS, DWF, DWG, PDF, SLDPRT, SAT, 3DXML, 3MF, PRT, IPT, CATPART, X_T, PTC, X_B, DXF</div>
								<input type="file" ref="fileInput" multiple style="display: none" @change="handleFileInput" />
							</div>
						</div>
					</div>
					<div v-else style="height: 100%">
						<div class="quote-upload-bar" style="height: 100%" :class="data.uploadBar.dragging == true ? 'dragover' : ''" v-if="!data.uploadBar.uploading">
							<div class="upload-tip-content" @click="openFileInput" draggable="true" @dragover.prevent="handleDragOver" @drop.prevent="handleDrop">
								<img class="up-icon" src="@/assets/images/CodiconCloudUpload.svg" />
								<div class="up-heading">
									<span>
										<a class="browse">上传文件</a>
										或拖放到这里
									</span>
								</div>
								<div class="up-sub-heading">您可以一次上传多个文件</div>
								<div class="up-suffix">即时报价：STEP, STP, STL, OBJ</div>
								<div class="up-suffix">手动报价：DWS, DWF, DWG, PDF, SLDPRT, SAT, 3DXML, 3MF, PRT, IPT, CATPART, X_T, PTC, X_B, DXF</div>
								<input type="file" ref="fileInput" multiple style="display: none" @change="handleFileInput" />
							</div>
						</div>
					</div>
					<div class="progress-content" v-if="data.uploadBar.uploading">
						<h3 class="progress-text">{{ data.uploadBar.progress }}%</h3>
						<div>
							<a-progress
								:stroke-color="{
									'0%': '#3080e3',
									'100%': '#87d068',
								}"
								:percent="data.uploadBar.progress" />
						</div>
					</div>
				</div>
				<div class="col-lg-5 col-12">
					<div class="order-section">
						<div class="section-lines">
							<div class="line">
								<span class="title">{{ data.lang == 'en' ? 'Parts/Pcs' : '项目/零件' }}</span>
								<span class="value">{{ data.main.parts }} parts / {{ data.main.totalQuantity }} pcs</span>
							</div>
							<div class="line">
								<span class="title">{{ data.lang == 'en' ? 'Estimated delivery time' : '预计发货周期' }}</span>
								<span class="value">{{ data.lang == 'en' ? '3 business days' : '3个工作日' }}</span>
							</div>
							<div class="line">
								<span class="title">{{ data.lang == 'en' ? 'Shipping cost' : '运费' }}</span>
								<span class="value price">￥{{ data.main.shippingCost }}</span>
							</div>
							<div class="line">
								<span class="title">{{ data.lang == 'en' ? 'Total(Inc VAT)' : '总计（含税）' }}</span>
								<span class="value price">￥{{ (parseFloat(data.main.partsTotalPrice) + parseFloat(data.main.shippingCost)).toFixed(2) }}</span>
							</div>
							<div v-if="!data.main.isWaitingReview">
								<div class="line button-line" v-if="data.main.technology == 2">
									<div class="group">
										<a-button :disabled="data.main.processBtnDisabled" :loading="data.main.processBtnLoading" @click="createOrder(2.1)">
											{{ data.lang == 'en' ? 'Manual Review' : '提交人工审核' }}
										</a-button>
										<p class="tip">{{ data.lang == 'en' ? 'Price does not meet expectations' : '价格不符合预期' }}</p>
									</div>
									<div class="group">
										<a-button type="primary" :disabled="data.main.processBtnDisabled" :loading="data.main.processBtnLoading" @click="createOrder(2)">
											{{ data.lang == 'en' ? 'Place order now' : '立即下单' }}
										</a-button>
										<p class="tip">{{ data.lang == 'en' ? 'Price is appropriate' : '价格合适' }}</p>
									</div>
								</div>
								<div class="line button-line" v-else>
									<a-button type="primary" :disabled="data.main.processBtnDisabled" :loading="data.main.processBtnLoading" @click="createOrder(1)">
										{{ data.lang == 'en' ? 'Place order now' : '立即下单' }}
									</a-button>
								</div>
							</div>
							<div v-else class="line">
								<div class="mk-message info">
									<span>{{ data.lang == 'en' ? 'Order is locked' : '订单已锁定' }}</span>
									<a-button :loading="data.main.processBtnLoading" @click="createOrder(2.1)" style="margin-left: 16px">
										{{ data.lang == 'en' ? 'Check review progress' : '查看审核进度' }}
									</a-button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<a-modal v-model:open="data.viewer.visit" class="npad-modal" :width="data.viewer.width" :title="false" :footer="false" @cancel="viewerCancel">
		<iframe width="100%" height="500px" :src="data.viewer.url" frameborder="0"></iframe>
	</a-modal>
	<a-modal width="60%" v-model:open="data.article.visit" class="npad-modal" :title="false" :footer="false" @cancel="viewerCancel">
		<div class="material-content" v-html="data.article.content"></div>
	</a-modal>
</template>
<script setup>
	import { ref, onBeforeMount, h } from 'vue'
	import iconJgsj from '@/assets/images/quote-jgsj-icon.png'
	import icon3d from '@/assets/images/quote-3d-icon.png'
	import iconCnc from '@/assets/images/quote-cnc-icon.png'
	import iconMold from '@/assets/images/quote-mold-icon.png'
	import { message, notification } from 'ant-design-vue'
	import { CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue'
	import { createQuoteApi, getAttributeApi, getOrerinfoApi, getQuoteItemsApi, shippingCostApi, setQuoteQuantityApi, createOrderApi } from '@/api/quote'
	import { analysisApi, saveItemAttrApi } from '@/api/py-occ'
	import router from '@/router'
	import '@/assets/css/items.scss'
	import { resolveStaticUrl } from '@/utils/url'
	const data = ref({
		fileHash: [],
		lang: localStorage.getItem('lang') || 'zh',
		main: {
			quoteNo: '',
			quoteInfo: {},
			audit_status: 0,
			source: [],
			fileList: [],
			itemLoading: false,
			attributes: [],
			defaultAttributes: [],
			allChecked: false,
			deleteLoading: false,
			parts: 0,
			totalQuantity: 0,
			partsTotalPrice: '0.00',
			shippingCost: '0.00',
			processBtnLoading: false,
			isWaitingReview: false,
		},
		viewer: {
			width: '850px',
			visit: false,
			url: '',
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
				surface: {
					info: undefined,
					material: undefined,
					film: undefined,
				},
			},
		},
		waitAnalyzeFile: [],
		article: {
			visit: false,
			title: '',
			content: '',
		},
	})
	const uuid = window.localStorage.getItem('uuid')
	// 工艺选项
	const technologyOptions = ref([
		{
			id: 3,
			cn_name: '结构设计',
			en_name: '',
			icon: iconJgsj,
			is_checked: false,
		},
		{
			id: 1,
			cn_name: '3D打印',
			en_name: '',
			icon: icon3d,
			is_checked: true,
		},
		{
			id: 2,
			cn_name: 'CNC加工',
			en_name: '',
			icon: iconCnc,
			is_checked: false,
		},
		{
			id: 4,
			cn_name: '注塑成型',
			en_name: '',
			icon: iconMold,
			is_checked: false,
		},
	])
	// quote items
	const getQuoteItems = () => {
		data.value.main.itemLoading = true
		const id = data.value.main.quoteNo
		getQuoteItemsApi(id, {})
			.then((response) => {
				if (response.code === 0) {
					data.value.main.quoteInfo = response.data
					if (data.value.main.technology != response.data.technology) {
						data.value.main.technology = response.data.technology
					}
					data.value.main.source = response.data.items
					data.value.main.source.forEach((item) => {
						var defaultObj = JSON.parse(JSON.stringify(data.value.defaultObj))
						item.is_checked = Number(item.is_checked) == 1 ? true : false
						item.isExpanded = false
						item.boxHeight = 0
						item.activeKey = 1
						item = Object.assign(item, defaultObj)
						if (item.attribute != undefined) {
							if (item.attribute.process != undefined) {
								item.choose.process = item.attribute.process.value
							}
							if (item.attribute.material != undefined) {
								item.choose.material = item.attribute.material.value
							}
							if (item.attribute.finish != undefined) {
								item.choose.finish = item.attribute.finish.value
							}
							if (item.attribute.precision != undefined) {
								item.choose.precision = item.attribute.precision.value
							}
							if (item.attribute.color != undefined) {
								item.choose.color = item.attribute.color.value
							}
							if (item.attribute.remarks != undefined) {
								item.choose.remarks = item.attribute.remarks
							}
							if (item.attribute.surface != undefined) {
								if (item.attribute.surface.info != undefined) {
									item.choose.surface.info = item.attribute.surface.info.value
								}
								if (item.attribute.surface.material != undefined) {
									item.choose.surface.material = item.attribute.surface.material.value
								}
								if (item.attribute.surface.film != undefined) {
									item.choose.surface.film = item.attribute.surface.film.value
								}
							}
						}
						item.tmp = {
							options: item.options,
							choose: item.choose,
						}
						var attribute = getAttributeOptions(item, data.value.main.quoteInfo.technology, false)
						item.attribute = item.attribute ? item.attribute : attribute
						// 判断是否分析过
						if (item.is_analyze == 0) {
							addWaitAnalyzeItemFile(item)
						}
					})
					calculateFreight()
				}
			})
			.finally(() => {
				data.value.main.itemLoading = false
			})
	}
	const debounce = (func, wait) => {
		let timeout
		return function (...args) {
			clearTimeout(timeout)
			timeout = setTimeout(() => func.apply(this, args), wait)
		}
	}
	// 计算运费
	const calculateFreight = () => {
		debounceWeightCost()
	}
	const debounceWeightCost = debounce(function () {
		shippingCostApi({ quote_no: data.value.main.quoteNo }).then((response) => {
			if (response.code == 0) {
				data.value.main.shippingCost = Number(response.data.shipping_cost).toFixed(2)
				data.value.main.parts = data.value.main.source.length
				var total = 0
				var totalPrice = 0
				data.value.main.source.filter((item) => {
					total += item.quantity
					totalPrice += parseFloat(item.price) * parseInt(item.quantity)
				})
				data.value.main.totalQuantity = total
				data.value.main.partsTotalPrice = totalPrice.toFixed(2)
			}
		})
	}, 500)
	// 选择工艺
	const handleQuoteItemClick = (item) => {
		technologyOptions.value.forEach((item) => {
			item.is_checked = false
		})
		item.is_checked = !item.is_checked
		data.value.main.technology = item.id
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
			message.info(data.value.lang == 'en' ? 'Only 20 files can be uploaded at a time.' : '一次只能上传20个文件')
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
			if (data.value.lang === 'en') {
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
		if (data.value.main.quoteNo == '') {
			var payload = {
				uuid: uuid,
				technology: data.value.main.technology,
			}
			data.value.uploadBar.message = data.value.lang == 'en' ? 'Creating quote...' : '创建报价中...'
			await createQuote(payload)
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
			obj.tmp = JSON.parse(JSON.stringify(data.value.defaultObj))
			obj.attribute = getAttributeOptions(obj.tmp, data.value.main.technology, true)
			obj.options = obj.tmp.options
			obj.choose = obj.tmp.choose
			data.value.main.source.unshift(obj)
		})

		await uploadFileOnce(okFiles)
		// 把所有上传完成的文件加入到待分析队列
		data.value.main.source.forEach((item) => {
			if (item.is_analyze == 0) {
				addWaitAnalyzeItemFile(item)
			}
		})

		// console.log('文件上传完成')
		// 移除beforeunload事件监听器
		window.removeEventListener('beforeunload', handleBeforeUnload)

		// 清理
		data.value.uploadBar.uploading = false
		data.value.fileHash = []
	}
	// 分析文件
	const addWaitAnalyzeItemFile = (item) => {
		item.loading = true
		data.value.waitAnalyzeFile.push(item)
		processAnalyzeQueue()
	}
	let isProcessingQueue = false
	const processAnalyzeQueue = async () => {
		if (isProcessingQueue) return // 如果队列正在处理，直接返回

		isProcessingQueue = true
		data.value.main.processBtnDisabled = true

		while (data.value.waitAnalyzeFile.length > 0) {
			const item = data.value.waitAnalyzeFile.shift() // 从队列中取出第一个文件
			await analyzeFile(item).then((response) => {
				if (response.code === 0) {
					// 合并
					Object.assign(item, response.data)
					item.message = 'File analysis completed'
					if (!Array.isArray(item.messages)) {
						item.messages = []
					}

					// Override item.messages with reports if available
					if (response.data.reports) {
						item.messages = response.data.reports
					}
					// Add translation message to the beginning of messages array
					item.messages.unshift({
						zh: '分析完成',
						en: 'Analysis completed',
					})
					calculateFreight()
				} else {
					item.message = data.value.lang == 'en' ? 'Analysis failed' : '分析失败'
					item.messages = response.data.reports
				}
				item.is_manual_quote = response.data.is_manual_quote
			})
		}
		data.value.main.processBtnDisabled = false
		isProcessingQueue = false
	}

	const analyzeFile = async (item) => {
		return new Promise((resolve) => {
			analysisApi({ file_hash: item.hash })
				.then((response) => {
					resolve(response)
				})
				.finally(() => {
					item.loading = false
				})
		})
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
					data.value.uploadBar.message = data.value.lang === 'en' ? 'Successfully' : '上传完成'
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
		await createQuoteApi(payload)
			.then((result) => {
				data.value.main.quoteNo = result.data.quote_no
			})
			.catch((err) => {})
			.finally(() => {
				data.value.uploadBar.loading = false
			})
	}
	const getOrderInfo = () => {
		getOrerinfoApi({ quote_no: data.value.main.quoteNo })
			.then((response) => {
				if (response.code == 0) {
					// 锁定订单不允许更改
					if (response.data.order_status != undefined && response.data.order_status != 0) {
						data.value.main.isWaitingReview = true
					}
					getQuoteItems()
				} else if (response.code == 401) {
					$cookies.remove('authorization')
					$cookies.remove('member')
					window.localStorage.removeItem('authorization')
					window.localStorage.removeItem('uuid')
					window.localStorage.removeItem('member')
					function uuid() {
						return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
							var r = (Math.random() * 16) | 0,
								v = c == 'x' ? r : (r & 0x3) | 0x8
							return v.toString(16)
						})
					}
					window.localStorage.setItem('uuid', uuid())
					getQuoteItems()
				} else {
				}
			})
			.finally(() => {
				data.value.loading = false
			})
	}
	// 创建订单
	const createOrder = (type) => {
		var attr = getAttributeOptions({ options: {}, choose: {} }, data.value.main.quoteInfo.technology)
		data.value.main.processBtnLoading = true
		var payload = {
			lang: data.value.lang,
			quote_no: data.value.main.quoteNo,
			order_name: attr?.process?.label,
		}
		if (type == 2.1) {
			payload.process = 'cnc'
		}
		var headers = {
			'Content-Type': 'application/json',
			Authorization: localStorage.getItem('authorization'),
		}
		createOrderApi(payload)
			.then((response) => {
				if (response.code == 0) {
					if (type == 1 || type == 2) {
						window.location.href = '/' + data.value.lang + '/space/checkout/' + response.data.order_no
					} else {
						window.location.href = '/' + data.value.lang + '/space/review/' + response.data.order_no
					}
				} else {
					if (response.code == 401) {
						var notificationKey = password(5)
						notification.open({
							message: data.value.lang == 'en' ? 'Tips' : '提示',
							description: data.value.lang == 'en' ? 'You need to log in to place an order and get a quotation.' : '需要登录之后才能提交订单，并获取报价',
							placement: 'topRight',
							duration: 0,
							key: notificationKey,
							btn: () =>
								h(
									'button',
									{
										class: 'btn btn-primary',
										onClick: () => {
											notification.close(notificationKey)
											window.location.href = '/' + window.lang + '/signin?redirect=' + encodeURIComponent(window.location.pathname)
										},
									},
									{ default: () => (data.value.lang == 'en' ? 'Login' : '登录') },
								),
						})
					} else {
						message.error(response.msg)
					}
				}
			})
			.finally(() => {
				data.value.main.processBtnLoading = false
			})
	}
	// 获取工艺材料属性
	const getAttributeOptions = (obj, process, type) => {
		obj.choose.process = obj.choose.process == undefined ? process : obj.choose.process
		// 过滤和映射属性函数
		const filterAndMapAttributes = (type, process) =>
			data.value.main.attributes
				.filter((item) => item.type === type && item.process === process)
				.map((item) => {
					var r = item
					r.label = item.en_name + ' ' + item.cn_name
					r.value = item.id
					return r
				})

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
			.map((item) => {
				var r = item
				r.label = item.en_name + ' ' + item.cn_name
				r.value = item.id
				return r
			})
		if (!type) {
			if (colors.length > 0) {
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
				options: surface.map((item) => ({ value: item.id, label: data.value.lang == 'en' ? item.en_name : item.cn_name })),
				material: [],
				film: [],
				remark: '',
			}

			if (obj.choose.surface?.info) {
				const selectedSurface = surface.find((item) => item.id === obj.choose.surface.info)
				if (selectedSurface) {
					obj.options.surface.remark = data.value.lang == 'en' ? selectedSurface.en_remark : selectedSurface.cn_remark
					obj.options.surface.material = selectedSurface.items.map((item) => ({
						value: item.id,
						label: data.value.lang == 'en' ? item.en_name : item.cn_name,
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
				return item ? { label: data.value.lang == 'en' ? item.en_name : item.cn_name, value: item.id } : undefined
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
					var obj = JSON.parse(JSON.stringify(data.value.defaultObj))
					data.value.main.defaultAttributes = getAttributeOptions(obj, data.value.main.technology)
				}
			})
			.finally(() => {
				data.value.main.quoteNo = router.currentRoute.value.query.quoteNo
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
	const categoriesChange = (item, action, type) => {
		type = type == undefined ? true : type
		item.tmp.options.material = []
		item.tmp.options.finish = []
		item.tmp.options.precision = []
		item.tmp.options.color = []
		item.tmp.options.surface = null
		item.tmp.choose.surface = {
			info: undefined,
			material: undefined,
			film: undefined,
		}
		if (action == 'process') {
			item.tmp.choose.material = undefined
			item.tmp.choose.finish = undefined
			item.tmp.choose.precision = undefined
			item.tmp.choose.color = undefined
			item.tmp.choose.surface = undefined
		} else if (action == 'material') {
			item.tmp.choose.finish = undefined
			item.tmp.choose.color = undefined
		}
		if (type) {
			getAttributeOptions(item.tmp, data.value.main.quoteInfo.technology, false)
		}
	}
	// save
	const saveItemAttr = (item) => {
		var attribute = getAttributeOptions(item.tmp, data.value.main.quoteInfo.technology)
		item.saveLoading = true
		item.loading = true
		var payload = {
			file_id: item.id,
			attribute: attribute,
		}
		saveItemAttrApi(payload)
			.then((response) => {
				if (response.code == 0) {
					item.choose = item.tmp.choose
					item.options = item.tmp.options
					item.attribute = attribute
					addWaitAnalyzeItemFile(item)
				}
			})
			.finally(() => {
				item.saveLoading = false
				item.loading = false
			})
	}
	// quantity
	const setQuantity = (item, type) => {
		if (data.value.main.isWaitingReview) {
			return
		}
		item.priceLoading = true
		if (type == 'setinc') {
			item.quantity += 1
		} else {
			if (item.quantity > 1) {
				item.quantity -= 1
			} else {
				message.info(data.value.lang == 'en' ? 'Quantity must be greater than 0.' : '数量必须大于0')
			}
		}
		debouncedQuantityChange(item)
	}
	const quantityChange = (item) => {
		item.priceLoading = true
		setQuoteQuantityApi(item.hash, { quantity: item.quantity })
			.then((response) => {
				if (response.code === 0) {
					addWaitAnalyzeItemFile(item)
				}
			})
			.finally(() => {
				item.priceLoading = false
			})
	}
	const debouncedQuantityChange = debounce(quantityChange, 500)

	const handleBeforeUnload = (event) => {
		event.preventDefault()
		event.returnValue = '' // 某些浏览器需要这样设置
	}
	// close model preview
	const viewerCancel = () => {
		data.value.viewer.url = ''
	}
	const showItemArticleModal = (item) => {
		data.value.article.content = !item.content ? '<p>No content...</p>' : item.content
		data.value.article.visit = true
	}
	// 模型预览
	const showPreviewModal = (item) => {
		data.value.viewer.width = window.innerWidth > 1200 ? '800px' : window.innerWidth + 'px'
		data.value.viewer.url = '/' + data.value.lang + '/space/view?path=' + encodeURIComponent(resolveStaticUrl(item.path))
		data.value.viewer.visit = true
	}
	const chooseOption = (item, category, value) => {
		switch (category) {
			case 'material':
				if (item.choose.material == value) {
					return
				}
				categoriesChange(item, 'material', false)
				item.choose.material = value
				break
			case 'finish':
				if (item.choose.finish == value) {
					return
				}
				item.choose.finish = value
				break
			case 'surface':
				if (item.choose.surface.info == value) {
					return
				}
				categoriesChange(item, 'surface', false)
				item.choose.surface.info = value
				break
			case 'precision':
				if (item.choose.precision == value) {
					return
				}
				item.choose.precision = value
				break
			case 'color':
				if (item.choose.color == value) {
					return
				}
				item.choose.color = value
				break
			default:
				break
		}

		saveItemAttr(item)
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
	onBeforeMount(() => {
		getAttribute()
		window.addEventListener('popstate', function (event) {
			location.reload()
		})
	})
</script>
