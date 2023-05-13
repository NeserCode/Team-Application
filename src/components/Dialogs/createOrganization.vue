<script setup>
import { reactive, ref, watch, defineProps, defineEmits, inject } from "vue"

const $props = defineProps({
	visible: Boolean,
})
const $emit = defineEmits(["update:visible"])
const $conf = inject("$conf")
const $utils = inject("$utils")

const dialogFormVisible = ref(false)

const form = reactive({
	name: "",
	hostId: "",
	appKey: "",
	organizationKey: "",
})

// visible
watch(
	() => $props.visible,
	(val) => {
		dialogFormVisible.value = val
	}
)
watch(
	() => dialogFormVisible.value,
	(val) => {
		$emit("update:visible", val)
	}
)

const tipVisible = ref(false)
const checkOrganizationName = $utils._debounce(async (string) => {
	const h = await $conf.getHost()
	$conf
		.checkOrganizationName({
			host: $conf.getHttpString(h.host),
			name: string,
		})
		.then((res) => {
			tipVisible.value = !!res.data[0]["count(*)"]
		})
}, 1000)
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title="创建组织">
		<el-form :model="form" :inline="true">
			<el-tooltip :visible="tipVisible" placement="top">
				<template #content>
					<span>组织名称重复</span>
				</template>
				<el-form-item label="组织名称">
					<el-input
						v-model="form.name"
						autocomplete="off"
						maxlength="12"
						show-word-limit
						@input="checkOrganizationName"
					/> </el-form-item
			></el-tooltip>
			<el-form-item label="持有编号">
				<el-input v-model="form.hostId" readonly>
					<template #append>
						<el-button>从本地获取</el-button>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="应用键值">
				<el-input v-model="form.appKey" autocomplete="off" readonly>
					<template #append>
						<el-button>从本地获取</el-button>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="组织键值">
				<el-input
					v-model="form.organizationKey"
					autocomplete="off"
					readonly
				>
					<template #append>
						<el-button>生成</el-button>
					</template>
				</el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="postcss" scoped>
.el-input {
	@apply w-full;
}
.btn {
	@apply py-0;
}
</style>
