<script setup>
import { reactive, ref, watch, defineProps, defineEmits, inject } from "vue"
import { HostKey } from "@/tokens"

const $props = defineProps({
	visible: Boolean,
	selectedUserInfo: {
		type: Object,
		default: () => ({}),
	},
	selectedUserDetail: {
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
	nickname: "",
	avatar: "",
	sex: "",
	bound: "",
	introduce: "",
	password: {
		old: "",
		new: "",
		repeat: "",
	},
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
			initForm()
		}
	}
)
watch(
	() => $props.selectedUserDetail,
	() => {
		initForm()
	}
)

watch(
	form,
	(val) => {
		const vaild = {
			nickname: val.nickname === $props.selectedUserDetail.nickname,
			avatar: val.avatar === $props.selectedUserDetail.avatar,
			sex: val.sex === $props.selectedUserDetail.sex,
			bound: val.bound === $props.selectedUserDetail.bound,
			introduce: val.introduce === $props.selectedUserDetail.introduce,
			password: val.password.old === "" && val.password.new === "",
		}

		clickable.value = Object.values(vaild).some((item) => !item)
	},
	{ deep: true }
)

// create organization
const clickable = ref(false)
const initForm = () => {
	form.nickname = $props.selectedUserDetail.nickname
	form.avatar = $props.selectedUserDetail.avatar
	form.sex = $props.selectedUserDetail.sex
	form.bound = $props.selectedUserDetail.bound
	form.introduce = $props.selectedUserDetail.introduce
	form.password.old = ""
	form.password.new = ""
	form.password.repeat = ""

	clickable.value = false
}
const editUserDetail = async () => {
	clickable.value = false

	$conf
		.updateAllDetail({
			host: INJECTION.host.value.host,
			id: $props.selectedUserDetail.id,
			avatar: form.avatar,
			bound: form.bound,
			introduce: form.introduce,
			nickname: form.nickname,
			sex: form.sex,
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
	<el-dialog v-model="dialogFormVisible" title="修改用户">
		<el-form :model="form" :inline="true">
			<el-form-item label="用户ID">
				<el-input :value="$props.selectedUserDetail.id" readonly />
			</el-form-item>
			<el-form-item label="用户昵称">
				<el-input v-model="form.nickname" />
			</el-form-item>
			<el-form-item label="用户头像">
				<el-input v-model="form.avatar" />
			</el-form-item>
			<el-form-item label="用户邮箱">
				<el-input v-model="form.bound" />
			</el-form-item>
			<el-form-item label="用户性别">
				<el-select v-model="form.sex">
					<el-option label="男" value="m" />
					<el-option label="女" value="w" />
				</el-select>
			</el-form-item>
			<el-form-item label="用户介绍">
				<el-input
					v-model="form.introduce"
					placeholder="请输入新的介绍"
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
					@click="editUserDetail"
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
