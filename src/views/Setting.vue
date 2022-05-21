<template>
  <div class="setting">
    <div class="allSettings">
      <LocalSetting />
      <el-divider>Leetcode Setting</el-divider>
      <LeetcodeSetting />
      <el-divider>Other Setting</el-divider>
      <OtherSetting />
    </div>
  </div>
</template>

<script>
import LocalSetting from "@/components/Setting/local/index.vue";
import LeetcodeSetting from "@/components/Setting/leetcode/index.vue";
import OtherSetting from "@/components/Setting/other/index.vue";

export default {
  name: "Setting",
  mounted() {},
  components: {
    LocalSetting,
    LeetcodeSetting,
    OtherSetting,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="postcss">
.setting {
  @apply w-full;
}
.allSettings {
  @apply w-4/5 h-full mx-auto py-4;
}

@media (prefers-color-scheme: dark) {
  .setting {
    @apply bg-gray-800;
  }
  :deep(.el-divider__text) {
    @apply bg-gray-800 text-gray-200;
  }
}

@media (prefers-color-scheme: light) {
  .setting {
    @apply bg-gray-100;
  }
  :deep(.el-divider__text) {
    @apply bg-gray-100 text-gray-700;
  }
}
</style>
