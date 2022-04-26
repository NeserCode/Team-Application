<template>
  <div class="userDetailOption">
    <div class="titleContainer">
      <span class="opTitle">{{ opTitle }}</span>
    </div>
    <div class="opDetail">
      <div class="operateContainer" v-if="opType == 'tag' && !opTagEditable">
        <el-tag @click="handleOpCallbackFn">{{ opTagValue }}</el-tag>
      </div>
      <div
        class="operateContainer"
        v-if="opType == 'tag' && opTagEditable == 'input'"
      >
        <el-tag v-show="!isInputEdit" @click="handleOpEdit"
          ><span>{{ opTagValue }}</span
          >&nbsp; <i class="el-icon-edit"></i
        ></el-tag>
        <el-input
          v-show="isInputEdit"
          v-model="inputTempValue"
          @input="handleOpInput"
        >
          <template #append
            ><el-button @click="handleOpEmit">{{
              opBtnText ?? "确认"
            }}</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="toggleInputEdit">取消</el-button></template
          >
        </el-input>
      </div>
      <div
        class="operateContainer"
        v-if="opType == 'tag' && opTagEditable == 'radio'"
      >
        <el-tag v-show="!isRadioEdit" @click="handleOpEdit"
          ><span>{{ opTagValue }}</span
          >&nbsp; <i class="el-icon-edit"></i
        ></el-tag>
        <el-radio-group v-show="isRadioEdit" :model-value="opExtraValue">
          <el-radio
            v-for="item in opRadioArray"
            :key="item.id"
            :label="item.value"
            @click="item.fn"
            >{{ item.choice }}</el-radio
          >
          <el-divider direction="vertical"></el-divider>
          <el-button @click="toggleRadioEdit">取消</el-button>
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
  name: "userDetailOption",
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
    opTagEditable: {
      type: String,
      defalut: "input",
    },
    opTip: {
      type: String,
    },
    opTagValue: {
      type: [Boolean, String, Number],
    },
    opRadioArray: {
      type: Array,
    },
    opBtnText: {
      type: String,
    },
    opEmitName: {
      type: String,
    },
    opCallbackFn: {
      type: Function,
    },
    opDisabled: {
      type: Boolean,
      defalut: false,
    },
    opExtraValue: {
      type: [String, Array, Boolean, Number, Set, Symbol],
    },
  },
  data() {
    return {
      isInputEdit: false,
      isRadioEdit: false,
      inputTempValue: "",
    };
  },
  methods: {
    handleOpCallbackFn: function () {
      if (!this.opDisabled && this.opCallbackFn) this.opCallbackFn();
    },
    handleOpEdit: function () {
      this.$public.emit("opInputEditFinish");
      this.toggleInputEdit();
      this.toggleRadioEdit();
    },
    toggleInputEdit: function () {
      this.isInputEdit = !this.isInputEdit;
    },
    toggleRadioEdit: function () {
      this.isRadioEdit = !this.isRadioEdit;
    },
    handleOpEmit: function () {
      let name = this.opEmitName;

      this.$emit(name, {
        name: this.opExtraValue,
        value: this.inputTempValue,
      });
    },
    handleOpInput: function () {
      this.$emit("emitInput", this.inputTempValue);
    },
    initOption: function () {
      this.$public.on("opInputEditFinish", () => {
        this.isInputEdit = false;
        this.isRadioEdit = false;
        this.inputTempValue = "";
      });
    },
  },
};
</script>

<style scoped>
.userDetailOption {
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
  @apply inline-block text-gray-400 text-xs;
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
}
</style>
