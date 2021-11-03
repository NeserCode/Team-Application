<template>
  <div class="user" :class="{ center: center }">
    <el-badge :is-dot="false">
      <img
        :ondragstart="keepDragPicture"
        :src="userInfo.userImage"
        :class="{ Round: isUserImageRound }"
        alt=""
      />
    </el-badge>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "User",
  props: {
    isUserImageRound: {
      type: Boolean,
      default: true,
    },
    userInfo: {
      type: Object,
      default: () => ({ userImage: "http://localhost/Images/q.jpg" }),
    },
    center: Boolean,
  },
  data() {
    return {};
  },
  methods: {
    keepDragPicture: () => false,
  },
};
</script>

<style scoped>
.user {
  @apply w-12 h-12 fixed right-3;
  transform: translateY(-0.5rem);
}
.user img.Round {
  @apply rounded-full border border-gray-300;
}
.user.center {
  @apply relative right-0 text-center w-full h-28;
}
.user.center img {
  @apply text-center w-24 h-24;
}
</style>
