<template>
  <div class="appMenuItem">
    <div
      v-show="type == 'operate' && !isFold"
      class="appMenuOption"
      @click="handleIpcSendMessage"
    >
      <a class="optionText">{{ label }}</a>
    </div>
    <div
      v-show="type == 'operate' && isFold"
      class="appMenuOption isFold"
      @click="handleIpcSendMessage"
    >
      <a class="optionText">{{ label }}</a>
      <span class="foldArrow"></span>
    </div>
    <div
      v-show="type == 'function'"
      class="appMenuOption"
      @click="handleFunctionsFromPrps"
    >
      <a class="optionText">{{ label }}</a>
    </div>
    <div v-show="type == 'divider'" class="appMenuOptionDivider"></div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "appMenuOption",
  props: {
    label: String,
    symbol: String,
    type: {
      type: String,
      default: null,
    },
    isFold: Boolean,
    func: String,
  },
  methods: {
    handleIpcSendMessage: function () {
      if (this.symbol) ipcRenderer.send(this.symbol);
    },
    handleFunctionsFromPrps: function () {
      if (this.func == "getAllUserFunction") {
        this.$axios.get("/api/user/getAllUser").then((res) => {
          console.log(res);
        });
      }
    },
  },
};
</script>

<style scoped>
.appMenuOption {
  @apply relative w-24 h-6 bg-gray-800 text-gray-300 text-xs my-px;
}

.appMenuOption a.optionText {
  @apply block w-full h-full pl-2.5;
  line-height: 1.5rem;
  transition: all ease-in-out 0.1s;
}

.appMenuOption a.optionText:hover {
  @apply bg-white bg-opacity-20;
}

.appMenuOptionDivider {
  @apply h-px bg-gray-600 -my-px;
}

span.foldArrow {
  @apply w-0 h-0 inline-block absolute right-0 z-10 top-1/2 box-border pointer-events-none;
  border-width: 4px 0 4px 7px;
  border-color: transparent transparent transparent rgba(209, 213, 219, 0.85);
  transform: translate(-100%, -50%);
}
</style>
