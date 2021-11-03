<template>
  <div class="code">
    <appCodeEditor :isPreview="true" />
  </div>
</template>

<script>
// @ is an alias to /src
import appCodeEditor from "@/components/codeEditor.vue";

export default {
  name: "Code",
  components: {
    appCodeEditor,
  },
  props: {},
  mounted() {},
  activated() {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.code {
  @apply w-full h-full pt-8;
}

@media (prefers-color-scheme: dark) {
  .code {
    @apply bg-gray-400;
  }
}

@media (prefers-color-scheme: light) {
  .code {
    @apply bg-gray-100;
  }
}
</style>
