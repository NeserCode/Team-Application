<template>
  <div
    :class="['navigation', getUserStatus() == 'NeserCode' ? 'skin' : 'noskin']"
  >
    <UserAvatar
      class="avatar"
      @click="handleOpenUserArea"
      v-show="isLogined"
      :isDot="false"
    />

    <router-link
      class="areaLink"
      tabindex="-1"
      :ondragstart="handleKeepDrag"
      to="/home"
      >主页</router-link
    >
    <el-divider direction="vertical"></el-divider>
    <router-link
      class="areaLink"
      tabindex="-1"
      :ondragstart="handleKeepDrag"
      to="/code"
      >代码</router-link
    >
    <el-divider direction="vertical"></el-divider>
    <router-link
      class="areaLink"
      tabindex="-1"
      :ondragstart="handleKeepDrag"
      to="/setting"
      >设置</router-link
    >
    <el-divider direction="vertical" v-show="!isLogined"></el-divider>
    <router-link
      class="areaLink"
      v-show="!isLogined"
      :ondragstart="handleKeepDrag"
      to="/userArea"
      tabindex="-1"
      >{{ signText }}</router-link
    >
  </div>
</template>

<script>
// @ is an alias to /src
import UserAvatar from "@/components/UserAssets/Avatar/index.vue";

export default {
  name: "Navigation",
  components: {
    UserAvatar,
  },

  data() {
    return {
      isLogined: false,
      signText: "登录",
    };
  },
  beforeCreate() {
    this.$public.on("update-main-user-info-upto-app", () => {
      this.isLogined = true;
    });
    this.$public.on("clear-user-sign-status", () => {
      this.isLogined = false;
    });
    this.$public.on("change-login-or-register-view", (bool) => {
      this.signText = bool ? "登录" : "注册";
    });
  },
  mounted() {
    this.isLogined = !(localStorage.getItem("checkKey") == (undefined || null));
  },
  methods: {
    handleOpenUserArea: function () {
      this.$router.push({ path: "/userArea" });
    },
    handleKeepDrag: () => false,
    getUserStatus: () => localStorage.getItem("username"),
  },
};
</script>

<style scoped lang="postcss">
.navigation {
  @apply flex justify-center items-center h-16 text-center text-lg fixed top-8 border-b;
  width: calc(100% - 2px);
}
.navigation.skin::before {
  content: "";
  @apply absolute left-0 top-0 h-16 w-1/2 opacity-20;
  background: linear-gradient(to right, orange, green, cyan, lightblue);
  z-index: -1;
  animation: colorfy infinite 12s;
}
.navigation.skin::after {
  content: "";
  @apply absolute left-1/2 top-0 h-16 w-1/2 opacity-20;
  background: linear-gradient(to left, orange, green, cyan, lightblue);
  z-index: -1;
  animation: colorfy infinite 12s;
}
.navigation .areaLink {
  @apply font-thin inline-block mx-2;
}
.navigation .areaLink:hover {
  transform: translateY(-8%);
  transition: all ease-in-out 0.2s;
}

.router-link-active.router-link-exact-active {
  @apply px-4 rounded-3xl border;
}

.avatar {
  @apply w-11 h-11 absolute right-4;
}

@media (prefers-color-scheme: dark) {
  .router-link-active.router-link-exact-active {
    @apply bg-gray-600 border-gray-700;
  }
  :deep(.el-page-header__content) {
    @apply text-gray-200;
  }
}

@media (prefers-color-scheme: light) {
  .router-link-active.router-link-exact-active {
    @apply bg-gray-200 border-gray-100;
  }
  :deep(.el-page-header__content) {
    @apply text-gray-800;
  }
}

@keyframes colorfy {
  0% {
    filter: hue-rotate(0deg);
  }

  50% {
    filter: hue-rotate(360deg);
  }

  100% {
    filter: hue-rotate(0deg);
  }
}
</style>