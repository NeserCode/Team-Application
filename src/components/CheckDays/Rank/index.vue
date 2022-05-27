<template>
  <div class="rank">
    <span class="title">Rank</span>
    <div class="mainContainer">
      <Card class="card" :author="authorExample" v-for="i in 8" :key="i" />
    </div>
  </div>
</template>

<script>
import Card from "@/components/UserAssets/Card/index.vue";

export default {
  name: "Rank",
  components: { Card },
  data() {
    return {
      authorExample: {
        nickname: "Jake Roylor",
        avatar: "http://localhost/Images/q2.jpg",
        introduce: "One to Be Success, you wanna a thing, then do it.",
      },
    };
  },
  methods: {},
};
</script>

<style scoped lang="postcss">
.rank {
  @apply w-full mt-8;
}

.title {
  @apply inline-block w-full mx-4 px-4 text-lg font-bold text-left;
}

.card {
  @apply flex-col px-2;
}
</style>