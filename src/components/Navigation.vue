<template>
  <div class="navigation">
    <User @click="handleOpenUserArea" v-show="isLogined" />

    <router-link class="areaLink" :ondragstart="handleKeepDrag" to="/home"
      >圈子</router-link
    >
    <el-divider direction="vertical"></el-divider>
    <router-link class="areaLink" :ondragstart="handleKeepDrag" to="/code"
      >代码</router-link
    >
    <el-divider direction="vertical"></el-divider>
    <router-link class="areaLink" :ondragstart="handleKeepDrag" to="/setting"
      >设置</router-link
    >
    <el-divider direction="vertical" v-show="!isLogined"></el-divider>
    <router-link
      class="areaLink"
      v-show="!isLogined"
      :ondragstart="handleKeepDrag"
      to="/userArea"
      >登录</router-link
    >
  </div>
</template>

<script>
// @ is an alias to /src
import User from "@/components/User.vue";

export default {
  name: "Navigation",
  components: {
    User,
  },
  data() {
    return {
      isLogined: false,
    };
  },
  mounted() {
    this.$public.on("update-main-user-info-upto-app", () => {
      this.isLogined = true;
    });
    this.$public.on("clear-user-sign-status", () => {
      this.isLogined = false;
    });

    this.isLogined = !(localStorage.getItem("checkKey") == (undefined || null));
  },
  methods: {
    handleOpenUserArea: function () {
      this.$router.push({ path: "/userArea" });
    },
    handleKeepDrag: () => false,
  },
};
</script>

<style scoped>
.navigation {
  @apply h-16 text-center text-lg py-4 fixed top-8 border-b;
  width: calc(100% - 2px);
}
.navigation .areaLink {
  @apply font-semibold inline-block mx-2;
}
.navigation .areaLink:hover {
  transform: translateY(-8%);
  transition: all ease-in-out 0.2s;
}

.router-link-active.router-link-exact-active {
  @apply px-4 rounded-3xl border;
}
@media (prefers-color-scheme: dark) {
  .router-link-active.router-link-exact-active {
    @apply bg-gray-600 border-gray-700;
  }
}

@media (prefers-color-scheme: light) {
  .router-link-active.router-link-exact-active {
    @apply bg-gray-200 border-gray-100;
  }
}
</style>