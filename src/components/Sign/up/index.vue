<template>
  <div class="register">
    <div class="iContainer">
      <SignInput
        ref="iact"
        @keep-input="handleIAccount"
        :iModel="signUp.username"
        class="iUp"
        iLable="upAccount"
        iPreText="用户名"
      />
      <SignInput
        ref="ipwd"
        @keep-input="handleIPassword"
        :iModel="signUp.password"
        class="iUp"
        iType="password"
        iLable="upPassword"
        iPreText="密码"
      />
      <SignInput
        ref="irpwd"
        @keep-input="handleIRPassword"
        :iModel="signUp.repeat"
        class="iUp"
        iType="password"
        iLable="upRepeatPassword"
        iPreText="重复密码"
      />
      <button @click="toggleSignModeToIn">切换到登录</button>
    </div>
  </div>
</template>

<script>
import SignInput from "@/components/Sign/input/index.vue";
// @ is an alias to /src

export default {
  name: "Register",
  components: { SignInput },
  data() {
    return {
      signUp: {
        username: "",
        password: "",
        repeat: "",
      },
    };
  },
  computed: {},
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
    toggleSignModeToIn: function () {
      this.signUp.username = "";
      this.signUp.password = "";
      this.signUp.repeat = "";
      this.$public.emit("change-login-or-register-view", true);
    },
  },
};
</script>

<style scoped>
.register {
  @apply w-full h-full;
}

.iContainer {
  @apply relative flex flex-col justify-center items-center w-2/5 h-full mx-auto py-24
     mt-32 rounded-2xl shadow;
  min-width: 650px;
}

.iUp {
  @apply w-1/3 inline-block my-8;
}

@media (prefers-color-scheme: dark) {
  .iContainer {
    @apply bg-gray-900;
  }
}

@media (prefers-color-scheme: light) {
  .iContainer {
    @apply bg-white;
  }
}
</style>
