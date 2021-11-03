<template>
  <div id="AppView">
    <appViewHead :needs="needs" :title="appTitle"></appViewHead>
    <AppMainContainer :configPath="appConfigPath" />
    <appViewFoot
      :status="statusReal.status"
      :statusText="statusReal.text"
    ></appViewFoot>
  </div>
</template>

<script>
const crypto = require("crypto");
const fs = window.require("fs");
import appViewHead from "@/components/Header.vue";
import AppMainContainer from "@/views/AppMainContainer.vue";
import appViewFoot from "@/components/Footer.vue";

const { ipcRenderer } = window.require("electron");

export default {
  name: "App",
  components: {
    appViewHead,
    appViewFoot,
    AppMainContainer,
  },
  beforeMount() {
    document.body.addEventListener("mouseup", (event) => {
      let e = event || window.event;
      let nType = e.button;
      if (2 === nType) {
        ipcRenderer.send("sigShowRightClickMenu");
      }
      e.stopPropagation();
    });
  },
  mounted() {
    this.initAppKey();
    //listen public response this.$public.on('',()=>{})
    this.$public.on("update-footer-status-upto-app", (status) => {
      this.statusReal.status = status.status;
      this.statusReal.text = status.text;
    });
    this.$public.on("update-header-need-close-direct", (symbol) => {
      this.needs.isSettingCloseDirect = symbol;
    });
  },
  data() {
    return {
      AppConfigSet: {
        bit: 16,
      },
      AppSettings: null,
      appTitle: "正在工作于 创建 [Setting] 编辑器",
      appConfigPath: "src/user/appConfig.json",
      statusSet: [
        {
          status: "Success",
          text: "",
          default: "😆 Got it by myself",
        },
        {
          status: "Loading",
          text: "",
          default: "😀 I'm loading with my best",
        },
        {
          status: "Warn",
          text: "",
          default: "🤨 Something is not appropriate here",
        },
        {
          status: "Error",
          text: "",
          default: "😨 Oh no, real a hit for me",
        },
      ],
      statusReal: {
        status: "Loading",
        text: "😀 I'm loading with my best, but so long a message abcdefghijklmnopqrstuvwxyz",
      },
      timeArray: {
        interval: [],
        timeout: [],
      },
      needs: {
        isSettingCloseDirect: false,
      },
    };
  },
  methods: {
    handleBuildAppKey: function (length) {
      return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
    },
    handleBuildUserKey: function (length) {
      return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
    },
    handleStatusChange: function (msg, status) {
      let statusNumber = 0;
      this.statusSet.forEach((item, index) => {
        if (status == item.status) statusNumber = index;
      });

      this.statusReal.status = this.statusSet[statusNumber].status;
      if (msg.length >= 3) this.statusReal.text = msg;
      else this.statusReal.text = this.statusSet[statusNumber].default;
    },
    handleAppKeyProcess: function () {
      if (this.AppSettings.appInfo.key != null)
        this.handleStatusChange("", "Success");
      else {
        this.handleStatusChange(
          "😥 检测到应用尚未注册 正在为你生成应用注册键值 请不要关闭应用",
          "Loading"
        );
        this.timeArray.timeout[1] = setTimeout(() => {
          this.AppSettings.appInfo.key = this.handleBuildAppKey(
            this.AppConfigSet.bit
          );
          fs.writeFile(
            this.appConfigPath,
            JSON.stringify(this.AppSettings),
            "utf-8",
            (err) => {
              if (err)
                this.handleStatusChange("😙 应用初始化注册失败" + err, "Error");
              else
                this.handleStatusChange(
                  "😙 应用初始化注册完毕 将在网络联通的情况下完成余下步骤",
                  "Success"
                );
            }
          );
        }, 8000);
      }
    },
    initAppKey: function () {
      this.handleStatusChange("", "Loading");
      fs.readFile(this.appConfigPath, "utf8", (err, data) => {
        if (data) {
          this.AppSettings = JSON.parse(data);
          //init settings
          this.initSettings();
          this.timeArray.timeout[0] = setTimeout(() => {
            this.handleAppKeyProcess();
          }, 1000);
        } else this.handleStatusChange("🤐 " + err, "Error");
      });
    },
    initSettings: function () {
      this.needs.isSettingCloseDirect =
        this.AppSettings.userSetting.alwaysCloseDirect;
      //判定并实际操作主进程
      if (this.AppSettings.userSetting.alwaysOnTop)
        ipcRenderer.send("setting-always-on-top");
      else ipcRenderer.send("setting-always-not-top");

      if (this.AppSettings.userSetting.colorSchemeMode == "light") {
        ipcRenderer.send("color-schemeMode-light");
        this.$public.emit("color-schemeMode-is-dark", false);
      } else if (this.AppSettings.userSetting.colorSchemeMode == "dark") {
        ipcRenderer.send("color-schemeMode-dark");
        this.$public.emit("color-schemeMode-is-dark", true);
      } else ipcRenderer.send("color-schemeMode-system");
    },
    initApp: function () {},
  },
};
</script>

<style scoped>
#AppView {
  @apply w-screen h-screen overflow-x-hidden select-none border;
  box-sizing: border-box;
}
</style>

<style>
#AppView,
.appViewHead,
.appViewFoot,
.appAreaLinkGroup {
  transition: background ease-in-out 0.2s;
}
#AppView{
  font-family: 'Canger_xwz';
  font-weight: 100;
}
.appAreaLinkGroup {
  font-family: "Helvatica_otf";
}
.appViewFoot,.appViewHead{
  font-family: 'Canger_zkzdbs';
}
.hasScreenScrollBar::-webkit-scrollbar {
  width: 7.5px;
  height: 5px;
}
.hasScreenScrollBar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #999;
}
.hasScreenScrollBar::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 1);
}

@media (prefers-color-scheme: dark) {
  #AppView {
    @apply text-gray-100 border-gray-400;
  }
  .appViewHead {
    @apply bg-gray-800 text-gray-200;
  }
  .appAreaLinkGroup {
    @apply bg-gray-600 text-gray-200 border-gray-300;
  }
  .appViewFoot {
    @apply bg-gray-800 text-gray-200;
  }
  .AppMainContainer {
    @apply bg-gray-400;
  }

  .hasScreenScrollBar::-webkit-scrollbar-thumb {
    @apply bg-gray-100;
  }
  .hasScreenScrollBar::-webkit-scrollbar-track {
    @apply bg-gray-400;
  }
}

@media (prefers-color-scheme: light) {
  #AppView {
    @apply text-gray-800 border-gray-400;
  }
  .appViewHead {
    @apply bg-green-600 text-gray-800;
  }
  .appAreaLinkGroup {
    @apply bg-white text-gray-800 border-gray-200;
  }
  .appViewFoot {
    @apply bg-gray-200 text-gray-800;
  }
  .AppMainContainer {
    @apply bg-gray-100;
  }

  .hasScreenScrollBar::-webkit-scrollbar-thumb {
    @apply bg-gray-400;
  }
  .hasScreenScrollBar::-webkit-scrollbar-track {
    @apply bg-gray-100;
  }
}

@font-face {
  font-family: Canger_xwz;
  src: url("../src/assets/fonts/Canger_xwz.ttf");
}
@font-face {
  font-family: Canger_zkzdbs;
  src: url("../src/assets/fonts/Canger_zkzdbs.ttf");
}
@font-face {
  font-family: Helvetica_otf;
  src: url("../src/assets/fonts/Helvetica.otf");
}
</style>

