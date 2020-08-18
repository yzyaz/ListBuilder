<template>
	<view>
		<!-- 轮播图 -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="swiperConfig.indicatorDots" :circular='swiperConfig.circular' :autoplay="swiperConfig.autoplay"
					 :interval="swiperConfig.interval" :duration="swiperConfig.duration">
						<swiper-item v-for="(i,idx) in swiperConfig.spImg" :key='idx'>
							<image class="spImg" :src="i" mode=""></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 列表,还有上边的具体样式后面调 -->
		<view class="myList">
			<view class="listItem" v-for="(item,index) in myList" :key="index">
				<image style="width: 345rpx;height: 280rpx;" :src="item.showImg" mode=""></image>
				<view class="title ellipsis">{{item.title}}</view>
				<view class="parameter ellipsis">{{item.parameter.replace(/,/g," | ")}}</view>
				<view class="add ellipsis">
					<uni-icons type="location-filled" size="13rpx"></uni-icons>
					{{item.add || '未知'}}
				</view>
				<view class="tagList ellipsis">
					<view v-if="!item.tag" class="tag">...</view>
					<view class="tag" v-for="(i,idx) in item.tag" :key='idx'>
						{{i}}
					</view>
				</view>
				<view class="price"> {{item.price}} </view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				swiperConfig: {
					indicatorDots: true,
					autoplay: true,
					circular: true,
					interval: 2000,
					duration: 500,
					spImg: require('@/temporary/myList.js').spImg,
				},
				myList: null,
			}
		},
		onLoad() {
			// 获取列表
			this.myList = require('@/temporary/myList.js').myList.map(i => ({ 
				...i,
				tag: i.tag && i.tag.split(',')
			}))
			console.log('mylist', this.myList)
		},
		created() {},
		methods: {}
	}
</script>

<style>
	.spImg {
		width: 750rpx;
	}

	.myList {
		display: flex;
		flex-wrap: wrap;
		padding: 0 20rpx;
	}

	.listItem {
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
</style>
