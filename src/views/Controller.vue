<template>
	<div class="Controller"></div>
</template>

<script>
export default {
	name: "Controller",
	watch: {
		"$route.name"(val) {
			this.$public.emit("update-app-title", val)
		},
	},
	mounted() {
		this.$public.on("rebuild-app-key", () => {
			this.handleRebuildKey("appkey")
		})
		this.$public.on("check-all-key", () => {
			this.handleCheckKey()
		})

		this.initController()
	},
	data() {
		return {}
	},
	methods: {
		handleRebuildKey: function (...option) {
			if (option.length == 0) {
				this.APP_CONFIG.appInfo.key = this.$conf.getRandomKey(16)
				this.APP_CONFIG.userInfo.key = this.$conf.getRandomKey(16)
			} else if (
				option.indexOf("appkey") != -1 &&
				option.indexOf("userkey") == -1
			)
				this.$public.emit("notice", {
					type: "error",
					time: 10000,
					msg: `键值检查中检测到应用键值异常，请重启应用以重新获取应用键值 ${option}`,
				})
			else if (
				option.indexOf("userkey") != -1 &&
				option.indexOf("appkey") == -1
			)
				this.$public.emit("notice", {
					type: "error",
					time: 10000,
					msg: `键值检查中检测到用户键值异常，请重新注册账号以重新获取用户键值或联系管理员获取 ${option}`,
				})
			else {
				this.$public.emit("notice", {
					type: "error",
					time: 10000,
					msg: `键值检查中检测到多键值异常 请联系管理员 ${option}`,
				})
			}
		},
		handleSaveAppkey: function (key) {
			localStorage.setItem("appKey", key)
			this.$public
				.emit("notice", {
					type: "warning",
					time: 5000,
					msg: `检测到新生成的应用键值 正在为您挂载`,
					fn: () => {
						this.$public.emit("notice", {
							type: "success",
							msg: `键值挂载完毕`,
						})
					},
				})
				.catch((err) => {
					this.$public.emit("notice", {
						type: "error",
						time: 5000,
						msg: `键值挂载失败 ${err}`,
					})
				})
		},
		handleCheckKey: function () {
			this.$conf
				.getConfPromise()
				.then((data) => {
					if (
						data.data.appInfo.key != null &&
						localStorage.getItem("appKey") == (null || "")
					)
						this.handleSaveAppkey(data.data.appInfo.key)
					else if (data.data.appInfo.key == (null || ""))
						this.handleRebuildKey("appkey")
					else if (data.data.userInfo.key == (null || ""))
						this.handleRebuildKey("userkey")
				})
				.then(() => {
					this.$conf.getHost().then((h) => {
						this.$conf
							.getDetailByKeys({
								host: this.$conf.getHttpString(h.host),
								userKey: localStorage.getItem("userKey"),
								checkKey: localStorage.getItem("checkKey"),
							})
							.then((res) => {
								const { detail, info } = res.data
								this.updateConfig({ detail, info })
							})
					})
				})
				.catch((e) => {
					console.log(e)
				})
		},
		initUser: function () {
			if (localStorage.getItem("checkKey") != (null || undefined))
				console.log(`#checkKey [${localStorage.getItem("checkKey")}]`)
		},
		initController: function () {
			this.handleCheckKey()
			this.initUser()
		},
		updateConfig: function ({ info, detail }) {
			this.$conf.getConfPromise().then((data) => {
				let tempSetting = data.data

				// User Access
				tempSetting.userInfo = {}
				tempSetting.userInfo.id = detail.id
				tempSetting.userInfo.access = detail.access_status
				tempSetting.userInfo.organization = detail.access_team
				tempSetting.userInfo.oPosition = detail.access_position
				// User Sex
				tempSetting.userInfo.sex = detail.sex
				// User Avatar
				tempSetting.userInfo.avatar = detail.avatar
				// User Nickname
				tempSetting.userInfo.nickname = detail.nickname
				// User Introduce
				tempSetting.userInfo.introduce = detail.introduce
				// User Bound
				tempSetting.userInfo.bound = detail.bound
				// User Exp
				tempSetting.userInfo.exp = detail.exp
				// User Name
				tempSetting.userInfo.name = info.username
				// User Key
				tempSetting.userInfo.key = info.userKey
				// Super User
				tempSetting.userInfo.super = !!info.super

				this.$conf
					.updateLocalConfig(tempSetting, () => {
						this.$public.emit("notice", {
							type: "success",
							msg: "用户信息同步成功",
						})
						localStorage.setItem("checkKey", info.checkKey)
						localStorage.setItem("userKey", info.userKey)
						localStorage.setItem("appKey", tempSetting.appInfo.key)
						localStorage.setItem("username", info.username)
						this.$public.emit("update-check-day")
						this.$public.emit("update-username")
					})
					.catch((e) => {
						console.log(e.message)
						this.$public.emit("notice", {
							type: "error",
							msg: "用户信息同步失败，您可能需要重新登录",
						})
					})
			})
		},
	},
	beforeCreate() {
		this.$public.on(
			"update-main-user-info-upto-app",
			({ info, detail }) => {
				this.updateConfig({ info, detail })
			}
		)

		this.$public.on("notice", ({ title, msg, type, time, fn }) => {
			let duration = 3000,
				position = "bottom-right"

			this.$notify({
				title,
				message: msg,
				type: type == "loading" ? "info" : type,
				duration: time ?? duration,
				position,
				onClose: fn,
				showClose: false,
				offset: 25,
			})
			this.$public.emit("update-footer-status-upto-app", {
				status: type ?? "Loading",
				text: msg,
			})
		})
	},
}
</script>

<style scoped lang="postcss">
.Controller {
	@apply hidden;
}
</style>
