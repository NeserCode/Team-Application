<template>
  <div class="card">
    <Avatar :image="author.avatar" :isDot="false" class="avatar" />
    <div class="right">
      <span class="nickname">{{ author.nickname }}</span>
      <span class="introduce">{{ author.introduce }}</span>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/UserAssets/Avatar/index.vue";
export default {
  name: "Card",
  components: {
    Avatar,
  },
  data() {
    return {
      author: {
        nickname: "NeserCode✨",
        avatar: "http://localhost/Images/q.jpg",
        introduce: "A test line.",
      },
    };
  },
  methods: {},
};
</script>

<style scoped lang="postcss">
.card {
  @apply w-full;
}

.avatar,
.right {
  @apply float-left;
}
.avatar {
  @apply w-16;
}
.right {
  @apply px-4 py-2;
}
.right span {
  @apply block;
}

.nickname {
  @apply text-lg font-bold;
}
.introduce {
  @apply text-sm;
}
</style>