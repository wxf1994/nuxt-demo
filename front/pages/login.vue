<template>
  <div class="wrap-container">
    <el-form label-width="100px" :model="form" :rules="rules" class="form-container" ref="loginForm">
      <div class="title-container">
        登录
      </div>
      <el-form-item prop="email" label="用户名">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" label="验证码" class="captcha-container">
        <div class="captcha">
          <img @click="updateUrl" :src="captchaUrl" alt="">
        </div>
        <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="emailCode" label="邮箱验证码" class="captcha-container">
        <div class="captcha">
          <el-button type="primary" @click="sendEmail" :disabled="send.timer > 0">{{sendText}}</el-button>
        </div>
        <el-input v-model="form.emailCode" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import md5 from 'md5'
export default {
  layout: 'login',
  data() {
    return {
      send: {
        timer: 0
      },
      form: {
        email: '15895539954@163.com',
        captcha: '',
        password: '200572',
        emailCode: '',
      },
      captchaUrl: '/api/captcha?_t=' + Date.now(),
      rules: {
        email: [{
          required: true,
          message: '请输入邮箱'
        }, {
          type: 'email',
          message: '邮箱格式不正确'
        }],
        captcha: [{ required: true, message: '请输入验证码' }],
        emailCode: [{ required: true, message: '请输入邮箱验证码' }],
        password: [{ required: true, pattern: /^[\d\w_-]{6,12}$/g, message: '请输入6~12位密码'}],
      }
    }
  },
  computed: {
    sendText() {
      if (this.send.timer === 0) {
        return '发送'
      }
      return `${this.send.timer}秒后发送`
    }
  },
  methods: {
    updateUrl() {
      this.captchaUrl = '/api/captcha?_t=' + Date.now()
    },
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          let obj = {
            email: this.form.email,
            captcha: this.form.captcha,
            password: md5(this.form.password),
            emailCode: this.form.emailCode
          }
          const ret = await this.$http.post('/user/login', obj)
          if (ret.code === 0) {
           this.$message.success('登录成功')
           localStorage.setItem('token', ret.data.token)
           setTimeout(() => {
             this.$router.push('/')
           }, 500)
          } else {
            this.$message.error(ret.message)
          }
        } else {
          this.$message.error('输入不合法')
        }
      })
    },
    async sendEmail() {
      // 发送邮件
      await this.$http.get('/sendCode?email=' + this.form.email)
      this.send.timer = 60
      this.timer = setInterval(() => {
        this.send.timer -= 1
        if (this.send.timer === 0) clearInterval(this.timer)
      }, 1000);
    }
  }
}
</script>