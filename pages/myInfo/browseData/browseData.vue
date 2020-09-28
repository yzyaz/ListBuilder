<template>
	<view>
		<!-- 顶部栏 -->
		<u-navbar :is-back="false" title="浏览数据">
			<view class="">
				<u-icon @click="back" name="arrow-left" size="40" style="margin-left: 20rpx;"></u-icon>
			</view>
		</u-navbar>
		
		数据
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			back() {
				uni.switchTab({
					url: '/pages/myInfo/myInfo'
				});
			},

		}
	}
</script>

<style>

</style>
