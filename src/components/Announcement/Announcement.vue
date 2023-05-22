<script setup>
import { ref, inject, reactive, watch, computed } from "vue"
import { SettingKey, AnnouncementKey } from "@/tokens"

const setting = inject(SettingKey)
const announcement = inject(AnnouncementKey)
// const $public = inject("$public")

const showOgAnnouncement = computed(() => {
	if (setting.value) return !!setting.value.userInfo.organization
	else return false
})
const sorted = ref({
	openAnnouncement: [],
	ogAnnouncement: [],
})

watch(announcement, () => {
	const { openAnnouncement, ogAnnouncement } = useSortAnnouncement(
		announcement.value
	)

	sorted.value = { openAnnouncement, ogAnnouncement }
	console.log(sorted.value)
})

function useSortAnnouncement(array) {
	const sorterByTime = (a, b) => {
		return new Date(b.time) - new Date(a.time)
	}
	const openAnnouncement = array
		.filter((item) => !!item.open)
		.sort(sorterByTime)
	const ogAnnouncement = array.filter((item) => !!item.oid).sort(sorterByTime)

	return reactive({ openAnnouncement, ogAnnouncement })
}

function getTimeComputed(timeStamp) {
	const now = new Date()
	const time = new Date(parseInt(timeStamp))
	const year = time.getFullYear()
	const month = time.getMonth() + 1
	const day = time.getDate()
	const hour = time.getHours()
	const minute = time.getMinutes()
	const second = time.getSeconds()

	// is recent days?
	if (year === now.getFullYear() && month === now.getMonth() + 1) {
		if (day === now.getDate()) return `${hour}:${minute}:${second}`
		else if (day === now.getDate() - 1)
			return `昨天 ${hour}:${minute}:${second}`
		else if (day === now.getDate() - 2)
			return `前天 ${hour}:${minute}:${second}`
		else return `${now.getDate() - day}天前 [${hour}:${minute}:${second}]`
	} else if (year === now.getFullYear())
		return `${month}/${day} [${hour}:${minute}:${second}]`
	else return `${year}/${month}/${day} [${hour}:${minute}:${second}]`
}
</script>

<template>
	<div class="announcement-main">
		<div class="og-announcement" v-if="showOgAnnouncement">
			<span class="title">组织公告</span>
			<div class="announcement-list">
				<div
					class="announcement-item"
					v-for="item in sorted.ogAnnouncement"
					:key="item.id"
				>
					<span class="content">{{ item.content }}</span>
					<span class="details">
						<span class="time" v-if="item.timeStamp">{{
							getTimeComputed(item.timeStamp)
						}}</span>
						<span class="open icon">
							<el-icon title="是否公开">
								<View v-if="item.open" />
								<Hide v-else />
							</el-icon>
						</span>
					</span>
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
					<span class="details">
						<span class="time" v-if="item.timeStamp">{{
							getTimeComputed(item.timeStamp)
						}}</span>
						<span class="open icon">
							<el-icon title="是否公开">
								<View v-if="item.open" />
								<Hide v-else />
							</el-icon>
						</span>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.announcement-main {
	@apply w-full;
	font-family: "Consolas", "HanSerif";
}

.title {
	@apply sticky inline-block w-full h-full top-0 py-4 text-lg font-extralight text-left border-b-2
	border-gray-200 dark:border-gray-600;
	z-index: 2001;
}

.announcement-item {
	@apply inline-flex flex-col w-full border-2 my-1 rounded
	border-gray-200 dark:border-gray-600;
}
.content {
	@apply inline-block text-base text-left whitespace-pre-wrap max-h-36 overflow-auto
	px-3 py-2;
}
.details {
	@apply inline-flex flex-col bg-gray-200 dark:bg-gray-700;
}
.icon .el-icon {
	@apply text-base w-auto;
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
