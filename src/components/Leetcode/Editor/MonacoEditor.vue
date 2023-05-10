<template>
	<div class="editor-area" :style="{ width, height }"></div>
</template>

<script>
import useMonaco from "@/plugins/monaco"
import { defineComponent } from "vue"

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
			default: "JavaScript",
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
		language(val) {
			this.updateLanguage(val)
		},
	},
	setup(props) {
		const {
			updateVal,
			getEditor,
			createEditor,
			onFormatDoc,
			updateLanguage,
		} = useMonaco(props.language)

		return {
			updateVal,
			getEditor,
			createEditor,
			onFormatDoc,
			updateLanguage,
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

<style lang="postcss">
.slider .container .monaco-sash.horizontal {
	@apply h-px;
}
.slider .container .monaco-sash.vertical {
	@apply w-px;
}
.slider .presentation {
	z-index: 30;
}
</style>
