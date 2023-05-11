<template>
	<div class="sign-page">
		<Sign />
	</div>
</template>

<script>
import Sign from "@/components/Sign/index.vue"

export default {
	name: "sign-page",
	beforeCreate() {},
	mounted() {},
	components: {
		Sign,
	},
	data() {
		return {}
	},
	methods: {},
}
</script>

<style scoped lang="postcss">
.sign-page {
	@apply w-full h-auto;
}
</style>
