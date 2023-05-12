<script>
export default {
	name: "Oganization",
	beforeCreate() {},
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
					})
			})
		},
		getMembersInfo: function (id) {
			this.$conf.getHost().then((h) => {
				this.$conf
					.getMembersByOganizationId({
						host: this.$conf.getHttpString(h.host),
						id,
					})
					.then((res) => {
						// this.oganizationInfo = res.data[0] || {}
						const { detail, members } = res.data
						console.log(detail, members)
					})
			})
		},
	},
}
</script>

<template>
	<div class="oganization">
		<div class="oganization-info">
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
	</div>
</template>

<style scoped lang="postcss">
.oganization {
	@apply inline-flex justify-center w-full h-auto py-4;
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
	font-bold text-gray-50 dark:text-gray-800
	transition-all shadow;
}
.oganization-info .status.access {
	@apply bg-green-400 dark:bg-green-500;
}
</style>
