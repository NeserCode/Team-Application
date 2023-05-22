<script>
// import { _debounce } from "@/plugins/utils"
import { ElMessageBox } from "element-plus"
import renameOrganization from "@/components/Dialogs/renameOrganization.vue"
import { SettingKey, HostKey } from "@/tokens"

export default {
	name: "Manage-Organization",
	props: {
		selectedOrganizationInfo: {
			type: Object,
			default: () => ({}),
		},
		hostUser: {
			type: Boolean,
			default: false,
		},
		superUser: {
			type: Boolean,
			default: false,
		},
	},
	inject: {
		host: {
			from: HostKey,
		},
		setting: {
			from: SettingKey,
		},
	},
	emits: ["update:info"],
	data() {
		return {
			membersInfo: {},
			visible: {
				rename: false,
				renameFn: (val) => {
					this.visible.rename = val
				},
			},
		}
	},
	computed: {
		detailVisible: function () {
			return (
				!!this.selectedOrganizationInfo.id &&
				(this.superUser || this.hostUser)
			)
		},
	},
	watch: {
		"selectedOrganizationInfo.id": {
			handler: function (val) {
				this.getMembersInfo(val)
			},
		},
	},
	components: { renameOrganization },
	beforeCreate() {
		this.$public.on("app-provided", () => {
			this.getMembersInfo(this.selectedOrganizationInfo.id)
		})
	},
	methods: {
		computedStatusClass: (status) => (status ? "access" : null),
		getMembersInfo: function (oid) {
			this.$conf
				.getMembersByOrganizationId({
					host: this.host.host,
					id: oid,
				})
				.then((res) => {
					// Sort by access status
					function sortByStr(array, key) {
						return array.sort(function (a, b) {
							if (a[key] === "HOST") return -1
							else if (b[key] === "HOST") return 1
							else if (a[key] === "JOIN" && b[key] === "APPLY")
								return -1
							else if (b[key] === "JOIN" && a[key] === "APPLY")
								return 1
						})
					}
					const { detail, members } = res.data
					let i = detail.findIndex(
						(detail) => detail.id === this.setting.userInfo.id
					)
					if (i !== -1) detail[i].self = true

					this.membersInfo.detail = sortByStr(
						detail,
						"access_position"
					)

					this.membersInfo.members = members
				})
		},
		updatePageData: function (msg) {
			this.getMembersInfo(this.selectedOrganizationInfo.id)
			this.$emit("update:info")
			this.$public.emit("notice", {
				type: "success",
				msg,
			})
		},
		updateOrganizationStatus: function (status) {
			const cb = (res) => {
				if (res.data.affectedRows) {
					this.updatePageData("更新组织授权成功")
				}
			}

			this.$public.emit("notice", {
				msg: "正在更新组织授权",
			})

			if (status)
				this.$conf
					.handleActiveOrganization({
						host: this.host.host,
						id: this.selectedOrganizationInfo.id,
					})
					.then(cb)
			else
				this.$conf
					.handleDeactiveOrganization({
						host: this.host.host,
						id: this.selectedOrganizationInfo.id,
					})
					.then(cb)
		},
		handleRenameOrganization: function () {
			this.visible.rename = true
		},
		quitOrganization: function (type, user) {
			if (type !== "HOST") {
				this.$public.emit("notice", {
					msg: `正在${type === "JOIN" ? "退出组织" : "拒绝申请"}`,
				})
				this.$conf
					.handleQuitOrganization({
						host: this.host.host,
						id: user.id,
					})
					.then((res) => {
						if (res.data.affectedRows) {
							this.updatePageData(
								`${
									type === "JOIN" ? "退出组织" : "拒绝申请"
								}成功`
							)
						}
					})
			} else {
				this.$public.emit("notice", {
					msg: `正在解散组织`,
				})
				this.deleteOrganization()
			}
		},
		joinOrganization: function (user) {
			this.$public.emit("notice", {
				msg: `正在同意申请`,
			})

			this.$conf
				.handleJoinOrganization({
					host: this.host.host,
					oid: this.selectedOrganizationInfo.id,
					uid: user.id,
				})
				.then((res) => {
					if (res.data.affectedRows) {
						this.updatePageData("同意申请成功")
					}
				})
		},
		deleteOrganization: function () {
			ElMessageBox.confirm(
				"您正在尝试解散一个组织，这将使该组织内所有成员失去他们的组织与已认证的授权",
				"请注意",
				{
					confirmButtonText: "确认解散",
					cancelButtonText: "取消",
					type: "warning",
				}
			)
				.then(() => {
					this.$public.emit("notice", {
						msg: `正在解散组织`,
					})

					this.$conf
						.handleDeleteOrganization({
							host: this.host.host,
							id: this.selectedOrganizationInfo.id,
						})
						.then((res) => {
							if (res.data.affectedRows) {
								this.updatePageData("解散组织成功")
							}
						})
				})
				.catch(() => {
					this.$public.emit("notice", {
						msg: `取消解散组织`,
					})
				})
		},
	},
}
</script>

<template>
	<div class="organization">
		<div class="organization-info" v-if="detailVisible">
			<span class="title">
				<span class="info">
					<span class="name">{{
						selectedOrganizationInfo.name
					}}</span>
					<span class="id"
						>编号{{ `#${selectedOrganizationInfo.id}` }}</span
					>
					<span
						:class="[
							'status',
							computedStatusClass(
								!!selectedOrganizationInfo.status
							),
						]"
						>{{
							!!selectedOrganizationInfo.status
								? "已认证"
								: "未认证"
						}}</span
					>
				</span>
				<div class="op">
					<button
						class="btn"
						title="重命名该组织"
						@click="handleRenameOrganization"
					>
						<el-icon><Edit /></el-icon>
					</button>
					<button
						class="btn"
						v-if="superUser"
						:title="
							!!selectedOrganizationInfo.status
								? '取消该组织认证'
								: '激活该组织认证'
						"
						@click="
							updateOrganizationStatus(
								!selectedOrganizationInfo.status
							)
						"
					>
						<el-icon>
							<TurnOff v-if="!!selectedOrganizationInfo.status" />
							<Open v-else />
						</el-icon>
					</button>
					<button
						class="btn danger"
						title="解散该组织"
						@click="deleteOrganization"
					>
						<el-icon><Delete /></el-icon>
					</button>
				</div>
			</span>
			<div class="member-list">
				<span class="count"
					>组织人数
					{{
						membersInfo.detail ? membersInfo.detail.length : NaN
					}}</span
				>
				<span
					class="item"
					v-for="detail in membersInfo.detail"
					:key="detail.id"
				>
					<span class="info">
						<span class="name">{{ detail.nickname }}</span>
						<span class="id">{{ `#${detail.id}` }}</span>
						<span :class="['position', detail.access_position]">{{
							detail.access_position
						}}</span>
					</span>

					<span class="op" v-if="detail.access_position === 'APPLY'">
						<button
							class="btn"
							title="接受该申请"
							@click="joinOrganization(detail)"
						>
							<el-icon><Check /></el-icon>
						</button>
						<button
							class="btn danger"
							title="拒绝该申请"
							@click="
								quitOrganization(detail.access_position, detail)
							"
						>
							<el-icon><Close /></el-icon>
						</button>
					</span>
					<span class="op" v-else>
						<button
							class="btn danger"
							title="移除该成员"
							@click="
								quitOrganization(detail.access_position, detail)
							"
						>
							<el-icon><Delete /></el-icon>
						</button>
					</span>
				</span>
			</div>
		</div>
		<rename-organization
			:visible="visible.rename"
			@update:visible="visible.renameFn"
			:organization="selectedOrganizationInfo"
			@rename:success="updatePageData('组织重命名成功')"
		/>
	</div>
</template>

<style scoped lang="postcss">
.organization {
	@apply inline-flex flex-col items-center w-full h-auto py-4;
	font-family: "Consolas", "HanSerif";
}

.title {
	@apply inline-flex justify-between items-center mb-4;
}

.organization-info {
	@apply flex flex-col w-full max-w-2xl my-8 justify-center;
}
.organization-info .name {
	@apply text-2xl font-bold;
}
.organization-info .title .name {
	@apply text-4xl;
}
.organization-info .id {
	@apply inline-block self-end mx-1 font-black;
}
.organization-info .status {
	@apply inline-flex justify-center items-center px-1 py-0.5 mx-2 rounded
	font-bold text-gray-50 dark:text-gray-800 bg-gray-400 dark:bg-gray-500
	transition-all shadow;
}
.organization-info .status.access {
	@apply bg-green-400 dark:bg-green-500;
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
