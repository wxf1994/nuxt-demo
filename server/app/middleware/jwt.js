const jwt = require('jsonwebtoken')
module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: -666,
        message: '用户未登录'
      }
      return
    }
    const token = ctx.request.header.authorization.replace('Bearer ', '')
    try {
      const ret = await jwt.verify(token, app.config.jwt.secret)
      console.log(ret)
      ctx.state.user_id = ret._id
      ctx.state.email = ret.email
      await next()
    } catch(e) {
      console.log(e)
      if (e.name == 'TokenExpiredError') {
        ctx.body = {
          code: -666,
          message: '登录过期'
        }
      } else {
        ctx.body = {
          code: -1,
          message: '用户信息出错'
        }
      }
    }
  }
}