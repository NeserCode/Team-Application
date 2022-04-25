<template>
  <div class="userAvatar">
    <el-badge :is-dot="isUserImageDot">
      <img
        :ondragstart="keepDragPicture"
        :src="userImage"
        :class="{ Round: isUserImageRound }"
      />
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
      default: false,
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
    this.$public.on("update-main-user-info-upto-app", (data) => {
      this.userImage =
        data.detail.avatar ??
        "https://github.githubassets.com/favicons/favicon.svg";
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

<style scoped>
.userAvatar {
  @apply w-11 h-11 absolute right-2 top-2.5 transform;
}
.userAvatar img.Round {
  @apply rounded-full border border-gray-400;
}
</style>
