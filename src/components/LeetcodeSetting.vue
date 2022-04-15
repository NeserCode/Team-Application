<template>
  <div class="leetcodeSetting" id="leetcodeSetting">
    <SettingOption
      opTitle="🍔 LeetCode Cookies"
      opType="input"
      opTip="有一说一，这些玩意儿是真他妈的难写"
      opInputBtnText="更改上次填写的Cookie值"
      opBtnText="更改保存"
      opInputPlaceholder="Cookie Here"
      :opBindValue="message"
      @settingInput="messageInput"
      @cookieChange="handleChangeLeetcodeCookie"
    />
  </div>
</template>

<script>
import SettingOption from "@/components/SettingOption.vue";
// const { ipcRenderer } = window.require("electron");

export default {
  name: "LeetcodeSetting",
  components: { SettingOption },
  data() {
    return {
      settings: null,
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
      try {
        var res = this.$leetcode.getLeetCodeSession(cookie),
          keys = Object.keys(res),
          vals = Object.values(res);
      } catch (error) {
        if (error)
          this.$public.emit("notice", {
            msg: "处理Cookie格式时出现了一个错误",
            type: "error",
          });
      }

      this.$leetcode
        .getCookie("https://leetcode-cn.com/graphql/")
        .then((res) => {
          for (let i = 0; i < keys.length; i++) {
            this.$leetcode.setCookie(
              "https://leetcode-cn.com/graphql/",
              keys[i],
              vals[i]
            );
          }
          console.log(res);
        });
    },
    handleChangeSettingProcess: function (err) {
      if (err)
        this.$public.emit("notice", {
          msg: "保存时出现了一个错误",
          type: "error",
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

<style scoped>
.leetcodeSetting {
  @apply p-8;
}

@media (prefers-color-scheme: dark) {
  .leetcodeSetting {
    @apply bg-gray-700;
  }
}

@media (prefers-color-scheme: light) {
  .leetcodeSetting {
    @apply bg-white;
  }
}
</style>