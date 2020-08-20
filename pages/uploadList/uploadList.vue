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
					<u-input style="margin-right: 40rpx;float: left; width: 460rpx;" type="" v-model="newItemFormData.tag" placeholder="请填写标签 ( 建议2-3个 )" />
					<u-button @click="addItemTags" size="mini" style="font-size: 40rpx; height: 60rpx; padding: 0 20rpx; line-height: 50rpx;float: right;">+</u-button>
				</view>
			</u-form-item>
			<u-tag style="margin:0 15rpx 10rpx 0" v-for="(i,idx) in newItemFormData.itemTags" :key=idx :text="i" :type="tagType[idx%5]"
			 mode="light" shape="circle" closeable @close="tagClick(idx)" />
			<u-form-item label="描述" prop="itemContent">
				<u-input type="textarea" :height="100" maxlength='1000' placeholder="请填写标描述" v-model="newItemFormData.itemContent" />
			</u-form-item>
			<u-form-item label="位置" prop="itemSite" v-if="newItemFormData.itemType==='房源'">
				<u-input v-model="newItemFormData.itemSite" placeholder="请填写详细位置" />
			</u-form-item>
			<u-form-item label="价格" prop="itemPrice" v-if="newItemFormData.itemType==='房源'||newItemFormData.itemType==='商品'">
				<u-number-box v-model="newItemFormData.itemPrice" :min="0" :max="100000000" :input-width="140"></u-number-box>
			</u-form-item>
			<u-form-item label="价格单位" prop="itemPriceUnit" label-width="200" v-if="newItemFormData.itemType==='房源'||newItemFormData.itemType==='商品'">
				<u-input type="select" :select-open="UnitShow" v-model="newItemFormData.itemPriceUnit" placeholder="请选择价格单位" @click="UnitShow = true"></u-input>
			</u-form-item>

			<view style="width: 100%;margin:15rpx 0 30rpx;">
				<view style="text-align: center;font-size: 40rpx;">图片上传</view>
				<view style="text-align: center;">( 注: 第一张图片将作为封面图 )</view>
				<view style="text-align: center;" class='showImgMsg' v-if="isImgMsg">请选择图片</view>
				<u-upload :action="action" :file-list="fileList" ref="itemImgsUpload" @on-change="uploadChange"></u-upload>
			</view>


			<u-button @click="submit">提交</u-button>

			<!-- 选择列表 -->
			<u-select v-model="itemTypeShow" :list="itemTypeList" @confirm="itemTypeConfirm"></u-select>
			<u-select v-model="UnitShow" :list="UnitList" @confirm="UnitConfirm"></u-select>
		</u-form>

		<!-- <u-button @click="openMap">唤起地图</u-button> -->
		<!-- 弹出框 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	// import Map from '@/js_sdk/fx-openMap/openMap.js'
	import URL, {
		getItemType,
		getUnitList,
		upImgUrl,
		addItemSubmit
	} from '@/common/util/API.js'

	export default {
		components: {},
		data() {
			return {
				newItemFormData: {
					itemType: '',
					itemTitle: '',
					tag: '',
					itemTags: [],
					itemContent: '',
					itemSite: '',
					itemPrice: 0,
					itemPriceUnit: '元',
				},
				rules: {
					itemTitle: [{
						required: true,
						message: '请输入标题',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['blur'],
					}],
					itemType: [{
						required: true,
						message: '请选择类别',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['blur','change'],
					}],
					itemTag: [{
						validator: (rule, value, callback) => {
							if (this.newItemFormData.itemTags.length || this.newItemFormData.tag) return true
							return false
						},
						message: '请添加标签',
						trigger: ['blur'],
					}],
					itemContent: [{
						required: true,
						message: '请输入类别',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['blur'],
					}],
				},
				itemTypeShow: false,
				itemTypeList: [],
				tagType: ['primary', 'success', 'warning', 'error', 'info'],
				UnitShow: false,
				UnitList: [],
				isImgMsg:false,

				action: upImgUrl,
				fileList: [
					// 	{
					// 	url: 'http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg',
					// },
				]
			}
		},
		computed: {},
		onLoad() {
			// 获取类型
			getItemType().then(res => {
				this.itemTypeList = res[1].data
			}).catch(err => {
				console.log('获取类型错误', err)
			})
			// 获取价格单位
			getUnitList().then(res => {
				this.UnitList = res[1].data
			}).catch(err => {
				console.log('获取价格单位', err)
			})
		},
		onReady() {
			// 绑定表单验证
			this.$refs.newItemForm.setRules(this.rules);
		},
		methods: {
			//下拉触发
			itemTypeConfirm(e) {
				// console.log('e', e)
				this.newItemFormData.itemType = e[0].value
				//更改验证规则添加地址验证
				if(e[0].value==='房源'){
					this.rules.itemSite = [{
							required: true,
							message: '请输入地址',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur'],
					}]
				}else{
					delete this.rules.itemSite
				}
			},
			UnitConfirm(e) {
				// console.log('e', e)
				this.newItemFormData.itemPriceUnit = e[0].value
			},
			addItemTags() {
				if (this.newItemFormData.tag && !this.newItemFormData.itemTags.includes(this.newItemFormData.tag)) {
					this.newItemFormData.itemTags.push(this.newItemFormData.tag)
					this.newItemFormData.tag = ''
					// this.$refs.tagIpt.focus()
					// console.log('this.$refs.tagIpt',this.$refs.tagIpt)
				}
			},
			tagClick(idx) {
				this.newItemFormData.itemTags.splice(idx, 1)
			},
			// 上传触发
			uploadChange(){
				 this.isImgMsg=false
			},


			submit() {
				console.log('form', this.newItemFormData)

				//处理图片
				let files = [];
				// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				files = this.$refs.itemImgsUpload.lists.filter(val => {
					return val.progress == 100;
				})
				console.log(files)

				//传前处理数据
				let {
					tag,
					itemPriceUnit,
					...data
				} = { ...this.newItemFormData,
					itemPrice: this.newItemFormData.itemPrice + this.newItemFormData.itemPriceUnit,
					itemTags: this.newItemFormData.itemTags.join(',')
				}
				data.itemImgList = files.map(i => URL + i.response[0].url).join(',')
				console.log('data', data)
				data.itemShowImg = data.itemImgList.split(',')[0]

				// 处理未按+的标签,若标签为空单表单中有只是没有按+则直接设为标签
				if (!this.newItemFormData.itemTags.length && this.newItemFormData.tag) {
					this.newItemFormData.itemTags = [this.newItemFormData.tag]
					this.newItemFormData.tag = ''
				}

				//验证表单
				let verification = false
				this.$refs.newItemForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						verification = true
					} else {
						console.log('验证失败');
						verification = false
					}
				});
				if(!data.itemImgList.length) this.isImgMsg = !(verification = false)

				// this.$refs.uToast.show({
				// 	title: '上传成功',
				// 	type: 'success',
				// 	url: '/pages/index/index',
				// 	isTab:true,
				// 	duration:500
				// })

				//上传
				if (verification) {
					addItemSubmit(data).then(res => {
						console.log('上传返回', res)
						if (res[1].data.isScuccess) {
							//上传成功
							this.$refs.uToast.show({
								title: '上传成功',
								type: 'success',
								url: '/pages/index/index',
								isTab: true,
								duration: 600
							})
						} else {
							//上传失败
							this.$refs.uToast.show({
								title: '上传失败',
								type: 'error'
							})
						}
					}).catch(err => {
						console.log('上传错误', err)
						//上传失败
						this.$refs.uToast.show({
							title: '上传失败' + err,
							type: 'error'
						})
					})
				}
			},

			//唤醒地图
			// openMap() {
			// 	Map.openMap(39.56, 116.2, 'name')
			// }


		}
	}
</script>

<style>
.showImgMsg{
	    font-size: 12px;
	    line-height: 12px;
	    color: #fa3534;
	    margin-top: 6px;
}
</style>
