<script setup>
import { reactive, ref, watch, defineProps, defineEmits, inject } from "vue"
import { SettingKey, HostKey } from "@/tokens"

const $props = defineProps({
	visible: Boolean,
})
const $emit = defineEmits(["update:visible", "create:success"])
const $conf = inject("$conf")
const $log = inject("$log")
const $utils = inject("$utils")
const setting = inject(SettingKey, undefined),
	host = inject(HostKey, undefined)

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

const isRepeat = ref(false)
const checkOrganizationName = $utils._debounce(async (string) => {
	if (string.length === 0) {
		isRepeat.value = false
		clickable.value = false
		return
	}
	$conf
		.checkOrganizationName({
			// Get the host address
			host: host.value.host,
			// Get the name parameter
			name: string,
		})
		.then((res) => {
			// If there is a count of 1, the name already exists
			isRepeat.value = !!res.data[0]["count(*)"]
			clickable.value = true
		})
}, 1000)

watch(
	() => dialogFormVisible.value,
	(val) => {
		if (!val) {
			isRepeat.value = false
			clickable.value = false
			form.name = ""
			form.hostId = ""
			form.appKey = ""
			form.organizationKey = ""
		}
	}
)

watch(
	() => form.name,
	(val) => {
		clickable.value = val.length === 0 ? false : true
	}
)

// create organization
const clickable = ref(false)
const createOrganization = async () => {
	clickable.value = false

	if (isRepeat.value) {
		clickable.value = true
		return
	}

	form.appKey = setting.value.appInfo.key
	form.hostId = setting.value.userInfo.id
	form.organizationKey = $conf.getRandomKey(16)

	$conf
		.handleCreateOrganization({
			host: host.value.host,
			appKey: form.appKey,
			hostId: form.hostId,
			name: form.name,
			organizationKey: form.organizationKey,
		})
		.then((res) => {
			dialogFormVisible.value = false
			clickable.value = true
			res.data.affectedRows &&
				$emit("create:success", {
					oid: res.data.insertId,
					uid: form.hostId,
					type: "HOST",
				})
		})
		.catch((err) => {
			clickable.value = true
			$log.log(err)
		})
}
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title="创建组织">
		<el-form :model="form" :inline="true">
			<el-tooltip :visible="isRepeat" placement="top">
				<template #content>
					<span>组织名称重复</span>
				</template>
				<el-form-item label="组织名称">
					<el-input
						v-model="form.name"
						autocomplete="off"
						maxlength="12"
						minlength="3"
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
				<el-button
					type="primary"
					@click="createOrganization"
					:disabled="!clickable"
				>
					<span v-if="clickable">确定</span>
					<span v-else-if="!clickable && !isRepeat"
						>请先填写信息</span
					>
					<span v-else
						><el-icon><Loading /></el-icon
					></span>
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
