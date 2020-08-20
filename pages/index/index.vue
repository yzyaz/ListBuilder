<template>
	<view>
		<!-- 轮播图 -->
		<view style="padding: 30rpx;">
			<u-swiper :list="spImg" title :effect3d="true"></u-swiper>
		</view>
		<!-- 下拉菜单 -->
		<u-dropdown border-bottom ref="uDropdown">
			<u-dropdown-item v-model="dropdownData.value1" title="类别" :options="dropdownData.options1"></u-dropdown-item>
			<u-dropdown-item v-model="dropdownData.value2" title="排序" :options="dropdownData.options2"></u-dropdown-item>
			<u-dropdown-item title="标签">
				<view class="slot-content">
					<view class="item-box">
						<view class="item" :class="[item.active ? 'active' : '']" @tap="tagClick(index)" v-for="(item, index) in dropdownData.list"
						 :key="index">
							{{item.label}}
						</view>
					</view>
					<u-button type="primary" @click="closeDropdown">确定</u-button>
				</view>
			</u-dropdown-item>
		</u-dropdown>
		<!-- 列表,还有上边的具体样式后面调 -->
		<myList :myList='myList'></myList>
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="iconStyle"></u-back-top>
	</view>
</template>

<script>
	import myList from '@/components/myList/myList.vue'
	import {
		getSwiper,
		getMyList
	} from '@/common/util/API.js'

	export default {
		components: {
			myList
		},
		data() {
			return {
				spImg: [],
				myList: null,
				scrollTop: 0,
				iconStyle: {
					fontSize: '32rpx',
					color: 'rgb(41, 121, 255)',
				},
				dropdownData: {
					value1: 1,
					value2: 2,
					options1: [{
							label: '默认排序',
							value: 1,
						},
						{
							label: '距离优先',
							value: 2,
						},
						{
							label: '价格优先',
							value: 3,
						}
					],
					options2: [{
							label: '去冰',
							value: 1,
						},
						{
							label: '加冰',
							value: 2,
						},
					],
					list: [{
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

				},
			}
		},
		onLoad() {
			// 获取轮播数据
			getSwiper().then(res => {
				this.spImg = res[1].data
			}).catch(err => {
				console.log('获取轮播错误', err)
			})
			// 获取列表
			getMyList().then(res => {
				this.myList = res[1].data.map(i => ({
					...i,
					itemTags: i.itemTags.split(',')
				}))
			}).catch(err => {
				console.log('获取轮播错误', err)
			})
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		created() {},
		methods: {
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			tagClick(index) {
				this.dropdownData.list[index].active = !this.dropdownData.list[index].active;
			},
		}
	}
</script>

<style lang="scss">
	.u-back-top {
		background-color: rgb(160, 207, 255)
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
</style>
