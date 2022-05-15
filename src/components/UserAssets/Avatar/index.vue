<template>
  <div class="userAvatar">
    <el-badge :is-dot="isUserImageDot">
      <div :class="{ Round: isUserImageRound, avatarSkin: true }">
        <img
          :ondragstart="keepDragPicture"
          :src="userImage"
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
    isUserImageDot: {
      type: Boolean,
      default: true,
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
  @apply w-11 h-11 absolute right-4;
}
.userAvatar img {
  @apply rounded-full border border-gray-400 w-9 h-9;
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
  @apply absolute rounded-full top-0 left-0 w-12 h-12;
  content: " ";
  background: linear-gradient(red 2%, rgba(0, 0, 0, 0) 2%);
}
.avatarSkin.Round::after {
  @apply absolute rounded-full bottom-0 right-0 w-12 h-12;
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
