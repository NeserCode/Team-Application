<template>
	<div class="navigation">
		<UserAvatar
			class="avatar"
			@click="handleOpenUserArea"
			v-show="isLogined"
			:isDot="false"
		/>
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
			to="/userArea"
			tabindex="-1"
			>{{ signText }}</router-link
		>
	</div>
</template>

<script>
// @ is an alias to /src
import UserAvatar from "@/components/UserAssets/Avatar/index.vue"

export default {
	name: "Navigation",
	components: {
		UserAvatar,
	},

	data() {
		return {
			isLogined: false,
			signText: "登录",
		}
	},
	beforeCreate() {
		this.$public.on("update-main-user-info-upto-app", () => {
			this.isLogined = true
		})
		this.$public.on("clear-user-sign-status", () => {
			this.isLogined = false
		})
		this.$public.on("change-login-or-register-view", (bool) => {
			this.signText = bool ? "登录" : "注册"
		})
	},
	mounted() {
		this.isLogined = !(localStorage.getItem("checkKey") == (undefined || null))
	},
	methods: {
		handleOpenUserArea: function () {
			this.$router.push({ path: "/userArea" })
		},
		handleKeepDrag: () => false,
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
  hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600
  transition-all ease-in-out;
}

.areaLink.router-link-exact-active {
	@apply bg-green-400 text-gray-100 dark:bg-green-600 dark:text-gray-300
  hover:text-gray-100 hover:bg-green-400
  dark:hover:bg-green-600;
}

.avatar {
	@apply w-11 h-11 absolute left-2;
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
