<template>
  <div class="Controller"></div>
</template>

<script>
const fs = require("fs");
const path = require("path");

async function dirExists(dir) {
  function getStat(path) {
    return new Promise((resolve) => {
      fs.stat(path, (err, stats) => {
        if (err) resolve(false);
        else resolve(stats);
      });
    });
  }
  function mkdir(dir) {
    return new Promise((resolve) => {
      fs.mkdir(dir, (err) => {
        if (err) resolve(false);
        else resolve(true);
      });
    });
  }
  let isExists = await getStat(dir);
  if (isExists && isExists.isDirectory()) return true;
  else if (isExists) return "File Exists";

  let tempDir = path.parse(dir).dir;
  let status = await dirExists(tempDir);
  if (status) return await mkdir(dir);
}

export default {
  name: "Controller",
  beforeCreate() {},
  mounted() {
    this.APP_CONFIG_PATH = this.$conf.getPath();
    dirExists(this.APP_CONFIG_PATH);

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
        type,
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

    this.$conf
      .getConfPromise()
      .then((data) => {
        this.APP_CONFIG = data.data;
        this.initController();
      })
      .then(() => {
        console.log(
          localStorage.getItem("appkey"),
          localStorage.getItem("userkey")
        );
      });
  },
  data() {
    return {
      DeFineBoolean: [],
      APP_CONFIG: {},
      APP_CONFIG_PATH: "",
    };
  },
  methods: {
    handleRebuildKey: function (...option) {
      if (option.length == 0) {
        this.APP_CONFIG.appInfo.key = this.$conf.getRandomKey(16);
        this.APP_CONFIG.userInfo.key = this.$conf.getRandomKey(16);
      } else if (
        option.indexOf("appkey") != -1 &&
        option.indexOf("userkey") == -1
      )
        this.APP_CONFIG.appInfo.key = this.$conf.getRandomKey(16);
      else if (
        option.indexOf("userkey") != -1 &&
        option.indexOf("appkey") == -1
      )
        this.APP_CONFIG.userInfo.key = this.$conf.getRandomKey(16);
      else {
        this.APP_CONFIG.appInfo.key = this.$conf.getRandomKey(16);
        this.APP_CONFIG.userInfo.key = this.$conf.getRandomKey(16);
      }
      this.handleSaveKey();
    },
    handleSaveKey: function () {
      localStorage.setItem("appkey", this.APP_CONFIG.appInfo.key);
      localStorage.setItem("userkey", this.APP_CONFIG.userInfo.key);
      fs.writeFile(
        this.APP_CONFIG_PATH,
        JSON.stringify(this.APP_CONFIG),
        (err) => {
          if (err)
            this.$public.emit("notice", {
              type: "error",
              msg: "文件保存失败",
            });
          else
            this.$public.emit("notice", {
              type: "success",
              msg: "文件保存成功",
            });
        }
      );
    },
    handleCheckKey: function () {
      if (this.APP_CONFIG.appInfo.key == null) this.handleRebuildKey("appkey");
      else if (this.APP_CONFIG.userInfo.key == null)
        this.$message.error("Warning: Userkey is null.");

      this.handleSaveKey();
    },
    initUser: function () {
      if (localStorage.getItem("checkKey") != (null || undefined))
        console.log("checkkey exists", localStorage.getItem("checkKey"));
    },
    initController: function () {
      this.handleCheckKey();
      this.initUser();
    },
  },
};
</script>

<style scoped>
.Controller {
  @apply hidden;
}
</style>
