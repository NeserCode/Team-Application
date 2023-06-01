<template>
	<div class="login">
		<div class="iContainer">
			<SignInput
				ref="iact"
				:readonly="!clickable"
				@keep-input="handleIAccount"
				@keyup.enter="handleSignin"
				:iModel="signIn.username"
				:iCheck="usernameFormat"
				class="iIn"
				iLable="inAccount"
				iPreText="用户名"
				iTip="用户身份标识, 长度需要达到三位以上, 不含有汉字与符号, 大小写不敏感"
			/>
			<SignInput
				ref="ipwd"
				:readonly="!clickable"
				@keep-input="handleIPassword"
				@keyup.enter="handleSignin"
				:iModel="signIn.password"
				:iCheck="passwordFormat"
				class="iIn"
				:iType="options.isShowPassword ? 'text' : 'password'"
				iLable="inPassword"
				iPreText="密码"
				iTip="用于身份认证的密码, 长度需要达到八位以上"
			/>
			<br />
			<div class="optContainer">
				<el-checkbox v-model="options.isShowPassword"
					>显示密码</el-checkbox
				>
				<el-checkbox v-model="options.isOnlineSignIn"
					>在线登录</el-checkbox
				>
				<br />
				<span v-if="options.isOnlineSignIn">{{ IpAddress }}</span>
			</div>
			<div class="btnContainer">
				<button @click="handleSignin">
					<span>登录</span>
					<el-icon class="el-icon-loading" v-show="!clickable">
						<Loading />
					</el-icon>
				</button>
				<button @click="handleForgetPassword">忘记密码</button>
				<button @click="toggleSignModeToUp">切换到注册</button>
			</div>
			<span :class="['signBar', !clickable ? 'loading' : '']"></span>
		</div>
		<forget-password
			:visible="visible.forgetPassword"
			@update:visible="visible.forgetPasswordFn"
			@update:success="handleSuccessPassword"
		/>
	</div>
</template>

<script>
import SignInput from "@/components/Sign/input/index.vue"
import forgetPassword from "@/components/Dialogs/forgetPassword.vue"
import { HostKey } from "@/tokens"

export default {
	name: "Login",
	components: { SignInput, forgetPassword },
	watch: {
		signIn: {
			deep: true,
			handler() {
				if (this.signIn.username.length < 3)
					this.checkText =
						"用户名长度非法 用户名应为3位及以上的纯英文"
				else if (
					this.signIn.username !=
					this.signIn.username.replace(/[^\w]/gi, "")
				)
					this.checkText = "用户名非法 用户名应为3位及以上的纯英文"
				else if (this.signIn.password.length < 8) {
					this.checkText =
						"密码长度非法 密码应为8位以上的数字、字母及符号组成的字符串"
				} else this.checkText = ""
			},
		},
		options: {
			handler() {
				if (this.options.isOnlineSignIn)
					this.$conf
						.getLocalIP()
						.then((ip) => {
							this.IpAddress = `从 ${ip} 登入`
						})
						.catch((e) => {
							this.IpAddress = null
							this.$public.emit("notice", {
								msg: `在线登陆设置错误 ${e.message}`,
								time: 2000,
								fn: () => {
									this.options.isOnlineSignIn = false
								},
							})
						})
			},
			deep: true,
			immediate: true,
		},
	},
	computed: {
		usernameFormat() {
			return (
				this.signIn.username.length >= 3 &&
				this.signIn.username.length <= 12 &&
				this.signIn.username ==
					this.signIn.username.replace(/[^\w]/gi, "")
			)
		},
		passwordFormat() {
			return (
				this.signIn.password.split("").length >= 8 &&
				this.signIn.password.split("").length <= 16
			)
		},
	},
	inject: {
		host: {
			from: HostKey,
		},
	},
	data() {
		return {
			signIn: {
				username: "",
				password: "",
			},
			options: {
				isOnlineSignIn: true,
				isShowPassword: false,
			},
			checkText: "",
			clickable: true,
			IpAddress: null,
			visible: {
				forgetPassword: false,
				forgetPasswordFn: (val) => {
					this.visible.forgetPassword = val
				},
			},
		}
	},
	mounted() {
		if (localStorage.getItem("username") && localStorage.getItem("userKey"))
			this.$router.push("/userArea")
	},
	activated() {},
	unmounted() {
		this.clickable = true
	},
	methods: {
		handleIAccount: function (s) {
			this.signIn.username = s
		},
		handleIPassword: function (s) {
			this.signIn.password = s
		},
		toggleSignModeToUp: function () {
			this.signIn.username = ""
			this.signIn.password = ""
			this.$public.emit("change-login-or-register-view", false)
		},
		handleForgetPassword: function () {
			this.visible.forgetPassword = true
		},
		handleSuccessPassword: function () {
			this.$public.emit("notice", {
				type: "success",
				msg: "密码修改成功",
				time: 2000,
			})
		},
		handleSignin: function () {
			if (this.clickable) {
				if (this.signIn.username.length < 1)
					this.$refs.iact.handleShakeInput()
				else if (this.signIn.password.length < 1)
					this.$refs.ipwd.handleShakeInput()
				else if (this.checkText.length >= 2) {
					this.clickable = false
					this.$public.emit("notice", {
						type: "error",
						msg: this.checkText,
						time: 2200,
						fn: () => {
							this.clickable = true
						},
					})
				} else {
					this.clickable = false
					let ck = this.$conf.getMd5String(
						this.IpAddress ?? this.host.host
					)
					this.$conf
						.handleUserSignIn({
							host: this.host.host,
							username: this.signIn.username,
							password: this.$conf.getMd5String(
								this.signIn.password
							),
							appkey: localStorage.getItem("appKey"),
							checkkey: ck,
						})
						.then((response) => {
							if (response.data.length === 0)
								return this.$public.emit("notice", {
									type: "error",
									msg: "登陆失败, 请检查您的输入数据",
									fn: () => {
										this.clickable = true
									},
								})
							const { info, detail } = response.data
							if (info.status)
								return this.$public.emit("notice", {
									type: "warning",
									msg: "封禁用户暂时无法登录",
									fn: () => {
										this.clickable = true
									},
								})
							localStorage.setItem("checkKey", ck)
							if (info.userKey.length < 16)
								this.$public.emit("notice", {
									type: "warning",
									msg: "用户键值缺失异常",
									fn: () => {
										this.clickable = true
									},
								})
							else if (info.appKey.length < 16) {
								this.$public.emit("notice", {
									type: "warning",
									msg: "应用键值缺失异常",
									fn: () => {
										this.clickable = true
									},
								})
							}

							this.$public.emit("notice", {
								type: "success",
								msg: `欢迎您，${info.username}`,
								time: 3000,
								fn: () => {
									this.$public.emit("user-sign-in", {
										info,
										detail,
									})

									this.signIn.username = ""
									this.signIn.password = ""
									this.options.isOnlineSignIn = true
									this.options.isShowPassword = false

									this.clickable = true
									this.$router.push("/userArea")
								},
							})
						})
						.catch((e) => {
							if (e.response.status == 502)
								this.$public.emit("notice", {
									type: "error",
									msg: "登陆错误, 请检查您的应用状态配置",
									fn: () => {
										this.clickable = true
									},
								})
							else
								this.$public.emit("notice", {
									type: "error",
									msg: "登陆错误, 请检查您输入的用户名和密码",
									fn: () => {
										this.clickable = true
									},
								})
						})
				}
			}
		},
	},
}
</script>

<style scoped lang="postcss">
.login {
	@apply w-full h-auto;
	font-family: Consolas, "HanSerif";
}

.iContainer {
	@apply relative flex flex-col justify-center items-center w-1/3 h-full mx-auto pt-16 pb-8
	rounded overflow-hidden;
	min-width: 650px;
}

.iIn {
	@apply w-1/3 inline-block my-4;
}

.btnContainer {
	@apply inline-flex w-1/2 justify-between;
}

.signBar {
	@apply absolute top-0 rounded-b-full inline-block bg-blue-400 w-full h-0 transition-all;
}
.signBar.loading {
	animation: loading infinite 1.5s ease-in-out;
}

.optContainer {
	@apply inline-block pb-8;
}
.optContainer span {
	@apply inline-block w-full text-center text-xs font-semibold opacity-75;
}

button {
	@apply inline-flex justify-center items-center px-4 py-2 rounded-md
	border-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200
	border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600
	transition-all shadow;
}

.el-icon-loading {
	@apply inline-block ml-1;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}

@keyframes loading {
	0% {
		@apply bg-blue-400 w-full opacity-100 bottom-0 h-0;
	}
	5% {
		@apply bg-blue-400 w-1.5 opacity-0 bottom-4;
	}
	50% {
		@apply bg-blue-400 w-1.5 h-1.5 opacity-100;
	}
	60% {
		@apply bg-blue-400 w-1.5 h-px opacity-100 bottom-0;
	}
	65% {
		@apply bg-blue-900 h-px;
	}
	90% {
		@apply bg-blue-400 h-px;
	}
	100% {
		@apply bg-blue-400 h-0;
	}
}
</style>
