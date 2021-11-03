<template>
  <div class="setting">
    <div class="allSettings">
      <div class="loginArea" v-show="true">
        <Login />
        <Register />
      </div>
      <div class="userInfo" v-show="false">
        <div class="settingOption userZone">
          <User center />
          <div class="userRename" v-show="isUserRename">
            <el-input
              @keyup.enter="handleUserRename"
              class="renameInput"
              maxlength="10"
              show-word-limit
              v-model="usernameWrite"
              :disabled="isUserRenaming"
            ></el-input>
            <el-button
              :disabled="isUserRenaming"
              @click="handleUserRename"
              class="renameBtn"
            >
              <span v-show="isUserRename && !isUserRenaming">完成</span>
              <i
                v-show="isUserRename && isUserRenaming"
                class="el-icon-loading"
              ></i>
            </el-button>
          </div>
          <span v-show="!isUserRename" class="username"
            >{{ settings.userInfo.name }}
            <i @click="handleUserRename" class="el-icon-edit"></i
          ></span>
        </div>
        <div class="settingOption">
          <span class="preText"> 认证 </span>
          <el-tag
            >{{ settings.userInfo.access ? "已认证" : "未认证" }} |
            {{ settings.userInfo.orgnization }}
            {{ settings.userInfo.orPosition }}</el-tag
          >
        </div>
        <div class="settingOption">
          <span class="preText"> 用户键值 </span>
          <el-tag>
            <span>{{ settings.userInfo.value }}</span>
            <i class="el-icon-key"></i
            ><span class="selectable">{{
              settings.userInfo.key ?? "No_Such_Key_For_User"
            }}</span>
          </el-tag>
          <el-popover
            placement="right"
            title="注意"
            :width="200"
            trigger="hover"
            content="用户密钥将会与应用密钥一同上传至服务器以核对信息，当与最近一次密钥对有差别时将会要求用户登录验证"
            :show-arrow="false"
          >
            <template #reference><i class="el-icon-info"></i></template
          ></el-popover>
        </div>
        <div class="settingOption">
          <span class="preText"> 绑定 </span>
          <el-tag @click="handleUserBound">{{
            settings.userInfo.bound.email ?? "Email 未绑定"
          }}</el-tag>
        </div>
      </div>
      <div class="userSetting" id="userSetting">
        <div class="settingOption">
          <span class="preText"> 窗口总在最前 </span>
          <el-switch v-model="settings.userSetting.alwaysOnTop" />
        </div>
        <div class="settingOption">
          <span class="preText"> 关闭直接退出 </span>
          <el-switch v-model="settings.userSetting.alwaysCloseDirect" />
        </div>
        <div class="settingOption">
          <span class="preText"> 色彩模式 </span>
          <el-radio-group
            class="radioGroup"
            v-model="settings.userSetting.colorSchemeMode"
          >
            <el-radio-button label="system">跟随系统</el-radio-button>
            <el-radio-button label="dark">夜间模式</el-radio-button>
            <el-radio-button label="light">日间模式</el-radio-button>
          </el-radio-group>
        </div>
        <div class="settingOption submitContainer">
          <el-button
            :disabled="isUserSettingSaving"
            class="submitBtn"
            @click="handleChangeSettingAction"
          >
            <span v-show="!isUserSettingSaving">保存更改</span>
            <i v-show="isUserSettingSaving" class="el-icon-loading"></i>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const crypto = require("crypto");
const fs = window.require("fs");
const { ipcRenderer } = window.require("electron");
// @ is an alias to /src
import User from "@/components/User.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";

export default {
  name: "Setting",
  mounted() {
    this.initUserKey();
    this.initComponent();
  },
  components: {
    User,
    Register,
    Login
  },
  watch: {},
  activated() {
    this.handleLoadFile();
    fs.readFile(this.appConfigPath, "utf8", (err, data) => {
      if (data) {
        this.handleReadFileSuccess();
        this.settings = JSON.parse(data);
        this.initComponent();
      } else this.handleReadFileError(err);
    });
  },
  props: {
    appConfigPath: String,
  },
  data() {
    return {
      usernameWrite: null,
      timeOutCounter: null,
      isUserRename: false,
      isUserRenaming: false,
      isUserSettingSaving: false,
      isUserHoverInfo: false,
      userInput:{
        inputAccount:null,
        inputPassword:null,
      },
      settings: {
        appInfo: {
          name: null,
          version: null,
          key: null,
          orgnization: null,
        },
        userInfo: {
          name: null,
          access: null,
          value: null,
          key: null,
          orgnization: null,
          orPosition: null,
          bound: {
            email: null,
          },
        },
        userSetting: {
          alwaysOnTop: null,
          alwaysCloseDirect: null,
          colorSchemeMode: null,
        },
      },
      timeArray: {
        interval: [],
        timeout: [],
      },
    };
  },
  methods: {
    handleLoadFile: function () {
      this.$public.emit("update-footer-status-upto-app", {
        status: "Loading",
        text: `🙂 正在加载配置文件`,
      });
    },
    handleReadFileError: function (err) {
      this.$public.emit("update-footer-status-upto-app", {
        status: "Error",
        text: `☹ ${err}`,
      });
    },
    handleReadFileSuccess: function () {
      clearTimeout(this.timeOutCounter);
      this.timeOutCounter = setTimeout(() => {
        if (this.$route.name == "Setting")
          this.$public.emit("update-footer-status-upto-app", {
            status: "Success",
            text: `😊 配置文件加载成功`,
          });
      }, 500);
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
    handleBuildUserKey: function (length) {
      return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
    },
    handleUserKeyProcess: function () {
      if (this.settings.userInfo.key != null)
        this.$public.emit("update-footer-status-upto-app", {
          status: "Success",
          text: `😊 用户密钥加载成功`,
        });
      else {
        if (this.settings.userInfo.key != null)
          this.$public.emit("update-footer-status-upto-app", {
            status: "Loading",
            text: `😥 检测到用户密钥尚未注册`,
          });
        this.timeArray.timeout[1] = setTimeout(() => {
          this.settings.userInfo.key = this.handleBuildUserKey(16);
          fs.writeFile(
            this.appConfigPath,
            JSON.stringify(this.settings),
            "utf-8",
            (err) => {
              if (err)
                this.$public.emit("update-footer-status-upto-app", {
                  status: "Error",
                  text: "😙 用户密钥初始化注册失败" + err,
                });
              else
                this.$public.emit("update-footer-status-upto-app", {
                  status: "Success",
                  text: "😙 用户密钥初始化注册完毕 将在网络联通的情况下完成余下步骤",
                });
            }
          );
        }, 8000);
      }
    },
    initUserKey: function () {
      fs.readFile(this.appConfigPath, "utf8", (err, data) => {
        if (data) {
          this.settings = JSON.parse(data);
          this.timeArray.timeout[0] = setTimeout(() => {
            this.handleUserKeyProcess();
          }, 1000);
        } else
          this.$public.emit("update-footer-status-upto-app", {
            status: "Error",
            text: "🤐 " + err,
          });
      });
    },
    handleUserRename: function () {
      if (this.isUserRename)
        if (this.settings.userInfo.name != this.usernameWrite) {
          this.isUserRenaming = !this.isUserRenaming;
          if (this.usernameWrite == "")
            this.handleNewNotification(
              "你的命名出现了一个错误",
              "昵称不能为空",
              "error",
              2000,
              "bottom-right",
              () => {
                this.isUserRenaming = !this.isUserRenaming;
                this.isUserRename = false;
                this.usernameWrite = this.settings.userInfo.name;
                return;
              }
            );
          else this.settings.userInfo.name = this.usernameWrite;
          this.timeArray.timeout[2] = setTimeout(() => {
            fs.writeFile(
              this.appConfigPath,
              JSON.stringify(this.settings),
              "utf-8",
              (err) => {
                if (err)
                  this.handleNewNotification(
                    "出现了一个错误",
                    "这个错误导致你的设置无法保存" + err,
                    "error",
                    2000,
                    "bottom-right",
                    () => {
                      this.isUserRenaming = !this.isUserRenaming;
                      this.isUserRename = false;
                      return;
                    }
                  );
                else if (!this.usernameWrite == "") {
                  this.handleNewNotification(
                    "Congratulations",
                    "重命名成功(至少在本地是成功的)",
                    "success",
                    2000,
                    "bottom-right",
                    () => {
                      this.isUserRenaming = !this.isUserRenaming;
                      this.isUserRename = false;
                      return;
                    }
                  );
                }
              }
            );
          }, 1200);
        } else this.isUserRename = false;
      else this.isUserRename = true;
    },
    handleUserBound: function () {
      this.handleNewNotification(
        "遗憾的告知",
        "这个功能暂时还没有上线，再等一阵子吧",
        "info",
        1800,
        "bottom-right",
        null
      );
    },
    handleChangeSettingProcess: function (err) {
      if (err)
        this.handleNewNotification(
          "保存时出现了一个错误",
          err,
          "Error",
          2000,
          "bottom-right",
          () => {
            this.isUserSettingSaving = !this.isUserSettingSaving;
            return;
          }
        );
      else if (!this.usernameWrite == "") {
        this.handleNewNotification(
          "",
          "设置保存成功 正在为您启用设置",
          "success",
          1200,
          "bottom-right",
          () => {
            this.isUserSettingSaving = !this.isUserSettingSaving;
            this.initComponent();
            return;
          }
        );
      }
    },
    handleChangeSettingAction: function () {
      this.isUserSettingSaving = !this.isUserSettingSaving;
      fs.writeFile(
        this.appConfigPath,
        JSON.stringify(this.settings),
        "utf-8",
        (err) => {
          this.handleChangeSettingProcess(err);
        }
      );
    },
    initComponent: function () {
      this.usernameWrite = this.settings.userInfo.name;
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
    },
  },
};
</script>

<style scoped>
.setting,
.userSetting,
.userInfo,
.submitBtn {
  transition: background ease-in-out 0.8s;
}

.selectable {
  @apply select-text mx-0.5;
}
.setting {
  @apply w-full;
}
.allSettings {
  @apply w-4/5 h-full mx-auto py-4;
}
.settingOption {
  @apply h-16 w-full py-4 select-none;
}

.preText {
  @apply block float-left w-48 h-full text-base;
  text-indent: 5ch;
  line-height: 2rem;
}
.userZone {
  @apply h-full text-center py-12 mt-12;
}
.userZone .username {
  @apply w-48 h-12 block text-center text-lg mx-auto pt-4 font-bold;
}
.userZone .userRename {
  @apply w-72 h-12 mx-auto pt-4;
}
.renameInput {
  @apply float-left w-48;
}
.renameBtn {
  @apply float-left mx-2;
}

.userInfo {
  @apply mb-8 pb-6;
}
.el-icon-info {
  @apply mx-2 text-gray-400;
}
.settingOption .submitBtn {
  @apply block w-24 mx-auto;
}
.submitContainer {
  @apply py-16;
}
.boundContainer {
  @apply h-24;
}
.boundItem {
  @apply block w-full h-12;
}

.loginArea {
  @apply mb-8 pb-6;
}

@media (prefers-color-scheme: dark) {
  .setting {
    @apply bg-gray-400;
  }
  .userSetting,
  .userInfo,
  .loginArea {
    @apply bg-gray-700;
  }
  :deep().el-radio-button.is-active .el-radio-button__inner {
    @apply bg-gray-100 text-gray-800;
  }
  :deep().el-radio-button .el-radio-button__inner {
    @apply border-gray-800 text-gray-500;
  }
  .settingOption .submitBtn {
    @apply bg-gray-600 text-gray-200;
  }
}

@media (prefers-color-scheme: light) {
  .setting {
    @apply bg-gray-100;
  }
  .userSetting,
  .userInfo,
  .loginArea {
    @apply bg-white;
  }
  :deep().el-radio-button.is-active .el-radio-button__inner {
    @apply bg-gray-500 text-gray-200;
  }
  :deep().el-radio-button .el-radio-button__inner {
    @apply border-gray-800 text-gray-500;
  }
  .settingOption .submitBtn {
    @apply bg-white text-gray-700;
  }
}
</style>
