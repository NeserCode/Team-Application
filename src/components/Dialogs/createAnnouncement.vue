<script setup>
import { reactive, ref, watch, defineProps, defineEmits, inject } from "vue"
import { HostKey } from "@/tokens"

const $props = defineProps({
	visible: Boolean,
	selectedOrganizationInfo: {
		type: Object,
		default: () => ({}),
	},
})
const $emit = defineEmits(["update:visible", "create:success"])
const $conf = inject("$conf")
const INJECTION = {
	host: inject(HostKey, undefined),
}

const dialogFormVisible = ref(false)

const form = reactive({
	content: "",
	public: false,
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

watch(
	() => dialogFormVisible.value,
	(val) => {
		if (!val) {
			clickable.value = false
			form.content = ""
			form.public = false
		}
	}
)

watch(
	() => form.content,
	(val) => {
		clickable.value = !(val.length === 0)
	}
)

// create organization
const clickable = ref(false)
const createAnnouncement = async () => {
	clickable.value = false

	$conf
		.handleCreateAnnouncement({
			host: INJECTION.host.value.host,
			oid: $props.selectedOrganizationInfo.id,
			open: form.public === true ? 1 : 0,
			content: form.content,
			timeStamp: new Date().getTime(),
		})
		.then((res) => {
			dialogFormVisible.value = false
			clickable.value = true
			res.data.affectedRows && $emit("create:success")
		})
		.catch((err) => {
			clickable.value = true
			console.log(err)
		})
}
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title="创建公告">
		<el-form :model="form" :inline="true">
			<el-form-item label="发起组织">
				<el-input
					:value="`#${selectedOrganizationInfo.id} ${selectedOrganizationInfo.name}`"
					readonly
				/>
			</el-form-item>
			<el-form-item label="是否公开">
				<el-switch v-model="form.public" />
			</el-form-item>
			<el-form-item label="内容">
				<el-input
					v-model="form.content"
					placeholder="请输入公告内容"
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
					@click="createAnnouncement"
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
