<template>
    <div class="user" :class="{ center: center }">
        <el-badge :is-dot="false">
            <el-popover placement="bottom" :width="400" trigger="manual" :visible="popoverSwitch">
                <template #reference>
                    <img
                        @click="handleShowPopover"
                        :ondragstart="keepDragPicture"
                        :src="userImage"
                        :class="{ Round: isUserImageRound }"
                    />
                </template>
                <img
                    class="preImage"
                    :src="inputSrc"
                    :ondragstart="keepDragPicture"
                    v-show="isImageLoaded && isSrcVaild"
                />
                <div class="preImageLog" v-show="inputSrc.length > 1">
                    <i class="el-icon-loading" v-show="!isImageLoaded"></i>
                    <span v-show="!isImageLoaded">正在加载</span>
                    <span v-show="!isSrcVaild && isImageLoaded">请检查输入的图片链接是否有效</span>
                </div>
                <el-input
                    maxlength="120"
                    size="medium"
                    @input="handleConfirmSrc"
                    placeholder="输入图片直链"
                    show-word-limit
                    v-model="inputSrc"
                ></el-input>
                <div class="preImageBtnGroup">
                    <el-button type="primary" @click="handleShowPopover">取消修改</el-button>
                    <el-button
                        type="success"
                        @click="AccessChangeAvatar"
                        :disabled="!isSrcVaild"
                    >确定修改</el-button>
                </div>
            </el-popover>
        </el-badge>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
    name: "User",
    props: {
        isUserImageRound: {
            type: Boolean,
            default: true,
        },
        center: Boolean,
    },
    data() {
        return {
            userImage: null,
            App_Host: "http://localhost:5999",
            inputSrc: "",
            popoverSwitch: false,
            isSrcVaild: false,
            isImageLoaded: false,
            timeCounter: [],
            clickable: true,
        };
    },
    mounted() {
        this.$public.on("app-mounted", (setting) => {
            this.userImage =
                setting.userInfo.avatar ??
                "https://github.githubassets.com/favicons/favicon.svg";
            localStorage.setItem("avatar", this.userImage);
        });
        this.$public.on("update-main-user-info-upto-app", (data) => {
            this.userImage =
                data.detail.avatar ??
                "https://github.githubassets.com/favicons/favicon.svg";
            localStorage.setItem("avatar", this.userImage);
        });
    },
    activated() {
        this.userImage = localStorage.getItem("avatar");
        console.log(this.userImage);
    },
    methods: {
        keepDragPicture: () => false,
        handleConfirmSrc: function () {
            if (this.center) {
                this.isImageLoaded = false;
                clearTimeout(this.timeCounter[1]);
                this.timeCounter[1] = setTimeout(() => {
                    this.handleImagePromise(this.inputSrc).then((data) => {
                        this.isImageLoaded = true;
                        this.isSrcVaild = data.type == "load" ? true : false;
                    });
                }, 800);
            }
        },
        handleShowPopover: function () {
            this.timeCounter[0] = setTimeout(() => {
                this.clickable = true;
            }, 500);
            if (this.center && this.clickable)
                this.popoverSwitch = !this.popoverSwitch;
            else return false;

            this.clickable = false;
        },
        handleImagePromise: function (imgurl) {
            return new Promise(function (resolve) {
                var ImgObj = new Image();
                ImgObj.src = imgurl;
                ImgObj.onerror = function (err) {
                    resolve(err);
                };
                ImgObj.onload = function (res) {
                    resolve(res);
                };
            });
        },
        AccessChangeAvatar: function () {
            this.$conf
                .updateDBConfig(
                    this.App_Host,
                    "avatar",
                    this.inputSrc,
                    localStorage.getItem("username")
                )
                .then(() => {
                    this.handleShowPopover();
                    this.userImage = this.inputSrc;
                });
        },
    },
};
</script>

<style scoped>
.user {
    @apply w-12 h-12 p-2 fixed right-2 transform -translate-y-2;
}
.user img.Round {
    @apply rounded-full border border-gray-400;
}
.user.center {
    @apply relative right-0 text-center w-full h-28 transform-none;
}
.user.center img {
    @apply text-center w-24 h-24;
}
.preImage {
    @apply w-40 block mx-auto mb-4;
}
.preImageBtnGroup {
    @apply block mx-auto transform translate-x-1/4 mt-6 mb-2;
}
.preImageLog {
    @apply text-center my-6 text-base;
}
.el-input {
    @apply pr-14;
}
</style>
