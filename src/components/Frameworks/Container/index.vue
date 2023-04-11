<template>
	<div class="AppMainContainer">
		<Slider vertical>
			<router-view v-slot="{ Component }">
				<keep-alive>
					<component :is="Component" />
				</keep-alive>
			</router-view>
		</Slider>
	</div>
</template>

<script>
// @ is an alias to /src
import Slider from "@/components/Frameworks/Slider/index.vue"

export default {
	name: "AppMainContainer",
	components: { Slider },
	data() {
		return {}
	},
	mounted() {},
	methods: {},
}
</script>

<style scoped lang="postcss">
.AppMainContainer {
	margin-top: calc(6rem - 1px);
	padding-top: 2rem;
	width: calc(100vw - 2px);
	height: calc(100vh - 7.5rem);
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>
