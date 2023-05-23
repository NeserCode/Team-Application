<script setup>
import {
	ref,
	toRefs,
	watch,
	computed,
	defineProps,
	defineEmits,
	inject,
} from "vue"
import { SettingKey, HostKey, AnnouncementKey } from "@/tokens"

const $props = defineProps({
	visible: Boolean,
	organization: {
		type: Object,
		required: true,
	},
})
const { organization } = toRefs($props)
const $emit = defineEmits(["update:visible", "join:success"])
const $conf = inject("$conf")
const INJECTION = {
	setting: inject(SettingKey, undefined),
	host: inject(HostKey, undefined),
	announcement: inject(AnnouncementKey, undefined),
}

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
	$conf
		.handleApplyOrganization({
			host: INJECTION.host.value.host,
			oid: $props.organization.id,
			uid: INJECTION.setting.value.userInfo.id,
		})
		.then((res) => {
			Visible.value = false
			typeContent.value = ""

			res.data.affectedRows &&
				$emit("join:success", {
					oid: $props.organization.id,
					uid: INJECTION.setting.value.userInfo.id,
					type: "JOIN",
				})
		})
}

const reachableAnnouncement = ref([])
const useOpenOgAnnouncement = (data) => {
	const ogFilter = (oid) => (item) => item.oid === oid
	const openFilter = (item) => !!item.open
	const openOgAnnouncement = data
		.filter(ogFilter(organization.value.id))
		.filter(openFilter)
	return { openOgAnnouncement }
}

watch(organization, () => {
	const { openOgAnnouncement } = useOpenOgAnnouncement(
		INJECTION.announcement.value
	)

	reachableAnnouncement.value = openOgAnnouncement
})

function getTimeComputed(timeStamp) {
	const now = new Date()
	const time = new Date(parseInt(timeStamp))
	const year = time.getFullYear()
	const month = time.getMonth() + 1
	const day = time.getDate()
	const hour = time.getHours()
	const minute = time.getMinutes()
	const second = time.getSeconds()

	// is recent days?
	if (year === now.getFullYear() && month === now.getMonth() + 1) {
		if (day === now.getDate()) return `${hour}:${minute}:${second}`
		else if (day === now.getDate() - 1)
			return `昨天 ${hour}:${minute}:${second}`
		else if (day === now.getDate() - 2)
			return `前天 ${hour}:${minute}:${second}`
		else return `${now.getDate() - day}天前 [${hour}:${minute}:${second}]`
	} else if (year === now.getFullYear())
		return `${month}/${day} [${hour}:${minute}:${second}]`
	else return `${year}/${month}/${day} [${hour}:${minute}:${second}]`
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
		<div class="announcements" v-if="reachableAnnouncement.length">
			<span class="title">Ta们说</span>
			<div class="announcement-list">
				<span
					class="announcement-item"
					v-for="item in reachableAnnouncement"
					:key="item.id"
					><span class="announcement-time">
						{{ getTimeComputed(item.timeStamp) }}
					</span>
					<span class="announcement-content">
						{{ item.content }}
					</span>
				</span>
			</div>
		</div>
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
	@apply inline-flex items-center;
}
.confirm .confirm-input {
	@apply bg-gray-200 py-0.5 px-1 mx-1 rounded;
}

.announcements {
	@apply mt-4 border-t-2 border-gray-200 pt-2;
}
.title {
	@apply inline-flex justify-start w-full max-w-sm items-center mb-1
	text-xl font-semibold;
}
.announcement-list {
	@apply flex flex-col max-w-sm max-h-32 overflow-auto;
}
.announcement-item {
	@apply inline-flex flex-col items-start;
}
.announcement-time {
	@apply text-gray-400 text-sm;
}
.announcement-content {
	@apply whitespace-pre-wrap text-left text-sm;
}
</style>
