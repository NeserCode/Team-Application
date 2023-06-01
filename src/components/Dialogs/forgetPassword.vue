<script setup>
import {
	reactive,
	ref,
	watch,
	defineProps,
	defineEmits,
	inject,
	computed,
} from "vue"
import { HostKey } from "@/tokens"

const $props = defineProps({
	visible: Boolean,
})
const $emit = defineEmits(["update:visible", "update:success"])
const $conf = inject("$conf")
const $log = inject("$log")

const host = inject(HostKey, undefined)

const dialogFormVisible = ref(false)

const form = reactive({
	username: "",
	userKey: "",
	bound: "",
	password: "",
	repeatPassword: "",
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
			form.username = ""
			form.userKey = ""
			form.bound = ""
			form.password = ""
			form.repeatPassword = ""
		}
	}
)

const clickable = computed(() => {
	return (
		form.username &&
		form.userKey &&
		form.bound &&
		form.password &&
		form.repeatPassword &&
		form.password === form.repeatPassword
	)
})
const updatePassword = async () => {
	$conf
		.updatePassword({
			host: host.value.host,
			userKey: form.userKey,
			username: form.username,
			bound: form.bound,
			password: $conf.getMd5String(form.password),
		})
		.then((res) => {
			dialogFormVisible.value = false
			res.data.affectedRows && $emit("update:success")
		})
		.catch((err) => {
			$log.log(err)
		})
}
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title="忘记密码？">
		<el-form :model="form" :inline="true">
			<el-form-item label="用户名">
				<el-input
					v-model="form.username"
					autocomplete="off"
					maxlength="12"
					minlength="3"
					show-word-limit
				/>
			</el-form-item>
			<el-form-item label="用户键值">
				<el-input
					maxlength="16"
					minlength="16"
					v-model="form.userKey"
				/>
			</el-form-item>
			<el-form-item label="绑定邮箱">
				<el-input v-model="form.bound" autocomplete="off" />
			</el-form-item>
			<el-form-item label="新密码">
				<el-input
					maxlength="16"
					minlength="8"
					v-model="form.password"
					autocomplete="off"
				/>
			</el-form-item>
			<el-form-item label="重复密码">
				<el-input
					maxlength="16"
					minlength="8"
					v-model="form.repeatPassword"
					autocomplete="off"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button
					type="primary"
					@click="updatePassword"
					:disabled="!clickable"
				>
					<span v-if="clickable">提交</span>
					<span v-else-if="!clickable">请确认信息是否有误</span>
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
