<template>
	<view>
		<!-- 顶部栏 -->
		<u-navbar :is-back="false" title="我的收藏">
			<view class="">
				<u-icon @click="back" name="arrow-left" size="40" style="margin-left: 20rpx;"></u-icon>
			</view>
			<view slot="right">
				<!-- <u-icon @click="isPopupShow=true" name="more-dot-fill" size="50" style="margin-right: 30rpx;"></u-icon> -->
				<text style="margin-right: 30rpx;color: #ea625b;" @click="clickManage">{{isClickManage?'完成':'管理'}}</text>
			</view>
		</u-navbar>
		<!-- 侧边弹出层 -->
		<!-- <u-popup v-model="isPopupShow" mode='right'>
					<view>出淤泥而不染，濯清涟而不妖</view>
				</u-popup> -->
		<!-- 轮播图 -->
		<!-- <view style="margin: 30rpx;">
			<u-swiper :list="spImg" title :effect3d="true"></u-swiper>
		</view> -->
		<!-- 下拉菜单 -->
		<u-dropdown border-bottom ref="uDropdown">
			<u-dropdown-item @change='dropTypeChange' v-model="dropdownData.type" title="类别" :options="dropdownData.typeList"></u-dropdown-item>
			<u-dropdown-item @change='dropSortChange' v-model="dropdownData.sortItem" title="排序" :options="dropdownData.sortItemList"></u-dropdown-item>
			<u-dropdown-item title="标签">
				<view class="slot-content">
					<view class="item-box">
						<view class="item" :class="[item.active ? 'active' : '']" @tap="tagClick(index)" v-for="(item, index) in dropdownData.tagList"
						 :key="index">
							{{item.label}}
						</view>
					</view>
					<u-button type="primary" @click="closeDropdown">确定</u-button>
				</view>
			</u-dropdown-item>
		</u-dropdown>
		<!-- 列表,还有上边的具体样式后面调 -->
		<myList inCollect :myList='myList' :isClickManage='isClickManage' ref='myList'></myList>
		<!-- 底线 -->
		<view style="margin: 15rpx 0;">
			<u-divider>没有更多了</u-divider>
		</view>
		<!-- 弹出操作栏 -->
		<u-action-sheet @click="actionSheet" :list="handleItemData.handleItemList" v-model="handleItemData.handleItemShow"></u-action-sheet>

		<u-toast ref="uToast" />
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="iconStyle"></u-back-top>

		<!-- 弹出框 -->
		<!-- <u-modal v-model="showModal" show-cancel-button mask-close-able :title="'选择加入的分组'" :content="'选择加入的分组'" @confirm="modalConfirm">
			<view class="">
				<u-input v-model="JoinGropNames" :type="'select'" border @click="isShowJoinGrop = true" />
				<u-action-sheet :list="gropTypeList" v-model="isShowJoinGrop" @click="actionSheetCallback"></u-action-sheet>
			</view>
		</u-modal> -->
	</view>
</template>

<script>
	import myList from '@/components/myList/myList.vue'
	import {
		getSwiper,
		getMyList,
		getItemType,
		getMyListFromType,
		getMyListFromSort,
		delItems,
		getGropType,
		joinGrops,
		getCollectList,
		delCollectItem
	} from '@/common/util/API.js'
	import addYS from '@/common/util/addYS.js'
	import {
		userId
	} from '@/common/util/utils.js'

	export default {
		components: {
			myList
		},
		data() {
			return {
				// showModal: false,
				// isShowJoinGrop: false,
				// JoinGropNames: '',
				// gropTypeList: [],
				chooseIds: [],
				// isPopupShow:false,
				// spImg: [],
				isClickManage: false, //右上角管理按钮点击,初始false为管理
				myList: [],
				firstMyList: [],
				scrollTop: 0,
				iconStyle: {
					fontSize: '32rpx',
					color: 'rgb(41, 121, 255)',
				},
				dropdownData: {
					type: '全部',
					sortItem: 'time-desc',
					typeList: [],
					sortItemList: [
						// {
						// 	label: '默认',
						// 	value: 'default',
						// },
						{
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
					],
					tagList: [{
							label: '琪花瑶草',
							active: true,
						},
						{
							label: '清词丽句',
							active: false,
						},
						{
							label: '宛转蛾眉',
							active: false,
						},
						{
							label: '煦色韶光',
							active: false,
						},
						{
							label: '鱼沉雁落',
							active: false,
						},
						{
							label: '章台杨柳',
							active: false,
						},
						{
							label: '霞光万道',
							active: false,
						}
					],
					clickTagList: []

				},
				handleItemData: {
					handleItemShow: false,
					handleItemList: [
						// {
						// 	text: '删除',
						// 	color: 'red'
						// }, {
						// 	text: '加入分组'
						// }, {
						// 	text: '分享'
						// },
						{
							text: '取消收藏',
							color: 'red'
						}
					],
				},
			}
		},
		onLoad(option) {
			console.log('onload')
			// 获取分组类型列表
			const storage_gropType = JSON.parse(window.localStorage.getItem('gropType'))
			if (!storage_gropType) {
				getGropType().then(res => {
					if (res[1].data.length) {
						window.localStorage.setItem('gropType', JSON.stringify(res[1].data))
						this.gropTypeList = res[1].data.map(i => ({
							...i,
							text: i.value
						}))
					}
					console.log('grop res', res)
				}).catch(err => {
					console.log('获取分组错误', err)
				})
			} else {
				this.gropTypeList = storage_gropType.map(i => ({
					...i,
					text: i.value
				}))

			}

			//获取下拉数据
			getItemType().then(res => {
				this.dropdownData.typeList = [{
					value: '全部',
					label: '全部'
				}, ...res[1].data]
			}).catch(err => {
				console.log('获取下拉错误', err)
			})
			// 获取轮播数据
			// getSwiper().then(res => {
			// 	this.spImg = res[1].data
			// }).catch(err => {
			// 	console.log('获取轮播错误', err)
			// })

			// 获取列表
			getCollectList(userId()).then(res => {
				console.log('获取数据', res)
				this.myList = res[1].data.map(i => ({
					...i,
					itemTags: i.itemTags.split(','),
					itemShowImg: addYS(i.itemShowImg)
				}))
				this.firstMyList = JSON.parse(JSON.stringify(this.myList))
			}).catch(err => {
				console.log('获取轮播错误', err)
			})

			//添加数据后跳转过来
			// console.log('option',option)
			// if(option.data){
			// 	console.log('data11',JSON.parse(decodeURIComponent(option.data)))
			// 	this.myList=[option.data,...this.myList]
			// }

		},
		onShow() {
			// console.log('onshowiii')
			const valueStr = uni.getStorageSync('newItem')
			if (valueStr) {
				const value = JSON.parse(valueStr);
				value.itemTags = value.itemTags.split(',')
				this.myList.splice(0, 0, value)
				this.firstMyList.splice(0, 0, value)
				try {
					uni.setStorageSync('newItem', '');
				} catch (e) {
					console.log('置空本地数据失败', e)
				}
			}

			// try {
			// if (value) {
			// }
			// } catch (e) {
			// 	console.log('读取本地数据失败', e)
			// }
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		created() {},
		methods: {
			// actionSheetCallback(e) {
			// 	this.JoinGropNames = this.gropTypeList[e].label
			// },
			// modalConfirm() {
			// 	console.log('确定回调', this.chooseIds)
			// 	joinGrops(this.chooseIds, this.JoinGropNames).then(res => {
			// 		console.log('加入返回', res)
			// 		if (res[1].data.affectedRows > 0) {
			// 			this.$refs.uToast.show({
			// 				title: '修改成功',
			// 				duration: 700,
			// 				type: 'success',
			// 				callback: () => {
			// 					// this.$refs.myList.itemList = this.$refs.myList.itemList.filter(i => !i.isChoose)
			// 				}
			// 			})
			// 		} else {
			// 			this.$refs.uToast.show({
			// 				title: '修改失败',
			// 				duration: 700,
			// 				type: 'error'
			// 			})
			// 		}
			// 	}).catch(err => {
			// 		console.log('加入失败', err)
			// 		this.$refs.uToast.show({
			// 			title: '修改失败' + err,
			// 			duration: 700,
			// 			type: 'error'
			// 		})
			// 	})
			// },
			back() {
				uni.switchTab({
					url: '/pages/myInfo/myInfo'
				});
			},
			clickManage() {
				if (this.isClickManage && this.$refs.myList.itemList.find(i => i.isChoose)) {
					console.log('选择操作', this.$refs.myList.itemList)
					this.handleItemData.handleItemShow = true

				} else {
					// this.isClickManage = !this.isClickManage
				}
				this.isClickManage = !this.isClickManage
			},
			actionSheet(i) {
				console.log('点击了', i)
				const choose = this.$refs.myList.itemList.filter(i => i.isChoose)
				this.chooseIds = choose.map(i => i.id)
				switch (i) {
					// case 0:
					// 	// 批量删除
					// 	delItems(this.chooseIds).then(res => {
					// 		console.log('delItems res', res)
					// 		if (res[1].data.affectedRows !== 0) {
					// 			this.$refs.uToast.show({
					// 				title: '删除成功',
					// 				duration: 700,
					// 				type: 'success',
					// 				callback: () => {
					// 					this.$refs.myList.itemList = this.$refs.myList.itemList.filter(i => !i.isChoose)
					// 				}
					// 			})
					// 		} else {
					// 			this.$refs.uToast.show({
					// 				title: '删除失败',
					// 				duration: 700,
					// 				type: 'error'
					// 			})
					// 		}
					// 	}).catch(err => {
					// 		console.log('批量删除错误', err)
					// 		this.$refs.uToast.show({
					// 			title: '删除失败' + err,
					// 			duration: 700,
					// 			type: 'error'
					// 		})
					// 	})

					// 	break;

					// case 1:
					// 	console.log('点击批量分享')
					// 	this.showModal = true
					// 	break;
					case 0:
						console.log('点击删除收藏')
						// this.showModal = true
						delCollectItem(this.chooseIds, userId()).then(res => {
							console.log('取消收藏res', res)
							if (res[1].data.affectedRows > 0) {
								this.$refs.uToast.show({
									title: '取消收藏成功',
									duration: 700,
									type: 'success',
									callback: () => {
										this.$refs.myList.itemList = this.$refs.myList.itemList.filter(i => !i.isChoose)
									}
								})
							} else {
								this.$refs.uToast.show({
									title: '取消收藏失败',
									duration: 700,
									type: 'error'
								})
							}
						}).catch(err => {
							console.log('取消收藏错误返回', err)
							this.$refs.uToast.show({
								title: '取消收藏失败' + err,
								duration: 700,
								type: 'error'
							})
						})

						break;
					default:
						break;
				}


			},
			// more(){
			// 	console.log('更多')
			// },
			tagClick(index) {
				this.dropdownData.tagList[index].active = !this.dropdownData.tagList[index].active;
				this.dropdownData.clickTagList = [...this.dropdownData.tagList.filter(i => i.active)]
			},
			closeDropdown(e) {
				// console.log('点击标签', this.dropdownData.clickTagList)
				this.$refs.uDropdown.close();
			},
			//点击类别
			dropTypeChange(e) {
				console.log('类别', e)
				if (e === '全部' && this.dropdownData.sortItem === 'time-desc') {
					this.myList = this.firstMyList
				} else {
					getMyListFromType(e, this.dropdownData.sortItem).then(res => {
						// console.log('res', res)
						this.myList = res[1].data.map(i => ({
							...i,
							itemTags: i.itemTags.split(','),
							itemShowImg: addYS(i.itemShowImg)
						}))
					})

				}
			},
			//点击排序
			dropSortChange(e) {
				console.log('排序', e)
				if (e === 'time-desc' && this.dropdownData.type === '全部') {
					this.myList = this.firstMyList
				} else {
					getMyListFromSort(e, this.dropdownData.type).then(res => {
						// console.log('res',res)
						this.myList = res[1].data.map(i => ({
							...i,
							itemTags: i.itemTags.split(','),
							itemShowImg: addYS(i.itemShowImg)
						}))
					})
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.u-back-top {
		// background-color: rgb(160, 207, 255)
	}

	.slot-content {
		background-color: #FFFFFF;
		padding: 24rpx;

		.item-box {
			margin-bottom: 50rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.item {
				border: 1px solid $u-type-primary;
				color: $u-type-primary;
				padding: 8rpx 40rpx;
				border-radius: 100rpx;
				margin-top: 30rpx;
			}

			.active {
				color: #FFFFFF;
				background-color: $u-type-primary;
			}
		}
	}

	// .u-dropdown ::v-deep .u-dropdown__content{
	// 	height: calc(100vh - 200rpx);
	// }
</style>
