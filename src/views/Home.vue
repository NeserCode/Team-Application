<template>
  <div class="home"></div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  activated() {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.home {
  @apply w-full h-screen;
  transition: background ease-in-out 0.8s;
}

@media (prefers-color-scheme: dark) {
  .home {
    @apply bg-gray-400;
  }
}

@media (prefers-color-scheme: light) {
  .home {
    @apply bg-gray-100;
  }
}
</style>
