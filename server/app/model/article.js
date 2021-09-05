module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const articleSchema = new Schema({
    _v: { type: Number, select: false },
    title: { type: String, required: true},
    article: { type: String, required: true, select: false},
    article_html: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'Sekk', required: true},
    title: { type: String, required: true},
    views: { type: Number, required: true, default: 1},
    like: { type: Number, required: true, default: 1},
  }, {timestamps: true})
  return mongoose.model('Article', articleSchema)
}