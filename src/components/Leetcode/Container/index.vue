<template>
	<Splitpanes
		class="innerContainer"
		v-if="questions.content && isShowQuestion"
	>
		<Pane class="questionContainer" min-size="20">
			<div class="question">
				<Slider :vertical="true" :horizontal="true">
					<div class="topSpan">
						<span class="title"
							>{{
								isContentEng
									? questions.title
									: questions.translatedTitle
							}},</span
						>
						<span class="questionId">
							${{ questions.questionId }}</span
						>
						<br />
						<span class="categoryTitle"
							>{{ questions.categoryTitle }},</span
						>
						<span class="difficulty">
							Level${{ questions.difficulty }}</span
						>
					</div>
					<div class="content" v-html="questionContent"></div>
				</Slider>
			</div>
		</Pane>
		<Pane class="codeContainer" min-size="20">
			<MonacoEditer
				ref="codeEditor"
				:language="questions.codeSnippets[langCode].langSlug"
				v-model="
					questions.codeSnippets[langCode == -1 ? 0 : langCode].code
				"
			/>
		</Pane>
	</Splitpanes>
</template>

<script>
// @ is an alias to /src
import Slider from "@/components/Frameworks/Slider/index.vue"
import MonacoEditer from "../Editor/MonacoEditor.vue"

import { Splitpanes, Pane } from "splitpanes"
import "splitpanes/dist/splitpanes.css"

export default {
	name: "LeetcodeContainer",
	components: {
		Slider,
		MonacoEditer,
		Splitpanes,
		Pane,
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
						console.log("e_request-submission-id", e)
						this.$public.emit("notice", {
							time: 4500,
							msg: `未登录 Leetcode 账户或 LeetCodeApi 发生迁移`,
						})
					})
			})
		},
	},
}
</script>

<style scoped lang="postcss">
.innerContainer {
	@apply w-full h-full float-left border rounded
	border-gray-300 dark:border-gray-700;
}

.questionContainer {
	@apply relative w-1/2 float-left border rounded
	border-gray-300 dark:border-gray-700;
	height: 65vh;
}

.question {
	@apply absolute inline-flex flex-col w-full items-center h-full;
}

.question .content {
	@apply inline-block w-full h-full text-base select-text p-4 mx-auto;
}

.topSpan {
	@apply inline-block text-base p-4 font-semibold;
}

:deep(.question .content a[href]) {
	@apply hidden;
}

:deep(.question .content img) {
	@apply hidden;
}

.codeContainer {
	@apply w-1/2 h-full float-left border rounded
	border-gray-300 dark:border-gray-700;
	max-height: 65vh;
}

.appCodeEditer {
	@apply w-full mx-auto pr-4;
}

.codeView {
	@apply block w-full text-base overflow-y-auto;
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

<style lang="postcss">
.splitpanes.innerContainer.splitpanes--vertical > .splitpanes__splitter {
	@apply w-0.5;
	min-width: 0.5rem;
}
</style>
