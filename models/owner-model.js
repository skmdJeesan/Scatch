const mongoose = require('mongoose')

const ownerSchema = mongoose.Schema({
  fullname: {type: String, minLength: 3, trim: true},
  email: String,
  password: String,
  products: {type: Array, default: []},
  profilepic: {type: String, default: 'default.png'},
  gstin: String
})

module.exports = mongoose.model("owner", ownerSchema)