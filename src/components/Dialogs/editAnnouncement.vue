<script setup>
import { reactive, ref, watch, defineProps, defineEmits, inject } from "vue"
import { HostKey } from "@/tokens"

const $props = defineProps({
	visible: Boolean,
	selectedOrganizationInfo: {
		type: Object,
		default: () => ({}),
	},
	selectedAnnouncement: {
		type: Object,
		default: () => ({}),
	},
})
const $emit = defineEmits(["update:visible", "update:success"])
const $conf = inject("$conf")
const $log = inject("$log")
const INJECTION = {
	host: inject(HostKey, undefined),
}

const dialogFormVisible = ref(false)

const form = reactive({
	content: "",
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
		if (!val) {
			clickable.value = false
			form.content = $props.selectedAnnouncement.content
		}
	}
)
watch(
	() => $props.selectedAnnouncement,
	(val) => {
		form.content = val.content
	}
)

watch(
	() => form.content,
	(val) => {
		clickable.value = !(val === $props.selectedAnnouncement.content)
	}
)

// create organization
const clickable = ref(false)
const editAnnouncement = async () => {
	clickable.value = false

	$conf
		.handleUpdateAnnouncementContent({
			host: INJECTION.host.value.host,
			id: $props.selectedAnnouncement.id,
			content: form.content,
		})
		.then((res) => {
			dialogFormVisible.value = false
			clickable.value = true
			res.data.affectedRows && $emit("update:success")
		})
		.catch((err) => {
			clickable.value = true
			$log.log(err)
		})
}
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title="创建公告">
		<el-form :model="form">
			<el-form-item label="发起组织">
				<el-input
					:value="`#${selectedOrganizationInfo.id} ${selectedOrganizationInfo.name}`"
					readonly
				/>
			</el-form-item>
			<el-form-item label="内容">
				<el-input
					v-model="form.content"
					placeholder="请输入新的公告内容"
					:rows="3"
					type="textarea"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button
					type="primary"
					@click="editAnnouncement"
					:disabled="!clickable"
				>
					<span v-if="clickable">确定</span>
					<span v-else>请先填写信息</span>
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
