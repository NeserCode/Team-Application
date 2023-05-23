<template>
	<div class="navigation">
		<UserAvatar
			class="avatar comp"
			@click="handleOpenUserArea"
			v-show="isLogined"
			:image="avatarUrl"
			:isDot="false"
			:isMe="true"
			v-if="!!avatarUrl"
		/>
		<span class="avatar icon" @click="handleOpenUserArea" v-else>
			<el-icon><User /></el-icon
		></span>
		<div class="shiftOperations">
			<span
				class="color-mode"
				@click="switchColorMode"
				v-if="isMatchColorMode('light') || isMatchColorMode('dark')"
			>
				<el-icon v-if="isMatchColorMode('light')"><Sunny /></el-icon>
				<el-icon v-else-if="isMatchColorMode('dark')"><Moon /></el-icon>
			</span>
		</div>
		<router-link
			class="areaLink"
			tabindex="-1"
			:ondragstart="handleKeepDrag"
			to="/home"
			>主页</router-link
		>
		<router-link
			class="areaLink"
			tabindex="-1"
			:ondragstart="handleKeepDrag"
			to="/code"
			>代码</router-link
		>
		<router-link
			class="areaLink"
			tabindex="-1"
			:ondragstart="handleKeepDrag"
			to="/setting"
			>设置</router-link
		>
		<router-link
			class="areaLink"
			v-show="!isLogined"
			:ondragstart="handleKeepDrag"
			to="/sign"
			tabindex="-1"
			>{{ signText }}</router-link
		>
		<router-link
			class="areaLink"
			v-show="isLogined"
			:ondragstart="handleKeepDrag"
			to="/organization"
			tabindex="-1"
			>组织</router-link
		>
		<router-link
			class="areaLink"
			v-show="isLogined && (superUser || hostUser)"
			:ondragstart="handleKeepDrag"
			to="/manage"
			tabindex="-1"
			>管理</router-link
		>
	</div>
</template>

<script>
// @ is an alias to /src
import UserAvatar from "@/components/UserAssets/Avatar/index.vue"
const { ipcRenderer } = window.require("electron")
import { SettingKey, HostKey, UserStatusKey } from "@/tokens"

export default {
	name: "Navigation",
	components: {
		UserAvatar,
	},
	inject: {
		host: {
			from: HostKey,
		},
		setting: {
			from: SettingKey,
		},
		userStatus: {
			from: UserStatusKey,
		},
	},
	watch: {
		setting: {
			handler: function () {
				this.initColorMode()
			},
			deep: true,
		},
		userStatus: {
			handler: function () {
				this.isLogined = this.userStatus.isLogined
				this.superUser = this.userStatus.isSuper
				this.hostUser = this.userStatus.isHost
			},
			deep: true,
		},
	},
	data() {
		return {
			isLogined: false,
			colorMode: "light",
			signText: "登录",
			avatarUrl: "",
			superUser: false,
			hostUser: false,
		}
	},
	beforeCreate() {
		this.$public.on("update-main-user-info-upto-app", ({ detail }) => {
			this.isLogined = true
			this.avatarUrl =
				detail.avatar ??
				(localStorage.getItem("avatar") === "null"
					? null
					: localStorage.getItem("avatar"))
		})
		this.$public.on("update-avatar", (avatar) => {
			this.avatarUrl = avatar
		})
		this.$public.on("clear-user-sign-status", () => {
			this.isLogined = false
		})
		this.$public.on("change-login-or-register-view", (bool) => {
			this.signText = bool ? "登录" : "注册"
		})
		this.$public.on("update-color-mode", (mode) => {
			this.colorMode = mode
		})
		this.$public.on("app-provided", () => {
			this.initUserAvatar()
		})
	},

	mounted() {},
	methods: {
		initColorMode: function () {
			this.colorMode =
				localStorage.getItem("color-scheme-mode") ||
				(window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light")
			ipcRenderer.send(`color-schemeMode-${this.colorMode}`)

			if (this.colorMode === "light") {
				document.querySelector("html").classList.remove("dark")
			} else {
				document.querySelector("html").classList.add("dark")
			}

			this.$public.emit("update-color-mode", this.colorMode)
		},
		handleOpenUserArea: function () {
			this.$router.push({ path: "/userArea" })
		},
		handleKeepDrag: () => false,
		isMatchColorMode: function (mode) {
			// If we are on the setting page, we don't want to show the color mode.
			if (this.$router.currentRoute.value.path === "/setting")
				return false

			// If a mode is passed as a parameter, then we check that the color mode matches that parameter.
			// If no mode is passed, we just check that the color mode is not null.
			if (mode && this) return this.colorMode === mode
			return false
		},
		switchColorMode: function () {
			let data = this.setting
			data.userSetting.colorSchemeMode = this.colorMode
			localStorage.setItem(
				"color-scheme-mode",
				this.colorMode === "light" ? "dark" : "light"
			)
			this.$conf.updateLocalConfig(data, (err) => {
				console.log(`Strorage Setting for ColorMode`)
				if (err) {
					console.log(err)
				}
				this.$nextTick(() => {
					this.initColorMode()
				})
			})
		},
		initUserAvatar: function () {
			this.avatarUrl = this.setting.userInfo.avatar
		},
	},
}
</script>

<style scoped lang="postcss">
.navigation {
	@apply flex justify-center items-center h-16 text-center text-lg fixed top-12 left-1/2 transform -translate-x-1/2 z-10
  border-2 rounded-full max-w-3xl border-gray-300 dark:border-gray-600;
	width: calc(100% - 8rem);
}
.navigation .areaLink {
	@apply inline-block mx-2 px-3 py-0.5 rounded
	dark:text-gray-50
  hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600
  transition-all ease-in-out;

	font-family: "HanSerif";
}

.areaLink.router-link-exact-active {
	@apply bg-green-400 text-gray-100 dark:bg-green-600
  hover:text-gray-100 hover:bg-green-400
  dark:hover:bg-green-600;
}

.avatar {
	@apply inline-flex justify-center items-center w-11 h-11 absolute left-2
	hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full cursor-pointer transition-all;
}

.avatar:not(.comp) {
	@apply inline-flex justify-center items-center w-11 h-11 p-2.5 absolute left-2
	hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full
	border-2 border-gray-300 dark:border-gray-600
	cursor-pointer transition-all;
}

.shiftOperations {
	@apply absolute right-4 inline-flex items-center;
}

.shiftOperations .color-mode {
	@apply inline-flex items-center justify-center w-8 h-8 p-1.5
	hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full cursor-pointer transition-all;
}

.el-icon {
	@apply inline-flex items-center justify-center w-full h-full;
}

.el-icon svg {
	@apply inline-block w-full h-full;
}
</style>

<style lang="postcss">
@media (prefers-color-scheme: dark) {
	.navigation {
		@apply border-gray-700;
	}
	.navigation .areaLink {
		@apply hover:text-gray-300 hover:bg-gray-700;
	}
}
</style>
