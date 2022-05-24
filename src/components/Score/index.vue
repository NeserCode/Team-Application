<template>
  <div class="score" v-loading="loading">
    <el-pagination
      v-if="total"
      v-model:currentPage="submitPage"
      v-model:page-size="pageLimit"
      :total="total"
      background
      @page-size="getSubmitArr(pageLimit, submitPage * 10)"
      @current-change="getQuestionPage"
      layout="prev, pager, next, jumper"
    /><br />
    <el-table
      :data="subs"
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
        new Date(submissionDetail.timestamp * 1000).toLocaleString()
      }}</el-descriptions-item>

      <el-descriptions-item label="终止测试用例/输出" label-align="center"
        >{{
          !submissionDetail.outputDetail.lastTestcase
            ? "无"
            : submissionDetail.outputDetail.lastTestcase +
              " / " +
              submissionDetail.outputDetail.expectedOutput
        }}
      </el-descriptions-item>
      <el-descriptions-item label="已通过测试用例个数" label-align="center"
        >{{
          submissionDetail.passedTestCaseCnt +
          " / " +
          submissionDetail.totalTestCaseCnt
        }}
      </el-descriptions-item>
      <el-descriptions-item label="运行时间" label-align="center"
        >{{ submissionDetail.runtime }}
      </el-descriptions-item>
      <el-descriptions-item label="编译错误" label-align="center" span="3">
        <Slider :horizontal="true">
          <pre><code>{{
            `${!submissionDetail.outputDetail.compileError?"无":submissionDetail.outputDetail.compileError}`
         }}</code></pre>
        </Slider>
      </el-descriptions-item>
      <el-descriptions-item label="代码" label-align="center" span="3">
        <pre><code>{{
        `${submissionDetail.code}`
      }}</code></pre>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import Slider from "@/components/Frameworks/Slider/index.vue";

export default {
  name: "Score",
  components: { Slider },
  data() {
    return {
      loading: true,
      subs: [],
      submissionDetail: {},
      submitPage: 1,
      pageLimit: 10,
      total: null,
    };
  },
  mounted() {
    this.initTables();
  },
  methods: {
    sortByCount: (a, b) => a - b,
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
    getSubmitArr: function (limit, offset) {
      this.$conf.getHost().then((h) => {
        this.$conf
          .allLeetcodeSubmission({
            host: this.$conf.getHttpString(h.host),
            limit,
            offset,
          })
          .then((result) => {
            console.log(result);
            this.subs = result.data.arr;
            this.total = result.data.all;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
    },
    getQuestionPage: function () {},
    initTables: function () {
      this.getSubmitArr(this.pageLimit, 0);
    },
  },
};
</script>

<style scoped lang="postcss">
.score {
  @apply flex w-full h-auto flex-col;
}

.el-tag {
  @apply bg-transparent;
}
.el-descriptions table {
  @apply w-full;
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
  :deep(.el-divider__text) {
    @apply bg-gray-800 text-gray-200;
  }
  :deep(.el-table__body-wrapper) {
    @apply bg-transparent;
  }
}

@media (prefers-color-scheme: light) {
  :deep(.el-divider__text) {
    @apply bg-gray-100 text-gray-800;
  }
}
</style>