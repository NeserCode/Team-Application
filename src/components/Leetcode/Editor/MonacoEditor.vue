<template>
	<div
		class="editor-area"
		:class="isFull ? 'full' : ''"
		:style="{ width, height }"
	>
		<div class="tools">
			<div class="expand" @click="isFull = !isFull">
				<i
					:class="isFull ? 'el-icon-close' : 'el-icon-full-screen'"
				></i>
			</div>

			<div class="expand" @click="onFormatDoc">
				<i class="el-icon-finished"></i>
			</div>
		</div>
	</div>
</template>

<script>
import useMonaco from "@/plugins/monaco"
import { defineComponent, ref } from "vue"

export default defineComponent({
	props: {
		width: {
			type: String,
			default: "100%",
		},
		height: {
			type: String,
			default: "70vh",
		},
		language: {
			type: String,
			default: "json",
		},
		preComment: {
			type: String,
			default: "",
		},
		modelValue: {
			type: String,
			default: "",
		},
		editorOptions: {
			type: Object,
			default: () => ({}),
		},
	},
	watch: {
		modelValue(val) {
			val !== this.getEditor()?.getValue() && this.updateMonacoVal(val)
		},
	},
	setup(props) {
		const { updateVal, getEditor, createEditor, onFormatDoc } = useMonaco(
			props.language
		)
		const isFull = ref(false)

		return {
			isFull,
			updateVal,
			getEditor,
			createEditor,
			onFormatDoc,
		}
	},
	methods: {
		updateMonacoVal(_val) {
			const { modelValue, preComment } = this.$props
			const val = preComment
				? `${preComment}\n${_val || modelValue}`
				: _val || modelValue
			this.updateVal(val)
		},
		initColorMode() {
			const isDark = document
				.querySelector("html")
				.classList.contains("dark")
			this.getEditor().updateOptions({
				theme: isDark ? "vs-dark" : "vs-light",
			})
		},
	},
	mounted() {
		this.$public.on("update-color-mode", (mode) => {
			this.getEditor().updateOptions({
				theme: mode === "light" ? "vs-light" : "vs-dark",
			})
		})

		if (this.$el) {
			const monacoEditor = this.createEditor(
				this.$el,
				this.$props.editorOptions
			)
			this.updateMonacoVal()
			if (monacoEditor) {
				monacoEditor.onDidChangeModelContent(() => {
					this.$emit("update:modelValue", monacoEditor.getValue())
				})
				monacoEditor.onDidBlurEditorText(() => {
					this.$emit("blur")
				})

				this.initColorMode()
			}
		}
	},
})
</script>

<style scoped></style>
