<template>
    <div class="userDetailOption">
        <div class="titleContainer">
            <span class="opTitle">{{ opTitle }}</span>
        </div>
        <div class="opDetail">
            <div class="operateContainer" v-if="opType == 'tag'">
                <el-tag :disabled="opDisabled" @click="handleOpCallbackFn">{{ opTagValue }}</el-tag>
            </div>
            <div class="operateContainer" v-if="opType == 'tags'">
                <el-radio-group :model-value="opTouchValue" :disabled="opDisabled">
                    <el-radio
                        v-for="item in opTouchArray"
                        :key="item.id"
                        :label="item.value"
                        @click.prevent="item.fn"
                    >{{ item.choice }}</el-radio>
                </el-radio-group>
            </div>
            <div class="operateContainer" v-if="opType == 'input'">
                <el-tag v-show="!isInputEdit" @click="toggleInputEdit">{{ opInputBtnText }}</el-tag>
                <div class="opInput" v-show="isInputEdit">
                    <el-input
                        v-model="inputTempValue"
                        :placeholder="opInputPlaceholder"
                        @input="emitInputPropsToper('settingInput', this.inputTempValue)"
                    >
                        <template #append>
                            <el-button
                                @click="
                                emitInputPropsToper('inputChange', {
                                    name: this.opExtraValue,
                                    value: this.inputTempValue,
                                })
                                "
                            >{{ opBtnText }}</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button @click="cancelInputSubmitChange">取消</el-button>
                        </template>
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
        opTip: {
            type: String,
        },
        opBindValue: {
            type: [Boolean, String, Number],
        },
        opTagValue: {
            type: [Boolean, String, Number]
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
        handleOpCallbackFn: function () {
            if (!this.opDisabled)
                this.opCallbackFn()
        },
        cancelInputSubmitChange: function () {
            this.isInputEdit = !this.isInputEdit;
        },
        toggleInputEdit: function () {
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
    :deep(.el-radio) {
        @apply text-gray-300;
    }
    :deep(.el-tag) {
        @apply bg-gray-600 text-gray-200;
    }
}

@media (prefers-color-scheme: light) {
}
</style>
