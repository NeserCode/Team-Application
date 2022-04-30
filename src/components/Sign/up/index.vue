<template>
  <div class="register">
    <div class="iContainer">
      <SignInput
        ref="iact"
        @keep-input="handleIAccount"
        :iModel="signUp.username"
        :iCheck="usernameFormat"
        class="iUp"
        iLable="upAccount"
        iTip="用户身份标识, 长度需要达到三位以上, 不含有汉字与符号"
        iPreText="用户名"
      />
      <SignInput
        ref="ipwd"
        @keep-input="handleIPassword"
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
        :iModel="signUp.repeat"
        :iCheck="passwordReFormat"
        class="iUp"
        iType="password"
        iLable="upRepeatPassword"
        iTip="重复输入一次上方密码, 不要偷偷复制粘贴哦"
        iPreText="重复密码"
      />
      <SignRadio
        ref="iSex"
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
        <button @click="handleSignUp">注册</button>
        <button @click="toggleSignModeToIn">切换到登录</button>
      </div>
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
    };
  },
  computed: {
    usernameFormat() {
      return (
        this.signUp.username.length >= 3 &&
        this.signUp.username == this.signUp.username.replace(/[^\w]/gi, "")
      );
    },
    passwordFormat() {
      return this.signUp.password.length >= 8;
    },
    passwordReFormat() {
      return this.signUp.password == this.signUp.repeat && this.passwordFormat;
    },
    // /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
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
      this.$public.emit("change-login-or-register-view", true);
    },
    handleSignUp: function () {
      console.log("sign up");
    },
  },
};
</script>

<style scoped>
.register {
  @apply w-full h-full;
}

.iContainer {
  @apply relative flex flex-col justify-center items-center w-2/5 h-full mx-auto pt-16 pb-12
     mt-32 rounded-2xl shadow;
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
