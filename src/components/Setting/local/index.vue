<template>
	<div class="localSetting">
		<SettingOption
			opTitle="开发者模式"
			opType="switch"
			:opBindValue="true"
			opTip="开启此选项以获得开发者功能权限"
			:opDisabled="true"
		/>
		<SettingOption
			:opTitle="appOnTop.title"
			opType="switch"
			:opTip="appOnTop.tip"
			:opBindValue="appOnTop.value"
			:opCallbackFn="appOnTop.fn"
		/>
		<SettingOption
			:opTitle="appCloseAction.title"
			opType="switch"
			:opTip="appCloseAction.tip"
			:opBindValue="appCloseAction.value"
			:opCallbackFn="appCloseAction.fn"
		/>
		<SettingOption
			:opTitle="appTheme.title"
			opType="touch"
			:opTip="appTheme.tip"
			:opTouchArray="appTheme.array"
			:opTouchValue="appTheme.value"
		/>
		<SettingOption
			:opTitle="appHostDomain.title"
			opType="input"
			:opTip="appHostDomain.tip"
			opExtraValue="serverDomain"
			opInputPlaceholder="Domain Here"
			:opDisabled="false"
			:opBindValue="appHostDomain.value"
			@settingInput="domainInput"
			@opChange="handleDomainChange"
			ref="opDomain"
		/>
		<SettingOption
			:opTitle="appHostPort.title"
			opType="input"
			:opTip="appHostPort.tip"
			opExtraValue="serverPort"
			opInputPlaceholder="Port Here"
			:opDisabled="false"
			:opBindValue="appHostPort.value"
			@settingInput="portInput"
			@opChange="handlePortChange"
			ref="opPort"
		/>
		<SettingOption
			opTitle="日志缓存"
			opType="button"
			:opTip="LogTip"
			opBtnText="清除缓存"
			:opCallbackFn="clearLog"
		/>
	</div>
</template>

<script>
import SettingOption from "@/components/Setting/option/index.vue"
import { nextTick, reactive } from "vue"
const { ipcRenderer } = window.require("electron")
import { SettingKey } from "@/tokens"

export default {
	name: "LocalSetting",
	components: { SettingOption },
	inject: {
		setting: {
			from: SettingKey,
		},
		$log: {
			from: "$log",
		},
	},
	data() {
		return {
			isClickable: true,
			appOnTop: {
				title: "窗口前置",
				value: false,
				fn: this.handleChangeAppOnTop,
				tip: "开启此选项将本软件页面置于图层最前方",
			},
			appCloseAction: {
				title: "关闭选项",
				value: true,
				fn: this.handleChangeCloseAction,
				tip: "决定点击关闭按钮后应用是最小化还是彻底退出，默认勾选为直接退出",
			},
			appTheme: {
				title: "主题",
				value: "system",
				array: [
					{
						id: 0,
						value: "light",
						choice: "日间主题",
						fn: () => {
							this.handleChangeAppTheme("light")
						},
					},
					{
						id: 1,
						value: "dark",
						choice: "夜间主题",
						fn: () => {
							this.handleChangeAppTheme("dark")
						},
					},
					{
						id: 2,
						value: "system",
						choice: "跟随系统",
						fn: () => {
							this.handleChangeAppTheme("system")
						},
					},
				],
				tip: "选择色彩主题以应对视觉疲劳和损伤",
			},
			appHostDomain: {
				title: "服务器主机地址",
				value: " ",
				tip: "服务器的主机名即域名或者IP 不需要协议与端口 例如:127.0.0.1",
			},
			appHostPort: {
				title: "服务器端口",
				value: " ",
				tip: "服务器运行服务的端口 例如:5999",
			},
			LogTip: "清除本地所有的日志缓存",
			LogSize: reactive(this.$log.AllLogSize),
		}
	},
	watch: {
		LogSize: {
			handler(val) {
				this.LogTip = `清除本地所有的日志缓存\n当前日志缓存大小：${val.size}(${val.rawSize})`
			},
			deep: true,
		},
	},
	beforeMount() {
		const { userSetting } = this.setting
		this.appOnTop.value = userSetting.alwaysOnTop
		this.appCloseAction.value = userSetting.alwaysCloseDirect
		this.appTheme.value = userSetting.colorSchemeMode

		this.$public.on("update-color-mode", (mode) => {
			this.appTheme.value = mode
		})
	},
	mounted() {
		nextTick(() => {
			const { appInfo } = this.setting
			this.$refs.opDomain.initOption(appInfo.domain)
			this.$refs.opPort.initOption(appInfo.port)
			this.appTheme.value =
				localStorage.getItem("color-scheme-mode") ?? "system"
		})
	},
	methods: {
		domainInput: function (temp) {
			this.appHostDomain.value = temp
		},
		portInput: function (temp) {
			this.appHostPort.value = temp
		},
		handleDomainChange: function (e) {
			if (this.isClickable) {
				this.isClickable = false
				this.$refs.opDomain.handleInputEditEnd()

				let temp = this.setting
				temp.appInfo.domain = e.value
				temp.appInfo.host =
					temp.appInfo.domain + ":" + temp.appInfo.port

				this.handleChangeSettingAction(temp, () => {
					if (temp.appInfo.port !== "") {
						if (localStorage.getItem("username")) {
							this.$router.push("/userArea")
							this.$public.emit("notice", {
								msg: "🎈 检测到服务主机地址更改，正在为您登出Team账号",
								time: 3000,
								fn: () => {
									this.$public.emit("user-sign-out")
									this.$router.push("/sign")
								},
							})
						}
					}
				})
			}
		},
		handlePortChange: function (e) {
			if (this.isClickable) {
				this.isClickable = false
				this.$refs.opPort.handleInputEditEnd()

				let temp = this.setting
				temp.appInfo.port = e.value
				temp.appInfo.host =
					temp.appInfo.domain + ":" + temp.appInfo.port

				this.handleChangeSettingAction(temp, () => {
					if (temp.appInfo.domain !== "") {
						this.$router.push("/userArea")
						this.$public.emit("notice", {
							msg: "🎈 检测到服务主机端口更改，正在为您登出Team账号",
							time: 3000,
							fn: () => {
								this.$public.emit("user-sign-out")
							},
						})
					}
				})
			}
		},
		handleChangeAppOnTop: function () {
			if (this.isClickable) {
				this.isClickable = false
				this.appOnTop.value = !this.appOnTop.value

				if (this.appOnTop.value)
					ipcRenderer.send("setting-always-on-top")
				else ipcRenderer.send("setting-always-not-top")

				let data = this.setting
				data.userSetting.alwaysOnTop = this.appOnTop.value
				this.handleChangeSettingAction(data)
			}
		},
		handleChangeCloseAction: function () {
			if (this.isClickable) {
				this.isClickable = false
				this.appCloseAction.value = !this.appCloseAction.value
				if (this.appCloseAction.value)
					this.$public.emit("update-header-need-close-direct", true)
				else this.$public.emit("update-header-need-close-direct", false)

				let data = this.setting
				data.userSetting.alwaysCloseDirect = this.appCloseAction.value
				this.handleChangeSettingAction(data)
			}
		},
		handleChangeAppTheme: function (theme) {
			if (this.isClickable) {
				this.isClickable = false
				this.appTheme.value = theme
				ipcRenderer.send("color-schemeMode-" + theme)

				let data = this.setting
				data.userSetting.colorSchemeMode = this.appTheme.value
				this.handleChangeSettingAction(data)
				this.$public.emit("update-color-mode", theme)
				const themeMedia = window.matchMedia(
					"(prefers-color-scheme: light)"
				)
				if (themeMedia.matches)
					document.querySelector("html").classList.remove("dark")
				else document.querySelector("html").classList.add("dark")
			}
		},
		handleChangeSettingAction: function (setting, cb) {
			this.$conf.updateLocalConfig(setting, (err) => {
				if (err)
					this.$public.emit("notice", {
						msg: "保存时出现了一个错误",
						type: "error",
						fn: () => {
							this.isClickable = true
							if (cb) cb()
						},
					})
				else {
					this.$public.emit("notice", {
						msg: "设置保存成功 正在为您启用设置",
						type: "success",
						fn: () => {
							this.isClickable = true
							if (cb) cb()
						},
					})
				}
			})
		},
		clearLog: function () {
			this.$log.clearAllLog() &&
				this.$public.emit("notice", {
					msg: "清除日志缓存成功",
					type: "success",
				})
		},
	},
}
</script>

<style scoped lang="postcss">
.localSetting {
	@apply py-8;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>
