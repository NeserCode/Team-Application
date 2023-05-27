<template>
	<div class="leetcode">
		<QuestionList />
		<QuestionController />
		<QuestionContainer :question="leetQuestion" />
		<QuestionTable />
	</div>
</template>

<script>
import QuestionList from "@/components/Leetcode/List/index.vue"
import QuestionController from "@/components/Leetcode/Controller/index.vue"
import QuestionContainer from "@/components/Leetcode/Container/index.vue"
import QuestionTable from "@/components/Leetcode/Table/index.vue"

import { SettingKey } from "@/tokens"

export default {
	name: "LeetCode",
	components: {
		QuestionList,
		QuestionController,
		QuestionContainer,
		QuestionTable,
	},
	inject: {
		setting: {
			from: SettingKey,
		},
	},
	data() {
		return {
			leetQuestion: null,
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.getTokenStatus()
		})
	},
	methods: {
		getTokenStatus: function () {
			const { userAccount } = this.setting
			const { cookie_leetcode } = userAccount
			const { LEETCODE_SESSION, "x-csrftoken": x_csrftoken } =
				cookie_leetcode

			if (!LEETCODE_SESSION.length || !x_csrftoken)
				this.$public.emit("notice", {
					title: "Leetcode Cookie 为空",
					type: "warning",
					msg: "这将导致无法提交题解",
					time: 5000,
				})
		},
	},
}
</script>

<style scoped lang="postcss">
.leetcode {
	@apply w-full h-full
  max-w-5xl;
}
</style>
