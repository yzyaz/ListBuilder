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
				<text class="login" @click="login">登陆</text>
			</block>
			<block v-else>
				<open-data class="WXavatar" type="userAvatarUrl"></open-data>
				<open-data class="userName" type="userNickName"></open-data>
			</block>
			<!-- #endif -->
			<!-- <text class="myName" v-else>已登录ui</text> -->
		</view>
		<view class="section">
			<u-section class="" title="编辑我的列表" sub-title="查看更多"></u-section>
		</view>
		<view class="grid">
			<u-grid :col="3">
				<u-grid-item @click="clickGrid('gift')">
					<u-icon name="gift" :size="46"></u-icon>
					<view class="grid-text">会员</view>
				</u-grid-item>
				<u-grid-item @click="clickGrid('calendar')">
					<u-icon name="calendar" :size="46"></u-icon>
					<view class="grid-text">数据</view>
				</u-grid-item>
				<u-grid-item @click="clickGrid('eye')">
					<u-icon name="eye" :size="46"></u-icon>
					<view class="grid-text">浏览量</view>
				</u-grid-item>
			</u-grid>

		</view>
		<view class="section">
			<u-section class="" title="联系我们" sub-title="　"></u-section>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarSrc: '',
				openId: uni.getStorageSync('openId')||'',//判断小程序是否登陆了的,且是用户的唯一凭据
				isLogin: false, //判断h5是否登陆了的
			}
		},
		methods: {
			// 点击grid布局
			clickGrid(e) {
				console.log('clickGrid', e)
			},
			// 登陆
			login() {
				
				// 小程序端登陆
				// #ifdef MP-WEIXIN
				uni.login({
					provider: 'weixin',
					success:(loginRes)=> {
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
									    success: function () {
									        console.log('存入openid本地 success');
									    }
									});
									this.openId = res.data.openid
								}
							});
						}
					}
				});
				// #endif
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
