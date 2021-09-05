<template>
  <!-- <Tutorial/> -->
  <div class="container"></div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.getArticle()
  },
  methods: {
    async getArticle() {
      let ret = await this.$http.get('/article')
      console.log(ret)
    },
  }
}
</script>
<style lang="less">
  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
