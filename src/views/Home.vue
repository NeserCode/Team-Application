<template>
	<div class="home">
		<div class="topContainer"></div>
		<div class="mainContainer">
			<div class="leftTabs">
				<Announcement class="announcement" />
			</div>
			<div class="centerBody">
				<Score />
			</div>
			<div class="rightTabs">
				<CheckDays class="checkdays" />
				<Rank class="check-rank" />
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import CheckDays from "@/components/CheckDays/index.vue"
import Rank from "@/components/CheckDays/Rank/index.vue"
import Score from "@/components/Score/index.vue"
import Announcement from "@/components/Announcement/Announcement.vue"

export default {
	name: "Home",
	components: { CheckDays, Score, Rank, Announcement },
	beforeCreate() {},
	mounted() {},
	data() {
		return {}
	},
	methods: {},
}
</script>

<style scoped lang="postcss">
.home {
	@apply w-full h-full relative;
}

.topContainer {
	@apply h-16 w-full overflow-hidden;
}
.mainContainer {
	@apply flex justify-center w-full;
}
.mainContainer .leftTabs,
.mainContainer .rightTabs {
	@apply w-1/5 mx-4 text-center;
}
.checkdays,
.announcement,
.check-rank {
	@apply inline-flex flex-col h-auto;
	max-width: 277px;
}
.mainContainer .centerBody {
	@apply h-full w-1/2 mx-0 px-4;
}

.artical {
	@apply inline-block w-full h-auto rounded-md p-2 my-4;
}

@media screen and (max-width: 960px) {
	.mainContainer .leftTabs,
	.mainContainer .rightTabs {
		@apply hidden;
	}
	.mainContainer .centerBody {
		@apply h-full w-2/3;
	}
}

@media (prefers-color-scheme: dark) {
	.home {
		@apply bg-gray-800;
	}
}

@media (prefers-color-scheme: light) {
	.home {
		@apply bg-gray-100;
	}
}
</style>
