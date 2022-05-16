<template>
  <div class="Controller"></div>
</template>

<script>
export default {
  name: "Controller",
  beforeCreate() {},
  mounted() {
    this.$public.on("rebuild-app-key", () => {
      this.handleRebuildKey("appkey");
    });

    this.$public.on("check-all-key", () => {
      this.handleCheckKey();
    });

    this.$public.on("notice", ({ title, msg, type, time, fn }) => {
      let duration = 1500,
        position = "bottom-right";

      this.$notify({
        title,
        message: msg,
        type: type == "loading" ? "info" : type,
        duration: time ?? duration,
        position,
        onClose: fn,
        showClose: false,
        offset: 25,
      });
      this.$public.emit("update-footer-status-upto-app", {
        status: type ?? "Loading",
        text: msg,
      });
    });
    this.initController();
  },
  data() {
    return {};
  },
  methods: {
    handleRebuildKey: function (...option) {
      // if (option.length == 0) {
      //   this.APP_CONFIG.appInfo.key = this.$conf.getRandomKey(16);
      //   this.APP_CONFIG.userInfo.key = this.$conf.getRandomKey(16);
      // } else if (
      //   option.indexOf("appkey") != -1 &&
      //   option.indexOf("userkey") == -1
      // )
      //   this.APP_CONFIG.appInfo.key = this.$conf.getRandomKey(16);
      // else if (
      //   option.indexOf("userkey") != -1 &&
      //   option.indexOf("appkey") == -1
      // )
      //   this.APP_CONFIG.userInfo.key = this.$conf.getRandomKey(16);
      // else {
      //   this.APP_CONFIG.appInfo.key = this.$conf.getRandomKey(16);
      //   this.APP_CONFIG.userInfo.key = this.$conf.getRandomKey(16);
      // }
      console.log(option);
    },
    handleCheckKey: function () {
      this.$conf
        .getConfPromise()
        .then((data) => {
          if (data.data.appInfo.key == null) this.handleRebuildKey("appkey");
          else if (data.data.userInfo.key == null)
            this.$message.error("Warning: Userkey is null.");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    initUser: function () {
      if (localStorage.getItem("checkKey") != (null || undefined))
        console.log(`#checkKey [${localStorage.getItem("checkKey")}]`);
    },
    initController: function () {
      this.handleCheckKey();
      this.initUser();
    },
  },
};
</script>

<style scoped lang="postcss">
.Controller {
  @apply hidden;
}
</style>
