<script>
// import { _debounce } from "@/plugins/utils"

export default {
	name: "Manage",
	beforeCreate() {
		this.$public.on("update-main-user-info-upto-app", ({ detail }) => {
			this.getOrganizationInfo(detail.access_team)
			this.getMembersInfo(detail.access_team)

			this.getAllOrganization()
		})

		this.$public.on("update-from-keys-failed", () => {
			this.$conf.getConfPromise().then((conf) => {
				this.getOrganizationInfo(conf.data.userInfo.organization)
				this.getMembersInfo(conf.data.userInfo.organization)

				this.getAllOrganization()
			})
		})
	},
	created() {
		this.$conf.getConfPromise().then((conf) => {
			// this.getOrganizationInfo(conf.data.userInfo.organization)
			// this.getMembersInfo(conf.data.userInfo.organization)
			// this.getAllOrganization()

			this.ensureHostorSuperUser(
				conf.data.userInfo,
				conf.data.userInfo.id
			)
		})
	},
	mounted() {},
	components: {},
	data() {
		return {
			organizationInfo: {},
			hasOrganization: false,
			allOrganization: [],
			membersInfo: {},
			superUser: false,
			hostUser: false,
		}
	},
	methods: {
		computedStatusClass: (status) => (status ? "access" : null),
		getOrganizationInfo: function (id) {
			// Get the host
			this.$conf.getHost().then((h) => {
				// Get the organization information
				this.$conf
					.getOrganizationById({
						// Use the host to get the full URL
						host: this.$conf.getHttpString(h.host),
						id,
					})
					.then((res) => {
						// Save the organization information
						this.organizationInfo = res.data[0] || {}
					})
			})
		},
		getMembersInfo: function (oid) {
			// Get the host address first
			this.$conf.getHost().then((h) => {
				// Get the organization member information through the organization ID
				this.$conf
					.getMembersByOrganizationId({
						host: this.$conf.getHttpString(h.host),
						id: oid,
					})
					.then((res) => {
						// Get the user's information
						this.$conf.getConfPromise().then((data) => {
							// Sort by access status
							function sortByStr(array, key) {
								return array.sort(function (a, b) {
									if (a[key] === "HOST") return -1
									else if (b[key] === "HOST") return 1
									else if (
										a[key] === "JOIN" &&
										b[key] === "APPLY"
									)
										return -1
									else if (
										b[key] === "JOIN" &&
										a[key] === "APPLY"
									)
										return 1
								})
							}
							const { detail, members } = res.data
							let i = detail.findIndex(
								(detail) => detail.id === data.data.userInfo.id
							)
							if (i !== -1) detail[i].self = true

							this.membersInfo.detail = sortByStr(
								detail,
								"access_position"
							)

							console.log(this.membersInfo)
							this.membersInfo.members = members
						})
					})
			})

			// Update the user's access status
			this.updateUserAccessStatus(oid)
		},
		updateUserAccessStatus: function (id) {
			this.hasOrganization = !!id
		},
		getAllOrganization() {
			this.$conf.getHost().then((h) => {
				this.$conf
					.allOrganization({
						host: this.$conf.getHttpString(h.host),
					})
					.then((res) => {
						let i = res.data.findIndex(
							(item) => item.id === this.organizationInfo.id
						)
						if (i !== -1) res.data[i].own = true
						this.allOrganization = res.data
					})
			})
		},
		ensureHostorSuperUser: function (info, id, cb) {
			this.superUser = !!info.super
			this.$conf.getHost().then((h) => {
				this.$conf
					.queryHostOrganizationById({
						host: this.$conf.getHttpString(h.host),
						id,
					})
					.then((res) => {
						this.hostUser = res.data.length > 0

						cb && cb()
					})
			})
		},
	},
}
</script>

<template>
	<div class="organization">
		<div
			class="organization-info"
			v-if="hasOrganization && (superUser || hostUser)"
		>
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
					</span>
					<span class="position">{{ detail.access_position }}</span>
				</span>
			</div>
		</div>
		<div class="organization-list" v-if="superUser">
			<span class="title">
				<span>组织列表</span>
				<button class="btn">
					<el-icon><Plus /></el-icon>
				</button>
			</span>
			<span class="item" v-for="item in allOrganization" :key="item.id">
				<span class="info">
					<span class="id">{{ `#${item.id}` }}</span>
					<span class="name">{{ item.name }}</span>
					<span class="status">
						{{ item.status ? "已认证" : "未认证" }}
					</span>
				</span>
				<button class="btn" title="向该组织提交申请">
					<el-icon><Promotion /></el-icon>
				</button>
			</span>
		</div>
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
</style>
