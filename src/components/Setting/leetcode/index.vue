<template>
  <div class="leetcodeSetting">
    <SettingOption
      opTitle="Leetcode_Session Cookie项"
      opType="input"
      opTip="LEETCODE_SESSION"
      opInputBtnText="更改上次填写的Cookie值"
      opBtnText="更改保存"
      opInputPlaceholder="Cookie Here"
      opExtraValue="LEETCODE_SESSION"
      :opDisabled="isDisabled"
      :opBindValue="message"
      @settingInput="messageInput"
      @cookieChange="handleChangeLeetcodeCookie"
    />
    <SettingOption
      opTitle="X-CsrfToken Cookie项"
      opType="input"
      opTip="X-CSRFTOKEN"
      opExtraValue="x-csrftoken"
      opInputBtnText="更改上次填写的Cookie值"
      opBtnText="更改保存"
      opInputPlaceholder="Cookie Here"
      :opDisabled="isDisabled"
      :opBindValue="message"
      @settingInput="messageInput"
      @cookieChange="handleChangeLeetcodeCookie"
    />
  </div>
</template>

<script>
import SettingOption from "@/components/Setting/option/index.vue";
// const { ipcRenderer } = window.require("electron");

export default {
  name: "LeetcodeSetting",
  components: { SettingOption },
  data() {
    return {
      settings: null,
      isDisabled: false,
      message: "",
    };
  },
  mounted() {
    this.$conf.getConfPromise().then((data) => {
      this.settings = data.data;
    });
  },
  methods: {
    messageInput: function (temp) {
      this.message = temp;
    },
    handleChangeLeetcodeCookie: function (cookie) {
      this.$leetcode
        .setCookie(
          "https://leetcode-cn.com/graphql/",
          cookie.name,
          cookie.value
        )
        .then(() => {
          this.isDisabled = true;
          this.settings.userAccount.cookie_leetcode[cookie.name] = cookie.value;
          this.handleChangeSettingAction();
          this.$public.emit("opInputEditFinish");
        });
    },
    handleChangeSettingProcess: function (err) {
      if (err)
        this.$public.emit("notice", {
          msg: "保存时出现了一个错误",
          type: "error",
          fn: () => {
            this.isDisabled = false;
          },
        });
      else {
        this.$public.emit("notice", {
          msg: "设置保存成功 正在为您启用设置",
          type: "success",
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

<style scoped lang="postcss">
.leetcodeSetting {
  @apply py-8;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>