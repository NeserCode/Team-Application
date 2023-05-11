<template>
	<div class="UserArea">
		<userDetail />
	</div>
</template>

<script>
import userDetail from "@/components/UserDetail/index.vue"

export default {
	name: "Setting",
	beforeCreate() {
		this.$public.on("update-main-user-info-upto-app", () => {
			this.isUserLogined = true
		})
		this.$public.on("clear-user-sign-status", () => {
			localStorage.removeItem("userKey")
			localStorage.removeItem("username")
			localStorage.removeItem("checkKey")
			localStorage.removeItem("avatar")
			this.isUserLogined = false
		})
	},
	mounted() {
		this.isUserLogined =
			localStorage.getItem("checkKey") == (undefined || null)
				? false
				: true

		if (!this.isUserLogined) {
			this.$router.push("/sign")
		}
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
		isUserLogined: function (val) {
			if (!val) {
				this.$router.push("/sign")
			}
		},
	},
	methods: {},
}
</script>

<style scoped lang="postcss">
.UserArea {
	@apply w-full h-auto;
}
</style>
