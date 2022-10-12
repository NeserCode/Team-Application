<template>
  <div class="about">
    <SettingOption
      opTitle="关于作者"
      opType="button"
      opTip="前往 GitHub 查看作者"
      opBtnText="前往"
      :opDisabled="isDisabled"
      :opCallbackFn="goForAuthor"
    />
    <SettingOption
      opTitle="关于本软件"
      opType="button"
      opTip="前往 GitHub 查看本项目 本项目遵循 GUN3.0 协议"
      opBtnText="前往"
      :opDisabled="isDisabled"
      :opCallbackFn="goForSoftware"
    />
  </div>
</template>

<script>
import SettingOption from "@/components/Setting/option/index.vue";
import { ipcRenderer } from "electron";

export default {
  name: "About",
  components: { SettingOption },
  data() {
    return {
      isDisabled: false,
    };
  },
  mounted() {},
  beforeMount() {},
  methods: {
    goForAuthor: function () {
      ipcRenderer.send("open-link-extra", "https://github.com/NeserCode");
    },
    goForSoftware: function () {
      ipcRenderer.send(
        "open-link-extra",
        "https://github.com/NeserCode/Team-Application"
      );
    },
  },
};
</script>

<style scoped lang="postcss">
.about {
  @apply py-8;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>