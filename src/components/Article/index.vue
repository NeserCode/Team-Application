<template>
  <div class="article">
    <div class="topContainer">
      <Avatar class="avatar" :isDot="false" :image="author.avatar" />
      <div class="head">
        <div class="namespace">
          <span class="name">{{ author.name }}</span>
          <span class="access" v-show="author.access.status">
            <span class="organization">{{ author.access.organization }}</span
            >&nbsp;·
            <span class="position">{{ author.access.position }}</span>
          </span>
        </div>
        <span class="introduce">{{ author.introduce }}</span>
      </div>
    </div>
    <div class="mainContainer">
      <div class="content">
        <span class="contentText">
          {{ body.content }}
        </span>
        <span class="detail">
          <span class="time">{{ detail.time }}</span>
          <span class="ip" title="IP地址">{{ detail.ip }}</span>
        </span>
        <el-divider>Article End</el-divider>
        <div class="other">
          <span class="likes" @click="handleLike">
            <el-icon :size="24" v-show="!isLike"><Star /></el-icon>
            <el-icon :size="24" v-show="isLike"><StarFilled /></el-icon>
            &nbsp;
            <span class="sum">{{ likes }}</span>
          </span>
          <span class="comment" @click="toggleCommentShown">
            <el-icon :size="24"><Comment /></el-icon>
            &nbsp;
            <span class="sum">{{ comments }}</span>
          </span>
        </div>
        <ArticleComment v-show="isShow.comment" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Avatar from "@/components/UserAssets/Avatar/index.vue";
import ArticleComment from "@/components/Article/Comment/index.vue";

export default {
  name: "Article",
  components: { Avatar, ArticleComment },
  props: {
    author: {
      type: Object,
      default: () => ({
        name: "Alex Blance",
        avatar: "http://localhost/Images/q.jpg",
        access: {
          status: true,
          organization: "NumberOne Base",
          position: "后端负责人",
        },
        introduce: "一个兴趣使然的程序员",
      }),
    },
    body: {
      type: Object,
      default: () => ({
        content:
          "\t理念论是柏拉图哲学的核心，理念世界和现实世界的关系怎样，是柏拉图毕生探索的重要问题。\n\t在《理想国》中，他把不变的理念看作唯一真实的原本，把变化的事物看作理念的摹本和消极的产物。为了说明这一观点，他提出两个著名的比喻：一个是床的比喻。他说理念的床是唯一的真实的床，是工匠制造的床的摹本，而艺术家画出来的床则是摹本的摹本。另一个是洞穴的比喻。他把人们在现实世界中的生活比作在阴暗洞穴里的居留。洞穴中的人们戴着镣铐，背向出口，只能勉强看到被火光投射在洞壁上的东西的模糊的影子。在柏拉图看来，感性实物只不过是变幻不定的影子，人们必须摆脱这些影子，走出洞穴。这两个比喻说明，“永久不变”的理念是第一性的，生灭变化的事物则是第二性的。这是典型的客观唯心主义理论。",
      }),
    },
    detail: {
      type: Object,
      default: () => ({
        ip: "210.87.90.1",
        time: new Date().toDateString(),
        likes: {
          sum: 231,
          all: [],
        },
        islike: false,
        comments: {
          sum: 18,
          all: [],
        },
      }),
    },
  },
  mounted() {
    this.initLikes();
  },
  data() {
    return {
      isLike: false,
      likes: NaN,
      comments: NaN,
      isShow: {
        comment: false,
      },
    };
  },
  methods: {
    initLikes: function () {
      this.isLike = this.detail.islike;
      this.likes = this.detail.likes.sum;
      this.comments = this.detail.comments.sum;
    },
    handleLike: function () {
      this.isLike = !this.isLike;
      if (this.isLike) this.likes++;
      else this.likes--;
    },
    toggleCommentShown: function () {
      this.isShow.comment = !this.isShow.comment;
    },
  },
};
</script>

<style scoped lang="postcss">
.article {
  @apply w-full h-full p-2 py-6;
}
.topContainer {
  @apply w-full px-2 my-2 h-16;
}
.avatar {
  @apply w-16 h-16 float-left p-1;
}
.head {
  @apply h-16 px-2 py-1 float-left font-normal;
  width: calc(100% - 4rem);
}
.namespace {
  @apply leading-4;
}
.namespace .name {
  @apply text-xl font-semibold;
}
.namespace .access {
  @apply text-xs inline-block ml-2 opacity-90;
}
.introduce {
  @apply inline-block w-full text-sm opacity-75 overflow-ellipsis whitespace-nowrap overflow-hidden leading-6;
}

.content {
  @apply px-4 py-2 whitespace-pre-wrap select-none;
}
.contentText {
  @apply opacity-90 select-text;
}
.detail {
  @apply inline-block w-full leading-8 text-xs text-right;
}
.ip {
  @apply inline-block mx-2 font-bold opacity-60;
}

.other {
  @apply flex justify-center;
}
.other .likes,
.other .comment {
  @apply flex w-1/3 float-left font-bold justify-center;
}

@media (prefers-color-scheme: dark) {
  .article {
    @apply bg-gray-900;
  }
  :deep(.el-divider) {
    @apply opacity-60;
  }
  :deep(.el-divider__text) {
    @apply bg-gray-900 text-gray-200;
  }
}

@media (prefers-color-scheme: light) {
  .article {
    @apply bg-white;
  }
  :deep(.el-divider__text) {
    @apply bg-white text-gray-700;
  }
}
</style>
