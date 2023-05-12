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
				:opTagValue="accessStr"
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

export default {
	name: "userDetail",
	components: { UserAssets, UserDetailOption, Namespace },
	beforeCreate() {
		this.$public.on(
			"update-main-user-info-upto-app",
			({ info, detail }) => {
				this.$conf.getConfPromise().then((data) => {
					let tempSetting = data.data

					// User Access
					tempSetting.userInfo.access = detail.access_status
					tempSetting.userInfo.orgnization = detail.access_team
					tempSetting.userInfo.orPosition = detail.access_position
					// User Sex
					tempSetting.userInfo.sex = detail.sex
					// User Avatar
					tempSetting.userInfo.avatar = detail.avatar
					// User Nickname
					tempSetting.userInfo.nickname = detail.nickname
					// User Introduce
					tempSetting.userInfo.introduce = detail.introduce
					// User Bound
					tempSetting.userInfo.bound = detail.bound
					// User Exp
					tempSetting.userInfo.exp = detail.exp
					// User Name
					tempSetting.userInfo.name = info.username
					// User Key
					tempSetting.userInfo.key = info.userKey
					// Super User
					tempSetting.userInfo.super = !!info.super

					this.$conf
						.updateLocalConfig(tempSetting, () => {
							this.initComponent()
							this.$public.emit("notice", {
								type: "success",
								msg: "用户信息同步成功",
							})
							localStorage.setItem("checkKey", info.checkKey)
							localStorage.setItem("userKey", info.userKey)
							localStorage.setItem(
								"appKey",
								tempSetting.appInfo.key
							)
							localStorage.setItem("username", info.username)
							this.$public.emit("update-check-day")
							this.$public.emit("update-username")
						})
						.catch((e) => {
							console.log(e.message)
							this.$public.emit("notice", {
								type: "error",
								msg: "用户信息同步失败，您可能需要重新登录",
							})
						})
				})
			}
		)
	},
	watch: {
		accessOgz: {
			handler() {
				this.accessObj.text = `${
					this.accessOgz.access ? "已" : "未"
				}认证 
        ${this.accessOgz.ogz} 
        ${this.accessOgz.position}`
			},
			deep: true,
		},
	},
	computed: {
		isMe() {
			return this.thisUsername == localStorage.getItem("username")
		},
		aboutStr() {
			if (this.thisUsername == localStorage.getItem("username"))
				return "About me"
			else return `About ${this.thisUsername}`
		},
		accessStr() {
			return this.accessOgz.access ? this.accessObj.text : "未认证"
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
				text: "",
				disabled: false,
				fn: () => {
					if (!this.accessObj.disabled) {
						this.accessObj.disabled = true
						this.$public.emit("notice", {
							msg: "👀 暂未开启这项功能",
							fn: () => {
								this.accessObj.disabled = false
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
	mounted() {
		// console.log(this.$conf.getUserPath("userData"));
		this.initComponent()
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
			this.$public.emit("clear-user-sign-status")
			this.cancelConfirmOut()
		},
		handleConfirmOut: function () {
			this.isConfirmOut = true
		},
		cancelConfirmOut: function () {
			this.isConfirmOut = false
		},
		initComponent: function () {
			this.$conf.getConfPromise().then((data) => {
				const { userInfo } = data.data
				// 处理认证条目
				this.accessOgz.access = userInfo.access == 1
				if (this.accessOgz.access) {
					this.accessOgz.ogz = userInfo.orgnization
					this.accessOgz.position = userInfo.orPosition
				}
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
			})
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
