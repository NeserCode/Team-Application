<template>
	<div class="questionList" v-show="isShowList">
		<el-table
			:data="questionSet.questions"
			table-layout="fixed"
			border
			class="questionTable"
			empty-text="努力获取数据中"
		>
			<el-table-column
				prop="status"
				label="状态"
				width="60"
				align="center"
			>
				<template #default="scope">
					<el-icon v-if="scope.row.status == 'AC'" title="Accept"
						><Check
					/></el-icon>
					<el-icon
						v-else-if="scope.row.status == 'TRIED'"
						title="Tried"
						><View
					/></el-icon>
					<el-icon
						v-else-if="scope.row.status == 'NOT_STARTED'"
						title="Not_Started"
						><Minus
					/></el-icon>
				</template>
			</el-table-column>
			<el-table-column
				prop="isFavor"
				label="收藏"
				width="60"
				align="center"
			>
				<template #default="scope">
					<el-icon v-if="scope.row.isFavor" title="已收藏">
						<star-filled />
					</el-icon>
					<el-icon v-else title="收藏">
						<star />
					</el-icon>
				</template>
			</el-table-column>
			<el-table-column
				prop="frontendQuestionId"
				label="题目ID"
				width="100"
				align="center"
			></el-table-column>
			<el-table-column prop="title" label="题目">
				<template #default="scope">
					<span class="title">{{ scope.row.title }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="difficulty" label="难度" sortable>
				<template #default="scope">
					<el-tag
						:type="
							scope.row.difficulty == 'EASY'
								? 'success'
								: scope.row.difficulty == 'MEDIUM'
								? ''
								: 'danger'
						"
						>{{ scope.row.difficulty }}</el-tag
					>
				</template>
			</el-table-column>
			<el-table-column prop="titleSlug" label="操作" width="120">
				<template #default="scope">
					<el-button
						@click="getQuestionContent(scope.row.titleSlug)"
						type="primary"
					>
						解题
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			v-if="questionSet.total"
			v-model:currentPage="questionPage"
			:total="questionSet.total"
			background
			@current-change="getQuestionPage"
			layout="prev, pager, next, jumper"
		/>
	</div>
</template>

<script>
// @ is an alias to /src
import { _debounce, _throttle } from "@/plugins/utils"

export default {
	name: "QuestionList",
	props: {},
	beforeCreate() {
		this.$public.on("leetcode-toggle-list-show", (val) => {
			this.isShowList = val
		})
		this.$public.on("leetcode-update-question-list", (val) => {
			this.questionSet = val
		})
	},
	mounted() {
		this.initQuestionSet()
	},
	activated() {},
	data() {
		return {
			clickable: true,
			isShowList: true,
			question: {},
			questionSet: {},
			questionPage: 1,
			totalPages: 1,
			pageLimit: 10,
		}
	},
	methods: {
		getQuestionContent: _debounce(function (slug) {
			this.$public.emit("notice", {
				type: "loading",
				msg: "🎈 正在获取题目详情...",
			})
			this.$leetcode
				.getCookie("https://leetcode-cn.com/graphql/")
				.then((data) => {
					for (let i = 0; i < data.length; i++)
						this.$leetcode.setCookie(
							`https://leetcode-cn.com/problems/${slug}/submit/`,
							data[i].name,
							data[i].value
						)
				})
			setTimeout(() => {
				this.$leetcode.getQuestion(slug).then((response) => {
					this.question = response.data.data.question
					this.$public.emit(
						"leetcode-update-question-detail",
						this.question
					)
					this.$public.emit(
						"leetcode-toggle-list-show",
						!this.isShowList
					)
					this.$public.emit("notice", {
						type: "success",
						msg: `获取题目详情 成功 -${this.question.title}`,
					})
				})
			}, 200)
		}, 1000),
		getQuestionPage: _throttle(function (val) {
			if (val <= 0)
				this.$public.emit("notice", {
					msg: "获取题目 失败: 页号非法",
					type: "error",
					closefunc: () => {
						this.clickable = true
					},
				})
			else if (val <= this.totalPages && val != null && this.clickable) {
				this.$public.emit("notice", {
					type: "loading",
					msg: "🎈 正在获取题目...",
				})
				this.clickable = false
				this.$leetcode
					.getQuestionSet(
						"", //目录名选项
						(val - 1) * this.pageLimit,
						this.pageLimit
					)
					.then((response) => {
						this.questionSet =
							response.data.data.problemsetQuestionList
						this.questionPage = val
						this.clickable = true
						this.$public.emit("notice", {
							type: "success",
							msg: "获取题目 成功",
						})
					})
			} else
				this.$public.emit("notice", {
					msg: "获取题目 失败: 页号非法",
					type: "error",
					closefunc: () => {
						this.clickable = true
					},
				})
		}, 120),
		initQuestionSet: function () {
			this.$leetcode
				.getQuestionSet("", 0, this.pageLimit)
				.then((response) => {
					this.questionSet = response.data.data.problemsetQuestionList
					this.totalPages =
						parseInt(this.questionSet.total / this.pageLimit) + 1
				})
		},
	},
}
</script>

<style scoped lang="postcss">
.questionList {
	@apply border border-gray-500 my-2 mx-12;
}

.questionList .pageSet {
	@apply my-4;
}

.questionList .pageSet .btn {
	@apply text-sm bg-transparent;
}

.questionList .pageSet .input {
	@apply w-48 mx-3 bg-transparent;
}

.questionListItem .id {
	@apply inline-block text-center;
	min-width: 2em;
}

.questionListItem .title {
	@apply font-medium;
}

.el-pagination {
	@apply inline-flex justify-center items-center w-full text-center py-8;
}
.el-tag {
	@apply bg-transparent;
}

:deep(.el-pagination button.btn-next),
:deep(.el-pagination button.btn-prev),
:deep(.el-pager li.number),
:deep(.el-pager li.more) {
	@apply bg-transparent text-base;
}

@media (prefers-color-scheme: dark) {
	.questionList {
		@apply bg-gray-800;
	}

	:deep(.el-input__inner) {
		@apply bg-gray-800 border border-gray-100;
	}

	:deep(.el-table tr) {
		@apply bg-gray-800 text-gray-300 text-base;
	}

	:deep(.el-table th) {
		@apply bg-gray-800;
	}

	:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
		@apply bg-gray-700;
	}

	:deep(.el-pagination button.btn-next),
	:deep(.el-pagination button.btn-prev),
	:deep(.el-pager li.number),
	:deep(.el-pager li.more) {
		@apply text-gray-300;
	}

	:deep(.el-pagination span:not([class*="suffix"])) {
		@apply text-base;
	}

	:deep(.el-pagination .el-input__inner) {
		@apply bg-gray-800 text-gray-400;
	}

	:deep(.el-table__empty-block) {
		background: #16203c;
	}

	:deep(.el-table__empty-text) {
		color: #ccc;
	}
}

@media (prefers-color-scheme: light) {
	.questionList {
		@apply bg-gray-50;
	}
}
</style>
