<script>
import { _debounce } from "@/plugins/utils"
import Organization from "@/components/Manage/organization.vue"
import Announcement from "@/components/Manage/announcement.vue"
import Users from "../components/Manage/users.vue"
import { SettingKey, HostKey, UserStatusKey } from "@/tokens"

export default {
	name: "Manage",
	components: { Organization, Announcement, Users },
	computed: {
		detailVisible: function () {
			return (
				!!this.selectedOrganizationInfo.id &&
				(this.superUser || this.hostUser)
			)
		},
	},
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
	watch: {
		userStatus: {
			handler: function () {
				this.superUser = this.userStatus.isSuper
				this.hostUser = this.userStatus.isHost

				this.$nextTick(() => {
					if (this.setting.userInfo.organization)
						this.getOrganizationInfo(
							this.setting.userInfo.organization
						)
					this.getAllOrganization()
				})
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			allOrganization: [],
			selectedOrganizationInfo: {},
			superUser: false,
			hostUser: false,
		}
	},
	beforeCreate() {
		this.$public.on("controller-sign-in", () => {
			if (this.hostUser)
				this.getOrganizationInfo(this.setting.userInfo.organization)
			this.getAllOrganization()
		})

		this.$public.on("update-from-keys-failed", () => {
			if (this.hostUser)
				this.getOrganizationInfo(this.setting.userInfo.organization)
			this.getAllOrganization()
		})

		this.$public.on("user-created-organization", () => {
			if (this.hostUser)
				this.getOrganizationInfo(this.setting.userInfo.organization)
			this.getAllOrganization()
		})

		this.$public.on("app-provided", () => {
			this.getAllOrganization()
		})
	},
	created() {},
	mounted() {},
	methods: {
		getOrganizationInfo: _debounce(function (id) {
			this.$conf
				.getOrganizationById({
					// Use the host to get the full URL
					host: this.host.host,
					id,
				})
				.then((res) => {
					// Save the organization information
					this.selectedOrganizationInfo = res.data[0] || {}
				})
		}, 400),
		getAllOrganization() {
			this.$conf
				.allOrganization({
					host: this.host.host,
				})
				.then((res) => {
					this.allOrganization = res.data
				})
		},
		updatePageData() {
			this.getAllOrganization()
			this.getOrganizationInfo(this.selectedOrganizationInfo.id)
		},
	},
}
</script>

<template>
	<div class="organization">
		<div class="organization-list" v-if="superUser">
			<span class="title">
				<span>组织管理</span>
			</span>
			<span class="item" v-for="item in allOrganization" :key="item.id">
				<span class="info">
					<span class="id">{{ `#${item.id}` }}</span>
					<span class="name">{{ item.name }}</span>
					<span class="status">
						{{ item.status ? "已认证" : "未认证" }}
					</span>
				</span>
				<button
					class="btn"
					title="管理该组织"
					@click="getOrganizationInfo(item.id)"
				>
					<el-icon><Setting /></el-icon>
				</button>
			</span>
		</div>
		<Organization
			:selectedOrganizationInfo="selectedOrganizationInfo"
			@update:info="updatePageData"
		/>
		<Announcement
			:selectedOrganizationInfo="selectedOrganizationInfo"
			@update:info="updatePageData"
		/>
		<Users v-if="superUser" />
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

.organization-list {
	@apply flex flex-col w-full max-w-2xl justify-center;
}
.organization-list .title {
	@apply text-3xl mb-4 font-bold;
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
