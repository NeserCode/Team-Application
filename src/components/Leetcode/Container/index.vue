<template>
	<div class="innerContainer" v-if="questions.content && isShowQuestion">
		<div class="questionContainer">
			<div class="question">
				<Slider :vertical="true" :horizontal="true">
					<div class="topSpan">
						<span class="categoryTitle">{{
							questions.categoryTitle
						}}</span>
						<el-divider direction="vertical"></el-divider>
						<span class="questionId">{{
							questions.questionId
						}}</span>
						<el-divider direction="vertical"></el-divider>
						<span class="title">{{
							isContentEng
								? questions.title
								: questions.translatedTitle
						}}</span>
						<el-divider direction="vertical"></el-divider
						><span class="difficulty">{{
							questions.difficulty
						}}</span>
					</div>
					<div class="content" v-html="questionContent"></div>
				</Slider>
			</div>
		</div>
		<div class="codeContainer">
			<MonacoEditer
				ref="codeEditor"
				:language="questions.codeSnippets[langCode].langSlug"
				v-model="
					questions.codeSnippets[langCode == -1 ? 0 : langCode].code
				"
			/>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import Slider from "@/components/Frameworks/Slider/index.vue"
import MonacoEditer from "../Editor/MonacoEditor.vue"

export default {
	name: "LeetcodeContainer",
	components: {
		Slider,
		MonacoEditer,
	},
	props: {},
	beforeCreate() {
		this.$public.on("leetcode-toggle-list-show", (val) => {
			this.isShowQuestion = !val
		})
		this.$public.on("leetcode-update-question-detail", (obj) => {
			this.questions = obj
		})
		this.$public.on("leetcode-toggle-english-translated", (val) => {
			this.isContentEng = val
		})
		this.$public.on("leetcode-update-code-language", (val) => {
			this.langCode = val
		})
		this.$public.on("leetcode-submit-question", () => {
			this.getQuestionSubmit()
		})
	},
	mounted() {},
	computed: {
		questionContent() {
			console.log(this.questions)
			return (
				(this.isContentEng
					? this.questions.content +
					  "<br/><p><b>Sample Example InputCase:</b></p>"
					: this.questions.translatedContent +
					  "<br/><p><b>测试用例例如:</b></p>") +
				this.questions.exampleTestcases
			)
		},
	},
	data() {
		return {
			isShowList: true,
			isShowQuestion: true,
			isContentEng: false,
			inputedCode: null,
			questions: {},
			langCode: 0,
		}
	},
	methods: {
		getQuestionSubmit: function () {
			this.$leetcode.setBeforeSubmit(this.questions.titleSlug, () => {
				this.$leetcode
					.getSubmissionID(
						this.questions.questionId,
						this.questions.codeSnippets[this.langCode].langSlug,
						this.questions.codeSnippets[
							this.langCode == -1 ? 0 : this.langCode
						].code,
						this.questions.titleSlug
					)
					.then((response) => {
						const { submission_id } = response.data
						this.$public.emit(
							"leetcode-submit-back-id",
							submission_id
						)
					})
					.catch((e) => {
						console.log()
						this.$public.emit("notice", {
							type: "error",
							time: 4500,
							msg: `${e.message} 未登录 Leetcode 账户或 LeetCodeApi 发生迁移`,
						})
					})
			})
		},
	},
}
</script>

<style scoped lang="postcss">
.innerContainer {
	@apply w-full h-full float-left;
}

.questionContainer {
	@apply relative w-1/2 h-full float-left;
	min-height: 70vh;
	max-height: 70vh;
}

.question {
	@apply absolute flex flex-col w-full items-center h-full border border-gray-300;
}

.topSpan {
	@apply w-full h-12 mt-4 mb-2 text-center font-semibold text-xl;
	line-height: 3rem;
}

.question .content {
	@apply inline-block w-full h-full text-base select-text p-4 mx-auto;
}

:deep(.question .content a[href]) {
	@apply hidden;
}

:deep(.question .content img) {
	@apply inline-block my-2;
}

.codeContainer {
	@apply relative w-1/2 h-full float-left;
}

.appCodeEditer {
	@apply relative w-full mx-auto pr-4;
	max-height: 70vh;
}

.codeView {
	@apply block w-full text-base overflow-y-auto;
	max-height: 70vh;
}

@media (prefers-color-scheme: dark) {
	.question,
	.topSpan {
		@apply bg-gray-900;
	}
}

@media (prefers-color-scheme: light) {
	.question,
	.topSpan {
		@apply bg-white;
	}
}

.question::-webkit-scrollbar {
	display: none;
}
</style>
