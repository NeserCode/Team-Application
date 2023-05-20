<script setup>
import { inject, onBeforeMount } from "vue"

const { getData: getSetting } = inject("$setting")

onBeforeMount(() => {
	let setting = getSetting()
	console.log(setting)
})
</script>

<template>
	<div class="announcement-main">
		<div class="og-announcement">
			<span class="title">组织公告</span>
			<div class="announcement-list">
				<div class="announcement-item">
					<span class="details"> these are some details </span>
					<span class="content"> here contents </span>
				</div>
			</div>
		</div>
		<div class="open-announcement">
			<span class="title">软件公告</span>
			<div class="announcement-list">
				<div class="announcement-item">
					<span class="details"> these are some details </span>
					<span class="content"> here contents </span>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.announcement-main {
	@apply w-auto;
}

.title {
	@apply sticky inline-block w-full h-full top-0 py-4 text-lg font-extralight text-left border-b-2
	border-gray-200 dark:border-gray-600;
	z-index: 2001;

	font-family: "HanSerif";
}

@media (prefers-color-scheme: dark) {
	.title {
		@apply bg-gray-800;
	}
}

@media (prefers-color-scheme: light) {
	.title {
		@apply bg-gray-100;
	}
}
</style>
