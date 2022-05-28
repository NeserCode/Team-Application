<template>
  <div class="rank">
    <span class="title">Sign Rank - Single</span>
    <div
      class="mainContainer"
      v-for="(item, index) in rankers"
      :key="item.nickname"
    >
      <Card class="card" :author="item" />
      <span class="time">{{ new Date(item.timeStamp).toLocaleString() }}</span>
      <span class="th"
        >{{ index + 1 }}&nbsp;<sup>{{ thString(index + 1) }}</sup></span
      >
    </div>
    <span class="title">Sign Rank - Series</span>
    <div
      class="mainContainer"
      v-for="(item, index) in rankers"
      :key="item.nickname"
    >
      <Card class="card" :author="item" />
      <span class="time">{{ new Date(item.timeStamp).toLocaleString() }}</span>
      <span class="th"
        >{{ index + 1 }}&nbsp;<sup>{{ thString(index + 1) }}</sup></span
      >
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
      rankers: [],
    };
  },
  mounted() {
    this.initRankers();
  },
  methods: {
    initRankers: function () {
      this.$conf
        .getHost()
        .then((h) => {
          this.$conf
            .allCheckToday(this.$conf.getHttpString(h.host))
            .then((adata) => {
              adata.data.forEach((element) => {
                this.$conf.getHost().then((h) => {
                  this.$conf
                    .getUserDetailById({
                      host: this.$conf.getHttpString(h.host),
                      id: element.userid,
                    })
                    .then((data) => {
                      const { nickname, avatar, introduce } = data.data[0];
                      this.rankers.push({
                        nickname,
                        avatar,
                        introduce,
                        timeStamp: Number(element.timeStamp),
                      });
                    });
                });
              });
            })
            .catch((e) => {
              console.log(e.messgae);
            });
        })
        .catch((e) => {
          console.log(e.messgae);
        });
    },
    thString: function (i) {
      if (i == 1) return "st";
      else if (i == 2) return "nd";
      else if (i == 3) return "rd";
      return "th";
    },
  },
};
</script>

<style scoped lang="postcss">
.rank {
  @apply relative w-full mt-8;
}

.title {
  @apply sticky inline-block w-full h-full top-0 mx-4 px-4 py-4 text-lg font-bold text-left;
  z-index: 2009;
}
.mainContainer {
  @apply relative py-4 my-2;
}

.card {
  @apply flex-col px-2;
}
.time {
  @apply text-xs font-bold;
}

.th {
  @apply inline-block absolute top-0 right-8 font-semibold text-lg;
}

@media (prefers-color-scheme: dark) {
  .title {
    @apply bg-gray-800;
  }
}

@media (prefers-color-scheme: light) {
  .title {
    @apply bg-gray-100;
  }
}
</style>