<template>
	<div class="Controller"></div>
</template>

<script>
import { SettingKey, HostKey } from "@/tokens"

export default {
	name: "Controller",
	inject: {
		host: {
			from: HostKey,
		},
		setting: {
			from: SettingKey,
		},
	},
	watch: {
		"$route.name"(val) {
			this.$public.emit("update-app-title", val)
		},
	},
	data() {
		return {}
	},
	created() {},
	beforeCreate() {
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
		this.$public.on("user-sign-in", ({ info, detail }) => {
			this.updateConfig({ info, detail })
		})
		this.$public.on("user-sign-out", () => {
			localStorage.removeItem("userKey")
			localStorage.removeItem("username")
			localStorage.removeItem("checkKey")
			localStorage.removeItem("avatar")

			this.$nextTick(() => {
				this.$router.push("/sign")
			})
		})

		this.$public.on("rebuild-app-key", () => {
			this.handleRebuildKey("appkey")
		})
		this.$public.on("check-all-key", () => {
			this.handleCheckKey()
		})

		this.$public.on("app-provided", () => {
			this.initController()
		})

		this.$public.on("need-update-user", () => {
			this.autoKeyUpdateDetail()
		})

		this.$conf.setConfigListener(() => {
			// console.log(prev, curr)
			this.$public.emit("config-updated")
		})
	},
	mounted() {
		this.$nextTick(() => {
			this.$public.emit("need-update-user")
		})
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
			this.$public.emit("notice", {
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
		},
		handleCheckKey: function () {
			if (
				this.setting.appInfo.key != null &&
				localStorage.getItem("appKey") == (null || "")
			)
				this.handleSaveAppkey(this.setting.appInfo.key)
			else if (this.setting.appInfo.key == (null || ""))
				this.handleRebuildKey("appkey")
			else if (this.setting.userInfo.key == (null || ""))
				this.handleRebuildKey("userkey")
		},
		initUser: function () {
			if (localStorage.getItem("checkKey") != (null || undefined))
				console.log(`#checkKey [${localStorage.getItem("checkKey")}]`)
			localStorage.setItem("appKey", this.setting.appInfo.key)
		},
		initController: function () {
			this.initUser()
			this.handleCheckKey()
		},
		autoKeyUpdateDetail: function () {
			this.$conf
				.getDetailByKeys({
					host: this.host.host,
					userKey: localStorage.getItem("userKey"),
					checkKey: localStorage.getItem("checkKey"),
				})
				.then((res) => {
					if (res.status !== 200) {
						this.$public.emit("notice", {
							type: "info",
							msg: `自动信息更新失败 ${res.data.message}`,
						})
						this.$public.emit("update-from-keys-failed")
					} else {
						const { detail, info } = res.data

						this.$public.emit("notice", {
							type: "success",
							msg: `Auto CheckKey to Update Datails`,
						})
						this.$public.emit("update-avatar", detail.avatar)
						this.updateConfig({
							detail,
							info,
						})
					}
				})
		},
		updateConfig: function ({ info, detail }) {
			let tempSetting = this.setting

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

					localStorage.setItem("userKey", info.userKey)
					localStorage.setItem("username", info.username)

					this.$public.emit("update-check-day")
					this.$public.emit("update-username")
					this.$public.emit("controller-sign-in")
				})
				.catch((e) => {
					console.log(e.message)
					this.$public.emit("notice", {
						type: "error",
						msg: "用户信息同步失败，您可能需要重新登录",
					})
				})
		},
	},
}
</script>

<style scoped lang="postcss">
.Controller {
	@apply hidden;
}
</style>
