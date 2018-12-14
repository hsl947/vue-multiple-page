<template>
  <div class="main" ref="main">
  	<div class="inner" @click="jumpUrl">seek (戳一下这里) </div>
  </div>
</template>

<script>
import "@/assets/css/user.css";

export default {
  data() {
    return {};
  },
  components: {},
  mounted() {
  	this.$refs.main.style.paddingTop = plus.navigator.getStatusbarHeight()+'px';
  },
  methods: {
  	jumpUrl() {
			let pageParams = {
				url: './innerPage.index.html',
	  		id: 'innerPage',
	  		title: '内页'
	  	};
			this.$view.openWebview(pageParams);
  	}
  },
  watch: {}
};
</script>

<style lang="less">
	.main{
		padding-bottom: 0;
	}
	.inner{
		padding: 3rem 0;
		background: #E5E5E5
	}
</style>
