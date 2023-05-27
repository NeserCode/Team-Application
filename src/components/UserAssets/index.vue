<template>
	<div class="userAssets">
		<el-popover
			placement="bottom"
			:width="400"
			trigger="manual"
			:visible="popoverSwitch"
		>
			<template #reference>
				<el-icon
					class="icon"
					v-if="!userImage"
					@click="handleShowPopover"
					><User
				/></el-icon>
				<Avatar
					@click="handleShowPopover"
					:ondragstart="keepDragPicture"
					:image="userImage"
					:is-dot="false"
					class="avatar"
					v-else
				/>
			</template>
			<img
				class="preImage"
				:src="inputSrc"
				:ondragstart="keepDragPicture"
				v-show="isImageLoaded && isSrcVaild"
			/>
			<div class="preImageLog" v-show="inputSrc.length > 1">
				<i class="el-icon-loading" v-show="!isImageLoaded"></i>
				<span v-show="!isImageLoaded">正在加载</span>
				<span v-show="!isSrcVaild && isImageLoaded"
					>请检查输入的图片链接是否有效</span
				>
			</div>
			<el-input
				maxlength="120"
				@input="handleConfirmSrc"
				placeholder="输入图片直链"
				show-word-limit
				v-model="inputSrc"
			></el-input>
			<div class="preImageBtnGroup">
				<el-button type="primary" @click="handleShowPopover"
					>取消修改</el-button
				>
				<el-button
					type="success"
					@click="AccessChangeAvatar"
					:disabled="!isSrcVaild"
					>确定修改</el-button
				>
			</div>
		</el-popover>
	</div>
</template>

<script>
// @ is an alias to /src
import Avatar from "@/components/UserAssets/Avatar/index.vue"
import { SettingKey, HostKey } from "@/tokens"

export default {
	name: "UserAssets",
	components: {
		Avatar,
	},
	props: {
		isUserImageRound: {
			type: Boolean,
			default: true,
		},
	},
	inject: {
		host: {
			from: HostKey,
		},
		setting: {
			from: SettingKey,
		},
	},
	data() {
		return {
			userImage: localStorage.getItem("avatar"),
			inputSrc: "",
			popoverSwitch: false,
			isSrcVaild: false,
			isImageLoaded: false,
			timeCounter: [],
			clickable: true,
		}
	},
	watch: {
		"$route.name"() {
			this.popoverSwitch = false
		},
		setting: {
			handler() {
				this.userImage = this.setting.userInfo.avatar ?? null
				localStorage.setItem("avatar", this.userImage)
			},
			deep: true,
		},
	},
	beforeCreate() {
		this.$public.on("app-provided", () => {
			// this.$nextTick(() => {
			// 	this.userImage = this.setting.userInfo.avatar ?? null
			// 	localStorage.setItem("avatar", this.userImage)
			// })
		})
		this.$public.on("controller-sign-in", (data) => {
			this.userImage = data.detail.avatar ?? null
			localStorage.setItem("avatar", this.userImage)
		})
	},
	mounted() {
		this.userImage = this.setting.userInfo.avatar ?? null
		localStorage.setItem("avatar", this.userImage)
	},
	methods: {
		keepDragPicture: () => false,
		handleConfirmSrc: function () {
			this.isImageLoaded = false
			clearTimeout(this.timeCounter[1])
			this.timeCounter[1] = setTimeout(() => {
				this.handleImagePromise(this.inputSrc)
					.then((data) => {
						this.isImageLoaded = true
						this.isSrcVaild = data.type == "load" ? true : false
					})
					.catch((e) => {
						this.isImageLoaded = true
						this.isSrcVaild = !(e.type == "error")
					})
			}, 800)
		},
		handleShowPopover: function () {
			this.timeCounter[0] = setTimeout(() => {
				this.clickable = true
			}, 500)
			if (this.clickable) this.popoverSwitch = !this.popoverSwitch
			else return false

			this.clickable = false
		},
		handleImagePromise: function (imgurl) {
			return new Promise(function (resolve, reject) {
				var ImgObj = new Image()
				ImgObj.src = imgurl
				ImgObj.onerror = function (err) {
					reject(err)
				}
				ImgObj.onload = function (res) {
					resolve(res)
				}
			})
		},
		AccessChangeAvatar: function () {
			this.$conf
				.updateDBConfig(
					this.host.host,
					"avatar",
					this.inputSrc,
					localStorage.getItem("username")
				)
				.then(() => {
					this.handleShowPopover()
					this.userImage = this.inputSrc

					let data = this.setting
					data.userInfo.avatar = this.userImage
					this.$conf.updateLocalConfig(data, () => {
						this.$public.emit("update-avatar", this.inputSrc)
					})
				})
		},
	},
}
</script>

<style scoped lang="postcss">
.userAssets {
	@apply flex justify-center items-center;
}

.avatar {
	@apply w-32 h-32;
}

.icon {
	@apply text-8xl;
}
.preImage {
	@apply w-40 block mx-auto mb-4;
}
.preImageBtnGroup {
	@apply block mx-auto transform translate-x-1/4 mt-6 mb-2;
}
.preImageLog {
	@apply text-center my-6 text-base;
}
.el-input {
	@apply pr-14;
}
</style>
