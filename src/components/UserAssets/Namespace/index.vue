<template>
	<div class="nameSpace">
		<span
			class="nick"
			@dblclick="getClipText(this.nickspace)"
			v-show="!editable.nickname"
			>{{ nickspace }}
			<i class="el-icon-edit" v-if="isMe" @click="handleEditNickname"></i
		></span>
		<el-input
			class="inick"
			spellcheck="false"
			v-model="nickspace"
			v-show="editable.nickname"
			maxlength="10"
			show-word-limit
		>
			<template #append>
				<span class="confirm" @click="handleChangeNickname">修改</span>
				<el-divider direction="vertical"></el-divider>
				<span class="cancel" @click="handleEditNickname">取消</span>
			</template>
		</el-input>
		<span class="name" @dblclick="getClipText(this.namespace)">{{
			namespace
		}}</span>
		<span
			class="introduce"
			@dblclick="getClipText(this.introduce)"
			v-show="!editable.introduce"
			>{{ introduce }}
			<i
				class="el-icon-edit"
				v-if="isMe"
				@click="handleEditIntroduce"
			></i>
		</span>
		<el-input
			class="iintro"
			spellcheck="false"
			v-model="introduce"
			v-show="editable.introduce"
		>
			<template #append>
				<span class="confirm" @click="handleChangeIntroduce">修改</span>
				<el-divider direction="vertical"></el-divider>
				<span class="cancel" @click="handleEditIntroduce">取消</span>
			</template>
		</el-input>
	</div>
</template>

<script>
import { clipboard } from "electron"

export default {
	name: "Namespace",
	data() {
		return {
			namespace: "",
			nickspace: "",
			introduce: "",
			clickable: true,
			editable: {
				nickname: false,
				introduce: false,
			},
		}
	},
	computed: {
		isMe() {
			return this.namespace == localStorage.getItem("username")
		},
	},
	beforeCreate() {
		this.$public.on("update-username", () => {
			this.getNamespace()
		})
	},
	mounted() {
		this.getNamespace()
	},
	methods: {
		getNamespace: function () {
			this.$conf
				.getConfPromise()
				.then((data) => {
					const { userInfo } = data.data
					this.namespace = userInfo.name
					this.nickspace = userInfo.nickname ?? "[无名氏]"
					this.introduce =
						userInfo.introduce ??
						` Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ab praesentium alias, nam placeat corrupti iusto, laborum, porro consequatur totam qui facilis eveniet? Deserunt sit similique impedit laudantium non excepturi?`
				})
				.catch((e) => {
					this.namespace = e.message
				})
		},
		getClipText: function (t) {
			if (this.clickable) {
				this.clickable = false
				clipboard.writeText(t)
				this.$public.emit("notice", {
					type: "success",
					msg: `已复制到剪切板`,
					fn: () => {
						this.clickable = true
					},
				})
			}
		},
		handleEditIntroduce: function () {
			this.editable.introduce = !this.editable.introduce
			this.getNamespace()
		},
		handleChangeIntroduce: function () {
			if (this.editable.introduce) {
				this.$conf.getHost().then((h) => {
					this.$conf
						.updateDBConfig(
							this.$conf.getHttpString(h.host),
							"introduce",
							this.introduce,
							localStorage.getItem("username")
						)
						.then(() => {
							this.$public.emit("notice", {
								type: "success",
								msg: `同步到网络数据成功`,
							})
							this.$conf
								.getConfPromise()
								.then((data) => {
									data.data.userInfo.introduce =
										this.introduce
									this.$conf
										.updateLocalConfig(data.data, () => {
											this.$public.emit("notice", {
												type: "success",
												msg: `同步到本地数据成功`,
												fn: () => {
													this.handleEditIntroduce()
												},
											})
										})
										.catch((e) => {
											this.$public.emit("notice", {
												type: "success",
												msg: `❌ 同步到本地数据失败 ${e.message}`,
												fn: () => {
													this.handleEditIntroduce()
												},
											})
										})
								})
								.catch((e) => {
									this.$public.emit("notice", {
										type: "success",
										msg: `❌ 读取本地数据失败 ${e.message}`,
										fn: () => {
											this.handleEditIntroduce()
										},
									})
								})
						})
						.catch((e) => {
							this.$public.emit("notice", {
								type: "success",
								msg: `❌ 同步到网络数据失败 ${e.message}`,
								fn: () => {
									this.handleEditIntroduce()
								},
							})
						})
				})
			}
		},
		handleEditNickname: function () {
			this.editable.nickname = !this.editable.nickname
			this.getNamespace()
		},
		handleChangeNickname: function () {
			if (this.editable.nickname) {
				this.$conf.getHost().then((h) => {
					this.$conf
						.updateDBConfig(
							this.$conf.getHttpString(h.host),
							"nickname",
							this.nickspace,
							localStorage.getItem("username")
						)
						.then(() => {
							this.$public.emit("notice", {
								type: "success",
								msg: `同步到网络数据成功`,
							})
							this.$conf
								.getConfPromise()
								.then((data) => {
									data.data.userInfo.nickname = this.nickspace
									this.$conf
										.updateLocalConfig(data.data, () => {
											this.$public.emit("notice", {
												type: "success",
												msg: `同步到本地数据成功`,
												fn: () => {
													this.handleEditNickname()
												},
											})
										})
										.catch((e) => {
											this.$public.emit("notice", {
												type: "success",
												msg: `❌ 同步到本地数据失败 ${e.message}`,
												fn: () => {
													this.handleEditNickname()
												},
											})
										})
								})
								.catch((e) => {
									this.$public.emit("notice", {
										type: "success",
										msg: `❌ 读取本地数据失败 ${e.message}`,
										fn: () => {
											this.handleEditNickname()
										},
									})
								})
						})
						.catch((e) => {
							this.$public.emit("notice", {
								type: "success",
								msg: `❌ 同步到网络数据失败 ${e.message}`,
								fn: () => {
									this.handleEditNickname()
								},
							})
						})
				})
			}
		},
	},
}
</script>

<style scoped lang="postcss">
.nameSpace {
	@apply flex flex-col justify-center items-center relative w-full py-4 mt-2;
}

.name {
	@apply inline-block py-2 text-sm font-medium tracking-widest opacity-60;
}

.nick {
	@apply text-xl font-thin tracking-widest;
	font-family: "HanYiWH";
}

.introduce {
	@apply text-lg font-thin tracking-wide opacity-80;
	font-family: "HanYiWH";
}

.iintro {
	@apply w-2/3;
}

.inick {
	@apply w-5/12;
}
</style>
