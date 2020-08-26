<template>
	<view>
		<!-- 顶部栏 -->
		<u-navbar :is-back="false" title="分享列表组">
			<view class="">
				<u-icon @click="back" name="arrow-left" size="40" style="margin-left: 20rpx;"></u-icon>
			</view>
			<view slot="right">
				<text style="margin-right: 30rpx;color: #ea625b;" @click="isPopupShow=true">分享</text>
				<!-- <u-icon @click="isPopupShow=true" name="more-dot-fill" size="50" style="margin-right: 30rpx;color: #ea625b;"></u-icon> -->
			</view>
		</u-navbar>
		<!-- 下拉菜单 -->
		<u-dropdown border-bottom ref="uDropdown">
			<u-dropdown-item @change='dropTypeChange' v-model="dropdownData.type" title="分组类型" :options="dropdownData.gropTypeList"></u-dropdown-item>
			<u-dropdown-item @change='dropSortChange' v-model="dropdownData.sortItem" title="排序" :options="dropdownData.sortItemList"></u-dropdown-item>
		</u-dropdown>
		<!-- 侧边弹出层 -->
		<u-popup v-model="isPopupShow" mode='right' length="70%">
			<view class="" :style="'padding-top:'+statusBarHeight+'rpx;'">
				<u-divider color="rgb(41, 121, 255)" half-width="200" border-color="rgb(41, 121, 255)" fontSize='35' style="margin: 20rpx 0;">分组列表
					(向右滑动操作)</u-divider>
				<view>

					<m-slide-list :list="dropdownData.gropTypeList" :button="buttonList" :border="true" @click="clickMethod" @change="changeMethod"></m-slide-list>
				</view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getGropType
	} from '@/common/util/API.js'
	import mSlideList from '@/components/mark-slide-list/mark-slide-list.vue'

	export default {
		components: {
			mSlideList
		},
		data() {
			return {
				// #ifdef MP-WEIXIN
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight + 88,
				// #endif
				// #ifndef MP-WEIXIN
				statusBarHeight: 0,
				// #endif
				buttonList: [{
						title: '分享',
						background: '#c4c7cd'
					},
					{
						title: '删除',
						background: '#ff3b32'
					}
				],
				isPopupShow: false,
				dropdownData: {
					type: '',
					sortItem: 'time-desc',
					gropTypeList: [],
					sortItemList: [{
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
					]
				},
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]

			}
		},
		async onLoad() {
			// 获取分组类型列表
			getGropType().then(res => {
				if (res[1].data.length) {
					this.dropdownData.gropTypeList = res[1].data.map(i => ({
						...i,
						slide_x: 0
					}))
				}
				console.log('grop res', res, this.dropdownData.gropTypeList)
			}).catch(err => {
				console.log('获取分组错误', err)
			})

		},
		computed: {
			// statusBarHeight(){
			// 	return uni.getSystemInfoSync().statusBarHeight
			// }
		},
		methods: {
			back() {
				uni.switchTab({
					url: '/pages/myInfo/myInfo'
				});
			},
			dropTypeChange() {

			},
			dropSortChange() {

			}
		}
	}
</script>

<style lang="scss">
	.u-swipe-action {
		.item {
			padding: 30rpx 0;
		}

		.title {
			text-align: center;
			font-size: 28rpx;
			color: $u-content-color;
		}

	}

	// .u-dropdown ::v-deep .u-dropdown__content{
	// 	height: calc(100vh - 80rpx - 98rpx);
	// }
</style>
