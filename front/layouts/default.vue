<template>
  <el-container>
    <el-header>
      <el-menu mode="horizontal" :default-active="activeIndex">
        <el-menu-item index="1" v-if="userInfo.id">
          <nuxt-link to="/">首页</nuxt-link>
        </el-menu-item>
        <el-menu-item index="2" v-if="userInfo.id">
          <a>小王仔</a>
        </el-menu-item>
        <el-menu-item index="3" v-if="userInfo.id">
          <nuxt-link to="/editor/new">写文章</nuxt-link>
        </el-menu-item>
        <el-menu-item v-if="!userInfo.id">
          <a>注册</a>
        </el-menu-item>
        <el-menu-item v-if="!userInfo.id">
          <a>登录</a>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
    <el-footer></el-footer>
  </el-container>
  <!-- <nuxt /> -->
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '1'
    }
  },
  mounted() {
    this.getUserInfo()
    console.log(this.userInfo, '----')
  },
  computed: {
    userInfo() {
      return this.$store.state.user
    }
  },
  methods: {
    async getUserInfo() {
      const token = localStorage.getItem('token')
      if (token) {
        this.$store.dispatch('user/detail')
      }
    },
  }
}
</script>
<style lang="less">
  
</style>