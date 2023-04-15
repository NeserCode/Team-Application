<template>
	<div class="userAvatar" v-if="image || userImage">
		<el-badge :is-dot="isDot">
			<div :class="{ Round: isUserImageRound }">
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
		this.$public.on("update-avatar", (avatar) => {
			this.userImage = avatar ?? localStorage.getItem("avatar") ?? null
		})
	},
	methods: {
		keepDragPicture: () => false,
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
