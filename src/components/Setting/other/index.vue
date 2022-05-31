<template>
  <div class="otherSetting">
    <SettingOption
      opTitle="代码编辑器JavaScript集成"
      opType="switch"
      opTip="在编辑器中按下 Ctrl 键以自动完成词法提示"
      :opDisabled="isDisabled"
      :opBindValue="true"
    />
    <SettingOption
      opTitle="网易云音乐集成"
      opType="switch"
      opTip="目前只支持集成曲名和作者 使用方法: 运行最新版本网易云音乐即可在切换歌曲时获取最新的播放信息"
      :opDisabled="isDisabled"
      :opBindValue="true"
    />
  </div>
</template>

<script>
import SettingOption from "@/components/Setting/option/index.vue";

export default {
  name: "OtherSetting",
  components: { SettingOption },
  data() {
    return {
      isDisabled: true,
    };
  },
  mounted() {},
  beforeMount() {},
  methods: {},
};
</script>

<style scoped lang="postcss">
.otherSetting {
  @apply py-8;
}

@media (prefers-color-scheme: dark) {
}

@media (prefers-color-scheme: light) {
}
</style>