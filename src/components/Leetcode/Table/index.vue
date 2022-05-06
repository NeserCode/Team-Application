<template>
  <div class="table">
    <el-table
      :data="idList"
      border
      :default-sort="{ order: 'descending' }"
      table-layout="fixed"
      class="subitable"
    >
      <el-table-column prop="submitMonth" label="月" sortable />
      <el-table-column prop="submitDay" label="日" sortable />
      <el-table-column prop="submitId" label="提交ID" />
    </el-table>
    <el-divider></el-divider>
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
    // this.addSubmission("NeserCode", "15412315", "23", "4");
    this.initSubmission();
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
  methods: {
    addSubmission: function (leetname, submitid, submitday, submitmonth) {
      this.$conf
        .getHost()
        .then((h) => {
          this.$conf
            .addLeetcodeSubmission({
              host: this.$conf.getHttpString(h.host),
              leetname,
              username: localStorage.getItem("username"),
              appkey: localStorage.getItem("appKey"),
              submitid,
              submitday,
              submitmonth,
            })
            .catch((e) => {
              this.$public.emit("notice", {
                msg: `提交本地修改失败 ${e.message}`,
              });
            });
        })
        .catch((e) => {
          this.$public.emit("notice", {
            msg: `获取Host失败 ${e.message}`,
          });
        });
    },
    initSubmission: function () {
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
  },
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
  :deep(.el-table tr) {
    @apply bg-gray-800 text-gray-300 text-base;
  }
  :deep(.el-table th) {
    @apply bg-gray-800;
  }
  :deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
    @apply bg-gray-700;
  }
}

@media (prefers-color-scheme: light) {
}
</style>
