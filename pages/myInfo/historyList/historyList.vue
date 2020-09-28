<template>
	<view>
		<!-- 顶部栏 -->
		<u-navbar :is-back="false" title="历史记录">
			<view class="">
				<u-icon @click="back" name="arrow-left" size="40" style="margin-left: 20rpx;"></u-icon>
			</view>
		</u-navbar>

		<!-- 列表,还有上边的具体样式后面调 -->
		<myList :myList='myList' isHistory :isClickManage='isClickManage' ref='myList'></myList>

	</view>
</template>

<script>
	import {
		getHistoryList
	} from '@/common/util/API.js'
	import {
		userId
	} from '@/common/util/utils.js'
	import addYS from '@/common/util/addYS.js'

	export default {
		data() {
			return {
				myList: [],
				firstMyList: [],
				isClickManage: false, //右上角管理按钮点击,初始false为管理
			}
		},
		created() {
			this.getHistoryList()
		},
		methods: {
			// 获取历史列表
			getHistoryList() {
				getHistoryList(userId()).then(res => {
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
			},
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
