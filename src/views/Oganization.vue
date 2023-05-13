<script>
export default {
	name: "Oganization",
	beforeCreate() {
		this.$public.on("update-main-user-info-upto-app", ({ detail }) => {
			this.updateUserAccessStatus(detail.access_team)
		})
	},
	created() {
		this.$conf.getConfPromise().then((conf) => {
			this.getOganizationInfo(conf.data.userInfo.oganization)
			this.getMembersInfo(conf.data.userInfo.oganization)
		})
	},
	mounted() {},
	components: {},
	data() {
		return {
			oganizationInfo: {},
			hasOganization: false,
		}
	},
	methods: {
		computedStatusClass: (status) => (status ? "access" : null),
		getOganizationInfo: function (id) {
			this.$conf.getHost().then((h) => {
				this.$conf
					.getOganizationById({
						host: this.$conf.getHttpString(h.host),
						id,
					})
					.then((res) => {
						this.oganizationInfo = res.data[0] || {}

						console.log(this.oganizationInfo)
					})
			})
		},
		getMembersInfo: function (oid) {
			this.$conf.getHost().then((h) => {
				this.$conf
					.getMembersByOganizationId({
						host: this.$conf.getHttpString(h.host),
						oid,
					})
					.then((res) => {
						// this.oganizationInfo = res.data[0] || {}
						const { detail, members } = res.data
						console.log(detail, members)
					})
			})

			this.updateUserAccessStatus(oid)
		},
		updateUserAccessStatus: function (bool) {
			this.hasOganization = !!bool
		},
	},
}
</script>

<template>
	<div class="oganization">
		<div class="oganization-info" v-if="hasOganization">
			<span class="name">{{ oganizationInfo.name }}</span>
			<span
				:class="[
					'status',
					computedStatusClass(!!oganizationInfo.status),
				]"
				>{{ !!oganizationInfo.status ? "已认证" : "未认证" }}</span
			>
		</div>
		<div class="members-info"></div>
		<div class="oganization-list">
			<span class="title">{{
				hasOganization ? "其他组织" : "组织列表"
			}}</span>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.oganization {
	@apply inline-flex flex-col items-center w-full h-auto py-4;
	font-family: "Consolas", "HanSerif";
}

.oganization-info {
	@apply flex w-full max-w-2xl items-center;
}
.oganization-info .name {
	@apply text-4xl font-bold;
}
.oganization-info .status {
	@apply inline-flex justify-center items-center px-1 py-0.5 mx-2 rounded
	font-bold text-gray-50 dark:text-gray-800 bg-gray-400 dark:bg-gray-500
	transition-all shadow;
}
.oganization-info .status.access {
	@apply bg-green-400 dark:bg-green-500;
}
</style>
