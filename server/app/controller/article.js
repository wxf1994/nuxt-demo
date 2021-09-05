const BaseController = require('./base')

class ArticleController extends BaseController {
  async index() {
    const { ctx } = this
    let ret = await ctx.model.Article.find().populate('author').sort({createdAt: -1})
    if (!ret.length) {
      ret = await ctx.model.Article.insertMany([{
        title: '暗影岛01',
        article: '这是一本可以洗涤人类心灵的一本书',
        article_html: '<ul><li>超级啊的</li><li>duel了2姐姐的房间</li></ul>',
        views: 2,
        like: 3,
        author: {
          avator: "/user.png",
          createdAt: "2021-08-08T14:27:16.353Z",
          email: "15895539954@163.com",
          nickname: "小王",
          updatedAt: "2021-08-08T14:27:16.353Z",
          _id: "610fe9c4f4c09b10f889a4c9"
        }
      }, {
        title: '人性的弱点',
        article: '这是一本可以洗涤人类心灵的一本书',
        article_html: '<ul><li>超棒</li><li>读了2便还想读</li></ul>',
        views: 50,
        like: 100,
        author: {
          avator: "/user.png",
          createdAt: "2021-08-08T15:30:16.353Z",
          email: "15895539954@163.com",
          nickname: "小赵",
          updatedAt: "2021-08-08T14:27:16.353Z",
          _id: "610fe9c4f4c09b10f889a4c9"
        }
      }, {
        title: '如果时间可以倒流',
        article: '阿斯顿JFK',
        article_html: '<ul><li>超级啊的</li><li>duel了2姐姐的房间</li></ul>',
        views: 2,
        like: 3,
        author: {
          avator: "/user.png",
          createdAt: "2021-08-08T10:25:16.353Z",
          email: "15895539954@163.com",
          nickname: "小王",
          updatedAt: "2021-08-08T14:27:16.353Z",
          _id: "610fe9c4f4c09b10f889a4c9"
        }
      }])
    }
    this.success(ret)
  }
}

module.exports = ArticleController