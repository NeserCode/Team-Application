<template>
  <div class="login">
    <div class="iContainer">
      <SignInput
        ref="iact"
        @keep-input="handleIAccount"
        :iModel="signIn.username"
        class="iIn"
        iLable="inAccount"
        iPreText="用户名"
      />
      <SignInput
        ref="ipwd"
        @keep-input="handleIPassword"
        :iModel="signIn.password"
        class="iIn"
        iType="password"
        iLable="inPassword"
        iPreText="密码"
      />
      <button @click="toggleSignModeToUp">切换到注册</button>
    </div>
  </div>
</template>

<script>
import SignInput from "@/components/Sign/input/index.vue";

export default {
  name: "Login",
  components: { SignInput },
  data() {
    return {
      signIn: {
        username: "",
        password: "",
      },
    };
  },
  mounted() {},
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
  },
};
</script>

<style scoped>
.login {
  @apply w-full h-full;
}

.iContainer {
  @apply relative flex flex-col justify-center items-center w-2/5 h-full mx-auto py-24
    mt-32 rounded-2xl shadow;
  min-width: 650px;
}

.iIn {
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
