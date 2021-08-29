'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  const jwt = app.middleware.jwt({app})
  router.get('/', controller.home.index)
  // 验证码
  router.get('/captcha', controller.utils.index)
  router.get('/sendCode', controller.utils.sendEmail)
  router.post('/uploadFile', controller.utils.uploadFile)
  router.post('/mergeFile', controller.utils.mergeFile)
  router.post('/checkFile', controller.utils.checkFile)
  // user相关
  router.group({ name: 'user', prefix: '/user'}, router => {
    const { login, register, info, verify } = controller.user
    router.post('/login', login)
    router.post('/register', register)
    router.get('/verify', verify)
    router.get('/info', jwt, info)
  })
}
