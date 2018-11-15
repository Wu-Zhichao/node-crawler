const mongoose = require('mongoose')
// 创建模型
const goodsSchema = new mongoose.Schema({
  'imgSrc': String,
  'price': Number,
  'describe': String
})
module.exports = mongoose.model('Goods', goodsSchema)
