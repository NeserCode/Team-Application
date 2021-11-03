<template>
  <div class="appViewFoot">
    <div class="footStatusLight showArea">
      <div
        class="light"
        :style="{ '--status-color': `${statusLightColor.real}` }"
      ></div>
      <div class="afterStatusText">
        <span>{{ status }}</span>
      </div>
    </div>
    <div class="footStatusText showArea">
      <span>{{ statusText }}</span>
    </div>
  </div>
</template>

<script>
// const { ipcRenderer } = window.require("electron");
// let path = require('path')
// const fse = window.require('fs-extra')
// const fs = window.require('fs')handleHoverColorChange

export default {
  name: "appViewFoot",
  props: {
    status: String,
    statusText: String,
  },
  watch: {
    status() {
      this.statusLightColor.real =
        this.status == "Loading"
          ? this.statusLightColor.loading
          : this.status == "Warn"
          ? this.statusLightColor.warn
          : this.status == "Error"
          ? this.statusLightColor.error
          : this.status == "Success"
          ? this.statusLightColor.success
          : "transparent";
    },
  },
  data() {
    return {
      statusLightColor: {
        warn: "rgb(240, 128, 76)",
        success: "rgb(27, 190, 68)",
        error: "rgb(185, 29, 29)",
        loading: "rgb(199, 233, 77)",
        real: "rgb(199, 233, 77)",
      },
    };
  },
  methods: {},
};
</script>

<style scoped>
.appViewFoot {
  @apply border-t box-border fixed bottom-px text-sm z-50 border-gray-400;
  width: calc(100vw - 2px);
  height: calc(1.5rem + 1px);
  line-height: 1.5rem;
}
.footStatusLight {
  @apply float-left border-r h-full border-gray-400;
}
.footStatusLight .light {
  @apply float-left w-3 h-3 m-1.5 rounded-full border border-gray-400 box-border;
}
.footStatusLight .afterStatusText {
  @apply float-left mx-2 w-16;
}
.footStatusText {
  @apply relative px-3 overflow-ellipsis whitespace-nowrap overflow-hidden;
  width: calc(100vw - 8.5rem);
}
</style>

<style type="text/css">
.footStatusLight .light {
  --status-color: rgb(199, 233, 77);
  background-color: var(--status-color);
}
</style>