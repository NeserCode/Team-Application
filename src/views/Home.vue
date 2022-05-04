<template>
  <div class="home">
    <div class="topContainer"></div>
    <div class="mainContainer">
      <div class="leftTabs">
        <CheckDays class="checkdays" />
      </div>
      <div class="centerBody">
        <div class="articel">
          <el-skeleton />
          <br />
          <el-skeleton style="--el-skeleton-circle-size: 100px">
            <el-skeleton-item variant="circle" />
          </el-skeleton>
          <el-skeleton />
          <br />
          <el-skeleton style="--el-skeleton-circle-size: 100px">
            <el-skeleton-item variant="circle" />
          </el-skeleton>
        </div>
        <div class="articel">
          <el-skeleton />
        </div>
      </div>
      <div class="rightTabs">
        <CheckDays class="checkdays" />
      </div>
    </div>
    <div class="bottContainer"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import CheckDays from "@/components/CheckDays/index.vue";

export default {
  name: "Home",
  components: { CheckDays },
  beforeCreate() {},
  activated() {},
  mounted() {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.home {
  @apply w-full h-full relative;
}

.topContainer {
  @apply h-16 w-full overflow-hidden;
}
.mainContainer {
  @apply flex justify-between w-full h-screen;
}
.mainContainer .leftTabs,
.mainContainer .rightTabs {
  @apply w-1/5 mx-4;
}
.checkdays {
  @apply sticky top-16 h-auto;
}
.mainContainer .centerBody {
  @apply h-full w-1/2 mx-auto bg-white p-4;
}

.articel {
  @apply inline-block w-full h-auto rounded-md border border-gray-300 p-2 my-4;
}

@media screen and (max-width: 960px) {
  .mainContainer .leftTabs,
  .mainContainer .rightTabs {
    @apply hidden;
  }
  .mainContainer .centerBody {
    @apply h-full w-2/3;
  }
}

@media (prefers-color-scheme: dark) {
  .home {
    @apply bg-gray-800;
  }
}

@media (prefers-color-scheme: light) {
  .home {
    @apply bg-gray-100;
  }
}
</style>
