<script>
import { _debounce } from "@/plugins/utils"
import { ElMessageBox } from "element-plus"
import createAnnouncement from "@/components/Dialogs/createAnnouncement.vue"
import editAnnouncement from "@/components/Dialogs/editAnnouncement.vue"
import { reactive } from "vue"
import { AnnouncementKey, SettingKey, HostKey } from "@/tokens"

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
		host: {
			from: HostKey,
		},
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
				this.updatePageData("更新公告成功", false)
			},
			deep: true,
		},
	},
	components: { createAnnouncement, editAnnouncement },
	data() {
		return {
			announcementInfo: [],
			willEditAnnouncement: {},
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
			// this.$nextTick(() => {
			// 	this.updatePageData("更新公告成功", false)
			// })
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
		updatePageData: _debounce(function (msg, emit = true) {
			const { ogAnnouncement } = this.useAnnouncement(this.announcement)
			this.announcementInfo = ogAnnouncement

			emit && this.$emit("update:info")
			this.$public.emit("notice", {
				type: "success",
				msg,
			})
		}, 500),
		createEmitter: function () {
			this.updatePageData("创建公告成功")
			this.$public.emit("user-updated-announcement")
		},
		updateEmitter: function () {
			this.updatePageData("更新公告成功")
			this.$public.emit("user-updated-announcement")
		},
		getTimeComputed: function (timeStamp) {
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
		},
		editAnnouncement: function (selectedAnnouncement) {
			this.willEditAnnouncement = selectedAnnouncement
			this.visible.edit = true
		},
		deleteAnnouncement: function (selectedID) {
			ElMessageBox.confirm(
				"您正在尝试删除一则公告，本操作不可撤回",
				"请确认",
				{
					confirmButtonText: "确认",
					cancelButtonText: "取消",
					type: "warning",
				}
			)
				.then(() => {
					this.$public.emit("notice", {
						msg: `正在删除公告`,
					})

					this.$conf
						.handleDeleteAnnouncement({
							host: this.host.host,
							id: selectedID,
						})
						.then((res) => {
							if (res.data.affectedRows) {
								this.updatePageData("删除公告成功")
								this.$public.emit("user-updated-announcement")
							}
						})
				})
				.catch((e) => {
					this.$log.log(e)
					this.$public.emit("notice", {
						msg: `取消删除公告`,
					})
				})
		},
		changeAnnouncementVisible: function (selectedID) {
			ElMessageBox.confirm(
				`您正在尝试将本公告改为公开状态，本操作不可撤回`,
				"请确认",
				{
					confirmButtonText: "确认",
					cancelButtonText: "取消",
					type: "info",
				}
			)
				.then(() => {
					this.$public.emit("notice", {
						msg: `正在公开公告`,
					})

					this.$conf
						.handleUpdateAnnouncementToOpen({
							host: this.host.host,
							id: selectedID,
						})
						.then((res) => {
							if (res.data.affectedRows) {
								this.updatePageData("公开成功")
								this.$public.emit("user-updated-announcement")
							}
						})
				})
				.catch((e) => {
					this.$log.log(e)
					this.$public.emit("notice", {
						msg: `取消公开`,
					})
				})
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
						<button class="btn" @click="editAnnouncement(item)">
							<el-icon><Edit /></el-icon>
						</button>
						<button
							class="btn"
							v-if="!item.open"
							@click="changeAnnouncementVisible(item.id)"
						>
							<el-icon><View /></el-icon>
						</button>
						<button
							class="btn danger"
							@click="deleteAnnouncement(item.id)"
						>
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
			@create:success="createEmitter"
			:selectedOrganizationInfo="selectedOrganizationInfo"
		/>
		<editAnnouncement
			:visible="visible.edit"
			@update:visible="visible.editFn"
			@update:success="updateEmitter"
			:selectedAnnouncement="willEditAnnouncement"
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
