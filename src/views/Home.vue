<template>
  <div class="home">
    <div class="topContainer"></div>
    <div class="mainContainer">
      <div class="leftTabs"></div>
      <div
        class="centerBody"
        v-infinite-scroll="load"
        infinite-scroll-delay="1500"
      >
        <Article v-for="i in articleSums" :key="i" />
      </div>
      <div class="rightTabs">
        <CheckDays class="checkdays" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CheckDays from "@/components/CheckDays/index.vue";
import Article from "@/components/Article/index.vue";

export default {
  name: "Home",
  components: { CheckDays, Article },
  beforeCreate() {},
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
    var ws = new WebSocket("ws://114.115.164.199:5998");

    ws.onopen = function () {
      console.log("Connection open ...");
      ws.send("客户端连接" + new Date().toLocaleString());
    };

    ws.onmessage = function (evt) {
      console.log("Received Message: " + evt.data);
      ws.close();
    };

    ws.onclose = function () {
      console.log("Connection closed.");
    };
  },
  data() {
    return {
      articleSums: 5,
    };
  },
  methods: {
    load: function () {
      if (this.$route.name == "Home")
        console.log(`加载第${this.articleSums++}篇文章`);
    },
  },
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
  @apply flex justify-center w-full;
}
.mainContainer .leftTabs,
.mainContainer .rightTabs {
  @apply w-1/5 mx-4 text-center;
}
.checkdays {
  @apply sticky top-16 h-auto;
  max-width: 277px;
}
.mainContainer .centerBody {
  @apply h-full w-1/2 mx-0 px-4;
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
}

@media (prefers-color-scheme: light) {
  .home {
    @apply bg-gray-100;
  }
}
</style>
