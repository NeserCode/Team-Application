<template>
  <div class="code">
    <Leetcode />
  </div>
</template>

<script>
// @ is an alias to /src
import Leetcode from "@/components/Leetcode.vue";

export default {
  name: "Code",
  components: {
    Leetcode,
  },
  props: {},
  beforeCreate() {},
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
  @apply w-full h-full py-4;
}

@media (prefers-color-scheme: dark) {
  .code {
    @apply bg-gray-800;
  }
}

@media (prefers-color-scheme: light) {
  .code {
    @apply bg-gray-100;
  }
}

.code::-webkit-scrollbar {
  display: none;
}
</style>
