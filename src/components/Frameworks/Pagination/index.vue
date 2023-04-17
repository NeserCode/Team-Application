<script setup>
import { defineProps, defineEmits, computed, watch, toRefs, ref } from "vue"

const $props = defineProps({
	modelValue: {
		type: Number,
		default: 1,
	},
	prev: {
		type: Function,
	},
	next: {
		type: Function,
	},
	total: {
		type: Number,
	},
	size: {
		type: Number,
	},
})
const { prev, next, total, size, modelValue } = toRefs($props)
const $emit = defineEmits(["update:modelValue"])
const currentPage = ref(1)

watch(currentPage, () => {
	if (modelValue.value === undefined) {
		currentPage.value = null
	} else handleChangeInputValue()
})

watch(modelValue, () => {
	initModelValue()
})
function initModelValue() {
	currentPage.value = modelValue.value
}
function handleChangeInputValue(val) {
	$emit("update:modelValue", val ?? currentPage.value)
}

const hasPrev = computed(() => prev.value !== undefined)
const hasNext = computed(() => next.value !== undefined)
const zeroTotal = computed(() => total.value / size.value <= 1)

const countPages = computed(() => {
	return Math.ceil(total.value / size.value)
})

watch(currentPage, (val) => {
	if (val <= 1) currentPage.value = 1
	else currentPage.value = val
})

function handlePrev() {
	if (currentPage.value === 1) return false
	prev.value()
	currentPage.value--
}
function handleNext() {
	if (currentPage.value === countPages.value) return false
	next.value()
	currentPage.value++
}
</script>

<template>
	<div class="pagination-main">
		<div class="pagination-container" v-show="!zeroTotal">
			<span class="prev page-fn" v-show="hasPrev" @click="handlePrev"
				>&lt;</span
			>
			<span class="page-input">
				<input
					type="number"
					class="input-body"
					name="pagination-input"
					id="pagination-input"
					v-model="currentPage"
					:min="1"
					:max="countPages"
				/>
			</span>
			<span class="next page-fn" v-show="hasNext" @click="handleNext"
				>&gt;</span
			>
			<span class="page-count">共 {{ countPages }} 页</span>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.pagination-main {
	@apply inline-flex w-full;
}

.pagination-container {
	@apply inline-flex items-center justify-end w-full p-2 pb-0;
}

.pagination-container .page-fn {
	@apply inline-flex items-center justify-center w-8 h-8 mx-1 pb-1
  text-lg font-semibold leading-3
  text-gray-500 hover:bg-blue-200 dark:hover:bg-blue-400 rounded cursor-pointer
  select-none transition-all;
}

.pagination-container .page-input {
	@apply inline-flex items-center;
}
.page-input .input-body {
	@apply w-12 h-6 mx-1 text-center pl-3.5
  text-base border
  text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700
  rounded outline-none transition-all;
}
.page-input .input-body:focus {
	@apply pl-0 ring-2 ring-offset-1 ring-offset-gray-100 ring-blue-400;
}

.page-count {
	@apply inline-flex items-center ml-2 text-sm text-gray-500;
}
</style>
