<template>
	<div class="table">
		<el-divider>Search</el-divider>
		<div class="tipContainer">
			<span class="tip">
				<el-icon><InfoFilled /></el-icon>&nbsp;
				仅显示用户于本地存储的最近的 10 条记录
			</span>
			<span class="op">
				<el-icon @click="researchSubmission"><Refresh /></el-icon>
			</span>
		</div>
		<el-table
			:data="idList"
			border
			:default-sort="{ order: sortByCount }"
			table-layout="auto"
			class="subitable"
		>
			<el-table-column
				prop="timeStamp"
				label="时间"
				sortable
				align="center"
			>
				<template #default="scope">
					<el-tag>{{
						new Date(parseInt(scope.row.timeStamp)).toLocaleString()
					}}</el-tag>
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
					<el-button
						type="primary"
						@click="getSubmissionDetail(scope.row.submitId)"
						>查看</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<el-descriptions
			class="submitInfo"
			border
			v-if="submissionDetail.question"
			size="small"
		>
			<el-descriptions-item label="题目ID" label-align="center">{{
				submissionDetail.question.questionId
			}}</el-descriptions-item>
			<el-descriptions-item label="题目名" label-align="center">{{
				submissionDetail.question.title
			}}</el-descriptions-item>
			<el-descriptions-item label="翻译名" label-align="center">{{
				submissionDetail.question.translatedTitle
			}}</el-descriptions-item>

			<el-descriptions-item label="提交ID" label-align="center">{{
				submissionDetail.id
			}}</el-descriptions-item>
			<el-descriptions-item label="提交状态/语言" label-align="center">{{
				submissionDetail.statusDisplay + " / " + submissionDetail.lang
			}}</el-descriptions-item>
			<el-descriptions-item label="时间戳" label-align="center">{{
				new Date(submissionDetail.timestamp * 1000).toLocaleString()
			}}</el-descriptions-item>

			<el-descriptions-item
				label="终止测试用例/输出"
				label-align="center"
				class-name="needmorelong"
				>{{
					!submissionDetail.outputDetail.lastTestcase
						? "无"
						: submissionDetail.outputDetail.lastTestcase +
						  " / " +
						  submissionDetail.outputDetail.expectedOutput
				}}
			</el-descriptions-item>
			<el-descriptions-item
				label="已通过测试用例个数"
				label-align="center"
				>{{
					submissionDetail.passedTestCaseCnt +
					" / " +
					submissionDetail.totalTestCaseCnt
				}}
			</el-descriptions-item>
			<el-descriptions-item label="运行时间" label-align="center"
				>{{ submissionDetail.runtime }}
			</el-descriptions-item>
			<el-descriptions-item
				label="编译错误"
				label-align="center"
				span="3"
			>
				<pre><code>{{
        `${!submissionDetail.outputDetail.compileError?"无":submissionDetail.outputDetail.compileError}`
      }}</code></pre>
			</el-descriptions-item>
			<el-descriptions-item
				label="运行时错误"
				label-align="center"
				span="3"
			>
				<pre><code>{{
            `${!submissionDetail.outputDetail.runtimeError?"无":submissionDetail.outputDetail.runtimeError}`
         }}</code></pre>
			</el-descriptions-item>
			<el-descriptions-item label="代码" label-align="center" span="3">
				<pre><code>{{
        `${submissionDetail.code}`
      }}</code></pre>
			</el-descriptions-item>
		</el-descriptions>
	</div>
</template>

<script>
// @ is an alias to /src
import { _debounce } from "@/plugins/utils"

export default {
	name: "LeetcodeTable",
	props: {},
	beforeCreate() {
		this.$public.on("leetcode-update-question-detail", (obj) => {
			this.questions = obj
		})
		this.$public.on("leetcode-user-sign-in", (name) => {
			this.leetname = name
		})
		this.$public.on("leetcode-submit-back-id", (id) => {
			this.afterIdSubmission(id)
		})
		this.$public.on("update-username", () => {
			this.initSubmission()
		})
		this.$public.on("clear-user-sign-status", () => {
			this.idList = null
			this.submissionDetail = {}
		})
	},
	mounted() {
		this.initSubmission()
	},
	activated() {},
	data() {
		return {
			idList: null,
			leetname: "游客",
			questions: {},
			submissionDetail: {},
		}
	},
	methods: {
		sortByCount: function (a, b) {
			return b - a
		},
		addSubmission: function (leetname, submitid, status, timestamp) {
			if (!localStorage.getItem("username")) {
				this.$public.emit("notice", {
					msg: `☹ 检测用户Team未登入 本次提交将无法记录于Team 请前往LeetCode官网查看详细结果`,
					time: 4500,
				})
				return 0
			} else {
				this.$public.emit("notice", {
					msg: `提交本地录入 ${submitid}`,
					time: 5000,
					fn: () => {
						this.initSubmission()
						this.$public.emit("leetcode-local-submit")
					},
				})
				this.$conf.getHost().then((h) => {
					this.$conf
						.addLeetcodeSubmission({
							host: this.$conf.getHttpString(h.host),
							leetname,
							username: localStorage.getItem("username"),
							appkey: localStorage.getItem("appKey"),
							submitid,
							status,
							timestamp,
						})
						.catch((e) => {
							this.$public.emit("notice", {
								msg: `提交本地修改失败 ${e.message}`,
							})
						})
				})
			}
		},
		afterIdSubmission: function (id) {
			this.$public.emit("notice", {
				msg: `🐱‍👤 正在为您查询本次提交 ID[${id}]`,
				time: 8000,
			})
			setTimeout(async () => {
				await this.$leetcode
					.getSubmissionStatusOnsubmit(`${id}`)
					.then((result) => {
						const { status_msg, task_finish_time } = result.data
						this.$public.emit("notice", {
							msg: `获取提交状态 ${status_msg} 详细信息请于查询处查询本次提交`,
							time: 5000,
							fn: () => {
								console.log(result)
								this.addSubmission(
									this.leetname,
									id,
									task_finish_time,
									status_msg
								)
							},
						})
					})
					.catch((e) => {
						this.$public.emit("notice", {
							msg: `获取提交返回数据失败 ${e.message} 本次提交将不被录入本地`,
							time: 5000,
						})
					})
			}, 8000)
		},
		getSubmissionDetail: _debounce(async function (id) {
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
					this.submissionDetail = submissionDetail
				})
				.catch((e) => {
					this.$public.emit("notice", {
						msg: `获取提交返回数据失败 ${e.message}`,
					})
				})
		}, 300),
		researchSubmission: _debounce(function () {
			this.$public.emit("notice", {
				msg: "重新获取提交列表",
				fn: () => {
					this.initSubmission()
				},
			})
		}, 500),
		initSubmission: function () {
			this.$conf.getHost().then((h) => {
				if (localStorage.getItem("username"))
					this.$conf
						.getLeetcodeSubmission({
							host: this.$conf.getHttpString(h.host),
							username: localStorage.getItem("username"),
						})
						.then((res) => {
							this.idList = res.data
							this.$public.emit("notice", {
								msg: "获取提交列表",
								type: "success",
							})
						})
						.catch((e) => {
							console.log(e)
						})
			})
		},
	},
}
</script>

<style scoped lang="postcss">
.table {
	@apply w-full text-center;
}

.el-tag {
	@apply bg-transparent;
}

.subitable {
	@apply w-2/3 mx-auto bg-transparent;
}

.submitInfo {
	@apply w-2/3 mx-auto;
}

:deep(.el-descriptions__content) {
	@apply whitespace-pre-line;
}

:deep(.needmorelong) {
	@apply inline-block w-32 overflow-ellipsis overflow-hidden border-none;
}
:deep(.el-descriptions .is-bordered td.needmorelong) {
	@apply border-none;
}

.tipContainer {
	@apply flex justify-between w-2/3 mx-auto text-left p-2;
}
.tipContainer .el-icon {
	@apply inline-block mx-2;
}
.tipContainer .tip {
	@apply flex justify-center items-center opacity-50 font-semibold text-xs;
}
.tipContainer .op {
	@apply inline-block;
}

@media (prefers-color-scheme: dark) {
	:deep(.el-table tr) {
		@apply bg-gray-800 text-gray-300 text-base;
	}
	:deep(.el-table th) {
		@apply bg-gray-800;
	}
	:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
		@apply bg-gray-700;
	}
	:deep(.el-descriptions__body),
	:deep(.el-descriptions__label) {
		@apply bg-transparent;
	}
	:deep(.el-descriptions__label) {
		@apply text-gray-200;
	}
	:deep(.el-descriptions__content) {
		@apply text-gray-300;
	}
	:deep(.el-divider__text) {
		@apply bg-gray-800 text-gray-200;
	}
	:deep(.el-table__body-wrapper) {
		@apply bg-transparent;
	}
}

@media (prefers-color-scheme: light) {
	:deep(.el-divider__text) {
		@apply bg-gray-100 text-gray-800;
	}
}
</style>
