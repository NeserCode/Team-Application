<template>
	<div class="otherSetting">
		<SettingOption
			opTitle="代码编辑器JavaScript集成"
			opType="switch"
			opTip="在编辑器中按下 Ctrl 键以自动完成词法提示"
			:opDisabled="isDisabled"
			:opBindValue="true"
		/>
	</div>
</template>

<script>
import SettingOption from "@/components/Setting/option/index.vue"

export default {
	name: "OtherSetting",
	components: { SettingOption },
	data() {
		return {
			isDisabled: true,
		}
	},
	mounted() {},
	beforeMount() {},
	methods: {},
}
</script>

<style scoped lang="postcss">
.otherSetting {
	@apply py-8;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>
