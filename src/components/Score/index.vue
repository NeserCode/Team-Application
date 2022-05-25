<template>
  <div class="score">
    <h1>Status</h1>
    <el-pagination
      v-if="total"
      v-model:currentPage="submitPage"
      v-model:page-size="pageLimit"
      :total="total"
      background
      @page-size="getQuestionPage"
      @current-change="getSubmitArr"
      layout="prev, pager, next, total, jumper"
      v-loading="loading"
    ></el-pagination
    ><br />
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
    <Detail
      class="detail"
      :submissionDetail="submissionDetail"
      :loading="loading"
    />
  </div>
</template>

<script>
import { _debounce } from "@/plugins/utils";
import Detail from "@/components/Score/Detail/index.vue";

export default {
  name: "Score",
  components: { Detail },
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
          this.submissionDetail = submissionDetail;
          console.log(this.submissionDetail);
        })
        .catch((e) => {
          this.$public.emit("notice", {
            msg: `获取提交返回数据失败 ${e.message}`,
          });
        });
    },
    getSubmitArr: _debounce(function (val) {
      this.loading = true;
      this.submissionDetail = {};
      this.$conf.getHost().then((h) => {
        this.$conf
          .allLeetcodeSubmission({
            host: this.$conf.getHttpString(h.host),
            limit: this.pageLimit,
            offset: (this.submitPage - 1) * this.pageLimit,
          })
          .then((result) => {
            this.subs = result.data.arr;
            this.total = result.data.all;
            this.submitPage = val;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
    }, 200),
    getQuestionPage: function () {},
    initTables: function () {
      this.getSubmitArr();
    },
  },
};
</script>

<style scoped lang="postcss">
.score {
  @apply flex w-full h-auto flex-col;
}

h1 {
  @apply text-3xl font-bold;
}
.el-tag {
  @apply bg-transparent;
}
.el-pagination {
  @apply inline-block w-full pt-4;
}

:deep(.el-pagination button.btn-next),
:deep(.el-pagination button.btn-prev),
:deep(.el-pager li.number),
:deep(.el-pager li.more) {
  @apply bg-transparent text-base;
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
  :deep(.el-input__inner) {
    @apply bg-gray-800 border border-gray-100;
  }
}

@media (prefers-color-scheme: light) {
  :deep(.el-divider__text) {
    @apply bg-gray-100 text-gray-800;
  }
}
</style>