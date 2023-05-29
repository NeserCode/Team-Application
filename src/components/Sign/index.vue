<template>
	<div class="signArea">
		<Login v-show="this.isSignIn" />
		<Register v-show="!this.isSignIn" />
	</div>
</template>

<script>
import Login from "@/components/Sign/in/index.vue"
import Register from "@/components/Sign/up/index.vue"

export default {
	name: "Sign",
	beforeCreate() {
		this.$public.on("change-login-or-register-view", (which) => {
			this.isSignIn = which
			this.$log.log(`切换至 ${which ? "Sign/in" : "Sign/up"} 界面`)
		})
	},
	mounted() {},
	components: {
		Register,
		Login,
	},
	data() {
		return {
			isSignIn: true,
		}
	},
}
</script>
