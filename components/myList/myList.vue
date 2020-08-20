<template>
	<view class="myList">
		<view class="listItem" v-for="(item,index) in myList" :key="index">
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
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components:{
			uniIcons
		},
		props: {
			myList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {

			};
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
</style>
