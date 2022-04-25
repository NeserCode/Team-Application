<template>
  <div class="UserArea">
    <div class="loginArea" v-show="!isUserLogined">
      <Login v-show="this.loginOrReg" />
      <Register v-show="!this.loginOrReg" />
    </div>
    <userDetail v-show="isUserLogined" />
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
import userDetail from "@/components/UserAssets/Detail/index.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";

export default {
  name: "Setting",
  mounted() {
    this.$public.on("update-main-user-info-upto-app", () => {
      this.isUserLogined = true;
    });
    this.$public.on("change-login-or-register-view", (which) => {
      this.loginOrReg = which;
      console.log(which);
    });
    this.$public.on("clear-user-sign-status", () => {
      localStorage.removeItem("userkey");
      localStorage.removeItem("checkKey");
      this.isUserLogined = false;
    });
    this.$conf.getConfPromise().then((data) => {
      this.settings = data.data;
      this.initComponent();
    });
  },
  components: {
    Register,
    Login,
    userDetail,
  },
  data() {
    return {
      loginOrReg: true,
      isUserLogined: false,
      appConfigPath: "",
      keys: {
        appkey: "",
        userkey: "",
      },
      settings: {},
    };
  },
  methods: {
    initComponent: function () {
      //判定并实际操作主进程
      if (this.settings.userSetting.alwaysOnTop)
        ipcRenderer.send("setting-always-on-top");
      else ipcRenderer.send("setting-always-not-top");

      if (this.settings.userSetting.alwaysCloseDirect)
        this.$public.emit("update-header-need-close-direct", true);
      else this.$public.emit("update-header-need-close-direct", false);

      if (this.settings.userSetting.colorSchemeMode == "light")
        ipcRenderer.send("color-schemeMode-light");
      else if (this.settings.userSetting.colorSchemeMode == "dark")
        ipcRenderer.send("color-schemeMode-dark");
      else ipcRenderer.send("color-schemeMode-system");
      this.isUserLogined =
        localStorage.getItem("checkKey") == (undefined || null) ? false : true;
    },
  },
};
</script>

<style scoped>
.UserArea {
  @apply w-full h-auto;
}
</style>
