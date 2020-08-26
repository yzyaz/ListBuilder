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
			<view v-if="!isClickManage" class="handleItem" @click.stop="(handleItemData.handleItemShow=true)&&(handleId=item.id)">
				<u-icon name="more-dot-fill" size="50" style="margin-right: ;"></u-icon>
			</view>
			<view v-else class="manageBtn" :style="'background-color:'+ (item.isChoose?'#f40;':';')"></view>
		</view>
		<!-- </block> -->
		<!-- 弹出操作栏 -->
		<u-action-sheet @click="actionSheet" :list="handleItemData.handleItemList" v-model="handleItemData.handleItemShow"></u-action-sheet>
		<u-toast ref="uToast" />
		<u-modal v-model="modalShow" show-cancel-button mask-close-able :content="modalContent||'是否确认删除?'" @confirm="modalConfirm"></u-modal>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import {
		delItem
	} from '@/common/util/API.js'
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
			}
		},
		data() {
			return {
				itemList: [],
				handleItemData: {
					handleItemShow: false,
					handleItemList: [{
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
				handleIndex: '',
				modalShow: false,
				modalContent: ''
			};
		},
		watch: {
			myList(val) {
				if (val.length) {
					this.itemList = val.map(i => ({
						...i,
						isChoose: false //多个管理时是否被选中
					}))
				}
				console.log('itemList',this.itemList)
			}
		},
		methods: {
			// handleItemClick(){
			// 	this.handleItemData.handleItemShow=true
			// }
			// 点击item
			listClick(item){
				if(this.isClickManage){
					item.isChoose=!item.isChoose
				}else{
				uni.navigateTo({
					url: '/pages/details/details?id=' + item.id
				});
				}
			},
			// 点击弹出操作
			actionSheet(i) {
				console.log('点击操作', i, 'id:', this.handleId)
				switch (i) {
					case 0:
						this.handleIndex = i
						this.modalShow = true
						break;
					default:
						break;
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
								this.itemList.splice(this.handleIndex, 1)
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
			modalConfirm() {
				this.deletItem()
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
