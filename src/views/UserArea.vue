<template>
	<div class="UserArea">
		<userDetail />
	</div>
</template>

<script>
import userDetail from "@/components/UserDetail/index.vue"
import { SettingKey, UserStatusKey } from "@/tokens"

export default {
	name: "Setting",
	inject: {
		setting: {
			from: SettingKey,
		},
		userStatus: {
			from: UserStatusKey,
		},
	},
	components: {
		userDetail,
	},
	data() {
		return {
			isUserLogined: false,
		}
	},
	watch: {
		userStatus: {
			handler: function () {
				this.isUserLogined = this.userStatus.isLogined
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {},
	beforeCreate() {
		this.$public.on("clear-user-sign-status", () => {
			localStorage.removeItem("userKey")
			localStorage.removeItem("username")
			localStorage.removeItem("checkKey")
			localStorage.removeItem("avatar")
		})
		this.$public.on("controller-sign-in", () => {
			this.isUserLogined = true
		})
	},
	mounted() {
		if (!this.isUserLogined) {
			this.$router.push("/sign")
		}
	},
}
</script>

<style scoped lang="postcss">
.UserArea {
	@apply w-full h-auto;
}
</style>
