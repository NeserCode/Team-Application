<template>
  <div class="card" v-if="author">
    <span class="prefix">{{ prefix }}</span>
    <Avatar
      ref="avatar"
      @click="handleOpenDetail"
      :image="author.avatar"
      :isDot="false"
      class="avatar"
    />
    <div class="right">
      <span class="nickname">{{ author.nickname }}</span>
      <span class="introduce">{{ author.introduce }}</span>
    </div>
    <span class="append">{{ append }}</span>
  </div>
</template>

<script>
import { _debounce } from "@/plugins/utils";

import Avatar from "@/components/UserAssets/Avatar/index.vue";
export default {
  name: "Card",
  components: {
    Avatar,
  },
  props: {
    author: {
      type: Object,
    },
    prefix: {
      type: String,
    },
    append: {
      type: String,
    },
  },
  data() {
    return {};
  },
  updated() {},
  methods: {
    handleOpenDetail: _debounce(function () {
      this.$public.emit("notice", {
        msg: "👀 暂未开放的功能",
      });
    }, 500),
  },
};
</script>

<style scoped lang="postcss">
.card {
  @apply flex items-center justify-center w-full h-full;
}

.avatar,
.right,
.prefix,
.append {
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

.prefix,
.append {
  @apply text-lg font-thin px-6;
}
</style>