<template>
  <div class="register">
    <div class="regMainContainer">
      <span class="title">注&nbsp;&nbsp;册</span>
      <div class="inputContainer">
        <div class="option">
          <span class="pre"
            ><label for="username">用户名 <sup>*</sup></label></span
          >
          <input
            id="username"
            placeholder="account here"
            type="text"
            class="username"
            :disabled="isUserReging"
            @keyup.enter="AccessRegister"
            v-model="userInput.username"
          />
          <span class="tip">长度大于 3 位/不含任何汉字与符号</span>
        </div>
        <div class="option">
          <span class="pre"
            ><label for="password">密码 <sup>*</sup></label></span
          >
          <input
            id="password"
            placeholder="password here"
            type="password"
            class="password"
            :disabled="isUserReging"
            @keyup.enter="AccessRegister"
            v-model="userInput.password"
          />
          <span class="tip">长度大于 8 位</span>
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
        <div class="option">
          <span class="pre"
            ><label for="passwordRepeat">确认密码 <sup>*</sup></label></span
          >
          <input
            id="passwordRepeat"
            type="password"
            class="password"
            placeholder="password repeat"
            :disabled="isUserReging"
            @keyup.enter="AccessRegister"
            v-model="userInput.passwordRepeat"
          />
          <span class="tip">重复上方密码/不建议复制</span>
          <div class="showPwd" v-show="userInput.passwordRepeat.length >= 6">
            <svg
              v-show="isPwdRematch"
              t="1636632844204"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="15740"
              width="24"
              height="24"
            >
              <path
                d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474c-6.1-7.7-15.3-12.2-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1 0.4-12.8-6.3-12.8z"
                p-id="15741"
                fill="#515151"
              ></path></svg
            ><svg
              v-show="!isPwdRematch"
              t="1636632991970"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="15940"
              width="24"
              height="24"
            >
              <path
                d="M512 804m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                p-id="15941"
              ></path>
              <path
                d="M480 636h64c4.4 0 8-3.6 8-8V164c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8z"
                p-id="15942"
              ></path>
            </svg>
          </div>
        </div>
        <div class="option">
          <span class="pre"
            ><label for="teamCode">预认证团体授权码</label></span
          >
          <input
            type="text"
            placeholder="Team Code | 暂未开放"
            id="teamCode"
            class="teamCode"
            disabled
            @keyup.enter="AccessRegister"
            v-model="userInput.teamCode"
          />
        </div>
        <button
          class="submitBtn"
          :disabled="isUserReging"
          @click="AccessRegister"
        >
          <span v-show="!isUserReging">注&nbsp;册</span>
          <i v-show="isUserReging" class="el-icon-loading"></i>
        </button>
        <button class="changeBtn" @click="handleChangetoLogin">
          <span>去登录</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import crypto from "crypto";
// @ is an alias to /src

export default {
  name: "Register",
  data() {
    return {
      isUserReging: false,
      isPwdShow: false,
      userInput: {
        username: "",
        password: "",
        passwordRepeat: "",
        teamCode: "",
      },
      App_Host: "http://127.0.0.1:5999",
    };
  },
  computed: {
    isPwdRematch: function () {
      return (
        this.userInput.password.length >= 6 &&
        this.userInput.password == this.userInput.passwordRepeat
      );
    },
  },
  mounted() {
    this.$public.on("load-app-host-from-controller", (res) => {
      this.App_Host = res;
    });
    this.$public.on("clear-user-sign-status", () => {
      this.userInput.username = "";
      this.userInput.password = "";
      this.userInput.passwordRepeat = "";
    });
  },
  methods: {
    handlePwdShow: function () {
      let input = document.querySelector("#password");
      this.isPwdShow = !this.isPwdShow;
      input.type = this.isPwdShow ? "text" : "password";
    },
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
        "你的注册出现了一个错误,具体原因可查看控制台",
        "error",
        1500,
        "bottom-right",
        null
      );
    },
    AccessRegister: function () {
      //记住防抖
      this.isUserReging = true;

      if (this.userInput.username.length < 3) {
        this.handleNoticeProcess("😥 用户名长度不符 (需要3+)");
        this.handleDisableBtn();
      } else if (this.userInput.password.length < 8) {
        this.handleNoticeProcess("😥 用户密码长度不符 (需要8+)");
        this.handleDisableBtn();
      } else if (
        this.userInput.username !=
        this.userInput.username.replace(/[^\w]/gi, "")
      ) {
        this.handleNoticeProcess("😥 用户名不能包含汉字或符号");
        this.handleDisableBtn();
      } else if (!this.isPwdRematch) {
        this.handleNoticeProcess("😥 请检查重复输入的密码，两次输入不一致");
        this.handleDisableBtn();
      } else {
        this.$public.emit("rebuild-all-keys");
        this.handleRegisterProcess().then((result) => {
          if (!result.data.errorCode) {
            this.handleNewNotification(
              null,
              "注册成功",
              "success",
              2500,
              "bottom-right",
              () => {
                this.$public.emit("change-login-or-register-view", true);
                this.$public.emit("clear-user-sign-status");
              }
            );
          } else {
            if (result.data.errorCode == 1062)
              this.handleNoticeProcess("😥 用户名字段重复");
            else this.handleNoticeProcess("😥 未知错误");
          }
          this.handleDisableBtn();
          console.log(result);
        });
      }
    },
    handleMD5Process: function (str) {
      return crypto.createHash("md5").update(str).digest("hex");
    },
    handleDisableBtn: function () {
      setTimeout(() => {
        this.isUserReging = false;
      }, 1000);
    },
    handleRegisterProcess: function () {
      return this.$axios
        .post(this.App_Host + "/api/user/signup", {
          username: this.userInput.username,
          password: this.handleMD5Process(this.userInput.password),
          appkey: localStorage.getItem("appkey"),
          userkey: this.$conf.getRandomKey(16),
        })
        .then((res) => {
          return res;
        });
    },
    handleChangetoLogin: function () {
      this.$public.emit("change-login-or-register-view", true);
    },
  },
};
</script>

<style scoped>
.register {
  @apply w-full h-full py-8;
}
.regMainContainer {
  @apply w-2/3 mx-auto;
}
span.title {
  @apply text-center block w-full text-4xl  mb-8;
}
.option {
  @apply w-96 mx-auto relative my-6;
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
#password,
#passwordRepeat {
  @apply pr-10;
}
.submitBtn {
  @apply mt-12;
}
.submitBtn,
.changeBtn {
  @apply block border border-gray-400 text-center text-sm px-4 py-2 bg-gray-600 rounded-sm mx-auto;
  transition: all ease-in-out 0.3s;
}
.submitBtn:hover,
.changeBtn:hover {
  @apply border-gray-300 bg-gray-500 rounded-sm;
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
.option:nth-child(3) span.pre {
  @apply w-28;
}
.option:nth-child(3) input {
  width: calc(100% - 7rem);
}
.option:nth-child(4) span.pre {
  @apply w-40;
}
.option:nth-child(4) input {
  width: calc(100% - 10rem);
}
.option:nth-child(5) span.pre {
  @apply w-28;
}
.option:nth-child(5) input {
  width: calc(100% - 7rem);
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
