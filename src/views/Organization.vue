<script>
import createOrganization from "@/components/Dialogs/createOrganization.vue"
import joinOrganization from "@/components/Dialogs/joinOrganization.vue"

import { ElMessageBox } from "element-plus"
import { _debounce } from "@/plugins/utils"
import { SettingKey, HostKey, UserStatusKey, AnnouncementKey } from "@/tokens"

export default {
	name: "Organization",
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
		announcement: {
			from: AnnouncementKey,
		},
	},
	components: {
		createOrganization,
		joinOrganization,
	},
	data() {
		return {
			organizationInfo: {},
			announcementInfo: [],
			allOrganization: [],
			willJoinOrganization: {},
			membersInfo: {},
			superUser: false,
			hasOrganization: false,
			uid: null,
			uType: null,
			visible: {
				createOrganization: false,
				joinOrganization: false,
			},
		}
	},
	watch: {
		userStatus: {
			handler: function () {
				this.superUser = this.userStatus.isSuper
			},
			deep: true,
		},
		setting: {
			handler: function () {
				const conf = this.setting
				this.getOrganizationInfo(conf.userInfo.organization)
				this.getMembersInfo(conf.userInfo.organization)
			},
			deep: true,
		},
		host: {
			handler: function () {
				this.getAllOrganization()
			},
			deep: true,
		},
		announcement: {
			handler: function () {
				this.announcementInfo = this.announcement.filter(
					(item) => item.oid === this.setting.userInfo.organization
				)
			},
			deep: true,
		},
	},
	beforeCreate() {
		this.$public.on("user-sign-in", ({ detail }) => {
			this.getOrganizationInfo(detail.access_team)
			this.getMembersInfo(detail.access_team)

			this.getAllOrganization()
		})

		this.$public.on("update-from-keys-failed", () => {
			const conf = this.setting
			this.getOrganizationInfo(conf.userInfo.organization)
			this.getMembersInfo(conf.userInfo.organization)

			this.getAllOrganization()
		})
	},
	created() {},
	mounted() {
		const conf = this.setting
		this.getOrganizationInfo(conf.userInfo.organization)
		this.getMembersInfo(conf.userInfo.organization)

		this.getAllOrganization()
		this.$nextTick(() => {
			this.announcementInfo = this.announcement.filter(
				(item) => item.oid === this.setting.userInfo.organization
			)
		})
	},
	methods: {
		computedStatusClass: (status) => (status ? "access" : null),
		computedOwnOgnizationClass: (item) => {
			if (!item) return null
			return item.own ? "own" : null
		},
		computedOwnUserClass: (detail) => {
			if (!detail) return null
			return detail.self ? "self" : null
		},
		getOrganizationInfo: function (id) {
			this.$conf
				.getOrganizationById({
					// Use the host to get the full URL
					host: this.host.host,
					id,
				})
				.then((res) => {
					// Save the organization information
					this.organizationInfo = res.data[0] || {}
					this.hasOrganization = !!this.organizationInfo.id
				})
		},
		getMembersInfo: function (oid) {
			this.$conf
				.getMembersByOrganizationId({
					host: this.host.host,
					id: oid,
				})
				.then((res) => {
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
					if (i !== -1) {
						detail[i].self = true
						this.uid = detail[i].id
						this.uType = detail[i].access_position
					}

					this.membersInfo.detail = sortByStr(
						detail,
						"access_position"
					)

					this.membersInfo.members = members
				})

			// Update the user's access status
			this.hasOrganization = !!oid
		},
		getAllOrganization() {
			this.$conf
				.allOrganization({
					host: this.host.host,
				})
				.then((res) => {
					let data = res.data
					let i = data.findIndex(
						(item) => item.id === this.organizationInfo.id
					)
					if (i !== -1) data[i].own = true
					this.allOrganization = data
				})
		},
		handleCreateOrganization: _debounce(function () {
			if (this.hasOrganization) {
				this.$public.emit("notice", {
					type: "warning",
					msg: "创建组织需要退出当前组织",
				})
				return
			}

			this.visible.createOrganization = true
		}, 800),
		updateVisibleCreateOrganization: function (bool) {
			this.visible.createOrganization = bool
		},
		handleJoinOrganization: _debounce(function (organization) {
			if (this.hasOrganization) {
				this.$public.emit("notice", {
					type: "warning",
					msg: "加入其他组织需要退出当前组织",
				})
				return
			}

			this.willJoinOrganization = organization
			this.visible.joinOrganization = true
		}, 800),
		updateVisibleJoinOrganization: function (bool) {
			this.visible.joinOrganization = bool
		},
		updateUserOrganization: async function ({ oid, uid, type }) {
			// local
			if (type === "HOST") {
				this.$conf
					.updateUserAccess({
						host: this.host.host,
						oid,
						uid,
					})
					.then(() => {
						this.getOrganizationInfo(oid)
						this.getMembersInfo(oid)

						this.getAllOrganization()
						this.$public.emit("user-created-organization", { oid })
					})
			} else if (type === "JOIN") {
				this.hasOrganization = !!oid

				// network
				this.getOrganizationInfo(oid)
				this.getMembersInfo(oid)

				this.getAllOrganization()
				this.$public.emit("user-joined-organization", { oid })
			}
		},
		updatePageData: function (msg) {
			this.getOrganizationInfo(this.organizationInfo.id)
			this.getMembersInfo(this.organizationInfo.id)

			this.getAllOrganization()

			this.$public.emit("notice", {
				type: "success",
				msg,
			})
		},
		quitOrganization: function () {
			if (this.uType !== "HOST") {
				ElMessageBox.confirm(
					`您正在尝试${
						this.uType === "JOIN" ? "退出组织" : "撤销申请"
					}`,
					"请注意",
					{
						confirmButtonText: `确认${
							this.uType === "JOIN" ? "退出组织" : "撤销申请"
						}`,
						cancelButtonText: "取消",
						type: "warning",
					}
				)
					.then(() => {
						this.$public.emit("notice", {
							msg: `正在${
								this.uType === "JOIN" ? "退出组织" : "撤销申请"
							}`,
						})

						this.$conf
							.handleQuitOrganization({
								host: this.host.host,
								id: this.uid,
							})
							.then((res) => {
								if (res.data.affectedRows) {
									this.organizationInfo = {}
									this.updatePageData(
										`${
											this.uType === "JOIN"
												? "退出组织"
												: "撤销申请"
										}成功`
									)
									this.$public.emit(
										"user-leaved-organization"
									)
								}
							})
					})
					.catch(() => {
						this.$public.emit("notice", {
							msg: `成功取消操作`,
						})
					})
			} else {
				this.$public.emit("notice", {
					msg: `正在解散组织`,
				})
				this.deleteOrganization()
			}
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
							id: this.organizationInfo.id,
						})
						.then((res) => {
							if (res.data.affectedRows) {
								this.updatePageData("解散组织成功")
								this.$public.emit("user-deleted-organization")
							}
						})
				})
				.catch(() => {
					this.$public.emit("notice", {
						msg: `取消解散组织`,
					})
				})
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
	},
}
</script>

<template>
	<div class="organization">
		<div class="organization-info" v-if="hasOrganization">
			<span class="title">
				<span class="name">{{ organizationInfo.name }}</span>
				<span class="id">编号{{ `#${organizationInfo.id}` }}</span>
				<span
					:class="[
						'status',
						computedStatusClass(!!organizationInfo.status),
					]"
					>{{ !!organizationInfo.status ? "已认证" : "未认证" }}</span
				>
				<button class="btn" @click="quitOrganization()">
					<el-icon><Minus /></el-icon>
				</button>
				<button
					class="btn"
					@click="$router.push('/manage')"
					v-if="userStatus.isHost || userStatus.isSuper"
				>
					<el-icon><Setting /></el-icon>
				</button>
			</span>
			<div class="member-list">
				<span class="count"
					>组织人数
					{{
						membersInfo.detail ? membersInfo.detail.length : NaN
					}}</span
				>
				<span
					:class="['item', computedOwnUserClass(detail)]"
					v-for="detail in membersInfo.detail"
					:key="detail.id"
				>
					<span class="info">
						<span class="name">{{ detail.nickname }}</span>
						<span class="id">{{ `#${detail.id}` }}</span>
					</span>
					<span class="position">{{ detail.access_position }}</span>
				</span>
			</div>
		</div>
		<div class="organization-list">
			<span class="title">
				<span>组织列表</span>
				<button class="btn" @click="handleCreateOrganization">
					<el-icon><Plus /></el-icon>
				</button>
			</span>
			<span
				:class="['item', computedOwnOgnizationClass(item)]"
				v-for="item in allOrganization"
				:key="item.id"
			>
				<span class="info">
					<span class="id">{{ `#${item.id}` }}</span>
					<span class="name">{{ item.name }}</span>
					<span class="status">
						{{ item.status ? "已认证" : "未认证" }}
					</span>
				</span>
				<button
					class="btn"
					title="向该组织提交申请"
					@click="handleJoinOrganization(item)"
				>
					<el-icon><Promotion /></el-icon>
				</button>
			</span>
		</div>
		<div class="announcement-info" v-if="hasOrganization">
			<span class="title">
				<span>公告列表</span>
				<button
					class="btn"
					@click="$router.push('/manage')"
					v-if="userStatus.isHost || userStatus.isSuper"
				>
					<el-icon><Setting /></el-icon>
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
				</div>
			</div>
			<el-empty
				description="暂时还没有发布过公告"
				v-if="!this.announcementInfo.length"
			></el-empty>
		</div>
		<create-organization
			:visible="visible.createOrganization"
			@update:visible="updateVisibleCreateOrganization"
			@create:success="updateUserOrganization"
		/>
		<join-organization
			:visible="visible.joinOrganization"
			:organization="willJoinOrganization"
			@update:visible="updateVisibleJoinOrganization"
			@join:success="updateUserOrganization"
		/>
	</div>
</template>

<style scoped lang="postcss">
.organization {
	@apply inline-flex flex-col items-center w-full h-auto py-4;
	font-family: "Consolas", "HanSerif";
}

.title {
	@apply inline-flex items-center mb-4;
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

.organization-list {
	@apply flex flex-col w-full max-w-2xl justify-center;
}
.organization-list .title {
	@apply text-4xl mb-4 font-bold;
}
.organization-list .item .info {
	@apply inline-flex items-center;
}
.organization-list .item .id {
	@apply inline-block self-end mx-1;
}
.organization-list .item .status {
	@apply inline-block mx-1;
}

.btn {
	@apply dark:border-gray-700;
}
.title .btn {
	@apply mx-2 text-base rounded-full p-1.5;
}

.announcement-info {
	@apply flex flex-col w-full max-w-2xl my-8 justify-center;
}
.announcement-info .title {
	@apply text-4xl mb-4 font-bold;
}
.announcement-list .item {
	@apply flex-col items-start;
}

.btn.danger {
	@apply text-red-500 dark:text-red-400;
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
