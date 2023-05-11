<template>
	<div class="score">
		<h1>
			<span>解题大厅</span
			><span :class="['op', loadingClass]" @click="researchSubmission">
				<el-icon :size="18"><Refresh /></el-icon>
			</span>
		</h1>
		<!-- use div acheve a list to show subs data, do not use el-table -->
		<div v-if="!loading || (subs.length && !loading)" class="sub-list">
			<div class="sub-item list-header">
				<div class="sub-item-content">
					<span class="no-wrap">
						<span class="id">提交ID</span>
						<span class="status">状态</span>
						<span class="leetName">LeetCode 用户名</span>
					</span>
					<span class="time">提交时间</span>
				</div>
			</div>
			<div v-for="item in subs" :key="item.submitId" class="sub-item">
				<div class="sub-item-content">
					<span class="no-wrap">
						<span
							class="id"
							@click="
								getSubmissionDetail(item.submitId, item.userid)
							"
							>{{ item.submitId }}</span
						>
						<span class="status">{{ item.status }}</span>
						<span class="leetName">{{ item.leetName }}</span>
					</span>
					<span class="time">{{
						getComputedTime(item.timeStamp)
					}}</span>
				</div>
			</div>
			<Pagination
				v-model="submitPage"
				:total="total"
				:size="pageLimit"
				:prev="prevPage"
				:next="nextPage"
			/>
		</div>
		<div v-else class="empty">
			<el-empty description="暂无提交记录"></el-empty>
		</div>
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
import Pagination from "@/components/Frameworks/Pagination/index.vue"

export default {
	name: "Score",
	components: { Detail, Pagination },
	data() {
		return {
			loading: true,
			loadingClass: "",
			subs: [],
			submissionStatus: {},
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
	watch: {
		submitPage: function () {
			this.getSubmitArr()
		},
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
					console.log(submissionDetail, result)
					if (!submissionDetail) {
						this.$public.emit("notice", {
							type: "error",
							msg: `无法获取题解详情 ERRCODE: -3`,
						})
						return 0
					}
					this.getSubmitor(uid)
					this.submissionDetail = submissionDetail
					this.$public.emit("notice", {
						type: "success",
						msg: `提交返回数据`,
					})
				})
				.catch(() => {
					this.$public.emit("notice", {
						type: "error",
						msg: `获取提交返回数据失败 ERRCODE: -2`,
					})
				})
		}, 300),
		getSubmitArr: _debounce(function () {
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

						this.loading = false
						console.log(result)

						this.$public.emit("notice", {
							type: "success",
							msg: "获取提交列表",
						})
					})
					.catch(() => {
						this.$public.emit("notice", {
							type: "error",
							msg: `获取提交返回数据失败 ERRCODE: -2`,
						})
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
		initTables: function () {
			if (this.submitPage === 1) this.getSubmitArr()
			else this.submitPage = 1
		},
		prevPage: function () {
			this.submitPage--
		},
		nextPage: function () {
			this.submitPage++
		},
		getComputedTime: function (timestamp) {
			function addzero(num) {
				return num < 10 ? "0" + num : num
			}

			const date = new Date(parseInt(timestamp))
			const Y = date.getFullYear() + "-"
			const M =
				(date.getMonth() + 1 < 10
					? "0" + (date.getMonth() + 1)
					: date.getMonth() + 1) + "-"
			const D = addzero(date.getDate()) + " "
			const h = addzero(date.getHours()) + ":"
			const m = addzero(date.getMinutes()) + ":"
			const s = addzero(date.getSeconds())
			return Y + M + D + h + m + s
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

.sub-list {
	@apply inline-flex justify-center flex-col w-full flex-grow my-4;
	font-family: Consolas, "HanSerif";
}

.sub-list .sub-item {
	@apply flex items-center justify-between w-full my-1 px-4 py-2 text-base border-2 rounded-md
	border-gray-200 dark:border-gray-700
	hover:border-gray-300 dark:hover:border-gray-500
	hover:shadow
	hover:bg-gray-50 dark:hover:bg-gray-600 transition-all;
}

.sub-list .sub-item-content {
	@apply inline-flex justify-between w-full;
}

.sub-item-content .no-wrap {
	@apply truncate;
}

.sub-item-content .id {
	@apply inline-flex items-center justify-center pr-2 border-r-2
	border-gray-200 dark:border-gray-700
	transition-all cursor-pointer;
}

.sub-item-content .status {
	@apply inline-flex items-center justify-center px-2 border-r-2
	border-gray-200 dark:border-gray-700
	transition-all;
}

.sub-item:hover .id,
.sub-item:hover .status {
	@apply border-gray-300 dark:border-gray-500;
}

.sub-item-content .leetName {
	@apply inline-flex items-center mx-2;
}

.sub-item-content .time {
	@apply inline-flex items-center
	whitespace-nowrap;
}

.sub-item.list-header {
	@apply pointer-events-none border-gray-300 dark:border-gray-600
	bg-gray-50 dark:bg-gray-900;
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
