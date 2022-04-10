<template>
  <div class="AppMainContainer">
    <Slider :vertical="true">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </Slider>
  </div>
</template>

<script>
// @ is an alias to /src
import Slider from "@/components/Slider";

export default {
  name: "AppMainContainer",
  components: { Slider },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.AppMainContainer {
  margin-top: calc(6rem - 1px);
  width: calc(100vw - 2px);
  height: calc(100vh - 7.5rem);
}
</style>
