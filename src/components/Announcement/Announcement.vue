<script setup>
import { ref, inject, reactive, onBeforeMount } from "vue"

const { getData: getSetting } = inject("$setting")
const { getData: getAnnouncement } = inject("$announcement")

const setting = ref(null)
const announcement = ref(null)
const sorted = ref({
	openAnnouncement: [],
	ogAnnouncement: [],
})

onBeforeMount(() => {
	setting.value = getSetting()
	announcement.value = getAnnouncement()

	const { openAnnouncement, ogAnnouncement } = useSortAnnouncement(
		announcement.value
	)
	sorted.value = { openAnnouncement, ogAnnouncement }
})

function useSortAnnouncement(array) {
	const sorterByTime = (a, b) => {
		return new Date(b.time) - new Date(a.time)
	}
	const openAnnouncement = array
		.filter((item) => !!item.open)
		.sort(sorterByTime)
	const ogAnnouncement = array.filter((item) => !item.open).sort(sorterByTime)

	return reactive({ openAnnouncement, ogAnnouncement })
}
</script>

<template>
	<div class="announcement-main">
		<div class="og-announcement" v-if="setting.userInfo.organization">
			<span class="title">组织公告</span>
			<div class="announcement-list">
				<div
					class="announcement-item"
					v-for="item in sorted.ogAnnouncement"
					:key="item.id"
				>
					<span class="content">{{ item.content }}</span>
					<span class="details"> these are some details </span>
				</div>
			</div>
		</div>
		<div class="open-announcement">
			<span class="title">软件公告</span>
			<div
				class="announcement-list"
				v-for="item in sorted.openAnnouncement"
				:key="item.id"
			>
				<div class="announcement-item">
					<span class="content">{{ item.content }}</span>
					<span class="details"> these are some details </span>
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
