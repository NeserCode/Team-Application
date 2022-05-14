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
          opBtnText
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
      <div class="operateContainer" v-if="opType == 'input'">
        <el-tag v-show="!isInputEdit" @click="handleInputEdit">{{
          opInputBtnText
        }}</el-tag>
        <div class="opInput" v-show="isInputEdit">
          <el-input
            v-model="inputTempValue"
            :placeholder="opInputPlaceholder"
            @input="emitInputPropsToper('settingInput', this.inputTempValue)"
          >
            <template #append
              ><el-button
                @click="
                  emitInputPropsToper('cookieChange', {
                    name: this.opExtraValue,
                    value: this.inputTempValue,
                  })
                "
                >{{ opBtnText ?? "确认" }}</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button @click="cancelInputEdit">取消</el-button></template
            >
          </el-input>
        </div>
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
  mounted() {
    this.initOption();
  },
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
      type: [Boolean, String, Number],
    },
    opInputBtnText: {
      type: [String, Number],
    },
    opInputPlaceholder: {
      type: [String, Number],
    },
    opTouchArray: {
      type: Array,
    },
    opTouchValue: {
      type: [String, Number],
    },
    opBtnText: {
      type: [String, Number],
    },
    opCallbackFn: {
      type: Function,
    },
    opDisabled: {
      type: Boolean,
    },
    opExtraValue: {
      type: [String, Array, Boolean, Number, Set, Symbol],
    },
  },
  data() {
    return {
      inputTempValue: "",
      isInputEdit: false,
    };
  },
  methods: {
    emitInputPropsToper: function (name, value) {
      this.$emit(name, value);
    },
    handleInputEdit: function () {
      this.$public.emit("opInputEditFinish");
      this.isInputEdit = !this.isInputEdit;
    },
    cancelInputEdit: function () {
      this.isInputEdit = !this.isInputEdit;
    },
    initOption: function () {
      this.$public.on("opInputEditFinish", () => {
        this.isInputEdit = false;
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.settingOption {
  @apply relative inline-block mx-auto w-full h-full border-l-2;
  transition: all ease-in-out 0.2s;
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

:deep(.el-switch) {
  @apply inline top-1/2 transform -translate-y-1/2;
}

@media screen and (max-width: 830px) {
  :deep.el-radio {
    @apply block my-2;
  }
}

@media (prefers-color-scheme: dark) {
  .settingOption {
    @apply border-gray-700;
  }
  .settingOption:hover {
    @apply border-blue-300;
  }
  :deep(.el-radio) {
    @apply text-gray-300;
  }
  :deep(.el-tag),
  :deep(.el-button),
  :deep(.el-input__inner),
  :deep(.el-input-group__append) {
    @apply bg-gray-600 text-gray-200;
  }
}

@media (prefers-color-scheme: light) {
  .settingOption:hover {
    @apply border-green-300;
  }
}
</style>
