<template>
  <div class="signInput">
    <input
      :type="iType"
      :id="iLable"
      v-model="iTemp"
      @input="handleInput"
      class="iBody"
      spellcheck="false"
      placeholder=" "
    />
    <label :for="iLable" class="iLBody">{{ iPreText }}</label>
    <span class="iTip" v-if="iTip">{{ iTip }}</span>
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
    };
  },
  mounted() {},
  methods: {
    handleInput: function () {
      this.$emit("keep-input", this.iTemp);
    },
  },
};
</script>

<style scoped>
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
</style>
