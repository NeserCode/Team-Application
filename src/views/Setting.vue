<template>
  <div class="setting">
    <div class="allSettings">
      <LocalSetting class="settingItems" />
      <span class="title">Leetcode Setting</span>
      <LeetcodeSetting class="settingItems" />
      <span class="title">Other Setting</span>
      <OtherSetting class="settingItems" />
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
  @apply w-full h-full mx-auto py-4 px-12;
}

.title {
  @apply inline-block text-left font-semibold text-2xl;
}
.settingItems {
  @apply pl-8;
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
