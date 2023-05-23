<template>
	<div class="rank">
		<span class="title">签到榜单</span>
		<div
			class="mainContainer"
			v-for="(item, index) in rankers"
			:key="item.nickname"
			v-loading="isLoading"
		>
			<span class="th"
				>{{ index + 1 }}<sup>{{ thString(index + 1) }}</sup></span
			>
			<span class="info">
				<span class="nickname">{{ item.nickname }}</span>
			</span>
		</div>
		<div class="null" v-if="!rankers.length">
			<el-empty description="暂时还没有人上榜"></el-empty>
		</div>
	</div>
</template>

<script>
import { SettingKey, HostKey } from "@/tokens"

export default {
	name: "Rank",
	inject: {
		host: {
			from: HostKey,
		},
		setting: {
			from: SettingKey,
		},
	},
	watch: {
		setting: {
			handler: function () {
				this.initRankers()
			},
			deep: true,
			immediate: true,
		},
	},
	data() {
		return {
			isLoading: true,
			rankers: [],
		}
	},
	beforeCreate() {
		this.$public.on("update-user-check", () => {
			this.initRankers()
		})
		this.$public.on("clear-user-sign-status", () => {
			this.initRankers()
		})
		this.$public.on("app-provided", () => {})
	},
	methods: {
		initRankers: function () {
			this.isLoading = true
			this.$conf
				.allCheckToday(this.host.host)
				.then((adata) => {
					const { detail, order } = adata.data
					this.rankers = detail.sort((a, b) => {
						return order.indexOf(a.id) - order.indexOf(b.id)
					})

					this.isLoading = false
				})
				.catch((e) => {
					console.log(e.messgae)
				})
		},
		thString: function (i) {
			if (i == 1) return "st"
			else if (i == 2) return "nd"
			else if (i == 3) return "rd"
			return "th"
		},
	},
}
</script>

<style scoped lang="postcss">
.rank {
	@apply relative w-full mt-8;
}

.title {
	@apply sticky inline-block w-full h-full top-0 py-4 text-lg font-extralight text-left border-b-2
	border-gray-200 dark:border-gray-600;
	z-index: 2001;

	font-family: "HanSerif";
}
.mainContainer {
	@apply relative inline-flex justify-center items-center py-4 w-full;

	font-family: "HanyiWH";
}

.avatar {
	@apply inline-block w-24 ml-2;
}
.icon {
	@apply text-4xl inline-block h-full px-2;
}
.info {
	@apply relative inline-flex flex-col justify-center w-full ml-2;
}

.info .nickname {
	@apply block text-base truncate font-semibold;
	max-width: 12ch;
}

.th {
	@apply inline-block text-xl w-6 font-mono;
}

@media (prefers-color-scheme: dark) {
	.title {
		@apply bg-gray-800;
	}
}

@media (prefers-color-scheme: light) {
	.title {
		@apply bg-gray-100;
	}
}
</style>
