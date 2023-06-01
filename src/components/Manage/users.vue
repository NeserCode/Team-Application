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
			banFilter: false,
		}
	},
	computed: {
		allBannedUsers: function () {
			return this.users.info
				? this.users.info.filter((user) => !!user.status)
				: NaN
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
		computedStatusClass: (banned) => (banned ? "banned" : null),
		handleRenameOrganization: function () {
			this.visible.rename = true
		},
		getAllUsers: function () {
			this.isUpdate = false
			this.$nextTick(() => {
				this.$public.emit("notice", {
					title: "获取所有用户",
					msg: "请耐心等待",
					type: "info",
				})
			})

			this.$conf
				.allUser({
					host: this.host.host,
				})
				.then((res) => {
					this.users = res.data
					this.banFilter &&
						(this.users.detail = this.users.detail.filter(
							(item, index) => this.users.info[index].status === 1
						))
					this.banFilter &&
						(this.users.info = this.users.info.filter(
							(item, index) => {
								if (this.users.info[index].status === 1)
									return item
							}
						))
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
		banThisUser: function (id) {
			if (id === this.setting.userInfo.id)
				return this.$public.emit("notice", {
					title: "封禁",
					msg: `不可以封禁自己`,
					type: "error",
				})
			else
				this.$conf
					.banUser({
						host: this.host.host,
						id,
					})
					.then((result) => {
						this.$nextTick(() => {
							result.data.affectedRows &&
								this.$public.emit("notice", {
									title: "封禁",
									msg: `封禁用户成功 ID#${id}`,
									type: "success",
								})
							this.getAllUsers()
						})
					})
		},
		unbanThisUser: function (id) {
			this.$conf
				.unbanUser({
					host: this.host.host,
					id,
				})
				.then((result) => {
					this.$nextTick(() => {
						result.data.affectedRows &&
							this.$public.emit("notice", {
								title: "解禁",
								msg: `解禁用户成功 ID#${id}`,
								type: "success",
							})
						this.getAllUsers()
					})
				})
		},
		toggleBanFilter: function () {
			this.banFilter = !this.banFilter
			this.getAllUsers()
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
			<div class="op">
				<button
					class="btn"
					title="查看封禁用户"
					@click="toggleBanFilter"
				>
					<el-icon><Filter /></el-icon>
					<span v-if="banFilter">封禁用户</span>
				</button>
				<button class="btn" title="重新获取" @click="getAllUsers">
					<el-icon :class="{ 'is-loading': isUpdate }"
						><Refresh
					/></el-icon>
				</button>
			</div>
		</div>
		<div class="users-list">
			<span class="count"
				>用户人数
				{{ users.detail ? users.detail.length : NaN }} 已封禁用户数
				{{ allBannedUsers.length }}
			</span>
			<span
				:class="['item', computedStatusClass(users.info[index].status)]"
				v-for="(detail, index) in users.detail"
				:key="detail.id"
			>
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
					<button
						class="btn danger"
						title="禁用该成员"
						v-if="!banFilter && !users.info[index].status"
						@click="banThisUser(detail.id)"
					>
						<el-icon><Lock /></el-icon>
					</button>
					<button
						v-else-if="banFilter"
						class="btn danger"
						title="解禁该成员"
						@click="unbanThisUser(detail.id)"
					>
						<el-icon><Unlock /></el-icon>
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
.item.banned {
	@apply bg-red-200 dark:bg-red-900 opacity-50;
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
	@apply mx-2 rounded-full p-1.5;
}
.op > .btn {
	@apply mx-1 text-base;
}

.btn span {
	@apply inline-block mx-1 text-sm;
}
</style>
