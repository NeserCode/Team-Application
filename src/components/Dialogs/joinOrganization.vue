<script setup>
import { ref, watch, computed, defineProps, defineEmits, inject } from "vue"

const $props = defineProps({
	visible: Boolean,
	organization: {
		type: Object,
		required: true,
	},
})
const $emit = defineEmits(["update:visible", "join:success"])
const $conf = inject("$conf")

const Visible = ref(false)

const typeContent = ref("")
const clickable = computed(() => {
	return (
		typeContent.value ===
		`#${$props.organization.id} ${$props.organization.name}`
	)
})

// visible
watch(
	() => $props.visible,
	(val) => {
		Visible.value = val
	}
)
watch(
	() => Visible.value,
	(val) => {
		$emit("update:visible", val)
	}
)

// create organization
const joinOrganization = async () => {
	$conf.getHost().then((h) => {
		$conf.getConfPromise().then((config) => {
			$conf
				.handleApplyOrganization({
					host: $conf.getHttpString(h.host),
					oid: $props.organization.id,
					uid: config.data.userInfo.id,
				})
				.then((res) => {
					Visible.value = false
					typeContent.value = ""

					res.data.affectedRows &&
						$emit("join:success", {
							oid: $props.organization.id,
							uid: config.data.userInfo.id,
							type: "JOIN",
						})
				})
		})
	})
}
</script>

<template>
	<el-dialog v-model="Visible" title="加入组织" align="center">
		<span class="confirm">
			请确认是否要加入
			<span class="confirm-input">{{
				`#${$props.organization.id} ${$props.organization.name}`
			}}</span> </span
		><br />
		<span class="confirm">
			在下方输入
			<span class="confirm-input">{{
				`#${$props.organization.id} ${$props.organization.name}`
			}}</span>
			以完成确认 </span
		><br />
		<el-input v-model="typeContent" placeholder="在此输入..." />
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="Visible = false">取消</el-button>
				<el-button
					type="primary"
					@click="joinOrganization"
					:disabled="!clickable"
				>
					<span>确定</span>
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
