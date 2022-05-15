<template>
  <div class="UserArea">
    <Sign v-show="!isUserLogined" />
    <userDetail v-show="isUserLogined" />
  </div>
</template>

<script>
import userDetail from "@/components/UserDetail/index.vue";
import Sign from "@/components/Sign/index.vue";

export default {
  name: "Setting",
  beforeCreate() {
    this.$public.on("update-main-user-info-upto-app", () => {
      this.isUserLogined = true;
    });
    this.$public.on("clear-user-sign-status", () => {
      localStorage.removeItem("userKey");
      localStorage.removeItem("username");
      localStorage.removeItem("checkKey");
      localStorage.removeItem("avatar");
      this.isUserLogined = false;
    });
  },
  mounted() {
    this.isUserLogined =
      localStorage.getItem("checkKey") == (undefined || null) ? false : true;
  },
  components: {
    Sign,
    userDetail,
  },
  data() {
    return {
      isUserLogined: false,
    };
  },
  methods: {},
};
</script>

<style scoped lang="postcss">
.UserArea {
  @apply w-full h-auto;
}
</style>
