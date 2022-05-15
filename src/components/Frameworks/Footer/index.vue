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
    <div class="footTime showArea" v-show="currTime.isGetTime">
      <span class="h">{{ currTime.hour }} 时 </span>
      <span class="sp">{{ currTime.minutes }}</span>
      <span> 分</span>
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
        this.status == "Loading" || this.status == "loading"
          ? this.statusLightColor.loading
          : this.status == "Warn" || this.status == "warn"
          ? this.statusLightColor.warn
          : this.status == "Error" || this.status == "error"
          ? this.statusLightColor.error
          : this.status == "Success" || this.status == "success"
          ? this.statusLightColor.success
          : "transparent";
    },
  },
  mounted() {
    this.initTime();
  },
  data() {
    return {
      timer: null,
      statusLightColor: {
        warn: "rgb(240, 128, 76)",
        success: "rgb(27, 190, 68)",
        error: "rgb(185, 29, 29)",
        loading: "rgb(199, 233, 77)",
        real: "rgb(199, 233, 77)",
      },
      currTime: {
        hour: 25,
        minutes: 61,
        seconds: 61,
        isGetTime: false,
      },
    };
  },
  methods: {
    initTime: function () {
      var t = new Date().toTimeString().substring(0, 8);
      this.currTime.hour = parseInt(t.substring(0, 2));
      this.currTime.minutes = parseInt(t.substring(3, 5));
      this.currTime.seconds = parseInt(t.substring(6, 8));
      this.timer = setTimeout(() => {
        this.initTime();
      });
      this.currTime.isGetTime = true;
    },
  },
};
</script>

<style scoped lang="postcss">
.appViewFoot {
  @apply relative border-t box-border text-sm border-gray-400;
  width: calc(100vw - 2px);
  height: calc(1.5rem - 1px);
  line-height: calc(1.5rem - 1px);
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
  width: calc(100vw - 12.5rem);
}
.footTime {
  @apply absolute right-0 w-24 -top-px text-xs text-right px-3;
  height: calc(1.5rem + 1px);
  line-height: 1.5rem;
}
</style>

<style type="text/css">
.footStatusLight .light {
  --status-color: rgb(199, 233, 77);
  background-color: var(--status-color);
}
.footTime .sp {
  animation: secondFlash 1.95s ease-in-out infinite;
}

@keyframes secondFlash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>