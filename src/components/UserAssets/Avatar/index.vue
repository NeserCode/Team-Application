<template>
	<div class="userAvatar">
		<el-badge :is-dot="isDot">
			<div :class="{ Round: isUserImageRound, avatarSkin: true }">
				<img
					ref="image"
					:ondragstart="keepDragPicture"
					:src="image ?? userImage"
					:class="{ Round: isUserImageRound, imgBody: true }"
				/>
			</div>
		</el-badge>
	</div>
</template>

<script>
// @ is an alias to /src

export default {
	name: "UserAvatar",
	props: {
		isUserImageRound: {
			type: Boolean,
			default: true,
		},
		isDot: {
			type: Boolean,
			default: true,
		},
		image: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			userImage: null,
		}
	},
	beforeCreate() {
		this.$public.on("app-mounted", (setting) => {
			this.userImage =
				setting.userInfo.avatar ??
				"https://github.githubassets.com/favicons/favicon.svg"
			localStorage.setItem("avatar", this.userImage)
		})
		this.$public.on("update-avatar", (avatar) => {
			this.userImage =
				avatar ?? "https://github.githubassets.com/favicons/favicon.svg"
			localStorage.setItem("avatar", this.userImage)
		})
		this.$public.on("update-main-user-info-upto-app", ({ detail }) => {
			this.userImage =
				detail.avatar ?? "https://github.githubassets.com/favicons/favicon.svg"
			localStorage.setItem("avatar", this.userImage)
		})
	},
	mounted() {
		this.userImage = localStorage.getItem("avatar")
		this.initImage()
	},
	methods: {
		keepDragPicture: () => false,
		initImage: function () {
			let w = window.getComputedStyle(this.$refs.image).width,
				h = window.getComputedStyle(this.$refs.image).height
			if (w > 2 && h > 2)
				if (w > h) this.$refs.image.style.height = w
				else this.$refs.image.style.width = h
		},
	},
}
</script>

<style scoped lang="postcss">
.userAvatar {
	@apply w-full h-full;
}
.userAvatar img {
	@apply relative block border border-gray-400 w-full h-full rounded;
	animation: unblur 1.5s linear infinite;
}
.userAvatar img.Round {
	@apply rounded-full;
}

.imgBody {
	@apply bg-gray-50;
}
</style>
