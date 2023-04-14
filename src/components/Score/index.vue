<template>
	<div class="score">
		<h1>
			<span>解题大厅</span
			><span :class="['op', loadingClass]" @click="researchSubmission">
				<el-icon :size="18"><Refresh /></el-icon>
			</span>
		</h1>
		<el-pagination
			v-if="total"
			v-model:currentPage="submitPage"
			:total="total"
			background
			@current-change="getSubmitArr"
			layout="prev, pager, next, total, jumper"
			v-loading="loading"
		></el-pagination
		><br />
		<el-table :data="subs" border :default-sort="{ order: sortByCount }">
			<el-table-column
				prop="timeStamp"
				label="时间"
				sortable
				align="center"
			>
				<template #default="scope">
					{{
						new Date(parseInt(scope.row.timeStamp)).toLocaleString()
					}}
				</template>
			</el-table-column>
			<el-table-column
				prop="leetName"
				label="提交名"
				sortable
				align="center"
			/>
			<el-table-column prop="submitId" label="提交ID" align="center" />
			<el-table-column label="操作" align="center">
				<template #default="scope">
					<el-link
						type="primary"
						@click="
							getSubmissionDetail(
								scope.row.submitId,
								scope.row.userid
							)
						"
						>查看</el-link
					>
				</template>
			</el-table-column>
		</el-table>
		<Detail
			class="detail"
			ref="detail"
			:submissionDetail="submissionDetail"
			:loading="loading"
			:author="author"
		/>
	</div>
</template>

<script>
import { _debounce } from "@/plugins/utils"
import Detail from "@/components/Score/Detail/index.vue"

export default {
	name: "Score",
	components: { Detail },
	data() {
		return {
			loading: true,
			loadingClass: "",
			subs: [],
			submissionDetail: {},
			submitPage: 1,
			pageLimit: 10,
			total: null,
			author: null,
		}
	},
	beforeCreate() {
		this.$public.on("clear-user-sign-status", () => {
			this.initTables()
		})
		this.$public.on("leetcode-local-submit", () => {
			this.initTables()
		})
	},
	mounted() {
		this.initTables()
	},
	methods: {
		sortByCount: (a, b) => a - b,
		getSubmissionDetail: _debounce(async function (id, uid) {
			await this.$leetcode
				.getSubmissionStatus(`${id}`)
				.then((result) => {
					const { submissionDetail } = result.data.data
					if (!submissionDetail) {
						this.$public.emit("notice", {
							type: "error",
							msg: `❌ 检测到未登入 LeetCode 无法获取题解详情`,
						})
						return 0
					}
					this.getSubmitor(uid)
					this.submissionDetail = submissionDetail
					this.$public.emit("notice", {
						type: "success",
						msg: `✔ 提交返回数据`,
					})
				})
				.catch((e) => {
					this.$public.emit("notice", {
						type: "error",
						msg: `获取提交返回数据失败 ${e.message}`,
					})
				})
		}, 300),
		getSubmitArr: _debounce(function (val) {
			this.loading = true
			this.submissionDetail = {}
			this.$conf.getHost().then((h) => {
				this.$conf
					.allLeetcodeSubmission({
						host: this.$conf.getHttpString(h.host),
						limit: this.pageLimit,
						offset: (this.submitPage - 1) * this.pageLimit,
					})
					.then((result) => {
						this.subs = result.data.arr
						this.total = result.data.all
						this.submitPage = val
						this.loading = false
						this.$public.emit("notice", {
							type: "success",
							msg: "✔ 获取提交列表",
						})
					})
					.catch((err) => {
						console.log(err.message)
					})
			})
		}, 400),
		getSubmitor: function (uid) {
			this.$conf.getHost().then((h) => {
				this.$conf
					.getUserDetailById({
						host: this.$conf.getHttpString(h.host),
						id: uid,
					})
					.then((data) => {
						const { nickname, avatar, introduce } = data.data[0]
						this.author = { nickname, avatar, introduce }
					})
			})
		},
		researchSubmission: _debounce(function () {
			this.loading = true
			this.loadingClass = "loading"
			this.$public.emit("notice", {
				msg: "重新获取提交列表",
				fn: () => {
					this.initTables()
					this.loading = false
					this.loadingClass = ""
				},
			})
		}, 500),
		getQuestionPage: function () {},
		initTables: function () {
			this.submitPage = 1
			this.getSubmitArr()
		},
	},
}
</script>

<style scoped lang="postcss">
.score {
	@apply flex w-full h-auto flex-col;
}

h1 {
	@apply flex items-center justify-between text-3xl font-extralight;
	font-family: "HanSerif";
}
h1 span {
	@apply flex items-center py-2;
}
.el-pagination {
	@apply inline-block w-full pt-4;
}

.op {
	@apply inline-flex items-center justify-center w-8 h-8 text-base bg-white rounded-full
  hover:bg-gray-400 hover:text-white dark:bg-gray-700 dark:hover:bg-gray-200 dark:hover:text-gray-800
  transition-all;
}

.op.loading {
	@apply animate-spin;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>
