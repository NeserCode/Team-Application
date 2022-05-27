<template>
  <div class="rank">
    <span class="title">Rank</span>
    <div class="mainContainer">
      <Card
        class="card"
        :author="item"
        v-for="item in rankers"
        :key="item.nickname"
      />
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
                      this.rankers.push({ nickname, avatar, introduce });
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
  },
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