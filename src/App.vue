<template>
	<div id="AppView">
		<Controller />
		<appViewHead
			:isSettingCloseDirect="isSettingCloseDirect"
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

<script setup>
import appViewHead from "@/components/Frameworks/Header/index.vue"
import appViewFoot from "@/components/Frameworks/Footer/index.vue"
import AppMainContainer from "@/components/Frameworks/Container/index.vue"
import Navigation from "@/components/Frameworks/Navigation/index.vue"
import Controller from "@/views/Controller.vue"
const { ipcRenderer } = window.require("electron")
import { ref, onBeforeMount, inject, nextTick, provide } from "vue"
import { AnnouncementKey, HostKey, SettingKey, UserStatusKey } from "@/tokens"

const $conf = inject("$conf")
const $public = inject("$public")

const appTitle = ref("Team Application")
const statusReal = ref({
	status: "success",
	text: "😀 Thank your usage for Team Application",
})
const isSettingCloseDirect = ref(false)
const setting = ref(null),
	announcement = ref(null),
	host = ref(null),
	userStatus = ref({
		isSuper: false,
		isHost: false,
		isLogined: false,
	})

provide(HostKey, host)
provide(SettingKey, setting)
provide(AnnouncementKey, announcement)
provide(UserStatusKey, userStatus)

//listen public response $public.on('',()=>{})
$public.on("update-footer-status-upto-app", (status) => {
	statusReal.value.status = status.status
	statusReal.value.text = status.text
})
$public.on("update-app-title", (title) => {
	appTitle.value = `${title} - Team Application`
})
$public.on("update-header-need-close-direct", (symbol) => {
	isSettingCloseDirect.value = symbol
})

$conf.getConfPromise().then(async (data) => {
	setting.value = data.data
	$conf.getHost().then((res) => {
		host.value = res
		$conf
			.allAnnouncement({
				host: res.host,
			})
			.then(async (res) => {
				announcement.value = res.data
				const { isHost, isSuper } = await ensureHostorSuperUser(
					data.data.userInfo
				)
				userStatus.value.isHost = isHost
				userStatus.value.isSuper = isSuper
				userStatus.value.isLogined = !(
					localStorage.getItem("checkKey") == (undefined || null)
				)

				nextTick(() => {
					initApp()
					$public.emit("app-provided")
				})
			})
	})
})

async function ensureHostorSuperUser(info, cb) {
	let superUser = !!info.super
	let hostUser = false

	const { data } = await $conf.queryHostOrganizationById({
		host: host.value.host,
		id: info.id,
	})

	hostUser = data.length > 0

	cb && cb()
	return { isSuper: superUser, isHost: hostUser }
}

onBeforeMount(() => {
	// document.onmousedown = (e) => {
	//   if (e.button == 2) console.log("你按下了右键");
	// };
	// document.onmouseup = (e) => {
	//   if (e.button == 2) console.log("你松开了右键");
	// };
})

function initSettings() {
	isSettingCloseDirect.value = setting.value.userSetting.alwaysCloseDirect
	//判定并实际操作主进程
	if (setting.value.userSetting.alwaysOnTop)
		ipcRenderer.send("setting-always-on-top")
	else ipcRenderer.send("setting-always-not-top")
}

function initApp() {
	initSettings()
	// console.log("Flush => Ctrl + M\nTools => Ctrl + Q");
}
</script>

<style scoped lang="postcss">
#AppView {
	@apply relative w-full h-full min-w-full min-h-full overflow-hidden select-none border box-border;
}
</style>

<style lang="postcss">
html.dark {
	color-scheme: dark;
}

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
	font-family: CangerXS;
	src: url("../src/assets/fonts/CangerXuansanM-W03.ttf");
}

@font-face {
	font-family: HanYiWH;
	src: url("../src/assets/fonts/HYWenHei-55S.ttf");
}

@font-face {
	font-family: HanSerif;
	src: url("../src/assets/fonts/SourceHanSerifCN-Medium-6.otf");
}

@font-face {
	font-family: Helvetica_otf;
	src: url("../src/assets/fonts/Helvetica.otf");
}
</style>

<style lang="postcss">
button.btn {
	@apply inline-flex justify-center items-center px-4 py-2 rounded-md
	border-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200
	border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600
	focus:bg-gray-200 dark:focus:bg-gray-600 focus:ring-2
	transition-all shadow;
}
button.btn:active {
	@apply bg-gray-400 dark:bg-gray-500;
}
</style>
