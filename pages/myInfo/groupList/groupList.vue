<template>
	<view>
		<!-- 顶部栏 -->
		<u-navbar :is-back="false" title="分享列表组">
			<view class="">
				<u-icon @click="back" name="arrow-left" size="40" style="margin-left: 20rpx;"></u-icon>
			</view>
			<view slot="right">
				<text style="margin-right: 30rpx;color: #ea625b;" @click="isPopupShow=true">操作</text>
				<!-- <u-icon @click="isPopupShow=true" name="more-dot-fill" size="50" style="margin-right: 30rpx;color: #ea625b;"></u-icon> -->
			</view>
		</u-navbar>
		<!-- 下拉菜单 -->
		<u-dropdown border-bottom ref="uDropdown">
			<u-dropdown-item @change='dropTypeChange' v-model="dropdownData.type" title="分组类型" :options="dropdownData.gropTypeList"></u-dropdown-item>
			<u-dropdown-item @change='dropSortChange' v-model="dropdownData.sortItem" title="排序" :options="dropdownData.sortItemList"></u-dropdown-item>
		</u-dropdown>
		<!-- 侧边弹出层 -->
		<u-popup v-model="isPopupShow" mode='right' length="70%">
			<view class="popup" :style="'padding-top:'+statusBarHeight+'rpx;'">
				<u-divider color="rgb(41, 121, 255)" half-width="200" border-color="rgb(41, 121, 255)" fontSize='35' style="padding: 20rpx 0;">分组列表
					(向右滑动操作)</u-divider>
				<view class="slideList" :style="'height:calc(100vh - 100rpx - '+statusBarHeight+'rpx);'">

					<m-slide-list ref='slideList' :list="dropdownData.gropTypeList" :button="buttonList" :border="true" @click="clickMethod"
					 @change="changeMethod"></m-slide-list>
				</view>

				<view class="btn">
					<u-button class='u-button' type="primary" @click="addGropTypeList">添加</u-button>
					<!-- <u-button class='u-button' type="primary">主要按钮</u-button> -->

				</view>

			</view>
		</u-popup>

		<!-- 列表,还有上边的具体样式后面调 -->

		<myList :myList='myList' @listClick='listClick($event)'></myList>
		<div v-if='!dropdownData.type' style='width: 100%;text-align: center;margin-top: 50rpx;'>请先选择分组类型</div>
		<div v-else-if='!myList.length' style='width: 100%;text-align: center;margin-top: 50rpx;'>没有数据</div>

		<u-toast ref="uToast" />
		<u-modal v-model="isModalShow" show-cancel-button @confirm="addGropTypeConfirm" :content="'填写增加类别名称'">
			<u-field required v-model="gropTypeName" label="类别名称" placeholder="请填写类别名称">
			</u-field>
		</u-modal>
	</view>
</template>

<script>
	import {
		getGropType,
		delGropType,
		addGropType,
		getGropList
	} from '@/common/util/API.js'
	import mSlideList from '@/components/mark-slide-list/mark-slide-list.vue'
	import myList from '@/components/myList/myList.vue'
	import {
		dateFormat
	} from '@/common/util/date.js'
	import addYS from '@/common/util/addYS.js'

	export default {
		components: {
			mSlideList,
			myList
		},
		data() {
			return {
				// #ifdef MP-WEIXIN
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight + 88,
				// #endif
				// #ifndef MP-WEIXIN
				statusBarHeight: 0,
				// #endif
				buttonList: [{
						title: '分享',
						background: '#c4c7cd'
					},
					{
						title: '删除',
						background: '#ff3b32'
					}
				],
				isPopupShow: false,
				dropdownData: {
					type: '',
					sortItem: 'time-desc',
					gropTypeList: [],
					sortItemList: [{
							label: '创建时间 - 降序',
							value: 'time-desc',
						},
						{
							label: '创建时间 - 升序',
							value: 'time-asc',
						},
						{
							label: '价格 - 降序',
							value: 'price-desc',
						},
						{
							label: '价格 - 升序',
							value: 'price-asc',
						},
					]
				},
				isModalShow: false,
				gropTypeName: '',
				myList: []


			}
		},
		async onLoad() {
			// 获取分组类型列表
			getGropType().then(res => {
				if (res[1].data.length) {
					this.dropdownData.gropTypeList = res[1].data.map(i => ({
						...i,
						slide_x: 0
					}))
				}
				console.log('grop res', res, this.dropdownData.gropTypeList)
			}).catch(err => {
				console.log('获取分组错误', err)
			})

		},
		computed: {
			// statusBarHeight(){
			// 	return uni.getSystemInfoSync().statusBarHeight
			// }
		},
		methods: {
			listClick(e) {
				console.log('e', e)
			},
			back() {
				uni.switchTab({
					url: '/pages/myInfo/myInfo'
				});
			},
			dropTypeChange(e) {
				console.log('e', e)
				// 在这里获取分组对应数据
				getGropList(this.dropdownData.sortItem, e).then(res => {
					console.log('getGropLIst', res)
					this.myList = res[1].data.map(i => ({
						...i,
						itemTags: i.itemTags.split(','),
						itemShowImg: addYS(i.itemShowImg)
					}))
				}).catch(err => {
					console.log('err', err)
					this.$refs.uToast.show({
						title: '获取分组列表失败',
						duration: 700,
						type: 'error'
					})
				})
			},
			dropSortChange() {

			},
			changeMethod(e, {
				title
			}) {
				console.log('e', e, title)
				if (title === this.buttonList[1].title) {
					console.log('删除')
					delGropType(e.id).then(res => {
						if (res[1].data.affectedRows !== 0) {
							this.$refs.uToast.show({
								title: '删除成功',
								duration: 700,
								type: 'success',
								callback: () => {
									const index = this.dropdownData.gropTypeList.findIndex(i => i.id === e.id)
									this.dropdownData.gropTypeList.splice(index, 1)
									this.$refs.slideList.TherGropTypeList(e.id, 'del')
								}
							})
						} else {
							this.$refs.uToast.show({
								title: '删除失败',
								duration: 700,
								type: 'error'
							})
						}
					}).catch(err => {
						console.log('删除错误', err)
						this.$refs.uToast.show({
							title: '删除失败' + err,
							duration: 700,
							type: 'error'
						})
					})
				}
			},
			addGropTypeList() {
				// 点击添加列表按钮
				this.isModalShow = true
			},
			addGropTypeConfirm() {
				// 添加
				if (this.gropTypeName) {
					let data = {
						value: this.gropTypeName,
						label: this.gropTypeName
					}
					//上传时间
					data.createDate = dateFormat('YYYY-mm-dd HH:MM:SS', new Date())

					addGropType(data).then(res => {
						console.log('res', res)
						if (res[1].data.isScuccess) {
							console.log('上传成功')
							this.$refs.uToast.show({
								title: '添加成功',
								duration: 700,
								type: 'success',
								callback: () => {
									this.dropdownData.gropTypeList.splice(0, 0, data)
									this.$refs.slideList.TherGropTypeList({ ...data,
										slide_x: 0,
										id: res[1].data.insertId
									}, 'add')
								}
							})
						} else {
							this.$refs.uToast.show({
								title: '添加失败',
								duration: 700,
								type: 'error'
							})
						}
					}).catch(err => {
						this.$refs.uToast.show({
							title: '添加失败' + err,
							duration: 700,
							type: 'error'
						})

					})
				} else {
					this.isModalShow = true
					this.$refs.uToast.show({
						title: '请填写名称',
						duration: 700,
						type: 'warning'
					})

				}
			}
		}
	}
</script>

<style lang="scss">
	.u-swipe-action {
		.item {
			padding: 30rpx 0;
		}

		.title {
			text-align: center;
			font-size: 28rpx;
			color: $u-content-color;
		}

	}

	// .u-dropdown ::v-deep .u-dropdown__content{
	// 	height: calc(100vh - 80rpx - 98rpx);
	// }
	.popup {
		.slideList {
			// height: calc(100vh - 180rpx);
			overflow-y: scroll;
		}

		.btn {
			display: flex;
			position: absolute;
			width: 100%;
			bottom: 0rpx;

			.u-button {
				flex: 1;
			}
		}
	}
</style>
