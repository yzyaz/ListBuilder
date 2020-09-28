<template>
	<view class="myList">
		<!-- <block v-if="itemList.length"> -->
		<view @click="listClick(item)" class="listItem" v-for="(item,index) in itemList" :key="index">
			<image style="width: 345rpx;height: 280rpx;" :src="item.itemShowImg" mode=""></image>
			<view class="title ellipsis">{{item.itemTitle}}</view>
			<view class="parameter ellipsis" v-if="item.itemType!=='房源'">{{item.itemTags.join(' | ')}}</view>
			<view class="add ellipsis" v-if="item.itemType==='房源'">
				<uni-icons type="location-filled" size="13rpx"></uni-icons>
				{{item.itemSite || '未知'}}
			</view>
			<view class="tagList ellipsis" v-if="item.itemType==='房源'">
				<view v-if="!item.itemTags" class="tag">...</view>
				<view class="tag" v-for="(i,idx) in item.itemTags" :key='idx'>
					{{i}}
				</view>
			</view>
			<view class="price" v-if="item.itemType!=='个人作品'"> {{'￥'+item.itemPrice}} </view>

			<!-- item的操作 -->
			<view class="" v-if="!isHistory">
				<view v-if="!isClickManage" class="handleItem" @click.stop="(handleItemData.handleItemShow=true)&&(handleId=item.id)&&(clickIndex=index)">
					<u-icon name="more-dot-fill" size="50" style="margin-right: ;"></u-icon>
				</view>
				<view v-else class="manageBtn" :style="'background-color:'+ (item.isChoose?'#f40;':';')"></view>
			</view>

		</view>
		<!-- </block> -->
		<!-- 弹出操作栏 -->
		<u-action-sheet @click="actionSheet" :list="handleItemData.handleItemList" v-model="handleItemData.handleItemShow"></u-action-sheet>
		<u-toast ref="uToast" />
		<u-modal v-model="modalShow" show-cancel-button mask-close-able :title="modalTitle" :content="'是否确认删除?'" @confirm="modalConfirm">
			<view class="" v-if="handleIndex===1">
				<u-input v-model="JoinGropName" :type="'select'" border @click="isShowJoinGrop = true" />
				<u-action-sheet :list="gropTypeList" v-model="isShowJoinGrop" @click="actionSheetCallback"></u-action-sheet>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import {
		appURL,
		delItem,
		joinGrop,
		getGropType,
		collectItem,
		delCollectItem
	} from '@/common/util/API.js'
	import {
		userId,
		authorId,
		copyText
	} from '@/common/util/utils.js'
	export default {
		components: {
			uniIcons
		},
		props: {
			myList: {
				type: Array,
				default: () => []
			},
			isClickManage: { //右上角管理按钮点击
				type: Boolean,
				default: false
			},
			inCollect: {
				type: Boolean,
				default: false
			},
			isHistory: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				itemList: [],
				handleItemData: {
					handleItemShow: false,
					handleItemList: this.inCollect ? [{
						text: '取消收藏',
						color: 'red'
					}] : [{
						text: '删除',
						color: 'red'
					}, {
						text: '加入分组'
					}, {
						text: '分享'
					}, {
						text: '收藏'
					}],
				},
				handleId: '',
				handleIndex: '', //弹出操作的index
				clickIndex: '', //点击的item的index
				modalShow: false,
				modalTitle: '提示',
				modalConfirmType: '', //操作类型
				isShowJoinGrop: false,
				JoinGropName: '',
				gropTypeList: []

			};
		},
		created() {

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

			console.log('inCollect', this.inCollect)

		},
		watch: {
			myList(val) {
				// if (val.length) {
				this.itemList = val.map(i => ({
					...i,
					isChoose: false //多个管理时是否被选中
				}))
				// }
				console.log('itemList', this.itemList)
			}
		},
		methods: {
			// handleItemClick(){
			// 	this.handleItemData.handleItemShow=true
			// }
			// 点击item
			listClick(item) {
				if (this.isClickManage) {
					item.isChoose = !item.isChoose
				} else {
					uni.navigateTo({
						url: '/pages/details/details?id=' + item.id
					});
				}
			},
			// 点击弹出操作
			actionSheet(i) {
				console.log('点击操作', i, 'id:', this.handleId)
				this.modalConfirmType = i
				if (!this.inCollect) {
					switch (i) {
						case 0:
							//删除
							this.handleIndex = i
							this.modalShow = true
							this.modalTitle = '提示'
							break;
						case 1:
							//加入分组
							this.handleIndex = i
							this.modalShow = true
							this.modalTitle = '选择加入的名称'
							break;
						case 2:
							//分享
							const flag = copyText(`${appURL}pages/details/details?id=${this.handleId}`)
							console.log('点击分享(已复制到剪切板)', `${appURL}pages/details/details?id=${this.handleId}`)
							this.$refs.uToast.show({
								title: '链接已复制到剪切板',
								duration: 700,
								type: 'success',
								callback: () => {
									// this.itemList.splice(this.handleIndex, 1)
								}
							})
							break;
						case 3:
							//收藏
							console.log('收藏')
							const data = {
								userId: userId(),
								itemId: this.handleId,
								authorId: authorId()
							}
							collectItem(data).then(res => {
								console.log('收藏返回', res)
								if (res[1].data.isCollect) {
									this.$refs.uToast.show({
										title: '请勿重复收藏',
										duration: 700,
										type: 'success',
										callback: () => {
											// this.itemList.splice(this.handleIndex, 1)
										}
									})

								} else if (res[1].data.isScuccess) {
									this.$refs.uToast.show({
										title: '收藏成功',
										duration: 700,
										type: 'success',
										callback: () => {
											// this.itemList.splice(this.handleIndex, 1)
										}
									})
								} else {
									this.$refs.uToast.show({
										title: '收藏失败',
										duration: 700,
										type: 'error'
									})
								}
							}).catch(err => {
								console.log('err', err)
								this.$refs.uToast.show({
									title: '收藏失败' + err,
									duration: 700,
									type: 'error'
								})
							})
							break;
						default:
							break;
					}
				} else {
					console.log('点击取消收藏')
					delCollectItem([this.handleId], userId()).then(res => {
						console.log('取消收藏res', res)
						if (res[1].data.affectedRows > 0) {
							this.$refs.uToast.show({
								title: '取消收藏成功',
								duration: 700,
								type: 'success',
								callback: () => {
									this.itemList.splice(this.clickIndex, 1)
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
						console.log('取消收藏错误返回', err)
						this.$refs.uToast.show({
							title: '取消收藏失败' + err,
							duration: 700,
							type: 'error'
						})
					})
				}
			},
			deletItem() {
				delItem(this.handleId).then(res => {
					console.log('res del', res)
					if (res[1].data.affectedRows === 1) {
						this.$refs.uToast.show({
							title: '删除成功',
							duration: 700,
							type: 'success',
							callback: () => {
								this.itemList.splice(this.clickIndex, 1)
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
					this.$refs.uToast.show({
						title: '删除失败' + err,
						duration: 700,
						type: 'error'
					})

				})

			},
			joinGrop() {
				if (this.handleId && this.JoinGropName) {
					joinGrop(this.handleId, this.JoinGropName).then(res => {
						console.log('加入grope res', res)
						this.$refs.uToast.show({
							title: '加入成功',
							duration: 700,
							type: 'success'
						})
					}).catch(err => {
						console.log('err', err)
						this.$refs.uToast.show({
							title: '加入失败' + err,
							duration: 700,
							type: 'error'
						})
					})

				} else {
					this.modalShow = true
					this.$refs.uToast.show({
						title: '请选择名称',
						duration: 700,
						type: 'warning'
					})
				}
			},
			modalConfirm() {
				this.modalTitle = '提示'
				console.log('this.modalConfirmType', this.modalConfirmType)
				switch (this.modalConfirmType) {
					case 0:
						this.deletItem()
						break;
					case 1:
						this.joinGrop()
						break;
					default:
						break;
				}
			},
			actionSheetCallback(e) {
				this.JoinGropName = this.gropTypeList[e].label
			}
		}
	}
</script>

<style>
	.myList {
		display: flex;
		flex-wrap: wrap;
		padding: 0 20rpx;
	}

	.listItem {
		position: relative;
		width: 345rpx;
		margin-top: 10rpx;
	}

	.listItem:nth-child(odd) {
		margin-right: 20rpx;
	}

	.listItem .title {
		color: rgba(0, 0, 0, .87);
		font-size: 30rpx;
	}

	.listItem .parameter {
		font-size: 25rpx;
		text-align: center;
		/* color: rgba(0, 0, 0, .54); */
	}

	.listItem .add {
		font-size: 25rpx;
		/* color: rgba(0, 0, 0, .54); */
	}

	.listItem .tagList {
		font-size: 25rpx;
		color: rgba(0, 0, 0, .4);
		text-align: center;
	}

	.listItem .tagList .tag {
		display: inline-block;
		padding: 4rpx 10rpx;
		background-color: rgba(0, 0, 0, .03);
		margin-right: 20rpx;
	}

	.listItem .price {
		font-size: 32rpx;
		text-align: center;
		color: #ea625b;
	}

	.listItem .handleItem {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		background-color: rgba(204, 204, 204, .6);
		width: 70rpx;
		height: 45rpx;
		line-height: 45rpx;
		border-radius: 23rpx;
		text-align: center;
		color: #f3f3f3;
	}

	.listItem .manageBtn {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		background-color: rgba(204, 204, 204, .6);
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		border: 5rpx solid #fff;
	}
</style>
