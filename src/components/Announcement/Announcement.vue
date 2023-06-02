<script setup>
import { ref, inject, reactive, watch, computed } from "vue"
import { SettingKey, AnnouncementKey, UserStatusKey } from "@/tokens"

const setting = inject(SettingKey)
const announcement = inject(AnnouncementKey)
const userStatus = inject(UserStatusKey)
// const $public = inject("$public")

const showOgAnnouncement = ref(false)
const initShow = () => {
	if (setting.value)
		return (
			!!setting.value.userInfo.organization && userStatus.value.isLogined
		)
	else return false
}

const sorted = ref({
	openAnnouncement: [],
	ogAnnouncement: [],
})
const isOpenEye = ref(false)
const tip = computed(
	() => `${!isOpenEye.value ? "只看非公开" : "查看全部"}内容`
)

watch(
	announcement,
	() => {
		const { openAnnouncement, ogAnnouncement } = useSortAnnouncement(
			announcement.value,
			!isOpenEye.value
		)

		initShow()

		sorted.value = { openAnnouncement, ogAnnouncemnt }
	},
	{
		deep: true,
		immediate: true,
	}
)

function useSortAnnouncement(array, open = false) {
	const sorterByTime = (a, b) => {
		return new Date(b.time) - new Date(a.time)
	}
	const ogFilter = (item) => item.oid === setting.value.userInfo.organization
	const openFilter = open ? (item) => !!item.oid : (item) => !item.open

	if (!array) return reactive({ openAnnouncement: [], ogAnnouncement: [] })
	const openAnnouncement = array
		.filter((item) => !!item.open)
		.sort(sorterByTime)
	const ogAnnouncement = array
		.filter(ogFilter)
		.filter(openFilter)
		.sort(sorterByTime)

	return reactive({ openAnnouncement, ogAnnouncement })
}

function updateAnnouncement(odata = announcement.value) {
	const { openAnnouncement, ogAnnouncement } = useSortAnnouncement(
		odata,
		!isOpenEye.value
	)

	sorted.value = { openAnnouncement, ogAnnouncement }
}

function getTimeComputed(timeStamp) {
	const addZero = (num) => (num < 10 ? `0${num}` : num)
	const now = new Date()
	const time = new Date(parseInt(timeStamp))
	const year = addZero(time.getFullYear())
	const month = addZero(time.getMonth() + 1)
	const day = addZero(time.getDate())
	const hour = addZero(time.getHours())
	const minute = addZero(time.getMinutes())
	const second = addZero(time.getSeconds())

	// is recent days?
	if (
		time.getFullYear() === now.getFullYear() &&
		time.getMonth() + 1 === now.getMonth() + 1
	) {
		if (time.getDate() === now.getDate())
			return `今天 [${hour}:${minute}:${second}]`
		else if (time.getDate() === now.getDate() - 1)
			return `昨天 [${hour}:${minute}:${second}]`
		else if (time.getDate() === now.getDate() - 2)
			return `前天 [${hour}:${minute}:${second}]`
		else
			return `${
				now.getDate() - time.getDate()
			}天前 [${hour}:${minute}:${second}]`
	} else if (year === now.getFullYear())
		return `${month}/${day} [${hour}:${minute}:${second}]`
	else return `${year}/${month}/${day} [${hour}:${minute}:${second}]`
}

function toggleOpenEye() {
	isOpenEye.value = !isOpenEye.value
	updateAnnouncement()
}
</script>

<template>
	<div class="announcement-main">
		<div class="og-announcement" v-if="showOgAnnouncement">
			<span class="title">
				<span>组织公告</span>
				<button class="btn view" :title="tip" @click="toggleOpenEye">
					<el-icon>
						<View v-if="isOpenEye" />
						<Hide v-else />
					</el-icon>
				</button>
			</span>
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
			<div class="null" v-if="!sorted.ogAnnouncement.length">
				<el-empty description="暂时还没有内容"></el-empty>
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
					</span>
				</div>
			</div>
			<div class="null" v-if="!sorted.openAnnouncement.length">
				<el-empty description="暂时还没有内容"></el-empty>
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
	@apply sticky inline-flex items-center justify-between w-full h-full top-0 py-4 text-lg font-extralight text-left border-b-2
	border-gray-200 dark:border-gray-600;
	z-index: 2001;
}
.title .btn {
	@apply rounded-full px-2;
}

.announcement-item {
	@apply inline-flex flex-col w-full border-2 my-1 rounded px-3 py-2
	border-gray-200 dark:border-gray-600;
}
.content {
	@apply inline-block pr-1 text-base text-left whitespace-pre-wrap max-h-48 overflow-auto;
}
.details {
	@apply inline-flex flex-col pt-2 border-t-2
	border-gray-200 dark:border-gray-600;
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
