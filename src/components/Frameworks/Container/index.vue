<template>
  <div class="AppMainContainer">
    <Slider :vertical="true">
      <el-page-header
        class="pageHeader"
        v-show="retPath"
        :content="headerText"
        @back="handleGoBack"
      />
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
import Slider from "@/components/Frameworks/Slider/index.vue";

export default {
  name: "AppMainContainer",
  components: { Slider },
  watch: {
    "$route.name"(v, ov) {
      this.retPath = ov;
      this.nPath = v;
    },
  },
  computed: {
    headerText() {
      return `${this.retPath} > ${this.nPath}`;
    },
  },
  data() {
    return {
      retPath: null,
      nPath: null,
    };
  },
  mounted() {},
  methods: {
    handleGoBack: function () {
      this.$router.push(this.retPath);
    },
  },
};
</script>

<style scoped>
.AppMainContainer {
  margin-top: calc(6rem - 1px);
  width: calc(100vw - 2px);
  height: calc(100vh - 7.5rem);
}

.pageHeader {
  @apply flex w-full px-6 py-4;
}
:deep(.el-page-header__content) {
  @apply text-sm leading-6 font-medium;
}

@media (prefers-color-scheme: dark) {
  :deep(.el-page-header__content) {
    @apply text-gray-200;
  }
}

@media (prefers-color-scheme: light) {
  :deep(.el-page-header__content) {
    @apply text-gray-800;
  }
}
</style>
