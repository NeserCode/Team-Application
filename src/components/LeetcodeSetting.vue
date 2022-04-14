<template>
  <div class="leetcodeSetting" id="leetcodeSetting">
    <SettingOption
      opTitle="🍔 LeetCode Cookies"
      opType="input"
      opTip="有一说一，这些玩意儿是真他妈的难写"
      opInputBtnText="更改上次填写的Cookie值"
      :opBindValue="message"
      @settingInput="messageInput"
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
      message: "Leetcode Cookies Here!",
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
    handleChangeSettingProcess: function (err) {
      if (err)
        this.$public.emit("notice", {
          title: "保存时出现了一个错误",
          msg: err,
          type: "error",
          closefunc: () => {
            this.isClickable = true;
          },
        });
      else {
        this.$public.emit("notice", {
          title: "",
          msg: "设置保存成功 正在为您启用设置",
          type: "success",
          closefunc: () => {
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