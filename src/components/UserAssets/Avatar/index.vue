<template>
  <div class="userAvatar">
    <el-badge :is-dot="isDot">
      <div :class="{ Round: isUserImageRound, avatarSkin: true }">
        <img
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
    };
  },
  mounted() {
    this.$public.on("app-mounted", (setting) => {
      this.userImage =
        setting.userInfo.avatar ??
        "https://github.githubassets.com/favicons/favicon.svg";
      localStorage.setItem("avatar", this.userImage);
    });
    this.$public.on("update-avatar", (avatar) => {
      this.userImage =
        avatar ?? "https://github.githubassets.com/favicons/favicon.svg";
      localStorage.setItem("avatar", this.userImage);
    });
    this.$public.on("update-main-user-info-upto-app", ({ detail }) => {
      this.userImage =
        detail.avatar ?? "https://github.githubassets.com/favicons/favicon.svg";
      localStorage.setItem("avatar", this.userImage);
    });
  },
  activated() {
    this.userImage = localStorage.getItem("avatar");
  },
  methods: {
    keepDragPicture: () => false,
  },
};
</script>

<style scoped lang="postcss">
.userAvatar {
  @apply w-full h-full;
}
.userAvatar img {
  @apply rounded-full border border-gray-400 w-full h-full;
  animation: unblur 1.5s linear infinite;
}
.userAvatar img.Round {
  @apply rounded-full;
}

.avatarSkin {
  @apply relative p-1;
  animation: blur 1.5s linear infinite;
}
.avatarSkin.Round::before {
  @apply absolute rounded-full top-0 left-0 w-full h-full;
  content: " ";
  background: linear-gradient(red 2%, rgba(0, 0, 0, 0) 2%);
}
.avatarSkin.Round::after {
  @apply absolute rounded-full bottom-0 right-0 w-full h-full;
  content: " ";
  background: linear-gradient(rgba(255, 255, 255, 0) 98%, blue 2%);
}
.avatarSkin.Round {
  @apply rounded-full;
}

.imgBody {
  @apply bg-gray-50;
}

@keyframes blur {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes unblur {
  0% {
    transform: rotate(-0deg);
  }
  50% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
