<template>
  <div class="home">
    <div class="topContainer"></div>
    <div class="mainContainer">
      <div class="leftTabs"></div>
      <div class="centerBody">
        <div class="artical">
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
        <el-divider></el-divider>
        <div class="artical">
          <el-skeleton />
        </div>
        <el-divider></el-divider>
        <div class="artical">
          <el-skeleton />
          <br />
          <el-skeleton style="--el-skeleton-circle-size: 100px">
            <el-skeleton-item variant="circle" />
          </el-skeleton>
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
  mounted() {
    // this.$leetcode
    //   .getSubmissionStatus("209321358")
    //   .then((res) => {
    //     const { submissionDetail } = res.data.data;
    //     console.log(submissionDetail);
    //   })
    //   .catch((e) => {
    //     console.log(e.message);
    //   });
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="postcss">
.home {
  @apply w-full h-full relative;
}

.topContainer {
  @apply h-16 w-full overflow-hidden;
}
.mainContainer {
  @apply flex justify-between w-full;
}
.mainContainer .leftTabs,
.mainContainer .rightTabs {
  @apply w-1/5 mx-4;
}
.checkdays {
  @apply sticky top-16 h-auto;
}
.mainContainer .centerBody {
  @apply h-full w-1/2 mx-auto p-4;
}

.artical {
  @apply inline-block w-full h-auto rounded-md p-2 my-4;
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
  .mainContainer .centerBody {
    @apply bg-black;
  }
}

@media (prefers-color-scheme: light) {
  .home {
    @apply bg-gray-100;
  }
  .mainContainer .centerBody {
    @apply bg-white;
  }
}
</style>
