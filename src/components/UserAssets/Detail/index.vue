<template>
    <div class="userDetail">
        <div class="userInfo">
            <div class="settingOption userZone">
                <UserAssets center :isUserImageRound="true" />
                <div class="userRename" v-show="isUserRename">
                    <el-input
                        @keyup.enter="handleUserRename"
                        class="renameInput"
                        maxlength="10"
                        show-word-limit
                        v-model="usernameWrite"
                        :disabled="isUserRenaming"
                    ></el-input>
                    <el-button
                        :disabled="isUserRenaming"
                        @click="handleUserRename"
                        class="renameBtn"
                    >
                        <span v-show="isUserRename && !isUserRenaming">完成</span>
                        <i v-show="isUserRename && isUserRenaming" class="el-icon-loading"></i>
                    </el-button>
                </div>
                <span v-show="!isUserRename" class="username">
                    {{ settings.userInfo.nickname ?? "(无名氏)" }}
                    <i
                        @click="handleUserRename"
                        class="el-icon-edit"
                    ></i>
                </span>
                <span class="realname" v-show="!isUserRename">
                    用户名 |
                    <span class="text">{{ settings.userInfo.name }}</span>
                </span>
            </div>
            <span class="introduce selectable">{{ settings.userInfo.introduce ?? "(这家伙啥也没有写下来)" }}</span>
            <userDetailOption
                opTitle="性别"
                opType="tag"
                :opTagValue="userSex"
                :opDisabled="false"
                :opCallbackFn="handleLog"
            />
            <div class="settingOption">
                <span class="preText">性别</span>
                <el-tag>{{ userSex }}</el-tag>
            </div>
            <div class="settingOption">
                <span class="preText">认证</span>
                <el-tag>{{ settings.userInfo.access ? "已认证" : "未认证" }}</el-tag>
                <el-divider direction="vertical"></el-divider>
                <el-tag>
                    {{ settings.userInfo.orgnization ?? "暂无组织" }}
                    {{ settings.userInfo.orPosition ?? "暂无职位" }}
                </el-tag>
            </div>
            <div class="settingOption">
                <span class="preText">用户键值</span>
                <el-tag>
                    <span>{{ settings.userInfo.value ?? "User" }}</span>
                </el-tag>
                <el-divider direction="vertical"></el-divider>
                <el-tag>
                    <i class="el-icon-key"></i>
                    <span class="selectable">{{ settings.userInfo.key ?? "Warn: No_Such_Key" }}</span>
                </el-tag>
            </div>
            <div class="settingOption">
                <span class="preText">绑定</span>
                <el-tag @click="handleUserBound">{{ settings.userInfo.bound ?? "Email 未绑定" }}</el-tag>
            </div>
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
const fs = window.require("fs");
// @ is an alias to /src
import UserAssets from "@/components/UserAssets/index.vue";
import userDetailOption from "@/components/UserAssets/Detail/Option/index.vue"

export default {
    name: "userDetail",
    components: { UserAssets, userDetailOption },
    computed: {
        userSex() {
            return (this.settings.userInfo.sex == "m"
                ? "男"
                : this.settings.userInfo.sex == "w"
                    ? "女"
                    : null) ?? "Unknow"
        }
    },
    data() {
        return {
            App_Host: "http://localhost:5999",
            appConfigPath: "",
            usernameWrite: null,
            isUserRename: false,
            isUserRenaming: false,
            isConfirmOut: false,
            timeArray: {
                internal: [],
                timeout: [],
            },
            clickable: [],
            settings: {
                appInfo: {
                    name: null,
                    version: null,
                    key: null,
                    orgnization: null,
                },
                userInfo: {
                    name: null,
                    status: null,
                    avatar: null,
                    nickname: null,
                    access: null,
                    value: null,
                    key: null,
                    sex: null,
                    exp: null,
                    introduce: null,
                    orgnization: null,
                    orPosition: null,
                    bound: null,
                },
                userSetting: {
                    alwaysOnTop: null,
                    alwaysCloseDirect: null,
                    colorSchemeMode: null,
                },
            },
        };
    },
    mounted() {
        this.$public.on("update-main-user-info-upto-app", (res) => {
            this.settings.userInfo.access = res.detail
                ? res.detail.access_status
                : false;
            this.settings.userInfo.value = res.detail ? res.detail.val : "user";
            this.settings.userInfo.orgnization = res.detail
                ? res.detail.access_team
                : null;
            this.settings.userInfo.orPosition = res.detail
                ? res.detail.access_position
                : null;
            this.settings.userInfo.key = res.info ? res.info.userKey : null;
            this.settings.userInfo.bound = res.detail ? res.detail.bound : null;
            this.settings.userInfo.name = res.info ? res.info.username : null;
            this.settings.userInfo.nickname = res.detail ? res.detail.nickname : null;
            this.settings.userInfo.avatar = res.detail ? res.detail.avatar : null;
            this.settings.userInfo.sex = res.detail ? res.detail.sex : null;
            this.settings.userInfo.exp = res.detail ? res.detail.exp : null;
            this.settings.userInfo.introduce = res.detail
                ? res.detail.introduce
                : null;
            this.$conf.updateLocalConfig(this.settings, () => {
                console.log("Local Setting update");
            });
            this.usernameWrite = res.detail ? res.detail.nickname : null;
        });
        this.$conf.getConfPromise().then((data) => {
            this.settings = data.data;
            this.appConfigPath = this.$conf.getPath();
            this.initComponent();
        });
        // 48057b0a6c1ca5400515
        // 4857b66f1127768516a0f251bcbce47c1f99bf6e
    },
    methods: {
        handleLog: function () {
            console.log('has shake');
        },
        handleUserRename: function () {
            if (this.isUserRename)
                if (this.settings.userInfo.nickname != this.usernameWrite) {
                    this.isUserRenaming = !this.isUserRenaming;
                    if (this.usernameWrite == "")
                        this.$public.emit("notice", {
                            title: "你的命名出现了一个错误",
                            msg: "昵称不能为空",
                            type: "error",
                            closefunc: () => {
                                this.isUserRenaming = !this.isUserRenaming;
                                this.isUserRename = false;
                                this.usernameWrite = this.settings.userInfo.nickname;
                                return;
                            },
                        });
                    else this.settings.userInfo.nickname = this.usernameWrite;
                    this.timeArray.timeout[0] = setTimeout(() => {
                        fs.writeFile(
                            this.appConfigPath,
                            JSON.stringify(this.settings),
                            "utf-8",
                            (err) => {
                                if (err)
                                    this.$public.emit("notice", {
                                        title: "出现了一个错误",
                                        msg: "这个错误导致你的设置无法保存" + err,
                                        type: "error",
                                        closefunc: () => {
                                            this.isUserRenaming = !this.isUserRenaming;
                                            this.isUserRename = false;
                                            return;
                                        },
                                    });
                                else if (!this.usernameWrite == "") {
                                    this.$conf
                                        .updateDBConfig(
                                            this.App_Host,
                                            "nickname",
                                            this.usernameWrite,
                                            localStorage.getItem("username")
                                        )
                                        .then(() => {
                                            this.$public.emit("notice", {
                                                title: "",
                                                msg: "重命名成功(至少在本地是成功的)",
                                                type: "success",
                                                closefunc: () => {
                                                    this.isUserRenaming = !this.isUserRenaming;
                                                    this.isUserRename = false;
                                                    return 0;
                                                },
                                            });
                                        });
                                }
                            }
                        );
                    }, 1200);
                } else this.isUserRename = false;
            else this.isUserRename = true;
        },
        handleUserBound: function () {
            if (!this.clickable[0]) {
                this.clickable[0] = !this.clickable[0];
                this.$public.emit("notice", {
                    title: "遗憾的告知",
                    msg: "这个功能暂时还没有上线，再等一阵子吧",
                    type: "info",
                    closefunc: () => {
                        this.clickable[0] = !this.clickable[0];
                    },
                });
            }
        },
        handleChangeSettingProcess: function (err) {
            if (err)
                this.$public.emit("notice", {
                    title: "保存时出现了一个错误",
                    msg: err,
                    type: "error",
                    closefunc: null,
                });
            else {
                this.initComponent();
                this.$public.emit("notice", {
                    title: "",
                    msg: "设置保存成功 正在为您启用设置",
                    type: "success",
                    closefunc: null,
                });
            }
        },
        handleChangeSettingAction: function () {
            fs.writeFile(
                this.appConfigPath,
                JSON.stringify(this.settings),
                "utf-8",
                (err) => {
                    this.handleChangeSettingProcess(err);
                }
            );
        },
        handleSignOut: function () {
            this.$public.emit("clear-user-sign-status");
            this.isConfirmOut = false
        },
        initComponent: function () {
            this.usernameWrite = this.settings.userInfo.nickname;
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
