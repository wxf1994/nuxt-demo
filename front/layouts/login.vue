<template>
  <div>
    <!-- <div>导航</div> -->
    <nuxt />
    <!-- <div>底部信息</div> -->
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less">
  .wrap-container {
    width: 100%;
    height: 100%;
    .title-container {
      text-align: center;
      color: #409EFF;
      font-size: 20px;
      margin-bottom: 20px;
    }
    .form-container {
      width: 520px;
      height: auto;
      padding: 100px 0;
      margin: 0 auto;
      overflow: hidden;
    }
    .captcha-container {
      position: relative;
      width: 340px;
      .captcha {
        position: absolute;
        right: -110px;
      }
    }
    
  }
</style>