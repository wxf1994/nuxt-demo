const md5 = require('md5')
const BaseController = require('./base')
const jwt = require('jsonwebtoken')
const HashSolt = ':kkbsdk@good1238'
class UserController extends BaseController {
  constructor(props) {
    super(props)
    this.creatRule = {
      email: {type: 'email'},
      nickname: {type: 'string'},
      password: {type: 'string'},
      captcha: {type: 'string'}   
    }
  }
  async login() {
    const { ctx, app } = this
    const { email, password, captcha } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) return this.error('验证码错误')
    const ret = await ctx.model.Sekk.findOne({
      email,
      password: md5(password + HashSolt)
    })
    if (!ret) return this.error('用户名密码不正确')
    const token = jwt.sign({
      _id: ret._id,
      email
    }, app.config.jwt.secret, {
      expiresIn: '1h'
    })
    this.success({
      token,
      email,
      nickname: ret.nickname
    })
  }
  async register() {
    const { ctx, creatRule } = this
    try {
      ctx.validate(creatRule)
    } catch(e) {
      return this.error('参数校验失败', -1, e.errors)
    }
    const { email, nickname, password, captcha } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) return this.error('验证码错误')
    if (await this.checkEmail(email)) {
      // 邮箱存在了
      this.error('邮箱重复啦')
      console.log('7777')
    } else {
      // 入库
      const ret = await ctx.model.Sekk.create({
        email,
        nickname,
        password: md5(password + HashSolt)
      })
      console.log(ret, '0000')
      if (ret._id) {
        this.message('注册成功')
      }
    }
    // this.success({
    //   code: 0,
    //   name: 'ok!!!'
    // })
  }
  async checkEmail(email) {
    const user = await this.ctx.model.Sekk.findOne({email})
    return user
  }
  async info() {

  }
  async verify() {
    // 验证用户名是否存在
  }
}

module.exports = UserController