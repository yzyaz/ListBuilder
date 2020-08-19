<template>
	<view style="padding:0 30rpx;">

		<u-form :model="newItemFormData" ref="newItemForm">
			<u-form-item label="类别" prop="itemType">
				<u-input type="select" :select-open="itemTypeShow" v-model="newItemFormData.itemType" placeholder="请选择类别" @click="itemTypeShow = true"></u-input>
			</u-form-item>
			<u-form-item label="标题" prop="itemTitle">
				<u-input type="textarea" :height="1" placeholder="请填写标题" v-model="newItemFormData.itemTitle" />
			</u-form-item>
			<u-form-item label="标签" prop="itemTag">
				<view class="">
					<u-input style="margin-right: 40rpx;float: left; width: 460rpx;" type="" v-model="newItemFormData.tag" placeholder="请填写标签" />
					<u-button @click="addItemTags" size="mini" style="font-size: 40rpx; height: 60rpx; padding: 0 20rpx; line-height: 50rpx;float: right;">+</u-button>
				</view>
			</u-form-item>
			<u-tag style="margin:0 15rpx 10rpx 0" v-for="(i,idx) in newItemFormData.itemTags" :key=idx :text="i" :type="tagType[idx%5]"
			 mode="light" shape="circle" closeable @close="tagClick(idx)" />
			<u-form-item label="位置" prop="itemSite">
				<u-input v-model="newItemFormData.itemSite" placeholder="请填写详细位置" />
			</u-form-item>
			<u-form-item label="价格" prop="itemPrice">
				<u-number-box v-model="newItemFormData.itemPrice" :min="0" :max="100000000" :input-width="140"></u-number-box>
			</u-form-item>
			<u-form-item label="价格单位" prop="itemPriceUnit" label-width="200">
				<u-input type="select" :select-open="UnitShow" v-model="newItemFormData.itemPriceUnit" placeholder="请选择价格单位" @click="UnitShow = true"></u-input>
			</u-form-item>

			<view class="" style="width: 100%;margin:15rpx 0 30rpx;">
				<view style="text-align: center;font-size: 40rpx;">图片上传</view>
				<u-upload :action="action" :file-list="fileList" ref="itemImgsUpload"></u-upload>
			</view>


			<u-button @click="submit">提交</u-button>

			<!-- 选择列表 -->
			<u-select v-model="itemTypeShow" :list="itemTypeList" @confirm="itemTypeConfirm"></u-select>
			<u-select v-model="UnitShow" :list="UnitList" @confirm="UnitConfirm"></u-select>
		</u-form>

		<!-- <u-button @click="openMap">唤起地图</u-button> -->
	</view>
</template>

<script>
	// import Map from '@/js_sdk/fx-openMap/openMap.js'

	export default {
		components: {

		},
		data() {
			return {
				newItemFormData: {
					itemType: '',
					itemTitle: '',
					tag: '',
					itemTags: [],
					itemSite: '',
					itemPrice: 0,
					itemPriceUnit: '',

				},
				itemTypeShow: false,
				itemTypeList: require('@/temporary/myList.js').itemType,
				tagType: ['primary', 'success', 'warning', 'error', 'info'],
				UnitShow: false,
				UnitList: require('@/temporary/myList.js').UnitList,

				action: 'http://www.example.com/upload',
				fileList: [{
					url: 'http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg',
				}]
			}
		},
		computed: {},
		methods: {
			addItemTags() {
				if (this.newItemFormData.tag && !this.newItemFormData.itemTags.includes(this.newItemFormData.tag)) {
					this.newItemFormData.itemTags.push(this.newItemFormData.tag)
					this.newItemFormData.tag = ''
				}
			},
			tagClick(idx) {
				this.newItemFormData.itemTags.splice(idx, 1)
			},


			submit() {
				console.log('form', this.newItemFormData)

				let files = [];
				// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				files = this.$refs.itemImgsUpload.lists.filter(val => {
					return val.progress == 100;
				})
				console.log(files)
			},
			itemTypeConfirm(e) {
				console.log('e', e)
				this.newItemFormData.itemType = e[0].value
			},
			UnitConfirm(e) {
				console.log('e', e)
				this.newItemFormData.itemPriceUnit = e[0].value
			},
			
			//唤醒地图
			// openMap() {
			// 	Map.openMap(39.56, 116.2, 'name')
			// }


		}
	}
</script>

<style>

</style>
