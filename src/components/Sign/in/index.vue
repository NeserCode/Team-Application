<template>
  <div class="login">
    <div class="iContainer">
      <SignInput
        ref="iact"
        @keep-input="handleIAccount"
        @keyup.enter="handleSignin"
        :iModel="signIn.username"
        :iCheck="usernameFormat"
        class="iIn"
        iLable="inAccount"
        iPreText="用户名"
      />
      <SignInput
        ref="ipwd"
        @keep-input="handleIPassword"
        @keyup.enter="handleSignin"
        :iModel="signIn.password"
        :iCheck="passwordFormat"
        class="iIn"
        :iType="options.isShowPassword ? 'text' : 'password'"
        iLable="inPassword"
        iPreText="密码"
      />
      <br />
      <div class="optContainer">
        <el-checkbox v-model="options.isShowPassword">显示密码</el-checkbox>
        <el-checkbox v-model="options.isOnlineSignIn">在线登录</el-checkbox>
        <br />
        <span v-if="options.isOnlineSignIn">{{ IpAddress }}</span>
      </div>
      <div class="btnContainer">
        <button @click="handleSignin">
          <span v-show="clickable">登录</span>
          <i class="el-icon-loading" v-show="!clickable"></i>
        </button>
        <button @click="toggleSignModeToUp">切换到注册</button>
      </div>
    </div>
  </div>
</template>

<script>
import SignInput from "@/components/Sign/input/index.vue";

export default {
  name: "Login",
  components: { SignInput },
  watch: {
    signIn: {
      deep: true,
      handler() {
        if (this.signIn.username.length < 3)
          this.checkText = "用户名长度非法 用户名应为3位及以上的纯英文";
        else if (
          this.signIn.username != this.signIn.username.replace(/[^\w]/gi, "")
        )
          this.checkText = "用户名非法 用户名应为3位及以上的纯英文";
        else if (this.signIn.password.length < 8) {
          this.checkText =
            "密码长度非法 密码应为8位以上的数字、字母及符号组成的字符串";
        } else this.checkText = "";
      },
    },
    options: {
      handler() {
        if (this.options.isOnlineSignIn)
          this.$conf
            .getLocalIP()
            .then((ip) => {
              this.IpAddress = `从 ${ip} 登入`;
            })
            .catch((e) => {
              this.IpAddress = null;
              this.$public.emit("notice", {
                msg: `在线登陆设置错误 ${e.message}`,
                time: 2000,
              });
            });
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    usernameFormat() {
      return (
        this.signIn.username.length >= 3 &&
        this.signIn.username == this.signIn.username.replace(/[^\w]/gi, "")
      );
    },
    passwordFormat() {
      return this.signIn.password.length >= 8;
    },
  },
  data() {
    return {
      signIn: {
        username: "",
        password: "",
      },
      options: {
        isOnlineSignIn: true,
        isShowPassword: false,
      },
      checkText: "",
      clickable: true,
      IpAddress: null,
    };
  },
  mounted() {},
  unmounted() {
    this.clickable = true;
  },
  methods: {
    handleIAccount: function (s) {
      this.signIn.username = s;
    },
    handleIPassword: function (s) {
      this.signIn.password = s;
    },
    toggleSignModeToUp: function () {
      this.signIn.username = "";
      this.signIn.password = "";
      this.$public.emit("change-login-or-register-view", false);
    },
    handleSignin: function () {
      if (this.clickable) {
        if (this.signIn.username.length < 1) this.$refs.iact.handleShakeInput();
        else if (this.signIn.password < 1) this.$refs.ipwd.handleShakeInput();
        else if (this.checkText.length >= 2) {
          this.clickable = false;
          this.$public.emit("notice", {
            type: "error",
            msg: this.checkText,
            time: 2200,
            fn: () => {
              this.clickable = true;
            },
          });
        } else {
          this.$conf.getHost().then((h) => {
            this.clickable = false;
            this.$conf
              .handleUserSignIn({
                host: this.$conf.getHttpString(h.host),
                username: this.signIn.username,
                password: this.$conf.getMd5String(this.signIn.password),
                appkey: localStorage.getItem("appKey"),
                checkkey: this.$conf.getMd5String(this.IpAddress ?? h.host),
              })
              .then((response) => {
                const { info, detail } = response.data;
                if (info.userKey.length < 16)
                  this.$public.emit("notice", {
                    type: "warn",
                    msg: "用户键值缺失异常",
                    fn: () => {
                      this.clickable = true;
                    },
                  });
                else if (info.appKey.length < 16) {
                  this.$public.emit("notice", {
                    type: "warn",
                    msg: "应用键值缺失异常",
                    fn: () => {
                      this.clickable = true;
                    },
                  });
                }

                this.$public.emit("notice", {
                  type: "success",
                  msg: `欢迎您，${detail.nickname}`,
                  time: 3000,
                  fn: () => {
                    this.$public.emit("update-main-user-info-upto-app", {
                      info,
                      detail,
                    });
                    this.signIn.username = "";
                    this.signIn.password = "";
                    this.options.isOnlineSignIn = true;
                    this.options.isShowPassword = false;

                    this.clickable = true;
                  },
                });
              })
              .catch((e) => {
                console.log(e.message);
                this.$public.emit("notice", {
                  type: "error",
                  msg: "登陆错误, 请检查您输入的用户名和密码",
                  fn: () => {
                    this.clickable = true;
                  },
                });
              });
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.login {
  @apply w-full h-full;
}

.iContainer {
  @apply relative flex flex-col justify-center items-center w-1/3 h-full mx-auto pt-16 pb-12
    mt-32 rounded-2xl shadow;
  min-width: 650px;
}

.iIn {
  @apply w-1/3 inline-block my-8;
}

.btnContainer {
  @apply flex w-1/3 justify-between;
}

.optContainer {
  @apply inline-block pb-8;
}
.optContainer span {
  @apply inline-block w-full text-center text-xs font-semibold opacity-75;
}

button {
  @apply bg-transparent px-4 py-2 rounded-full transition-colors border border-transparent;
}
button:focus {
  @apply outline-none;
}
button:focus::before {
  content: ">";
  @apply inline-block pr-1 font-semibold;
}

@media (prefers-color-scheme: dark) {
  .iContainer {
    @apply bg-gray-900;
  }
  button:hover {
    @apply bg-gray-700 text-gray-200;
  }
}

@media (prefers-color-scheme: light) {
  .iContainer {
    @apply bg-white;
  }
  button:hover {
    @apply bg-gray-200 text-gray-700;
  }
}
</style>
