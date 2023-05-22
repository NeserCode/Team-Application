<script setup>
import { ref, watch, computed, defineProps, defineEmits, inject } from "vue"
import { SettingKey, HostKey } from "@/tokens"

const $props = defineProps({
	visible: Boolean,
	organization: {
		type: Object,
		required: true,
	},
})
const $emit = defineEmits(["update:visible", "rename:success"])
const $conf = inject("$conf")
const INJECTION = {
	setting: inject(SettingKey, undefined),
	host: inject(HostKey, undefined),
}

const Visible = ref(false)

const typeContent = ref("")
const clickable = computed(() => {
	return (
		typeContent.value !== "" &&
		typeContent.value !== $props.organization.name
	)
})

// visible
watch(
	() => $props.visible,
	(val) => {
		Visible.value = val
		val && (typeContent.value = $props.organization.name)
	}
)
watch(
	() => Visible.value,
	(val) => {
		$emit("update:visible", val)
	}
)

// rename organization
const renameOrganization = () => {
	$conf
		.handleRenameOrganization({
			host: INJECTION.host.host,
			name: typeContent.value,
			id: $props.organization.id,
		})
		.then((raws) => {
			Visible.value = false
			raws.data.affectedRows && $emit("rename:success")
		})
}
</script>

<template>
	<el-dialog v-model="Visible" title="组织重命名" align="center">
		<span class="confirm">
			在下方为该组织输入
			<span class="confirm-input"> 新的名称 </span>
			以完成重命名 </span
		><br />
		<el-input v-model="typeContent" placeholder="在此输入..." />
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="Visible = false">取消</el-button>
				<el-button
					type="primary"
					@click="renameOrganization"
					:disabled="!clickable"
				>
					<span>确定更改</span>
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="postcss" scoped>
.el-input {
	@apply w-60 my-1;
}
.btn {
	@apply py-0;
}

.confirm {
	@apply inline-flex items-center mb-1;
}
.confirm .confirm-input {
	@apply bg-gray-200 py-0.5 px-1 mx-1 rounded;
}
</style>
