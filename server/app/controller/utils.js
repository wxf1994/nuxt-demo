'use strict'
const svgCaptcha = require('svg-captcha')
const Controller = require('egg').Controller

class UtilController extends Controller {
  async index() {
    const { ctx } = this
    const captcha = svgCaptcha.create()
    ctx.body = captcha + 'captcha'
  }
}

module.exports = UtilController
