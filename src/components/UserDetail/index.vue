<template>
	<div class="userDetail" ref="container">
		<div class="userInfo">
			<UserAssets />
			<Namespace />
			<el-divider>{{ aboutStr }}</el-divider>
			<UserDetailOption
				v-if="isMe"
				:opTitle="keyObj.title"
				opType="tag"
				:opDisabled="keyObj.disabled"
				:opTagValue="keyObj.text"
				:opCallbackFn="keyObj.fn"
				opTip="与用户身份互相关联 用于二次验证用户身份"
			/>
			<UserDetailOption
				:opTitle="sexObj.title"
				opType="tag"
				:opTagValue="sexObj.text"
				:opDisabled="sexObj.disabled"
			/>
			<UserDetailOption
				:opTitle="accessObj.title"
				opType="tag"
				:opDisabled="accessObj.disabled"
				:opTagValue="accessObj.text"
				:opCallbackFn="accessObj.fn"
				opTip="已记录的用户身份认证结果 用于决定管理某些功能或是某些信息"
			/>
			<UserDetailOption
				:opTitle="boundObj.title"
				opType="tag"
				:opDisabled="boundObj.disabled"
				:opTagValue="boundObj.text"
				:opCallbackFn="boundObj.fn"
			/>
		</div>
		<el-button
			class="clearLoginBtn"
			type="danger"
			v-show="!isConfirmOut"
			@click="handleConfirmOut"
			>清除登录状态</el-button
		>
		<el-button-group class="clearLoginBtn btnGroup" v-show="isConfirmOut">
			<el-button type="danger" @click="handleSignOut">确认登出</el-button>
			<el-button type="primary" @click="cancelConfirmOut">取消</el-button>
		</el-button-group>
	</div>
</template>

<script>
// @ is an alias to /src
import UserAssets from "@/components/UserAssets/index.vue"
import Namespace from "@/components/UserAssets/Namespace/index.vue"
import UserDetailOption from "@/components/UserDetail/Option/index.vue"
import { clipboard } from "electron"
import { SettingKey } from "@/tokens"

export default {
	name: "userDetail",
	components: { UserAssets, UserDetailOption, Namespace },
	computed: {
		isMe() {
			return this.thisUsername == localStorage.getItem("username")
		},
		aboutStr() {
			if (this.thisUsername == localStorage.getItem("username"))
				return "About me"
			else return `About ${this.thisUsername}`
		},
	},
	inject: {
		setting: {
			from: SettingKey,
		},
	},
	data() {
		return {
			isConfirmOut: false,
			thisUsername: "",
			radioTemp: 0,
			sexObj: {
				title: "性别",
				text: "",
				disabled: true,
			},
			accessOgz: {
				access: false,
				ogz: "",
				position: "",
			},
			accessObj: {
				title: "认证",
				text: ``,
				disabled: false,
				fn: () => {
					if (!this.accessObj.disabled) {
						this.accessObj.disabled = true
						this.$public.emit("notice", {
							msg: "加入组织以获取身份认证",
							fn: () => {
								this.accessObj.disabled = false
								this.$router.push("/organization")
							},
						})
					}
				},
			},
			boundObj: {
				title: "绑定",
				text: "",
				disabled: false,
				fn: () => {
					this.handleClipBound()
				},
			},
			keyObj: {
				title: "密钥",
				text: "",
				disabled: false,
				fn: () => {
					this.handleClipKey()
				},
			},
		}
	},
	beforeCreate() {
		this.$public.on("controller-sign-in", () => {
			this.initComponentLocal()
		})
	},
	mounted() {
		// console.log(this.$conf.getUserPath("userData"));
		this.initComponentLocal()
	},
	methods: {
		handleSexRadioTemp: function (val) {
			this.radioTemp = val
		},
		handleClipKey: function () {
			if (this.keyObj.text.length >= 12) {
				this.keyObj.disabled = true
				clipboard.writeText(this.keyObj.text)
				this.$public.emit("notice", {
					type: "success",
					msg: "密钥已经复制到剪切板中",
					fn: () => {
						this.keyObj.disabled = false
					},
				})
			}
		},
		handleClipBound: function () {
			if (this.boundObj.text.length >= 4) {
				this.boundObj.disabled = true
				clipboard.writeText(this.boundObj.text)
				this.$public.emit("notice", {
					type: "success",
					msg: "邮箱已经复制到剪切板中",
					fn: () => {
						this.boundObj.disabled = false
					},
				})
			}
		},
		handleSignOut: function () {
			this.$public.emit("user-sign-out")
			this.cancelConfirmOut()
		},
		handleConfirmOut: function () {
			this.isConfirmOut = true
		},
		cancelConfirmOut: function () {
			this.isConfirmOut = false
		},
		initComponentLocal: function () {
			const { userInfo } = this.setting
			// 处理认证条目
			this.accessOgz.access = !!userInfo.access

			this.accessOgz.ogz = userInfo.organization
			this.accessOgz.position = userInfo.oPosition

			this.accessObj.text = `${
				this.accessOgz.access ? "已" : "未"
			}认证 #${this.accessOgz.ogz} ${this.accessOgz.position}`

			// 处理性别条目
			this.sexObj.text =
				(userInfo.sex == "m"
					? "男"
					: userInfo.sex == "w"
					? "女"
					: null) ?? "Unknow"
			this.radioTemp = userInfo.sex == "w" ? 1 : 0
			// 处理绑定条目
			this.boundObj.text = userInfo.bound ?? "Unknow"
			// 处理键值条目
			this.keyObj.text = userInfo.key ?? "No Such Key"
			// 处理用户名
			this.thisUsername = userInfo.name
		},
		initComponentFromData: function ({ detail, info }) {
			// 处理认证条目
			this.accessOgz.access = !!detail.access

			this.accessOgz.ogz = detail.access_team
			this.accessOgz.position = detail.access_position

			this.accessObj.text = `${detail.access_status ? "已" : "未"}认证 #${
				this.accessOgz.ogz
			} ${this.accessOgz.position}`
			// 处理性别条目
			this.sexObj.text =
				(detail.sex == "m" ? "男" : detail.sex == "w" ? "女" : null) ??
				"Unknow"
			this.radioTemp = detail.sex == "w" ? 1 : 0
			// 处理绑定条目
			this.boundObj.text = detail.bound ?? "Unknow"
			// 处理键值条目
			this.keyObj.text = info.userKey ?? "No Such Key"
			// 处理用户名
			this.thisUsername = info.username
		},
	},
}
</script>

<style scoped lang="postcss">
.userDetail {
	@apply my-0 h-auto;
}

.userInfo {
	@apply my-8 mx-auto pb-6 w-3/5;
}

.clearLoginBtn {
	@apply block mx-auto my-16;
}
.clearLoginBtn.btnGroup {
	@apply flex justify-center;
}

@media (prefers-color-scheme: dark) {
	.el-tag {
		@apply bg-gray-700 text-gray-200;
	}
	:deep(.el-divider__text.is-center) {
		@apply bg-gray-800 text-gray-200;
	}
}

@media (prefers-color-scheme: light) {
	:deep(.el-divider__text.is-center) {
		@apply bg-gray-100 text-gray-600;
	}
}
</style>
