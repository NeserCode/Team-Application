<script>
import createOrganization from "@/components/Dialogs/createOrganization.vue"

export default {
	name: "Organization",
	beforeCreate() {
		this.$public.on("update-main-user-info-upto-app", ({ detail }) => {
			this.getOrganizationInfo(detail.access_team)
			this.getMembersInfo(detail.access_team)

			this.getAllOrganization()
		})
	},
	created() {},
	mounted() {
		this.$conf.getConfPromise().then((conf) => {
			this.getOrganizationInfo(conf.data.userInfo.organization)
			this.getMembersInfo(conf.data.userInfo.organization)

			this.getAllOrganization()
		})
	},
	components: {
		createOrganization,
	},
	data() {
		return {
			organizationInfo: {},
			hasOrganization: false,
			allOrganization: [],
			membersInfo: {},
			visible: {
				createOrganization: false,
				joinOrganization: false,
			},
		}
	},
	methods: {
		computedStatusClass: (status) => (status ? "access" : null),
		computedOwnOgnizationClass: (item, id) =>
			item.id === id ? "own" : null,
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
						const { detail, members } = res.data
						this.membersInfo.detail = detail
						this.membersInfo.members = members
					})
			})

			// Update the user's access status
			this.updateUserAccessStatus(oid)
		},
		getAllOrganization() {
			console.log("?")
			this.$conf.getHost().then((h) => {
				this.$conf
					.allOrganization({
						host: this.$conf.getHttpString(h.host),
					})
					.then((res) => {
						this.allOrganization = res.data
					})
			})
		},
		updateUserAccessStatus: function (bool) {
			this.hasOrganization = !!bool
		},
		handleCreateOrganization: function () {
			this.visible.createOrganization = true
		},
		updateVisibleCreateOrganization: function (bool) {
			this.visible.createOrganization = bool
		},
		updateUserOrganization: async function ({ oid, uid }) {
			const h = await this.$conf.getHost()
			await this.$conf
				.updateUserAccess({
					host: this.$conf.getHttpString(h.host),
					oid,
					uid,
				})
				.then((res) => {
					console.log(res)
				})

			this.$conf.getConfPromise().then((conf) => {
				this.getOrganizationInfo(conf.data.userInfo.organization)
				this.getMembersInfo(conf.data.userInfo.organization)

				this.getAllOrganization()
			})
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
		<div class="organization-list">
			<span class="title">
				<span>组织列表</span>
				<button class="btn" @click="handleCreateOrganization">
					<el-icon><Plus /></el-icon>
				</button>
			</span>
			<span
				:class="['item']"
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
				<button class="btn" title="向该组织提交申请">
					<el-icon><Promotion /></el-icon>
				</button>
			</span>
		</div>
		<create-organization
			:visible="visible.createOrganization"
			@update:visible="updateVisibleCreateOrganization"
			@create:success="updateUserOrganization"
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
