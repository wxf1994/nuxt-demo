'use strict'
const svgCaptcha = require('svg-captcha')
const Controller = require('egg').Controller

class UtilController extends Controller {
  async index() {
    const { ctx } = this
    const captcha = svgCaptcha.create({
      fontSize: 40,
      size: 4,
      noise: 3,
      background: '#cc9966',
      color: true,
      width: 100,
      height: 40
    })
    console.log('captcha=>', captcha.text)
    ctx.session.captcha = captcha.text
    ctx.response.type = 'image/svg+xml'
    ctx.body = captcha.data
  }
}

module.exports = UtilController
