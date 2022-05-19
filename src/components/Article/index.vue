<template>
  <div class="article">
    <div class="topContainer">
      <Avatar class="avatar" :isDot="false" :image="author.avatar" />
      <div class="namespace">
        <span class="name">{{ author.name }}</span>
        <span class="introduce">{{ author.introduce }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Avatar from "@/components/UserAssets/Avatar/index.vue";

export default {
  name: "Article",
  components: { Avatar },
  props: {
    author: {
      type: Object,
      default: () => ({
        name: "Alex Blance",
        avatar: "http://localhost/Images/q.jpg",
        access: {
          status: true,
          organiztion: "NumberOne Base",
          position: "后端负责人",
        },
        introduce: "一个兴趣使然的程序员",
      }),
    },
    body: {
      type: Object,
      default: () => ({}),
    },
    detail: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    console.log(this.author, this.body, this.detail);
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="postcss">
.article {
  @apply w-full h-full;
}

.topContainer {
  @apply w-full px-2 h-16;
}
.avatar {
  @apply w-16 h-16;
}

@media (prefers-color-scheme: dark) {
  .article {
    @apply bg-gray-800;
  }
}

@media (prefers-color-scheme: light) {
  .article {
    @apply bg-gray-100;
  }
}
</style>
