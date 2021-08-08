<template>
  <div class="wrap-container">
    <el-form label-width="100px" :model="form" :rules="rules" class="form-container" ref="registerForm">
      <div class="title-container">
        注册
      </div>
      <el-form-item prop="email" label="用户名">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="nickname" label="昵称">
        <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" label="验证码" class="captcha-container">
        <div class="captcha">
          <img @click="updateUrl" :src="captchaUrl" alt="">
        </div>
        <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input type="password" v-model="form.repassword" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="handleReigister">注册</el-button>
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
      form: {
        email: '15895539954@163.com',
        nickname: '小王',
        captcha: '',
        password: '200572',
        repassword: '200572',
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
        nickname: [{ required: true, message: '昵称不能为空' }],
        password: [{ required: true, pattern: /^[\d\w_-]{6,12}$/g, message: '请输入6~12位密码'}],
        repassword: [{ required: true, message: '请再次输入密码'}, {
          validator: (rule, value, callback) => {
            if (value !== this.form.password) {
              return callback('两次密码输入不一致')
            }
            return callback()
          }
        }]
      }
    }
  },
  methods: {
    updateUrl() {
      this.captchaUrl = '/api/captcha?_t=' + Date.now()
    },
    handleReigister() {
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          let obj = {
            email: this.form.email,
            nickname: this.form.nickname,
            captcha: this.form.captcha,
            password: md5(this.form.password),
          }
          const ret = await this.$http.post('/user/register', obj)
          if (ret.code === 0) {
            this.$alert('注册成功', '去登陆', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.push('/login')
              }
            })
          } else {
            this.$message.error(ret.message)
          }
        } else {
          this.$message.error('输入不合法')
        }
      })
    }
  }
}
</script>