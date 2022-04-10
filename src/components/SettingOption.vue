<template>
  <div class="settingOption">
    <div class="titleContainer">
      <span class="opTitle">{{ opTitle }}</span>
    </div>
    <div class="opDetail">
      <div class="operateContainer" v-if="opType == 'switch'">
        <el-switch
          :disabled="opDisabled"
          :value="opBindValue"
          @click="opCallbackFn"
        ></el-switch>
      </div>
      <div class="operateContainer" v-if="opType == 'button'">
        <el-button :disabled="opDisabled" @click="opCallbackFn">{{
          opBtnValue
        }}</el-button>
      </div>
      <div class="operateContainer" v-if="opType == 'touch'">
        <el-radio-group :model-value="opTouchValue" :disabled="opDisabled">
          <el-radio
            v-for="item in opTouchArray"
            :key="item.id"
            :label="item.value"
            @click.prevent="item.fn"
            >{{ item.choice }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="tipContainer" v-if="opTip">
        <span class="opTip">{{ opTip }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingOption",
  mounted() {},
  props: {
    opTitle: {
      type: String,
      required: true,
    },
    opType: {
      type: String,
    },
    opTip: {
      type: String,
    },
    opBindValue: {
      type: Boolean || String || Number,
    },
    opTouchArray: {
      type: Array,
    },
    opTouchValue: {
      type: String || Number,
    },
    opBtnValue: {
      type: String || Number,
    },
    opCallbackFn: {
      type: Function,
    },
    opDisabled: {
      type: Boolean,
    },
  },
  model: {
    props: "opTouchValue",
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.settingOption {
  @apply relative inline-block mx-auto w-full h-full;
}

.titleContainer {
  @apply inline-block w-48 h-full min-h-full p-4;
}

.opDetail {
  @apply h-full;
  width: calc(100% - 12rem);
}

.operateContainer {
  @apply inline-block w-full h-4/5 p-4;
}

.tipContainer {
  @apply inline-block w-auto h-1/5;
}

span.opTitle {
  @apply font-semibold;
}

span.opTitle {
  @apply text-lg;
}

span.opTip {
  @apply inline-block text-gray-400 text-sm;
}

.titleContainer,
.opDetail,
.operateContainer,
.tipContainer {
  @apply float-left;
}

:deep.el-switch {
  @apply inline top-1/2 transform -translate-y-1/2;
}

@media screen and (max-width: 830px) {
  :deep.el-radio {
      @apply block my-2;
  }
}

@media (prefers-color-scheme: dark) {
    :deep.el-radio {
      @apply text-gray-300;
  }
}

@media (prefers-color-scheme: light) {
}
</style>
