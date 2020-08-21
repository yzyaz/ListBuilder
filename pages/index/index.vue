<template>
	<view>
		<!-- 轮播图 -->
		<view style="padding: 30rpx;">
			<u-swiper :list="spImg" title :effect3d="true"></u-swiper>
		</view>
		<!-- 下拉菜单 -->
		<u-dropdown border-bottom ref="uDropdown">
			<u-dropdown-item @change='dropTypeChange' v-model="dropdownData.type" title="类别" :options="dropdownData.typeList"></u-dropdown-item>
			<u-dropdown-item @change='dropSortChange' v-model="dropdownData.sortItem" title="排序" :options="dropdownData.sortItemList"></u-dropdown-item>
			<u-dropdown-item title="标签">
				<view class="slot-content">
					<view class="item-box">
						<view class="item" :class="[item.active ? 'active' : '']" @tap="tagClick(index)" v-for="(item, index) in dropdownData.tagList"
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
		<view style="margin: 15rpx 0;">
			<u-divider>没有更多了</u-divider>
		</view>
		
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="iconStyle"></u-back-top>
	</view>
</template>

<script>
	import myList from '@/components/myList/myList.vue'
	import {
		getSwiper,
		getMyList,
		getItemType,
		getMyListFromType,
		getMyListFromSort
	} from '@/common/util/API.js'

	export default {
		components: {
			myList
		},
		data() {
			return {
				spImg: [],
				myList: [],
				firstMyList: [],
				scrollTop: 0,
				iconStyle: {
					fontSize: '32rpx',
					color: 'rgb(41, 121, 255)',
				},
				dropdownData: {
					type: '全部',
					sortItem: 'time-desc',
					typeList: [],
					sortItemList: [
						// {
						// 	label: '默认',
						// 	value: 'default',
						// },
						{
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
					],
					tagList: [{
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
					clickTagList: []

				},
			}
		},
		onLoad() {
			//获取下拉数据
			getItemType().then(res => {
				this.dropdownData.typeList = [{
					value: '全部',
					label: '全部'
				}, ...res[1].data]
			})
			// 获取轮播数据
			getSwiper().then(res => {
				this.spImg = res[1].data
			}).catch(err => {
				console.log('获取轮播错误', err)
			})
			// 获取列表
			getMyList().then(res => {
				console.log('跳转首页')
				this.myList = res[1].data.map(i => ({
					...i,
					itemTags: i.itemTags.split(',')
				}))
				this.firstMyList = JSON.parse(JSON.stringify(this.myList))
			}).catch(err => {
				console.log('获取轮播错误', err)
			})
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		created() {},
		methods: {
			tagClick(index) {
				this.dropdownData.tagList[index].active = !this.dropdownData.tagList[index].active;
				this.dropdownData.clickTagList = [...this.dropdownData.tagList.filter(i => i.active)]
			},
			closeDropdown(e) {
				// console.log('点击标签', this.dropdownData.clickTagList)
				this.$refs.uDropdown.close();
			},
			//点击类别
			dropTypeChange(e) {
				console.log('类别', e)
				if (e === '全部' && this.dropdownData.sortItem === 'time-desc') {
					this.myList = this.firstMyList
				} else {
					getMyListFromType(e, this.dropdownData.sortItem).then(res => {
						// console.log('res', res)
						this.myList = res[1].data.map(i => ({
							...i,
							itemTags: i.itemTags.split(',')
						}))
					})

				}
			},
			//点击排序
			dropSortChange(e) {
				console.log('排序', e)
				if (e === 'time-desc' && this.dropdownData.type === '全部') {
					this.myList = this.firstMyList
				} else {
					getMyListFromSort(e, this.dropdownData.type).then(res => {
						// console.log('res',res)
						this.myList = res[1].data.map(i => ({
							...i,
							itemTags: i.itemTags.split(',')
						}))
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.u-back-top {
		// background-color: rgb(160, 207, 255)
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
