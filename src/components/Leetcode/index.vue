<template>
  <div class="leetcode">
    <QuestionList />
    <QuestionController />
    <QuestionContainer :question="leetQuestion" />
  </div>
</template>

<script>
import QuestionList from "@/components/Leetcode/List/index.vue";
import QuestionController from "@/components/Leetcode/Controller/index.vue";
import QuestionContainer from "@/components/Leetcode/Container/index.vue";

export default {
  name: "LeetCode",
  components: { QuestionList, QuestionController, QuestionContainer },
  data() {
    return {
      leetQuestion: null,
    };
  },
  methods: {},
};
</script>

<style>
.leetcode {
  @apply w-full h-full;
}
</style>