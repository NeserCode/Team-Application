<template>
  <div class="login">
    <p class="title">登&nbsp;&nbsp;录</p>
    <div class="inputContainer">
      <div class="option">
        <span class="pre"><label for="loginname">用户名</label></span>
        <input
          type="text"
          @keyup.enter="AccessLogin"
          v-model="userInput.inputAccount"
          :disabled="isUserLogining"
          id="loginname"
          placeholder="username here"
        />
      </div>
      <div class="option">
        <span class="pre"><label for="loginpassword">密&nbsp;码</label></span>
        <input
          type="password"
          @keyup.enter="AccessLogin"
          v-model="userInput.inputPassword"
          :disabled="isUserLogining"
          id="loginpassword"
          placeholder="password here"
        />
        <span class="tip">密码找回暂时不可用</span>
        <div class="showPwd">
          <svg
            v-show="!isPwdShow"
            @click="handlePwdShow"
            t="1636627684496"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8266"
            width="24"
            height="24"
          >
            <path
              d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3-7.7 16.2-7.7 35.2 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766z"
              p-id="8267"
            ></path>
            <path
              d="M508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176z m0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"
              p-id="8268"
            ></path>
          </svg>
          <svg
            v-show="isPwdShow"
            @click="handlePwdShow"
            t="1636627759622"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8463"
            width="24"
            height="24"
          >
            <path
              d="M942.3 486.4l-0.1-0.1-0.1-0.1c-36.4-76.7-80-138.7-130.7-186L760.7 351c43.7 40.2 81.5 93.7 114.1 160.9C791.5 684.2 673.4 766 512 766c-51.3 0-98.3-8.3-141.2-25.1l-54.7 54.7C374.6 823.8 439.8 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0.1-51.3zM878.3 154.2l-42.4-42.4c-3.1-3.1-8.2-3.1-11.3 0L707.8 228.5C649.4 200.2 584.2 186 512 186c-192.2 0-335.4 100.5-430.2 300.3v0.1c-7.7 16.2-7.7 35.2 0 51.5 36.4 76.7 80 138.7 130.7 186.1L111.8 824.5c-3.1 3.1-3.1 8.2 0 11.3l42.4 42.4c3.1 3.1 8.2 3.1 11.3 0l712.8-712.8c3.1-3 3.1-8.1 0-11.2zM398.9 537.4c-1.9-8.2-2.9-16.7-2.9-25.4 0-61.9 50.1-112 112-112 8.7 0 17.3 1 25.4 2.9L398.9 537.4z m184.5-184.5C560.5 342.1 535 336 508 336c-97.2 0-176 78.8-176 176 0 27 6.1 52.5 16.9 75.4L263.3 673c-43.7-40.2-81.5-93.7-114.1-160.9C232.6 339.8 350.7 258 512 258c51.3 0 98.3 8.3 141.2 25.1l-69.8 69.8z"
              p-id="8464"
            ></path>
            <path
              d="M508 624c-6.4 0-12.7-0.5-18.8-1.6l-51.1 51.1c21.4 9.3 45.1 14.4 69.9 14.4 97.2 0 176-78.8 176-176 0-24.8-5.1-48.5-14.4-69.9l-51.1 51.1c1 6.1 1.6 12.4 1.6 18.8C620 573.9 569.9 624 508 624z"
              p-id="8465"
            ></path>
          </svg>
        </div>
      </div>
      <button class="submitBtn" @click="AccessLogin" :disabled="isUserLogining">
        <span v-show="!isUserLogining">登 录</span>
        <i v-show="isUserLogining" class="el-icon-loading"></i>
      </button>
      <button class="changeBtn" @click="handleChangetoReg">
        <span>去注册</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      isUserLogining: false,
      isPwdShow: false,
      userInput: {
        inputAccount: "",
        inputPassword: "",
      },
      App_Host: "http://127.0.0.1:5999",
      timeoutArr: [],
    };
  },
  mounted() {
    // this.$public.on("load-app-host-from-controller", (res) => {
    //   this.App_Host = res;
    // });
    this.$public.on("clear-user-sign-status", () => {
      this.userInput.inputAccount = "";
      this.userInput.inputPassword = "";
    });
  },
  methods: {
    handleDisableBtn: function () {
      setTimeout(() => {
        this.isUserLogining = !this.isUserLogining;
      }, 1500);
    },
    handleNoticeProcess: function (text) {
      this.$public.emit("update-footer-status-upto-app", {
        status: "Error",
        text: text,
      });
      this.$public.emit("notice", {
        title: "注意",
        msg: "你的登录出现了一个错误,具体原因可查看控制台",
        type: "error",
        closefunc: null,
      });
    },
    AccessLogin: function () {
      let that = this;
      this.$public.emit("update-footer-status-upto-app", {
        status: "Loading",
        text: "😬 正在处理用户登录",
      });
      this.isUserLogining = true;

      if (this.userInput.inputAccount == null) {
        this.handleNoticeProcess("😥 用户名总不能是空的吧");
        this.handleDisableBtn();
      } else if (this.userInput.inputAccount.length <= 2) {
        this.handleNoticeProcess("😥 输入的用户名过短 (需要3+) ");
        this.handleDisableBtn();
      } else if (this.userInput.inputPassword == null) {
        this.handleNoticeProcess("😥 密码总不能是空的吧");
        this.handleDisableBtn();
      } else if (this.userInput.inputPassword.length <= 5) {
        this.handleNoticeProcess("😥 输入的密码长度过短 (需要6+) ");
        this.handleDisableBtn();
      } else if (
        this.userInput.inputAccount !=
        this.userInput.inputAccount.replace(/[^\w]/gi, "")
      ) {
        this.handleNoticeProcess("😥 用户名里不能包含有汉字跟符号的");
        this.handleDisableBtn();
      } else
        this.handleGetIPs().then((ip) => {
          if (ip != "UNKNOW")
            this.$axios
              .post(this.App_Host + "/api/user/signin", {
                username: this.userInput.inputAccount,
                password: this.$conf.getMd5String(that.userInput.inputPassword),
                appkey: localStorage.getItem("appkey"),
                userkey: localStorage.getItem("userkey"),
                checkkey: this.$conf.getMd5String(ip),
              })
              .then((res) => {
                if (res.data.length == 0)
                  that.handleNoticeProcess(
                    "😑 用户名或者密码错误或者不存在该用户"
                  );
                else {
                  this.$public.emit("update-footer-status-upto-app", {
                    status: "Success",
                    text: "😁 用户登陆成功",
                  });
                  this.$public.emit("update-main-user-info-upto-app", {
                    info: res.data.info[0],
                    detail: res.data.detail[0],
                  });
                  localStorage.setItem("username", res.data.info[0].username);
                  localStorage.setItem("checkKey", this.$conf.getMd5String(ip));
                }
              });
          else
            this.$public.emit("notice", {
              type: "error",
              msg: "发生了某些错误，可能是网络被阻塞了，或是网络连接错误",
            });
          this.isUserLogining = false;
        });
      //   this.$conf.getMd5String(this.userInput.inputPassword)
    },
    handleGetIPs: async function () {
      //https://api.ipify.org?format=json
      return this.$axios
        .get("https://api.ipify.org?format=json")
        .then((res) => {
          console.log(`本地IP [${res.data.ip}]`);
          return res.data.ip;
        })
        .catch((e) => {
          console.log("Get IP address Error, ", e);
          if (e) return "UNKNOW";
        });
    },
    handlePwdShow: function () {
      let input = document.querySelector("#loginpassword");
      this.isPwdShow = !this.isPwdShow;
      input.type = this.isPwdShow ? "text" : "password";
    },
    handleChangetoReg: function () {
      this.$public.emit("change-login-or-register-view", false);
    },
  },
};
</script>

<style scoped>
.login {
  @apply relative w-full h-full py-8;
}
.title {
  @apply text-4xl pb-4 text-center;
}
.inputContainer {
  @apply w-2/3 mx-auto mb-4;
}
.option {
  @apply w-96 mx-auto relative my-4;
}
.option:nth-child(1) {
  @apply mb-6;
}
.option:nth-child(2) {
  @apply mb-12;
}
.tip {
  @apply absolute -bottom-5 right-1 text-gray-400 text-xs hidden;
}
input:not([type="submit"]) {
  @apply h-8 absolute right-0 outline-none text-lg bg-transparent border box-border px-2;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
input:not([type="submit"]):focus {
  @apply border-blue-400;
}
input:not([type="submit"]):focus + span.tip {
  @apply inline-block;
}
#loginpassword {
  @apply pr-10;
}
.submitBtn,
.changeBtn {
  @apply block border border-gray-400 text-center text-sm px-4 py-2 rounded-sm mx-auto;
  transition: all ease-in-out 0.3s;
}
.submitBtn:hover,
.changeBtn:hover {
  @apply rounded-sm;
}
.changeBtn {
  @apply relative top-0 left-28;
  transform: translateY(-100%);
}
.pre {
  @apply inline-block h-8 px-2 border border-gray-200 box-border text-center text-sm;
  line-height: 2rem;
}
.option:nth-child(1) span.pre {
  @apply w-20;
}
.option:nth-child(1) input {
  width: calc(100% - 5rem);
}
.option:nth-child(2) span.pre {
  @apply w-16;
}
.option:nth-child(2) input {
  width: calc(100% - 4rem);
}

.showPwd {
  @apply w-12 h-8 absolute right-0 top-0 rounded-r-md bg-transparent py-1;
}
.showPwd svg {
  @apply block mx-auto;
}

@media (prefers-color-scheme: dark) {
  .submitBtn,
  .changeBtn {
    @apply bg-gray-600;
  }
  .submitBtn:hover,
  .changeBtn:hover {
    @apply border-gray-300 bg-gray-500 rounded-sm;
  }
  .showPwd svg path {
    fill: gray;
  }
}

@media (prefers-color-scheme: light) {
  .pre,
  input {
    @apply border-gray-600;
  }
  .submitBtn,
  .changeBtn {
    @apply bg-gray-100;
  }
  .submitBtn:hover,
  .changeBtn:hover {
    @apply border-gray-500 bg-gray-200 rounded-sm;
  }
}
</style>
