<template>
  <div class="innerContainer" v-if="questions.content && isShowQuestion">
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
          <div class="content" v-html="questionContent"></div>
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
</template>

<script>
// @ is an alias to /src
import Slider from "@/components/Frameworks/Slider/index.vue";

import Codemirror from "codemirror-editor-vue3";
// styles
import "codemirror-editor-vue3/dist/style.css";
import "@/assets/codeMirrorStyle/github.css";
import "@/assets/codeMirrorStyle/solarized.css";
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

export default {
  name: "LeetcodeContainer",
  components: {
    Codemirror,
    Slider,
  },
  props: {},
  beforeCreate() {
    this.$public.on("leetcode-toggle-list-show", (val) => {
      this.isShowQuestion = !val;
    });
    this.$public.on("leetcode-update-question-detail", (obj) => {
      this.questions = obj;
      console.log(this.questions);
    });
    this.$public.on("leetcode-toggle-english-translated", (val) => {
      this.isContentEng = val;
    });
    this.$public.on("leetcode-update-code-language", (val) => {
      this.langCode = val;
    });
    this.$public.on("leetcode-submit-question", () => {
      this.getQuestionSubmit();
    });
  },
  mounted() {},
  activated() {
    this.initTheme();
  },
  computed: {
    questionContent() {
      return (
        (this.isContentEng
          ? this.questions.content +
            "<br/><p><b>Sample Example InputCase:</b></p>"
          : this.questions.translatedContent +
            "<br/><p><b>测试用例例如:</b></p>") +
        this.questions.exampleTestcases
      );
    },
  },
  data() {
    return {
      isShowList: true,
      isShowQuestion: true,
      isContentEng: false,
      inputedCode: null,
      questions: {},
      langCode: 0,
      cmOptions: {
        tabSize: 4, // Tab键空格数
        mode: "javascript", //模式
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
        // extraKeys: { Ctrl: "autocomplete" }, // 可以用于为编辑器指定额外的键绑定，以及keyMap定义的键绑定
      },
    };
  },
  methods: {
    initTheme: function () {
      setTimeout(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches)
          this.cmOptions.theme = "solarized-dark";
        else this.cmOptions.theme = "solarized-light";
      }, 10);
    },
    getQuestionSubmit: function () {
      this.$leetcode
        .getSubmissionID(
          this.questions.questionId,
          this.questions.codeSnippets[this.langCode].langSlug,
          this.$refs.codeEditor.content,
          this.questions.titleSlug
        )
        .then(async (response) => {
          console.log(response);
          const { submission_id } = response.data;
          this.$public.emit("leetcode-submit-back-id", submission_id);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped lang="postcss">
.innerContainer {
  @apply w-full h-full float-left;
}

.questionContainer {
  @apply absolute w-1/2 h-full float-left;
  min-height: 50vh;
  max-height: 70vh;
}

.question {
  @apply absolute flex flex-col w-full items-center h-full border border-gray-300 mt-4;
}

.topSpan {
  @apply w-full h-12 mt-4 mb-2 text-center font-semibold text-xl;
  line-height: 3rem;
  font-family: "Helvetica_otf", "Canger_xwz";
}

.question .content {
  @apply inline-block w-auto text-base select-text p-4 mx-auto;
}

:deep(.question .content a[href]) {
  @apply hidden;
}
:deep(.question .content img) {
  @apply inline-block my-2;
}

.codeContainer {
  @apply relative left-1/2 my-4 w-1/2 h-full float-left;
}

.appCodeEditer {
  @apply relative w-full mx-auto pr-4;
  max-height: 70vh;
}
.codeView {
  @apply block w-full text-base overflow-y-auto;
  max-height: 70vh;
}

@media (prefers-color-scheme: dark) {
  .question,
  .topSpan {
    @apply bg-gray-900;
  }
}

@media (prefers-color-scheme: light) {
  .question,
  .topSpan {
    @apply bg-white;
  }
}

.question::-webkit-scrollbar {
  display: none;
}
</style>
