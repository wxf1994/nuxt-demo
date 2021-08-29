const { Service } = require('egg')
const path = require('path')
const fse = require('fs-extra')
const nodemailer = require('nodemailer')

const userEmail = '15895539954@163.com'
const transporter = nodemailer.createTransport({
  service: '163',
  secure: false,
  auth: {
    user: userEmail,
    // pass: 'ewcgpamwvdszbeha'
    pass: 'SRXCRFOLXCEOBYIM'
  }
})

class SendCodeService extends Service {
  async sendCode(email, subject, text, html) {
    const emailOptions = {
      from: userEmail,
      to: email,
      subject,
      text,
      html,
      cc: userEmail
    }
    try {
      await transporter.sendMail(emailOptions)
      return true
    } catch(e) {
      console.log(e)
      return false
    }
  }
  async mergeFile(filePath, fileHash, fileSize) {
    const chunkDir = path.resolve(this.config.UPLOAD_DIR, fileHash) //当前文件夹
    let chunks = await fse.readdir(chunkDir)
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    chunks = chunks.map(cp => path.resolve(chunkDir, cp))
    await this.mergeChunks(chunks, filePath, fileSize)
  }
  async mergeChunks(chunks, filePath, size) {
    const pipStream = (filePath, writeStream) => new Promise((resolve) => {
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        // fse.unlinkSync(filePath)
        resolve()
      })
      readStream.pipe(writeStream)
    })
    await Promise.all(
      chunks.map((chunk, index) => {
        pipStream(chunk, fse.createWriteStream(filePath, {
          start: Math.floor(index * size),
          // end: Math.floor((index + 1) * size)
        }))
      })
    )
  }
}

module.exports = SendCodeService