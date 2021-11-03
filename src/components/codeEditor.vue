<template>
  <div class="appCodeEditer">
    <section class="preview" v-show="isPreview">
      <iframe class="frame"></iframe>
      <div class="frameScreen" v-show="errorMessage.isError">
        <code class="message">
          <span
            >Please Check your javascript code, it works incorrectly, following
            infomation may give some idea.</span
          >
          <span class="real">{{ errorMessage.error }}</span>
          at Line <span class="line">{{ errorMessage.line }}</span> colum
          <span class="colum">{{ errorMessage.colum }}</span>
        </code>
      </div>
    </section>

    <div class="frameOpArea">
      <el-radio-group class="targetSelection" v-model="target">
        <el-radio-button :label="targetArray[0]">Html</el-radio-button>
        <el-radio-button :label="targetArray[1]">Css</el-radio-button>
        <el-radio-button :label="targetArray[2]">JavaScript</el-radio-button>
      </el-radio-group>
      <el-popover
        placement="top"
        title="关于"
        :width="300"
        trigger="hover"
        :show-arrow="false"
      >
        <p>基于开源项目 CodeMirror 开发</p>
        <p>目前仅配适 html/css/js 的相关兼容性</p>
        <p>√ 自动缩进</p>
        <p>√ 代码高亮</p>
        <p>√ 智能补全符号</p>
        <p>√ 智能补全标签 ( html )</p>
        <p>√ 自动补全代码 ( ctrl )</p>
        <p>√ 自适应主题</p>
        <p>√ js 报错</p>
        <template #reference><i class="el-icon-info"></i></template
      ></el-popover>
    </div>
    <Codemirror
      class="codeView"
      :value="mirrorCode.target"
      :options="cmOptions"
      border
      @change="mirrorCodeChange($event)"
    >
    </Codemirror>
  </div>
</template>

<script>
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
  name: "appCodeEditer",
  props: {
    isPreview: {
      type: Boolean,
      default: () => true,
    },
  },
  components: {
    Codemirror,
  },
  watch: {
    target: {
      handler: function (newValue) {
        this.mirrorCode.target =
          newValue == "text/html"
            ? this.mirrorCode.htmlCode
            : newValue == "text/css"
            ? this.mirrorCode.cssCode
            : newValue == "text/javascript"
            ? this.mirrorCode.javascriptCode
            : null;
        this.cmOptions.mode = newValue;
      },
      immediate: true,
    },
  },
  mounted() {
    this.mirrorCode.target = this.mirrorCode.htmlCode;
  },
  activated() {
    setTimeout(() => {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        this.cmOptions.theme = "solarized-dark";
      else this.cmOptions.theme = "solarized-light";
    }, 10);
    // this.$message.info(
    //   "如果您开启了代码编辑器，其中的内容将会在您查看或改动后渲染"
    // );
  },
  data() {
    return {
      mirrorCode: {
        target: null,
        htmlCode: '<div id="app"></div>',
        cssCode:
          "* {\n\tmargin:0;\n\tpadding:0;\n\tfont-family: 'Lucida Console';\n}",
        javascriptCode:
          'var firstSentence = "Hello,World!"\ndocument.querySelector("#app").innerHTML = firstSentence',
      },
      errorMessage: {
        isError: false,
        error: null,
        line: null,
        colum: null,
      },
      timeoutArray: [],
      target: "text/html",
      targetArray: ["text/html", "text/css", "text/javascript"],
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
    mirrorCodeChange: function (val) {
      let frame = document.querySelector(".preview .frame");
      if (this.target == "text/html") this.mirrorCode.htmlCode = val;
      if (this.target == "text/css") this.mirrorCode.cssCode = val;
      if (this.target == "text/javascript")
        this.mirrorCode.javascriptCode = val;

      clearTimeout(this.timeoutArray[0]);
      this.errorMessage.isError = false;
      this.$public.emit("update-footer-status-upto-app", {
        status: "Loading",
        text: "🖊 正在输入中",
      });
      this.timeoutArray[0] = setTimeout(() => {
        if (this.$route.name == "Code") {
          let that = this;
          frame.contentWindow.document.open();
          frame.contentWindow.onerror = function (
            message,
            source,
            lineno,
            colno,
            error
          ) {
            console.log(message, source);
            that.errorMessage.isError = true;
            that.errorMessage.error = error;
            that.errorMessage.line = lineno;
            that.errorMessage.colum = colno;
            return true;
          };
          frame.contentWindow.document.write(
            `<style>${this.mirrorCode.cssCode}</style>${this.mirrorCode.htmlCode}<script>${this.mirrorCode.javascriptCode}</` +
              `script>`
          );
          if (this.$route.name == "Code")
            if (this.errorMessage.isError)
              this.$public.emit("update-footer-status-upto-app", {
                status: "Warn",
                text: "🤨 渲染完成但运行受阻",
              });
            else
              this.$public.emit("update-footer-status-upto-app", {
                status: "Success",
                text: "😄 渲染完成",
              });
        }
      }, 1500);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.appCodeEditer {
  @apply relative w-full mx-auto;
}
.codeView {
  @apply block w-2/3 mx-auto;
}
.codeView {
  @apply text-base h-60;
}
.targetSelection {
  @apply float-left mr-2;
}

.preview {
  @apply relative w-2/3 h-96 mx-auto border bg-white border-gray-400 rounded-lg p-2 shadow-lg;
}
.preview .frame {
  @apply w-full h-full mx-auto;
}
.preview .frameScreen {
  @apply absolute mx-auto bg-gray-700 bg-opacity-75 top-2 text-red-700 px-8 pt-2;
  width: calc(100% - 1rem);
  height: calc(100% - 1rem);
}
.preview .frameScreen .message .real {
  @apply text-red-800 font-bold block mt-2 select-text;
}

.frameOpArea {
  @apply w-2/3 h-14 py-2 mx-auto text-gray-900;
}
.frameOpArea i {
  @apply text-lg;
  line-height: 2.5rem;
}

@media (prefers-color-scheme: dark) {
  :deep().el-radio-button.is-active .el-radio-button__inner {
    @apply bg-gray-800 text-gray-200;
  }
  :deep().el-radio-button .el-radio-button__inner {
    @apply border-gray-800 text-gray-800;
  }
}

@media (prefers-color-scheme: light) {
  :deep().el-radio-button.is-active .el-radio-button__inner {
    @apply bg-green-500 text-gray-800;
  }
  :deep().el-radio-button .el-radio-button__inner {
    @apply border-gray-800 text-gray-500;
  }
}
</style>



