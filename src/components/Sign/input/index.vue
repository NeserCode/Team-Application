<template>
  <div class="signInput">
    <input
      ref="iBody"
      :type="iType"
      :id="iLable"
      v-model="iTemp"
      @input="handleInput"
      @keyup="handlePressCaps"
      class="iBody"
      spellcheck="false"
      placeholder=" "
    />
    <label ref="iLBody" :for="iLable" class="iLBody"
      >{{ iPreText }} <span>{{ iCheck ? "√ 合法" : "× 非法" }}</span></label
    >
    <span ref="iTip" class="iTip" v-if="iTip">{{ iTip }}</span>
  </div>
</template>

<script>
export default {
  name: "signInput",
  props: {
    iType: {
      type: String,
      default: "text",
    },
    iLable: {
      type: String,
      required: true,
    },
    iCheck: {
      type: Boolean,
      default: true,
    },
    iPreText: {
      type: String,
      required: true,
    },
    iTip: {
      type: String,
    },
    iModel: {
      type: [String, Number, Boolean],
    },
  },
  watch: {
    iModel(val) {
      this.iTemp = val;
    },
  },
  data() {
    return {
      iTemp: "",
      iTimer: null,
      isCapsUp: false,
    };
  },
  mounted() {},
  methods: {
    handleInput: function () {
      this.$emit("keep-input", this.iTemp);
    },
    handleShakeInput: function () {
      if (this.iTimer) clearTimeout(this.iTimer);
      this.$refs.iBody.classList.add("shake");
      this.$refs.iBody.focus();
      this.iTimer = setTimeout(() => {
        this.$refs.iBody.classList.remove("shake");
      }, 400);
    },
    handlePressCaps: function (e) {
      if (e.keyCode == 20)
        if (!this.isCapsUp) {
          this.isCapsUp = true;
          this.$public.emit("notice", {
            msg: "请注意，您按下了大写锁定",
            fn: () => {
              this.isCapsUp = false;
            },
          });
        }
    },
  },
};
</script>

<style scoped lang="postcss">
.signInput {
  @apply relative w-full h-full;
}
.iBody {
  @apply outline-none h-full w-full text-lg px-2 py-1.5 bg-transparent border-b-2
   border-gray-600 transition-all;
}
.iLBody {
  @apply absolute inline-block w-auto left-0 top-0 px-2 py-1 text-lg transition-all;
}
.iLBody span {
  @apply inline-block px-3 opacity-0 text-xs;
}
.iTip {
  @apply inline-block w-full text-center text-xs opacity-0 pt-2;
  transition: ease-in-out 0.35s;
}

input:focus ~ .iTip {
  @apply font-semibold opacity-50;
}

.iBody.shake {
  animation: iShake 0.4s ease-in-out;
}

.iLBody::before {
  content: ">";
  animation: fade ease-in-out 1.2s infinite;
  @apply px-1 hidden;
}

label {
  @apply transition-all;
}
input:focus {
  @apply font-semibold caret-transparent;
}
input:focus + .iLBody::before,
input:active + .iLBody::before {
  @apply inline-block;
}
input:not(:placeholder-shown):focus {
  @apply transform translate-x-2;
}
input:not(:placeholder-shown):not(:focus) {
  @apply transform translate-x-0;
}
input:not(:placeholder-shown):focus + label {
  @apply font-semibold opacity-100 transform -translate-y-full;
}
input:not(:placeholder-shown):not(:focus) + label {
  @apply opacity-100 transform -translate-y-full;
}
input:not(:placeholder-shown):focus + .iLBody span {
  @apply opacity-50;
}
@media (prefers-color-scheme: dark) {
  .iLBody {
    @apply text-gray-500;
  }
  .iBody:not(:focus) {
    @apply text-gray-500 border-gray-500;
  }
  input:focus {
    @apply border-green-400;
  }
  input:focus + label {
    @apply text-gray-200;
  }
}

@media (prefers-color-scheme: light) {
  .iLBody {
    @apply text-gray-400;
  }
  .iBody:not(:focus) {
    @apply text-gray-500 border-gray-500;
  }
  input:focus {
    @apply border-purple-400;
  }
  input:focus + label {
    @apply text-gray-600;
  }
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

@keyframes iShake {
  0% {
    transform: translateX(0.5rem);
  }
  25% {
    transform: translateX(-0.5rem);
  }
  50% {
    transform: translateX(0.5rem);
  }
  75% {
    transform: translateX(-1rem);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
