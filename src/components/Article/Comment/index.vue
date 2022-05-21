<template>
  <div class="comment">
    <div class="mainContainer">
      <div class="content" v-for="item in content" :key="item.id">
        <div class="headContainer">
          <Avatar class="avatar" :isDot="false" :image="item.author.avatar" />
          <div class="head">
            <div class="namespace">
              <span class="name">{{ item.author.name }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
          </div>
        </div>
        <span class="commentText">
          {{ item.text }}
        </span>

        <div class="content" v-for="inner in item.response" :key="inner.id">
          <div class="headContainer">
            <Avatar
              class="avatar"
              :isDot="false"
              :image="inner.author.avatar"
            />
            <div class="head">
              <div class="namespace">
                <span class="name">{{ inner.author.name }}</span>
                <span class="time">{{ inner.time }}</span>
              </div>
            </div>
            <span class="reply">回复</span>
            <div class="head">
              <div class="namespace">
                <span class="name">{{ item.author.name }}</span>
              </div>
            </div>
          </div>
          <span class="commentText">
            {{ inner.text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/UserAssets/Avatar/index.vue";

export default {
  name: "Comment",
  components: { Avatar },
  data() {
    return {
      content: [
        {
          id: "123541",
          author: {
            avatar: "http://localhost/Images/q2.jpg",
            name: "Linda Firole",
          },
          text: "I mean, are u understand these?",
          time: new Date().toLocaleString(),
          response: [
            {
              id: "123769",
              author: {
                avatar: "http://localhost/Images/q.jpg",
                name: "Veloci Clone",
              },
              time: new Date().toLocaleString(),
              text: "Got it.",
            },
          ],
        },
        {
          id: "123581",
          author: {
            avatar: "http://localhost/Images/q.jpg",
            name: "Veloci Clone",
          },
          text: "很有意境。",
          time: new Date().toLocaleString(),
          response: [
            {
              id: "143543",
              author: {
                avatar: "http://localhost/Images/q.jpg",
                name: "Veloci Clone",
              },
              time: new Date().toLocaleString(),
              text: "自己把自己抬一波。",
            },
            {
              id: "515323",
              author: {
                avatar: "http://localhost/Images/q.jpg",
                name: "Veloci Clone",
              },
              time: new Date().toLocaleString(),
              text: "自己再把自己抬一波。",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="postcss" scoped>
.comment {
  @apply w-full h-auto;
}
.mainContainer {
  @apply w-full h-auto;
}

.content {
  @apply inline-block w-full px-6 py-2;
}
.headContainer {
  @apply flex h-16 w-full py-2 items-center;
}

.avatar {
  @apply h-12 w-12;
}
.namespace {
  @apply flex flex-col px-2;
}
.namespace .name {
  @apply font-semibold;
}
.namespace .time {
  @apply font-medium opacity-60 text-xs;
}
.commentText {
  @apply pl-6;
}

.reply {
  @apply inline-block px-4 text-xs;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>>