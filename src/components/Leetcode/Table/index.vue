<template>
  <div class="table">
    <el-table
      :data="idList"
      border
      :default-sort="{ order: sortByCount }"
      table-layout="auto"
      class="subitable"
    >
      <el-table-column prop="submitMonth" label="月" sortable align="center" />
      <el-table-column prop="submitDay" label="日" sortable align="center" />
      <el-table-column prop="leetName" label="提交名" sortable align="center" />
      <el-table-column prop="submitId" label="提交ID" align="center" />
      <el-table-column label="操作" align="center">
        <template #default>
          <el-button type="primary">查看</el-button>
        </template>
      </el-table-column> </el-table
    ><el-divider></el-divider>
    <el-descriptions class="submitInfo" title="提交详情" border>
      <el-descriptions-item label="提交ID">1</el-descriptions-item>
      <el-descriptions-item label="提交状态">1</el-descriptions-item>
      <el-descriptions-item label="Place">1</el-descriptions-item>
      <el-descriptions-item label="Remarks">1 </el-descriptions-item>
      <el-descriptions-item label="Address">1</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "LeetcodeTable",
  props: {},
  beforeCreate() {
    this.$public.on("leetcode-update-question-detail", (obj) => {
      this.questions = obj;
    });
    this.$public.on("leetcode-user-sign-in", (name) => {
      this.leetname = name;
    });
    // this.$public.on("leetcode-submit-back-id", (id) => {
    //   this.addSubmission(this.leetname, id, "23", "4");
    // });
    this.$public.on("leetcode-submit-back-id", async (id) => {
      this.$public.emit("notice", {
        msg: `🐱‍👤 正在为您查询本次提交结果 ${id}`,
      });
      // await this.$leetcode
      //   .getSubmissionStatus(`${id}`)
      //   .then((result) => {
      //     const { submissionDetail } = result.data.data;
      //     console.log(submissionDetail);
      //     this.$public.emit("notice", {
      //       msg: `🐱‍🚀 题解状态 ${submissionDetail.statusDisplay}`,
      //       time: 8000,
      //     });
      //   })
      //   .catch((e) => {
      //     this.$public.emit("notice", {
      //       msg: `获取提交返回数据失败 ${e.message}`,
      //     });
      //   });
      setTimeout(async () => {
        await this.$leetcode
          .getSubmissionStatusOnsubmit(`${id}`)
          .then((result) => {
            this.$public.emit("notice", {
              msg: `获取提交状态 ${result.data.state}`,
            });
          })
          .catch((e) => {
            this.$public.emit("notice", {
              msg: `获取提交返回数据失败 ${e.message}`,
            });
          });
      }, 8000);
    });
  },
  mounted() {
    this.initSubmission();
  },
  activated() {},
  data() {
    return {
      idList: null,
      leetname: "游客",
      questions: {},
    };
  },
  methods: {
    sortByCount: function (a, b) {
      return b - a;
    },
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
  @apply relative w-full text-center;
}

.el-steps {
  @apply justify-center;
}

.subitable {
  @apply w-2/3 mx-auto;
}

.submitInfo {
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
  :deep(.el-descriptions__body),
  :deep(.el-descriptions__label) {
    @apply bg-transparent;
  }
  :deep(.el-descriptions__title) {
    @apply text-gray-300;
  }
}

@media (prefers-color-scheme: light) {
}
</style>
