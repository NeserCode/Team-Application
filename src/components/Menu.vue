<template>
  <div class="appMenu" v-show="isMenuShow">
    <div
      class="appMenuItemContainer"
      v-for="(item, index) in appMenuContent"
      :key="index"
      v-show="isMenuShow"
      :class="item.type == 'divider' ? 'appMenuOptionDivider' : 'notDivider'"
    >
      <appMenuOption
        :label="item.label"
        :type="item.type"
        :symbol="item.symbol"
        :isFold="item.isFold"
        :func="item.func"
        @mouseenter="handleUnfoldSonMenu(index)"
        @mouseleave="handleFoldSonMenu(index)"
      >
      </appMenuOption>
      <appMenuOption
        class="son"
        v-show="isSonUnfold[index]"
        v-for="(inner, sIndex) in appMenuContent[index].son"
        :key="sIndex"
        :label="inner.label"
        :type="inner.type"
        :symbol="inner.symbol"
        :isFold="inner.isFold"
        :func="item.func"
        @mouseenter="handleUnfoldSonMenu(index)"
        @mouseleave="handleFoldSonMenu(index)"
      >
      </appMenuOption>
    </div>
  </div>
</template>

<script>
import appMenuOption from "@/components/MenuOption.vue";
// const { ipcRenderer } = window.require("electron");
export default {
  name: "appMenu",
  components: {
    appMenuOption,
  },
  props: {
    appMenuContent: Array,
    isMenuShow: Boolean,
  },
  data() {
    return {
      isSonUnfold: [],
    };
  },
  mounted() {},
  methods: {
    handleUnfoldSonMenu: function (index) {
      this.isSonUnfold[index] = true;
    },
    handleFoldSonMenu: function (index) {
      this.isSonUnfold[index] = false;
    },
  },
};
</script>

<style scoped>
.appMenu {
  @apply w-24 top-8 fixed z-20 bg-gray-800 py-1;
  right: 7.5rem;
}
.appMenuItemContainer {
  @apply h-6 bg-gray-800 py-0 m-0;
}
.appMenuOptionDivider {
  @apply h-px bg-gray-600 my-px;
}

.son {
  @apply relative left-24 pl-px -top-6;
}
</style>
