<template>
  <div class="leetcode">
    <QuestionList />
    <QuestionController />
    <QuestionContainer :question="leetQuestion" />
    <QuestionTable />
  </div>
</template>

<script>
import QuestionList from "@/components/Leetcode/List/index.vue";
import QuestionController from "@/components/Leetcode/Controller/index.vue";
import QuestionContainer from "@/components/Leetcode/Container/index.vue";
import QuestionTable from "@/components/Leetcode/Table/index.vue";

export default {
  name: "LeetCode",
  components: {
    QuestionList,
    QuestionController,
    QuestionContainer,
    QuestionTable,
  },
  data() {
    return {
      leetQuestion: null,
    };
  },
  methods: {},
};
</script>

<style scoped lang="postcss">
.leetcode {
  @apply w-full h-full
  max-w-5xl;
}
</style>