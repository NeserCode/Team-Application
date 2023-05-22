<template>
	<div class="leetcodeSetting">
		<SettingOption
			:opTitle="Leetcode_Session.title"
			opType="input"
			:opTip="Leetcode_Session.tip"
			opInputPlaceholder="Cookie Here"
			opExtraValue="LEETCODE_SESSION"
			:opDisabled="isDisabled"
			:opBindValue="Leetcode_Session.value"
			@settingInput="sessionInput"
			@opChange="handleChangeLeetcodeCookie"
			ref="opSession"
		/>
		<SettingOption
			:opTitle="x_csrftoken.title"
			opType="input"
			:opTip="x_csrftoken.tip"
			opExtraValue="x-csrftoken"
			opInputPlaceholder="Cookie Here"
			:opDisabled="isDisabled"
			:opBindValue="x_csrftoken.value"
			@settingInput="tokenInput"
			@opChange="handleChangeLeetcodeCookie"
			ref="opToken"
		/>
	</div>
</template>

<script>
import SettingOption from "@/components/Setting/option/index.vue"
// const { ipcRenderer } = window.require("electron");
import { SettingKey } from "@/tokens"

export default {
	name: "LeetcodeSetting",
	components: { SettingOption },
	inject: {
		setting: {
			from: SettingKey,
		},
	},
	data() {
		return {
			isDisabled: false,
			Leetcode_Session: {
				title: "Leetcode_Session Cookie项",
				value: "",
				tip: `LEETCODE_SESSION值 完成Cookie值的填写 才能以用户身份登入Leetcode \n获取方法: 在Leetcode.cn官方网站登录后于网页控制台查看已经成功响应的网络请求的表头获取`,
			},
			x_csrftoken: {
				title: "X-CsrfToken Cookie项",
				value: "",
				tip: "X-CSRFTOKEN值 完成Cookie值的填写 才能以用户身份登入Leetcode 获取方法同上",
			},
		}
	},
	mounted() {
		const { userAccount } = this.setting

		this.$refs.opSession.initOption(
			userAccount.cookie_leetcode["LEETCODE_SESSION"]
		)
		this.$refs.opToken.initOption(
			userAccount.cookie_leetcode["x-csrftoken"]
		)
	},
	beforeMount() {},
	methods: {
		sessionInput: function (temp) {
			this.Leetcode_Session.value = temp
		},
		tokenInput: function (temp) {
			this.x_csrftoken.value = temp
		},
		handleChangeLeetcodeCookie: function (cookie) {
			this.$leetcode
				.setCookie(
					"https://leetcode-cn.com/graphql/",
					cookie.name,
					cookie.value
				)
				.then(() => {
					this.isDisabled = true
					let data = this.setting
					data.userAccount.cookie_leetcode[cookie.name] = cookie.value
					this.handleChangeSettingAction(data)
					this.$public.emit("opInputEditFinish")
				})
		},
		handleChangeSettingAction: function (setting) {
			this.$conf.updateLocalConfig(setting, (err) => {
				if (err)
					this.$public.emit("notice", {
						msg: "保存时出现了一个错误",
						type: "error",
						fn: () => {
							this.isDisabled = false
						},
					})
				else {
					this.$public.emit("notice", {
						msg: "设置保存成功 正在为您启用设置",
						type: "success",
						fn: () => {
							this.isDisabled = false
						},
					})
				}
			})
		},
	},
}
</script>

<style scoped lang="postcss">
.leetcodeSetting {
	@apply py-8;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>
