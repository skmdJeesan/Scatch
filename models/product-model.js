const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  discount: Number,
  image: {type: String, default: 'default.png'},
  bgcolor: String,
  panelcolor: String,
  textcolor: String,
})

module.exports = mongoose.model("product", productSchema)