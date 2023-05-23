<script>
// import { _debounce } from "@/plugins/utils"
// import { ElMessageBox } from "element-plus"
import createAnnouncement from "@/components/Dialogs/createAnnouncement.vue"
import { reactive } from "vue"
import { AnnouncementKey, SettingKey } from "@/tokens"

export default {
	name: "Manage-Announcement",
	props: {
		selectedOrganizationInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	emits: ["update:info"],
	inject: {
		announcement: {
			from: AnnouncementKey,
		},
		setting: {
			from: SettingKey,
		},
	},
	watch: {
		selectedOrganizationInfo: {
			handler: function () {
				const { ogAnnouncement } = this.useAnnouncement(
					this.announcement
				)
				this.announcementInfo = ogAnnouncement
			},
			deep: true,
		},
	},
	components: { createAnnouncement },
	data() {
		return {
			announcementInfo: [],
			visible: {
				create: false,
				createFn: (val) => {
					this.visible.create = val
				},
				edit: false,
				editFn: (val) => {
					this.visible.edit = val
				},
			},
		}
	},
	beforeCreate() {
		this.$public.on("app-provided", () => {
			// this.getMembersInfo(this.selectedOrganizationInfo.id)
		})
	},
	methods: {
		handleCreateAnnouncement: function () {
			this.visible.create = true
		},
		useAnnouncement: function (data) {
			const ogFilter = (item) =>
				item.oid === this.selectedOrganizationInfo.id
			const ogAnnouncement = data.filter(ogFilter)

			return reactive({ ogAnnouncement })
		},
		getTimeComputed: function (timeStamp) {
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
				if (day === now.getDate())
					return `今天 [${hour}:${minute}:${second}]`
				else if (day === now.getDate() - 1)
					return `昨天 [${hour}:${minute}:${second}]`
				else if (day === now.getDate() - 2)
					return `前天 [${hour}:${minute}:${second}]`
				else
					return `${
						now.getDate() - day
					}天前 [${hour}:${minute}:${second}]`
			} else if (year === now.getFullYear())
				return `${month}/${day} [${hour}:${minute}:${second}]`
			else return `${year}/${month}/${day} [${hour}:${minute}:${second}]`
		},
	},
}
</script>

<template>
	<div class="announcement">
		<div class="announcement-info">
			<span class="title">
				<span>公告管理</span>
				<button class="btn" @click="handleCreateAnnouncement">
					<el-icon><Plus /></el-icon>
				</button>
			</span>
			<div class="announcement-list">
				<div
					class="announcement-item item"
					v-for="item in announcementInfo"
					:key="item.id"
				>
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
					<span class="content">{{ item.content }}</span>
					<span class="op">
						<button class="btn">
							<el-icon><Edit /></el-icon>
						</button>
						<button class="btn danger">
							<el-icon><Delete /></el-icon>
						</button>
					</span>
				</div>
			</div>
			<el-empty
				description="暂时还没有发布过公告"
				v-if="!this.announcementInfo.length"
			></el-empty>
		</div>
		<createAnnouncement
			:visible="visible.create"
			@update:visible="visible.createFn"
			:selectedOrganizationInfo="selectedOrganizationInfo"
		/>
	</div>
</template>

<style scoped lang="postcss">
.announcement {
	@apply inline-flex flex-col items-center w-full h-auto py-4;
	font-family: "Consolas", "HanSerif";
}

.title {
	@apply inline-flex justify-between items-center mb-4
	text-3xl font-semibold;
}

.announcement-info {
	@apply flex flex-col w-full max-w-2xl my-8 justify-center;
}
.item {
	@apply flex flex-col justify-between w-full my-1 px-4 py-2 text-base border-2 rounded-md
	border-gray-200 dark:border-gray-700
	hover:border-gray-300 dark:hover:border-gray-500
	hover:shadow
	hover:bg-gray-50 dark:hover:bg-gray-600 transition-all;
}

.btn {
	@apply dark:border-gray-700;
}
.btn.danger {
	@apply text-red-500 dark:text-red-400;
}
.title > .btn {
	@apply mx-2 text-base rounded-full p-1.5;
}
.op {
	@apply inline-flex items-center justify-end;
}
.op > .btn {
	@apply mx-1 text-base;
}

.details {
	@apply inline-flex items-center;
}
.details .icon {
	@apply inline-flex items-center px-2 text-lg;
}
.content {
	@apply max-h-40 overflow-auto whitespace-pre-wrap;
}
</style>
