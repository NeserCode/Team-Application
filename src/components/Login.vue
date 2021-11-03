<template>
  <div class="login">
    <p class="title">登&nbsp;录</p>
    <div class="loginForm">
      <el-input
        @keyup.enter="AccessLogin"
        class="inputFrame"
        v-model="userInput.inputAccount"
        placeholder="用户名"
      /><br />
      <el-input
        @keyup.enter="AccessLogin"
        class="inputFrame"
        v-model="userInput.inputPassword"
        show-password
        placeholder="密码"
      /><br />
      <el-button
        :disabled="isUserLogining"
        class="submitBtn"
        @click="AccessLogin"
      >
        <span v-show="!isUserLogining">登 录</span>
        <i v-show="isUserLogining" class="el-icon-loading"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import crypto from "crypto";
// @ is an alias to /src

export default {
  name: "Login",
  activated() {},
  data() {
    return {
      isUserLogining: false,
      userInput: {
        inputAccount: null,
        inputPassword: null,
      },
      timeoutArr: [],
    };
  },
  methods: {
    handleNewNotification: function (
      title,
      msg,
      type,
      duration,
      position,
      closefunc
    ) {
      this.$notify({
        title: title,
        message: msg,
        type: type,
        duration: duration,
        position: position,
        onClose: closefunc,
        showClose: false,
      });
    },
    handleNoticeProcess: function (text) {
      this.$public.emit("update-footer-status-upto-app", {
        status: "Error",
        text: text,
      });
      this.handleNewNotification(
        "注意",
        "你的登录出现了一个错误,具体原因可查看控制台",
        "error",
        2000,
        "bottom-right",
        null
      );
    },
    AccessLogin: function () {
      this.$public.emit("update-footer-status-upto-app", {
        status: "Loading",
        text: "😬 正在处理用户登录",
      });
      this.isUserLogining = true;
      this.timeoutArr[0] = setTimeout(() => {
        if (this.userInput.inputAccount == null) {
          this.handleNoticeProcess('😥 用户名总不能是空的吧');
        } else if (
          this.userInput.inputAccount !=
          this.userInput.inputAccount.replace(/[^\w]/gi, "")
        )
          this.handleNoticeProcess('😥 用户名里不能包含有汉字跟符号的');
        else
          this.$public.emit("update-footer-status-upto-app", {
            status: "Success",
            text: "😁 用户登陆成功",
          });
        this.isUserLogining = false;
      }, 1500);

      //   this.handleMD5Process(this.userInput.inputPassword)
    },
    handleMD5Process: function (str) {
      return crypto.createHash("md5").update(str).digest("hex");
    },
  },
};
</script>

<style scoped>
.login {
  @apply relative w-full h-full py-8 rounded text-center;
}
.title {
  @apply text-2xl my-2 py-4;
}
.login .inputFrame {
  @apply w-96 mx-auto mb-4;
  font-family: "Helevtica_otf";
}

@media (prefers-color-scheme: dark) {
  .login {
    @apply bg-gray-700;
  }
  :deep().el-input__inner {
    @apply bg-gray-700 text-gray-200;
  }
  .submitBtn {
    @apply bg-gray-600 text-gray-200;
  }
}

@media (prefers-color-scheme: light) {
  .login {
    @apply bg-white;
  }
  :deep().el-input__inner {
    @apply bg-white text-gray-700;
  }
  .submitBtn {
    @apply bg-white text-gray-600;
  }
}
</style>
