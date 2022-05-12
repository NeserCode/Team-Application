<template>
  <div class="questionController">
    <div class="ctrlContainer">
      <a @click="toggleListShow">{{ isShowList ? "隐藏列表" : "显示列表" }}</a>
      <a v-show="question.codeSnippets" @click="getQuestionContentSwitchEng">
        {{ isContentEng ? "切换至中文" : "Switch to English" }}
      </a>
      <a v-show="question.codeSnippets">
        <select name="langcode" id="langSelect" v-model="langCode">
          <option
            v-for="(item, index) in question.codeSnippets"
            class="langOption"
            :value="index"
            :key="item.lang"
          >
            {{ item.lang }}
          </option>
        </select>
      </a>
      <a v-show="question.codeSnippets" @click="getQuestionSubmit">提交</a>
      <a class="logo">Offered by LeetCode.cn</a>
      <div class="userInfo" v-if="userStat.status">
        <span class="detail">
          已作为
          <img class="userAvatar" :src="userStat.avatar" />
          <span class="username">{{ userStat.username }}</span> 登录
          LeetCode.cn(zh)
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { _debounce } from "@/plugins/utils";

export default {
  name: "QuestionController",
  props: {},
  watch: {
    langCode(val) {
      this.$public.emit("leetcode-update-code-language", val);
    },
  },
  beforeCreate() {
    this.$public.on("leetcode-toggle-list-show", (val) => {
      this.isShowList = val;
    });
    this.$public.on("leetcode-update-question-detail", (obj) => {
      this.question = obj;
      this.langCode = 0;
    });
    this.$public.on("leetcode-toggle-english-translated", (val) => {
      this.isContentEng = val;
    });
  },
  mounted() {},
  activated() {
    this.initLeetcodeAccount();
  },
  data() {
    return {
      isShowList: true,
      isContentEng: false,
      langCode: 0,
      question: {},
      userStat: {
        status: null,
        avatar: null,
        username: null,
      },
    };
  },
  methods: {
    getQuestionContentSwitchEng: function () {
      this.$public.emit(
        "leetcode-toggle-english-translated",
        !this.isContentEng
      );
      if (this.isContentEng)
        this.$public.emit("notice", {
          type: "success",
          msg: "🎈 Switching Question Content in English...",
        });
      else
        this.$public.emit("notice", {
          type: "success",
          msg: "🎈 正在将题目内容切换为中文...",
        });
    },
    getQuestionSubmit: _debounce(function () {
      this.$public.emit("leetcode-submit-question");
    }, 1000),
    initLeetcodeAccount: function () {
      this.$public.emit("notice", {
        type: "loading",
        msg: `🕹 正在尝试以设置身份登录`,
      });
      this.$leetcode
        .getUserStatus()
        .then((response) => {
          this.userStat.status = response.data.data.userStatus.isSignedIn;
          this.userStat.avatar = response.data.data.userStatus.avatar;
          this.userStat.username = response.data.data.userStatus.realName;
          console.log(
            response.status == 200
              ? `Leetcode User ${this.userStat.username} Logined`
              : response
          );
          this.$public.emit("leetcode-user-sign-in", this.userStat.username);
          this.$public.emit("notice", {
            type: "success",
            msg: `✔ 以 ${this.userStat.username} 登入 Leetcode.cn(zh)`,
          });
        })
        .catch((e) => {
          this.$public.emit("notice", {
            type: "error",
            msg: `❌ 网络故障 登入失败 ${e.message}`,
          });
        });
    },
    toggleListShow: function () {
      this.$public.emit("leetcode-toggle-list-show", !this.isShowList);
    },
  },
};
</script>

<style scoped>
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

:deep(.langOption) {
  z-index: 2000;
}

.userInfo {
  @apply mx-4 inline-block;
}
.userInfo .userAvatar {
  @apply inline-block w-8 mx-2;
}
.userInfo .detail {
  @apply inline-block py-4;
}
.userInfo .detail .username {
  @apply font-bold;
}

@media (prefers-color-scheme: dark) {
  .langOption {
    @apply bg-gray-800;
  }
}

@media (prefers-color-scheme: light) {
  .langOption {
    @apply bg-gray-100;
  }
}
</style>
