<template>
	<view style="margin: 20rpx 30rpx;">
		<!-- 轮播图 -->
		<view>
			<u-swiper height="450rpx" @click="clickSwiper" :list="itemDetails.itemImgList" mode='number' :autoplay='false'></u-swiper>
		</view>
		<!-- 浏览轮播图片 -->
		<u-popup v-model="isShowImg" mode="center">
			<image :src="showImgUrl" mode="aspectFit"></image>
		</u-popup>
		<!-- 标题和价格 -->
		<view class="title">{{itemDetails.itemTitle}}</view>
		<view class="" style="margin-bottom: 20rpx;">
			<text class="price" v-if="itemDetails.itemType==='房源'||itemDetails.itemType==='商品'">{{itemDetails.itemPrice}}</text>
			<text class="payment" v-if="itemDetails.itemType==='房源'">{{itemDetails.itemPayment}}</text>
		</view>
		<!-- 参数 -->
		<view class="parameter" v-if="itemDetails.itemType==='房源'">
			<view class="parameter-item" v-for="(item,index) in parameterList" :key="index">
				<view class="parameter-parame">{{item.parame}}</view>
				<view class="parameter-name">{{item.name}}</view>
			</view>
		</view>
		<!-- tag -->
		<view class="tags" style="margin: 0 0 20rpx 0;">
			<u-tag v-for="(i,idx) in itemDetails.itemTags" :key='idx' :text="i" :type="tagType[idx]" mode="plain" shape="circle"
			 style="margin-right: 20rpx;" />
		</view>
		<!-- 地图位 -->
		<view class="site" v-if="itemDetails.itemType==='房源'">
			<uni-icons type="location-filled" size="18rpx"></uni-icons>
			{{itemDetails.itemSite}}
		</view>
		<!-- 内容 -->
		<view class="content">
			<view style="font-size: 40rpx; font-weight: 550;margin: 20rpx 0;">内容介绍</view>
			<text>{{itemDetails.itemContent}}</text>
		</view>




	</view>
</template>

<script>
	import {
		getItemDetails,
		joinHistory
	} from '@/common/util/API.js'
	import addYS from '@/common/util/addYS.js'
	import {
		userId
	} from '@/common/util/utils.js'
	import {
		dateFormat
	} from '@/common/util/date.js'

	export default {
		data() {
			return {
				id: '',
				itemDetails: {},
				isShowImg: false,
				showImgUrl: '',
				parameterList: [],

				tagType: ['primary', 'success', 'warning', 'error', 'info'],

			}
		},
		onLoad(option) {
			this.id = option.id
			//获取item详情
			getItemDetails(this.id).then(res => {
				this.itemDetails = { ...res[1].data[0]
				}
				this.itemDetails.itemImgList = this.itemDetails.itemImgList ? this.itemDetails.itemImgList.split(',').map(i => ({
					titel: '',
					image: addYS(i)
				})) : ['']
				this.itemDetails.itemTags = this.itemDetails.itemTags.split(',')
				this.parameterList = [

					{
						name: '房型',
						parame: this.itemDetails.itemHouseType
					},
					{
						name: '面积',
						parame: this.itemDetails.itemHouseArea
					},
					{
						name: '楼层',
						parame: this.itemDetails.itemHouseFloor
					},
				]

				console.log('获取到详情', res, this.itemDetails)
			}).catch(err => {
				console.log('获取详情出错', err)
			})

			// 加入历史
			joinHistory({
				itemId: this.id,
				userId: userId(),
				createTime: dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
			}).then(res => {
				console.log('历史加入', res)
			})
		},
		created() {

		},
		methods: {
			clickSwiper(i) {
				this.showImgUrl = this.itemDetails.itemImgList[i].image
				this.isShowImg = true
			}
		}
	}
</script>

<style scoped lang="scss">
	.title {
		font-size: 50rpx;
		font-weight: 550;
		margin: 20rpx 0;
	}

	.price {
		font-size: 45rpx;
		font-weight: 550;
		color: #e54b00;
		margin-bottom: 20rpx;
	}

	.payment {
		margin-left: 30rpx;
		color: #999;
	}

	.parameter {
		display: flex;
		border-top: 1rpx solid #e4e7ed;
		border-bottom: 1rpx solid #e4e7ed;
		padding: 25rpx 0;
		margin: 40rpx 0;

		.parameter-item {
			flex: 1;
			text-align: center;

			.parameter-parame {
				font-size: 35rpx;
				font-weight: 600;
			}

			.parameter-name {
				color: rgb(96, 98, 102);
			}
		}
	}
</style>
