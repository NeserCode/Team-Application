<template>
  <div class="appViewHead">
    <div class="headDargArea">
      <img class="logo" src="../assets/logo.png" />
      <span class="titleFromProp">{{ title }}</span>
    </div>
    <div class="headOpArea">
      <div class="menu option" @click="handleSwitchMenu">
        <a v-show="!isAppMenuOpen"
          ><svg
            t="1634438471581"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3995"
            :width="headIconSize + 2"
            :height="headIconSize + 2"
          >
            <path
              d="M806.4 319.2L512 613.6 221.6 323.2 176 368l290.4 290.4L512 704l45.6-45.6 294.4-294.4z"
              p-id="3996"
              :fill="headIconFill.normal"
            ></path></svg
        ></a>
        <a v-show="isAppMenuOpen"
          ><svg
            t="1634438615544"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4196"
            :width="headIconSize + 2"
            :height="headIconSize + 2"
          >
            <path
              d="M852 660L557.6 365.6 512 320l-45.6 45.6L176 656l45.6 44.8L512 410.4l294.4 294.4z"
              p-id="4197"
              :fill="headIconFill.normal"
            ></path></svg
        ></a>
      </div>
      <div class="minimize option" @click="handleMinimizeWindow">
        <a
          ><svg
            t="1634436877401"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3418"
            :width="headIconSize"
            :height="headIconSize"
          >
            <path
              d="M96 768h832c17.673 0 32 14.327 32 32s-14.327 32-32 32H96c-17.673 0-32-14.327-32-32s14.327-32 32-32z"
              p-id="3419"
              :fill="headIconFill.normal"
            ></path></svg
        ></a>
      </div>
      <div class="maximize option" @click="handleMaximizeWindow">
        <a v-show="!isAppFullScreen"
          ><svg
            t="1634294452726"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6288"
            :width="headIconSize"
            :height="headIconSize"
          >
            <path
              d="M339.432 63.594H99.944c-19.851 0-36 16.149-36 36v239.488c0 17.673 14.327 32 32 32s32-14.327 32-32V127.594h211.487c17.673 0 32-14.327 32-32 0.001-17.673-14.326-32-31.999-32zM339.432 895.503H127.944V684.016c0-17.673-14.327-32-32-32s-32 14.327-32 32v239.487c0 19.851 16.149 36 36 36h239.487c17.673 0 32-14.327 32-32s-14.326-32-31.999-32zM928 651.915c-17.673 0-32 14.327-32 32v211.487H684.513c-17.673 0-32 14.327-32 32s14.327 32 32 32H924c19.851 0 36-16.149 36-36V683.915c0-17.673-14.327-32-32-32zM924 64.151H684.513c-17.673 0-32 14.327-32 32s14.327 32 32 32H896v211.488c0 17.673 14.327 32 32 32s32-14.327 32-32V100.151c0-19.851-16.149-36-36-36z"
              :fill="headIconFill.normal"
              p-id="6289"
            ></path></svg
        ></a>
        <a v-show="isAppFullScreen"
          ><svg
            t="1634294204682"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5604"
            :width="headIconSize"
            :height="headIconSize"
          >
            <path
              d="M95.944 371.082h239.487c19.851 0 36-16.149 36-36V95.594c0-17.673-14.327-32-32-32s-32 14.327-32 32v211.488H95.944c-17.673 0-32 14.327-32 32 0 17.672 14.327 32 32 32zM95.944 716.016h211.487v211.487c0 17.673 14.327 32 32 32s32-14.327 32-32V688.016c0-19.851-16.149-36-36-36H95.944c-17.673 0-32 14.327-32 32s14.327 32 32 32zM684.513 959.402c17.673 0 32-14.327 32-32V715.915H928c17.673 0 32-14.327 32-32s-14.327-32-32-32H688.513c-19.851 0-36 16.149-36 36v239.487c0 17.673 14.327 32 32 32zM688.513 371.639H928c17.673 0 32-14.327 32-32s-14.327-32-32-32H716.513V96.151c0-17.673-14.327-32-32-32s-32 14.327-32 32v239.488c0 19.85 16.149 36 36 36z"
              :fill="headIconFill.normal"
              p-id="5605"
            ></path>
          </svg>
        </a>
      </div>
      <div
        class="close option"
        @click="handleCloseWindow(needs.isSettingCloseDirect)"
      >
        <a
          ><svg
            t="1634297261959"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1584"
            :width="headIconSize"
            :height="headIconSize"
          >
            <path
              d="M544.448 499.2l284.576-284.576a32 32 0 0 0-45.248-45.248L499.2 453.952 214.624 169.376a32 32 0 0 0-45.248 45.248l284.576 284.576-284.576 284.576a32 32 0 0 0 45.248 45.248l284.576-284.576 284.576 284.576a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0-45.248L544.448 499.2z"
              p-id="1585"
              :fill="headIconFill.normal"
            ></path></svg
        ></a>
      </div>
    </div>
    <appMenu
      :isMenuShow="isAppMenuOpen"
      :appMenuContent="appMenuTemplate"
      @mouseleave="handleMenuMouseEvent"
    ></appMenu>
  </div>
</template>

<script>
import appMenu from "@/components/Menu.vue";
const { ipcRenderer } = window.require("electron");

export default {
  name: "appViewHead",
  props: {
    title: String,
    needs: {
      type: Object,
      default: () => ({
        isSettingCloseDirect: false,
      }),
    },
    appMenuTemplate: {
      type: Array,
      default: () => [
        {
          label: "GetAllUsers",
          type: "function",
          symbol: null,
          isFold: false,
          func: 'getAllUserFunction',
          son: [],
        },
        {
          label: null,
          type: "divider",
          symbol: null,
          isFold: false,
          son: [],
        },
        {
          label: "Window",
          type: "operate",
          symbol: "window-max",
          isFold: true,
          son: [
            {
              label: "Minimize",
              type: "operate",
              symbol: "window-min",
              isFold: false,
              son: [],
            },
            {
              label: null,
              type: "divider",
              symbol: null,
              isFold: false,
              son: [],
            },
            {
              label: "Maximize",
              type: "operate",
              symbol: "window-max",
              isFold: false,
              son: [],
            },
          ],
        },
      ],
    },
  },
  components: {
    appMenu,
  },
  beforeCreate() {
    ipcRenderer.on("main-window-max", () => (this.isAppFullScreen = true));
    ipcRenderer.on("main-window-unmax", () => (this.isAppFullScreen = false));
    ipcRenderer.on("log-message", (event, arg) => console.log(arg));
  },
  data() {
    return {
      isAppFullScreen: false,
      isAppMenuOpen: false,
      headIconFill: {
        normal: "#ccc",
        confirm: "#fff",
      },
      headIconSize: 15,
    };
  },
  methods: {
    // initComponent: function () {},
    handleMinimizeWindow: function () {
      ipcRenderer.send("window-min");
    },
    handleMaximizeWindow: function () {
      ipcRenderer.send("window-max");
      this.isAppFullScreen = !this.isAppFullScreen;
    },
    handleCloseWindow: function (isCloseDirect) {
      if (!isCloseDirect) ipcRenderer.send("hide-in-bar");
      else ipcRenderer.send("window-close");
    },
    handleSwitchMenu: function () {
      this.isAppMenuOpen = !this.isAppMenuOpen;
    },
    handleMenuMouseEvent: function () {
      this.isAppMenuOpen = false;
    },
  },
};
</script>

<style scoped>
.appViewHead {
  @apply w-full h-8  relative;
}
.headDargArea {
  @apply h-8 absolute left-0 text-center;
}
.headDargArea .logo {
  @apply w-4 m-2 block float-left;
}
.headDargArea .titleFromProp {
  @apply block float-left h-8 pl-28 text-sm overflow-hidden;
  width: calc(100vw - 12rem);
  line-height: 2rem;
}
.headOpArea {
  @apply h-8 absolute right-0;
}
.headOpArea .option {
  @apply float-left;
}
.headOpArea .option a {
  @apply block h-7 w-10 px-3 py-2;
}
.headOpArea .option a:hover {
  @apply bg-opacity-20 bg-white;
}
.headOpArea .option a:hover svg path {
  fill: white;
}
.headOpArea .option.close a:hover {
  @apply bg-red-600;
}
</style>

<style>
.headDargArea {
  -webkit-app-region: drag;
}
</style>
