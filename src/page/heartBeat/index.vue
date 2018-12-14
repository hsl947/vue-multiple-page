<template>
  <div class="main">heartBeat</div>
</template>

<script>
import "@/assets/css/user.css";

export default {
  data() {
    return {};
  },
  components: {},
  mounted() {
  	//连续点击2次退出
    this.$dbExit();
  },
  methods: {},
  watch: {}
};
</script>

<style lang="less">
</style>
