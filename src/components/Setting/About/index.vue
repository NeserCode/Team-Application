<template>
	<div class="about">
		<SettingOption
			opTitle="关于作者"
			opType="button"
			opTip="前往 GitHub 查看作者"
			opBtnText="前往"
			:opDisabled="isDisabled"
			:opCallbackFn="goForAuthor"
		/>
		<SettingOption
			opTitle="关于本软件"
			opType="button"
			:opTip="versionTip"
			opBtnText="前往"
			:opDisabled="isDisabled"
			:opCallbackFn="goForSoftware"
		/>
	</div>
</template>

<script>
import SettingOption from "@/components/Setting/option/index.vue"
import { ipcRenderer } from "electron"

var app = require("electron").remote.app

export default {
	name: "About",
	components: { SettingOption },
	data() {
		return {
			isDisabled: false,
			newestVersion: "",
			versionTip: "前往 GitHub 查看本项目 本项目遵循 GUN3.0 协议",
		}
	},
	mounted() {},
	beforeMount() {
		this.$axios
			.get(
				" https://api.github.com/repos/nesercode/team-application/releases/latest"
			)
			.then((res) => {
				this.$log.log(res)
				this.newestVersion = res.data.tag_name
				this.versionTip += `\n当前版本：${app.getVersion()} 最新版本：${
					this.newestVersion
				}\n\n Latest Version\n ${res.data.body}`
			})
	},
	methods: {
		goForAuthor: function () {
			ipcRenderer.send("open-link-extra", "https://github.com/NeserCode")
		},
		goForSoftware: function () {
			ipcRenderer.send(
				"open-link-extra",
				"https://github.com/NeserCode/Team-Application"
			)
		},
	},
}
</script>

<style scoped lang="postcss">
.about {
	@apply py-8;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>
