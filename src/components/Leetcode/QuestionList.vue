<template>
  <div class="questionList" v-show="isShowList">
    <div
      class="questionListItem"
      v-for="item in questionSet.questions"
      :key="item.frontendQuestionId"
    >
      <span class="status">
        <el-icon
          v-if="item.status == 'AC'"
          class="el-icon-check"
          title="Accept"
        ></el-icon>
        <el-icon
          v-else-if="item.status == 'TRIED'"
          class="el-icon-view"
          title="Tried"
        ></el-icon>
        <el-icon
          v-else-if="item.status == 'NOT_STARTED'"
          class="el-icon-null"
          title="Not_Started"
        ></el-icon>
      </span>
      <el-divider direction="vertical"></el-divider>
      <span class="id">{{ item.frontendQuestionId }}</span>
      <el-divider direction="vertical"></el-divider>
      <a
        class="title"
        href="javascript:void(0)"
        @click="getQuestionContent(item.titleSlug)"
        >{{ item.title }}</a
      >
    </div>
    <div class="pageSet">
      <el-button
        class="before btn"
        :disabled="!clickable"
        @click="getQuestionPage('before')"
        ><i class="el-icon-d-arrow-left"></i
      ></el-button>
      <el-button class="more btn">当前&nbsp;{{ questionPage }}</el-button>
      <el-button
        class="next btn"
        :disabled="!clickable"
        @click="getQuestionPage('next')"
        ><i class="el-icon-d-arrow-right"></i
      ></el-button>
      <el-input
        class="input"
        v-model="pageToGo"
        @keyup.enter="getQuestionPage"
        :disabled="!clickable"
        :placeholder="'共' + totalPages + '页' + ',快速跳转'"
      >
        <template #append>
          <el-button @click="getQuestionPage" :disabled="!clickable">
            <i class="el-icon-right"></i>
          </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { _debounce } from "@/plugins/utils";

export default {
  name: "QuestionList",
  props: {},
  beforeCreate() {
    this.$public.on("leetcode-toggle-list-show", (val) => {
      this.isShowList = val;
    });
    this.$public.on("leetcode-update-question-list", (val) => {
      this.questionSet = val;
    });
  },
  mounted() {
    this.initQuestionSet();
  },
  activated() {},
  data() {
    return {
      clickable: true,
      isShowList: true,
      question: {},
      questionSet: {},
      questionPage: 1,
      totalPages: 1,
      pageToGo: null,
      pageLimit: 25,
    };
  },
  methods: {
    getQuestionContent: _debounce(function (slug) {
      this.$public.emit("update-footer-status-upto-app", {
        status: "Loading",
        text: "🎈 正在从 Leetcode 获取题目详情...",
      });
      this.$leetcode
        .getCookie("https://leetcode-cn.com/graphql/")
        .then((data) => {
          for (let i = 0; i < data.length; i++)
            this.$leetcode.setCookie(
              `https://leetcode-cn.com/problems/${slug}/submit/`,
              data[i].name,
              data[i].value
            );
        });
      setTimeout(() => {
        this.$leetcode.getQuestion(slug).then((response) => {
          this.question = response.data.data.question;
          console.log(response);
          this.$public.emit("leetcode-update-question-detail", this.question);
          this.$public.emit("leetcode-toggle-list-show", !this.isShowList);
          this.$public.emit("update-footer-status-upto-app", {
            status: "Success",
            text: `√ 从 Leetcode 获取题目详情成功 | Slug => ${this.question.title}`,
          });
        });
      }, 200);
    }, 1000),
    getQuestionPage: function (...option) {
      this.$public.emit("update-footer-status-upto-app", {
        status: "Loading",
        text: "🎈 正在从 Leetcode 获取题目...",
      });
      if (option[0] == "before")
        this.pageToGo =
          parseInt(this.questionPage) == 1
            ? 1
            : parseInt(this.questionPage) - 1;
      if (option[0] == "next") this.pageToGo = parseInt(this.questionPage) + 1;
      if (this.pageToGo <= 0)
        this.$public.emit("notice", {
          title: "注意",
          msg: "没有那一页或者已经在该页",
          type: "error",
          closefunc: () => {
            this.pageToGo = null;
            this.clickable = true;
            this.$public.emit("update-footer-status-upto-app", {
              status: "Error",
              text: "× 从 Leetcode 获取题目失败:页号非法",
            });
          },
        });
      else if (
        this.pageToGo != this.questionPage &&
        this.pageToGo <= this.totalPages &&
        this.pageToGo != null &&
        this.clickable
      ) {
        this.clickable = false;
        this.$leetcode
          .getQuestionSet(
            "", //目录名选项
            (this.pageToGo - 1) * this.pageLimit,
            this.pageLimit
          )
          .then((response) => {
            this.questionSet = response.data.data.problemsetQuestionList;
            this.questionPage = this.pageToGo;
            this.pageToGo = null;
            this.clickable = true;
            this.$public.emit("update-footer-status-upto-app", {
              status: "Success",
              text: "√ 从 Leetcode 获取题目成功",
            });
          });
      } else
        this.$public.emit("notice", {
          title: "注意",
          msg: "没有那一页或者已经在该页",
          type: "error",
          closefunc: () => {
            this.pageToGo = null;
            this.clickable = true;
            this.$public.emit("update-footer-status-upto-app", {
              status: "Error",
              text: "× 从 Leetcode 获取题目失败:页号非法",
            });
          },
        });
    },
    initQuestionSet: function () {
      this.$leetcode.getQuestionSet("", 0, this.pageLimit).then((response) => {
        console.log(response);
        this.questionSet = response.data.data.problemsetQuestionList;
        this.totalPages = parseInt(this.questionSet.total / this.pageLimit) + 1;
      });
    },
  },
};
</script>

<style scoped>
.questionList {
  @apply border border-gray-500 my-2 mx-12 p-12 px-12;
}

.questionList .pageSet {
  @apply my-4;
}

.questionList .pageSet .btn {
  @apply text-sm bg-transparent;
}

.questionList .pageSet .input {
  @apply w-48 mx-3 bg-transparent;
}

.questionListItem .id {
  @apply inline-block text-center;
  min-width: 2em;
}

.questionListItem .title {
  @apply font-medium;
}

@media (prefers-color-scheme: dark) {
  .questionList {
    @apply bg-gray-900;
  }
  :deep(.el-input__inner) {
    @apply bg-gray-800 border border-gray-100;
  }
}

@media (prefers-color-scheme: light) {
  .questionList {
    @apply bg-gray-50;
  }
}
</style>
