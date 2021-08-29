'use strict'
const svgCaptcha = require('svg-captcha')
const BaseController = require('./base')
const path = require('path')
const fse = require('fs-extra')
const { dir } = require('console')

class UtilController extends BaseController {
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
  async sendEmail() {
    const { ctx } = this
    const { email } = ctx.query
    let code = Math.random().toString().slice(2, 8)
    ctx.session.emailCode = code
    console.log('邮箱验证码：', code)

    const subject = "今天的你看起来真可爱呀~~~"
    const text = '***验证码***'
    const html = `<h2>发给亲爱的老婆：</h2><p style="color: red;">你敢点击这个链接嘛？<a href="www.baidu.com">${code}</a></p>`
    const hasSend = await this.service.tools.sendCode(email, subject, text, html)
    if (hasSend) {
      this.message('发送验证码成功！')
    } else {
      this.error('发送过程出现错误')
    }
  }
  async uploadFile() {
    const { ctx } = this
    const file = ctx.request.files[0]
    const { name, hash } = ctx.request.body
    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)
    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath)
    }
    fse.move(file.filepath, `${chunkPath}/${name}`)
    this.message('切片上传成功')
  }
  async mergeFile() {
    const { hash, size, ext } = this.ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    await this.ctx.service.tools.mergeFile(filePath, hash, size)
    this.success({
      url: `/public/${hash}.${ext}`
    })
  }
  async checkFile() {
    const { ctx } = this
    const { hash, ext } = ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    let uploaded = false
    let uploadList = []
    if (fse.existsSync(filePath)) {
      // 文件存在
      uploaded = true
    } else {
      uploadList = await this.getUploadList(path.resolve(this.config.UPLOAD_DIR, hash))
    }
    this.success({
      uploadList,
      uploaded
    })
  }
  async getUploadList(dirPath) {
    return fse.existsSync(dirPath) ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.') : []
  }
}

module.exports = UtilController
