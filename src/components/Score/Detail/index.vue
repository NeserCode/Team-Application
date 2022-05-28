<template>
  <div class="detail" v-if="submissionDetail.question">
    <el-descriptions class="submitInfo" border size="small" v-loading="loading">
      <el-descriptions-item label="题目ID" label-align="center">{{
        submissionDetail.question.questionId
      }}</el-descriptions-item>
      <el-descriptions-item label="题目名" label-align="center">{{
        submissionDetail.question.title
      }}</el-descriptions-item>
      <el-descriptions-item label="翻译名" label-align="center">{{
        submissionDetail.question.translatedTitle
      }}</el-descriptions-item>

      <el-descriptions-item label="提交ID" label-align="center"
        ><span @dblclick="getClipText(this.submissionDetail.id)">{{
          submissionDetail.id
        }}</span></el-descriptions-item
      >
      <el-descriptions-item label="提交状态/语言" label-align="center"
        ><b>{{ submissionDetail.statusDisplay }}</b> /
        {{ submissionDetail.lang }}</el-descriptions-item
      >
      <el-descriptions-item label="时间戳" label-align="center">{{
        new Date(submissionDetail.timestamp * 1000).toLocaleString()
      }}</el-descriptions-item>

      <el-descriptions-item
        class-name="needmorelong"
        label="终止测试用例/输出"
        label-align="center"
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
        <pre><code>{{
            `${!submissionDetail.outputDetail.compileError?"无":submissionDetail.outputDetail.compileError}`
         }}</code></pre>
      </el-descriptions-item>
      <el-descriptions-item label="代码" label-align="center" span="3">
        <pre @dblclick="getClipText(this.submissionDetail.code)"><code>{{
        `${submissionDetail.code}`
      }}</code></pre>
      </el-descriptions-item>
    </el-descriptions>
    <Card :author="author" :prefix="cardProfix" ref="card" class="card" />
  </div>
</template>

<script>
import Card from "@/components/UserAssets/Card/index.vue";
import { clipboard } from "electron";

export default {
  name: "Detail",
  components: { Card },
  props: {
    submissionDetail: {
      type: Object,
    },
    loading: {
      type: Boolean,
    },
    author: {
      type: Object,
    },
  },
  data() {
    return {
      cardProfix: "By",
      clickable: true,
    };
  },
  beforeCreate() {},
  mounted() {},
  methods: {
    getClipText: function (t) {
      if (this.clickable) {
        this.clickable = false;
        clipboard.writeText(t);
        this.$public.emit("notice", {
          type: "success",
          msg: `✔ 已复制到剪切板`,
          fn: () => {
            this.clickable = true;
          },
        });
      }
    },
  },
};
</script>

<style scoped lang="postcss">
.detail {
  @apply flex flex-col justify-center items-center;
}
.submitInfo {
  @apply w-full;
}
.card {
  @apply my-4 w-auto;
}
:deep(.needmorelong) {
  @apply inline-block w-24 overflow-ellipsis overflow-hidden border-none;
}

:deep(.el-descriptions__content) {
  @apply select-auto;
}

@media (prefers-color-scheme: dark) {
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