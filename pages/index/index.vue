<template>
	<view>
		<!-- 轮播图 -->
		<view style="padding: 30rpx;">
			<u-swiper :list="spImg" title :effect3d="true"></u-swiper>
		</view>
		<!-- 列表,还有上边的具体样式后面调 -->
		<myList :myList='myList'></myList>
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="iconStyle"></u-back-top>
	</view>
</template>

<script>
	import myList from '@/components/myList/myList.vue'
	export default {
		components: {
			myList
		},
		data() {
			return {
				spImg: require('@/temporary/myList.js').spImg,
				myList: null,
				scrollTop: 0,
				iconStyle: {
					fontSize: '32rpx',
					color: 'rgb(41, 121, 255)',
					
				}
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
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		created() {},
		methods: {}
	}
</script>

<style>
.u-back-top{
	 background-color: rgb(160, 207, 255)
}
</style>
