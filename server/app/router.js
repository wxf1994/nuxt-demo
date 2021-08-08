'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  // 验证码
  router.get('/captcha', controller.utils.index)
  // user相关
  router.group({ name: 'user', prefix: '/user'}, router => {
    const { login, register, info, verify } = controller.user
    router.post('/login', login)
    router.post('/register', register)
    router.get('/verify', verify)
    router.get('/info', info)
  })
}
