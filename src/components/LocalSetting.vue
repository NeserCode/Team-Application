<template>
  <div class="userSetting" id="userSetting">
    <SettingOption
      opTitle="开发者模式 | ⚠Beta"
      opType="switch"
      opTip="开启此选项以获得开发者功能权限"
      :opDisabled="true"
    />
    <SettingOption
      :opTitle="appOnTop.title"
      opType="switch"
      :opTip="appOnTop.tip"
      :opBindValue="appOnTop.value"
      :opCallbackFn="appOnTop.fn"
    />
    <SettingOption
      :opTitle="appCloseAction.title"
      opType="switch"
      :opTip="appCloseAction.tip"
      :opBindValue="appCloseAction.value"
      :opCallbackFn="appCloseAction.fn"
    />
    <SettingOption
      :opTitle="appTheme.title"
      opType="touch"
      :opTip="appTheme.tip"
      :opTouchArray="appTheme.array"
      :opTouchValue="appTheme.value"
    />
  </div>
</template>

<script>
import SettingOption from "@/components/SettingOption.vue";
const { ipcRenderer } = window.require("electron");

export default {
  name: "LocalSetting",
  components: { SettingOption },
  data() {
    return {
      isClickable: true,
      appOnTop: {
        title: "窗口前置",
        value: false,
        fn: this.handleChangeAppOnTop,
        tip: "开启此选项将本软件页面置于图层最前方",
      },
      appCloseAction: {
        title: "关闭选项",
        value: true,
        fn: this.handleChangeCloseAction,
        tip: "决定点击关闭按钮后应用是最小化还是彻底退出，默认不勾选为直接退出",
      },
      appTheme: {
        title: "主题",
        value: "system",
        array: [
          {
            id: 0,
            value: "light",
            choice: "☀ 日间主题",
            fn: () => {
              this.handleChangeAppTheme("light");
            },
          },
          {
            id: 1,
            value: "dark",
            choice: "🌙 夜间主题",
            fn: () => {
              this.handleChangeAppTheme("dark");
            },
          },
          {
            id: 2,
            value: "system",
            choice: "❤ 跟随系统",
            fn: () => {
              this.handleChangeAppTheme("system");
            },
          },
        ],
        tip: "选择色彩主题以应对视觉疲劳和损伤",
      },
      settings: null,
    };
  },
  mounted() {
    this.$conf.getConfPromise().then((data) => {
      this.settings = data.data;
      this.appOnTop.value = this.settings.userSetting.alwaysOnTop;
      this.appCloseAction.value = this.settings.userSetting.alwaysCloseDirect;
      this.appTheme.value = this.settings.userSetting.colorSchemeMode;
    });
  },
  methods: {
    handleChangeAppOnTop: function () {
      if (this.isClickable) {
        this.isClickable = false;
        this.appOnTop.value = !this.appOnTop.value;

        if (this.appOnTop.value) ipcRenderer.send("setting-always-on-top");
        else ipcRenderer.send("setting-always-not-top");
        this.settings.userSetting.alwaysOnTop = this.appOnTop.value;
        this.handleChangeSettingAction();
      }
    },
    handleChangeCloseAction: function () {
      if (this.isClickable) {
        this.isClickable = false;
        this.appCloseAction.value = !this.appCloseAction.value;
        if (this.appCloseAction.value)
          this.$public.emit("update-header-need-close-direct", true);
        else this.$public.emit("update-header-need-close-direct", false);
        this.settings.userSetting.alwaysCloseDirect = this.appCloseAction.value;
        this.handleChangeSettingAction();
      }
    },
    handleChangeAppTheme: function (theme) {
      if (this.isClickable) {
        this.isClickable = false;
        this.appTheme.value = theme;
        ipcRenderer.send("color-schemeMode-" + theme);
        this.settings.userSetting.colorSchemeMode = this.appTheme.value;
        this.handleChangeSettingAction();
      }
    },
    handleChangeSettingProcess: function (err) {
      if (err)
        this.$public.emit("notice", {
          title: "保存时出现了一个错误",
          msg: err,
          type: "error",
          fn: () => {
            this.isClickable = true;
          },
        });
      else {
        this.$public.emit("notice", {
          title: "",
          msg: "设置保存成功 正在为您启用设置",
          type: "success",
          fn: () => {
            this.isClickable = true;
          },
        });
      }
    },
    handleChangeSettingAction: function () {
      this.$conf.updateLocalConfig(this.settings, (err) => {
        this.handleChangeSettingProcess(err);
      });
    },
  },
};
</script>

<style scoped>
.userSetting {
  @apply p-8;
}

@media (prefers-color-scheme: dark) {
  .userSetting {
    @apply bg-gray-700;
  }
}

@media (prefers-color-scheme: light) {
  .userSetting {
    @apply bg-white;
  }
}
</style>