<template>
  <div class="leetcodeContainer" ref="leetcode">
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
        <el-input
          class="input"
          v-model="pageToGo"
          @keyup.enter="getQuestionPage"
          :disabled="!clickable"
          :placeholder="'共' + totalPages + '页'"
        >
          <template #append>
            <el-button @click="getQuestionPage" :disabled="!clickable">
              <i class="el-icon-right"></i>
            </el-button>
          </template>
        </el-input>
        <el-button
          class="next btn"
          :disabled="!clickable"
          @click="getQuestionPage('next')"
          ><i class="el-icon-d-arrow-right"></i
        ></el-button>
      </div>
    </div>
    <div class="controll">
      <div class="ctrlContainer">
        <a @click="scrollToList">{{ isShowList ? "隐藏列表" : "显示列表" }}</a>
        <a
          v-show="questions.codeSnippets"
          @click="getQuestionContentSwitchEng"
          >{{ isContentEng ? "切换至中文" : "Switch to English" }}</a
        >
        <a v-show="questions.codeSnippets"
          ><select name="langcode" id="langSelect" v-model="langCode">
            <option
              v-for="(item, index) in questions.codeSnippets"
              class="langOption"
              :value="index"
              :key="item.lang"
            >
              {{ item.lang }}
            </option>
          </select></a
        >
        <a v-show="questions.codeSnippets"> 提交 </a>
        <a class="logo"> Offered by LeetCode.cn </a>
      </div>
    </div>
    <div class="innerContainer" v-if="questions.content">
      <div class="questionContainer">
        <div class="question">
          <Slider :vertical="true" :horizontal="true">
            <div class="topSpan">
              <span class="categoryTitle">{{ questions.categoryTitle }}</span>
              <el-divider direction="vertical"></el-divider>
              <span class="questionId">{{ questions.questionId }}</span>
              <el-divider direction="vertical"></el-divider>
              <span class="title">{{
                isContentEng ? questions.title : questions.translatedTitle
              }}</span>
              <el-divider direction="vertical"></el-divider
              ><span class="difficulty">{{ questions.difficulty }}</span>
            </div>
            <div
              class="content"
              v-html="
                isContentEng ? questions.content : questions.translatedContent
              "
            ></div>
          </Slider>
        </div>
      </div>
      <div class="codeContainer">
        <div class="appCodeEditer">
          <Codemirror
            class="codeView"
            :value="questions.codeSnippets[langCode == -1 ? 0 : langCode].code"
            :options="cmOptions"
            border
            ref="codeEditor"
          >
          </Codemirror>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { _debounce } from "@/plugins/utils";
import Slider from "@/components/Slider";

import Codemirror from "codemirror-editor-vue3";
// styles
import "codemirror-editor-vue3/dist/style.css";
import "codemirror-editor-vue3/dist/github.css";
import "codemirror-editor-vue3/dist/solarized.css";
// functions
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/match-highlighter.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/sql-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/continuelist";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/matchtags";
import "codemirror/addon/edit/trailingspace";
import "codemirror/addon/search/search";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";
// langs
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/css/css.js";

export default {
  name: "Leetcode",
  components: {
    Codemirror,
    Slider,
  },
  props: {},
  beforeCreate() {},
  mounted() {
    this.initQuestions();
    this.initTheme();
  },
  activated() {},
  data() {
    return {
      clickable: true,
      isShowList: true,
      isContentEng: false,
      isAppFullScreen: false,
      inputedCode: null,
      questions: {},
      questionSet: {},
      questionStatus: [
        {
          id: "",
          status: "",
        },
      ],
      langCode: 0,
      questionPage: 1,
      totalPages: 1,
      pageToGo: null,
      pageLimit: 25,
      cmOptions: {
        tabSize: 4, // Tab键空格数
        mode: "text/javascript", //模式
        theme: "solarized-light", // 主题 solarized-dark / *light / github / default
        smartIndent: true, // 智能缩进
        indentUnit: 4, // 智能缩进单位为4个空格长度
        foldGutter: true, // 启用行槽中的代码折叠
        matchBrackets: true, // 匹配结束符号，比如"]、}"
        autoCloseBrackets: true, // 自动闭合符号
        autoCloseTags: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }, // 可以启用该选项来突出显示当前选中的内容的所有实例
        lineNumbers: true, //是否显示行号
        showCursorWhenSelecting: true,
        styleActiveLine: false, // 显示选中行的样式
        hintOptions: {
          // 当匹配只有一项的时候是否自动补全
          completeSingle: true,
        },
        extraKeys: { Ctrl: "autocomplete" }, // 可以用于为编辑器指定额外的键绑定，以及keyMap定义的键绑定
      },
    };
  },
  methods: {
    getQuestionContent: _debounce(function (slug) {
      this.$public.emit("update-footer-status-upto-app", {
        status: "Loading",
        text: "🎈 正在从 Leetcode 获取题目详情...",
      });
      setTimeout(() => {
        this.$leetcode.getQuestion(slug).then((response) => {
          this.questions = response.data.data.question;
          this.inputedCode =
            this.questions.codeSnippets[
              this.langCode == -1 ? 0 : this.langCode
            ].code;
          this.$public.emit("update-footer-status-upto-app", {
            status: "Success",
            text: `√ 从 Leetcode 获取题目详情成功 | Slug => ${this.questions.title}`,
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
    getQuestionContentSwitchEng: function () {
      this.isContentEng = !this.isContentEng;
    },
    initQuestions: function () {
      this.$leetcode.getQuestionSet("", 0, this.pageLimit).then((response) => {
        this.questionSet = response.data.data.problemsetQuestionList;
        this.totalPages = parseInt(this.questionSet.total / this.pageLimit) + 1;
        // console.log(this.questionSet);
      });
    },
    initTheme: function () {
      setTimeout(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches)
          this.cmOptions.theme = "solarized-dark";
        else this.cmOptions.theme = "solarized-light";
      }, 10);
    },
    scrollToList: function () {
      this.isShowList = !this.isShowList;
      this.$refs.leetcode.scrollTop = 0;
      console.log(this.$refs.leetcode.scrollTop);
    },
  },
};
</script>

<style scoped>
.leetcodeContainer {
  @apply relative w-full mx-auto;
}

.leetcodeContainer .questionList {
  @apply border border-gray-500 my-2 mx-12 p-12 px-12;
}

.leetcodeContainer .questionList .pageSet {
  @apply my-4;
}

.leetcodeContainer .questionList .pageSet .btn {
  @apply text-sm bg-transparent;
}

.leetcodeContainer .questionList .pageSet .input {
  @apply w-36 mx-3 bg-transparent;
}

.questionListItem .id {
  @apply inline-block text-center;
  min-width: 2em;
}

.questionListItem .title {
  @apply font-medium;
}

.innerContainer {
  @apply relative w-full h-full float-left;
}

.questionContainer {
  @apply absolute w-full h-full;
  min-height: 70vh
}

.leetcodeContainer .question {
  @apply relative h-full border border-gray-300 mt-4;
}

.leetcodeContainer .topSpan {
  @apply w-full h-12 mt-4 mb-2 text-center font-semibold;
  line-height: 3rem;
  font-family: "Helvetica_otf", "Canger_xwz";
}

.leetcodeContainer .question .content {
  @apply text-base select-text p-4 px-8;
}

:deep().leetcodeContainer .question .content a[href] {
  @apply hidden;
}
:deep().question .content img {
  @apply inline-block my-2;
}

.leetcodeContainer .codeContainer {
  @apply relative left-1/2 my-4;
}

.appCodeEditer {
  @apply relative w-full mx-auto;
}
.codeView {
  @apply block w-full text-base;
}

.ctrlContainer {
  @apply w-full mt-4 px-12 py-4;
}

.ctrlContainer .logo {
  @apply bg-transparent border-none;
}

.ctrlContainer a {
  @apply inline-block mx-2 p-2 px-3 bg-transparent border rounded-full border-gray-300;
}

#langSelect {
  @apply bg-transparent outline-none;
}

:deep().langOption {
  z-index: 2000;
}

@media screen and (max-width: 720px) {
  .questionContainer {
    @apply w-full h-full float-none;
    min-height: 70vh;
  }
  .codeContainer {
    @apply hidden;
  }
}

@media screen and (min-width: 1280px) {
  .questionContainer {
    @apply w-1/2 h-full float-left;
    min-height: 70vh;
  }
  .codeContainer {
    @apply w-1/2 h-full float-left;
  }
}

@media (prefers-color-scheme: dark) {
  .leetcodeContainer .question,
  .leetcodeContainer .topSpan {
    @apply bg-gray-900;
  }
  .leetcodeContainer .questionList {
    @apply bg-gray-900;
  }
  .langOption {
    @apply bg-gray-800;
  }
  :deep().el-input__inner,
  .el-button--default.el-button {
    @apply bg-gray-800 border border-gray-100;
  }
}

@media (prefers-color-scheme: light) {
  .leetcodeContainer .question,
  .leetcodeContainer .topSpan {
    @apply bg-white;
  }
  .leetcodeContainer .questionList {
    @apply bg-gray-50;
  }
  .langOption {
    @apply bg-gray-100;
  }
}

.question::-webkit-scrollbar {
  display: none;
}
</style>
