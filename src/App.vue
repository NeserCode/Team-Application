<template>
	<div id="AppView">
		<Controller />
		<appViewHead
			:isSettingCloseDirect="needs.isSettingCloseDirect"
			:title="appTitle"
		></appViewHead>
		<Navigation />
		<AppMainContainer />
		<appViewFoot
			:status="statusReal.status"
			:statusText="statusReal.text"
		></appViewFoot>
	</div>
</template>

<script>
import appViewHead from "@/components/Frameworks/Header/index.vue"
import appViewFoot from "@/components/Frameworks/Footer/index.vue"
import AppMainContainer from "@/components/Frameworks/Container/index.vue"
import Navigation from "@/components/Frameworks/Navigation/index.vue"
import Controller from "@/views/Controller.vue"
const { ipcRenderer } = window.require("electron")

export default {
	name: "App",
	components: {
		appViewHead,
		appViewFoot,
		AppMainContainer,
		Navigation,
		Controller,
	},
	beforeMount() {
		// document.onmousedown = (e) => {
		//   if (e.button == 2) console.log("你按下了右键");
		// };
		// document.onmouseup = (e) => {
		//   if (e.button == 2) console.log("你松开了右键");
		// };
	},
	mounted() {
		//listen public response this.$public.on('',()=>{})
		this.$public.on("update-footer-status-upto-app", (status) => {
			this.statusReal.status = status.status
			this.statusReal.text = status.text
		})
		this.$public.on("update-app-title", (title) => {
			this.appTitle = `${title} - Team Application`
		})
		this.$public.on("update-header-need-close-direct", (symbol) => {
			this.needs.isSettingCloseDirect = symbol
		})

		this.$conf.getConfPromise().then((data) => {
			this.needs.setting = data.data
			setTimeout(() => {
				this.initApp()
				this.$public.emit("app-mounted", data.data)
			}, 50)
		})
	},
	data() {
		return {
			appTitle: "Team Application",
			statusReal: {
				status: "success",
				text: "😀 Thank your usage for Team Application",
			},
			needs: {
				isSettingCloseDirect: false,
				setting: null,
			},
		}
	},
	methods: {
		initSettings: function () {
			this.needs.isSettingCloseDirect =
				this.needs.setting.userSetting.alwaysCloseDirect
			//判定并实际操作主进程
			if (this.needs.setting.userSetting.alwaysOnTop)
				ipcRenderer.send("setting-always-on-top")
			else ipcRenderer.send("setting-always-not-top")

			if (this.needs.setting.userSetting.colorSchemeMode == "light") {
				ipcRenderer.send("color-schemeMode-light")
				document.querySelector("html").classList.remove("dark")
			} else if (this.needs.setting.userSetting.colorSchemeMode == "dark") {
				ipcRenderer.send("color-schemeMode-dark")
				document.querySelector("html").classList.add("dark")
			} else ipcRenderer.send("color-schemeMode-system")

			const themeMedia = window.matchMedia("(prefers-color-scheme: light)")
			if (themeMedia.matches)
				document.querySelector("html").classList.remove("dark")
			else document.querySelector("html").classList.add("dark")
		},

		initApp: function () {
			this.initSettings()
			// console.log("Flush => Ctrl + M\nTools => Ctrl + Q");
		},
	},
}
</script>

<style scoped lang="postcss">
#AppView {
	@apply relative w-full h-full min-w-full min-h-full overflow-hidden select-none border box-border;
}
</style>

<style lang="postcss">
.appViewHead,
.appViewFoot,
.navigation {
	z-index: 2009;
}
.appViewHead {
}

:deep().el-message {
	z-index: 10000;
}

a {
	-webkit-user-drag: none;
}

pre {
	@apply whitespace-pre-wrap;
}

@media (prefers-color-scheme: dark) {
	#AppView {
		@apply text-gray-100 bg-gray-800 border-gray-400;
	}
	.appViewHead {
		@apply bg-gray-800 text-gray-200;
	}
	.navigation {
		@apply bg-gray-700 text-gray-200;
	}
	.AppMainContainer,
	.UserArea {
		@apply bg-gray-800;
	}
	:deep(.el-divider__text) {
		@apply bg-gray-800 text-gray-200;
	}
}

@media (prefers-color-scheme: light) {
	#AppView {
		@apply text-gray-800 bg-gray-100 border-gray-400;
	}
	.appViewHead {
		@apply bg-transparent text-gray-800;
	}
	.navigation {
		@apply bg-white text-gray-800;
	}
	.AppMainContainer,
	.UserArea {
		@apply bg-gray-100;
	}
}

/* 需要补充 滚动条多余边距的填充 */
/*
  .hasScreenScrollBar {
    @apply absolute w-screen h-screen overflow-hidden;
  }
  .hasScreenScrollBar::-webkit-scrollbar,
  .hasScreenScrollBar::-webkit-scrollbar-thumb {
    -webkit-appearance: none;
    width: 0;
    height: 0;
  }
*/
/* 已经废弃，需要重新制作拟态滚动条 */

@font-face {
	font-family: Canger_xwz;
	src: url("../src/assets/fonts/Canger_xwz.ttf");
}
@font-face {
	font-family: Canger_zkzdbs;
	src: url("../src/assets/fonts/Canger_zkzdbs.ttf");
}
@font-face {
	font-family: Helvetica_otf;
	src: url("../src/assets/fonts/Helvetica.otf");
}
</style>
