const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  fullname: {type: String, minLength: 3, trim: true},
  email: String,
  password: String,
  contact: Number,
  isAdmin: Boolean,
  profilepic: {type: String, default: 'default.png'},
  cart: {type: Array, default: []},
  orders: {type: Array, default: []}
})

module.exports = mongoose.model("user", userSchema)