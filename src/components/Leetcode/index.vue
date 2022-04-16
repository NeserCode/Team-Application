<template>
  <div class="leetcode">
    <QuestionList />
    <QuestionController />
    <QuestionContainer :question="leetQuestion" />
  </div>
</template>

<script>
import QuestionList from "@/components/Leetcode/QuestionList.vue";
import QuestionController from "@/components/Leetcode/QuestionController.vue";
import QuestionContainer from "@/components/Leetcode/QuestionContainer.vue";

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