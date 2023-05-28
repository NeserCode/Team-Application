<script>
// import { _debounce } from "@/plugins/utils"
// import { ElMessageBox } from "element-plus"
// import renameOrganization from "@/components/Dialogs/renameOrganization.vue"
import editUser from "@/components/Dialogs/editUser.vue"
import { SettingKey, HostKey, UserStatusKey } from "@/tokens"

export default {
	name: "Manage-Users",
	inject: {
		host: {
			from: HostKey,
		},
		setting: {
			from: SettingKey,
		},
		userStatus: {
			from: UserStatusKey,
		},
	},
	emits: ["update:info"],
	watch: {},
	components: { editUser },
	data() {
		return {
			users: {
				detail: [],
				info: [],
			},
			visible: {
				editUser: false,
				editUserFn: (val) => {
					this.visible.editUser = val
				},
			},
			selectedUserDetail: {},
			isUpdate: false,
		}
	},
	computed: {
		allBannedUsers: function () {
			return this.users.detail.filter((user) => !!user.status)
		},
	},
	beforeCreate() {
		this.$public.on("app-provided", () => {
			// this.$nextTick(() => {
			// 	this.getMembersInfo(this.selectedOrganizationInfo.id)
			// })
		})
	},
	mounted() {
		this.$nextTick(() => {
			this.getAllUsers()
		})
	},
	methods: {
		computedStatusClass: (status) => (status ? "access" : null),
		handleRenameOrganization: function () {
			this.visible.rename = true
		},
		getAllUsers: function () {
			this.isUpdate = false
			this.$public.emit("notice", {
				title: "获取所有用户",
				msg: "请耐心等待",
				type: "info",
			})

			this.$conf
				.allUser({
					host: this.host.host,
				})
				.then((res) => {
					this.users = res.data
					console.log(this.users)
					res.data &&
						this.$public.emit("notice", {
							title: "获取所有用户",
							msg: "获取成功",
							type: "success",
							fn: () => {
								this.isUpdate = false
							},
						})
				})
		},
		editThisUser: function (user) {
			this.selectedUserDetail = user
			this.visible.editUser = true
		},
		updateUserData: function () {
			this.getAllUsers()
			this.$public.emit("need-update-user")
		},
	},
}
</script>

<template>
	<div class="users-main">
		<div class="title">
			<span class="name">用户列表</span>
			<button class="btn" @click="getAllUsers">
				<el-icon :class="{ 'is-loading': isUpdate }"
					><Refresh
				/></el-icon>
			</button>
		</div>
		<div class="users-list">
			<span class="count"
				>用户人数
				{{ users.detail ? users.detail.length : NaN }} 已封禁用户数
				{{ allBannedUsers.length }}
			</span>
			<span class="item" v-for="detail in users.detail" :key="detail.id">
				<span class="info">
					<span class="avatar">
						<el-avatar
							@error="() => true"
							:src="detail.avatar"
							shape="square"
						/>
					</span>
					<span class="name">{{ detail.nickname }}</span>
					<span class="id">{{ `#${detail.id}` }}</span>
				</span>

				<span class="op">
					<button class="btn" @click="editThisUser(detail)">
						<el-icon><Edit /></el-icon>
					</button>
					<button class="btn danger" title="移除该成员">
						<el-icon><Delete /></el-icon>
					</button>
				</span>
			</span>
		</div>
		<edit-user
			:visible="visible.editUser"
			@update:visible="visible.editUserFn"
			@update:success="updateUserData"
			:selectedUserDetail="selectedUserDetail"
		/>
	</div>
</template>

<style scoped lang="postcss">
.users-main {
	@apply inline-flex flex-col items-center w-full h-auto py-4;
	font-family: "Consolas", "HanSerif";
}

.users-main .title {
	@apply inline-flex justify-between items-center w-full max-w-2xl
	mb-4 text-3xl font-semibold text-left;
}

.users-list {
	@apply inline-flex flex-col items-center w-full max-w-2xl h-auto;
}

.item {
	@apply flex items-center justify-between w-full my-1 p-2 text-base border-2 rounded-md
	border-gray-200 dark:border-gray-700
	hover:border-gray-300 dark:hover:border-gray-500
	hover:shadow
	hover:bg-gray-50 dark:hover:bg-gray-600 transition-all;
}
.item.own,
.item.self {
	@apply bg-green-100 dark:bg-green-800;
}

.item .info {
	@apply inline-flex items-center;
}
.count {
	@apply inline-block w-full text-left;
}
.info .avatar {
	@apply inline-flex items-center;
}
.info .name {
	@apply ml-2 text-2xl font-semibold;
}
.info .id {
	@apply inline-block self-end mx-1 font-black;
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
</style>
