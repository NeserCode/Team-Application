<template>
  <div class="register">
    <div class="iContainer">
      <SignInput
        ref="iun"
        @keep-input="handleIAccount"
        @keyup.enter="handleSignUp"
        :iModel="signUp.username"
        :iCheck="usernameFormat"
        class="iUp"
        iLable="upAccount"
        iTip="用户身份标识, 长度需要达到三位以上, 不含有汉字与符号, 大小写不敏感"
        iPreText="用户名"
      />
      <SignInput
        ref="ipwd"
        @keep-input="handleIPassword"
        @keyup.enter="handleSignUp"
        :iModel="signUp.password"
        :iCheck="passwordFormat"
        class="iUp"
        iType="password"
        iLable="upPassword"
        iTip="用于身份认证的密码, 长度需要达到八位以上"
        iPreText="密码"
      />
      <SignInput
        ref="irpwd"
        @keep-input="handleIRPassword"
        @keyup.enter="handleSignUp"
        :iModel="signUp.repeat"
        :iCheck="passwordReFormat"
        class="iUp"
        iType="password"
        iLable="upRepeatPassword"
        iTip="重复输入一次上方密码, 不要偷偷复制粘贴哦"
        iPreText="重复密码"
      />
      <SignRadio
        ref="isx"
        @keep-change="handleRSex"
        :rList="sexList"
        :rModel="signUp.sex"
        class="rUp"
        rPreText="性别"
        rTip="个人信息基本项, 没有非人选项! 按下 Tab 可以使用左右键更换选项"
      />
      <SignInput
        ref="ibd"
        @keep-input="handleRBound"
        @keyup.enter="handleSignUp"
        :iModel="signUp.bound"
        :iCheck="boundFormat"
        class="iUp"
        iType="email"
        iLable="upBound"
        iTip="目前还只是可以自己自行修改的联系方式"
        iPreText="绑定邮箱"
      />
      <br />
      <div class="btnContainer">
        <button @click="handleSignUp">
          <span>注册</span> <i class="el-icon-loading" v-show="!clickable"></i>
        </button>
        <button @click="toggleSignModeToIn">切换到登录</button>
      </div>
      <span :class="['signBar', !clickable ? 'loading' : '']"></span>
    </div>
  </div>
</template>

<script>
import SignInput from "@/components/Sign/input/index.vue";
import SignRadio from "@/components/Sign/radio/index.vue";
// @ is an alias to /src

export default {
  name: "Register",
  components: { SignInput, SignRadio },
  data() {
    return {
      sexList: [
        {
          id: 1,
          label: "m",
          choice: "男",
        },
        {
          id: 2,
          label: "w",
          choice: "女",
        },
      ],
      signUp: {
        username: "",
        password: "",
        repeat: "",
        sex: "m",
        bound: "",
      },
      clickable: true,
      checkText: "",
    };
  },
  watch: {
    signUp: {
      deep: true,
      handler() {
        if (this.signUp.username.length < 3)
          this.checkText = "用户名长度非法 用户名应为3位及以上的纯英文";
        else if (!this.usernameFormat)
          this.checkText = "用户名非法 用户名应为3位及以上的纯英文";
        else if (!this.passwordFormat) {
          this.checkText =
            "密码长度非法 密码应为8位以上的数字、字母及符号组成的字符串";
        } else if (!this.passwordReFormat) {
          this.checkText = "重复密码与所设置密码不同";
        } else if (!this.boundFormat) {
          this.checkText = "邮箱格式错误";
        } else this.checkText = "";
      },
    },
  },
  computed: {
    usernameFormat() {
      return (
        this.signUp.username.length >= 3 &&
        this.signUp.username == this.signUp.username.replace(/[^\w]/gi, "")
      );
    },
    passwordFormat() {
      return this.signUp.password.length > 7;
    },
    passwordReFormat() {
      return this.signUp.password == this.signUp.repeat && this.passwordFormat;
    },
    boundFormat() {
      return (
        this.signUp.bound.length >= 3 &&
        /^\w+@([a-z0-9]{1,6})(\.[a-z]{2,3})+$/i.test(this.signUp.bound)
      );
    },
  },
  mounted() {},
  methods: {
    handleIAccount: function (s) {
      this.signUp.username = s;
    },
    handleIPassword: function (s) {
      this.signUp.password = s;
    },
    handleIRPassword: function (s) {
      this.signUp.repeat = s;
    },
    handleRSex: function (o) {
      this.signUp.sex = o;
    },
    handleRBound: function (s) {
      this.signUp.bound = s;
    },
    toggleSignModeToIn: function () {
      this.signUp.username = "";
      this.signUp.password = "";
      this.signUp.repeat = "";
      this.signUp.bound = "";
      this.signUp.sex = "m";
      this.$public.emit("change-login-or-register-view", true);
    },

    handleSignUp: function () {
      if (this.clickable) {
        if (this.signUp.username.length < 1) this.$refs.iun.handleShakeInput();
        else if (this.signUp.password.length < 1)
          this.$refs.ipwd.handleShakeInput();
        else if (this.signUp.repeat.length < 1)
          this.$refs.irpwd.handleShakeInput();
        else if (this.signUp.bound.length < 1)
          this.$refs.ibd.handleShakeInput();
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
          this.clickable = false;
          this.$conf.getHost().then((h) => {
            this.$conf
              .handleUserSignUp({
                host: this.$conf.getHttpString(h.host),
                username: this.signUp.username,
                password: this.$conf.getMd5String(this.signUp.password),
                appkey: localStorage.getItem("appKey"),
                userkey: this.$conf.getRandomKey(16),
                sex: this.signUp.sex,
                bound: this.signUp.bound,
              })
              .then((response) => {
                if (response.data.errorCode)
                  this.$public.emit("notice", {
                    type: "error",
                    msg: `☹ 注册失败, #[${response.data.errorCode}] ${response.data.message}`,
                    time: 2500,
                    fn: () => {
                      this.clickable = true;
                    },
                  });
                else {
                  console.log(response.data);
                  this.$public.emit("notice", {
                    type: "success",
                    msg: `😎 注册成功, 欢迎您, ${this.signUp.username} 赶紧登录一下试试`,
                    time: 2500,
                    fn: () => {
                      this.toggleSignModeToIn();
                      this.clickable = true;
                    },
                  });
                }
              })
              .catch((e) => {
                console.log(e);
                this.$public.emit("notice", {
                  type: "error",
                  msg: "☹ 注册失败, 请检查输入选项和网络配置",
                  time: 2500,
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

<style scoped lang="postcss">
.register {
  @apply w-full h-full pb-12;
}

.iContainer {
  @apply relative flex flex-col justify-center items-center w-2/5 h-full mx-auto pt-16 pb-12
     mt-32 rounded-2xl shadow overflow-hidden;
  min-width: 650px;
}

.iUp {
  @apply w-1/3 inline-block my-8;
}

.rUp {
  @apply w-1/3 inline-block my-6;
}

.btnContainer {
  @apply flex w-1/3 justify-between;
}

.signBar {
  @apply absolute bottom-0 rounded-full inline-block bg-blue-400 w-full h-1.5 transition-all;
}
.signBar.loading {
  animation: loading infinite 1.5s ease-in-out;
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

@keyframes loading {
  0% {
    @apply bg-blue-400 w-full opacity-100 bottom-0 h-1.5;
  }
  5% {
    @apply bg-blue-400 w-1.5 opacity-0 bottom-4;
  }
  50% {
    @apply bg-blue-400 w-1.5 h-1.5 opacity-100;
  }
  60% {
    @apply bg-blue-400 w-1.5 h-px opacity-100 bottom-0;
  }
  65% {
    @apply bg-blue-900 h-px;
  }
  90% {
    @apply bg-blue-400 h-px;
  }
  100% {
    @apply bg-blue-400 h-1.5;
  }
}
</style>
