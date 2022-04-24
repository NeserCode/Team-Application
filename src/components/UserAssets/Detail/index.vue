<template>
    <div class="userDetail">
        <div class="userInfo">
            <UserAssets center :isUserImageRound="true" />
            <userDetailOption
                opTitle="性别"
                opType="tag"
                opTagValue="man"
                :opDisabled="false"
                :opCallbackFn="handleLog"
            />
            <userDetailOption
                opTitle="认证"
                opType="tags"
                :opDisabled="false"
                :opTagArray="accessArr"
            />
        </div>
        <el-button class="clearLoginBtn" type="danger" @click="isConfirmOut = true">清除登录状态</el-button>
        <el-dialog v-model="isConfirmOut" title="注意" width="30%" center>
            <span>请确认登出当前账号？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isConfirmOut = false">取消</el-button>
                    <el-button type="primary" @click="handleSignOut">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
// @ is an alias to /src
import UserAssets from "@/components/UserAssets/index.vue";
import userDetailOption from "@/components/UserAssets/Detail/Option/index.vue"

export default {
    name: "userDetail",
    components: { UserAssets, userDetailOption },
    computed: {
        accessStatusText() {
            return `${this.accessOgz.access ? '未' : '已'}认证`
        }
    },
    data() {
        return {
            isConfirmOut: false,
            accessOgz: {
                access: false,
                ogz: "",
                position: ""
            },
            accessArr: [
                {
                    id: 1,
                    value: "nidie",
                    fn: () => {
                        this.handleLog('access')
                    }
                }
            ]
        };
    },
    mounted() {
        this.$public.on("update-main-user-info-upto-app", (res) => {
            console.log(res);
        });
        this.$conf.getConfPromise().then((data) => {
            console.log(data);
        });
    },
    methods: {
        handleLog: function (msg) {
            console.log(msg);
        },
        handleSignOut: function () {
            this.$public.emit("clear-user-sign-status");
            this.isConfirmOut = false
        },
    },
};
</script>

<style scoped>
.userDetail {
    @apply my-0;
}
.settingOption {
    @apply h-16 w-full mx-auto py-4 select-none;
    line-height: 2rem;
}
.preText {
    @apply block float-left w-48 h-full text-base;
    text-indent: 5ch;
    line-height: 2rem;
}
.userZone {
    @apply h-full text-center py-12 relative mb-2;
}
.userZone .username {
    @apply w-48 h-12 block text-center text-lg mx-auto pt-4 transform translate-x-3.5 font-light;
    font-family: Canger_xwz;
}
.userZone .userRename {
    @apply w-80 h-12 mx-auto pt-4;
}
.el-icon-edit {
    @apply ml-2;
}
.renameInput {
    @apply float-left w-52;
}
.renameBtn {
    @apply float-left mx-2;
}
span.realname {
    @apply block absolute left-1/2 bottom-3 text-gray-500 transform -translate-x-1/2;
}
span.realname .text {
    font-family: Helvetica_otf;
    letter-spacing: 0.15ch;
}
span.introduce {
    @apply block font-light text-center text-3xl mb-4 px-44;
    font-family: Canger_zkzdbs;
}
.userInfo {
    @apply mb-8 pb-6;
}
.settingOption .submitBtn {
    @apply block w-24 mx-auto;
}
.submitContainer {
    @apply py-16;
}
.boundContainer {
    @apply h-24;
}
.boundItem {
    @apply block w-full h-12;
}

.selectable {
    @apply select-text mx-0.5;
}

.clearLoginBtn {
    @apply block mx-auto my-16;
}

@media (prefers-color-scheme: dark) {
    .el-tag {
        @apply bg-gray-700 text-gray-200;
    }
}

@media (prefers-color-scheme: light) {
}
</style>
