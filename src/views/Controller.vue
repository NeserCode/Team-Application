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
						localStorage.getItem("appKey") == null
					)
						this.handleSaveAppkey(data.data.appInfo.key)
					else if (data.data.appInfo.key == null)
						this.handleRebuildKey("appkey")
					else if (data.data.userInfo.key == null)
						this.handleRebuildKey("userkey")
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
	},
}
</script>

<style scoped lang="postcss">
.Controller {
	@apply hidden;
}
</style>
