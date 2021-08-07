<template>
  <div class="form-login" :rules="rules">
    <el-form>
      <el-form-item prop="email">
        <span class="el-icon-mobile"></span>
        <el-input placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="el-icon-lock"></span>
        <el-input placeholder="密码"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
 layout: 'login',
 data() {
   return {
     rules: []
   }
 },
 methods: {

 }
}
</script>
<style lang="less" scoped>
  .form-login {
    width: 800px;
    margin: 0 auto;
  }

</style>