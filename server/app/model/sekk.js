module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const userSchema = new Schema({
    __v: {type: Number, select: false},
    email: {type: String, required: true},
    nickname: {type: String, required: true},
    password: {type: String, required: true, select: false},
    avator: {type: String, required: false, default: '/user.png'}
  }, {timestamps: true})
  return mongoose.model('Sekk', userSchema)
}