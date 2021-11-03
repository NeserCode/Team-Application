<template>
  <div class="AppMainContainer">
    <div class="appAreaLinkGroup">
      <User @click="handleOpenUserArea" />
      <router-link class="areaLink" to="/home">Home</router-link>
      <el-divider direction="vertical"></el-divider>
      <router-link class="areaLink" to="/code">Code</router-link>
      <el-divider direction="vertical"></el-divider>
      <router-link class="areaLink" to="/setting">Setting</router-link>
    </div>
    <div class="hasScreenScrollBar">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component
            :appConfigPath="configPath"
            :is="Component"
          />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import User from "@/components/User.vue";

export default {
  name: "AppMainContainer",
  components: {
    User,
  },
  props: {
    configPath: String,
    ColorScheme: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      isUserAreaOpen: false,
    };
  },
  methods: {
    handleOpenUserArea: function () {
      this.$router.push({ path: "/setting#userSetting" });
    },
  },
};
</script>

<style scoped>
.AppMainContainer {
  @apply w-full relative overflow-x-hidden;
}
.appAreaLinkGroup {
  @apply h-16 text-center w-screen text-lg py-4 sticky top-0 z-10 border-b;
}
.appAreaLinkGroup .areaLink {
  @apply font-semibold inline-block mx-2;
}
.appAreaLinkGroup .areaLink:hover {
  @apply text-blue-300;
  transform: translateY(-5%);
  transition: all ease-in-out 0.1s;
}
</style>
<style>
.hasScreenScrollBar {
  @apply overflow-y-scroll;
  width: calc(100vw -2px);
  height: calc(100vh - 3.5rem - 4rem - 2px);
}
</style>