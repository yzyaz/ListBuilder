<template>
	<view class="myInfo">
		<view class="avatar">

			<!-- #ifdef H5 -->
			<u-avatar :src="avatarSrc" mode="circle" size="large"></u-avatar>
			<text class="login" v-if="!isLogin" @click="login">登陆/注册</text>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<block v-if="!openId">
				<u-avatar :src="avatarSrc" mode="circle" size="large"></u-avatar>
				<text class="login" @click="login">登陆/注册</text>
			</block>
			<block v-else>
				<open-data class="WXavatar" type="userAvatarUrl"></open-data>
				<open-data class="userName" type="userNickName"></open-data>
			</block>
			<!-- #endif -->
			<!-- <text class="myName" v-else>已登录ui</text> -->
		</view>
		<!-- <view class="section">
			<u-section class="" title="编辑我的列表" sub-title="查看更多"></u-section>
		</view> -->
		<view class="grid">
			<u-grid :col="4">
				<u-grid-item @click="clickGrid('myList')">
					<u-icon name="gift" :size="46"></u-icon>
					<view class="grid-text">我的列表</view>
				</u-grid-item>
				<u-grid-item @click="clickGrid('addItem')">
					<u-icon name="calendar" :size="46"></u-icon>
					<view class="grid-text">新增列表</view>
				</u-grid-item>
				<u-grid-item @click="clickGrid('groupList')">
					<u-icon name="gift" :size="46"></u-icon>
					<view class="grid-text">分享列表组</view>
				</u-grid-item>
				<u-grid-item @click="clickGrid('eye')">
					<u-icon name="eye" :size="46"></u-icon>
					<view class="grid-text">浏览数据</view>
				</u-grid-item>
			</u-grid>

		</view>
		<view class="section" @click="contactUs">
			<u-section class="" title="联系我们" sub-title="　"></u-section>
		</view>
		<!-- <button type="default" @click="dianwo">dianwo</button>
		<button type="default" @click="dianwo2">dianwo2</button> -->


		<!-- 绑定邮箱弹出/注册邮箱 -->
		<u-modal v-model="bandEmailShow" @confirm="bandEmail" :show-cancel-button='openId?false:true' :title="openId?'绑定邮箱,以便同步多端数据':null">
			<u-tabs v-if="!openId" bar-width='60' :list="[{name:'注册'},{name:'登陆'}]" :is-scroll="false" :current="loginCurrent"
			 @change="loginChange"></u-tabs>
			<u-field v-model="bandEmailData.email" label="邮箱" placeholder="请填写邮箱" required maxlength='30'>
			</u-field>
			<u-field v-if="loginCurrent===0||!!openId" v-model="bandEmailData.authCode" label="验证码" placeholder="请填写验证码"
			 required maxlength='6'>
				<u-button size="mini" slot="right" type="success" @click="getAuthCode" :disabled="getAuthCodeDis">{{getAuthCodeStr}}</u-button>
			</u-field>
			<u-field v-model="bandEmailData.password" label="密码" placeholder="请填写密码" required maxlength='15'>
			</u-field>
			<u-field v-if="loginCurrent===0||!!openId" v-model="bandEmailData.password2" label="确认密码" placeholder="请再次填写密码"
			 required maxlength='15'>
			</u-field>
		</u-modal>
		<!-- 提示框 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {} from '@/common/util/API.js'
	export default {
		data() {
			return {
				avatarSrc: '',
				openId: uni.getStorageSync('openId') || '', //判断小程序是否登陆了的,且是用户的唯一凭据
				isLogin: false, //判断h5是否登陆了的
				bandEmailShow: false,
				bandEmailData: {
					email: '',
					authCode: '',
					password: '',
					password2: ''
				},
				getAuthCodeStr: '获取验证码',
				getAuthCodeDis: false,
				loginCurrent: 1
			}
		},
		methods: {
			// dianwo(){
			// 	console.log('测试session')
			// 	ceshi().then(res=>{
			// 		console.log('ceshi 返回:',res)
			// 	})
			// },
			// dianwo2(){
			// 	console.log('测试session2')
			// 	ceshi2().then(res=>{
			// 		console.log('ceshi2 返回:',res)
			// 	})
			// },
			// 点击grid布局
			clickGrid(e) {
				console.log('clickGrid', e)
				switch (e) {
					case 'myList':
						uni.navigateTo({
							url: '/pages/myInfo/myList/myList'
						});
						break;
					case 'addItem':
						uni.navigateTo({
							url: '/pages/myInfo/addItem/addItem'
						});
						break;
					case 'groupList':
						uni.navigateTo({
							url: '/pages/myInfo/groupList/groupList'
						});
						break;
					default:
						break;
				}

			},
			contactUs() {
				uni.navigateTo({
					url: '/pages/myInfo/contactUs/contactUs'
				})
			},
			// 登陆
			login() {
				// h5端登陆
				// #ifdef H5
				// 绑定邮箱
				this.bandEmailShow = true
				// #endif

				// 小程序端登陆
				// #ifdef MP-WEIXIN
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						console.log(loginRes);
						if (loginRes.code) {
							// 拿到了code
							uni.request({
								url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxce981d801d87f93b&secret=22d57186c09e45c7085e78ac298e7982&js_code=' +
									loginRes.code + '&grant_type=authorization_code',
								success: (res) => {
									console.log(res);
									uni.setStorage({
										key: 'openId',
										data: res.data.openid,
										success: function() {
											console.log('存入openid本地 success');
										}
									});
									this.openId = res.data.openid
									// 绑定邮箱
									this.bandEmailShow = true
								}
							});
						}
					}
				});
				// #endif
			},
			// 获取验证码
			getAuthCode() {
				let count = 0
				this.getAuthCodeDis = true
				let changeStrId = setInterval(() => {
					this.getAuthCodeStr = 60 - count + 's'
					count++
					if (this.getAuthCodeStr === '0s') {
						window.clearInterval(changeStrId)
						this.getAuthCodeStr = '获取验证码'
						this.getAuthCodeDis = false
					}
				}, 1000)
			},
			// 绑定邮箱和密码,用于其他端登陆
			bandEmail() {
				console.log('biandemail', this.bandEmailData)
				if (this.loginCurrent === 0 || !!this.openId) {
					// 微信绑定邮箱或h5注册
					if (Object.values(this.bandEmailData).findIndex(i => i.trim() === '') > -1) {
						this.bandEmailShow = true
						this.$refs.uToast.show({
							title: '请填写完整',
							type: 'warning',
							duration: 900
						})
					} else if (this.bandEmailData.password !== this.bandEmailData.password2) {
						this.bandEmailShow = true
						this.$refs.uToast.show({
							title: '两次密码不一致',
							type: 'warning',
							duration: 900
						})
					} else {
						// 验证通过进行注册
					}
				} else {
					// 登陆
					if (this.bandEmailData.email.trim() === '' || this.bandEmailData.password.trim() === '') {
						this.bandEmailShow = true
						this.$refs.uToast.show({
							title: '请填写完整',
							type: 'warning',
							duration: 900
						})
					} else {
						//验证通过登陆
					}
				}
			},
			loginChange(index) {
				this.loginCurrent = index;
			}

		}
	}
</script>

<style scoped lang="scss">
	.myInfo {
		width: 100vw;
		height: calc(100vh - var(--window-top) - var(--window-bottom));
		background-color: #f5f5f5;

		.avatar {
			display: flex;
			align-items: center;
			background-color: #3cdc50;
			padding: 50rpx 30rpx;

			.login {
				font-size: 40rpx;
				margin-left: 35rpx;
				color: white;
			}

			.userName {
				font-size: 40rpx;
				margin-left: 35rpx;
				color: #000;
			}
		}

		// #ifdef MP-WEIXIN
		.WXavatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
		}

		// #endif

		.section {
			background-color: #FFFFFF;
			height: 100rpx;
			line-height: 100rpx;
		}

		.grid {
			margin-bottom: 30rpx;

			.grid-text {
				font-size: 28rpx;
				margin-top: 4rpx;
				color: $u-type-info;
			}
		}


	}
</style>
