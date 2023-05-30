<template>
	<div class="appViewFoot">
		<div class="footStatusLight showArea">
			<div
				class="light"
				:style="{ '--status-color': `${statusLightColor.real}` }"
			></div>
			<div
				class="footStatusText showArea"
				title="双击状态栏文字可查看最近的日志"
				@dblclick="$log.openLatestLog"
			>
				<span>{{ statusText }}</span>
			</div>
		</div>
		<div class="others">
			<div class="afterStatusText">
				<span>{{ userStatusString }}</span>
			</div>
			<div class="footTime showArea" v-show="currTime.isGetTime">
				<span class="h">{{ currTime.hour }}</span>
				<span class="sp"> : </span>
				<span class="min">{{ currTime.minutes }}</span>
			</div>
		</div>
	</div>
</template>

<script>
// const { ipcRenderer } = window.require("electron");
// let path = require('path')
// const fse = window.require('fs-extra')
// const fs = window.require('fs')handleHoverColorChange
import { UserStatusKey, SettingKey } from "@/tokens"

export default {
	name: "appViewFoot",
	props: {
		status: String,
		statusText: String,
	},
	inject: {
		setting: {
			from: SettingKey,
		},
		userStatus: {
			from: UserStatusKey,
		},
		$log: {
			from: "$log",
		},
	},
	watch: {
		status() {
			this.statusLightColor.real =
				this.status == "Loading" || this.status == "loading"
					? this.statusLightColor.loading
					: this.status == "warning" || this.status == "warning"
					? this.statusLightColor.warning
					: this.status == "Error" || this.status == "error"
					? this.statusLightColor.error
					: this.status == "Success" || this.status == "success"
					? this.statusLightColor.success
					: "transparent"
		},
	},
	computed: {
		userStatusString() {
			let strs = []
			if (!this.userStatus.isLogined) return "Need Login"
			else
				strs.push(
					`#${this.setting.userInfo.id} ${this.setting.userInfo.name}`
				)
			if (this.userStatus.isSuper) strs.push(`Super`)
			if (this.userStatus.isHost) {
				strs.push(`Host`)
				strs.push(`Organization#${this.setting.userInfo.organization}`)
			} else strs.push(`User`)

			return strs.join(" & ")
		},
	},
	data() {
		return {
			timer: null,
			statusLightColor: {
				warning: "rgb(240, 128, 76)",
				success: "rgb(27, 190, 68)",
				error: "rgb(185, 29, 29)",
				loading: "rgb(199, 233, 77)",
				info: "rgb(199, 233, 77)",
				real: "rgb(199, 233, 77)",
			},
			currTime: {
				hour: 25,
				minutes: 61,
				seconds: 61,
				isGetTime: false,
			},
		}
	},
	mounted() {
		this.initTime()
	},
	methods: {
		initTime: function () {
			function addZero(num) {
				return num < 10 ? "0" + num : num
			}

			var t = new Date().toTimeString().substring(0, 8)
			this.currTime.hour = addZero(parseInt(t.substring(0, 2)))
			this.currTime.minutes = addZero(parseInt(t.substring(3, 5)))
			this.currTime.seconds = addZero(parseInt(t.substring(6, 8)))
			this.timer = setTimeout(() => {
				this.initTime()
			})
			this.currTime.isGetTime = true
		},
	},
}
</script>

<style scoped lang="postcss">
.appViewFoot {
	@apply relative flex items-center justify-between border-t border-gray-400;
	width: calc(100vw - 2px);
	height: calc(1.5rem - 1px);
}
.footStatusLight {
	@apply inline-flex items-center float-left h-full pl-1.5 border-gray-400;
}
.footStatusLight .light {
	@apply inline-block w-3.5 h-3 rounded-full border border-gray-400 box-border;
}
.footStatusText {
	@apply inline-flex items-center w-full max-w-2xl h-full px-2 ml-1.5
	text-xs overflow-ellipsis border-l whitespace-nowrap overflow-hidden
	border-gray-400;
}

.others {
	@apply inline-flex items-center float-right h-full;
}
.afterStatusText {
	@apply inline-flex items-center h-full float-left px-1 font-mono font-semibold text-xs border-r border-l
	border-gray-400;
}
.footTime {
	@apply text-xs text-right px-3;
	height: calc(1.5rem + 1px);
	line-height: 1.5rem;
}
</style>

<style type="text/css">
.footStatusLight .light {
	--status-color: rgb(199, 233, 77);
	background-color: var(--status-color);
	transition: all 1s ease-in-out;
}
.footTime .sp {
	animation: secondFlash 1.5s ease-in-out infinite;
}

@keyframes secondFlash {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
