<template>
  <div class="setting">
    <div class="allSettings">
      <LocalSetting />
    </div>
  </div>
</template>

<script>
import LocalSetting from "@/components/LocalSetting.vue";

export default {
  name: "Setting",
  mounted() {},
  components: {
    LocalSetting,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
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
}

@media (prefers-color-scheme: light) {
  .setting {
    @apply bg-gray-100;
  }
}
</style>
