<template>
  <div class="table">
    <el-divider></el-divider>
    <el-table
      :data="idList"
      border
      :default-sort="{ order: sortByCount }"
      table-layout="auto"
      class="subitable"
    >
      <el-table-column prop="timeStamp" label="时间" sortable align="center">
        <template #default="scope">
          <el-tag>{{
            new Date(parseInt(scope.row.timeStamp)).toLocaleString()
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="leetName" label="提交名" sortable align="center" />
      <el-table-column prop="submitId" label="提交ID" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            @click="getSubmissionDetail(scope.row.submitId)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-descriptions
      class="submitInfo"
      border
      v-if="submissionDetail.question"
      size="small"
    >
      <el-descriptions-item label="题目ID" label-align="center">{{
        submissionDetail.question.questionId
      }}</el-descriptions-item>
      <el-descriptions-item label="题目名" label-align="center">{{
        submissionDetail.question.title
      }}</el-descriptions-item>
      <el-descriptions-item label="翻译名" label-align="center">{{
        submissionDetail.question.translatedTitle
      }}</el-descriptions-item>

      <el-descriptions-item label="提交ID" label-align="center">{{
        submissionDetail.id
      }}</el-descriptions-item>
      <el-descriptions-item label="提交状态/语言" label-align="center">{{
        submissionDetail.statusDisplay + " / " + submissionDetail.lang
      }}</el-descriptions-item>
      <el-descriptions-item label="时间戳" label-align="center">{{
        submissionDetail.timestamp
      }}</el-descriptions-item>

      <el-descriptions-item label="终止测试用例" label-align="center"
        >{{ submissionDetail.outputDetail.lastTestcase }}
      </el-descriptions-item>
      <el-descriptions-item label="已通过测试用例个数" label-align="center"
        >{{ submissionDetail.passedTestCaseCnt }}
      </el-descriptions-item>
      <el-descriptions-item label="运行时间" label-align="center"
        >{{ submissionDetail.runtime }}
      </el-descriptions-item>
      <el-descriptions-item label="代码" label-align="center">
        <pre><code>{{
        `${submissionDetail.code}`
      }}</code></pre>
      </el-descriptions-item>
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
    this.$public.on("leetcode-submit-back-id", (id) => {
      this.afterIdSubmission(id);
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
      submissionDetail: {},
    };
  },
  methods: {
    sortByCount: function (a, b) {
      return b - a;
    },
    addSubmission: function (leetname, submitid, timestamp) {
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
              timestamp,
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
    afterIdSubmission: function (id) {
      this.$public.emit("notice", {
        msg: `🐱‍👤 正在为您查询本次提交 ID[${id}]`,
        time: 8000,
      });
      setTimeout(async () => {
        await this.$leetcode
          .getSubmissionStatusOnsubmit(`${id}`)
          .then((result) => {
            console.log(result.data);
            const { status_msg, task_finish_time } = result.data;
            this.$public.emit("notice", {
              msg: `获取提交状态 ${status_msg} 详细信息请于查询处查询本次提交`,
              time: 5000,
              fn: () => {
                this.addSubmission(this.leetname, id, task_finish_time);
                this.$public.emit("notice", {
                  msg: `提交本地录入 ${id}`,
                  time: 5000,
                  fn: () => {
                    this.initSubmission();
                  },
                });
              },
            });
          })
          .catch((e) => {
            this.$public.emit("notice", {
              msg: `获取提交返回数据失败 ${e.message} 本次提交将不被录入本地`,
              time: 5000,
            });
          });
      }, 8000);
    },
    getSubmissionDetail: async function (id) {
      await this.$leetcode
        .getSubmissionStatus(`${id}`)
        .then((result) => {
          const { submissionDetail } = result.data.data;
          console.log(submissionDetail);
          this.submissionDetail = submissionDetail;
        })
        .catch((e) => {
          this.$public.emit("notice", {
            msg: `获取提交返回数据失败 ${e.message}`,
          });
        });
    },
    initSubmission: function () {
      this.$conf.getHost().then((h) => {
        this.$conf
          .getLeetcodeSubmission({
            host: this.$conf.getHttpString(h.host),
            username: localStorage.getItem("username"),
          })
          .then((res) => {
            this.idList = res.data;
          })
          .catch((e) => {
            console.log(e);
          });
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.table {
  @apply w-full text-center;
}

.el-tag {
  @apply bg-transparent;
}

.subitable {
  @apply w-2/3 mx-auto;
}

.submitInfo {
  @apply w-2/3 mx-auto;
}

:deep(.el-descriptions__content) {
  @apply whitespace-pre;
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
  :deep(.el-descriptions__label) {
    @apply text-gray-200;
  }
  :deep(.el-descriptions__content) {
    @apply text-gray-300;
  }
}

@media (prefers-color-scheme: light) {
}
</style>
