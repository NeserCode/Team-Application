<template>
	<div class="appViewHead">
		<div class="headDargArea">
			<img class="logo" src="@/assets/logo.png" />
			<span class="titleFromProp">{{ title }}</span>
		</div>
		<div class="headOpArea">
			<div class="minimize option" @click="handleMinimizeWindow">
				<a>
					<svg
						t="1634436877401"
						class="icon"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="3418"
						:width="headIconSize"
						:height="headIconSize"
					>
						<path
							d="M96 768h832c17.673 0 32 14.327 32 32s-14.327 32-32 32H96c-17.673 0-32-14.327-32-32s14.327-32 32-32z"
							p-id="3419"
							:fill="headIconFill.normal"
						/>
					</svg>
				</a>
			</div>
			<div class="maximize option" @click="handleMaximizeWindow">
				<a v-show="!isAppFullScreen">
					<svg
						t="1634294452726"
						class="icon"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="6288"
						:width="headIconSize"
						:height="headIconSize"
					>
						<path
							d="M339.432 63.594H99.944c-19.851 0-36 16.149-36 36v239.488c0 17.673 14.327 32 32 32s32-14.327 32-32V127.594h211.487c17.673 0 32-14.327 32-32 0.001-17.673-14.326-32-31.999-32zM339.432 895.503H127.944V684.016c0-17.673-14.327-32-32-32s-32 14.327-32 32v239.487c0 19.851 16.149 36 36 36h239.487c17.673 0 32-14.327 32-32s-14.326-32-31.999-32zM928 651.915c-17.673 0-32 14.327-32 32v211.487H684.513c-17.673 0-32 14.327-32 32s14.327 32 32 32H924c19.851 0 36-16.149 36-36V683.915c0-17.673-14.327-32-32-32zM924 64.151H684.513c-17.673 0-32 14.327-32 32s14.327 32 32 32H896v211.488c0 17.673 14.327 32 32 32s32-14.327 32-32V100.151c0-19.851-16.149-36-36-36z"
							:fill="headIconFill.normal"
							p-id="6289"
						/>
					</svg>
				</a>
				<a v-show="isAppFullScreen">
					<svg
						t="1634294204682"
						class="icon"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="5604"
						:width="headIconSize"
						:height="headIconSize"
					>
						<path
							d="M95.944 371.082h239.487c19.851 0 36-16.149 36-36V95.594c0-17.673-14.327-32-32-32s-32 14.327-32 32v211.488H95.944c-17.673 0-32 14.327-32 32 0 17.672 14.327 32 32 32zM95.944 716.016h211.487v211.487c0 17.673 14.327 32 32 32s32-14.327 32-32V688.016c0-19.851-16.149-36-36-36H95.944c-17.673 0-32 14.327-32 32s14.327 32 32 32zM684.513 959.402c17.673 0 32-14.327 32-32V715.915H928c17.673 0 32-14.327 32-32s-14.327-32-32-32H688.513c-19.851 0-36 16.149-36 36v239.487c0 17.673 14.327 32 32 32zM688.513 371.639H928c17.673 0 32-14.327 32-32s-14.327-32-32-32H716.513V96.151c0-17.673-14.327-32-32-32s-32 14.327-32 32v239.488c0 19.85 16.149 36 36 36z"
							:fill="headIconFill.normal"
							p-id="5605"
						/>
					</svg>
				</a>
			</div>
			<div
				class="close option"
				@click="handleCloseWindow(isSettingCloseDirect)"
			>
				<a>
					<svg
						t="1634297261959"
						class="icon"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="1584"
						:width="headIconSize"
						:height="headIconSize"
					>
						<path
							d="M544.448 499.2l284.576-284.576a32 32 0 0 0-45.248-45.248L499.2 453.952 214.624 169.376a32 32 0 0 0-45.248 45.248l284.576 284.576-284.576 284.576a32 32 0 0 0 45.248 45.248l284.576-284.576 284.576 284.576a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0-45.248L544.448 499.2z"
							p-id="1585"
							:fill="headIconFill.normal"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
const { ipcRenderer } = window.require("electron")

export default {
	name: "appViewHead",
	props: {
		title: {
			type: String,
		},
		isSettingCloseDirect: {
			type: Boolean,
			default: () => false,
		},
	},
	beforeCreate() {
		ipcRenderer.on("main-window-max", () => {
			this.isAppFullScreen = true
			this.$public.emit("app-full-screen", true)
		})
		ipcRenderer.on("main-window-unmax", () => {
			this.isAppFullScreen = false
			this.$public.emit("app-full-screen", false)
		})
		// console.log('自动清理已启用');
		// ipcRenderer.on("before-main-window-destory", () => {
		//   localStorage.clear();
		// });
	},
	data() {
		return {
			isAppFullScreen: false,
			headIconFill: {
				normal: "#999",
				confirm: "#fff",
			},
			headIconSize: 15,
		}
	},
	methods: {
		// initComponent: function () {},
		handleMinimizeWindow: function () {
			ipcRenderer.send("window-min")
		},
		handleMaximizeWindow: function () {
			ipcRenderer.send("window-max")
			this.isAppFullScreen = !this.isAppFullScreen
		},
		handleCloseWindow: function (isCloseDirect) {
			if (!isCloseDirect) ipcRenderer.send("hide-in-bar")
			else ipcRenderer.send("window-close")
		},
	},
}
</script>

<style scoped lang="postcss">
.appViewHead {
	@apply fixed top-px h-8;
	width: calc(100% - 2px);
}
.headDargArea {
	@apply h-8 left-0 text-center flex items-center float-left;
}
.headDargArea .logo {
	@apply w-8 h-8 p-1 ml-1 block float-left;
}
.headDargArea .titleFromProp {
	@apply float-left h-8 text-sm overflow-hidden flex justify-center items-center pl-16;
	width: calc(100vw - 11rem - 2px);
}
.headOpArea {
	@apply fixed top-2 right-2;
}
.headOpArea .option {
	@apply float-left;
}
.headOpArea .option a {
	@apply inline-block rounded-lg w-full h-full px-3 py-2 cursor-pointer mx-px;
}
.headOpArea .option a:hover {
	@apply bg-opacity-20 bg-black dark:bg-opacity-20 dark:bg-white;
}
.headOpArea .option a:hover svg path {
	fill: white;
}
.headOpArea .option.close a:hover {
	@apply bg-red-600;
}

@media (prefers-color-scheme: dark) {
	.headDargArea .titleFromProp {
		@apply text-gray-400 font-thin font-mono;
	}
}

@media (prefers-color-scheme: light) {
	.headDargArea .titleFromProp {
		@apply text-gray-900 font-thin font-mono;
	}
}
</style>

<style>
.headDargArea {
	-webkit-app-region: drag;
}
</style>
