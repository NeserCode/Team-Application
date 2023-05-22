<script>
// import { _debounce } from "@/plugins/utils"
// import { ElMessageBox } from "element-plus"
import createAnnouncement from "@/components/Dialogs/createAnnouncement.vue"

export default {
	name: "Manage-Announcement",
	props: {
		selectedOrganizationInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	emits: ["update:info"],
	data() {
		return {
			announcementInfo: {},
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
	// watch: {
	// 	"selectedOrganizationInfo.id": {
	// 		handler: function (val) {
	// 			this.getMembersInfo(val)
	// 		},
	// 	},
	// },
	components: { createAnnouncement },
	beforeCreate() {
		this.$public.on("app-provided", () => {
			// this.getMembersInfo(this.selectedOrganizationInfo.id)
		})
	},
	methods: {
		handleCreateAnnouncement: function () {
			this.visible.create = true
		},
	},
}
</script>

<template>
	<div class="announcement">
		<div class="announcement-info">
			<span class="title">
				<span>公告</span>
				<button class="btn" @click="handleCreateAnnouncement">
					<el-icon><Plus /></el-icon>
				</button>
			</span>
			<div class="announcement-list">
				<div class="announcement-item">
					<span class="details"> these are some details </span>
					<span class="content"> here contents </span>
				</div>
			</div>
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

.item {
	@apply flex items-center justify-between w-full my-1 px-4 py-2 text-base border-2 rounded-md
	border-gray-200 dark:border-gray-700
	hover:border-gray-300 dark:hover:border-gray-500
	hover:shadow
	hover:bg-gray-50 dark:hover:bg-gray-600 transition-all;
}
.item.own,
.item.self {
	@apply bg-green-100 dark:bg-green-800;
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
.op > .btn {
	@apply mx-1 text-base;
}

.position {
	@apply inline-flex justify-center items-center px-1 py-0.5 mx-2 rounded
	text-gray-50 dark:text-gray-800 bg-gray-400 dark:bg-gray-500
	transition-all shadow;
}
.position.HOST,
.position.JOIN {
	@apply bg-green-400 dark:bg-green-500;
}
</style>
