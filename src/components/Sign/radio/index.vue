<template>
  <div class="signRadio">
    <label class="rPt" :for="rPreText">{{ rPreText }}</label>
    <input type="checkbox" tabindex="0" class="rHBody" :id="rPreText" />
    <el-radio-group class="rgBody" v-model="rTemp">
      <el-radio
        v-for="(item, index) in rList"
        :key="item.id"
        :label="item.label"
        @change="handleChange(index)"
        >{{ item.choice }}</el-radio
      >
    </el-radio-group>
    <span ref="rTip" class="rTip" v-if="rTip">{{ rTip }}</span>
  </div>
</template>

<script>
export default {
  name: "signRadio",
  props: {
    rPreText: {
      type: String,
      required: true,
    },
    rTip: {
      type: String,
    },
    rModel: {
      type: [String, Number, Boolean],
    },
    rList: {
      type: Array,
    },
  },
  watch: {
    rModel: {
      handler(val) {
        this.rTemp = val;
      },
      immediate: true,
    },
  },
  data() {
    return {
      rTemp: "",
    };
  },
  mounted() {},
  methods: {
    handleChange(index) {
      this.$emit("keep-change", this.rList[index].label);
    },
  },
};
</script>

<style scoped lang="postcss">
.signRadio {
  @apply relative w-full h-full text-right pl-2 pr-4;
}
.rPt {
  @apply inline-block text-lg w-full text-left;
}
.rTip {
  @apply inline-block w-full text-center text-xs pt-2 opacity-0;
  transition: all ease-in-out 0.35s;
}
.rgBody {
  @apply transform;
}
.rHBody {
  @apply absolute opacity-0;
}
.rHBody:focus ~ .rgBody > .el-radio.is-checked::after {
  @apply transition-all;
  animation: fade ease-in-out 1.2s infinite;
}
.rHBody:focus ~ .rTip {
  @apply opacity-50;
}

.el-radio.is-checked::after {
  content: " ";
  @apply inline-block w-full h-px absolute -bottom-1 left-0 bg-blue-400;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}

@keyframes fade {
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
