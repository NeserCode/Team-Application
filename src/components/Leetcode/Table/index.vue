<template>
  <div class="table">
    <el-table
      :data="idList"
      lazy
      :default-sort="{ order: 'descending' }"
      table-layout="fixed"
      class="subitable"
    >
      <el-table-column prop="submitMonth" label="月" sortable />
      <el-table-column prop="submitDay" label="日" sortable />
      <el-table-column prop="submitId" label="提交ID" />
    </el-table>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "LeetcodeTable",
  components: {},
  props: {},
  beforeCreate() {
    this.$public.on("leetcode-toggle-list-show", (val) => {
      this.isShowQuestion = !val;
    });
    this.$public.on("leetcode-update-question-detail", (obj) => {
      this.questions = obj;
    });
    this.$public.on("leetcode-toggle-english-translated", (val) => {
      this.isContentEng = val;
    });
    this.$public.on("leetcode-update-code-language", (val) => {
      this.langCode = val;
    });
  },
  mounted() {
    this.$conf
      .getHost()
      .then((h) => {
        this.$conf
          .getLeetcodeSubmission({
            host: this.$conf.getHttpString(h.host),
            username: localStorage.getItem("username"),
          })
          .then((res) => {
            this.idList = res.data;
            console.log(this.idList);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  },
  activated() {},
  data() {
    return {
      idList: null,
      isShowList: true,
      isShowQuestion: true,
      isContentEng: false,
      inputedCode: null,
      questions: {},
      langCode: 0,
    };
  },
  methods: {},
};
</script>

<style scoped lang="postcss">
.table {
  @apply w-full;
}

.subitable {
  @apply w-2/3 mx-auto;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>
